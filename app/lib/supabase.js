import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vtqnwdftnbtemgwcjrut.supabase.co";
const supabaseAnonKey = "sb_publishable_vh4exa35bui-sCI8W4PNfg_BifbihSC";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
