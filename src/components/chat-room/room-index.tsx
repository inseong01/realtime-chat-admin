import { useContext, useEffect, useRef, useState, type ChangeEvent } from 'react';

import { DispatchContext, ReducerStateContext } from '../../util/context/context';
import { USER_ID, type MessageDataPayload } from '../../util/const/common';
import { supabase } from '../../util/supabase/supabaseClient';

import styles from './room-index.module.css';

export default function ChatRoomDisplay() {
  const state = useContext(ReducerStateContext);
  const reducer = useContext(DispatchContext);

  const chatRoomRef = useRef<HTMLUListElement>(null);

  const selectedID = state.selectedID;

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

    const send_at = new Date().toISOString();
    const isTyping = e.target.value.length !== 0;

    const updatedOpponentState: MessageDataPayload = {
      type: 'broadcast',
      event: 'opponent',
      payload: { text: '', isTyping, id: USER_ID, send_at, receiver_id: selectedID },
    };

    MY_CHANNEL.send(updatedOpponentState).then((res) => console.log(res));
  }

  /* 텍스트 전달 */
  async function onClickSend() {
    if (!text.length) return;

    const send_at = new Date().toISOString();

    const msgData: MessageDataPayload = {
      type: 'broadcast',
      event: 'send',
      payload: {
        text: text,
        isTyping: false,
        id: USER_ID,
        send_at,
        receiver_id: selectedID,
      },
    };

    const updatedOpponentState: MessageDataPayload = {
      type: 'broadcast',
      event: 'opponent',
      payload: {
        text: text,
        isTyping: false,
        id: USER_ID,
        send_at,
        receiver_id: selectedID,
      },
    };

    Promise.all([MY_CHANNEL.send(msgData), MY_CHANNEL.send(updatedOpponentState)]).catch(
      (err) => {
        console.error('Error sending messages: ', err);
      }
    );

    typingText('');
  }

  const messages = state.userMessages[selectedID].messages;
  const isTyping = state.userMessages[selectedID].isTyping;
  const currentChatRoomMessage = state.userMessages[selectedID].messages;

  /* 읽음 처리 */
  useEffect(() => {
    if (!reducer) return;
    if (selectedID !== state.selectedID) return;

    reducer({ type: 'READ_USER_MESSAGE', id: selectedID });
  }, []);

  /* 메시지 창 위치 조절 */
  useEffect(() => {
    if (!chatRoomRef.current) return;

    const chatRoomHeight = chatRoomRef.current.scrollHeight;
    chatRoomRef.current.scrollTo(0, chatRoomHeight);
  }, [currentChatRoomMessage, isTyping]);

  return (
    <li className={styles.chatRoom}>
      <div className={styles.top}>
        <span className={styles.name}>{selectedID}</span>

        <button className={styles.btn} onClick={onClickCloseBtn}>
          뒤로가기
        </button>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.chatList} ref={chatRoomRef}>
          {/* 메시지 목록 */}
          {messages.map((msg, idx) => {
            const msgCSS = msg.id === USER_ID ? styles.mine : styles.other;

            return (
              <li key={idx} className={msgCSS}>
                <span className={styles.msg}>{msg.text}</span>
              </li>
            );
          })}

          {/* 입력중 레이아웃 */}
          {isTyping && <TypingAnimation />}
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

function TypingAnimation() {
  return (
    <div className={styles.receive}>
      <div className={styles.msg}>
        <div className={styles.typing}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
