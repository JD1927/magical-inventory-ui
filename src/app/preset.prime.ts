import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Basic dark theme using grayscale colors
export const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

// Dark theme with emerald primary colors and slate surfaces
export const EmeraldStaleKindi = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{emerald.50}',
      100: '{emerald.100}',
      200: '{emerald.200}',
      300: '{emerald.300}',
      400: '{emerald.400}',
      500: '{emerald.500}',
      600: '{emerald.600}',
      700: '{emerald.700}',
      800: '{emerald.800}',
      900: '{emerald.900}',
      950: '{emerald.950}',
    },
    colorScheme: {
      // ADD THIS SECTION
      light: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
        // Ground is a very light slate/gray to provide contrast for white cards
        surfaceGround: '{slate.50}',
        surfaceSection: '{slate.50}',
        // Cards and Content remain pure white to "pop" against the ground
        surfaceCard: '#ffffff',
        surfaceOverlay: '#ffffff',
        surfaceBorder: '{slate.200}',
        content: {
          background: '#ffffff',
          hoverBackground: '{slate.100}',
          borderColor: '{slate.200}',
        },
      },
      dark: {
        // 1. Define the Surface Palette (The Primitives)
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
        // 2. THE FIX: Override the Semantic Roles
        // This maps the UI parts to your Slate palette
        // Use Slate 950 for the deepest layer (the page background)
        surfaceGround: '{slate.950}',
        // Use Slate 900 for the section backgrounds
        surfaceSection: '{slate.900}',
        // Use Slate 900 for the cards to make them "pop" against the ground
        surfaceCard: '{slate.900}',
        // Use Slate 800 for items that sit on top of cards (like dropdown menus)
        surfaceOverlay: '{slate.800}',
        // Use Slate 700 for borders and dividers
        surfaceBorder: '{slate.700}',
        // Content background should usually match the card or ground depending on layout
        content: {
          background: '{slate.900}',
          hoverBackground: '{slate.800}',
          borderColor: '{slate.700}',
        },
      },
    },
  },
});
