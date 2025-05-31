import { useEffect, useReducer } from 'react';

import { supabase } from './util/supabase/supabaseClient';
import { USER_ID, type MessageDataPayload } from './util/const/common';
import { initAppState, reducer } from './util/reducer/reducer';
import { DispatchContext, ReducerStateContext } from './util/context/context';

import ICON_MESSAGE from './assets/icon-message.svg';
import ICON_USER from './assets/icon-user.svg';

import styles from './App.module.css';
import IconList from './components/icon-list/list-index';
import CategoryContentDisplay from './feature/category-display/display-index';

// https://supabase.com/docs/guides/realtime?queryGroups=language&language=js

/* 
  할 것
  - 읽음처리 구현
  - 읽음 메시지 수 반영
  - 입력중 구현
*/

export default function App() {
  const [state, dispatch] = useReducer(reducer, initAppState);

  useEffect(() => {
    const userStatus = {
      userID: USER_ID,
      online_at: new Date().toISOString(),
      isOnline: true,
    };

    const MY_CHANNEL = supabase
      /* 채팅방 설정 */
      .channel('channel_1', {
        config: {
          presence: { key: USER_ID },
        },
      });

    MY_CHANNEL
      /* 데이터 송수신 */
      .on('broadcast', { event: 'send' }, (data) => {
        dispatch({ type: 'GET_MESSAGE', data: data as MessageDataPayload });
      })
      .on('broadcast', { event: 'opponent' }, (data) => {
        const isMyself = data.payload.id === USER_ID;

        if (!isMyself) return;

        const isTyping = data.payload.isTyping;
        // setOpponentState((prev) => ({ ...prev, isTyping }));
      });

    MY_CHANNEL
      /* 채팅방 연결 */
      .on('presence', { event: 'sync' }, () => {})
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key === USER_ID) return;
        dispatch({ type: 'ADD_USER_LIST', list: newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === USER_ID) return;
        dispatch({ type: 'REMOVE_USER_LIST', key });
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

  const title = state.category;
  const onlinePeopleCount = state.userList.length;
  const sentMsgCount = Object.keys(state.userMessages).reduce((acc, curr) => {
    return state.userMessages[curr].messages.length + acc;
  }, 0);

  return (
    <DispatchContext.Provider value={dispatch}>
      <ReducerStateContext.Provider value={state}>
        <div className={styles.wrap}>
          <div className={styles.listBox}>
            {/* 현재 카테고리 이름 */}
            <div className={styles.title}>{title}</div>

            {/* 카테고리 별 화면 */}
            <ul className={styles.displayBox}>
              <CategoryContentDisplay />
            </ul>
          </div>

          {/* 카테고리 아이콘 목록 */}
          <ul className={styles.iconBox}>
            <IconList src={ICON_USER} alt='접속인원' count={onlinePeopleCount} />
            <IconList src={ICON_MESSAGE} alt='받은 메시지' count={sentMsgCount} />
          </ul>
        </div>
      </ReducerStateContext.Provider>
    </DispatchContext.Provider>
  );
}
