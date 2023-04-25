<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
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
  breadcrumbs: any[]
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
  computed: {
    leftMenu (): any { return this.items.filter((f: IMenuItem) => f.side === 'left') },
    rightMenu (): any { return this.items.filter((f: IMenuItem) => f.side === 'right') }
  },
  data () {
    return {
      breadcrumbs: [
        { text: 'General Ledger', disabled: true }
        // { text: 'Chart of accounts', disabled: true, href: '' }
      ],
      items: [
        {
          side: 'left',
          title: 'Find and recode',
          // description: 'Address, logo and basic financial information',
          link: '/general-ledger/find-and-recode'
        },
        {
          side: 'left',
          title: 'Manual Journals',
          description: 'Work directly with the general ledger',
          link: '/general-ledger/journal'
        },
        {
          side: 'left',
          title: 'Fixed assets',
          description: 'Create and manage fixed assets',
          link: '/general-ledger/fixed-assets'
        },
        {
          side: 'left',
          title: 'Assurance dashboard',
          description: 'Monitor the accuracy of financial data within your organistation',
          link: '/general-ledger/assurance'
        },
        {
          side: 'left',
          title: 'Export accounting data',
          description: 'Export data to other formats',
          link: '/general-ledger/export'
        },
        {
          side: 'left',
          title: 'History and notes',
          description: 'View a summary of the actions made by all users to your transactions',
          link: '/general-ledger/history-and-notes'
        },
        {
          side: 'right',
          title: 'Financial Settings',
          description: 'Edit financial settings like tax periods and lock dates',
          link: '/general-ledger/financial-settings'
        },
        {
          side: 'right',
          title: 'Chart of accounts',
          description: 'Add, edit, archive, delete, import or export your accounts',
          link: '/general-ledger/chart-of-accounts'
        }
        // {
        //   side: 'right',
        //   title: 'Email settings',
        //   description: 'Set a reply-to email address and template content ',
        //   link: '/settings/email'
        // },
        // {
        //   side: 'right',
        //   title: 'Expenses',
        //   description: 'Manage your expense settings',
        //   link: '/settings/expenses'
        // },
        // {
        //   side: 'right',
        //   title: 'Integration',
        //   description: 'Manage your integrations',
        //   link: '/settings/integration'
        // }
      ] as IMenuItem[]
    }
  }
})
</script>
