import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import containerItemClasses from "../../../Containers/Common/ContainerItem.module.css";

import { classNames } from "../../../../features/css/classnames";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function VaultBankItem(props: {}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  const navigateRef = useRef(useNavigate());

  useEffect(
    function showOnLocation() {
      if (!(dialogRef.current?.open ?? false)) {
        dialogRef.current?.showModal();
      }
    },
    [location.key]
  );

  useEffect(function navigateOnCancel() {
    const dialog = dialogRef.current!;
    const onCancel = () => {
      navigateRef.current("../");
    };
    dialog.addEventListener("cancel", onCancel);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
    };
  }, []);
  return (
    <dialog ref={dialogRef}>
      <img
        className={classNames(
          containerItemClasses["item__img"],
          containerItemClasses[location.state.item?.rarity ?? ""]
        )}
        alt={location.state.item?.name ?? ""}
        src={
          location.state.containerItem
            ? location.state.item?.icon ?? errorImageSrc
            : ""
        }
        style={{ float: "left" }}
      />
      <h3>{location.state.item.name}</h3>
      <p>{location.state.item.description}</p>
    </dialog>
  );
}
