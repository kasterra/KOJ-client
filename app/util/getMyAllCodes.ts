import JSZip from "jszip";
import {
  getSubmissionStatus,
  getSubmissionWithSubmissionId,
} from "~/API/submission";

export async function getCodesWithZipFile(
  token: string,
  lectureId: string,
  nodes: { fullName: string; id: string }[],
  setProgress: (progress: string) => void
) {
  const zip = new JSZip();
  const length = nodes.length;
  for await (const [idx, node] of nodes.entries()) {
    const [practiceName, problemName] = node.fullName
      .split(">")
      .map((elem) => elem.trim());
    const submissionResponse = await getSubmissionStatus(token, {
      lecture_id: lectureId,
      problem_id: parseInt(node.id),
    });
    if (submissionResponse.status !== 200) {
      throw new Error("failed to get submission data");
    }
    const recentCorrectData = submissionResponse.data.find(
      (elem: any) => elem.status === "accepted"
    );
    if (!recentCorrectData) continue;

    console.log(recentCorrectData);

    const correctSubmissionResponse = await getSubmissionWithSubmissionId(
      recentCorrectData.id,
      token
    );

    setProgress(`${idx}/${length} ${node.fullName} 가져오기 완료!`);

    correctSubmissionResponse.data.codes.map((file: any) => {
      zip.file(`${practiceName}/${problemName}/${file.name}`, file.content);
      console.log(file.content);
    });
  }
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
