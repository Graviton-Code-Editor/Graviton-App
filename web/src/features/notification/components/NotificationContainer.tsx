import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Notification } from "../notification";
import { ReactSVG } from "react-svg";
import { Transition } from "react-transition-group";
import { useEffect, useState } from "react";

const transitionStyles: Record<string, React.CSSProperties> = {
  entering: { opacity: 1, transform: "translateX(0px)" },
  entered: { opacity: 1, transform: "translateX(0px)" },
  exiting: {
    opacity: 0,
    transform: "translateX(100px)",
    height: 0,
    padding: 0,
  },
  exited: { opacity: 0, transform: "translateX(100px)", height: 0, padding: 0 },
};

const NotificationBody = styled.div`
  background: ${({ theme }) => theme.elements.notification.background};
  width: 230px;
  height: 70px;
  border-radius: 7px;
  padding: 15px;
  color: ${({ theme }) => theme.elements.notification.text.color};;
  position: relative;
  margin-top: 3px;
  transition: 0.1s;
`;

const NotificationTitle = styled.h5`
 margin: 0px 0px 10px 0px;
 user-select: none;
`;

const NotificationContent = styled.p`
 margin: 0;
 font-size: 13px;
`;

const NotificationClose = styled(ReactSVG)`
 position: absolute;
 top: 10px;
 right: 15px;
 & svg {
    height: 10px;
    width: 10px; 
    & path {
        stroke: ${({ theme }) => theme.elements.notification.close.fill};
    }
 }
 &:hover svg > path {
    stroke: ${({ theme }) => theme.elements.notification.close.hover.fill};
  }
`;

interface NotificationOptions {
  notification: Notification;
  close: () => void;
}

export default function NotificationContainer(
  { notification, close }: NotificationOptions,
) {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const { title, content } = notification;

  useEffect(() => {
    setMounted(true);
  }, []);

  function closeNotification() {
    setMounted(false);
    setTimeout(() => {
      close();
    }, 110);
  }

  return (
    <Transition in={mounted} timeout={100}>
      {(state) => (
        <NotificationBody style={transitionStyles[state]}>
          <NotificationClose
            src="/icons/close_cross.svg"
            onClick={closeNotification}
          />
          <NotificationTitle>{t(title.text, title.props)}</NotificationTitle>
          <NotificationContent>
            {t(content.text, content.props)}
          </NotificationContent>
        </NotificationBody>
      )}
    </Transition>
  );
}
