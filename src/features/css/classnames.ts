function classNameReducer(accumulateClassNames: string, className: any) {
  if (typeof className === "string") {
    return `${accumulateClassNames} ${className}`;
  }
  return accumulateClassNames;
}

export function classNames(...classes: any[]) {
  return classes.reduce(classNameReducer, "");
}
