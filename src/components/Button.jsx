import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";

function buildClassName({ variant, wide, iconOnly, className }) {
  return [
    "button",
    `button-${variant}`,
    wide ? "button-wide" : "",
    iconOnly ? "button-icon" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  ariaLabel,
  children,
  className = "",
  disabled = false,
  href,
  icon,
  iconOnly = false,
  rel,
  target,
  to,
  type = "button",
  variant = "primary",
  wide = false,
  ...props
}) {
  const resolvedAriaLabel =
    ariaLabel || (typeof children === "string" ? children : undefined);
  const classes = buildClassName({ variant, wide, iconOnly, className });
  const content = (
    <>
      {icon ? (
        <span className="button-icon-slot" aria-hidden="true">
          <Icon name={icon} />
        </span>
      ) : null}
      {!iconOnly ? <span>{children}</span> : null}
    </>
  );

  if (to) {
    return (
      <Link aria-label={resolvedAriaLabel} className={classes} to={to} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        aria-label={resolvedAriaLabel}
        className={classes}
        href={href}
        rel={rel}
        target={target}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      aria-label={resolvedAriaLabel}
      className={classes}
      disabled={disabled}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
}
