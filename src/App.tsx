import AdminChatMode from './feature/admin/admin-index';
import SupbaseChannel from './feature/admin/admin-channel';

import './App.css';

function App() {
  return (
    <SupbaseChannel>
      {/* 채팅방 - 관리자 */}
      <AdminChatMode />
    </SupbaseChannel>
  );
}

export default App;
