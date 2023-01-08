import React, { Fragment, useRef } from "react";
import { FormattedMessage } from "react-intl";

import settingsClasses from "./index.module.css";

import { Authenticator } from "../Authenticator";
import dialogClasses from "../Elements/Dialog.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../Elements/Hide.module.css";
import { Installer } from "../Installer";

import { classNames } from "../../features/css/classnames";
import {
  firstDumpFinished,
  readGwapoDatabases,
} from "../../features/store/api/read-gwapo-databases";

// declare string tempaltes outside JSX props for better syntax highlighting
const closeImageSource = `${process.env.PUBLIC_URL}/icons/System/close-fill.svg`;
const settingsImageSource = `${process.env.PUBLIC_URL}/icons/System/settings-3-fill.svg`;

/** */
export function Settings(props: any) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readDatabasesResult = readGwapoDatabases.useQuery({});
  const bestDatabase = firstDumpFinished(readDatabasesResult);
  const targetDatabaseId = readDatabasesResult.data?.ids[0];
  const loadingDump = bestDatabase !== targetDatabaseId;
  return (
    <Fragment>
      <button
        onClick={() => {
          dialogRef.current?.showModal();
        }}
        type="button"
      >
        <img
          alt="Settings"
          className={classNames(loadingDump && settingsClasses["working"])}
          src={settingsImageSource}
        />
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
