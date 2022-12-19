import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";

import { Option } from "./option";

import elementsClasses from "../Elements/index.module.css";
import { Query } from "../Query";
import { QueryError } from "../Query/Error";
import { QuerySuccess } from "../Query/Success";
import { QueryUninitialized } from "../Query/Uninitialized";

import { classNames } from "../../features/css/classnames";
import { readCharacters } from "../../features/store/api/read-characters";
import { QueryLoading } from "../Query/Loading";

const noop = () => {};
const characterNameToOption = (characterName: string) => (
  <Option key={characterName} characterName={characterName} />
);

export function SelectCharacter() {
  const selectElement = useRef<HTMLSelectElement>(null);
  const readCharactersResult = readCharacters.useQuery({});
  const authenticationError =
    readCharactersResult.error &&
    "status" in readCharactersResult.error &&
    readCharactersResult.error.status === 401;
  const characterName =
    new URLSearchParams(useLocation().search).get("select_character") ??
    readCharactersResult.data?.[0] ??
    "";

  return (
    <Query result={readCharactersResult}>
      <nav>
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
          <select
            form="routerMonoForm"
            name="select_character"
            onChange={noop}
            ref={selectElement}
            value={characterName}
          >
            {readCharactersResult.data?.map(characterNameToOption)}
          </select>
        </QuerySuccess>
      </nav>
    </Query>
  );
}
