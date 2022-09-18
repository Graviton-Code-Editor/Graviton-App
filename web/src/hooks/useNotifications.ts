import { useSetRecoilState } from "recoil";
import { Notification } from "../features/notification/notification";
import { notificationsOpenedState } from "state";

export function useNotifications() {
  const setOpenedNotifications = useSetRecoilState(notificationsOpenedState);

  return {
    pushNotification(notification: Notification) {
      setOpenedNotifications((val) => [...val, notification]);
    },
  };
}
