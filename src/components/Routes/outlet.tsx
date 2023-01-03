import { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";

import { Settings } from "../Settings";

export function AppOutlet() {
  // declare string tempaltes outside JSX props for better syntax highlighting
  const homeImageSource = `${process.env.PUBLIC_URL}/icons/Buildings/home-2-fill.svg`;

  return (
    <Fragment>
      <header
        style={{
          alignItems: "center",
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        <Link to="/">
          <img alt="Home" src={homeImageSource} />
          Gwapo
        </Link>
        <Settings />
      </header>
      <Outlet />
    </Fragment>
  );
}
