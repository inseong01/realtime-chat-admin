import { useContext } from 'react';

import { ReducerStateContext } from '../../util/context/context';

import ChatRoomDisplay from '../../components/chat-room/room-index';
import MessageListDisplay from '../../components/message-list-display/display-index';
import OnlineListDisplay from '../../components/online-list-display/display-index';

export default function CategoryContentDisplay() {
  const state = useContext(ReducerStateContext);

  const category = state.category;
  const userList = state.userList;
  const isRoomClicked = state.isRoomClicked;
  const userMessages = state.userMessages;

  switch (category) {
    case '접속인원':
      return (
        <>
          {userList.map((user, idx) => {
            return <OnlineListDisplay key={idx} user={user} />;
          })}
        </>
      );
    case '받은 메시지': {
      const senderIDs = Object.keys(userMessages);

      return (
        <>
          {isRoomClicked ? (
            <ChatRoomDisplay />
          ) : (
            <>
              {senderIDs.map((id) => {
                return <MessageListDisplay key={id} id={id} />;
              })}
            </>
          )}
        </>
      );
    }
  }

  throw new Error('Unexpected category content error: ' + category);
}
