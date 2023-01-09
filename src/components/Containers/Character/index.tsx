import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { CharacterBagContainer } from "./Container";

import containerClasses from "../Common/Container.module.css";
import { ContainerItem } from "../Common/ContainerItem";

import { AccordionHeading } from "../../Accordion/Heading";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import { Iif } from "../../Iif";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryFetching } from "../../Query/Fetching";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import { readCharacters } from "../../../features/store/api/read-characters";
import { readCharactersInventory } from "../../../features/store/api/read-characters-inventory";
import { selectCharacterName } from "../../../features/store/ui/slice";

const emptyCharacterBag = new Array(15)
  .fill(null)
  .map((_null, index) => <ContainerItem containerItem={null} key={index} />);

export function CharacterBags() {
  readCharacters.useQuerySubscription({});
  const characterName = useSelector(selectCharacterName);
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
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading>{null}</AccordionHeading>
        </div>
        <div className={classNames(accordionClasses["folder"])}>
          <p className={classNames(elementsClasses["no-margin"])}>
            <FormattedMessage defaultMessage="GWAPO is waiting to load your character's inventory" />
          </p>
        </div>
      </QueryUninitialized>
      <QueryError>
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading>{null}</AccordionHeading>
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
      </QueryError>
      <QueryLoading>
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading>{null}</AccordionHeading>
        </div>
        <ol
          className={classNames(
            accordionClasses["folder"],
            containerClasses["container"],
            elementsClasses["no-margin"]
          )}
        >
          {emptyCharacterBag}
        </ol>
      </QueryLoading>
      <QuerySuccess>
        <QueryFetching>
          <div className={classNames(accordionClasses["tab"])}>
            <AccordionHeading>{null}</AccordionHeading>
          </div>
          <ol
            className={classNames(
              accordionClasses["folder"],
              containerClasses["container"],
              elementsClasses["no-margin"]
            )}
          >
            {emptyCharacterBag}
          </ol>
        </QueryFetching>
        <Iif condition={!readCharactersInventoryResult.isFetching}>
          {readCharactersInventoryResult.currentData?.map((bag, index) => {
            if (!bag) return null;
            return (
              <CharacterBagContainer
                bagIndex={index}
                characterBag={bag}
                key={index}
              />
            );
          })}
        </Iif>
      </QuerySuccess>
    </Query>
  );
}
