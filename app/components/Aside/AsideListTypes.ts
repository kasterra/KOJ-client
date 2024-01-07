interface CommonType {
  type: string;
  title: string;
  icon?: string;
}

interface ButtonElement extends CommonType {
  type: "button";
  onButtonClick: () => void;
  onIconClick?: () => void;
}

interface LinkElement extends CommonType {
  type: "link";
  link: string;
}

export type AsideElementType = ButtonElement | LinkElement;

export function isButtonElement(
  element: AsideElementType
): element is ButtonElement {
  return element.type === "button";
}

export function isLinkElement(
  element: AsideElementType
): element is LinkElement {
  return element.type === "link";
}
