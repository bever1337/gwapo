import { Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { AccordionControl } from "../Accordion/Control";
import { AccordionHeading } from "../Accordion/Heading";
import accordionClasses from "../Accordion/index.module.css";
import hideClasses from "../Elements/Hide.module.css";

import { classNames } from "../../features/css/classnames";
import {
  readGwapoDatabases,
  selectBestDatabase,
} from "../../features/store/api/read-gwapo-databases";
import { updateGwapoDatabaseDump } from "../../features/store/api/update-gwapo-database-dump";

export function Installer() {
  const [open, setOpen] = useState(false); // accordion state
  readGwapoDatabases.useQuerySubscription({});
  const [trigger] = updateGwapoDatabaseDump.useMutation({});
  useEffect(() => {
    const request = trigger({});
    return () => {
      request.abort();
    };
  }, [trigger]);
  return (
    <Fragment>
      <div className={classNames(accordionClasses["tab"])}>
        <AccordionHeading onChange={setOpen}>
          <FormattedMessage defaultMessage="Installer" />
        </AccordionHeading>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <div
        className={classNames(
          accordionClasses["folder"],
          !open && hideClasses["hide"]
        )}
      >
        <p>👷Under Construction👷</p>
        <p>Current database: {useSelector(selectBestDatabase)}</p>
      </div>
    </Fragment>
  );
}
