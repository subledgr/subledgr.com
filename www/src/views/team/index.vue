<template>
  <v-container>
    <h1>Team</h1>

    <p>
      Team is a great way to show off your team.
    </p>

    <br>

    <h2>Version 1</h2>

    <TeamV1 />

    <br>

    <h2>Version 2</h2>

    <TeamV2 />
  </v-container>
</template>

<script lang="ts" setup>
import TeamV1 from '@/components/team/Team-v1.vue'
import TeamV2 from '@/components/team/Team-v2.vue'
</script>
