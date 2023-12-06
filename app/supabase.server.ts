import {
  createServerClient,
  parse,
  serialize,
} from "https://esm.sh/@supabase/ssr@0.0.10";
import {
  EmailOtpType,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/deno";

type User = {
  email: string;
};

export async function requireUser(request: LoaderFunctionArgs): Promise<User> {
  const headers = new Headers();
  const supabase = await supabaseClient(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user || !user.email) {
    throw redirect("/sign-in", { headers });
  }
  return { email: user.email };
}

export async function signUp(
  email: string,
  request: ActionFunctionArgs,
  headers: Headers,
) {
  const supabase = await supabaseClient(request, headers);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: "http://localhost:8000/",
    },
  });

  if (error) {
    console.log("Error signing up: ", error);
    return { errors: { email: "Sign-up failed" } };
  }

  return { ok: true };
}

export async function verfiyToken(
  type: EmailOtpType | null,
  token_hash: string | null,
  request: LoaderFunctionArgs,
) {
  const headers = new Headers();
  if (token_hash && type) {
    const supabase = await supabaseClient(request, headers);
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      console.log("User verified");
      return redirect("/", { headers });
    }
    console.log("User not verified, error: ", error);
  }

  return redirect("/sign-in", { headers });
}

async function supabaseClient(
  request: ActionFunctionArgs | LoaderFunctionArgs,
  headers: Headers,
  // deno-lint-ignore no-explicit-any
): Promise<SupabaseClient<any, "public", any>> {
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const env = await load();
  const supabaseUrl = env["SUPABASE_URL"];
  const supabaseAnonKey = env["SUPABASE_ANON_KEY"];

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append("Set-Cookie", serialize(key, value, options));
      },
      remove(key, options) {
        headers.append("Set-Cookie", serialize(key, "", options));
      },
    },
  });
}
