import { parsedCodeElement } from "~/util/codeHole";
import "prismjs/themes/prism-tomorrow.css";
import "./codeblank.css";

interface Props {
  parsedCode: parsedCodeElement[][];
  language: string;
}

const CodeBlank = ({ parsedCode, language }: Props) => {
  return (
    <pre className="codeblank">
      <code className={`language-${language}`}>
        {parsedCode.map((line, idx) => (
          <span key={idx}>
            {line.map((element, idx) => {
              let holeIdx = 0;
              if (element.type === "span") {
                return (
                  <span className={element.className}>{element.content}</span>
                );
              } else {
                return (
                  <input
                    className="blank"
                    style={{ width: element.content.length * 15 }}
                    name="blank[]"
                  />
                );
              }
            })}
            <br />
          </span>
        ))}
      </code>
    </pre>
  );
};

export default CodeBlank;
