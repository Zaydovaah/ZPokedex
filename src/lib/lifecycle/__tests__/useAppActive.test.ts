import { act, renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native';

import { useAppActive } from '../useAppActive';

type ChangeHandler = (status: AppStateStatus) => void;

let currentState: AppStateStatus = 'active';
let changeHandler: ChangeHandler | null = null;
let removeMock: jest.Mock;

const originalCurrentState = AppState.currentState;
const originalAddEventListener = AppState.addEventListener;

beforeEach(() => {
  currentState = 'active';
  changeHandler = null;
  removeMock = jest.fn();
  Object.defineProperty(AppState, 'currentState', {
    configurable: true,
    get: () => currentState,
  });
  Object.defineProperty(AppState, 'addEventListener', {
    configurable: true,
    value: (_event: string, handler: ChangeHandler) => {
      changeHandler = handler;
      const subscription: NativeEventSubscription = { remove: removeMock };
      return subscription;
    },
  });
});

afterEach(() => {
  Object.defineProperty(AppState, 'currentState', {
    configurable: true,
    value: originalCurrentState,
  });
  Object.defineProperty(AppState, 'addEventListener', {
    configurable: true,
    value: originalAddEventListener,
  });
});

describe('useAppActive', () => {
  it('returns true when AppState is active on first render', () => {
    currentState = 'active';
    const { result } = renderHook(() => useAppActive());
    expect(result.current).toBe(true);
  });

  it('returns false when AppState is background on first render', () => {
    currentState = 'background';
    const { result } = renderHook(() => useAppActive());
    expect(result.current).toBe(false);
  });

  it('updates to true when AppState changes to active', () => {
    currentState = 'background';
    const { result } = renderHook(() => useAppActive());
    expect(result.current).toBe(false);

    act(() => {
      changeHandler?.('active');
    });

    expect(result.current).toBe(true);
  });

  it('updates to false when AppState changes to background', () => {
    const { result } = renderHook(() => useAppActive());
    expect(result.current).toBe(true);

    act(() => {
      changeHandler?.('background');
    });

    expect(result.current).toBe(false);
  });

  it('updates to false when AppState changes to inactive', () => {
    const { result } = renderHook(() => useAppActive());
    expect(result.current).toBe(true);

    act(() => {
      changeHandler?.('inactive');
    });

    expect(result.current).toBe(false);
  });

  it('removes the subscription on unmount', () => {
    const { unmount } = renderHook(() => useAppActive());
    expect(changeHandler).not.toBeNull();

    unmount();

    expect(removeMock).toHaveBeenCalledTimes(1);
  });
});
