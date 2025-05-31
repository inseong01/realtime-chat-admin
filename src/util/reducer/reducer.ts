import { USER_ID, type MessageDataPayload } from '../const/common';

export type PresenceType = { [key: string]: any };

type Messages = {
  id: MessageDataPayload['payload']['id'];
  text: MessageDataPayload['payload']['text'];
  send_at: MessageDataPayload['payload']['send_at'];
};

type UserMessages = {
  [key: string]: {
    userID: MessageDataPayload['payload']['id'];
    isTyping: MessageDataPayload['payload']['isTyping'];
    messages: Messages[];
  };
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
  list: PresenceType[];
}

interface RemoveUserListAction {
  type: 'REMOVE_USER_LIST';
  key: string;
}

interface GetMessageAction {
  type: 'GET_MESSAGE';
  data: MessageDataPayload;
}

export type ActionType =
  | ChangeCategoryAction
  | OpenChatAction
  | CloseChatAction
  | AddUserListAction
  | RemoveUserListAction
  | GetMessageAction;

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
        isRoomClicked: false,
      };
    }
    case 'ADD_USER_LIST': {
      const userList = action.list;

      return {
        ...state,
        userList: [...state.userList, ...userList],
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

      const id = data.id.toString();
      const text = data.text;
      const send_at = data.send_at;
      const isTyping = data.isTyping;
      const messages = { id, text: text, send_at: send_at };

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
      const isMessageDataExist = !state.userMessages[id];

      if (isMessageDataExist) {
        return {
          ...state,
          userMessages: {
            ...state.userMessages,
            [id]: {
              userID: id,
              isTyping,
              messages: [messages],
            },
          },
        };
      }

      const updatedMessageData = {
        ...state.userMessages[id],
        isTyping,
        messages: [...state.userMessages[id].messages, messages],
      };

      return {
        ...state,
        userMessages: {
          ...state.userMessages,
          [id]: updatedMessageData,
        },
      };
    }

    default: {
      throw new Error('unexpected action type');
    }
  }
}
