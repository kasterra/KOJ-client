import { lanugage } from "~/types";

export interface codeHoles {
  language: lanugage;
  data: parsedCodeElement[][];
}

export interface parsedCodeElement {
  type: "span" | "hole";
  content: string;
  className: string;
}

interface holeInfo {
  startIdx: number;
  length: number;
}

function parseCodeToArray(code: string) {
  return code.split("\r\n").filter((line) => line !== "");
}

/**
 *
 * @param code - 코드 한 줄
 * @param language - prism에서 사용할 언어
 * @returns {parsedCodeElement[]}
 */
function prismCode(code: string, language: string) {
  const Prism = window.Prism;
  const ret: parsedCodeElement[] = [];
  const domParser = new DOMParser();
  const parsed = Prism.highlight(code, Prism.languages[language], language);
  const parsedDom = domParser.parseFromString(parsed, "text/html");
  const body = parsedDom.querySelector("body");
  body!.childNodes.forEach((el) => {
    if (el.nodeType === Node.TEXT_NODE) {
      ret.push({ type: "span", content: el.textContent!, className: "" });
    } else {
      ret.push({
        type: "span",
        content: el.textContent!,
        className: (el as Element).className,
      });
    }
  });

  const regex = /^( *)/;

  const result = code.match(regex);

  if (result?.[1]) {
    ret.splice(0, 0, {
      type: "span",
      content: result[1],
      className: "",
    });
  }

  return ret;
}

/**
 * 코드 한 줄을 읽어서, 블록 주석을 제거한 코드와, 블록 주석 쌍의 위치를 반환
 *
 * checkCommentBlockMatching으로 **안전함이 확인된** 코드를 입력으로 받음
 * @param code - 코드 한 라인
 * @param prevLineOpen - 이전 라인이 열려있는 채로 끝났는가
 *
 * @returns {{holeList: holeInfo[], code: string,isEndedOpen:boolean}}
 */
function commentBlockToHoleInfo(
  code: string,
  prevLineOpen = false
): { holeList: holeInfo[]; code: string; isEndedOpen: boolean } {
  const retList: holeInfo[] = [];
  const openingBlockRegex = /\/\*/g;
  const closingBlockRegex = /\*\//g;
  let isBlockOpen = prevLineOpen;
  let openingIdx = 0;
  let matchNum = 0;
  let retCode = code;

  let openingMatch = openingBlockRegex.exec(code);
  let closingMatch = closingBlockRegex.exec(code);

  if (prevLineOpen) {
    // 전 줄에서 열려 있었을때
    if (!closingMatch) {
      // 이번 줄에 닫는게 없으면
      return {
        // 이 줄 통째로가 빈칸이다
        holeList: [
          {
            startIdx: 0,
            length: code.length,
          },
        ],
        code: retCode,
        isEndedOpen: true,
      };
    }
  }

  while (openingMatch || closingMatch) {
    if (!isBlockOpen && openingMatch) {
      openingIdx = openingMatch.index - 2 * matchNum;
      isBlockOpen = true;
      matchNum++;
      retCode = retCode.replace("/*", "");
      openingMatch = openingBlockRegex.exec(code);
    }
    if (closingMatch) {
      const elem: holeInfo = {
        startIdx: openingIdx,
        length: closingMatch.index - openingIdx - 2 * matchNum,
      };
      retList.push(elem);
      retCode = retCode.replace("*/", "");
      isBlockOpen = false;
      matchNum++;
      closingMatch = closingBlockRegex.exec(code);
      if (!openingMatch) break;
    }
  }
  if (isBlockOpen) {
    const elem: holeInfo = {
      startIdx: openingIdx,
      length: code.length - openingIdx - 2 * matchNum,
    };
    retList.push(elem);
  }
  return { holeList: retList, code: retCode, isEndedOpen: isBlockOpen };
}
/**
 * 코드 블록이 일치하는지 확인
 *
 * 일치하지 않을시 throw
 * @param codeString - **개행문자가 분리되지 않은** 문자열 전체를 넣어서 코멘트 블록의 정확성 검증
 */
function checkCommentBlockMatching(codeString: string) {
  let isOpen = false;

  for (let i = 0; i < codeString.length; i++) {
    if (codeString[i] === "/" && codeString[i + 1] === "*") {
      if (isOpen) {
        throw new Error("이미 주석이 열린 상태에서 주석을 열 수 없습니다");
      }
      isOpen = true;
    } else if (codeString[i] === "*" && codeString[i + 1] === "/") {
      if (!isOpen) {
        throw new Error("이미 주석이 닫힌 상태에서 주석을 닫을 수 없습니다");
      }
      isOpen = false;
    }
  }

  if (isOpen) {
    throw new Error("주석이 닫히지 않고 코드가 끝났습니다");
  }
}

function checkAdjacentHole(codeString: string) {
  let isJustClosed = false;
  for (let i = 0; i < codeString.length; i++) {
    if (codeString[i] === "*" && codeString[i + 1] === "/") {
      isJustClosed = true;
    } else if (
      isJustClosed &&
      codeString[i] === "/" &&
      codeString[i + 1] === "*"
    ) {
      throw new Error(
        "빈칸은 바로 인접할 수 없습니다. 하나의 빈칸으로 정리한 후 다시 시도하세요"
      );
    } else if (codeString[i] !== "/" && isJustClosed) {
      isJustClosed = false;
    }
  }
}

