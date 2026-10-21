import { useSyncExternalStore } from "react";

type State = {
  /** Index into VARIANTS of the edition shown on the 3D can. */
  variant: number;
  /** True while a solid section fully covers the WebGL stage. */
  paused: boolean;
  /** True once the can textures are painted and the first frame rendered. */
  ready: boolean;
  /** True once the preloader has started lifting and the hero intro may play. */
  entered: boolean;
};

const initial: State = { variant: 0, paused: false, ready: false, entered: false };
let state = initial;
const listeners = new Set<() => void>();

export function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getState() {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

/** Mutable values read every frame by the 3D rig; tweened by GSAP. */
export const motion = { intro: 0 };
