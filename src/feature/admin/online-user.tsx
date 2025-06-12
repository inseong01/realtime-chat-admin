import { useContext } from 'react';

import type { MessageMetaData } from '../../util/const/const';

import { AdminDispatchContext, AdminReducerStateContext } from './context';
import { getDateTime } from './function/get-time';

import styles from './online-user.module.css';

export default function OnlineUser({ id }: { id: MessageMetaData['payload']['id'] }) {
  const state = useContext(AdminReducerStateContext);
  const reducer = useContext(AdminDispatchContext);

  const user = state.userList[id];
  const isTyping = user.isTyping;
  const isOnline = user.isOnline;
  const messages = user.messages;
  const latestMessage = messages.at(-1);

  const name = user.userName;
  const status = isOnline ? '온라인' : '오프라인';
  const text = latestMessage?.payload.text ?? ' ';
  const sent_at = latestMessage ? getDateTime('time', new Date(latestMessage.payload.sent_at)) : '';
  const userStatusOrSentAt = isOnline ? (!latestMessage ? status : sent_at) : status;

  const messagesLength = messages.filter((msg) => !msg.payload.isRead).length;
  const isMessagesAboveLimit = messagesLength > 9;
  const count = isMessagesAboveLimit ? '9+' : messagesLength;

  /* 채팅방 열기 */
  const onClickOpenBtn = () => {
    if (!latestMessage) return;
    if (!reducer) return;

    reducer({ type: 'OPEN_CHAT', id });
    reducer({ type: 'READ_USER_MESSAGE', id });
  };

  return (
    <li className={styles.list} onClick={onClickOpenBtn}>
      <div className={styles.top}>
        {/* 사용자 이름 */}
        <span className={styles.name}>{name}</span>

        {/* 사용자 상태 및 수신 시간 */}
        <span>{userStatusOrSentAt}</span>
      </div>
      <div className={styles.bottom}>
        {/* 메시지 미리보기 */}
        <span className={styles.text}>{isTyping ? '작성중..' : text}</span>

        {/* 안 읽은 메시지 개수 */}
        {messagesLength > 0 && <span className={styles.count}>{count}</span>}
      </div>
    </li>
  );
}
