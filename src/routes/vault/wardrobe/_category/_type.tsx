import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";

import { demo, skinAdapter } from "../../../../features/store/api/read-skins";

const initialState = skinAdapter.getInitialState();

export function WardrobeCategoryType() {
  const { type } = useParams();
  const { currentData = initialState } = demo.useQuery({ type: type! });
  return (
    <Fragment>
      <h3>{type}</h3>
      <ul>
        {currentData.ids.map((backSkinId) => (
          <li key={backSkinId}>{currentData.entities[backSkinId]?.name}</li>
        ))}
      </ul>
    </Fragment>
  );
}
