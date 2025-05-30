import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://xdqevezazwvadambeqmz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcWV2ZXphend2YWRhbWJlcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODMzMDAsImV4cCI6MjA2MzY1OTMwMH0.c0NbFr-T5xKFa9vyAvd4D4XFt6G9JEOA8_nQPZ_o_5M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    enabled: false,
  },
});
