import { useContext, useRef } from 'react';

import { ADMIN_ID } from '../../util/const/const';
import { UserIDContextContext } from '../../util/context/global';

import { AdminReducerStateContext } from './context';

import CountItemDisplay from '../../components/chat/count-display/display-index';

import styles from './admin-index.module.css';
import OnlineUser from './online-user';
import ChatRoomDisplay from './chat-room';

export default function AdminChatMode() {
  const state = useContext(AdminReducerStateContext);
  const chatRoomRef = useRef<HTMLDivElement>(null);

  const isRoomClicked = state.isRoomClicked;
  const userList = state.userList;

  const userIdArr = Object.keys(userList);
  const onlineUserArr = userIdArr.filter((key) => userList[key].isOnline);
  const receivedMsgCount = Object.keys(userList).reduce((acc, id) => {
    const userMessages = userList[id].messages;
    return acc + userMessages.filter((msg) => !msg.payload.isRead && msg.payload.id !== ADMIN_ID).length;
  }, 0);

  return (
    <UserIDContextContext.Provider value={ADMIN_ID}>
      <div className={styles.wrap}>
        {/* 접속현황 */}
        <div className={styles.top}>
          <CountItemDisplay category='현재접속자' count={onlineUserArr.length} unit='명' />

          <CountItemDisplay category='읽지 않은 메시지' count={receivedMsgCount} unit='건' />
        </div>

        <div className={styles.bottom}>
          {/* 접속인원 */}
          <div className={styles.onlineListBox}>
            {/* 제목 */}
            <div className={styles.header}>
              <div className={styles.titleBox}>
                <span className={styles.title}>접속인원</span>
              </div>
            </div>

            {/* 목록 */}
            <ul className={styles.onlineList}>
              {!userIdArr.length && <li className={styles.none}>현재 접속인원이 없습니다.</li>}

              {userIdArr.map((id) => {
                return <OnlineUser key={id} id={id} />;
              })}
            </ul>
          </div>

          {/* 채팅방 */}
          <div ref={chatRoomRef} className={styles.chatBox} data-isclicked={isRoomClicked}>
            {isRoomClicked ? (
              <ChatRoomDisplay ref={chatRoomRef} />
            ) : (
              <div className={styles.none}>선택된 채팅방이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </UserIDContextContext.Provider>
  );
}
