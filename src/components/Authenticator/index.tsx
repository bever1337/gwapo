import { Fragment, createElement, useState } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import authenticatorClasses from "./index.module.css";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import flexFormClasses from "../Elements/flex-form.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../Elements/Hide.module.css";
import { Iif } from "../Iif";

import { classNames } from "../../features/css/classnames";
import { readTokenInfo } from "../../features/store/api/read-token-info";
import { useAppDispatch } from "../../features/store/hooks";
import type { ClientState } from "../../features/store/initial-state";
import { selectClient } from "../../features/store/selectors";
import { logoutThunk } from "../../features/store/thunks/logout";

enum AuthenticatorState {
  Unauthenticated,
  Loading,
  Error,
  Authenticated,
}

const AuthenticatorStateMessages = defineMessages({
  [AuthenticatorState[AuthenticatorState.Unauthenticated]]: {
    defaultMessage: "Logged out",
  },
  [AuthenticatorState[AuthenticatorState.Loading]]: {
    defaultMessage: "Loading",
  },
  [AuthenticatorState[AuthenticatorState.Error]]: {
    defaultMessage: "Error",
  },
  [AuthenticatorState[AuthenticatorState.Authenticated]]: {
    defaultMessage: "Logged in",
  },
});

function deriveAuthenticatorState(
  client: ClientState["access"],
  mutationResult: { isError: boolean; isLoading: boolean }
) {
  if (client === null) {
    if (mutationResult.isLoading === true) {
      return AuthenticatorState.Loading;
    } else if (mutationResult.isError === true) {
      return AuthenticatorState.Error;
    }
    return AuthenticatorState.Unauthenticated;
  }
  return AuthenticatorState.Authenticated;
}

export function Authenticator() {
  const [open, setOpen] = useState(true); // accordion state
  const dispatch = useAppDispatch();
  const client = useSelector(selectClient).access;
  const [initiate, mutationResult] = readTokenInfo.useMutation();
  const authenticatorState = deriveAuthenticatorState(client, mutationResult);
  const externalLinkImageSource = `${process.env.PUBLIC_URL}/icons/System/external-link-fill.svg`;
  return (
    <Fragment>
      <form
        onReset={(event) => {
          dispatch(logoutThunk);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          initiate({ access_token: formData.get("access_token") as string });
        }}
      >
        <div className={classNames(accordionClasses["tab"])}>
          <h3
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            <FormattedMessage defaultMessage="Authentication" />
          </h3>
          <span className={classNames(accordionClasses["tab__aside"])}>
            {createElement(
              FormattedMessage,
              AuthenticatorStateMessages[AuthenticatorState[authenticatorState]]
            )}
          </span>
          <AccordionControl onChange={setOpen} open={open} />
        </div>
        <div
          className={classNames(
            accordionClasses["folder"],
            !open && hideClasses["hide"]
          )}
        >
          <Iif
            condition={authenticatorState < AuthenticatorState.Authenticated}
          >
            <div className={classNames(flexFormClasses["form__flex"])}>
              <FormattedMessage defaultMessage="API Key">
                {(apiKey) => (
                  <Fragment>
                    <label htmlFor="components/Authenticator/access_token">
                      {apiKey}
                    </label>
                    <input
                      className={classNames(
                        flexFormClasses["form__flex__input"]
                      )}
                      disabled={
                        authenticatorState === AuthenticatorState.Loading
                      }
                      id="components/Authenticator/access_token"
                      name="access_token"
                      // type is technically ReactNode, calling toString() to satisfy typescript
                      placeholder={`${apiKey}`}
                      required
                      type="text"
                    />
                  </Fragment>
                )}
              </FormattedMessage>
              <button
                className={classNames(flexFormClasses["form__flex__submit"])}
                disabled={authenticatorState === AuthenticatorState.Loading}
                type="submit"
              >
                <FormattedMessage defaultMessage="Authenticate" />
              </button>
            </div>
            <p>
              <FormattedMessage
                defaultMessage={`\
                To login, provide an API key from your <arenanetLink>ArenaNet account page</arenanetLink>, \
                or read more on the <gw2WikiLink>Guild Wars 2 wiki</gw2WikiLink>.\
              `}
                values={{
                  arenanetLink: (content) => (
                    <a href="https://account.arena.net/applications">
                      {content}
                      <img
                        alt=""
                        className={classNames(
                          flexFormClasses["link__icon--external"]
                        )}
                        src={externalLinkImageSource}
                      />
                    </a>
                  ),
                  gw2WikiLink: (content) => (
                    <a href="https://wiki.guildwars2.com/wiki/API:API_key">
                      {content}
                      <img
                        alt=""
                        className={classNames(
                          flexFormClasses["link__icon--external"]
                        )}
                        src={externalLinkImageSource}
                      />
                    </a>
                  ),
                }}
              />
            </p>
          </Iif>
          <Iif
            condition={authenticatorState === AuthenticatorState.Authenticated}
          >
            <table>
              <tbody>
                <tr>
                  <th
                    className={classNames(authenticatorClasses["th"])}
                    scope="row"
                  >
                    <FormattedMessage defaultMessage="API Key" />
                  </th>
                  <td>{client?.name}</td>
                </tr>
                <tr>
                  <th
                    className={classNames(authenticatorClasses["th"])}
                    scope="row"
                  >
                    <FormattedMessage defaultMessage="Type" />
                  </th>
                  <td>{client?.type}</td>
                </tr>
                <tr>
                  <th
                    className={classNames(authenticatorClasses["th"])}
                    colSpan={2}
                    scope="col"
                  >
                    <FormattedMessage defaultMessage="Permissions" />
                  </th>
                </tr>
                <tr>
                  <td colSpan={2}>
                    {
                      // client is read-only, sort is applied in-place,
                      // must create a new reference
                      [...(client?.permissions ?? [])]
                        .sort((a, b) => `${a}`.localeCompare(`${b}`))
                        .join(", ")
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={classNames(flexFormClasses["form__flex"])}>
              <button
                className={classNames(flexFormClasses["form__flex__submit"])}
                type="reset"
              >
                <FormattedMessage defaultMessage="Log Out" />
              </button>
            </div>
          </Iif>
        </div>
      </form>
    </Fragment>
  );
}
