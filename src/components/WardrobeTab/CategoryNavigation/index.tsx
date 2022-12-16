import { Fragment } from "react";
import { Link } from "react-router-dom";

export function WardrobeCategoryNavigation(props: {
  skinType: string;
  subtypes: string[];
}) {
  return (
    <Fragment>
      <Link to={`/vault/wardrobe/${props.skinType}`}>{props.skinType}</Link>
      <ul>
        {
          // todo: Parent link should be same as first child
          props.subtypes.map((subtype) => (
            <li key={subtype}>
              <Link to={`/vault/wardrobe/${props.skinType}/${subtype}`}>
                {subtype}
              </Link>
            </li>
          ))
        }
      </ul>
    </Fragment>
  );
}
