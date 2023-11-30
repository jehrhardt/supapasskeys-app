import React, { useState } from "react";
import { signUp } from "../supabase.server.ts";
import { ActionFunctionArgs, json, redirect } from "@remix-run/deno";
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
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const email = formData.get("email");
      return await signUp(email, request);
    }
    default:
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });
  }
}
