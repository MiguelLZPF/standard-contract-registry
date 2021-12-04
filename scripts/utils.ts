import { concat } from "@ethersproject/bytes";

export const stringToBytesFixed = async (inputString: string, length: number) => {
  const nameInBytes = Uint8Array.from(Buffer.from(inputString, "utf-8"));
  return concat([nameInBytes, new Uint8Array(length - nameInBytes.length)]);
};
