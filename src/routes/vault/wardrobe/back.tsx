import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { demo, skinAdapter } from "../../../features/store/api/read-skins";

const initialState = skinAdapter.getInitialState();

export function WardrobeBack() {
  const { data = initialState } = demo.useQuery({ type: "Back" });
  return (
    <Fragment>
      <h3>
        <FormattedMessage defaultMessage="Back" />
      </h3>
      <ul>
        {data.ids.map((backSkinId) => (
          <li key={backSkinId}>{data.entities[backSkinId]?.name}</li>
        ))}
      </ul>
    </Fragment>
  );
}
