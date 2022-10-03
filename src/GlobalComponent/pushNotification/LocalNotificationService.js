/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('[LocalNotificationService] onRegister: ', token);
      },
      onNotification: function(notification) {
        console.log(
          '[LocalNotificationService] onNotification: ',
          notification
        );
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data
        );
        if (Platform.os === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };
  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    try {
      console.log('Creating notification: id ', id);
      console.log('Creating notification: title ', title);
      console.log('Creating notification: message ', message);
      PushNotification.localNotification({
        ...this.buildAndroidNotification(id, title, message, data, options),
        ...this.buildIOSNotification(id, title, message, data, options),
        title: title || '',
        message: message || '',
        playSound: options.playSound || false,
        soundName: options.soundName || 'default',
        userInteraction: false,
      });
    } catch (error) {
      console.log('Error found in creating notification: ', error);
    }
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    console.log('Android Creating notification: id ', id);
    console.log('Android Creating notification: title ', title);
    console.log('Android Creating notification: message ', message);
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
      bigPictureUrl:options.bigPictureUrl,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    console.log('iOS Creating notification: id ', id);
    console.log('iOS Creating notification: title ', title);
    console.log('iOS Creating notification: message ', message);
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };
  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotification.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeAllDeliveredNotificationByID = notificationID => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID: ',
      notificationID
    );
    PushNotification.cancelLocalNotifications({ id: `${notificationID}` });
  };
}

export const localNotificationService = new LocalNotificationService();
