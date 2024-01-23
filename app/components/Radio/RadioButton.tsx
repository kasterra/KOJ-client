import radioStyles from "./radio.module.css";

interface Props {
  name: string;
  value: string;
  defaultChecked?: boolean;
  text: string;
  onChange?: (value: string) => void;
}

const RadioButton = ({
  name,
  value,
  defaultChecked,
  text,
  onChange = () => {},
}: Props) => {
  return (
    <label className={radioStyles.wrapper}>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className={radioStyles.radio}
        onChange={() => onChange(value)}
      />
      <span>{text}</span>
    </label>
  );
};

export default RadioButton;
