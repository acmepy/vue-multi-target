<script setup>
import { onMounted } from 'vue'
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import { useWelcomeStore } from '@/stores/welcome'

const store = useWelcomeStore()

onMounted(() => {
  store.load()
})
</script>

<template>
  <WelcomeItem v-for="(d, x) in store.data" :key="x">
    <template #icon>
      <DocumentationIcon v-if="d.title == 'Documentation'" />
      <ToolingIcon v-if="d.title == 'Tooling'" />
      <EcosystemIcon v-if="d.title == 'Ecosystem'" />
      <CommunityIcon v-if="d.title == 'Community'" />
      <SupportIcon v-if="d.title == 'Support Vue'" />
    </template>
    <template #heading>{{ d.title }}</template>

    <div v-html="d.text"></div>
  </WelcomeItem>
</template>
