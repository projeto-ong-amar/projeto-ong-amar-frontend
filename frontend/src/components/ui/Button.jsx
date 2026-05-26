import styles from "./Button.module.css";

/**
 * @param {"primary"|"secondary"|"danger"|"outline"} variant
 */
export default function Button({ children, variant = "primary", onClick, disabled, type = "button", style }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
