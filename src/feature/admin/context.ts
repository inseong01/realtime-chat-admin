import { createContext, type ActionDispatch } from 'react';

import { initAdminAppState, type InitAdminAppState } from './reducer';

type AdminDispatchContext = ActionDispatch<[action: any]>;
export const AdminDispatchContext = createContext<AdminDispatchContext | undefined>(undefined);

type AdminReducerStateContext = InitAdminAppState;
export const AdminReducerStateContext = createContext<AdminReducerStateContext>(initAdminAppState);
