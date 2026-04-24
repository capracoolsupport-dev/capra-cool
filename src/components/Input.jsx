export default function Input({
  as = "input",
  children,
  className = "",
  emptyOptionLabel,
  fullWidth = false,
  helpText,
  label,
  options = [],
  rows = 4,
  ...props
}) {
  const fieldClassName = [
    "field",
    fullWidth ? "field-full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  let control = null;

  if (as === "textarea") {
    control = <textarea placeholder={props.placeholder ?? ""} rows={rows} {...props} />;
  } else if (as === "select") {
    control = (
      <select {...props}>
        {emptyOptionLabel !== undefined ? <option value="">{emptyOptionLabel}</option> : null}
        {children ||
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    );
  } else {
    control = <input placeholder={props.placeholder ?? ""} {...props} />;
  }

  return (
    <label className={fieldClassName}>
      <span>{label}</span>
      {control}
      {helpText ? <small>{helpText}</small> : null}
    </label>
  );
}
