import { minidenticon } from "$lib/server/minidenticon";
import { addUserContext } from "$lib/store/actions/session.server";
import { getStore } from "$lib/store/getStore";
import { readAccount } from "$lib/store/api/read-account";

async function sha512(str: string) {
  return crypto.subtle.digest("SHA-512", new TextEncoder().encode(str)).then((buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((x) => ("00" + x.toString(16)).slice(-2))
      .join("")
  );
}

export function GET({ cookies, fetch }) {
  const { dispatch, getState } = getStore(undefined, fetch);

  return dispatch(addUserContext({ access_token: cookies.get("access_token") }))
    .unwrap()
    .then(() => {
      const selectAccount = readAccount.select({});
      const currentState = getState();
      const maybeAccountId = selectAccount(currentState).data?.id;
      const accountIdIsValid = typeof maybeAccountId === "string" && maybeAccountId.length;
      const accountId = accountIdIsValid ? maybeAccountId : "praise joko";
      return accountId.trim().toLowerCase();
    })
    .then(sha512)
    .then((hash) => {
      const identiconSvg = minidenticon(hash);

      return new Response(identiconSvg, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "max-age=31536000" },
      });
    });
}
