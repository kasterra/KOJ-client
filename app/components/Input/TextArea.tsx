import styles from "./input.module.css";

interface Props {
  title: string;
  name: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
}

const TextArea = ({
  title,
  name,
  placeholder,
  description,
  required,
  defaultValue,
  width,
  height,
  disabled = false,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.title} htmlFor={name}>
        {title}
      </label>
      <textarea
        className={styles.input}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
        style={{
          width: width ? width : undefined,
          height: height ? height : undefined,
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            (e.currentTarget as HTMLTextAreaElement).value += "\t";
          }
        }}
      />
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default TextArea;
