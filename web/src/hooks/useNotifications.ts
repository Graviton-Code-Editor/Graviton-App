import { useSetRecoilState } from "recoil";
import { Notification } from "../modules/notification";
import { notificationsOpenedState } from "../state/state";

export default function useNotifications() {
  const setOpenedNotifications = useSetRecoilState(notificationsOpenedState);

  return {
    pushNotification(notification: Notification) {
      setOpenedNotifications((val) => [...val, notification]);
    },
  };
}
