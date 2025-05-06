export async function blobUrlToFile(url: string, fileName: string) {
  const res = await fetch(url);
  const blob = await res.blob();

  const mimeType = blob.type;
  return new File([blob], fileName, { type: mimeType });
}
