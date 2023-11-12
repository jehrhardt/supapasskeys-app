import * as React from "react";
import type { MetaFunction } from "@remix-run/deno";

export const meta: MetaFunction = () => {
  return [
    { title: "Supapasskeys" },
  ];
};

export default function Index() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello Passkeys!
    </h1>
  );
}
