import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { SkinContainer } from "../../Containers/Skins/Container";
import fieldsetClasses from "../../Elements/input-pill.module.css";
import inputPillClasses from "../../Elements/input-pill.module.css";
import hideClasses from "../../Elements/Hide.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { readSkinTypes } from "../../../features/store/api/read-skin-types";
import { classNames } from "../../../features/css/classnames";

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
  const readSkinTypesResult = readSkinTypes.useQuery({});
  const activeSkinType =
    searchParams.get("Component") ?? readSkinTypesResult.data?.ids[0] ?? "";
  const ActiveComponent = Components[activeSkinType] ?? UnknownComponent;
  return (
    <Fragment>
      <Query result={readSkinTypesResult}>
        <h1>
          <FormattedMessage defaultMessage="Vault" />
        </h1>
        <h2>
          <FormattedMessage defaultMessage="Wardrobe" />
        </h2>
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
          <QuerySuccess>
            {readSkinTypesResult.data?.entities[activeSkinType]?.ids.map(
              (subType, index) => (
                <Fragment key={subType}>
                  <fieldset className={classNames(fieldsetClasses["fieldset"])}>
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
        <QuerySuccess>
          <div style={{ height: "0.5em" }} />
          <ActiveComponent />
        </QuerySuccess>
      </Query>
    </Fragment>
  );
}
