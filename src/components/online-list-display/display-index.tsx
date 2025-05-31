import { useEffect, useRef, useState } from 'react';

import type { PresenceType } from '../../util/reducer/reducer';
import { getDateTime } from '../../util/function/get-time';

import styles from './display-index.module.css';

/*
  type 추론 오류 문제로 객체 프로퍼티 구성요소 기록 

  isOnline: true
  online_at: "2025-05-30T05:26:12.575Z"
  presence_ref: "GEQ2w_-MurWd-QSI"
  userID: "99acf830-3d16-11f0-8b2d-9fd8d9cea277"
*/

export default function OnlineListDisplay({ user }: { user: PresenceType }) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [onlineSince, setOnlineSince] = useState('');

  const name = user.userID;
  const online_at = getDateTime('time', new Date(user.online_at));

  function updateTime() {
    const time = getDateTime('elapsed', new Date(user.online_at));
    setOnlineSince(time);

    timeoutRef.current = setTimeout(() => {
      updateTime();
    }, 1000);
  }

  /* 접속 경과 시간 */
  useEffect(() => {
    updateTime();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <li className={styles.list}>
      <span className={styles.name}>{name}</span>

      <div className={styles.connectBox}>
        <div className={styles.connect}>
          <span>접속일시</span>
          <span className={styles.time}>{online_at}</span>
        </div>
        <div className={styles.connect}>
          <span>경과시간</span>
          <span className={styles.time}>{onlineSince}</span>
        </div>
      </div>
    </li>
  );
}
