import { PropsWithChildren, useEffect, useRef } from "react";
import styled from "styled-components";
import { PromptOptionArgs } from "./Prompt.types";

export const StyledPromptOption = styled.button<{ isSelected: boolean }>`
  color: white;
  margin-bottom: 3px;
  padding: 8px 10px;
  border-radius: 7px;
  width: 100%;
  border: none;
  text-align: left;
  font-size: 14px;
  outline: none;
  display: flex;
  align-items: center;
  height: 35px;
  background: ${({ isSelected, theme }) =>
  isSelected
    ? theme.elements.prompt.option.selected.background
    : theme.elements.prompt.option.background};
  border: 1px solid ${({ isSelected, theme }) =>
  isSelected ? theme.elements.prompt.option.selected.border : "transparent"};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.elements.prompt.option.hover.background};
    border: 1px solid ${({ theme }) =>
  theme.elements.prompt.option.hover.border};
  }
`;

export const StyledPromptOptionIcon = styled.div`
  & {
    min-width: 25px;
    min-height: 25px;
    margin-right: 5px;
  }
  svg {
    max-width: 25px;
    max-height: 25px;
  }
`;

export function PromptOption(
  { option, closePrompt, selectedOption, indexOption, children }:
    PropsWithChildren<PromptOptionArgs>,
) {
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
      element.focus();
    }
  }, [isSelected]);

  return (
    <StyledPromptOption
      ref={optionRef}
      key={option.label.text}
      onClick={optionSelected}
      isSelected={isSelected}
    >
      {children}
    </StyledPromptOption>
  );
}
