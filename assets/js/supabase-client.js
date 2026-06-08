import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://jyrekylzltkffuvllxfu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7nQYUq3jkvRPMeYxPHHgXg_sD5dhu4j";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);