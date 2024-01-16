import React from "react";
import styles from "./input.module.css";
import SearchSVG from "./icons/search.svg";

interface Props {
  title: string;
  name: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
}
const SearchInput = ({
  name,
  title,
  onSubmit,
  placeholder,
  description,
  required = false,
}: Props) => {
  return (
    <form className={styles.wrapper} onSubmit={onSubmit}>
      <label className={styles.title} htmlFor={name}>
        {title}
      </label>
      <div className={styles["input-wrapper"]}>
        <input
          className={styles.input}
          type="text"
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
        />
        <button type="submit" className={styles["transparent-btn"]}>
          <img src={SearchSVG} alt="search icon" className={styles.icon} />
        </button>
      </div>

      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </form>
  );
};

export default SearchInput;
