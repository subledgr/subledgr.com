<template>
  <v-container class="pa-0">
    <!-- <v-toolbar>
      <v-toolbar-title>Pricing</v-toolbar-title>
    </v-toolbar> -->
    <v-row>
      <v-col
        v-for="(plan, i) in plans"
        :key="i"
        cols="12"
        sm="12"
        lg="6"
      >
        <v-card
          :color="plan.current ? 'primary' : 'white'"
          elevation="10"
          class="pa-10"
          rounded="lg"
        >
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="8"
              >
                <h1 class="text-sm-h3 text-md-h3 text-lg-h3 font-weight-medium">
                  {{ plan.name }}
                </h1>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
                class="text-end"
              >
                <div class="d-flex justify-center align-center">
                  <h1 class="text-sm-h5 font-weight-medium">
                    ${{ plan.monthlyPrice }}
                  </h1>

                  <sub class="text-sm font-weight-medium ms-1">/mon</sub>
                </div>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="10"
              >
                <p class="mt-5 font-weight-low">
                  {{ plan.tagLine }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text class="mt-5">
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-list
                  bg-color="transparent"
                  slim
                >
                  <v-list-item
                    v-for="feature in plan.baseFeatures"
                    :key="feature"
                    class="pa-0"
                  >
                    <template #prepend>
                      <v-icon
                        :color="plan.current ? 'white' : 'primary'"
                        icon="mdi-check-circle"
                        class="me-3"
                      />
                    </template>

                    <v-list-item-title>
                      {{ feature }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-list
                  bg-color="transparent"
                  slim
                >
                  <v-list-item
                    v-for="feature in plan.advanceFeatures"
                    :key="feature"
                    class="pa-0"
                  >
                    <template #prepend>
                      <v-icon
                        :icon="plan.advance ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="me-3"
                      />
                    </template>

                    <v-list-item-title>
                      {{ feature }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>

          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="5"
                class="d-flex justify-center justify-sm-start"
              >
                <a href="https://app.subledgr.com/login">
                  <v-btn
                    :color="plan.current ? 'secondary' : 'primary'"
                    :size="'x-large'"
                    flat
                  >
                    {{ 'Get Started' }}
                  </v-btn>
                </a>
              </v-col>

              <v-col
                cols="12"
                sm="7"
                class="d-flex align-center justify-center justify-sm-start"
              >
                <v-btn
                  :color="plan.current ? 'secondary' : ''"
                  variant="text"
                >
                  Contact us for more details
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const plans = [
{
    name: 'Community Edition',
    tagLine: 'Funded by the treasury, phase 1 features are free to use for all users.',
    monthlyPrice: 0,
    current: false,
    advance: false,
    baseFeatures: [
      'Manage Accounts',
      'Manage Portfolios',
      'View Balances & History',
      'Download CSV'
    ],
    advanceFeatures: [
      // 'No SSL Option',
      // 'No Site Search',
      // 'No Content Editors'
    ]
  },
  // {
  //   name: 'Phase 2',
  //   tagLine: 'Development of the process and/or information flow of the system (i.e. for phone tree system, this would be an option tree flowchat.)',
  //   monthlyPrice: 4.95,
  //   current: false,
  //   advance: false,
  //   baseFeatures: [
  //     'Publish to PanoplyStore',
  //     '100 Static Pages',
  //     '50 Form Submissions'
  //   ],
  //   advanceFeatures: [
  //     'No SSL Option',
  //     'No Site Search',
  //     'No Content Editors'
  //   ]
  // },
  // {
  //   name: 'Starter',
  //   tagLine: 'Development of the process and/or information flow of the system (i.e. for phone tree system, this would be an option tree flowchat.)',
  //   monthlyPrice: 4.95,
  //   current: false,
  //   advance: false,
  //   baseFeatures: [
  //     'Publish to PanoplyStore',
  //     '100 Static Pages',
  //     '50 Form Submissions'
  //   ],
  //   advanceFeatures: [
  //     'No SSL Option',
  //     'No Site Search',
  //     'No Content Editors'
  //   ]
  // },
  // {
  //   name: 'Business',
  //   tagLine: 'Development of the process and/or information flow of the system (i.e. for phone tree systems, this would be an option tree flowchart)',
  //   monthlyPrice: 9.95,
  //   current: true,
  //   advance: true,
  //   baseFeatures: [
  //     'Publish to PanoplyStore',
  //     '100 Static Pages',
  //     '50 Form Submissions'
  //   ],
  //   advanceFeatures: [
  //     'SSL Option',
  //     'Site Search',
  //     'Content Editors'
  //   ]
  // }
]
</script>
