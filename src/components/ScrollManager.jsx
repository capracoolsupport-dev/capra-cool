import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function getHeaderOffset() {
  const header = document.querySelector(".site-header");
  const headerHeight = header?.getBoundingClientRect().height || 0;
  return headerHeight + 18;
}

export function scrollToSection(sectionId, behavior = "smooth") {
  const target = document.getElementById(sectionId);

  if (!target) {
    return false;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior
  });
  return true;
}

export default function ScrollManager() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const categorySearch = new URLSearchParams(search).get("category");
    const sectionId = hash
      ? decodeURIComponent(hash.slice(1))
      : pathname === "/" && categorySearch
        ? "featured"
        : "";

    if (sectionId) {
      let attempts = 0;

      const run = () => {
        attempts += 1;

        if (scrollToSection(sectionId) || attempts >= 10) {
          return;
        }

        window.setTimeout(run, 60);
      };

      window.requestAnimationFrame(run);
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });
    });
  }, [hash, pathname, search]);

  return null;
}
