import { Fragment } from "react";
import { Outlet } from "react-router-dom";

export function PveOutlet() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}
