// Boot Receiver Helper
// This helps reschedule notifications after device reboot

import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import { store } from '../redux/store';

export const rescheduleAllNotifications = async () => {
  try {
    console.log('Rescheduling all bill notifications...');

    // Get bills from Redux store
    const state = store.getState();
    const bills = state.authSlice?.bills || [];

    // Cancel all existing trigger notifications
    await notifee.cancelAllNotifications();

    // Create notification channel
    const channelId = await notifee.createChannel({
      id: 'bills-reminders',
      name: 'Bills & Reminders',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });

    let scheduledCount = 0;

    // Reschedule all unpaid bills
    for (const bill of bills) {
      if (bill.isPaid) continue;

      const dueDateTimestamp = new Date(bill.dueDate).getTime();
      const now = Date.now();

      // Schedule reminder (1 day before or custom days)
      const reminderDate = new Date(dueDateTimestamp);
      reminderDate.setDate(reminderDate.getDate() - (bill.reminderDays || 1));

      if (reminderDate.getTime() > now) {
        await notifee.createTriggerNotification(
          {
            id: `${bill.id}_reminder`,
            title: '💰 Bill Reminder',
            body: `${bill.name} is due tomorrow! Amount: ₹${bill.amount}`,
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              pressAction: { id: 'default' },
              smallIcon: 'ic_launcher',
              color: '#FF5A5F',
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: reminderDate.getTime(),
          }
        );
        scheduledCount++;
      }

      // Schedule due date notification
      if (dueDateTimestamp > now) {
        await notifee.createTriggerNotification(
          {
            id: `${bill.id}_due`,
            title: '⚠️ Bill Due Today!',
            body: `${bill.name} is due today! Amount: ₹${bill.amount}`,
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              pressAction: { id: 'default' },
              smallIcon: 'ic_launcher',
              color: '#FF5A5F',
              vibrationPattern: [300, 500],
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: dueDateTimestamp,
          }
        );
        scheduledCount++;
      }
    }

    console.log(`✅ Rescheduled ${scheduledCount} notifications for ${bills.length} bills`);
    return scheduledCount;
  } catch (error) {
    console.error('Error rescheduling notifications:', error);
    return 0;
  }
};
