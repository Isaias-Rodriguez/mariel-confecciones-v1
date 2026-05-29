const SUPABASE_URL = "https://wdfxqnjmcadnbezhuyax.supabase.co";
const SUPABASE_KEY = "sb_publishable_of5kytxmerexE8PAFrTxGQ_f93TVHHw";

if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}