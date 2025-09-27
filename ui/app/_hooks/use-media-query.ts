import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  if (typeof query != "string") {
    console.warn("Query needs to be a string");
  }

  const [matches, setMatches] = useState(() => matchMedia(query).matches);

  useEffect(() => {
    function handleResize(e: MediaQueryListEvent) {
      if (e.matches) {
        setMatches(true);
        return;
      }

      setMatches(false);
    }

    const mediaQuery = matchMedia(query);

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return matches;
}
