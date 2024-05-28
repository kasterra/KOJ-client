import { Buffer } from "buffer";
import iconv from "iconv-lite";
import isUtf8 from "isutf8";

export async function cp949ToUTF8(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const result = reader.result as ArrayBuffer;
      const buf = Buffer.from(result);
      if (isUtf8(buf)) {
        resolve(file);
      }
      const decoded = iconv.decode(buf, "cp949");
      resolve(new File([decoded], file.name, { type: file.type }));
    };

    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
  });
}
