import { Tab } from "./tab";

export default class EditorTab extends Tab {
  public save(): void {
    return;
  }

  static isCompatible(format: string): boolean {
    switch (format) {
      default:
        return true;
    }
  }

  /* eslint-disable */
  constructor(path: string, initialContent: string) {
    super(path);
  }
}
