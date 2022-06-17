import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Notification } from "../../modules/notification";
import { ReactSVG } from "react-svg";

const NotificationBody = styled.div`
  background: ${({ theme }) => theme.elements.notification.background};
  width: 230px;
  height: 70px;
  border-radius: 7px;
  padding: 15px;
  color: ${({ theme }) => theme.elements.notification.text.color};;
  position: relative;
  margin-top: 3px;
`;

const NotificationTitle = styled.h5`
 margin: 0px 0px 10px 0px;
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
  const { t } = useTranslation();
  const { title, content } = notification;

  return (
    <NotificationBody>
      <NotificationClose src="/icons/close_cross.svg" onClick={close} />
      <NotificationTitle>{t(title.text, title.props)}</NotificationTitle>
      <NotificationContent>
        {t(content.text, content.props)}
      </NotificationContent>
    </NotificationBody>
  );
}
