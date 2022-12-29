import { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";

import { Dialog } from "../Dialog";

export function AppOutlet() {
  // declare string tempaltes outside JSX props for better syntax highlighting
  const homeImageSource = `${process.env.PUBLIC_URL}/icons/Buildings/home-2-fill.svg`;

  return (
    <Fragment>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link to="/">
          <img alt="Home" src={homeImageSource} />
          Gwapo
        </Link>
        <Dialog />
      </div>
      <hr />
      <Outlet />
    </Fragment>
  );
}