// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      token: string | null;
      user: { id: number; name: string; email: string; role: 'superadmin' | string } | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};

