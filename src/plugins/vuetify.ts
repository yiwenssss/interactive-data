import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1f6feb',
          secondary: '#5c7cfa',
          accent: '#f59e0b',
          error: '#dc2626',
          surface: '#f5f7fb',
          background: '#ffffff'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi'
  }
})
