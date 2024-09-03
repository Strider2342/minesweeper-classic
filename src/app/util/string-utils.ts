export function padNumberAsString(num: number, length: number, padChar: string): string {
  if (num >= 0) {
    return String(num).padStart(length, padChar);
  }

  return  `-${String(Math.abs(num)).padStart(length - 1, padChar)}`;
}
