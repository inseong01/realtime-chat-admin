import { useContext } from 'react';

import { DispatchContext, ReducerStateContext } from '../../util/context/context';
import type { MessageDataPayload } from '../../util/const/common';
import { getDateTime } from '../../util/function/get-time';

import styles from './display-index.module.css';

export default function MessageListDisplay({
  id,
}: {
  id: MessageDataPayload['payload']['id'];
}) {
  const state = useContext(ReducerStateContext);
  const reducer = useContext(DispatchContext);

  const selectedUserMessages = state.userMessages[id];
  const messages = selectedUserMessages.messages;
  const latestMessage = messages.at(-1);

  if (!latestMessage) return <></>;

  const name = id;
  const text = latestMessage.text;
  const send_at = getDateTime('time', new Date(latestMessage.send_at));

  const messagesLength = messages.filter((msg) => !msg.isRead).length;
  const isMessagesAboveLimit = messagesLength > 9;
  const count = isMessagesAboveLimit ? '9+' : messagesLength;

  /* 채팅방 열기 */
  const onClickOpenBtn = () => {
    if (!reducer) return;

    reducer({ type: 'OPEN_CHAT', id });
  };

  return (
    <li className={styles.list} onClick={onClickOpenBtn}>
      <div className={styles.top}>
        {/* 사용자 이름 */}
        <span className={styles.name}>{name}</span>

        {/* 마지막 수신 시간 */}
        <span>{send_at}</span>
      </div>
      <div className={styles.bottom}>
        {/* 메시지 미리보기 */}
        <span className={styles.text}>{text}</span>

        {/* 안 읽은 메시지 개수 */}
        {messagesLength > 0 && <span className={styles.count}>{count}</span>}
      </div>
    </li>
  );
}
