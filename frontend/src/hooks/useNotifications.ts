import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface NotificationSettings {
  morning: boolean;
  evening: boolean;
  festivals: boolean;
  ekadashi: boolean;
}

export type NotificationPermission = 'default' | 'granted' | 'denied';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      toast({
        title: 'Notifications not supported',
        description: 'Your browser does not support notifications',
        variant: 'destructive'
      });
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: '🔔 Notifications Enabled!',
          description: 'You will now receive daily spiritual blessings',
          duration: 4000
        });
        
        // Show welcome notification
        showWelcomeNotification();
      } else {
        toast({
          title: 'Notifications Disabled',
          description: 'You can enable them later from browser settings',
          variant: 'destructive'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setPermission('denied');
      return 'denied';
    }
  };

  const showWelcomeNotification = () => {
    if (permission === 'granted') {
      new Notification('🕉️ Welcome to SantVaani Daily Guide!', {
        body: 'You will receive spiritual guidance every morning and evening. Om Shanti! 🙏',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'welcome'
      });
    }
  };

  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
    return null;
  };

  const scheduleNotifications = (settings: NotificationSettings) => {
    if (permission !== 'granted') return;

    // Store settings in localStorage
    localStorage.setItem('santvaani_notifications', JSON.stringify({
      ...settings,
      enabled: true,
      lastUpdate: new Date().toISOString()
    }));

    // Schedule morning notifications
    if (settings.morning) {
      scheduleMorningReminders();
    }

    // Schedule evening notifications  
    if (settings.evening) {
      scheduleEveningReminders();
    }

    // Schedule festival notifications
    if (settings.festivals) {
      scheduleFestivalReminders();
    }

    // Schedule Ekadashi notifications
    if (settings.ekadashi) {
      scheduleEkadashiReminders();
    }

    toast({
      title: '✅ Notifications Scheduled',
      description: 'Your spiritual reminders are now active',
      duration: 3000
    });
  };

  const scheduleMorningReminders = () => {
    // Note: In a real app, you'd use a service worker or server-side scheduling
    // This is a simplified client-side approach
    
    const morningMessages = [
      {
        title: '🌅 Good Morning! Rise and Shine',
        body: 'Start your day with gratitude. Today\'s mantra: Om Namah Shivaya 🕉️'
      },
      {
        title: '☀️ Spiritual Awakening Time',
        body: 'The divine light within you is ready to shine. Begin with meditation 🧘‍♂️'
      },
      {
        title: '🙏 Morning Blessings',
        body: 'May your day be filled with peace, joy, and spiritual growth'
      },
      {
        title: '🕉️ Daily Mantra Reminder',
        body: 'Chant "Gayatri Mantra" for wisdom and divine guidance'
      },
      {
        title: '🌸 Sacred Morning',
        body: 'Every sunrise is a gift. Express gratitude and set positive intentions'
      }
    ];

    // Schedule for next 7 days (simplified approach)
    for (let i = 1; i <= 7; i++) {
      const scheduleDate = new Date();
      scheduleDate.setDate(scheduleDate.getDate() + i);
      scheduleDate.setHours(7, 0, 0, 0); // 7:00 AM

      const message = morningMessages[i % morningMessages.length];
      
      // In real implementation, use service worker registration
      // This is just for demonstration
      if (i === 1) {
        setTimeout(() => {
          showNotification(message.title, { body: message.body });
        }, 5000); // Show demo notification after 5 seconds
      }
    }
  };

  const scheduleEveningReminders = () => {
    const eveningMessages = [
      {
        title: '🌙 Evening Peace',
        body: 'As the sun sets, light a diya and reflect on today\'s blessings 🪔'
      },
      {
        title: '🕯️ Aarti Time',
        body: 'Time for evening prayers. Connect with the divine within'
      },
      {
        title: '⭐ Gratitude Practice',
        body: 'Before sleep, thank the universe for today\'s experiences'
      },
      {
        title: '🎶 Bhajan Reminder',
        body: 'Listen to devotional songs and purify your soul'
      },
      {
        title: '🧘‍♀️ Evening Meditation',
        body: 'End your day with inner peace and divine connection'
      }
    ];

    // Similar implementation as morning reminders
    const message = eveningMessages[0];
    setTimeout(() => {
      showNotification(message.title, { body: message.body });
    }, 10000); // Demo notification after 10 seconds
  };

  const scheduleFestivalReminders = () => {
    // Festival reminders would be based on Hindu calendar API
    const festivalReminders = [
      {
        title: '🎉 Diwali Approaching!',
        body: '15 days left! Start preparing for the Festival of Lights',
        days: 15
      },
      {
        title: '🪔 Karva Chauth Tomorrow',
        body: 'Married women prepare for the sacred fast',
        days: 1  
      }
    ];

    // Demo festival notification
    setTimeout(() => {
      const reminder = festivalReminders[0];
      showNotification(reminder.title, { body: reminder.body });
    }, 15000);
  };

  const scheduleEkadashiReminders = () => {
    // Ekadashi occurs twice a month (11th day of lunar cycle)
    setTimeout(() => {
      showNotification('📿 Ekadashi Tomorrow', {
        body: 'Prepare for spiritual fasting and Lord Vishnu worship'
      });
    }, 20000);
  };

  const unsubscribeAll = () => {
    localStorage.removeItem('santvaani_notifications');
    
    toast({
      title: 'Notifications Disabled',
      description: 'You have unsubscribed from all notifications',
    });
  };

  const getStoredSettings = (): NotificationSettings & { enabled: boolean } | null => {
    const stored = localStorage.getItem('santvaani_notifications');
    return stored ? JSON.parse(stored) : null;
  };

  // Preview notification for user testing
  const showPreviewNotification = () => {
    const previews = [
      {
        title: '🕉️ SantVaani Morning Blessing',
        body: 'Good morning! Today\'s mantra: Om Namah Shivaya. Have a blessed day! 🙏'
      },
      {
        title: '🌅 Daily Spiritual Wisdom',
        body: 'The mind is everything. What you think you become. - Buddha'
      },
      {
        title: '🔔 Festival Alert',
        body: 'Diwali is in 7 days! Start your preparations for the Festival of Lights 🪔'
      }
    ];

    const randomPreview = previews[Math.floor(Math.random() * previews.length)];
    
    if (permission === 'granted') {
      showNotification(randomPreview.title, { 
        body: randomPreview.body,
        tag: 'preview'
      });
    } else {
      // Fallback: show in-app notification
      toast({
        title: randomPreview.title,
        description: randomPreview.body,
        duration: 5000
      });
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    scheduleNotifications,
    unsubscribeAll,
    getStoredSettings,
    showPreviewNotification
  };
};