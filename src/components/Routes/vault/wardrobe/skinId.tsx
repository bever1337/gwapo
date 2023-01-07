import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import wardrobeClasses from "./wardrobe.module.css";

import vaultOutletClasses from "../outlet.module.css";

import containerItemClasses from "../../../Containers/Common/ContainerItem.module.css";
import elementsClasses from "../../../Elements/index.module.css";
import hideClasses from "../../../Elements/Hide.module.css";
import { Query } from "../../../Query";
import { QueryError } from "../../../Query/Error";
import { QueryLoading } from "../../../Query/Loading";
import { QuerySuccess } from "../../../Query/Success";
import { QueryUninitialized } from "../../../Query/Uninitialized";

import { classNames } from "../../../../features/css/classnames";
import { readSkins } from "../../../../features/store/api/read-skins";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function SkinId() {
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const backHref =
    (location.state?.from ? `#${location.state?.from}` : location.hash) || "";
  const skinDocumentId = useSearchParams()[0].get("skinId") ?? "";
  const readSkinsResult = readSkins.useQuery(
    skinDocumentId ? { key: skinDocumentId } : skipToken,
    { skip: !skinDocumentId }
  );
  const [skinId] = readSkinsResult.data?.ids ?? [];
  const currentSkin = readSkinsResult.data?.entities[skinId ?? ""];

  useEffect(() => {
    if (location.hash === "#aside") {
      contentRef.current?.scrollIntoView({
        behavior: "auto",
        inline: "end",
      });
    }
  }, [location.hash, location.key]);

  return (
    <aside
      className={classNames(
        vaultOutletClasses["aside"],
        wardrobeClasses["aside"],
        !skinDocumentId && hideClasses["hide--everywhere"]
      )}
      id="aside"
    >
      <div
        className={classNames(vaultOutletClasses["sticky"])}
        ref={contentRef}
      >
        <a href={backHref}>back</a>
        <Query result={readSkinsResult}>
          <QueryUninitialized>
            <p>GWAPO is waiting to load details for this skin.</p>
          </QueryUninitialized>
          <QueryError>
            <p>GWAPO encountered an error loading this skin.</p>
          </QueryError>
          <QueryLoading>
            <p>GWAPO is loading details about this skin.</p>
          </QueryLoading>
          <QuerySuccess>
            <table className={classNames(vaultOutletClasses["details__table"])}>
              <thead>
                <tr>
                  <th
                    className={classNames(
                      vaultOutletClasses["details__table__header"],
                      vaultOutletClasses["details__table__thead__header"]
                    )}
                    colSpan={2}
                  >
                    <h3 className={classNames(elementsClasses["no-margin"])}>
                      {currentSkin?.name}
                      <img
                        alt={currentSkin?.name ?? ""}
                        className={classNames(
                          containerItemClasses["item__img"],
                          vaultOutletClasses[
                            "details__table__thead__header__img"
                          ]
                        )}
                        src={
                          currentSkin ? currentSkin?.icon ?? errorImageSrc : ""
                        }
                      />
                    </h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th
                    className={classNames(
                      vaultOutletClasses["details__table__header"]
                    )}
                  >
                    Type
                  </th>
                  <td
                    className={classNames(
                      vaultOutletClasses["details__table__cell"]
                    )}
                  >
                    {currentSkin?.type}
                  </td>
                </tr>
                <tr>
                  <th
                    className={classNames(
                      vaultOutletClasses["details__table__header"]
                    )}
                  >
                    Rarity
                  </th>
                  <td
                    className={classNames(
                      vaultOutletClasses["details__table__cell"]
                    )}
                  >
                    {currentSkin?.rarity}
                  </td>
                </tr>
                <tr>
                  <th
                    className={classNames(
                      vaultOutletClasses["details__table__header"]
                    )}
                  >
                    Restrictions
                  </th>
                  <td
                    className={classNames(
                      vaultOutletClasses["details__table__cell"]
                    )}
                  >
                    {(currentSkin?.restrictions?.length ?? 0) > 0
                      ? currentSkin?.restrictions?.join(", ")
                      : "None"}
                  </td>
                </tr>
                <tr>
                  <th
                    className={classNames(
                      vaultOutletClasses["details__table__header"]
                    )}
                  >
                    Description
                  </th>
                  <td
                    className={classNames(
                      vaultOutletClasses["details__table__cell"]
                    )}
                  >
                    {currentSkin?.description}
                  </td>
                </tr>
              </tbody>
            </table>
          </QuerySuccess>
        </Query>
        <a href={backHref}>back</a>
      </div>
    </aside>
  );
}
