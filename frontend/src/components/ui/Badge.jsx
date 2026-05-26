import styles from "./Badge.module.css";

/**
 * @param {"success"|"warning"|"danger"|"info"} type
 */
export default function Badge({ children, type = "info" }) {
  return <span className={`${styles.badge} ${styles[type]}`}>{children}</span>;
}
