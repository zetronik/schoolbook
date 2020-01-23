import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'
import Admin from "../views/Admin";

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    name: '404',
    component: Home
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    AuthGuard
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    AuthGuard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    AuthGuard
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
