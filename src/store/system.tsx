import { StateCreator } from "zustand";
import get from "lodash/get";
import { storage } from "services";

export type TTheme = "dark" | "light";

export interface ISystemInitialState {
  lang: string;
  theme: TTheme;
  loginId: string | null;
}

export const SystemInitialState: ISystemInitialState = {
  lang: storage.get("i18nextLng") || "uz",
  theme: "light",
  loginId: JSON.parse(storage.get("loginId") || "null"),
};

export interface ISystem {
  system: ISystemInitialState;
  setLang: (action: { [key: string]: any }) => void;
  changeTheme: (data: string) => any;
  setLoginId: (data: any) => any;
}

export const systemSlice: StateCreator<ISystem, [], []> = (set): ISystem => {
  return {
    system: SystemInitialState,
    setLang: (action: { [key: string]: any }) => {
      return set((state) => {
        return {
          system: {
            ...get(state, "system"),
            lang: "ru",
          },
        };
      });
    },
    setLoginId: (action: string) => {
      //@ts-ignore
      return set((state) => {
        storage.set("loginId", JSON.stringify(action));
        return {
          system: {
            ...get(state, "system"),
            loginId: action,
          },
        };
      });
    },
    changeTheme: (action: string) => {
      return set((state: any) => {
        return {
          system: {
            ...get(state, "system"),
            theme: action,
          },
        };
      });
    },
  };
};
