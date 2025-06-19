import { useEffect, useReducer, type ReactNode } from 'react';

import { UserIDContextContext } from '../../util/context/global';
import { ADMIN_ID, userStatus, type CustomPresence, type MessageMetaData } from '../../util/const/const';
import { supabase } from '../../util/supabase/supabase-client';

import { AdminDispatchContext, AdminReducerStateContext } from './context';
import { adminReducer, initAdminAppState } from './reducer';

const ID = ADMIN_ID;

export default function SupbaseChannel({ children }: { children: ReactNode }) {
  /* 메시지 알림 */
  const [adminState, adminDispatch] = useReducer(adminReducer, initAdminAppState);

  useEffect(() => {
    const MY_CHANNEL = supabase
      /* 채팅방 설정 */
      .channel('channel_1', {
        config: {
          presence: { key: ID },
          broadcast: {
            self: true,
          },
        },
      });

    MY_CHANNEL
      /* 데이터 송수신 */
      .on('broadcast', { event: 'send' }, (data) => {
        adminDispatch({ type: 'GET_MESSAGE', data: data as MessageMetaData });
      })
      .on('broadcast', { event: 'opponent' }, (data) => {
        const id: string = data.payload.id;
        const isMyself = id === ADMIN_ID;

        if (isMyself) return;

        const isTyping: boolean = data.payload.isTyping;
        const userData = { isTyping: isTyping, id: id };

        adminDispatch({ type: 'SET_USER_TYPING_STATUS', data: userData });
      });

    MY_CHANNEL
      /* 채팅방 연결 */
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key === ADMIN_ID) return;

        adminDispatch({
          type: 'ADD_USER_LIST',
          userID: key,
          newPresences: newPresences[0] as CustomPresence,
        });
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = MY_CHANNEL.presenceState<CustomPresence>();

        adminDispatch({ type: 'SYNC_USER_LIST', list: presenceState }); // 렌더링 2~3회 유발
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === ADMIN_ID) return;

        adminDispatch({ type: 'SET_USER_OFFLINE', key });
      });

    MY_CHANNEL
      /* 사용자 추적 설정 */
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        await MY_CHANNEL.track(userStatus);
      });

    // 탭 비활성화 시 일정 시간 지나면 사용자 leave 처리
    // 접속 유지 필요

    return () => {
      MY_CHANNEL.unsubscribe();
    };
  }, []);

  const receivedMsgCount = Object.keys(adminState.userList).reduce((acc, id) => {
    const userMessages = adminState.userList[id].messages;
    return acc + userMessages.filter((msg) => !msg.payload.isRead && msg.payload.id !== ADMIN_ID).length;
  }, 0);
  const msgMention = receivedMsgCount > 0 ? `: 새로운 알림 ${receivedMsgCount > 99 ? '99+' : receivedMsgCount} 개` : '';

  return (
    <UserIDContextContext.Provider value={ID}>
      <AdminDispatchContext.Provider value={adminDispatch}>
        <AdminReducerStateContext.Provider value={adminState}>
          {/* HTML title */}
          <title>{`채팅 관리자 ${msgMention}`}</title>

          {/* 컴포넌트 */}
          {children}
        </AdminReducerStateContext.Provider>
      </AdminDispatchContext.Provider>
    </UserIDContextContext.Provider>
  );
}
