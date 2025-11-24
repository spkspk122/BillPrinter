import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging'; // Disabled until Firestore is enabled

class NotificationService {
  async requestPermission() {
    try {
      const settings = await notifee.requestPermission();
      console.log('Notification permission status:', settings);
      return settings.authorizationStatus >= 1; // Authorized or provisional
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  async createChannel() {
    try {
      const channelId = await notifee.createChannel({
        id: 'bills-reminders',
        name: 'Bills & Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      return channelId;
    } catch (error) {
      console.error('Error creating channel:', error);
      return null;
    }
  }

  async scheduleNotification({ id, title, body, timestamp }) {
    try {
      await this.requestPermission();
      const channelId = await this.createChannel();

      if (!channelId) {
        console.error('Failed to create notification channel');
        return null;
      }

      // Only schedule if timestamp is in the future
      if (timestamp <= Date.now()) {
        console.log('Timestamp is in the past, not scheduling notification');
        return null;
      }

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp,
      };

      const notificationId = await notifee.createTriggerNotification(
        {
          id: id,
          title: title,
          body: body,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            smallIcon: 'ic_launcher',
            color: '#FF5A5F',
            sound: 'default',
            vibrationPattern: [300, 500],
          },
          ios: {
            sound: 'default',
            critical: true,
            criticalVolume: 0.9,
          },
        },
        trigger
      );

      console.log('Notification scheduled:', notificationId, 'at', new Date(timestamp));
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async displayNotification({ title, body }) {
    try {
      await this.requestPermission();
      const channelId = await this.createChannel();

      if (!channelId) {
        console.error('Failed to create notification channel');
        return null;
      }

      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          color: '#FF5A5F',
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  async cancelNotification(notificationId) {
    try {
      await notifee.cancelNotification(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async getTriggerNotifications() {
    try {
      const notifications = await notifee.getTriggerNotifications();
      return notifications;
    } catch (error) {
      console.error('Error getting trigger notifications:', error);
      return [];
    }
  }

  async setupBackgroundHandler() {
    try {
      // Background message handler for Firebase Cloud Messaging (disabled for now)
      // Uncomment when Firestore is enabled
      // messaging().setBackgroundMessageHandler(async remoteMessage => {
      //   console.log('Message handled in the background!', remoteMessage);
      //   if (remoteMessage.notification) {
      //     await this.displayNotification({
      //       title: remoteMessage.notification.title,
      //       body: remoteMessage.notification.body,
      //     });
      //   }
      // });

      // Foreground notification handler
      notifee.onForegroundEvent(({ type, detail }) => {
        console.log('Foreground notification event:', type, detail);
      });

      // Background notification handler
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        console.log('Background notification event:', type, detail);
      });
    } catch (error) {
      console.log('Notification handler setup skipped:', error.message);
    }
  }

  async checkDailyBills(bills) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      bills.forEach(async (bill) => {
        if (bill.isPaid) return;

        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        // Notify if bill is due today
        if (daysUntilDue === 0) {
          await this.displayNotification({
            title: '⚠️ Bill Due Today!',
            body: `${bill.name} is due today! Amount: ₹${bill.amount}`,
          });
        }

        // Notify if bill is overdue
        if (daysUntilDue < 0) {
          await this.displayNotification({
            title: '🚨 Overdue Bill!',
            body: `${bill.name} is overdue by ${Math.abs(daysUntilDue)} days! Amount: ₹${bill.amount}`,
          });
        }
      });
    } catch (error) {
      console.error('Error checking daily bills:', error);
    }
  }
}

export default new NotificationService();
