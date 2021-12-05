import { RecoilState, RecoilValue, useRecoilCallback } from "recoil";

/*
 * Inspired by https://github.com/luisanton-io/recoil-nexus
 * But intends to be a more type-safe implementation
 */

interface Externalizer {
  useRecoil: <T>(atom: RecoilValue<T>) => T;
  setRecoil: <T>(atom: RecoilState<T>, value: T | ((val: T) => T)) => void;
}

const utils: Externalizer = {} as Externalizer;

export default function RecoilExternalState() {
  utils.useRecoil = function <T>(atom: RecoilValue<T>): T {
    return useRecoilCallback(({ snapshot }) => {
      return (atom: RecoilValue<T>) => {
        return snapshot.getLoadable(atom).contents;
      };
    }, [])(atom);
  };

  utils.setRecoil = useRecoilCallback(({ set }) => set, []);

  return null;
}

export function useRecoil<T>(atom: RecoilValue<T>): T {
  return utils.useRecoil<T>(atom);
}

export function setRecoil<T>(
  atom: RecoilState<T>,
  newValue: T | ((currentValue: T) => T)
) {
  utils.setRecoil(atom, newValue);
}
