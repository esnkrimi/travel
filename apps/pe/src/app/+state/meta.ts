import { ActionReducer, MetaReducer } from '@ngrx/store';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: any) {
    //  ('state', state);
    //  ('action', action);
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<any>[] = [debug];
