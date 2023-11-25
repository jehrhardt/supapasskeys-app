import React, { useState } from "react";
import supabaseClient from "../supabase.server.ts";
import { ActionFunctionArgs, redirect } from "@remix-run/deno";
import { Form, useNavigation } from "@remix-run/react";

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/sign-in";

  return (
    <Form method="post">
      <label>
        Email:
        <input name="email" type="email" />
      </label>
      <br />
      <button type="submit">
        {isSubmitting ? "Signing in …" : "Sign in"}
      </button>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const headers = new Headers();
  const supabase = await supabaseClient(request, headers);
  console.log("Email: ", email);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: "http://localhost:8000/",
    },
  });

  if (error) {
    console.error(error);
    return redirect("/sign-in/error", { headers });
  }

  return redirect("/sign-in/verify", { headers });
}
