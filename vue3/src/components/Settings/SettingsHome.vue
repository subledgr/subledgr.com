<template>
  <v-container>
    <v-breadcrumbs :items="[{ title: '⚙️ Settings', disabled: true }]"></v-breadcrumbs>
    <v-row>
      <v-col class="col-12 col-md-6">
        <v-list>
          <!-- eslint-disable-next-line vue/no-v-for-template-key -->
          <template v-for="(item, idx) in leftMenu" v-bind:key="idx">
            <v-list-item :to="item.link">
              <!-- <v-list-item-content> -->
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <!-- <v-list-item-subtitle></v-list-item-subtitle> -->
                <span class="text-caption">{{ item.description }}</span>
              <!-- </v-list-item-content> -->
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list>
      </v-col>
      <v-col class="col-12 col-md-6">
        <v-list>
          <!-- eslint-disable-next-line vue/no-v-for-template-key -->
          <template v-for="(item, idx) in rightMenu" v-bind:key="idx">
            <v-list-item :to="item.link">
              <!-- <v-list-item-content> -->
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <!-- <v-list-item-subtitle></v-list-item-subtitle> -->
                <span class="text-caption">{{ item.description }}</span>
              <!-- </v-list-item-content> -->
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface IMenuItem {
  side: 'left' | 'right'
  title: string
  description: string
  link: string
}

interface IData {
  items: IMenuItem[]
}
interface IComputed {
  leftMenu: IMenuItem[]
  rightMenu: IMenuItem[]
}
// eslint-disable-next-line
interface IMethods {}
// eslint-disable-next-line
interface IProps {}

export default defineComponent({
  name: 'SettingHome',
  computed: {
    leftMenu (): any { return this.items.filter((f: IMenuItem) => f.side === 'left') },
    rightMenu (): any { return this.items.filter((f: IMenuItem) => f.side === 'right') }
  },
  data () {
    return {
      items: [
        {
          side: 'left',
          title: 'Organisation details',
          description: 'Address, logo and basic financial information',
          link: '/settings/orgDetails'
        },
        {
          side: 'left',
          title: 'Users',
          description: 'Add, remove or modify users of this organisation',
          link: '/settings/users'
        },
        {
          side: 'left',
          title: 'Currencies',
          description: 'Manage currencies your business uses',
          link: '/settings/currencies'
        },
        {
          side: 'left',
          title: 'Connected Apps',
          description: 'Add and manage third party connections',
          link: '/settings/connectedApps'
        },
        {
          side: 'left',
          title: 'Subscriptions & Billing',
          description: 'Change plan and update payment methods',
          link: '/settings/subscription'
        },
        {
          side: 'right',
          title: 'Invoice Settings',
          description: 'Create branding themes for documents, add payment services and auto-reminders for invoices',
          link: '/settings/invoiceSettings'
        },
        {
          side: 'right',
          title: 'Payment services',
          description: 'Add and manage online payment options for your sales invoices',
          link: '/settings/paymentServices'
        },
        {
          side: 'right',
          title: 'Email settings',
          description: 'Set a reply-to email address and template content ',
          link: '/settings/email'
        },
        {
          side: 'right',
          title: 'Expenses',
          description: 'Manage your expense settings',
          link: '/settings/expenses'
        },
        {
          side: 'right',
          title: 'Integration',
          description: 'Manage your integrations',
          link: '/settings/integration'
        }
      ] as IMenuItem[]
    }
  }
})
</script>
