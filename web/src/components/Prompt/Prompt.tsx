import React, { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { showedWindowsState } from "../../state/state";
import { useTranslation } from "react-i18next";
import WindowBackground from "../Window/WindowBackground";
import { Option, PromptOptions, TransatedOption } from "./Prompt.types";
import { PromptOption, StyledPromptOption } from "./PromptOption";
import { PromptInput } from "./PromptInput";
import PromptContainer from "./PromptContainer";
import PromptOptionsList from "./PromptOptionsList";

export const StyledPrompt = styled.div`
  user-select: none;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

export default function PromptWindow(
  { options, selectedIndex = 0 }: PromptOptions,
) {
  const refBackground = useRef(null);
  const refInput = useRef<HTMLInputElement>(null);
  const setShowedWindows = useSetRecoilState(showedWindowsState);
  const { t } = useTranslation();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(
    selectedIndex,
  );
  const [inputSearch, setInputSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<
    Array<TransatedOption>
  >([]);

  function focusInput() {
    setTimeout(() => {
      refInput.current?.focus();
    }, 1);
  }

  function closePrompt() {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  }

  function closePromptOnClick(event: any) {
    if (event.target === refBackground.current) {
      closePrompt();
    }
  }

  function onArrowDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowUp":
        setSelectedOptionIndex((selectedOptionIndex) => {
          if (selectedOptionIndex > 0) {
            return selectedOptionIndex - 1;
          }
          return selectedOptionIndex;
        });
        focusInput();
        break;
      case "ArrowDown":
        setSelectedOptionIndex((selectedOptionIndex) => {
          if (selectedOptionIndex < filteredOptions.length - 1) {
            return selectedOptionIndex + 1;
          }
          return selectedOptionIndex;
        });
        focusInput();
        break;
    }
  }

  function onEnterDown(e: KeyboardEvent) {
    switch (e.key) {
      case "Enter": {
        const selectedOption = filteredOptions[selectedOptionIndex];
        if (selectedOption) {
          selectedOption.option.onSelected({
            closePrompt,
          });
        }
        break;
      }
    }
  }

  function inputChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setInputSearch(event.target.value.toLowerCase());
  }

  function translateOption(option: Option) {
    const text = t(option.label.text, option.label.props);
    return { option, text };
  }

  function filterOption({ text }: TransatedOption) {
    return text.toLowerCase().includes(inputSearch);
  }

  // Translate and filter all the options when the input is changed
  useEffect(() => {
    setFilteredOptions(options.map(translateOption).filter(filterOption));
    setSelectedOptionIndex(selectedIndex);
  }, [inputSearch, options]);

  // Listen for Up and Down arrows
  useEffect(() => {
    focusInput();

    window.addEventListener("keydown", onArrowDown);
    return () => {
      window.removeEventListener("keydown", onArrowDown);
    };
  }, [filteredOptions]);

  // Listen for Enter
  useEffect(() => {
    window.addEventListener("keydown", onEnterDown);
    return () => {
      window.removeEventListener("keydown", onEnterDown);
    };
  }, [filteredOptions, selectedOptionIndex]);

  return (
    <>
      <WindowBackground />
      <StyledPrompt onClick={closePromptOnClick} ref={refBackground}>
        <PromptContainer>
          <PromptInput
            onChange={inputChanged}
            value={inputSearch}
            ref={refInput}
          />
          <PromptOptionsList>
            {filteredOptions.map(({ option, text }, indexOption) => (
              <PromptOption
                key={indexOption}
                option={option}
                closePrompt={closePrompt}
                selectedOption={selectedOptionIndex}
                indexOption={indexOption}
              >
                {text}
              </PromptOption>
            ))}
            {filteredOptions.length === 0 && (
              <StyledPromptOption isSelected={true}>
                {t("prompts.NoResults")}
              </StyledPromptOption>
            )}
          </PromptOptionsList>
        </PromptContainer>
      </StyledPrompt>
    </>
  );
}
