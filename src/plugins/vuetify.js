import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'
import ru from '../local/ru.ts'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { ru },
        current: 'ru',
    },
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: '#00bcd4',
                secondary: '#3f51b5',
                accent: '#ff5722',
                error: '#f44336',
                warning: '#ff9800',
                info: '#8bc34a',
                success: '#607d8b'
            },
            dark: {
                primary: '#BB86FC',
                secondary: '#03DAC6',
                accent: '#ff0266',
                error: '#CF6679',
                warning: '#8bc34a',
                info: '#ff9800',
                success: '#607d8b'
            }
        },
        dark: false
    }
})



