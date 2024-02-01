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
    <div style={{ height, border: "1px solid #dbe2ea", width: "100%" }}>
      <Editor
        language={language}
        options={{
          readOnly,
          domReadOnly: readOnly,
        }}
        value={value}
        onChange={(val) => onChange(val as string)}
      />
    </div>
  );
};

export default CodeBlock;
