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
        style={{
          width: width ? width : undefined,
          height: height ? height : undefined,
        }}
      />
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default TextArea;
