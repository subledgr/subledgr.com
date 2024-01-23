<template>
  <v-container fluid class="fill-height" style="max-width: 600px">

    <v-row align="center" justify="center">
      <v-col>
        <v-spacer></v-spacer>
        <!-- Valid: {{ valid }} -->
        <v-form v-model="valid" @submit.prevent="registerUser">
          <v-row>
            <span class="text-h4 center">Register</span>
          </v-row>
          <v-row>&nbsp;</v-row>
          <v-row>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              filled
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
              Already registered? Login <router-link class="v-btn" to="/login">here</router-link>
            </v-col>
            <v-col align="end">
              <v-btn @click="navTo('/')">Cancel</v-btn>&nbsp;
              <v-btn type="submit" :disabled="!valid" color="primary">Submit</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <v-alert v-if="error" type="error">{{ error.message }}</v-alert>
        <!-- {{ registrationMessage }} -->
        <v-alert v-if="registrationMessage" type="warning">{{ registrationMessage }}</v-alert>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'

const MUT_USER_REGISTER = gql`
  mutation Register($email: String, $password: String) {
    register(email: $email, password: $password) {
      email
      id
      message
      success
    }
  }
`

export default defineComponent({
  name: 'RegisterC',
  setup () {
    const router = useRouter()
    var { mutate, loading, error } = useMutation(MUT_USER_REGISTER, () => ({
      variables: {
        email: email.value,
        password: password.value
      }
    }));

    const email = ref('derek@colley.cc');
    const emailRules = [
      (value: string) => !!value || 'Email is required',
      (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Email must be valid',
    ]
    const password = ref('pass1234kk');
    const passRules = [
      (v: string) => !!v || 'Password is required',
      (v: string) => v.length > 8 || 'Name must be more than 8 characters'
    ]
    const registrationMessage = ref('')

    const registerUser = async () => {
      console.debug('registerUser()', email, password)
      const input = { email: email.value, password: password.value };
      const res: any = await mutate(input);
      // handle success
      console.debug(res.data.register)
      if (res.data.register) {
        const { id, email, success, message } = res.data.register
        if (!success) {
          registrationMessage.value = message
          setTimeout(() => { registrationMessage.value = '' }, 3000)
        } else {
          router.push('/')
        }
      }
    };
    return {
      email,
      emailRules,
      password,
      passRules,
      registerUser,
      registrationMessage,
      loading,
      error,
    };
  },
  data: (): any => {
    return {
      valid: false,
      // email: '',
      // emailRules: [
      //   (value: string) => !!value || 'Email is required',
      //   (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Email must be valid',
      // ],
    }
  },
  methods: {
    register () {
    },
    async navTo (route: any): Promise<void> {
      await this.$router.push(route)
    }
  }
})
</script>
