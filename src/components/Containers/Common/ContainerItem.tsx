import { Fragment, createElement, useId } from "react";
import { Link } from "react-router-dom";

import containerItemClasses from "./ContainerItem.module.css";

import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import type { Item } from "../../../types/item";

const errorImageSrc = `/icons/System/error-warning-fill.svg`;
const loaderImageSrc = `/icons/System/loader-fill.svg`;

export function ContainerItem(props: {
  containerItem: {
    id: number;
    charges?: number;
    count: number;
  } | null;
  item?: Item;
}) {
  const elementId = useId();
  return (
    <li className={classNames(containerItemClasses["item"])} id={elementId}>
      <QueryUninitialized>
        <img
          className={classNames(containerItemClasses["item__img"])}
          alt="loading"
          src={loaderImageSrc}
        />
      </QueryUninitialized>
      <QueryLoading>
        <img
          className={classNames(containerItemClasses["item__img"])}
          alt="loading"
          src={loaderImageSrc}
        />
      </QueryLoading>
      <QueryError>
        <img
          className={classNames(containerItemClasses["item__img"])}
          alt="error"
          src={errorImageSrc}
        />
      </QueryError>
      <QuerySuccess>
        {createElement(
          props.item?.id ? Link : Fragment,
          props.item?.id
            ? {
                replace: true,
                to: {
                  hash: "#aside",
                  search: `?itemId=${props.item?.id ?? ""}`,
                },
                state: { from: elementId },
              }
            : null,
          <img
            className={classNames(
              containerItemClasses["item__img"],
              props.item?.rarity &&
                containerItemClasses[props.item?.rarity ?? ""]
            )}
            alt={props.item?.name ?? ""}
            src={props.containerItem ? props.item?.icon ?? errorImageSrc : ""}
          />,
          typeof props.containerItem?.count === "number" ? (
            <span className={classNames(containerItemClasses["item__count"])}>
              {props.containerItem.count}
              {typeof props.containerItem?.charges === "number"
                ? ` (${props.containerItem.charges})`
                : ""}
            </span>
          ) : null
        )}
      </QuerySuccess>
    </li>
  );
}
