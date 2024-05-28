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
    const recentCorrectData = submissionResponse.data.find(
      (elem) => elem.status === "accepted"
    );
    if (!recentCorrectData) continue;

    const correctSubmissionResponse = await getSubmissionWithSubmissionId(
      recentCorrectData.id,
      token
    );

    setProgress(`${idx}/${length} ${node.fullName} 가져오기 완료!`);

    correctSubmissionResponse.data.codes.map((file) => {
      zip.file(`${practiceName}/${problemName}/${file.name}`, file.content);
    });
  }
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
