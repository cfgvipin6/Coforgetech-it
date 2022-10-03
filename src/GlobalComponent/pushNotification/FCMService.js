import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification
    );
  };

  registerAppWithFcm = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] requestPermission rejected ', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] delete token');
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] delete token ', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification
  ) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open',
        remoteMessage
      );
      if (remoteMessage) {
        console.log('opening', remoteMessage);
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('Remote message is : ', remoteMessage);
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open',
          remoteMessage
        );
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('[FCMService] A new FCM message Arrived!', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        remoteMessage.title = remoteMessage.notification.title;
        remoteMessage.body = remoteMessage.notification.body;
        onNotification(remoteMessage);
        // console.log('resonse messag', remoteMessage)
      }
    });

    messaging().onTokenRefresh(fcmToken => {
      console.log('[FCMService] New token refresh:', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    if (this.messageListener !== undefined) {
      this.messageListener();
    }
  };
}

export const fcmService = new FCMService();
