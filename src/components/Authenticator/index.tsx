import { Fragment, createElement, useState } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { AccordionControl } from "../Accordion/Control";
import { AccordionHeading } from "../Accordion/Heading";
import accordionClasses from "../Accordion/index.module.css";
import flexFormClasses from "../Elements/flex-form.module.css";
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

// const AuthenticatorStateMessages = defineMessages({
//   [AuthenticatorState[AuthenticatorState.Unauthenticated]]: {
//     defaultMessage: "Logged out",
//   },
//   [AuthenticatorState[AuthenticatorState.Loading]]: {
//     defaultMessage: "Loading",
//   },
//   [AuthenticatorState[AuthenticatorState.Error]]: {
//     defaultMessage: "Error",
//   },
//   [AuthenticatorState[AuthenticatorState.Authenticated]]: {
//     defaultMessage: "Logged in",
//   },
// });

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
      <div className={classNames(accordionClasses["tab"])}>
        <AccordionHeading onChange={setOpen}>
          <FormattedMessage defaultMessage="Authentication" />
        </AccordionHeading>
        {/* <span className={classNames(accordionClasses["tab__aside"])}>
          {createElement(
            FormattedMessage,
            AuthenticatorStateMessages[AuthenticatorState[authenticatorState]]
          )}
        </span> */}
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <div
        className={classNames(
          accordionClasses["folder"],
          !open && hideClasses["hide"]
        )}
      >
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
                    <a
                      href="https://account.arena.net/applications"
                      target="ArenaNet"
                    >
                      {content}
                      <img
                        alt="External link"
                        className={classNames(
                          flexFormClasses["link__icon--external"]
                        )}
                        src={externalLinkImageSource}
                      />
                    </a>
                  ),
                  gw2WikiLink: (content) => (
                    <a
                      href="https://wiki.guildwars2.com/wiki/API:API_key"
                      target="Gw2Wiki"
                    >
                      {content}
                      <img
                        alt="External link"
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
            <p>
              <FormattedMessage
                defaultMessage={`Successfully authenticated your API key, "{name}." GWAPO is authorized to read the following: {permissions}.`}
                values={{
                  name: client?.name ?? "",
                  permissions:
                    // client is read-only, sort is applied in-place,
                    // must create a new reference
                    [...(client?.permissions ?? [])]
                      .sort((a, b) => `${a}`.localeCompare(`${b}`))
                      .join(", "),
                }}
              />
            </p>
            <p>
              <FormattedMessage
                defaultMessage={
                  "Manage API keys on your <arenanetLink>ArenaNet account page</arenanetLink>."
                }
                values={{
                  arenanetLink: (content) => (
                    <a
                      href="https://account.arena.net/applications"
                      target="ArenaNet"
                    >
                      {content}
                      <img
                        alt="External link"
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
            <div className={classNames(flexFormClasses["form__flex"])}>
              <button
                className={classNames(flexFormClasses["form__flex__submit"])}
                type="reset"
              >
                <FormattedMessage defaultMessage="Log Out" />
              </button>
            </div>
          </Iif>
        </form>
      </div>
    </Fragment>
  );
}
