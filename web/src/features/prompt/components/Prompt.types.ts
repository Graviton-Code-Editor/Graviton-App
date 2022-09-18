import { TranslatedText } from "types";

export interface PromptOptionArgs {
  option: Option;
  closePrompt: () => void;
  selectedOption: number;
  indexOption: number;
}

export interface OptionUtils {
  closePrompt: () => void;
}

export interface Option {
  label: TranslatedText;
  onSelected: (utils: OptionUtils) => void;
}

export interface PromptOptions {
  options: Option[];
  selectedIndex?: number;
}

export interface TransatedOption {
  option: Option;
  text: string;
}
