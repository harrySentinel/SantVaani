/**
 * Category-based gradient mappings for bhajan cards
 * Provides beautiful, deity-specific color schemes
 */

export interface GradientConfig {
  from: string;
  to: string;
  text: string;
  icon: string;
}

export const categoryGradients: Record<string, GradientConfig> = {
  // Hanuman - Orange/Red (Power, Devotion, Strength)
  'Hanuman': {
    from: 'from-orange-400',
    to: 'to-red-500',
    text: 'text-orange-100',
    icon: '🙏'
  },
  'Hanuman Chalisa': {
    from: 'from-orange-400',
    to: 'to-red-500',
    text: 'text-orange-100',
    icon: '🙏'
  },

  // Krishna - Blue/Indigo (Divine Love, Peace)
  'Krishna': {
    from: 'from-blue-400',
    to: 'to-indigo-600',
    text: 'text-blue-100',
    icon: '🦚'
  },
  'Krishna Bhajan': {
    from: 'from-blue-400',
    to: 'to-indigo-600',
    text: 'text-blue-100',
    icon: '🦚'
  },

  // Shiva - Purple/Violet (Meditation, Transformation)
  'Shiva': {
    from: 'from-purple-400',
    to: 'to-violet-600',
    text: 'text-purple-100',
    icon: '🔱'
  },
  'Shiv': {
    from: 'from-purple-400',
    to: 'to-violet-600',
    text: 'text-purple-100',
    icon: '🔱'
  },

  // Rama - Green/Emerald (Righteousness, Dharma)
  'Rama': {
    from: 'from-green-400',
    to: 'to-emerald-600',
    text: 'text-green-100',
    icon: '🏹'
  },
  'Ram': {
    from: 'from-green-400',
    to: 'to-emerald-600',
    text: 'text-green-100',
    icon: '🏹'
  },

  // Durga/Devi - Pink/Rose (Shakti, Divine Feminine)
  'Durga': {
    from: 'from-pink-400',
    to: 'to-rose-600',
    text: 'text-pink-100',
    icon: '🌺'
  },
  'Devi': {
    from: 'from-pink-400',
    to: 'to-rose-600',
    text: 'text-pink-100',
    icon: '🌺'
  },
  'Mata': {
    from: 'from-pink-400',
    to: 'to-rose-600',
    text: 'text-pink-100',
    icon: '🌺'
  },

  // Ganesh - Yellow/Amber (Wisdom, Auspiciousness)
  'Ganesh': {
    from: 'from-yellow-400',
    to: 'to-amber-600',
    text: 'text-yellow-100',
    icon: '🐘'
  },
  'Ganesha': {
    from: 'from-yellow-400',
    to: 'to-amber-600',
    text: 'text-yellow-100',
    icon: '🐘'
  },

  // Lakshmi - Gold/Orange (Prosperity, Abundance)
  'Lakshmi': {
    from: 'from-yellow-300',
    to: 'to-orange-500',
    text: 'text-yellow-100',
    icon: '💰'
  },

  // Saraswati - Cyan/Blue (Knowledge, Arts)
  'Saraswati': {
    from: 'from-cyan-400',
    to: 'to-blue-500',
    text: 'text-cyan-100',
    icon: '📚'
  },

  // Devotional - Mixed gradient (General devotion)
  'Devotional': {
    from: 'from-green-400',
    to: 'to-orange-500',
    text: 'text-green-100',
    icon: '🕉️'
  },
  'Bhajan': {
    from: 'from-green-400',
    to: 'to-orange-500',
    text: 'text-green-100',
    icon: '🎵'
  },

  // Aarti - Golden/Red (Worship, Ceremony)
  'Aarti': {
    from: 'from-amber-400',
    to: 'to-red-600',
    text: 'text-amber-100',
    icon: '🪔'
  },

  // Mantra - Teal/Emerald (Sacred Chants, Meditation)
  'Mantra': {
    from: 'from-teal-400',
    to: 'to-emerald-600',
    text: 'text-teal-100',
    icon: '🕉️'
  },

  // Kirtan - Orange/Pink (Ecstatic devotion, Community)
  'Kirtan': {
    from: 'from-orange-400',
    to: 'to-pink-500',
    text: 'text-orange-100',
    icon: '🎶'
  },

  // Satsang - Indigo/Purple (Spiritual Discourse, Truth)
  'Satsang': {
    from: 'from-indigo-400',
    to: 'to-purple-600',
    text: 'text-indigo-100',
    icon: '🙏'
  },

  // Default fallback
  'default': {
    from: 'from-gray-400',
    to: 'to-slate-600',
    text: 'text-gray-100',
    icon: '🎵'
  }
};

/**
 * Get gradient configuration for a category
 * @param category - The bhajan category
 * @returns Gradient configuration object
 */
export const getCategoryGradient = (category: string): GradientConfig => {
  if (!category) return categoryGradients.default;

  // Direct match
  if (categoryGradients[category]) {
    return categoryGradients[category];
  }

  // Partial match (case-insensitive)
  const normalizedCategory = category.toLowerCase();
  for (const [key, config] of Object.entries(categoryGradients)) {
    if (normalizedCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedCategory)) {
      return config;
    }
  }

  return categoryGradients.default;
};

/**
 * Get full gradient class string
 * @param category - The bhajan category
 * @returns Complete gradient class string for bg-gradient-to-br
 */
export const getGradientClass = (category: string): string => {
  const { from, to } = getCategoryGradient(category);
  return `bg-gradient-to-br ${from} ${to}`;
};

/**
 * Get text color for overlay text on gradient
 * @param category - The bhajan category
 * @returns Text color class
 */
export const getGradientTextClass = (category: string): string => {
  const { text } = getCategoryGradient(category);
  return text;
};

/**
 * Get decorative icon/emoji for category
 * @param category - The bhajan category
 * @returns Emoji icon
 */
export const getCategoryIcon = (category: string): string => {
  const { icon } = getCategoryGradient(category);
  return icon;
};
