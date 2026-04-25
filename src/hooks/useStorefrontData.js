import { useEffect, useState } from "react";
import { loadStorefrontData } from "../lib/storefrontApi";

export function useStorefrontData() {
  const [state, setState] = useState({
    data: null,
    status: "loading",
    source: "supabase",
    error: null
  });

  useEffect(() => {
    let ignore = false;

    async function run() {
      const result = await loadStorefrontData();

      if (!ignore) {
        setState({
          data: result.data,
          status: result.ok ? "ready" : "error",
          source: result.source,
          error: result.error
        });
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}
