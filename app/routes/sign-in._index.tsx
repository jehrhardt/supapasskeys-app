import React, { useState } from "react";
import { signUp } from "../supabase.server.ts";
import { ActionFunctionArgs, json } from "@remix-run/deno";
import { Form, useActionData, useNavigation } from "@remix-run/react";

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/sign-in";
  const { data, errors } = useActionData<typeof action>();

  return (
    <>
      {data?.email
        ? (
          <p>
            A sign in link has been sent to{" "}
            {data.email}. Click the link to sign in.
          </p>
        )
        : (
          <Form method="post">
            <label>
              Email:
              {errors?.email ? <span>{errors.email}</span> : null}
              <input name="email" type="email" />
            </label>
            <br />
            <button type="submit">
              {isSubmitting ? "Signing in …" : "Sign in"}
            </button>
          </Form>
        )}
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const email = formData.get("email");
      const headers = new Headers();
      const { errors } = await signUp(email, request, headers);
      if (errors) {
        return json(errors);
      }
      return { data: { email } };
    }
    default:
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });
  }
}
