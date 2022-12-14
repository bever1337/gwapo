import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import { MaterialContainerItem } from "./ContainerItem";

import containerClasses from "../Common/Container.module.css";

import { AccordionControl } from "../../Accordion/Control";
import { AccordionHeading } from "../../Accordion/Heading";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../Elements/Hide.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import { readItems } from "../../../features/store/api/read-items";
import type { Materials } from "../../../features/store/api/read-materials";

function Skeleton(props: { children: any; materials: Materials }) {
  return (
    <Fragment>
      <div className={classNames(accordionClasses["tab"])}>
        <AccordionHeading>{props.materials.name}</AccordionHeading>
      </div>
      <div className={classNames(accordionClasses["folder"])}>
        {props.children}
      </div>
    </Fragment>
  );
}

export function MaterialsContainer({ materials }: { materials: Materials }) {
  const [open, setOpen] = useState(true);

  const queryArguments = {
    ids: materials.items.reduce(
      (acc, item) => (item ? acc.concat([item]) : acc),
      [] as number[]
    ),
  };
  const skip = queryArguments.ids.length === 0;
  const readItemsResult = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );

  return (
    <Query result={readItemsResult}>
      <QueryUninitialized>
        <Skeleton materials={materials}>
          <p>
            <FormattedMessage defaultMessage="GWAPO is waiting to load crafting materials." />
          </p>
        </Skeleton>
      </QueryUninitialized>
      <QueryLoading>
        <Skeleton materials={materials}>
          <p>
            <FormattedMessage defaultMessage="GWAPO is loading crafting materials." />
          </p>
        </Skeleton>
      </QueryLoading>
      <QueryError>
        <Skeleton materials={materials}>
          <p>
            <FormattedMessage defaultMessage="GWAPO encountered an error loading crafting materials." />
          </p>
        </Skeleton>
      </QueryError>
      <QuerySuccess>
        <div
          className={classNames(
            accordionClasses["tab"],
            !open && accordionClasses["tab--closed"]
          )}
        >
          <AccordionHeading onChange={setOpen}>
            {materials.name}
          </AccordionHeading>
          <AccordionControl onChange={setOpen} open={open} />
        </div>
        {(readItemsResult.data?.ids.length ?? 0) === 0 ? (
          <p
            className={classNames(
              !open && hideClasses["hide"],
              accordionClasses["folder"]
            )}
          >
            <FormattedMessage defaultMessage="GWAPO encountered an error loading crafting materials." />
          </p>
        ) : (
          <ol
            className={classNames(
              !open && hideClasses["hide"],
              accordionClasses["folder"],
              containerClasses["container"],
              elementsClasses["no-margin"]
            )}
          >
            {readItemsResult.data?.ids.map((itemId) => (
              <MaterialContainerItem
                key={itemId}
                material={readItemsResult.data?.entities[itemId]!}
              />
            ))}
          </ol>
        )}
      </QuerySuccess>
    </Query>
  );
}
