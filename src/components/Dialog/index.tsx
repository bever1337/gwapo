/**
 * Design challenge! This ain't a general-purpose dialog
 * This application will have ONE dialog element 🧠
 */
import React, { Fragment, useRef } from "react";
import { FormattedMessage } from "react-intl";

import dialogClasses from "./index.module.css";

import { Authenticator } from "../Authenticator";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../Elements/Hide.module.css";
import { Installer } from "../Installer";

import { classNames } from "../../features/css/classnames";

/** */
export function Dialog(props: any) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // declare string tempaltes outside JSX props for better syntax highlighting
  const closeImageSource = `${process.env.PUBLIC_URL}/icons/System/close-fill.svg`;
  const settingsImageSource = `${process.env.PUBLIC_URL}/icons/System/settings-3-fill.svg`;
  return (
    <Fragment>
      <button
        onClick={() => {
          dialogRef.current?.showModal();
        }}
        type="button"
      >
        <img alt="Settings" src={settingsImageSource} />
        <span className={classNames(hideClasses["hide"])}>
          <FormattedMessage defaultMessage="Click to open settings" />
        </span>
      </button>
      <dialog className={classNames(dialogClasses["dialog"])} ref={dialogRef}>
        <form
          className={classNames(dialogClasses["dialog__form--a"])}
          id="dialog"
          method="dialog"
        >
          <h2 className={classNames(elementsClasses["no-margin"])}>
            <FormattedMessage defaultMessage="Settings" />
          </h2>
          <button form="dialog" type="submit">
            <img
              alt="Close"
              className={classNames(dialogClasses["dialog__form--a__img"])}
              src={closeImageSource}
            />
            <span className={classNames(hideClasses["hide"])}>
              <FormattedMessage defaultMessage="Click to close settings" />
            </span>
          </button>
        </form>
        <div>
          <Authenticator />
          <Installer />
        </div>
        <div className={classNames(dialogClasses["dialog__form--b"])}>
          <hr />
          <button form="dialog" type="submit">
            <FormattedMessage defaultMessage="Close" />
          </button>
        </div>
      </dialog>
    </Fragment>
  );
}
