import { StateCreator } from "zustand";
import get from "lodash/get";
import { storage } from "services";

export type TTheme = "dark" | "light";

export interface ISystemInitialState {
  lang: string;
  theme: TTheme;
  toggleSidebar: string | null;
  attemptStatus: string | null;
}

export const SystemInitialState: ISystemInitialState = {
  lang: storage.get("i18nextLng") || "uz",
  theme: "light",
  toggleSidebar: storage.get("toggleSidebar")
    ? storage.get("toggleSidebar")
    : "false",
  attemptStatus: storage.get("attemptStatus")
    ? storage.get("attemptStatus")
    : "200",
};

export interface ISystem {
  system: ISystemInitialState;
  setLang: (action: { [key: string]: any }) => void;
  changeTheme: (data: string) => any;
  toggleSidebar: (data: string) => any;
  attemptStatus: (data: string) => any;
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
    toggleSidebar: (action: string) => {
      return set((state: any) => {
        storage.set("toggleSidebar", action);
        return {
          system: {
            ...get(state, "system"),
            toggleSidebar: action,
          },
        };
      });
    },
    attemptStatus: (action: string) => {
      return set((state: any) => {
        storage.set("attemptStatus", action);
        return {
          system: {
            ...get(state, "system"),
            attemptStatus: action,
          },
        };
      });
    },
  };
};
