export function isElement(node: any): node is Element {
  return node instanceof window.Element
}
