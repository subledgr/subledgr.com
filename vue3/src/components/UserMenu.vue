<template>
  <v-btn icon>
    <v-icon>mdi-dots-vertical</v-icon>
    <v-menu
      left
      bottom
      offset-y
      activator="parent"
      >

      <v-list>

        <!-- <v-list-item>
          {{ user }}
        </v-list-item> -->

        <!-- <v-list-item>
          <template v-slot:prepend>
            <v-icon>mdi-bank</v-icon> Bank
          </template>
        </v-list-item> -->
        <v-list-item v-show="!loggedIn" to="/login">
          <template v-slot:prepend>
            <v-icon>mdi-login</v-icon> Login
          </template>
        </v-list-item>

        <v-list-item v-show="loggedIn" @click="logout()">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon> Logout
          </template>
        </v-list-item>
        <v-list-item v-show="loggedIn" to="/profile">
          <template v-slot:prepend>
            <v-icon>mdi-account-box-outline</v-icon> Profile
          </template>
        </v-list-item>

        <v-list-item v-show="!$vuetify.theme.current.dark" @click="onSetDark(true)">
          <v-list-item-title>
            <v-icon>mdi-theme-light-dark</v-icon>&nbsp;Dark mode
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-show="$vuetify.theme.current.dark" @click="onSetDark(false)">
          <v-list-item-title>
            <v-icon>mdi-theme-light-dark</v-icon>&nbsp;Light mode
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="clearCache()">
          <v-list-item-title>
            <v-icon>mdi-database-refresh-outline</v-icon>&nbsp;Clear cache
          </v-list-item-title>
        </v-list-item>

        <!-- <v-list-item v-show="$vuetify.theme.current.dark" @click="lightMode()">
          <v-list-item-title>
            <v-icon>mdi-theme-light-dark</v-icon>&nbsp;Light mode
          </v-list-item-title>
        </v-list-item> -->

      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
// import { ReactiveVar } from '@apollo/client/cache';
// import { apolloProvider } from '@/plugins/apollo'

import gql from 'graphql-tag';
import { emit } from 'process';

const QUERY_USER_LOCAL = gql`
  query UserLocal {
    User @client {
      email
      id
    }
  }
`

const MUT_LOGOUT = gql`
  mutation Logout {
    logout @client
  }
`
type T = ReturnType<typeof setInterval> | undefined

export default defineComponent({
  name: 'UserMenu',
  setup (context) {
    const apolloClient = useApolloClient()
    const store = useStore()
    const router = useRouter()
    // only computed vars are reactive!
    const loggedIn = computed(() => store.getters.loggedIn)
    // const {result} = useQuery({ query: '' })

    const { mutate, loading, error } = useMutation(MUT_LOGOUT)
    // const { result } = useQuery(QUERY_USER_LOCAL)
    // const user = result
    // // const user: any =>  result()

    const logout = async () => {
      await store.dispatch('logout')
      // const apolloClient = apolloProvider.defaultClient
      // apolloClient.cache.reset()
      const ret = await mutate()
      await apolloClient.client.clearStore()
      // await apolloClient.client.resetStore()
      router.push('/')
      // console.debug('logout', ret)
    }

    const clearCache = async () => {
      console.debug('clearCache')
      const result = await apolloClient.client.clearStore()
      console.debug('result', result)
    }

    watch(() => loggedIn.value, (newVal, oldVal) => {
      console.debug('loggedIn changed...', newVal, oldVal)
    })
    // watch(() => user, (newVal, oldVal) => {
    //   console.debug('user changed...', newVal, oldVal)
    // })

    const onSetDark = (value: boolean) => {
      console.debug('setDark', value)
      store.dispatch('setDarkMode', value)
    }

    return {
      // user,
      loggedIn,
      logout,
      clearCache,
      onSetDark,
    }
  },
  // data: () => {
  //   return {
  //     counterInverval: undefined as T
  //   }
  // },
  methods: {
    darkMode () {
      // this.$vuetify.theme.dark = true
    },
    lightMode () {
      // this.$vuetify.theme.dark = false
    }
  },
  // created runs on the server
  // created () {},
  // mounted runs on the client
  // mounted () {
  //   console.debug('UserMenu mounted()...')
  //   var counter = 0
  //   this.counterInverval = setInterval(() => {
  //     console.debug('counter', ++counter)
  //   }, 3000)
  // },
  // beforeUnmount () {
  //   if (this.counterInverval) clearInterval(this.counterInverval)
  // }
})
</script>
