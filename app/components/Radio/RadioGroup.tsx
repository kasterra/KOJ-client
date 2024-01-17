import styles from "~/components/Input/input.module.css";
import RadioButton from "./RadioButton";

interface Props {
  title: string;
  name: string;
  valueList: string[];
  textList: string[];
  description?: string;
  defaultValue?: string;
}

const RadioGroup = ({
  title,
  name,
  valueList,
  textList,
  description,
  defaultValue,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.title}>{title}</label>
      <div className={styles["input-wrapper"]}>
        {valueList.map((value, idx) => (
          <RadioButton
            key={idx}
            name={name}
            value={value}
            defaultChecked={
              valueList.some((val) => val === defaultValue)
                ? defaultValue === valueList[idx]
                : idx === 0
            }
            text={textList[idx]}
          />
        ))}
      </div>
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </div>
  );
};

export default RadioGroup;
