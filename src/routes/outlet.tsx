import { Fragment, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";

import { Authenticator } from "../components/authenticator";
import hideClasses from "../components/HideA11y/index.module.css";
import { classNames } from "../features/css/classnames";

export function AppOutlet() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      dialog?.close();
    };
  }, []);
  const formId = "/routes/outlet/AppOutlet/dialog";
  // declare string tempaltes outside JSX props for better syntax highlighting
  const homeImageSource = `${process.env.PUBLIC_URL}/icons/Buildings/home-2-fill.svg`;
  const settingsImageSource = `${process.env.PUBLIC_URL}/icons/System/settings-3-fill.svg`;
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
        <button
          onClick={() => {
            dialogRef.current?.showModal();
          }}
          type="button"
        >
          <img alt="Settings" src={settingsImageSource} />
        </button>
      </div>
      <dialog ref={dialogRef}>
        <form id={formId} method="dialog" />
        <button form={formId} type="submit">
          x
        </button>
        <Authenticator />
        <hr />
        <button form={formId} type="submit">
          done
        </button>
      </dialog>
      <hr />
      <Outlet />
    </Fragment>
  );
}
