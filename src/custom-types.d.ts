import { SlateDescendant, SlateElement, SlateText } from "@wangeditor/editor";

declare module "@wangeditor/editor" {
  // Extend Text
  interface SlateText {
    text: string;
  }

  // Extend Element
  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }
}
