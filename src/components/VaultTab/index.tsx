import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../HideA11y/index.module.css";
import materialsClasses from "../materials.module.css";
import { VaultItem } from "../vault-item";

import { classNames } from "../../features/css/classnames";
import type { AccountBankItem } from "../../features/store/api/read-account-bank";
import { readItems } from "../../features/store/api/read-items";

export function VaultTab(props: {
  accountBankItems: (AccountBankItem | null)[];
  bankTab: number;
}) {
  const [open, setOpen] = useState(true);
  const skip = props.accountBankItems.length === 0;
  const queryArguments = {
    ids: props.accountBankItems.reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [] as number[]
    ),
  };
  const { data: items } = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );
  return (
    <section
      className={[materialsClasses["materials__inline-wrapper"]].join(" ")}
    >
      <div className={classNames(accordionClasses["tab"])}>
        <h2
          className={classNames(
            accordionClasses["tab__heading"],
            elementsClasses["no-margin"]
          )}
        >
          {/* Bank tabs have no heading in GW2. Mirror that choice here */}
          {""}
        </h2>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <div
        className={classNames(
          accordionClasses["folder"],
          !open && hideClasses["hide"]
        )}
      >
        <ol
          className={classNames(
            materialsClasses["materials__list"],
            elementsClasses["no-margin"]
          )}
        >
          {props.accountBankItems.map((accountBankTabItem, index) => (
            // Warning: account bank items do not have any unique identifiers
            // Features like filtering and sorting will not work until each item has a uid
            // For now, we can assume this is safe because the list is static
            <VaultItem
              accountBankItem={accountBankTabItem}
              item={items?.entities?.[accountBankTabItem?.id ?? ""]}
              key={index}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
