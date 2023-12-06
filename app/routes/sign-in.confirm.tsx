import { type LoaderFunctionArgs } from "@remix-run/deno";
import { type EmailOtpType } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { verfiyToken } from "../supabase.server.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  return await verfiyToken(type, token_hash, request);
}
