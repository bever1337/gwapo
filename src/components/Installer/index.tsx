import { Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../Elements/Hide.module.css";

import { classNames } from "../../features/css/classnames";
// import { readGwapoDatabases } from "../../features/store/api/read-gwapo-databases";
import { updateGwapoDatabaseDump } from "../../features/store/api/update-gwapo-database-dump";

export function Installer() {
  const [open, setOpen] = useState(false); // accordion state
  // readGwapoDatabases.useQuerySubscription({});
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
        <h3
          className={classNames(
            accordionClasses["tab__heading"],
            elementsClasses["no-margin"]
          )}
        >
          <FormattedMessage defaultMessage="Installer" />
        </h3>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <div
        className={classNames(
          accordionClasses["folder"],
          !open && hideClasses["hide"]
        )}
      >
        👷Under Construction👷
      </div>
    </Fragment>
  );
}
