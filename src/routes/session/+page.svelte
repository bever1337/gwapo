<script lang="ts">
  import { skipToken } from "@reduxjs/toolkit/query";
  import { getAppSelector } from "$lib/store";
  import { readTokenInfo } from "$lib/store/api/read-token-info";
  import { selectClient } from "$lib/store/api/selectors";

  const clientAccess$ = getAppSelector(selectClient);
  const readTokenInfo$ = readTokenInfo.query(skipToken, { skip: true });
  $: readTokenInfo$.next(
    $clientAccess$.access_token ? { access_token: $clientAccess$.access_token } : skipToken,
    { skip: !$clientAccess$.access_token }
  );
  $: ({
    isError,
    /** sub-state of isError or isSuccess */
    isFetching,
    isLoading,
    isSuccess,
    isUninitialized,
  } = $readTokenInfo$);
</script>

{#if $clientAccess$.access_token !== null}
  <form action="/session?/logout" method="POST">
    <button disabled={isFetching || isLoading} type="submit"> sign out </button>
  </form>
{:else}
  <form action="/session?/login" method="POST">
    <input
      disabled={isFetching || isLoading}
      id="access_token"
      name="access_token"
      required
      type="text"
    />
    <button disabled={isFetching || isLoading} type="submit"> sign in </button>
  </form>
{/if}
