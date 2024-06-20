import { describe, it, expect, beforeAll } from "vitest";
import { cp949ToUTF8 } from "~/util/file";
import { Buffer } from "buffer";
import { JSDOM } from "jsdom";
// Helper function to create a mock file from hex string
const hexToArrayBuffer = (hex: string): ArrayBuffer => {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return bytes.buffer;
};

beforeAll(() => {
  const { window } = new JSDOM();
  global.FileReader = window.FileReader;
  global.Blob = window.Blob;
  global.File = class extends window.Blob {
    name: string;
    lastModified: number;
    webkitRelativePath: string;
    constructor(chunks: any[], filename: string, options: any) {
      super(chunks, options);
      this.name = filename;
      this.lastModified = options.lastModified || Date.now();
      this.webkitRelativePath = "";
    }
    async text() {
      const reader = new window.FileReader();
      reader.readAsText(this);
      return new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
      });
    }
  };
});

describe("cp949ToUTF8", () => {
  it("should convert a CP949 encoded file to UTF-8", async () => {
    const cp949Hex = "BEC8B3E7C7CFBCBCBFE4"; // "안녕하세요" in cp949 encoding
    const arrayBuffer = hexToArrayBuffer(cp949Hex);
    const cp949File = new File([arrayBuffer], "cp949.txt", {
      type: "text/plain",
    });

    const result = await cp949ToUTF8(cp949File);
    const resultText = await result.text();

    expect(resultText).toBe("안녕하세요");
    expect(result.name).toBe(cp949File.name);
    expect(result.type).toBe(cp949File.type);
  });

  it("should return the same file if it is already UTF-8 encoded", async () => {
    const utf8String = "Hello, world!";
    const utf8Buffer = Buffer.from(utf8String, "utf8");

    const file = new File([utf8Buffer], "test_utf8.txt", {
      type: "text/plain",
    });

    const result = await cp949ToUTF8(file);
    const resultText = await result.text();

    expect(resultText).toBe(utf8String);
    expect(result.name).toBe(file.name);
    expect(result.type).toBe(file.type);
  });
});
