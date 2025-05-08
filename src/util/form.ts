import { toHtml } from "hast-util-to-html";
import { deleteImage, uploadImage } from "./upload";
import { createLowlight } from "lowlight";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight();
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

type Upload = Awaited<ReturnType<typeof uploadImage>>;

export function getChangedFields<T>(original: T, updated: T) {
  const changed: Partial<typeof updated> = {};

  for (const key in updated) {
    if (updated[key] != original[key]) {
      changed[key] = updated[key];
    }
  }

  return changed;
}

export async function processHtmlImages(
  originalHtml: string,
  newHtml: string,
  files: File[],
  folder: string
) {
  const oldImageTags = extractSrcs(originalHtml);
  const newImageTags = extractSrcs(newHtml);

  const keepImages = newImageTags.filter((src) => src.includes("supabase"));
  const blobImages = newImageTags.filter((src) => src.includes("blob"));

  let updatedHtml = newHtml;
  const uploadedSrcs: Upload[] = [];

  if (blobImages.length > 0) {
    for (const file of files) {
      uploadedSrcs.push(await uploadImage(file, folder));
    }

    let index = 0;
    updatedHtml = newHtml.replace(/src="(blob:[^"]+)"/g, () => {
      return `src="${uploadedSrcs[index++].url}"`;
    });
  }

  const removeImages = oldImageTags.filter((src) => !keepImages.includes(src));

  const cleanupPaths = removeImages
    .map((str) => extractStoragePath(str))
    .filter(Boolean) as string[];

  return { updatedHtml, cleanupPaths };
}

function extractStoragePath(srcString: string): string | null {
  const match = srcString.match(/src="([^"]+)"/);
  if (!match) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const url = match[1];

  if (url.startsWith(supabaseUrl)) {
    return url.replace(`${supabaseUrl}/storage/v1/object/public/images/`, "");
  }

  return url;
}

function extractSrcs(html: string): string[] {
  return html.match(/src="([^"]*)"/g) || [];
}

export function highlightCode(code: string, language = "js") {
  const tree = lowlight.highlight(language, code);

  const filteredChildren = tree.children.filter(
    (child) => child.type !== "doctype"
  );

  return toHtml({
    type: "element",
    tagName: "pre",
    properties: {
      className: [
        "dir-ltr",
        "bg-background",
        "border",
        "border-border",
        "rounded-xl",
        "text-foreground",
        "p-2",
        "shadow",
      ],
    },
    children: [
      {
        type: "element",
        tagName: "code",
        properties: { className: [`hljs`, `language-${language}`] },
        children: filteredChildren,
      },
    ],
  });
}

export function decodeHTMLEntities(str: string) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export async function removeImages(html: string, cover: ImageT) {
  const removeBlogImages = extractSrcs(html);

  const cleanupPaths = removeBlogImages
    .map((str) => extractStoragePath(str))
    .filter(Boolean) as string[];

  cleanupPaths.push(cover.path);

  for (const path of cleanupPaths) {
    await deleteImage(path);
  }
}
