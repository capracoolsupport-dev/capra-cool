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
        <path d="M3.5 5h2l1.8 8.5h9.8l2-6H7.2" />
        <circle cx="10" cy="19" r="1.6" />
        <circle cx="17" cy="19" r="1.6" />
      </>
    ),
    star: (
      <path d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 5.9L12 17l-5.4 2.9 1-5.9-4.3-4.2 6-.9z" />
    ),
    shield: (
      <path d="M12 3l7 3v5c0 4.7-2.8 7.9-7 10-4.2-2.1-7-5.3-7-10V6z" />
    ),
    yarn: (
      <>
        <path d="M7 14c-2.7 0-4.5-1.7-4.5-4.2C2.5 6.8 4.8 5 8 5c4 0 6.5 2.4 6.5 5.5 0 2.8-1.8 4.5-4.3 4.5-2 0-3.4-1.2-3.4-3 0-1.5 1-2.7 2.4-2.7s2.3 1 2.3 2.1c0 .9-.4 1.4-1 1.7" />
        <path d="M15 15c3.4 0 6 2 6 4.6S18.8 24 15.3 24c-2.8 0-4.8-1.6-4.8-3.8 0-1.8 1.3-3.2 3-3.2 1.6 0 2.8 1.1 2.8 2.4 0 1.1-.6 1.8-1.4 2.1" />
      </>
    ),
    check: (
      <path d="M5 12.5l4.2 4.2L19 7" />
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
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}
