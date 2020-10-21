import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import welcomePage from '../components/welcomePage.vue'

import UserControl from '../components/UserControl.vue';
import Apps from '../components/ApplicationsParent.vue';
import AddApp from '../components/AddApp.vue';


Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   },
// ]

const routes = [

  { path: '/', component: welcomePage },
  { path: '/account', component: UserControl },
  { path: '/apps', component: Apps },
  { path: '/add', component: AddApp }
  // { path: '/login', component: Login },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
