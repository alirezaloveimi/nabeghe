"use client";
import { useRef } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { createLowlight } from "lowlight";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import { BsArrow90DegLeft, BsArrow90DegRight } from "react-icons/bs";
import {
  FaBold,
  FaImage,
  FaItalic,
  FaLink,
  FaParagraph,
  FaEraser,
  FaCode,
} from "react-icons/fa";
import { GoListOrdered } from "react-icons/go";
import { MdFormatListBulleted } from "react-icons/md";

import { EditorState } from "./form/AddNewCouresForm";
import { blobUrlToFile } from "@/util/blob";

type EditorProps = {
  error?: string[];
  label?: string;
  value: string;
  onUpdateHandler: (newValue: EditorState) => void;
};

const lowlight = createLowlight();
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export default function Editor({
  error,
  label,
  value,
  onUpdateHandler,
}: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false,
      }),
      Link.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) =>
          ctx.defaultValidate(url) && !url.startsWith("./"),
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "dir-ltr bg-background border border-border rounded-xl text-foreground",
        },
      }),
      ImageResize,
      TextStyle,
      Color,
    ],

    onCreate: (context) => {
      if (value.length > 0) {
        context.editor.commands.setContent(value);
      }
    },

    onUpdate: async ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();

      const imageNodes =
        json.content?.filter((node) => node.type === "image") ?? [];

      if (imageNodes.length === 0) {
        onUpdateHandler({ html, htmlImages: [] });
        return;
      }

      const htmlImages: File[] = [];

      for (const node of imageNodes) {
        const { src, title = "image.png" } = node.attrs as {
          src: string;
          title: string;
        };

        if (src.startsWith("blob:")) {
          const file = await blobUrlToFile(src, title);
          htmlImages.push(file);
        }
      }

      onUpdateHandler({ html, htmlImages });
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeBtn = "bg-primary text-primary-foreground";

  const selectImageHandler = () => {
    fileInputRef.current?.click();
  };

  const inseartImageInEditor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length !== 1) return;
    const selecteFile = files[0];

    editor
      ?.chain()
      .focus()
      .setImage({
        src: URL.createObjectURL(selecteFile),
        title: selecteFile.name,
      })
      .run();
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert(e);
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-muted">{label}</label>}

      <div className="bg-secondary -border-2 border-border rounded-xl px-3 [&>div]:py-3">
        <div
          id="button-group"
          className="flex-align-center gap-x-2 flex-wrap border-b border-border"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <BsArrow90DegRight />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <BsArrow90DegLeft />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? activeBtn : ""
            }
          >
            H1
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? activeBtn : ""
            }
          >
            H2
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? activeBtn : ""
            }
          >
            H3
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? activeBtn : ""}
          >
            <FaBold />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? activeBtn : ""}
          >
            <FaItalic />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? activeBtn : ""}
          >
            <FaParagraph />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? activeBtn : ""}
          >
            <MdFormatListBulleted />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? activeBtn : ""}
          >
            <GoListOrdered />
          </button>

          <button
            type="button"
            onClick={setLink}
            className={editor.isActive("link") ? activeBtn : ""}
          >
            <FaLink />
          </button>

          <button type="button">
            <input
              type="color"
              className="size-6 cursor-pointer"
              value={editor.getAttributes("textStyle").color || "#000000"}
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
            />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            <FaEraser />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <FaCode className="text-xl" />
          </button>

          <button type="button" onClick={selectImageHandler}>
            <FaImage />
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={inseartImageInEditor}
            />
          </button>
        </div>

        <EditorContent
          className="prose prose-lg dark:prose-invert max-w-none [&>div]:outline-none h-60 overflow-y-auto"
          editor={editor}
        />
      </div>

      {error && <p className="text-xs font-bold text-red-500">{error[0]}</p>}
    </div>
  );
}
