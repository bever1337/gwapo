import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";

import inputPillClasses from "../Elements/input-pill.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../HideA11y/index.module.css";
import { Query } from "../Query";
import { QueryError } from "../Query/Error";
import { QuerySuccess } from "../Query/Success";
import { QueryUninitialized } from "../Query/Uninitialized";

import { classNames } from "../../features/css/classnames";
import { readCharacters } from "../../features/store/api/read-characters";
import { QueryLoading } from "../Query/Loading";

const noop = () => {};
const MAX_CHARACTERS = 5;

/**
 * Maximum number of character slots is between 69 and 72.
 */
export function SelectCharacter(props: any) {
  const [searchInputValue, setSearchInputValue] = useState("");
  const readCharactersResult = readCharacters.useQuery({});
  const authenticationError =
    readCharactersResult.error &&
    "status" in readCharactersResult.error &&
    readCharactersResult.error.status === 401;

  const [searchParams, setSearchParams] = useSearchParams();

  const characterNameState =
    searchParams.get("select_character") ??
    readCharactersResult.data?.[0] ??
    "";

  let visibleCount = 0;
  return (
    <Query result={readCharactersResult}>
      <form
        onChange={(event) => {
          // TODO, it would be convenient to persist these params when routing between /vault and /vault/materials
          setSearchParams(
            new URLSearchParams(new FormData(event.currentTarget) as any)
          );
        }}
        onReset={(event) => {
          event.preventDefault();
          setSearchInputValue("");
        }}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <fieldset>
          <legend>
            <FormattedMessage defaultMessage="Character" />
          </legend>
          <QueryUninitialized>
            <FormattedMessage defaultMessage="GWAPO is waiting to load your characters." />
          </QueryUninitialized>
          <QueryError>
            <p className={classNames(elementsClasses["no-margin"])}>
              {authenticationError ? (
                <FormattedMessage defaultMessage="Please provide GWAPO an API token with the necessary scopes." />
              ) : (
                <FormattedMessage defaultMessage="GWAPO encountered an error loading your characters." />
              )}
            </p>
          </QueryError>
          <QueryLoading>
            <FormattedMessage defaultMessage="GWAPO is loading your characters." />
          </QueryLoading>
          <QuerySuccess>
            <label>
              filter
              <input
                onChange={(event) => {
                  setSearchInputValue(event.target.value);
                }}
                placeholder="Character name"
                type="text"
                value={searchInputValue}
              />
              <button type="reset">reset</button>
            </label>
            <br />
            {readCharactersResult.data?.map((characterName) => {
              const inputId = `components/SelectCharacter/option/${characterName}`;
              const isChecked = characterName === characterNameState;
              const isSimpleMatch = `${characterName}`
                .toLowerCase()
                .includes(`${searchInputValue}`.toLowerCase());
              const visible =
                isChecked /* active state */ ||
                (visibleCount < MAX_CHARACTERS &&
                  (searchInputValue.length === 0 /* no search input */ ||
                    isSimpleMatch)); /* assumes search input length */
              if (visible) {
                visibleCount += 1;
              }
              return (
                <Fragment>
                  <input
                    checked={isChecked}
                    className={classNames(
                      hideClasses["hide"],
                      inputPillClasses["input"]
                    )}
                    disabled={!visible}
                    id={inputId}
                    name="select_character"
                    onChange={noop}
                    type="radio"
                    value={characterName}
                  />
                  <label
                    className={classNames(
                      !visible && hideClasses["hide"],
                      inputPillClasses["label"]
                    )}
                    htmlFor={inputId}
                  >
                    {characterName}
                  </label>
                </Fragment>
              );
            })}
            {!searchInputValue &&
              visibleCount < (readCharactersResult.data?.length ?? 0) && (
                <p>
                  <FormattedMessage
                    defaultMessage="{count} hidden characters. Filter your characters by name."
                    values={{
                      count:
                        (readCharactersResult.data?.length ?? 0) - visibleCount,
                    }}
                  />
                </p>
              )}
          </QuerySuccess>
        </fieldset>
      </form>
    </Query>
  );
}
