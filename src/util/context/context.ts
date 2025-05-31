import {
  createContext,
  type ActionDispatch,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { type MessageDataPayload } from '../const/common';
import { initAppState, type InitAppState } from '../reducer/reducer';

export const initialOpponentState = { isOnline: false, isTyping: false };
export const OpponentStateContext = createContext(initialOpponentState);

type SetIconClickContext = { setIconClick: Dispatch<SetStateAction<boolean>> };
export const SetIconClickContext = createContext<SetIconClickContext>({
  setIconClick: () => {},
});

type GetMessageContext = { getMessage: Dispatch<SetStateAction<MessageDataPayload[]>> };
export const GetMessageContext = createContext<GetMessageContext | undefined>(undefined);

type DispatchContext = ActionDispatch<[action: any]>;
export const DispatchContext = createContext<DispatchContext | undefined>(undefined);

type ReducerStateContext = InitAppState;
export const ReducerStateContext = createContext<ReducerStateContext>(initAppState);
