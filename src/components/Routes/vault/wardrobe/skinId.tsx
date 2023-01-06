import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import wardrobeClasses from "./wardrobe.module.css";

import vaultOutletClasses from "../outlet.module.css";

import hideClasses from "../../../Elements/Hide.module.css";

import { classNames } from "../../../../features/css/classnames";

export function SkinId() {
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const skinId = useSearchParams()[0].get("skinId") ?? "";

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
        !skinId && hideClasses["hide--everywhere"]
      )}
      id="aside"
    >
      <div
        className={classNames(vaultOutletClasses["sticky"])}
        ref={contentRef}
      >
        <a
          href={
            (location.state?.from
              ? `#${location.state?.from}`
              : location.hash) || ""
          }
        >
          back
        </a>
        <p>👷Under Construction👷</p>
        <a
          href={
            (location.state?.from
              ? `#${location.state?.from}`
              : location.hash) || ""
          }
        >
          back
        </a>
      </div>
    </aside>
  );
}
