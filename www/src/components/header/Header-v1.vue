<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <template #append>
        <v-btn append-icon="mdi-menu">
          Menu

          <v-menu activator="parent">
            <v-list>
              <v-list-item
                title="Item 1"
                link
              />
              <v-list-item
                title="Item 2"
                link
              />
              <v-list-item
                title="Item 3"
                link
              />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main />
  </v-layout>
</template>

<script lang="ts" setup>
//
</script>
