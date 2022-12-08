import React from "react";

import classes from "./material.module.css";

interface ISkins {
  id: number;
  icon: string;
  name: string;
  rarity: string;
}

export function Skin({ skin }: { skin: ISkins }) {
  return (
    <li className={[classes["material__item"]].join(" ")}>
      <img
        className={[classes["material__img"]].join(" ")}
        alt={skin.name}
        src={skin.icon}
      />
      {/* {typeof accountMaterial?.count === "number" ? (
        <Link
          to={`${material.id}`}
          className={[classes["material__count"]].join(" ")}
        >
          {accountMaterial.count}
        </Link>
      ) : null}
      <Routes>
        <Route
          element={
            <dialog open style={{ position: "absolute", zIndex: 1 }}>
              <form method="dialog">
                <button type="submit">x</button>
              </form>
              <h3>{material.name}</h3>
              <p>{accountMaterial?.count ?? "unknown"} in bank</p>
            </dialog>
          }
          path={`${material.id}`}
        />
      </Routes> */}
    </li>
  );
}
