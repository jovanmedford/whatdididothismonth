import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface Filters {
  year: number;
  month: number;
}

export interface FilterCtx {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>
}

export let FilterContext = createContext<FilterCtx | null>(null);

export function useFilterContext() {
    let ctx = useContext(FilterContext);

    if (!ctx) {
      throw Error("No filter context");
    }
  return ctx
}
