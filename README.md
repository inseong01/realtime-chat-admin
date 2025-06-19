# 관리자 전용

이 프로젝트는 `Supabase Realtime`을 활용한 **관리자 전용** 채팅 웹 애플리케이션입니다.  
실시간 채팅 웹 애플리케이션에 대한 전반적인 정보는 [여기](https://github.com/inseong01/supabase-realtime-chat)에서 확인할 수 있습니다.

## 구현 방법

### 데이터 처리 방식

`useContext`

- `global`

  - 사용자 ID

- `admin`

  - 디스패치

  - 리듀서 상태

`useReducer`

- `GET_MESSAGE`

  - 본인/방문자 메시지 수신

  - 페이지가 활성화된 상태에서 채팅창이 열려 있거나 본인 메시지면 읽음 처리

  - 방문자 `ID`를 `Key`로 하여 메시지 구분 모음

- `READ_USER_MESSAGE`

  - 선택한 방문자 메시지 읽음 처리

  - 페이지 활성화, 채팅창 진입 상황에 사용

- `SET_USER_TYPING_STATUS`

  - 선택한 방문자 메시지 작성 여부 상태 처리

- `ADD_USER_LIST`

  - 본인 제외한 방문자 `presence` 상태 수집

- `SET_USER_OFFLINE`

  - 방문자 `presence` 오프라인 상태 처리

- `SYNC_USER_LIST`

  - 방문자 온라인 목록 동기화 처리

- `OPEN_CHAT`

  - 선택한 방문자 채팅방 열기

  - 선택한 방문자 ID 선택

- `CLOSE_CHAT`

  - 선택한 방문자 채팅방 닫기

  - 선택한 방문자 ID 비움

- `RESET_ALL`

  - 모든 데이터 초기화

## 설치 및 실행 방법

### 저장소 복제

```bash
git clone https://github.com/inseong01/realtime-chat-admin.git
```

### 패키지 설치

```bash
cd realtime-chat-admin
```

```bash
npm install
```

### 환경 변수 설정

애플리케이션을 정상적으로 실행하려면 환경 변수를 지정해야 합니다.

```bash
# .env
VITE_SUPABASE_URL=<YOUR_SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_KEY>
```

### 애플리케이션 실행

```bash
# 개발 모드 실행
npm run dev
```
