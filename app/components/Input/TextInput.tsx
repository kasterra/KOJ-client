import { ChangeEventHandler } from "react";
import styles from "./input.module.css";

interface Props {
  title: string;
  name: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
}
const TextInput = ({
  name,
  title,
  placeholder,
  description,
  required = false,
  defaultValue,
  disabled = false,
  value,
  onChange,
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
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default TextInput;
