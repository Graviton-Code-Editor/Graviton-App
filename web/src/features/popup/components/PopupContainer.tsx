import { WindowButton } from "components/Primitive/Button";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { TranslatedText } from "types";
import { showedWindowsState } from "state";

const StyledPopup = styled.div<{ height: number; width: number }>`
  position: fixed;
  overflow: hidden;
  padding: 25px;
  margin-top: 30px;
  margin-left: calc(50% - ${({ width }) => `${width / 2}px`});
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  max-width: 65%;
  max-height: 65%;
  border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.elements.prompt.container.background};
  color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  & .buttons-list {
    display: flex;
    justify-content: center;
  }
  & h5 {
    margin-top: 0px;
  }
  & pre {
    white-space: pre-wrap;    
    font-size: 14px;
    margin: 5px 0px 18px 0px;
  }
`;

export interface PopupButtonOptions {
  label: TranslatedText;
  action: () => void;
}
interface PopupOptions {
  title: TranslatedText;
  content: TranslatedText;
  buttons: PopupButtonOptions[];
  height: number;
  width: number;
}

export default function PopupContainer({
  title,
  content,
  buttons,
  height,
  width,
}: PopupOptions) {
  const { t } = useTranslation();
  const refContainer = useRef<HTMLDivElement | null>(null);
  const setShowedWindows = useSetRecoilState(showedWindowsState);

  function closePopup() {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  }

  function closePopupOnClick(event: any) {
    if (
      event.target !== refContainer.current &&
      !refContainer.current?.contains(event.target)
    ) {
      closePopup();
    }
  }

  useEffect(() => {
    window.addEventListener("click", closePopupOnClick);
    return () => window.removeEventListener("click", closePopupOnClick);
  }, []);

  return (
    <>
      <StyledPopup
        onClick={closePopupOnClick}
        ref={refContainer}
        height={height}
        width={width}
      >
        <div className="popup">
          <h5>{t(title.text, title.props)}</h5>
          <pre>{t(content.text, title.props)}</pre>
          <div className="buttons-list">
            {buttons.map(({ label, action }, i) => {
              const buttonAction = () => {
                action();
                closePopup();
              };
              return (
                <WindowButton expanded={true} key={i} onClick={buttonAction}>
                  {t(label.text, label.props)}
                </WindowButton>
              );
            })}
          </div>
        </div>
      </StyledPopup>
    </>
  );
}
