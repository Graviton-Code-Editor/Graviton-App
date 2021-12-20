import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { showedWindows } from "../utils/atoms";
import WindowBackground from "./WindowBackground";

const StyledPopup = styled.div`
  user-select: none;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  & .popup {
    padding: 20px;
    border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};
    margin-top: 20px;
    width: 300px;
    border-radius: 10px;
    height: 200px;
    background: ${({ theme }) => theme.elements.prompt.container.background};
    color: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  }
`;

interface PopupOptions {
  title: string;
  content: string;
}

export default function PopupContainer({ title, content }: PopupOptions) {
  const refBackground = useRef(null);
  const setShowedWindows = useSetRecoilState(showedWindows);

  function closePopup() {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  }

  function closePopupOnClick(event: any) {
    if (event.target === refBackground.current) {
      closePopup();
    }
  }

  return (
    <>
      <WindowBackground />
      <StyledPopup onClick={closePopupOnClick} ref={refBackground}>
        <div className="popup">
          <h1>{title}</h1>
          <p>{content}</p>
        </div>
      </StyledPopup>
    </>
  );
}
