import { useEffect, useState } from 'react';

const VISITED_KEY = 'ubtan_has_visited';

export function useReturningVisitor() {
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const hasVisited = window.localStorage.getItem(VISITED_KEY);
    if (hasVisited) {
      setIsReturning(true);
    } else {
      window.localStorage.setItem(VISITED_KEY, 'true');
    }
  }, []);

  return isReturning;
}
