import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
// import { v1 as uuidv1 } from 'uuid';

export const USER_ID = '99478830-3d2d-11f0-a097-1780455c1367';
// export const USER_ID = uuidv1();

export type MessageDataPayload = {
  type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
  event: string;
  payload: {
    text: string;
    id: string;
    isTyping: boolean;
    send_at: string;
    sender_id?: string;
    receiver_id?: string;
  };
};

export const initMessages: MessageDataPayload[] = [
  {
    type: 'broadcast',
    event: '',
    payload: {
      text: '',
      id: USER_ID,
      isTyping: false,
      send_at: '',
      sender_id: '',
      receiver_id: '',
    },
  },
];
