import { useContext, useState, type ChangeEvent } from 'react';

import { DispatchContext, ReducerStateContext } from '../../util/context/context';
import { USER_ID, type MessageDataPayload } from '../../util/const/common';
import { supabase } from '../../util/supabase/supabaseClient';

import styles from './room-index.module.css';

export default function ChatRoomDisplay() {
  const state = useContext(ReducerStateContext);
  const reducer = useContext(DispatchContext);

  const receiver_id = state.selectedID;

  /* 채팅방 닫기 */
  const onClickCloseBtn = () => {
    if (!reducer) return;
    reducer({ type: 'CLOSE_CHAT' });
  };

  const [text, typingText] = useState('');

  const MY_CHANNEL = supabase.channel('channel_1', {
    config: {
      broadcast: { self: true },
    },
  });

  /* 텍스트 입력 */
  function onChangeText(e: ChangeEvent<HTMLInputElement>) {
    typingText(e.target.value);
  }

  /* 텍스트 전달 */
  function onClickSend() {
    if (!text.length) return;

    const send_at = new Date().toISOString();

    const msgData: MessageDataPayload = {
      type: 'broadcast',
      event: 'send',
      payload: { text: text, isTyping: false, id: USER_ID, send_at, receiver_id },
    };

    MY_CHANNEL.send(msgData).then((res) => console.log(res));

    const updatedOpponentState: MessageDataPayload = {
      type: 'broadcast',
      event: 'opponent',
      payload: { text: text, isTyping: false, id: USER_ID, send_at, receiver_id },
    };

    MY_CHANNEL.send(updatedOpponentState).then((res) => console.log(res));

    typingText('');
  }

  const id = state.selectedID;
  const messages = state.userMessages[id].messages;

  return (
    <li className={styles.chatRoom}>
      <div className={styles.top}>
        <span className={styles.name}>{id}</span>

        <button className={styles.btn} onClick={onClickCloseBtn}>
          뒤로가기
        </button>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.chatList}>
          {messages.map((msg, idx) => {
            const msgCSS = msg.id === USER_ID ? styles.mine : styles.other;

            return (
              <li key={idx} className={msgCSS}>
                <span className={styles.msg}>{msg.text}</span>
              </li>
            );
          })}
        </ul>

        <div className={styles.inputBox}>
          {/* 입력창 */}
          <input
            type='text'
            className={styles.input}
            placeholder='메시지를 입력하세요'
            onChange={onChangeText}
            value={text}
          />

          {/* 전송 버튼 */}
          <button className={styles.send} onClick={onClickSend}>
            전송
          </button>
        </div>
      </div>
    </li>
  );
}
