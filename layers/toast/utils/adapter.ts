import { ElNotification } from "../../../node_modules//element-plus@2@3@5/node_modules/element-plus/es/components/notification/index";
import type { INotification } from "./types.ts";

export function adaptNotificationFromNuxtUItoElementPlus(
  notification: INotification,
) {
  return ElNotification({
    // ...notification["icon"],
    // ...notification['ui'],
    // TODO: implement: actions
    // TODO: implement: progressBar
    // TODO: implement: onHoverStrategy: 'pause-on-enter/resume-on-leave' | 'DEFAULT:resetInterval'
    // TODO: docs: add about all above + keyboard shortcuts
    onClick: notification.click,
    onClose: notification.callback,
    title: notification.title,
    message: notification.description,
    duration: notification.timeout,
    type: notification.type,
  });
}
