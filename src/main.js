import Vue from 'vue'
import App from './App.vue'
import * as firebase from 'firebase'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyDage8vuqbCZcxp3CqyUQnk8vJEMy2Jyck",
      authDomain: "schoolbook-dpua.firebaseapp.com",
      databaseURL: "https://schoolbook-dpua.firebaseio.com",
      projectId: "schoolbook-dpua",
      storageBucket: "schoolbook-dpua.appspot.com",
      messagingSenderId: "667452590955",
      appId: "1:667452590955:web:fb91217b5043f409b41a2e",
      measurementId: "G-NRNMDSC0C6"
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user).then(r => {})
      }
    });

  },
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
