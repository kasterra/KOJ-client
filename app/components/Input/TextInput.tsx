import styles from "./input.module.css";

interface Props {
  title: string;
  name: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
}
const TextInput = ({
  name,
  title,
  placeholder,
  description,
  required = false,
  defaultValue,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.title} htmlFor={name}>
        {title}
      </label>
      <input
        className={styles.input}
        type="text"
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
      />
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default TextInput;
