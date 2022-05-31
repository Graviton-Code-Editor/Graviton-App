import { TranslatedText } from "../../types/types";

export interface PromptOptionArgs {
  option: Option;
  closePrompt: () => void;
  selectedOption: number;
  indexOption: number;
  text: string;
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
}

export interface TransatedOption {
  option: Option;
  text: string;
}
