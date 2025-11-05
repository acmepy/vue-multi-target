import { getActivePinia } from 'pinia';

export * from '@/stores/about';
export * from '@/stores/welcome';

export function resetStor(store) {
  store.$reset;
}
export function resetStors() {
  const pinia = getActivePinia();
  pinia._s.forEach((store) => resetStor(store));
  //pinia._s.forEach((store) => store.$reset())
}
