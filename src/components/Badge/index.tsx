interface BadgeProps {
  name: string;
}

import styles from "./styles.module.scss";

export function Badge({ name }: BadgeProps) {
  return (
    <div className={styles.badge}>
      {name}
    </div>
  );
}