// Blog Categories for Spiritual Content
import { BlogCategory } from '@/types/blog';

export const blogCategories: BlogCategory[] = [
  {
    id: 'spiritual-wisdom',
    name: 'Spiritual Wisdom',
    slug: 'spiritual-wisdom',
    description: 'Ancient teachings and timeless wisdom from great saints and spiritual masters',
    color: '#ff6b35',
    icon: '🙏',
    seoTitle: 'Spiritual Wisdom - Ancient Teachings for Modern Life | Santvaani',
    seoDescription: 'Discover profound spiritual wisdom from Hindu saints and masters. Timeless teachings for finding peace, purpose, and enlightenment in modern life.',
  },
  {
    id: 'daily-guidance',
    name: 'Daily Guidance',
    slug: 'daily-guidance',
    description: 'Practical spiritual advice for everyday living and personal growth',
    color: '#4ade80',
    icon: '🌅',
    seoTitle: 'Daily Spiritual Guidance - Practical Wisdom for Everyday Life',
    seoDescription: 'Get daily spiritual guidance and practical advice for living a meaningful life. Simple wisdom for complex modern challenges.',
  },
  {
    id: 'meditation-practices',
    name: 'Meditation & Practices',
    slug: 'meditation-practices',
    description: 'Learn various meditation techniques and spiritual practices',
    color: '#8b5cf6',
    icon: '🧘',
    seoTitle: 'Meditation Techniques - Hindu Spiritual Practices Guide',
    seoDescription: 'Learn authentic meditation techniques and spiritual practices from the Hindu tradition. Step-by-step guides for beginners and advanced practitioners.',
  },
  {
    id: 'festival-guides',
    name: 'Festival Guides',
    slug: 'festival-guides',
    description: 'Understanding the spiritual significance of Hindu festivals and celebrations',
    color: '#f59e0b',
    icon: '🎉',
    seoTitle: 'Hindu Festival Guides - Spiritual Significance & Celebrations',
    seoDescription: 'Discover the deep spiritual meaning behind Hindu festivals. Complete guides to celebrating with devotion and understanding.',
  },
  {
    id: 'saint-stories',
    name: 'Saint Stories',
    slug: 'saint-stories',
    description: 'Inspiring life stories and teachings of great spiritual masters',
    color: '#06b6d4',
    icon: '✨',
    seoTitle: 'Stories of Hindu Saints - Inspiring Spiritual Biographies',
    seoDescription: 'Read inspiring stories of great Hindu saints and spiritual masters. Learn from their lives, teachings, and spiritual journey.',
  },
  {
    id: 'spiritual-philosophy',
    name: 'Spiritual Philosophy',
    slug: 'spiritual-philosophy',
    description: 'Deep dive into Hindu philosophy and spiritual concepts',
    color: '#ec4899',
    icon: '📚',
    seoTitle: 'Hindu Spiritual Philosophy - Ancient Wisdom Explained',
    seoDescription: 'Explore Hindu spiritual philosophy, Vedantic concepts, and ancient wisdom traditions. Complex ideas explained simply.',
  },
  {
    id: 'modern-spirituality',
    name: 'Modern Spirituality',
    slug: 'modern-spirituality',
    description: 'Applying ancient wisdom to contemporary life challenges',
    color: '#84cc16',
    icon: '🌱',
    seoTitle: 'Modern Spirituality - Ancient Wisdom for Contemporary Life',
    seoDescription: 'Apply ancient spiritual wisdom to modern life. Practical guidance for spirituality in the 21st century.',
  },
  {
    id: 'healing-wellness',
    name: 'Healing & Wellness',
    slug: 'healing-wellness',
    description: 'Spiritual approaches to healing, wellness, and inner peace',
    color: '#14b8a6',
    icon: '💚',
    seoTitle: 'Spiritual Healing & Wellness - Holistic Health Guidance',
    seoDescription: 'Discover spiritual approaches to healing and wellness. Ancient practices for physical, mental, and spiritual well-being.',
  },
];

export const getCategoryBySlug = (slug: string): BlogCategory | undefined => {
  return blogCategories.find(category => category.slug === slug);
};

export const getCategoryById = (id: string): BlogCategory | undefined => {
  return blogCategories.find(category => category.id === id);
};

export default blogCategories;