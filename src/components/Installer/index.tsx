import { Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { AccordionControl } from "../Accordion/Control";
import { AccordionHeading } from "../Accordion/Heading";
import accordionClasses from "../Accordion/index.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../Elements/Hide.module.css";
import { Query } from "../Query";
import { QueryError } from "../Query/Error";

import { classNames } from "../../features/css/classnames";
import { updateGwapoDatabaseDump } from "../../features/store/api/update-gwapo-database-dump";

export function Installer() {
  const [open, setOpen] = useState(true); // accordion state
  const updateGwapoDatabaseDumpResult = updateGwapoDatabaseDump.useQuery({});

  return (
    <Fragment>
      <div
        className={classNames(
          accordionClasses["tab"],
          !open && accordionClasses["tab--closed"]
        )}
      >
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
        {/* {currentIsBehind && <p>Current version: {bestDatabase}</p>} */}
        <Query result={updateGwapoDatabaseDumpResult}>
          <QueryError>
            <p style={{ color: "red" }}>
              Error: {`${updateGwapoDatabaseDumpResult.error}`}
            </p>
          </QueryError>
        </Query>
      </div>
    </Fragment>
  );
}
