import React from "react";

import { readTokenInfo } from "../store/api/read-token-info";

export function Authenticator() {
  const [initiate, result] = readTokenInfo.useMutation();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        initiate({ access_token: formData.get("access_token") as string });
      }}
    >
      <label>
        Access Token:
        <input
          name="access_token"
          placeholder="access token"
          required
          type="text"
        />
      </label>
      <input type="submit" />
    </form>
  );
}
