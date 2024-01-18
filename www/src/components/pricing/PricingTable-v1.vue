<template>
  <v-container>
    <v-row align="center">
      <v-col
        v-for="(plan, i) in plans"
        :key="i"
        cols="12"
        sm="9"
        md="9"
        lg="4"
        class="pa-lg-0"
      >
        <v-card
          :class="plan.current && 'py-16'"
          :color="plan.current ? 'primary' : 'white'"
          :rounded="mdAndUp && (i === 0 ? 's-lg e-0' : i === 1 ? 'lg' : 's-0 e-lg')"
          :elevation="plan.current ? 10 : 4"
          class="py-9"
        >
          <div class="text-center">
            <v-img
              :src="plan.logo"
              :height="60"
              class="mx-auto mb-8"
            />

            <div class="d-flex justify-center align-center mb-4">
              <h1 class="text-h4 font-weight-bold">
                {{ plan.free ? '' : '$' }}
                {{ plan.monthlyPrice }}
              </h1>

              <sub class="text-sm font-weight-medium ms-1 mt-2">{{ plan.free ? '' : '/mon' }}</sub>
            </div>

            <h5 class="text-h5 font-weight-medium">
              {{ plan.name }}
            </h5>
          </div>

          <div class="text-center my-8">
            <div
              v-for="feature in plan.features"
              :key="feature"
              class="mb-3 text-subtitle-1 font-weight-light"
            >
              {{ feature }}
            </div>
          </div>

          <div class="text-center">
            <v-btn
              :color="plan.current ? 'secondary' : 'primary'"
              size="x-large"
              text="Get Started"
              variant="flat"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// Utilities
import { useDisplay } from 'vuetify'

// Assets
import PricingIcon from '@/assets/pricing/pricing-icon1.png'
import CurrentPriceIcon from '@/assets/pricing/pricing-icon2.png'

const { mdAndUp } = useDisplay()

const plans = [
  {
    name: 'Starter Plan',
    logo: PricingIcon,
    monthlyPrice: 'Free',
    current: false,
    free: true,
    features: [
      '1 Project',
      '100 Mb of Storage',
      '0 Team Members',
      'Single License'
    ]
  },
  {
    name: 'Premium Plan',
    logo: CurrentPriceIcon,
    monthlyPrice: 4.95,
    current: true,
    features: [
      '10 Project',
      '250 Gb of Storage',
      '10 Team Members',
      'Team License'
    ]
  },
  {
    name: 'Super Plan',
    logo: PricingIcon,
    monthlyPrice: 9.5,
    current: false,
    features: [
      'Unlimited Projects',
      'Unlimited Storage',
      '50 Team Members',
      'Team & Single License'
    ]
  }
]
</script>
