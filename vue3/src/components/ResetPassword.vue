<template>
  <v-container fluid class="fill-height" style="max-width: 600px">

    <v-row align="center" justify="center">
      <v-col>
        <!-- {{ route.matched[0].path }} -->
        <v-spacer></v-spacer>
        <!-- Valid: {{ valid }} -->
        <v-form v-model="valid" @submit.prevent="resetUser">
          <v-row>
            <span class="text-h4 center">Reset</span>
          </v-row>
          <v-row>&nbsp;</v-row>
          <v-row v-if="!resetToken">
            <p>Enter your email to reset your password</p>
          </v-row>
          <v-row>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              filled
              required
            ></v-text-field>
          </v-row>
          <v-row v-if="resetToken">
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
          <v-row v-if="resetToken">
            <v-text-field
              v-model="password2"
              :rules="pass2Rules"
              :counter="10"
              type="password"
              label="Password confirmation"
              autocomplete=""
              required
              filled
            ></v-text-field>
          </v-row>

          <v-row>
            <v-col>
              Already registered? Login <router-link class="v-btn" to="/login">here</router-link>
            </v-col>
            <v-col align="end">
              <v-btn @click="navTo('/')">
                <template v-slot:prepend><v-icon class="d-none d-sm-inline">mdi-cancel</v-icon></template>
                Cancel
              </v-btn>&nbsp;
              <v-btn type="submit" :disabled="!valid" color="primary">
                <template v-slot:prepend><v-icon class="d-none d-sm-inline">mdi-check</v-icon></template>
                Submit</v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <br>
        <v-alert v-if="error" type="error">{{ error.message }}</v-alert>
        <!-- {{ registrationMessage }} -->
        <v-alert v-if="resetMessage" type="warning">{{ resetMessage }}</v-alert>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>

    <!-- Token {{ resetToken }}<br> -->
  </v-container>  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const MUT_USER_RESET = gql`
  mutation Reset($token: String, $email: String!, $password: String) {
    reset(token: $token, email: $email, password: $password) {
      email
      id
      message
      success
    }
  }
`

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const resetToken = ref<string | undefined>(route.params.resetToken?.toString())
    const valid = ref(false)

    const email = ref('');
    const emailRules = [
      (value: string) => !!value || 'Email is required',
      (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Email must be valid',
    ]
    const password = ref<string>();
    const password2 = ref<string>();
    const passRules = [
      (v: string) => !!v || 'Password is required',
      (v: string) => v.length > 8 || 'Name must be more than 8 characters'
    ]
    const pass2Rules = [
      (v: string) => v === password.value || 'Password confirmation should match'
    ]
    const resetMessage = ref('')

    var { mutate, loading, error } = useMutation(MUT_USER_RESET, () => ({
      variables: {
        token: resetToken.value,
        email: email.value,
        password: password.value
      }
    }));
    const apolloClient = useApolloClient('defaultClient')

    const resetUser = async () => {
      console.debug('registerUser()', email, password)
      const input = { token: resetToken.value, email: email.value, password: password.value };
      const res: any = await mutate(input);
      // handle success
      console.debug(res.data.reset)
      if (res.data.reset) {
        const { id, email, success, message } = res.data.reset
        if (!success) {
          resetMessage.value = message
          setTimeout(() => { resetMessage.value = '' }, 3000)
        } else {
          // setTimeout(() => {
          //   router.push('/login')
          // }, 5000)
          resetMessage.value = message
          setTimeout(() => {
            resetMessage.value = ''
            if (resetToken) router.push('/login')
          }, 5000)
        }
      }
    };

    return {
      route,
      resetToken,
      resetUser,
      valid,
      email,
      emailRules,
      password,
      passRules,
      password2,
      pass2Rules,
      error,
      loading,
      resetMessage
    }
  },
  methods: {
    async navTo (route: any): Promise<void> {
      await this.$router.push(route)
    }
  }
})
</script>
