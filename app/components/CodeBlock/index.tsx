import Editor, { useMonaco } from "@monaco-editor/react";

interface Props {
  language: "c" | "java" | "javascript" | "python" | "plaintext";
  value: string;
  height: number | string;
  onChange: (arg: string) => void;
  readOnly?: boolean;
}

const CodeBlock = ({ language, height, readOnly, value, onChange }: Props) => {
  return (
    <Editor
      height={height}
      language={language}
      options={{
        readOnly,
        domReadOnly: readOnly,
      }}
      value={value}
      onChange={(val) => onChange(val as string)}
    />
  );
};

export default CodeBlock;
