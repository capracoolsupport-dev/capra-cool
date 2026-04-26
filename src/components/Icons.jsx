export default function Icon({ name }) {
  const paths = {
    menu: (
      <path d="M4 7h16M4 12h16M4 17h16" />
    ),
    close: (
      <path d="M6 6l12 12M18 6L6 18" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </>
    ),
    cart: (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 01-8 0" />
      </>
    ),
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    ),
    "heart-filled": (
      <path fill="currentColor" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </>
    ),
    "arrow-right": (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
    "arrow-left": (
      <>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </>
    ),
    "chevron-right": (
      <path d="M9 18l6-6-6-6" />
    ),
    "chevron-left": (
      <path d="M15 18l-6-6 6-6" />
    ),
    "chevron-down": (
      <path d="M6 9l6 6 6-6" />
    ),
    edit: (
      <>
        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-4-4L4 16v4" />
        <path d="M13.5 6.5l4 4" />
      </>
    ),
    star: (
      <path d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 5.9L12 17l-5.4 2.9 1-5.9-4.3-4.2 6-.9z" />
    ),
    "star-filled": (
      <path fill="#F59E0B" stroke="#F59E0B" d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 5.9L12 17l-5.4 2.9 1-5.9-4.3-4.2 6-.9z" />
    ),
    shield: (
      <path d="M12 3l7 3v5c0 4.7-2.8 7.9-7 10-4.2-2.1-7-5.3-7-10V6z" />
    ),
    truck: (
      <>
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    "refresh-cw": (
      <>
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </>
    ),
    check: (
      <path d="M5 12.5l4.2 4.2L19 7" />
    ),
    "check-circle": (
      <>
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </>
    ),
    support: (
      <>
        <path d="M4 12a8 8 0 1116 0v4a2 2 0 01-2 2h-3v-5h5" />
        <path d="M4 13h5v5H6a2 2 0 01-2-2z" />
      </>
    ),
    instagram: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" />
      </>
    ),
    facebook: (
      <path d="M13.5 20v-6h2.8l.4-3h-3.2V9.1c0-.9.3-1.6 1.7-1.6h1.7V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.2V11H8v3h2.5v6" />
    ),
    trash: (
      <>
        <path d="M5 7h14" />
        <path d="M9 7V4.8h6V7" />
        <path d="M8 7l.8 12h6.4L16 7" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    ),
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6l-10 7L2 6" />
      </>
    ),
    "map-pin": (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    package: (
      <>
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    minus: (
      <path d="M5 12h14" />
    ),
    plus: (
      <path d="M12 5v14M5 12h14" />
    ),
    yarn: (
      <>
        <path d="M7 14c-2.7 0-4.5-1.7-4.5-4.2C2.5 6.8 4.8 5 8 5c4 0 6.5 2.4 6.5 5.5 0 2.8-1.8 4.5-4.3 4.5-2 0-3.4-1.2-3.4-3 0-1.5 1-2.7 2.4-2.7s2.3 1 2.3 2.1c0 .9-.4 1.4-1 1.7" />
        <path d="M15 15c3.4 0 6 2 6 4.6S18.8 24 15.3 24c-2.8 0-4.8-1.6-4.8-3.8 0-1.8 1.3-3.2 3-3.2 1.6 0 2.8 1.1 2.8 2.4 0 1.1-.6 1.8-1.4 2.1" />
      </>
    )
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || null}
    </svg>
  );
}
