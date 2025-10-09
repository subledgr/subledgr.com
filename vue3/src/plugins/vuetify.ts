/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    // defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#FFFFFF',
          surface: '#FAFAFA',
          'surface-bright': '#FFFFFF',
          'surface-light': '#F5F5F5',
          'surface-variant': '#E0E0E0',
          'on-surface-variant': '#424242',
          primary: '#673AB7', // Vibrant Purple
          'primary-darken-1': '#5E35B1', // Slightly darker purple for contrast
          secondary: '#7C4DFF', // Lighter Purple or Deep Purple Accent
          'secondary-darken-1': '#651FFF', // A deep purple accent for secondary elements
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          'on-primary': '#FFFFFF', // White text on purple buttons 
          }
        },
      dark: {
        colors: {
          background: '#120D1E',
          surface: '#1E1E1E',
          'surface-bright': '#333333',
          'surface-light': '#252525',
          'surface-variant': '#383838',
          'on-surface-variant': '#CCCCCC',
          primary: '#B39DDB', // Lighter purple for visibility in dark mode
          'primary-darken-1': '#9575CD', // A more subdued purple for elements requiring less emphasis
          secondary: '#7C4DFF', // Consistent with light mode for continuity
          'secondary-darken-1': '#651FFF', // Ensuring visual depth and interest
          error: '#CF6679', // Adjusted for dark mode visibility
          info: '#64B5F6', // Lighter to stand out in dark mode
          success: '#81C784', // A lighter green for better visibility
          warning: '#FFB74D', // Adjusted for dark background
          'on-primary': '#000000', // Dark text on light purple buttons
        },
      },
    },
  },
})
