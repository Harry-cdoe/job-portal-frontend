// Keep this as a seam for integrating DOMPurify when rendering rich text from users.
export function safeText(input: string) {
  return input.replace(/[<>]/g, "");
}
