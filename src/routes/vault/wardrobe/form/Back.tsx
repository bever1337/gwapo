import { Fragment } from "react";

import accordionClasses from "../../../../components/Accordion/index.module.css";
import containerClasses from "../../../../components/Containers/Common/Container.module.css";
import containerItemClasses from "../../../../components/Containers/Common/ContainerItem.module.css";
import elementsClasses from "../../../../components/Elements/index.module.css";
import { classNames } from "../../../../features/css/classnames";
import {
  readSkins,
  skinAdapter,
} from "../../../../features/store/api/read-skins";

const initialArmorSkinsState = skinAdapter.getInitialState();

export function WardrobeBack() {
  const { data = initialArmorSkinsState } = readSkins.useQuery({
    type: "Back",
  });
  return (
    <Fragment>
      <section>
        <div className={classNames(accordionClasses["tab"])}>
          <h3
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            Back
          </h3>
        </div>
        <div className={classNames(accordionClasses["folder"])}>
          <ul
            className={classNames(
              containerClasses["container"],
              elementsClasses["no-margin"]
            )}
          >
            {data.ids.map((skinId) => (
              <li
                className={classNames(containerItemClasses["item"])}
                key={skinId}
              >
                <img
                  className={classNames(containerItemClasses["item__img"])}
                  alt={data.entities[skinId]?.name ?? ""}
                  src={data.entities[skinId]?.icon ?? ""}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Fragment>
  );
}
