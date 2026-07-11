import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

function isActive(status: AppStateStatus) {
  return status === 'active';
}

export function useAppActive() {
  const [active, setActive] = useState(() => isActive(AppState.currentState));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      setActive(isActive(status));
    });

    return () => subscription.remove();
  }, []);

  return active;
}
