import { supabase } from "./supabase";

export async function uploadVideo(
  file: File
) {
  const fileName =
    `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("incident-videos")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("incident-videos")
    .getPublicUrl(fileName);

  return publicUrl;
}
