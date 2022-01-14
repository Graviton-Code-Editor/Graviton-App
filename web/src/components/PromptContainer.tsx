import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { showedWindows } from "../utils/atoms";
import { useTranslation } from "react-i18next";
import WindowBackground from "./WindowBackground";

const StyledPromptOption = styled.button<{ isSelected: boolean }>`
  color: white;
  margin-bottom: 3px;
  padding: 8px 10px;
  border-radius: 7px;
  width: 100%;
  border: none;
  text-align: left;
  font-size: 13px;
  outline: none;
  background: ${({ isSelected, theme }) =>
    isSelected
      ? theme.elements.prompt.option.selected.background
      : theme.elements.prompt.option.background};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.elements.prompt.option.hover.background};
  }
`;

const StyledPrompt = styled.div`
  user-select: none;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  & .prompt {
    border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};
    margin-top: 30px;
    width: 200px;
    border-radius: 10px;
    height: 230px;
    background: ${({ theme }) => theme.elements.prompt.container.background};
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
    padding: 10px;
  }
`;

export interface OptionUtils {
  closePrompt: () => void;
}
export interface Option {
  label: string;
  onSelected: (utils: OptionUtils) => void;
}

interface PromptOptions {
  options: Option[];
}

export default function PromptContainer({ options }: PromptOptions) {
  const refBackground = useRef(null);
  const setShowedWindows = useSetRecoilState(showedWindows);
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<number>(0);

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

  function onArrow(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowUp":
        setSelectedOption((selectedOption) => {
          if (selectedOption > 0) {
            return selectedOption - 1;
          }
          return selectedOption;
        });
        break;
      case "ArrowDown":
        setSelectedOption((selectedOption) => {
          if (selectedOption < options.length - 1) {
            return selectedOption + 1;
          }
          return selectedOption;
        });
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onArrow);
    return () => {
      window.removeEventListener("keydown", onArrow);
    };
  }, []);

  return (
    <>
      <WindowBackground />
      <StyledPrompt onClick={closePromptOnClick} ref={refBackground}>
        <div className="prompt">
          {options.map((option, indexOption) => {
            const optionRef = useRef(null);

            function optionSelected() {
              option.onSelected({
                closePrompt,
              });
            }

            const isSelected = selectedOption === indexOption;

            useEffect(() => {
              if (isSelected && optionRef.current) {
                const element = optionRef.current as HTMLElement;
                console.log(element);
                element.focus();
              }
            }, [isSelected]);

            return (
              <StyledPromptOption
                ref={optionRef}
                key={option.label}
                onClick={optionSelected}
                isSelected={isSelected}
              >
                {t(option.label)}
              </StyledPromptOption>
            );
          })}
        </div>
      </StyledPrompt>
    </>
  );
}
