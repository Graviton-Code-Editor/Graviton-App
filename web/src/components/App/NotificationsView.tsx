import { useRecoilState } from "recoil";
import styled from "styled-components";
import { notificationsOpenedState } from "atoms";
import { Notification } from "features/notification/notification";

const NotificationsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 70%;
  padding-right: 3px;
`;

export default function NotificationsView() {
  const [openedNotifications, setOpenedNotifications] = useRecoilState(
    notificationsOpenedState,
  );

  function closeNotification(notification: Notification) {
    const index = openedNotifications.indexOf(notification);
    const newNotifications = [...openedNotifications];
    newNotifications.splice(index, 1);
    setOpenedNotifications(newNotifications);
  }

  return (
    <NotificationsContainer>
      {openedNotifications.map((notification) => {
        const Container = notification.container;

        return (
          <Container
            key={notification.id}
            notification={notification}
            close={() => closeNotification(notification)}
          />
        );
      })}
    </NotificationsContainer>
  );
}
