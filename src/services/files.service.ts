import { imagekit } from "../lib/imageKit";

type UploadFileOpts = {
  buffer: Buffer;
  fileName: string;
  folder?: string;
  tags?: string[];
  isPrivateFile?: boolean;
};

export async function uploadFile({
  buffer,
  fileName,
  folder = "/uploads",
  tags,
  isPrivateFile = false,
}: UploadFileOpts) {
  const res = await imagekit.upload({
    file: buffer,
    fileName,
    folder,
    tags,
    isPrivateFile,
    useUniqueFileName: true,
  });

  return {
    url: res.url,
    fileId: res.fileId,
    name: res.name,
    width: res.width,
    height: res.height,
    size: res.size,
    thumbnailUrl: res.thumbnailUrl,
  };
}
