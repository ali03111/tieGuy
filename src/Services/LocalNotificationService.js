import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee from '@notifee/react-native';
import {Platform} from 'react-native';
PushNotification.configure({
  onNotification: function (notification) {
    console.log('Local Notification', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

const sound = Platform.select({
  ios: '/src/Assets/NotificationSound/notificationSound.wav',
  android: '/src/Assets/NotificationSound/notificationSound.mp3',
});

PushNotification.createChannel(
  {
    channelId: 'channel-id', // (required)
    channelName: 'My channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: sound, // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true,
    vibration: 1000, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

export const localNotification = () => {
  PushNotification.localNotification({
    channelId: 'channel-id', // (required)
    channelName: 'My channel', // (required)
    autoCancel: true,
    bigText:
      'this is local notification demo for react native , it will show then expanded',
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    subText: 'Local Notification Demo',
    title: 'Local Notification Title',
    message: 'hey Expand Me!!!',
    playSound: true, // (optional) default: true
    soundName: sound, // (optional) See `soundName` parameter of `localNotification` function
    // importance: 10, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true,
    vibration: 1000, // (optional) default: true. Creates the default vibration pattern if true.
  });
};

export async function localNotifeeNotification(id) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'channel-id-new',
    name: 'My new channel',
    sound: sound,
    vibration: true,
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Railway crossing alert!',
    // body: id,
    body: 'Here is a railway crossing near you!',

    android: {
      channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
      autoCancel: true,
      circularLargeIcon: true,
      lightUpScreen: true,
      sound: 'notificationSound.mp3',
    },
    ios: {
      critical: true,
      sound: 'notificationSound.wav',
    },
  });
  // notifee.setBadgeCount(1).then(() => console.log('Badge count set!'));
}
