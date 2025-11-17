import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'info';
export interface ToastItem { id: number; message: string; type: ToastType; timeout?: number }

function createToastStore() {
  const { subscribe, update } = writable<ToastItem[]>([]);
  let idCounter = 1;

  function push(message: string, type: ToastType = 'info', timeout = 3000) {
    const id = idCounter++;
    const item: ToastItem = { id, message, type, timeout };
    update((list) => [...list, item]);
    if (timeout) {
      setTimeout(() => remove(id), timeout);
    }
    return id;
  }

  function remove(id: number) {
    update((list) => list.filter((t) => t.id !== id));
  }

  return { subscribe, push, remove };
}

export const toastStore = createToastStore();

