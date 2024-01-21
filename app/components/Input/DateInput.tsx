import styles from "./input.module.css";

interface Props {
  title: string;
  name: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
}
const DateInput = ({
  name,
  title,
  description,
  required,
  defaultValue,
}: Props) => {
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
        required={required}
        defaultValue={defaultValue}
      />
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default DateInput;
