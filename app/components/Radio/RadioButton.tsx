import radioStyles from "./radio.module.css";

interface Props {
  name: string;
  value: string;
  defaultChecked?: boolean;
  text: string;
}

const RadioButton = ({ name, value, defaultChecked, text }: Props) => {
  return (
    <label className={radioStyles.wrapper}>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className={radioStyles.radio}
      />
      <span>{text}</span>
    </label>
  );
};

export default RadioButton;
