// Composables
import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Plausible from 'plausible-tracker'

import HomeView from '@/views/HomeView.vue'

import MarketView from '@/components/MarketView.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Profile from '@/components/Profile.vue'
import Dashboard from '@/components/Dashboard.vue'
import Wallets from '@/components/Wallets.vue'
import Wallet from '@/components/Wallet.vue'
import Portfolios from '@/components/Portfolios.vue'
import Portfolio from '@/components/Portfolio.vue'
import Assets from '@/components/Assets.vue'
import Asset from '@/components/Asset.vue'

import Section from '@/components/Section.vue'

import GLHome from '@/components/GeneralLedger/GLHome.vue'
import ChartOfAccounts from '@/components/GeneralLedger/ChartOfAccounts.vue'

// import Settings from '@/components/Settings/Settings.vue'
import SettingsHome from '@/components/Settings/SettingsHome.vue'
import OrgDetails from '@/components/Settings/OrgDetails.vue'
import Users from '@/components/Settings/Users.vue'
import Currencies from '@/components/Settings/Currencies.vue'
import Subscription from '@/components/Settings/Subscription.vue'
import ResetPassword from '@/components/ResetPassword.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/market', name: 'Market', component: MarketView },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/reset', name: 'ResetPassword', component: ResetPassword },
  { path: '/reset/:resetToken', name: 'ResetPasswordLanding', component: ResetPassword },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/asset', name: 'Assets', component: Assets },
  { path: '/asset/:assetId', name: 'Asset', component: Asset, props: true },
  { path: '/portfolio', name: 'Portfolios', component: Portfolios, props: true },
  { path: '/portfolio/:portfolioId', name: 'Portfolio', component: Portfolio },
  { path: '/wallet', name: 'Wallets', component: Wallets },
  { path: '/wallet/:walletId', name: 'Wallet', component: Wallet, props: true },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/currency', name: 'Currencies', component: Currencies },
  {
    path: '/general-ledger',
    name: 'GeneralLedger',
    component: Section,
    children: [
      {
        path: '',
        name: 'GLHome',
        component: GLHome
      },
      { path: 'chart-of-accounts', name: 'ChartOfAccounts', component: ChartOfAccounts }
      // { path: 'users', name: 'Users', component: Users },
      // { path: 'currencies', name: 'Currencies', component: Currencies },
      // { path: 'subscription', name: 'Subscription', component: Subscription }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Section,
    children: [
      {
        path: '',
        name: 'SettingsHome',
        component: SettingsHome
      },
      { path: 'orgDetails', name: 'OrgDetails', component: OrgDetails },
      { path: 'users', name: 'Users', component: Users },
      { path: 'currencies', name: 'Currencies', component: Currencies },
      { path: 'subscription', name: 'Subscription', component: Subscription }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// // TODO move this to a plugin?
import { plausible as plausibleStore } from '../store/modules/plausible'
const plausible = Plausible(plausibleStore.state.options)
// automically track clicks
// plausible.enableAutoPageviews();

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // document.title = to.meta?.title || 'baseTitle'
  // const plausible = inject<typeof p>('$plausible') //|| new PlausiblePlugin()
  console.debug('NODE_ENV', process.env.NODE_ENV)
  if (plausible) {
    if (!['test', 'development'].includes(process.env.NODE_ENV || '')) {
      plausible.trackPageview({
        url: to.path
      })
    }
  }
  return next()
})

export default router
