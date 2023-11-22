import { createServerClient, parse, serialize } from "https://esm.sh/@supabase/ssr@0.0.10";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
import { ActionFunctionArgs } from "@remix-run/deno";

// deno-lint-ignore no-explicit-any
export default async function supabaseClient(request: ActionFunctionArgs, headers: Headers): Promise<SupabaseClient<any, "public", any>> {
  const cookies = parse(request.headers.get('Cookie') ?? '')

  const env = await load();
  const supabaseUrl = env["SUPABASE_URL"];
  const supabaseAnonKey = env["SUPABASE_ANON_KEY"];

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key) {
        return cookies[key]
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options))
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options))
      },
    },
  })
}
