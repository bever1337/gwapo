import { Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";

import skinContainerItemClasses from "./containerItem.module.css";

import containerItemClasses from "../Common/ContainerItem.module.css";

import { QuerySuccess } from "../../Query/Success";

import { classNames } from "../../../features/css/classnames";
import { readAccountSkins } from "../../../features/store/api/read-account-skins";
import type { Skin } from "../../../features/store/api/read-skins";

const lockImageSrc = `${process.env.PUBLIC_URL}/icons/System/lock-fill.svg`;

export function SkinContainerItem(props: { skin: Skin }) {
  const [urlSearchParams] = useSearchParams();
  urlSearchParams.set("skinId", `${props.skin.id}`);
  const readAccountSkinsResult = readAccountSkins.useQueryState({});
  const skinUnlocked =
    readAccountSkinsResult.data?.includes(props.skin.id) ?? false;
  return (
    <Fragment>
      <Link
        replace
        to={{
          hash: "#aside",
          search: `?${urlSearchParams.toString()}`,
        }}
        state={{ from: props.skin.id }}
      >
        <img
          className={classNames(
            containerItemClasses["item__img"],
            containerItemClasses[props.skin.rarity ?? ""]
          )}
          alt={props.skin.name ?? ""}
          src={props.skin.icon ?? ""}
        />
        <QuerySuccess>
          {skinUnlocked ? null : (
            <span className={classNames(containerItemClasses["item__count"])}>
              <img
                alt=""
                className={classNames(skinContainerItemClasses["unlock__icon"])}
                src={lockImageSrc}
              />
            </span>
          )}
        </QuerySuccess>
      </Link>
    </Fragment>
  );
}
