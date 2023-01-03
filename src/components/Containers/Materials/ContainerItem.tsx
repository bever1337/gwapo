import { Link } from "react-router-dom";

import containerItemClasses from "../Common/ContainerItem.module.css";

import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import { readAccountMaterials } from "../../../features/store/api/read-account-materials";
import type { Item } from "../../../types/item";

// Different from common ContainerItem because material is always present unlike item
export function MaterialContainerItem({ material }: { material: Item }) {
  const readAccountMaterialsResult = readAccountMaterials.useQueryState({});
  return (
    <li className={classNames(containerItemClasses["item"])}>
      <Link replace relative="path" to={`?itemId=${material.id}`}>
        <img
          className={classNames(containerItemClasses["item__img"])}
          alt={material.name}
          src={material.icon}
        />
        <span className={classNames(containerItemClasses["item__count"])}>
          <Query result={readAccountMaterialsResult}>
            <QueryUninitialized>🕦</QueryUninitialized>
            <QueryLoading>...</QueryLoading>
            <QueryError>x</QueryError>
            <QuerySuccess>
              {readAccountMaterialsResult.data?.entities[material.id]?.count ??
                0}
            </QuerySuccess>
          </Query>
        </span>
      </Link>
    </li>
  );
}
