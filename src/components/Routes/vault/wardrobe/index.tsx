import { Fragment, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { SkinId } from "./skinId";
import wardrobeClasses from "./wardrobe.module.css";

import vaultOutletClasses from "../outlet.module.css";

import { SkinContainer } from "../../../Containers/Skins/Container";
import elementsClasses from "../../../Elements/index.module.css";
import fieldsetClasses from "../../../Elements/input-pill.module.css";
import inputPillClasses from "../../../Elements/input-pill.module.css";
import hideClasses from "../../../Elements/Hide.module.css";
import { Query } from "../../../Query";
import { QueryError } from "../../../Query/Error";
import { QueryLoading } from "../../../Query/Loading";
import { QuerySuccess } from "../../../Query/Success";
import { QueryUninitialized } from "../../../Query/Uninitialized";

import { readAccountSkins } from "../../../../features/store/api/read-account-skins";
import { readSkinTypes } from "../../../../features/store/api/read-skin-types";
import { classNames } from "../../../../features/css/classnames";

const Components = {
  Armor: SkinContainer,
  Back: SkinContainer,
  Gathering: SkinContainer,
  Weapon: SkinContainer,
} as {
  [key: string]: (props: any) => JSX.Element;
};
const UnknownComponent = (props: any) => {
  return (
    <p>
      <FormattedMessage defaultMessage="Please select a wardrobe." />
    </p>
  );
};

export function Wardrobe() {
  const [searchParams, setSearchParams] = useSearchParams();
  const readAccountSkinsResult = readAccountSkins.useQuery({});
  const readSkinTypesResult = readSkinTypes.useQuery({});
  const activeSkinType =
    searchParams.get("Component") ?? readSkinTypesResult.data?.ids[0] ?? "";
  const ActiveComponent = Components[activeSkinType] ?? UnknownComponent;
  return (
    <Fragment>
      <Query result={readSkinTypesResult}>
        <h2
          className={classNames(
            elementsClasses["no-margin"],
            vaultOutletClasses["heading--2"]
          )}
        >
          <FormattedMessage defaultMessage="Wardrobe" />
        </h2>
        <main
          className={classNames(
            vaultOutletClasses["main"],
            wardrobeClasses["main"]
          )}
        >
          <div>
            <form
              onChange={(event) => {
                const formData = new FormData(event.currentTarget);
                const urlSearchParams = new URLSearchParams(formData as any);
                setSearchParams(urlSearchParams);
              }}
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <fieldset className={classNames(fieldsetClasses["fieldset"])}>
                <legend>
                  <FormattedMessage defaultMessage="Wardrobe" />
                </legend>
                <QueryUninitialized>
                  <p>
                    <FormattedMessage defaultMessage="Gwapo is waiting to load your wardrobe." />
                  </p>
                </QueryUninitialized>
                <QueryError>
                  <p>
                    <FormattedMessage defaultMessage="Gwapo encountered an error loading your wardrobe." />
                  </p>
                </QueryError>
                <QueryLoading>{null}</QueryLoading>
                <QuerySuccess>
                  {readSkinTypesResult.data?.ids.map((skinType) => (
                    <Fragment key={skinType}>
                      <input
                        checked={skinType === activeSkinType}
                        className={classNames(
                          hideClasses["hide"],
                          inputPillClasses["input"]
                        )}
                        id={`routes/vault/wardrobe/Wardrobe/Component/${skinType}`}
                        name="Component"
                        onChange={() => {}}
                        type="radio"
                        value={skinType}
                      />
                      <label
                        className={classNames(inputPillClasses["label"])}
                        htmlFor={`routes/vault/wardrobe/Wardrobe/Component/${skinType}`}
                      >
                        {skinType}
                      </label>
                    </Fragment>
                  ))}
                </QuerySuccess>
              </fieldset>
              <fieldset className={classNames(fieldsetClasses["fieldset"])}>
                <legend>
                  <FormattedMessage defaultMessage="Locked" />
                </legend>
                <Query result={readAccountSkinsResult}>
                  <QueryUninitialized>
                    GWAPO is waiting to load your account skins.
                  </QueryUninitialized>
                  <QueryLoading>
                    GWAPO is loading your account skins...
                  </QueryLoading>
                  <QueryError>
                    GWAPO encountered an error loading your account skins.
                  </QueryError>
                  <QuerySuccess>
                    <input
                      checked={searchParams.get("lockedFilter") === "locked"}
                      className={classNames(
                        hideClasses["hide"],
                        inputPillClasses["input"]
                      )}
                      id="components/Routes/vault/wardrobe/radio/locked"
                      name="lockedFilter"
                      onChange={() => {}}
                      type="radio"
                      value="locked"
                    />
                    <label
                      className={classNames(inputPillClasses["label"])}
                      htmlFor="components/Routes/vault/wardrobe/radio/locked"
                    >
                      Locked
                    </label>
                    <input
                      checked={searchParams.get("lockedFilter") === "unlocked"}
                      className={classNames(
                        hideClasses["hide"],
                        inputPillClasses["input"]
                      )}
                      id="components/Routes/vault/wardrobe/radio/unlocked"
                      name="lockedFilter"
                      onChange={() => {}}
                      type="radio"
                      value="unlocked"
                    />
                    <label
                      className={classNames(inputPillClasses["label"])}
                      htmlFor="components/Routes/vault/wardrobe/radio/unlocked"
                    >
                      Unlocked
                    </label>
                    <input
                      checked={
                        searchParams.get("lockedFilter") === null ||
                        searchParams.get("lockedFilter") === "any"
                      }
                      className={classNames(
                        hideClasses["hide"],
                        inputPillClasses["input"]
                      )}
                      id="components/Routes/vault/wardrobe/radio/any"
                      onChange={() => {}}
                      name="lockedFilter"
                      type="radio"
                      value="any"
                    />
                    <label
                      className={classNames(inputPillClasses["label"])}
                      htmlFor="components/Routes/vault/wardrobe/radio/any"
                    >
                      Any
                    </label>
                  </QuerySuccess>
                </Query>
              </fieldset>
              <QuerySuccess>
                {readSkinTypesResult.data?.entities[activeSkinType]?.ids.map(
                  (subType, index) => (
                    <Fragment key={subType}>
                      <fieldset
                        className={classNames(fieldsetClasses["fieldset"])}
                      >
                        <legend>{subType}</legend>
                        {readSkinTypesResult.data?.entities[activeSkinType]?.[
                          subType
                        ].map((choice, index) => (
                          <Fragment key={choice}>
                            <input
                              checked={
                                (searchParams.get(subType) === null &&
                                  index === 0) ||
                                searchParams.get(subType) === choice
                              }
                              className={classNames(
                                inputPillClasses["input"],
                                hideClasses["hide"]
                              )}
                              id={`routes/vault/wardrobe/Wardrobe/Component/${subType}/${choice}`}
                              name={subType}
                              onChange={() => {}}
                              type="radio"
                              value={choice}
                            />
                            <label
                              className={classNames(inputPillClasses["label"])}
                              htmlFor={`routes/vault/wardrobe/Wardrobe/Component/${subType}/${choice}`}
                            >
                              {choice}
                            </label>
                          </Fragment>
                        ))}
                      </fieldset>
                    </Fragment>
                  )
                )}
              </QuerySuccess>
            </form>
            <div style={{ height: "0.5em" }} />
            <QuerySuccess>
              <ActiveComponent />
            </QuerySuccess>
          </div>
          <SkinId />
        </main>
      </Query>
    </Fragment>
  );
}
