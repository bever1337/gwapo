import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Outlet } from "react-router-dom";

import { WardrobeCategoryNavigation } from "../../../components/WardrobeTab/CategoryNavigation";
import {
  readSkinTypes,
  skinTypesAdapter,
} from "../../../features/store/api/read-skin-types";

const initialState = skinTypesAdapter.getInitialState();

export function WardrobeOutlet() {
  const { data: skinTypes = initialState } = readSkinTypes.useQuery({});
  // const readArmorWeightClassesResult = readArmorWeightClasses.useQuery({});
  return (
    <Fragment>
      <h2>
        <FormattedMessage defaultMessage="Wardrobe Storage" />
      </h2>
      <nav>
        <ul>
          {skinTypes.ids.map((skinType) => (
            <li key={skinType}>
              <WardrobeCategoryNavigation
                skinType={skinType as string}
                subtypes={skinTypes.entities[skinType]?.subtypes ?? []}
              />
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </Fragment>
  );
}
