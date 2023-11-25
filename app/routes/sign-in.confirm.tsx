import { type LoaderFunctionArgs, redirect } from "@remix-run/deno";
import { type EmailOtpType } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import supabaseClient from "../supabase.server.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
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