function makeHole(parsedCodes: parsedCodeElement[], holes: holeInfo[]) {
  let codes: parsedCodeElement[] = JSON.parse(JSON.stringify(parsedCodes));
  let currentIdx = 0;
  let codesIdx = 0;
  let holeIdx = 0;
  let hole: holeInfo = holes[holeIdx];
  while (holeIdx < holes.length) {
    while (
      currentIdx + parsedCodes[codesIdx].content.length <
      hole.startIdx + 1
    ) {
      currentIdx += parsedCodes[codesIdx].content.length;
      ++codesIdx;
    }
    if (
      hole.startIdx + hole.length <=
      currentIdx + parsedCodes[codesIdx].content.length // 구멍이 한 span 안에서만 이루어지는가
    ) {
      const elementBasedIdx = hole.startIdx - currentIdx;
      let elements: parsedCodeElement[] = [
        {
          type: "hole",
          content: parsedCodes[codesIdx].content.slice(
            elementBasedIdx,
            elementBasedIdx + hole.length
          ),
          className: "",
        },
      ];
      if (0 !== elementBasedIdx) {
        elements.unshift({
          type: "span",
          content: parsedCodes[codesIdx].content.slice(0, elementBasedIdx),
          className: parsedCodes[codesIdx].className,
        });
      }
      if (
        elementBasedIdx + hole.length !==
        parsedCodes[codesIdx].content.length
      ) {
        elements.push({
          type: "span",
          content: parsedCodes[codesIdx].content.slice(
            elementBasedIdx + hole.length,
            parsedCodes[codesIdx].content.length
          ),
          className: parsedCodes[codesIdx].className,
        });
      }
      codes.splice(codesIdx, 1, ...elements);
    } else {
      // 구멍이 여러 span에 걸쳐 이루어지면
      let holeContents = "";
      const spliceStartIdx = codesIdx;
      let replaceeElements: parsedCodeElement[] = [];
      let deleteCount = 0;
      while (
        parsedCodes[codesIdx] &&
        currentIdx + parsedCodes[codesIdx].content.length <=
          hole.startIdx + hole.length
      ) {
        if (currentIdx < hole.startIdx) {
          // 구멍 시작이 span을 걸쳐서 이루어지면
          replaceeElements.push({
            // 잘라두고
            type: "span",
            content: parsedCodes[codesIdx].content.slice(
              0,
              hole.startIdx - currentIdx
            ),
            className: parsedCodes[codesIdx].className,
          });
          holeContents = parsedCodes[codesIdx].content.slice(
            // 더하기를 시작한다
            hole.startIdx - currentIdx,
            parsedCodes[codesIdx].content.length
          );
          deleteCount += 2;
        } else if (
          hole.startIdx < currentIdx &&
          currentIdx + parsedCodes[codesIdx].content.length <
            hole.startIdx + hole.length // 구멍 끝이 span 끝보다 작으면
        ) {
          holeContents += parsedCodes[codesIdx].content.slice(
            0,
            hole.startIdx + hole.length - currentIdx
          ); // 구멍 끝까지 내용물을 추가하고

          replaceeElements.push({
            type: "hole",
            content: "*".repeat(holeContents.length),
            className: "",
          });

          replaceeElements.push({
            type: "span",
            content: parsedCodes[codesIdx].content.slice(
              hole.startIdx + hole.length - currentIdx,
              parsedCodes[codesIdx].content.length
            ),
            className: parsedCodes[codesIdx].className,
          });

          deleteCount += 2;
          break;
        } else {
          // 시작부터 끝까지 구멍이 잡아먹음
          holeContents += parsedCodes[codesIdx].content;
          deleteCount++;
        }
        codesIdx++;
      }
      replaceeElements.push({
        type: "hole",
        content: "*".repeat(holeContents.length),
        className: "",
      });
      codes.splice(spliceStartIdx, deleteCount, ...replaceeElements);
    }

    holeIdx++;
    currentIdx = 0;
    codesIdx = 0;
    hole = holes[holeIdx];
  }
  return codes;
}

export function codeHole(code: string, language: string) {
  checkCommentBlockMatching(code);
  checkAdjacentHole(code);
  const codeLines = parseCodeToArray(code);
  const holes: holeInfo[][] = [];
  let filteredCodeList = [];

  let prevLineOpen = false;
  const result = commentBlockToHoleInfo(codeLines[0]);
  holes.push(result.holeList);
  filteredCodeList.push(result.code);
  for (let i = 1; i < codeLines.length; ++i) {
    const result = commentBlockToHoleInfo(codeLines[i], prevLineOpen);
    holes.push(result.holeList);
    filteredCodeList.push(result.code);
    prevLineOpen = result.isEndedOpen;
  }

  filteredCodeList = filteredCodeList.map((code) => prismCode(code, language));

  for (let i = 0; i < filteredCodeList.length; ++i) {
    filteredCodeList[i] = makeHole(filteredCodeList[i], holes[i]);
  }

  return filteredCodeList;
}

export function parsedCodesToString(parsedCodes: parsedCodeElement[][]) {
  return parsedCodes
    .map((parsedCode) =>
      parsedCode
        .map((parsedCodeElement) =>
          parsedCodeElement.type === "span"
            ? parsedCodeElement.content
            : `/*${parsedCodeElement.content}*/`
        )
        .join("")
    )
    .join("\r\n");
}

export function generateFullCode(
  parsedCodes: parsedCodeElement[][],
  blanks: string[]
) {
  console.log(blanks);
  let blankIdx = 0;
  return parsedCodes
    .map((parsedCode) =>
      parsedCode
        .map((parsedCodeElement) =>
          parsedCodeElement.type === "span"
            ? parsedCodeElement.content
            : blanks[blankIdx++]
        )
        .join("")
    )
    .join("\r\n");
}
