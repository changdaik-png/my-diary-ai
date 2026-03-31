import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 가능해요' });
  }

  const { diary } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `다음 일기 내용을 보고, 따뜻하고 친절한 선생님처럼 한 줄 피드백을 한국어로 해 줘: "${diary}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text().trim();

    return res.status(200).json({
      diary,
      feedback,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI 분석 중 오류 발생:", error);
    return res.status(500).json({ error: 'AI 분석에 실패했습니다. (API 키 확인 필요)' });
  }
}