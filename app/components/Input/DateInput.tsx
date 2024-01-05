import styles from "./input.module.css";

interface Props {
  title: string;
  name: string;
  description?: string;
}
const DateInput = ({ name, title, description }: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.title} htmlFor={name}>
        {title}
      </label>
      <input
        className={styles.input}
        type="datetime-local"
        name={name}
        id={name}
      />
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default DateInput;
