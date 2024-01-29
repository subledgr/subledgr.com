<template>
  <v-container class="py-0 px-0">

    <v-toolbar density="compact" style="background: none;">
      <v-toolbar-title>
        Profile
      </v-toolbar-title>
    </v-toolbar>

    <v-card>
      <v-card-text>
        <!-- form: {{ form }} <br> -->
        <!-- dirty: {{ isDirty }}. -->
        <v-form ref="formRef">
          <!-- <v-text-field
            class="mb-0"
            v-model="profile.dateTimeFormat"
            label="DateTime Format"
            @change="isDirty=true"
            clearable
            @click:clear="profile.dateTimeFormat='YYYY.MM.DD HH:mm'"
            ></v-text-field>
          <div class="text-right mb-5" style="margin-bottom: 10;">
              DateTime Format: <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">https://momentjs.com/docs/#/displaying/format</a> <br>
          </div> -->
          
          <v-select
            v-model="profile.itemsPerPage"
            label="Items Per Page"
            @change="isDirty=true"
            :items="[10,15,20,25,50,100]"></v-select>

          <v-select
            v-model="profile.defaultCurrency"
            label="Reporting Currency"
            @change="isDirty=true"
            @select="isDirty=true"
            :items="['GBP','EUR','USD']"></v-select>

          <v-select
            v-model="profile.defaultDecimals"
            label="Reporting Decimals"
            @change="isDirty=true"
            :items="[0,1,2,3,4,5,6,7,8,9]"></v-select>

          <!-- ||{{ locales }}|| -->
          <v-select
            v-model="profile.locale"
            label="Locale"
            @change="isDirty=true"
            :items="locales"></v-select>

          <v-select
            v-model="profile.dateTimeFormat"
            label="DateTime format"
            @change="isDirty=true"
            :items="['YYYY.MM.DD HH:mm', 'MM.DD.YYYY HH:mm', 'MMM DD, YYYY HH:mm']"></v-select>

          <div class="d-flex flex-column">
            <!-- <v-btn
              color="success"
              class="mt-4"
              block
              @click="validate"
            >
              Validate
            </v-btn> -->

            <v-row>
              <v-spacer></v-spacer>
              <!-- <v-col>
                <v-btn
                  color=""
                  class="mt-4"
                  block
                  @click="form.reset"
                >
                  Reset Form
                </v-btn>
              </v-col> -->
              <v-col>
                <v-btn
                  color="primary"
                  class="mt-4"
                  block
                  @click="save"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>

            <!-- <v-btn
              color="warning"
              class="mt-4"
              block
              @click="resetValidation"
            >
              Reset Validation
            </v-btn> -->
          </div>
        </v-form>
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <v-spacer></v-spacer>
        <v-alert v-if="error" type="error">{{ error.message }}</v-alert>

      </v-card-text>
    </v-card>

    <br>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IProfile } from './types'

const MUT_PROFILE_SAVE = gql`
  mutation saveProfile($dateTimeFormat: String, $itemsPerPage: Int, $locale: String, $defaultCurrency: String, $defaultDecimals: Int) {
    saveProfile(
      dateTimeFormat: $dateTimeFormat, 
      itemsPerPage: $itemsPerPage,
      locale: $locale,
      defaultCurrency: $defaultCurrency,
      defaultDecimals: $defaultDecimals
    ) {
      dateTimeFormat
      itemsPerPage
      locale
      defaultCurrency
      defaultDecimals
    }
  }
`

export default defineComponent({
  setup () {
    const store = useStore()
    const profile = ref<IProfile>(store.state.profile)
    const locales = ref(store.state.profile.locales)
    const loggedIn = computed(() => store.getters.loggedIn)
    const router = useRouter()
    
    const formRef = ref(null)
    // const isDirty = computed(() => formRef.value && formRef.value.dirty)
    const isDirty = ref(false)
    const messages = {
      dateTimeFormat: [
        'DateTime Format: <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">https://momentjs.com/docs/#/displaying/format</a>'
      ]
    }
    
    if (!loggedIn.value) {
      router.push('/login')
    }
    watch(() => formRef, newVal => {
      console.debug('watch.formRef', newVal)
    })
    watch(() => profile.value, newVal => {
      console.debug('watch.profile', newVal)
    })
    watch(() => loggedIn.value, (newVal, oldVal) => {
      console.debug('loggedIn.value', newVal, oldVal)
      if (!newVal) router.push('/')
    })

    var { mutate, loading, error } = useMutation(MUT_PROFILE_SAVE, () => ({
      variables: profile.value
    }));

    const save = async () => {
      await mutate()
    }

    const user = computed(() => store.getters.user )
    // const data = {}
    return {
      messages,
      formRef,
      isDirty,
      user,
      profile,
      locales,
      loading,
      error,
      save
    }
  }
})
</script>
