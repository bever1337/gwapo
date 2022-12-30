import { Fragment, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import containerItemClasses from "../Containers/Common/ContainerItem.module.css";
import dialogClasses from "../Elements/Dialog.module.css";
import elementsClasses from "../Elements/index.module.css";

import { classNames } from "../../features/css/classnames";
import { useMediaQuery } from "../../features/hooks/use-media-query";
import { readItems } from "../../features/store/api/read-items";

const closeImageSource = `${process.env.PUBLIC_URL}/icons/System/close-fill.svg`;
const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function VaultItemDialog(props: {}) {
  const { itemId } = useParams();
  const { data } = readItems.useQuery({ ids: [parseInt(itemId!, 10)] });
  const currentItem = data?.entities[itemId ?? ""];
  const WrapperComponent = useMediaQuery("(min-width: 72rem)")
    ? Fragment
    : Dialog;

  return (
    <WrapperComponent>
      <img
        className={classNames(
          containerItemClasses["item__img"],
          containerItemClasses[currentItem?.rarity ?? ""]
        )}
        alt={currentItem?.name ?? ""}
        src={currentItem ? currentItem?.icon ?? errorImageSrc : ""}
        style={{ float: "left", margin: "0 1em 0.5em 0" }}
      />
      <h3 className={classNames(elementsClasses["no-margin"])}>
        {currentItem?.name}
      </h3>
      <p>{currentItem?.description}</p>
      <p>Type: {currentItem?.type}</p>
    </WrapperComponent>
  );
}

function Dialog(props: { children: any }) {
  const { itemId } = useParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigateRef = useRef(useNavigate());

  useEffect(
    function showOnLocation() {
      if (dialogRef.current?.open === false) {
        dialogRef.current?.showModal();
      }
    },
    [itemId]
  );

  useEffect(function navigateOnCancel() {
    const dialog = dialogRef.current!;
    const onCancel = () => {
      navigateRef.current("../", {
        relative: "path",
        replace: true,
      });
    };
    dialog.addEventListener("close", onCancel);
    dialog.addEventListener("cancel", onCancel);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
    };
  }, []);

  return (
    <dialog ref={dialogRef}>
      <form
        id={`components/Vault/Dialog/${itemId}`}
        method="dialog"
        style={{
          width: "16rem",
        }}
      >
        <div className={classNames(dialogClasses["dialog__form--a"])}>
          <span />
          <button form={`components/Vault/Dialog/${itemId}`} type="submit">
            <img
              alt="Close"
              className={classNames(dialogClasses["dialog__form--a__img"])}
              src={closeImageSource}
            />
          </button>
        </div>
        <div>{props.children}</div>
      </form>
    </dialog>
  );
}
