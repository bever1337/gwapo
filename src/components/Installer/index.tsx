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
import {
  firstDumpFinished,
  readGwapoDatabases,
} from "../../features/store/api/read-gwapo-databases";
import { updateGwapoDatabaseDump } from "../../features/store/api/update-gwapo-database-dump";

export function Installer() {
  const [open, setOpen] = useState(true); // accordion state
  const readDatabasesResult = readGwapoDatabases.useQuery({});
  const bestDatabase = firstDumpFinished(readDatabasesResult);
  const [trigger, updateGwapoDatabaseDumpResult] =
    updateGwapoDatabaseDump.useMutation({});
  useEffect(() => {
    const request = trigger({});
    return () => {
      request.abort();
    };
  }, [trigger]);
  const targetDatabaseId = readDatabasesResult.data?.ids[0];
  const targetDatabase = readDatabasesResult.data?.entities[targetDatabaseId!];

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
        {bestDatabase === targetDatabaseId ? (
          <p>
            GWAPO is up-to-date! Version {`${targetDatabaseId}`.split("_")[1]}
          </p>
        ) : (
          <Fragment>
            <p>
              <>
                GWAPO is loading database version{" "}
                {`${targetDatabaseId}`.split("_")[1]}
              </>
            </p>
            <ul
              className={classNames(
                elementsClasses["no-margin"],
                elementsClasses["no-padding"],
                elementsClasses["list--no-style"]
              )}
            >
              {targetDatabase?.ids.map((partialDumpId) => {
                const partialDump = targetDatabase.entities[partialDumpId];
                const partialDumpProgressRatio = Math.round(
                  (partialDump!.seq / (partialDump?.db_info.doc_count ?? 1)) *
                    100
                );
                const dumpClass =
                  (partialDump?.db_info.db_name ?? "").split("_").at(-1) ??
                  "documents";
                return (
                  <li className={classNames()} key={partialDumpId}>
                    <label>
                      <FormattedMessage
                        defaultMessage="Loaded {sequence} of {count} {schema}. ({ratio}%)"
                        values={{
                          count: partialDump?.db_info.doc_count,
                          ratio: partialDumpProgressRatio,
                          schema: dumpClass,
                          sequence: partialDump?.seq,
                        }}
                      />
                      <br />
                      <progress
                        max={100}
                        style={{ width: "100%" }}
                        value={partialDumpProgressRatio}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        )}
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
