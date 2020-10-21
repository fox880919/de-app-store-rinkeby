import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import drizzleVuePlugin from "@drizzle/vue-plugin"
import drizzleOptions from "./drizzleOptions"

import BootstrapVue from 'bootstrap-vue'


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import VueProgressBar from 'vue-progressbar'
 
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import VueApollo from 'vue-apollo'

import AsyncComputed from 'vue-async-computed'


// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://de-app-store.herokuapp.com/v1/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

Vue.use(VueApollo);

Vue.use(AsyncComputed)


Vue.config.productionTip = false

Vue.use(drizzleVuePlugin, { store, drizzleOptions })

Vue.use(BootstrapVue)
Vue.use(Buefy);

const options = {
  color: '#bffaf3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'left',
  inverse: false
}

// Vue.use(VueProgressBar, {
//   color: 'rgb(143, 255, 199)',
//   failedColor: 'red',
//   height: '2px'
// });

Vue.use(VueProgressBar, options)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
