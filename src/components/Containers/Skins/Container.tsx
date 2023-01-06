import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSearchParams } from "react-router-dom";

import { SkinContainerItem } from "./ContainerItem";

import containerClasses from "../Common/Container.module.css";
import containerItemClasses from "../Common/ContainerItem.module.css";

import { AccordionHeading } from "../../Accordion/Heading";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../Elements/Hide.module.css";
import { Query } from "../../Query";

import { classNames } from "../../../features/css/classnames";
import { readAccountSkins } from "../../../features/store/api/read-account-skins";
import { readSkinTypes } from "../../../features/store/api/read-skin-types";
import { readSkins } from "../../../features/store/api/read-skins";

export function SkinContainer() {
  const [urlSearchParams] = useSearchParams();
  const readAccountSkinsResult = readAccountSkins.useQuery({});
  const readSkinTypesResult = readSkinTypes.useQuery({});
  const activeSkinType =
    urlSearchParams.get("Component") ??
    (readSkinTypesResult.data?.ids[0] as string) ??
    "";
  const skinTypePartials = readSkinTypesResult.data?.entities[
    activeSkinType
  ]?.ids?.map(
    (skinKey) =>
      urlSearchParams.get(skinKey as string) ??
      readSkinTypesResult.data?.entities[activeSkinType]?.[skinKey]?.[0] ??
      ""
  );
  if (skinTypePartials?.length === 0) {
    skinTypePartials.push(activeSkinType);
  }
  const skip = !skinTypePartials || skinTypePartials.length === 0;
  const { currentData } = readSkins.useQuery(
    skip ? skipToken : { type: skinTypePartials?.join("_") ?? "" },
    { skip }
  );
  const lockedFilter = urlSearchParams.get("lockedFilter") ?? "any";

  return (
    <section>
      <div className={classNames(accordionClasses["tab"])}>
        <AccordionHeading>
          {/** Tab applies extra styles when it's empty. Doing extra work to ensure heading is not a single white-space */}
          {skinTypePartials?.filter((v) => !!v).join(", ")}
        </AccordionHeading>
      </div>
      <div className={classNames(accordionClasses["folder"])}>
        <ul
          className={classNames(
            containerClasses["container"],
            elementsClasses["no-margin"]
          )}
        >
          <Query result={readAccountSkinsResult}>
            {currentData?.ids.map((skinId) => {
              let lockedClassName = "";
              if (readAccountSkinsResult.isSuccess) {
                const skinIsUnlocked = readAccountSkinsResult.data?.includes(
                  skinId as number
                );
                if (lockedFilter === "locked" && skinIsUnlocked) {
                  lockedClassName = hideClasses["hide--everywhere"];
                } else if (lockedFilter === "unlocked" && !skinIsUnlocked) {
                  lockedClassName = hideClasses["hide--everywhere"];
                }
              }
              return (
                <li
                  className={classNames(
                    containerItemClasses["item"],
                    lockedClassName
                  )}
                  id={`${skinId}`}
                  key={skinId}
                >
                  <SkinContainerItem skin={currentData?.entities[skinId]!} />
                </li>
              );
            })}
          </Query>
        </ul>
      </div>
    </section>
  );
}
