import { useEffect, useReducer, useRef, useState } from 'react';

import { UserIDContextContext } from './util/context/global';
import { ADMIN_ID, type CustomPresence, type MessageMetaData } from './util/const/const';
import { supabase } from './util/supabase/supabase-client';

import { adminReducer, initAdminAppState } from './feature/admin/reducer';
import { AdminDispatchContext, AdminReducerStateContext } from './feature/admin/context';

import './App.css';
import AdminChatMode from './feature/admin/admin-index';

const ID = ADMIN_ID;

function App() {
  const [isLogin] = useState(true);

  const [adminState, adminDispatch] = useReducer(adminReducer, initAdminAppState);

  if (!isLogin) return <div>Nope</div>;

  useEffect(() => {
    const userStatus: CustomPresence = {
      userID: ID,
      userName: 'ADMIN',
      online_at: new Date().toISOString(),
      isOnline: true,
      isTyping: false,
      messages: [],
    };

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

        adminDispatch({ type: 'SET_USER_MESSAGE_STATE', data: userData });
      });

    MY_CHANNEL
      /* 채팅방 연결 */
      .on('presence', { event: 'sync' }, () => {
        const presenceState = MY_CHANNEL.presenceState<CustomPresence>();
        const myID = ADMIN_ID;

        adminDispatch({ type: 'ADD_USER_LIST', list: presenceState, myID }); // 렌더링 2~3회 유발
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === ADMIN_ID) return;

        adminDispatch({ type: 'UPDATE_USER_OFFLINE', key });
      });

    MY_CHANNEL
      /* 사용자 추적 설정 */
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        await MY_CHANNEL.track(userStatus);
      });

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
    <>
      {/* HTML title */}
      <title>{`채팅 관리자 ${msgMention}`}</title>

      <UserIDContextContext.Provider value={ID}>
        <AdminDispatchContext.Provider value={adminDispatch}>
          <AdminReducerStateContext.Provider value={adminState}>
            {/* 채팅방 - 관리자 */}
            <AdminChatMode msgCount={receivedMsgCount} />
          </AdminReducerStateContext.Provider>
        </AdminDispatchContext.Provider>
      </UserIDContextContext.Provider>
    </>
  );
}

export default App;
