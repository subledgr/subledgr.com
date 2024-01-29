<template>
  <v-container class="fill-height" style="max-width: 600px">
    <v-row align="center" justify="center">

      <v-col>
        <v-spacer></v-spacer>
        <!-- Valid: {{ valid }} -->
        <v-form v-model="valid" @submit.prevent="loginUser">
          <v-row>
            <span class="text-h4 center">Login</span>
          </v-row>
          <v-row>&nbsp;</v-row>
          <v-row>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              variant="filled"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="password"
              :rules="passRules"
              :counter="10"
              type="password"
              label="Password"
              autocomplete=""
              required
              filled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-col>
              Not registered? Register &nbsp;<router-link class="v-btn" to="/register">here</router-link><br>
              Forgot your password? Reset &nbsp;<router-link class="v-btn" to="/reset">here</router-link>
            </v-col>
            <v-col align="end">
              <v-btn @click="navTo('/')">Cancel</v-btn>&nbsp;
              <v-btn type="submit" color="primary" :disabled="!valid">Login</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <v-spacer></v-spacer>
        <v-alert v-if="error" type="error">{{ error.message }}</v-alert>
        <!-- {{ registrationMessage }} -->

        <v-snackbar v-model="snackbar" color="primary">{{ loginMessage }}</v-snackbar>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const MUT_USER_LOGIN = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      id
      email
      message
      success
      token
      profile {
        dateTimeFormat
        defaultCurrency
        defaultDecimals
        locale
        itemsPerPage
      }
    }
  }
`

export default defineComponent({
  name: 'LoginC',
  setup () {
    const router = useRouter()
    const store = useStore()

    const email = ref<string>();
    const emailRules = [
      (value: string) => !!value || 'Email is required',
      (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Email must be valid',
    ]
    const password = ref<string>();
    const passRules = [
      (v: string) => !!v || 'Password is required',
      (v: string) => v.length > 8 || 'Name must be more than 8 characters'
    ]

    // const apolloClient = useApolloClient('defaultClient')
    var { mutate, loading, error } = useMutation(MUT_USER_LOGIN, () => ({
      variables: {
        email: email.value,
        password: password.value
      }
    }));

    const loginMessage = ref('')
    const valid = ref(true)
    const snackbar = ref(false)

    const loginUser = async () => {
      console.debug('registerUser()', email, password)
      const input = { email: email.value, password: password.value };
      const res: any = await mutate(input);
      // handle success
      console.debug(res.data.login)
      if (res.data.login) {
        const { id, email, success, message, token, profile } = res.data.login
        if (!success) {
          loginMessage.value = message
          snackbar.value = true
          setTimeout(() => { loginMessage.value = ''; snackbar.value = false }, 3000)
        } else {
          await store.dispatch('login', { id, email, token })
          await store.dispatch('profile/setProfile', { profile } )
          router.push('/portfolio')
        }
      }
    };
    return {
      email,
      emailRules,
      password,
      passRules,
      valid,
      loginUser,
      loginMessage,
      loading,
      error,
      snackbar
    };
  },
  // data: () => {
  //   return {
  //     // valid: false,
  //     password: '',
  //     passRules: [
  //       (v: string) => !!v || 'Password is required',
  //       (v: string) => v.length > 8 || 'Name must be more than 8 characters'
  //     ],
  //     email: '',
  //     emailRules: [
  //       (value: string) => !!value || 'Email is required',
  //       (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Email must be valid',
  //     ],
  //   }
  // },
  methods: {
    navTo (route: any): void {
      this.$router.push(route)
    }
  }
})
</script>
