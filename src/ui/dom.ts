type Child = Node | string | false | null | undefined;
type AttrValue = string | boolean | ((event: Event) => void);

export const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Readonly<Record<string, AttrValue>> = {},
  ...children: readonly Child[]
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (typeof value === 'function') element.addEventListener(name.slice(2).toLowerCase(), value);
    else if (value === true) element.setAttribute(name, '');
    else if (value !== false) element.setAttribute(name, value);
  });
  children.forEach((child) => {
    if (child) element.append(child);
  });
  return element;
};
