import { useContext, useEffect, type RefObject } from 'react';

import { ADMIN_ID } from '../../util/const/const';

import { AdminDispatchContext, AdminReducerStateContext } from './context';

import ChatHeader from '../../components/chat/header/heaer-index';
import ChatBody from '../../components/chat/body/body-index';
import ChatFooter from '../../components/chat/footer/footer-index';

export default function ChatRoomDisplay({ ref }: { ref: RefObject<HTMLDivElement | null> }) {
  const state = useContext(AdminReducerStateContext);
  const reducer = useContext(AdminDispatchContext);

  const selectedID = state.selectedID;
  const messages = state.userList[selectedID].messages;
  const isTyping = state.userList[selectedID].isTyping;
  const isOnline = state.userList[selectedID].isOnline;
  const userName = state.userList[selectedID].userName;
  const currentChatRoomMessage = state.userList[selectedID].messages;
  const status = isOnline ? '온라인' : '오프라인';

  /* 메시지 창 위치 조절 */
  useEffect(() => {
    if (!ref.current) return;

    const chatRoomHeight = ref.current.scrollHeight;
    ref.current.scrollTo(0, chatRoomHeight);
  }, [ref, currentChatRoomMessage, isTyping]);

  /* 윈도우 포커스 여부 */
  useEffect(() => {
    if (!reducer) return;
    reducer({ type: 'READ_USER_MESSAGE', id: selectedID });

    function readMessagesIfVisible() {
      if (!reducer) return;
      if (document.visibilityState === 'visible') {
        reducer({ type: 'READ_USER_MESSAGE', id: selectedID });
      }
    }

    window.addEventListener('visibilitychange', readMessagesIfVisible);

    return () => {
      window.removeEventListener('visibilitychange', readMessagesIfVisible);
    };
  }, [reducer, selectedID]);

  return (
    <>
      {/* 헤더 */}
      <ChatHeader enableBack={true} chatroomTitle={userName} opponentType={`방문자`} opponentStatus={status} />

      {/* 메인 */}
      <ChatBody messages={messages} isOpponentTyping={isTyping} />

      {/* 푸터 */}
      <ChatFooter id={ADMIN_ID} receiver_id={selectedID} isOpponentOnline={isOnline} />
    </>
  );
}
