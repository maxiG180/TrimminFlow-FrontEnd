/**
 * Theme Configuration
 * Centralized styling constants for the application
 */

export const theme = {
  // Color palette
  colors: {
    // Primary brand colors (yellow/amber)
    primary: {
      gradient: 'from-yellow-400 to-amber-500',
      gradientHover: 'from-yellow-500 to-amber-600',
      base: 'yellow-400',
      hover: 'yellow-300',
      text: 'black',
    },

    // Background colors
    background: {
      main: 'from-gray-900 via-black to-gray-800',
      card: 'from-gray-800/40 to-gray-900/40',
      input: 'black/30',
    },

    // Text colors
    text: {
      primary: 'white',
      secondary: 'gray-300',
      muted: 'gray-400',
      placeholder: 'gray-500',
    },

    // Border colors
    border: {
      default: 'white/10',
      hover: 'yellow-400/30',
      focus: 'yellow-400',
    },

    // Status colors
    status: {
      success: {
        bg: 'green-500/20',
        border: 'green-500/50',
        text: 'green-300',
      },
      error: {
        bg: 'red-500/20',
        border: 'red-500/50',
        text: 'red-300',
      },
      warning: {
        bg: 'yellow-500/20',
        border: 'yellow-500/50',
        text: 'yellow-300',
      },
      info: {
        bg: 'blue-500/20',
        border: 'blue-500/50',
        text: 'blue-300',
      },
    },
  },

  // Spacing
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
  },

  // Border radius
  radius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '1.75rem',// 28px
    '3xl': '2rem',   // 32px
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Animation
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },

  // Breakpoints (for reference)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Helper function to get gradient classes
export const getGradient = (type: 'primary' | 'background' | 'card') => {
  const gradients = {
    primary: `bg-gradient-to-r ${theme.colors.primary.gradient}`,
    background: `bg-gradient-to-br ${theme.colors.background.main}`,
    card: `bg-gradient-to-br ${theme.colors.background.card}`,
  };
  return gradients[type];
};

// Helper function to get text color classes
export const getTextColor = (variant: keyof typeof theme.colors.text) => {
  return `text-${theme.colors.text[variant]}`;
};

export type Theme = typeof theme;
