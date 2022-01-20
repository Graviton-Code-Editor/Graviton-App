import { FileFormat } from "../utils/client";
import { Tab, TextEditorTabData } from "./tab";

export default class EditorTab extends Tab {
  public path: string;
  public filename: string;

  static isCompatible(format: FileFormat): boolean {
    switch (format) {
      default:
        return true;
    }
  }

  /* eslint-disable */
  constructor(filename: string, path: string, initialContent: string) {
    super(filename);
    this.path = path;
    this.filename = filename;
  }

  public getContent(): string {
    return "";
  }

  /**
   *
   * @returns The tab's data
   *
   * @alpha
   */
  public toJson(): TextEditorTabData {
    return {
      tab_type: "TextEditor",
      path: this.path,
      filesystem: "local",
      content: this.getContent(),
      filename: this.filename,
    };
  }
}
