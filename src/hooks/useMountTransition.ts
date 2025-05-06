"use client";

import { useEffect, useState } from "react";

export function useMountTransition(isMounted: boolean, unmountDelay = 300) {
  const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isMounted && !hasTransitionedIn) {
      setHasTransitionedIn(true);
    } else if (!isMounted && hasTransitionedIn) {
      timeoutId = setTimeout(() => setHasTransitionedIn(false), unmountDelay);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMounted, hasTransitionedIn, unmountDelay]);

  return hasTransitionedIn;
}
