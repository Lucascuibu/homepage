import { create } from 'zustand';
import { devtools, persist, PersistStorage,StorageValue } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';
const encrypt = (data: string) => CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
const decrypt = (data: string) => CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);

interface BearState {
  bears: number;
  addABear: () => void;
}

const encryptedStorage: PersistStorage<BearState> = {
  getItem: (name: string) => {
    const storedValue = sessionStorage.getItem(name);
    if (storedValue) {
      const decryptedValue = decrypt(storedValue);
      return JSON.parse(decryptedValue);
    }
    return null;
  },
  setItem: (name: string, value: StorageValue<BearState>) => {
    const jsonValue = JSON.stringify(value);
    const encryptedValue = encrypt(jsonValue);
    sessionStorage.setItem(name, encryptedValue);
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  }
};

export const useBearStore = create<BearState>()(
  devtools(
    persist<BearState>(
      (set, get) => ({
        bears: 0,
        addABear: () => set({ bears: get().bears + 1 }),
      }),
      {
        name: 'food-storage',
        storage: encryptedStorage,
        // onRehydrateStorage: (state?: BearState, error?: unknown) => {
        //   if (error) {
        //     console.error('Failed to rehydrate state', error);
        //   } else {
        //     console.log('State has been rehydrated', state);
        //   }
        // },
      }
    )
  )
);

useBearStore.subscribe((state, prevState) => {
  console.log('State changed:', state);
  console.log('Previous state:', prevState);
});
