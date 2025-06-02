import { useContext, type MouseEvent } from 'react';

import { DispatchContext, ReducerStateContext } from '../../util/context/context';

import styles from './list-indext.module.css';

export default function IconList({
  src,
  alt,
  count,
}: {
  src: string;
  alt: string;
  count?: number;
}) {
  const state = useContext(ReducerStateContext);
  const dispatch = useContext(DispatchContext);

  const onClickButton = (e: MouseEvent<HTMLButtonElement>) => {
    if (!dispatch) return;

    const category = e.currentTarget.title;
    if (state.category === category) return;

    dispatch({ type: 'CHANGE_CATEGORY', category });
  };

  return (
    <li>
      <button className={styles.btn} onClick={onClickButton} title={alt}>
        {/* 데이터 개수 */}
        <DataAmountDisplay count={count} />

        {/* 아이콘 */}
        <img src={src} alt={alt} />
      </button>
    </li>
  );
}

function DataAmountDisplay({ count }: { count?: number }) {
  if (!count) return;

  const isCountAble = count > 0;
  const countCSS = isCountAble ? styles.count : '';

  return <>{isCountAble && <div className={countCSS}></div>}</>;
}
