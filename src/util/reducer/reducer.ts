import { USER_ID, type MessageDataPayload } from '../const/common';

export type PresenceType = Record<string, any>;
// export type PresenceType = { [key: string]: any };

type Message = {
  id: MessageDataPayload['payload']['id'];
  text: MessageDataPayload['payload']['text'];
  send_at: MessageDataPayload['payload']['send_at'];
  isRead: boolean;
};

const initMessage: Message = {
  id: '',
  isRead: false,
  send_at: '',
  text: '',
};

type UserMessages = {
  [key: string]: {
    userID: MessageDataPayload['payload']['id'];
    isTyping: MessageDataPayload['payload']['isTyping'];
    messages: Message[];
  };
};

type SetUserStateData = {
  id: MessageDataPayload['payload']['id'];
  isTyping: MessageDataPayload['payload']['isTyping'];
};

export type InitAppState = {
  category: string;
  isRoomClicked: boolean;
  userList: PresenceType[];
  userMessages: UserMessages;
  selectedID: MessageDataPayload['payload']['id'];
};

export const initAppState: InitAppState = {
  category: '접속인원',
  isRoomClicked: false,
  userList: [],
  userMessages: {},
  selectedID: '',
};

interface ChangeCategoryAction {
  type: 'CHANGE_CATEGORY';
  category: string;
}

interface OpenChatAction {
  type: 'OPEN_CHAT';
  id: MessageDataPayload['payload']['id'];
}

interface CloseChatAction {
  type: 'CLOSE_CHAT';
}

interface AddUserListAction {
  type: 'ADD_USER_LIST';
  list: PresenceType;
  myID: string;
  // list: PresenceType[];
}

interface RemoveUserListAction {
  type: 'REMOVE_USER_LIST';
  key: string;
}

interface GetMessageAction {
  type: 'GET_MESSAGE';
  data: MessageDataPayload;
}

interface SetUserMessageStateAction {
  type: 'SET_USER_MESSAGE_STATE';
  data: SetUserStateData;
}

interface ReadUserMessageAction {
  type: 'READ_USER_MESSAGE';
  id: string;
}

export type ActionType =
  | ChangeCategoryAction
  | OpenChatAction
  | CloseChatAction
  | AddUserListAction
  | RemoveUserListAction
  | GetMessageAction
  | SetUserMessageStateAction
  | ReadUserMessageAction;

export function reducer(state: InitAppState, action: ActionType) {
  switch (action.type) {
    case 'CHANGE_CATEGORY': {
      const category = action.category;

      return {
        ...state,
        category,
      };
    }
    case 'OPEN_CHAT': {
      const selectedID = action.id;

      return {
        ...state,
        selectedID,
        isRoomClicked: true,
      };
    }
    case 'CLOSE_CHAT': {
      return {
        ...state,
        selectedID: '',
        isRoomClicked: false,
      };
    }
    case 'ADD_USER_LIST': {
      const onlineUsersList = action.list;
      const myID = action.myID;
      const filteredUserList = Object.entries(onlineUsersList)
        .filter(([key]) => key !== myID) // 본인 ID 제외
        .map(([_, value]) => value[0]); // 접속 상태 값 추출 (열려있는 탭 중 첫번째 정보)

      return {
        ...state,
        userList: [...filteredUserList],
      };
    }

    case 'REMOVE_USER_LIST': {
      const userID = action.key;
      const updatedUserList = state.userList.filter((user) => user.userID !== userID);

      return {
        ...state,
        userList: [...updatedUserList],
      };
    }
    case 'GET_MESSAGE': {
      const data = action.data.payload;
      const selectedID = state.selectedID;

      const id = data.id.toString();
      const text = data.text;
      const send_at = data.send_at;
      const isTyping = data.isTyping;

      const isRead = selectedID === id; // 채팅방 접속 중이면
      const messages = { ...initMessage, id, text: text, send_at: send_at, isRead };

      /* 관리자 메시지 처리 */
      const isAdminMessage = id === USER_ID;

      if (isAdminMessage) {
        const receiver_id = data.receiver_id!;
        const updatedMessageData = [
          ...state.userMessages[receiver_id].messages,
          messages,
        ];

        return {
          ...state,
          userMessages: {
            ...state.userMessages,
            [receiver_id]: {
              ...state.userMessages[receiver_id],
              messages: updatedMessageData,
            },
          },
        };
      }

      /* 관리자외 메시지 처리 */
      const isMessageDataNotExist = !state.userMessages[id];

      if (isMessageDataNotExist) {
        return {
          ...state,
          userMessages: {
            ...state.userMessages,
            [id]: {
              ...state.userMessages[id],
              userID: id,
              isTyping,
              messages: [messages],
            },
          },
        };
      }

      return {
        ...state,
        userMessages: {
          ...state.userMessages,
          [id]: {
            ...state.userMessages[id],
            isTyping,
            messages: [...state.userMessages[id].messages, messages],
          },
        },
      };
    }
    case 'SET_USER_MESSAGE_STATE': {
      const id = action.data.id;
      const isTyping = action.data.isTyping;

      /* 관리자외 메시지 처리 */
      const isMessageDataNotExist = !state.userMessages[id];

      if (isMessageDataNotExist) {
        return {
          ...state,
          userMessages: {
            ...state.userMessages,
            [id]: {
              userID: id,
              isTyping,
              messages: [],
              isRead: false,
            },
          },
        };
      }

      return {
        ...state,
        userMessages: {
          ...state.userMessages,
          [id]: {
            ...state.userMessages[id],
            isTyping,
          },
        },
      };
    }
    case 'READ_USER_MESSAGE': {
      const id = action.id;

      const readMessages = state.userMessages[id].messages.map((msg) => ({
        ...msg,
        isRead: true,
      }));

      return {
        ...state,
        userMessages: {
          ...state.userMessages,
          [id]: {
            ...state.userMessages[id],
            messages: readMessages,
          },
        },
      };
    }
    default: {
      throw new Error('unexpected action type');
    }
  }
}
