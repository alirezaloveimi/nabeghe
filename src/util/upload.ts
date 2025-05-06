import { supabase } from "@/lib/supabase";

export async function uploadImage(image: File, folder: string) {
  const imageUrl = `${folder}/${Date.now()}_${image.name}`;
  const buffer = Buffer.from(await image.arrayBuffer());

  const { error, data } = await supabase.storage
    .from("images")
    .upload(imageUrl, buffer, {
      contentType: image.type,
      upsert: false,
    });

  if (error) {
    console.log(error.message);
    return { message: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(imageUrl);

  return { url: publicUrl, path: data.path };
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage.from("images").remove([path]);

  if (error) {
    console.log("Failed to delete image:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
