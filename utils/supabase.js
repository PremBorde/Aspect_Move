import { createClient } from "@supabase/supabase-js";

// In-memory safe storage adapter to prevent Expo Go AsyncStorage native module errors
const MemoryStorage = {
  data: new Map(),
  getItem: (key) => MemoryStorage.data.get(key) || null,
  setItem: (key, value) => {
    MemoryStorage.data.set(key, value);
  },
  removeItem: (key) => {
    MemoryStorage.data.delete(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: MemoryStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
