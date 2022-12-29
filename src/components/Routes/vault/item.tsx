import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import containerItemClasses from "../../Containers/Common/ContainerItem.module.css";

import { classNames } from "../../../features/css/classnames";
import { readItems } from "../../../features/store/api/read-items";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function VaultBankItem(props: {}) {
  const { itemId } = useParams();
  const { data } = readItems.useQuery({ ids: [parseInt(itemId!, 10)] });
  const currentItem = data?.entities[itemId ?? ""];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigateRef = useRef(useNavigate());

  useEffect(
    function showOnLocation() {
      if (!(dialogRef.current?.open ?? false)) {
        dialogRef.current?.showModal();
      }
    },
    [itemId]
  );

  useEffect(function navigateOnCancel() {
    const dialog = dialogRef.current!;
    const onCancel = () => {
      navigateRef.current("../", {
        replace: true,
      });
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
          containerItemClasses[currentItem?.rarity ?? ""]
        )}
        alt={currentItem?.name ?? ""}
        src={currentItem ? currentItem?.icon ?? errorImageSrc : ""}
        style={{ float: "left" }}
      />
      <h3>{currentItem?.name}</h3>
      <p>{currentItem?.description}</p>
    </dialog>
  );
}
