import React from "react";

export default function SignInVerify() {
  return (
    <>
      <p>Enter the code you received in your email:</p>
      <form method="post">
        <label>
          Code:
          <input type="text" />
        </label>
        <br />
        <button type="submit">Verify</button>
      </form>
    </>
  );
}
