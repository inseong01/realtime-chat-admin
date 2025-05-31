import { useContext } from 'react';

import { DispatchContext, ReducerStateContext } from '../../util/context/context';
import type { MessageDataPayload } from '../../util/const/common';

import styles from './display-index.module.css';
import { getDateTime } from '../../util/function/get-time';

export default function MessageListDisplay({
  id,
}: {
  id: MessageDataPayload['payload']['id'];
}) {
  const state = useContext(ReducerStateContext);
  const reducer = useContext(DispatchContext);

  const selectedUserMessages = state.userMessages[id];
  const messages = selectedUserMessages.messages;
  const latestMessage = messages[messages.length - 1];

  const name = id;
  const text = latestMessage.text;
  const send_at = getDateTime('time', new Date(latestMessage.send_at));

  /* 채팅방 열기 */
  const onClickOpenBtn = () => {
    if (!reducer) return;

    reducer({ type: 'OPEN_CHAT', id });
  };

  return (
    <li className={styles.list} onClick={onClickOpenBtn}>
      <div className={styles.top}>
        <span className={styles.name}>{name}</span> <span>{send_at}</span>
      </div>
      <div className={styles.bottom}>
        <span>{text}</span>
      </div>
    </li>
  );
}
