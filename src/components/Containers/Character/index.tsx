import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";

import { CharacterBagContainer } from "./Container";

import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import materialsClasses from "../../materials.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryFetching } from "../../Query/Fetching";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";
import { VaultItem } from "../../vault-item";

import { classNames } from "../../../features/css/classnames";
import { readCharacters } from "../../../features/store/api/read-characters";
import { readCharactersInventory } from "../../../features/store/api/read-characters-inventory";

const emptyCharacterBag = new Array(15)
  .fill(null)
  .map((_null, index) => <VaultItem accountBankItem={null} key={index} />);

export function CharacterBags() {
  const readCharactersResult = readCharacters.useQuery({});
  const characterName =
    new URLSearchParams(useLocation().search).get("select_character") ??
    readCharactersResult.data?.[0] ??
    "";
  const readCharactersInventoryResult = readCharactersInventory.useQuery(
    characterName ? { characterName: characterName } : skipToken,
    { skip: !characterName }
  );
  const authenticationError =
    readCharactersInventoryResult.error &&
    "status" in readCharactersInventoryResult.error &&
    readCharactersInventoryResult.error.status === 401;

  return (
    <Query result={readCharactersInventoryResult}>
      <QueryUninitialized>
        <section
          className={classNames(materialsClasses["materials__inline-wrapper"])}
        >
          <div className={classNames(accordionClasses["tab"])}>
            <h2
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              {""}
            </h2>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              <FormattedMessage defaultMessage="GWAPO is waiting to load your character's inventory" />
            </p>
          </div>
        </section>
      </QueryUninitialized>
      <QueryError>
        <section
          className={classNames(materialsClasses["materials__inline-wrapper"])}
        >
          <div className={classNames(accordionClasses["tab"])}>
            <h2
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              {""}
            </h2>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              {authenticationError ? (
                <FormattedMessage defaultMessage="Please provide GWAPO an API token with the necessary scopes." />
              ) : (
                <FormattedMessage defaultMessage="GWAPO encountered an error loading your character's inventory." />
              )}
            </p>
          </div>
        </section>
      </QueryError>
      <QueryFetching>
        <section
          className={classNames(materialsClasses["materials__inline-wrapper"])}
        >
          <div className={classNames(accordionClasses["tab"])}>
            <h2
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              {""}
            </h2>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <ol className={classNames(materialsClasses["materials__list"])}>
              {emptyCharacterBag}
            </ol>
          </div>
        </section>
      </QueryFetching>
      <QuerySuccess>
        {(readCharactersInventoryResult.currentData ?? []).map((bag, index) => (
          <CharacterBagContainer
            bagIndex={index}
            characterBag={bag}
            key={index}
          />
        ))}
      </QuerySuccess>
    </Query>
  );
}
