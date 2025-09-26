import { getActivePinia } from 'pinia'

export * from '@/stores/about'
export * from '@/stores/welcome'

export function resetStors() {
  const pinia = getActivePinia()
  pinia._s.forEach((store) => store.$reset())
}
