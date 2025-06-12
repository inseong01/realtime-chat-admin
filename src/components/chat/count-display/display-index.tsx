import styles from './display-index.module.css';

export default function CountItemDisplay({ category, count, unit }: { category: string; count: number; unit: string }) {
  return (
    <div className={styles.countBox}>
      <span className={styles.category}>{category}</span>
      <span className={styles.count}>
        {count} {unit}
      </span>
    </div>
  );
}
