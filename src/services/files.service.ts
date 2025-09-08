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
    filePath: res.filePath,
    name: res.name,
    size: res.size,
    width: res.width,
    height: res.height,
    thumbnailUrl: res.thumbnailUrl,
  };
}
