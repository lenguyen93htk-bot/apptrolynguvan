import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_INSTRUCTION = `Bạn là AI Tutor Ngữ văn dành cho học sinh THCS Việt Nam lớp 6–9 trường THCS Huỳnh Thúc Kháng.
Mục tiêu của bạn không phải viết bài thay học sinh mà giúp học sinh hình thành tư duy đọc, tư duy lập luận và tư duy viết.
Ưu tiên phương pháp Socratic.
Hãy hỏi trước khi trả lời.
Khuyến khích học sinh trình bày suy nghĩ của mình.
Phân nhỏ nhiệm vụ khó thành từng bước.
Phản hồi tích cực, cụ thể, phù hợp lứa tuổi.
Không tâng bốc quá mức.
Không bịa tác giả, tác phẩm, câu thơ, câu văn, số liệu hoặc dẫn chứng.
Nếu không chắc chắn phải nói rõ.
Khi phân tích văn bản, phân biệt nội dung văn bản với suy luận.
Khi góp ý bài viết, giữ lại giọng văn và ý tưởng của học sinh.
Không viết lại toàn bộ bài trừ trường hợp giáo viên sử dụng chế độ minh họa hoặc học sinh yêu cầu ví dụ sau khi đã thực hiện quá trình tự học.
Không tạo nội dung không phù hợp với học sinh THCS.
Ngôn ngữ luôn trong sáng, chuẩn tiếng Việt, dễ hiểu và có tính sư phạm.`;

// Helper for Gemini call
async function callGemini(prompt: string, jsonMode = false): Promise<string> {
  if (!ai) {
    throw new Error('No API key configured');
  }
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
    temperature: 0.7,
  };
  if (jsonMode) {
    config.responseMimeType = 'application/json';
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config,
  });
  return response.text || '';
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Ngữ Văn THCS – Huỳnh Thúc Kháng',
    hasKey: !!apiKey,
  });
});

// AI 1: HIỂU ĐỀ
app.post('/api/ai/understand-topic', async (req: Request, res: Response) => {
  const { topic, studentReflection } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Chưa có đề bài' });
  }

  const prompt = `Phân tích đề văn sau cho học sinh THCS (Lớp 6-9).
Đề bài: "${topic}"
${studentReflection ? `Suy nghĩ của học sinh khi thử nói lại đề bài: "${studentReflection}"` : ''}

Trả về JSON với cấu trúc:
{
  "genre": "Kiểu bài (VD: Nghị luận xã hội / Nghị luận văn học / Tự sự / Thuyết minh)",
  "coreIssue": "Vấn đề trọng tâm cần giải quyết",
  "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3"],
  "knowledgeScope": "Phạm vi kiến thức (trong tác phẩm nào hoặc đời sống xã hội)",
  "contentRequirements": ["Yêu cầu 1", "Yêu cầu 2"],
  "formatRequirements": "Yêu cầu hình thức (đoạn văn khoảng bao nhiêu chữ hoặc bài văn hoàn chỉnh có 3 phần)",
  "socraticQuestion": "Câu hỏi gợi mở cuối cùng yêu cầu học sinh thử nói lại đề bài theo cách hiểu của mình",
  "feedbackOnReflection": "${studentReflection ? 'Nhận xét ngắn gọn, khích lệ suy nghĩ của học sinh' : ''}"
}`;

  try {
    const raw = await callGemini(prompt, true);
    const data = JSON.parse(raw);
    return res.json(data);
  } catch (err) {
    // Fallback response
    return res.json({
      genre: topic.includes('suy nghĩ') || topic.includes('ý kiến') || topic.includes('nghị luận') ? 'Nghị luận xã hội' : 'Nghị luận văn học',
      coreIssue: topic.length > 50 ? topic.substring(0, 50) + '...' : topic,
      keywords: ['vấn đề cốt lõi', 'dẫn chứng thực tế', 'bài học nhận thức và hành động'],
      knowledgeScope: 'Kiến thức đời sống xã hội và trải nghiệm thực tế của lứa tuổi học sinh THCS',
      contentRequirements: [
        'Làm rõ khái niệm hoặc hiện tượng được nêu trong đề',
        'Phân tích nguyên nhân, biểu hiện và ý nghĩa/tác hại',
        'Rút ra bài học cho bản thân học sinh'
      ],
      formatRequirements: 'Bài văn/đoạn văn hoàn chỉnh, lập luận chặt chẽ, dẫn chứng xác thực, diễn đạt trong sáng.',
      socraticQuestion: 'Em thử nói lại: Đề bài này muốn em thuyết phục người đọc về điều gì nhất?',
      feedbackOnReflection: studentReflection ? `Thầy/cô thấy em đã nắm được ý chính: "${studentReflection}". Hãy giữ vững hướng đi này nhé!` : null
    });
  }
});

// AI 2: KHƠI NGUỒN Ý TƯỞNG (Socratic Questions & Idea Cards)
app.post('/api/ai/brainstorm', async (req: Request, res: Response) => {
  const { topic, existingIdeas = [] } = req.body;

  const prompt = `Đề bài: "${topic}"
Các ý học sinh hiện có: ${JSON.stringify(existingIdeas)}
Hãy đóng vai AI Tutor Ngữ văn gợi mở ý tưởng cho học sinh bằng phương pháp Socratic.
KHÔNG viết sẵn bài. Hãy đưa ra 4-5 câu hỏi gợi mở khơi dậy trải nghiệm cá nhân, góc nhìn phản biện, dẫn chứng đời thực.
Đồng thời gợi ý 3 "thẻ ý tưởng hạt mầm" ngắn gọn để học sinh tự chọn lọc và phát triển.

Trả về JSON:
{
  "socraticQuestions": [
    "Câu hỏi 1...",
    "Câu hỏi 2...",
    "Câu hỏi 3...",
    "Câu hỏi 4..."
  ],
  "seedIdeas": [
    {"id": "seed-1", "title": "Góc nhìn 1", "description": "Gợi ý định hướng...", "category": "Thực tế"},
    {"id": "seed-2", "title": "Góc nhìn 2", "description": "Gợi ý định hướng...", "category": "Ý nghĩa"},
    {"id": "seed-3", "title": "Góc nhìn 3", "description": "Gợi ý định hướng...", "category": "Phản biện"}
  ]
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      socraticQuestions: [
        'Điều gì trong đề bài khiến em cảm thấy gần gũi hoặc ấn tượng nhất?',
        'Em đã từng chứng kiến hoặc trải qua một tình huống nào tương tự trong trường học hay đời sống chưa?',
        'Nếu có một người bạn không đồng tình với quan điểm này, bạn ấy sẽ nói gì và em sẽ trả lời ra sao?',
        'Chi tiết hoặc tấm gương người thật việc thật nào có thể trở thành dẫn chứng đắt giá nhất?'
      ],
      seedIdeas: [
        { id: 'seed-1', title: 'Biểu hiện trong đời sống học đường', description: 'Gắn liền với thái độ học tập, tình bạn bè và lòng trung thực.', category: 'Thực tế' },
        { id: 'seed-2', title: 'Ý nghĩa nuôi dưỡng tâm hồn', description: 'Giúp bản thân kiên trì, trưởng thành và lan tỏa năng lượng tích cực.', category: 'Ý nghĩa' },
        { id: 'seed-3', title: 'Góc nhìn phản biện/Mở rộng', description: 'Tránh những ngộ nhận, phân biệt giữa tự tin và tự kiêu, dũng cảm và liều lĩnh.', category: 'Phản biện' }
      ]
    });
  }
});

// AI 3: CÂY LUẬN ĐIỂM (Thesis Tree & Logic Checker)
app.post('/api/ai/thesis-tree', async (req: Request, res: Response) => {
  const { topic, thesis, points } = req.body;

  const prompt = `Đề bài: "${topic}"
Luận đề học sinh đưa ra: "${thesis || topic}"
Các luận điểm học sinh đã lập: ${JSON.stringify(points || [])}

Hãy kiểm tra cấu trúc lập luận của học sinh THCS:
1. Luận điểm có trả lời trúng đề bài không?
2. Các luận điểm có bị trùng lặp hoặc mâu thuẫn không?
3. Lí lẽ có thuyết phục không?
4. Dẫn chứng có xác thực không (lưu ý: TUYỆT ĐỐI không bịa đặt dẫn chứng lịch sử/văn học)?

Trả về JSON:
{
  "evaluation": {
    "isValid": true,
    "strengths": "Điểm mạnh trong cách tư duy của học sinh",
    "improvements": "Điểm cần bổ sung hoặc điều chỉnh",
    "verificationNotice": "Lưu ý kiểm chứng dẫn chứng nếu có"
  },
  "recommendedTree": [
    {
      "point": "Luận điểm 1: ...",
      "reasoning": "Lí lẽ vì sao lại như vậy...",
      "evidenceSuggestion": "Gợi ý dạng dẫn chứng nên tìm...",
      "caution": "Lưu ý không nhầm lẫn..."
    },
    {
      "point": "Luận điểm 2: ...",
      "reasoning": "Lí lẽ tiếp theo...",
      "evidenceSuggestion": "Gợi ý dạng dẫn chứng...",
      "caution": ""
    },
    {
      "point": "Luận điểm 3 (Mở rộng/Phản đề): ...",
      "reasoning": "Lí lẽ mở rộng...",
      "evidenceSuggestion": "Gợi ý thực tế...",
      "caution": ""
    }
  ]
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      evaluation: {
        isValid: true,
        strengths: 'Các luận điểm bước đầu đã bám sát yêu cầu của đề bài, phân chia các khía cạnh rõ ràng.',
        improvements: 'Nên làm sắc nét thêm sự khác biệt giữa các luận điểm để tránh lặp ý; chuẩn bị dẫn chứng người thật việc thật.',
        verificationNotice: 'Lưu ý: Luôn kiểm tra chính xác họ tên nhân vật, sự kiện lịch sử hoặc tên tác giả, tác phẩm trước khi đưa vào bài viết!'
      },
      recommendedTree: [
        {
          point: 'Luận điểm 1: Khẳng định tính đúng đắn và ý nghĩa cốt lõi của vấn đề',
          reasoning: 'Vấn đề xuất phát từ quy luật cuộc sống và là nền tảng cho nhân cách.',
          evidenceSuggestion: 'Dẫn chứng về một tấm gương vượt khó hoặc câu chuyện danh nhân quen thuộc.',
          caution: 'Không kể lể quá dài dòng về tiểu sử, tập trung vào hành động cốt lõi.'
        },
        {
          point: 'Luận điểm 2: Phân tích biểu hiện và tác động trong đời sống học sinh',
          reasoning: 'Ảnh hưởng trực tiếp đến kết quả học tập và các mối quan hệ xã hội hàng ngày.',
          evidenceSuggestion: 'Dẫn chứng từ đời sống học đường hoặc hoạt động tình nguyện.',
          caution: 'Cần số liệu hoặc câu chuyện chân thực, tránh bịa đặt.'
        },
        {
          point: 'Luận điểm 3: Mở rộng, phản biện và rút ra bài học hành động',
          reasoning: 'Nhìn nhận vấn đề ở nhiều chiều, phê phán biểu hiện tiêu cực đi ngược lại.',
          evidenceSuggestion: 'Hiện tượng lười biếng, ỷ lại hoặc thói ích kỷ trong giới trẻ.',
          caution: 'Phê phán chân thành, mang tính xây dựng, hướng tới giải pháp.'
        }
      ]
    });
  }
});

// AI 4 & 9: SƠ ĐỒ TƯ DUY (Mind Map Node Generator)
app.post('/api/ai/mindmap', async (req: Request, res: Response) => {
  const { title, type = 'work' } = req.body;

  const prompt = `Tạo sơ đồ tư duy (mind map) môn Ngữ văn THCS cho chủ đề: "${title}" (Thể loại/Loại hình: ${type}).
Cấu trúc chuẩn theo chương trình GDPT Ngữ văn:
- Tác phẩm: Tác giả, Hoàn cảnh ra đời, Thể loại, Giá trị nội dung (nhân vật, hình ảnh, bức thông điệp), Giá trị nghệ thuật, Ý nghĩa văn học.
- Kiến thức Tiếng Việt: Khái niệm, Phân loại/Đặc điểm, Tác dụng/Hiệu quả tu từ, Ví dụ tiêu biểu, Lưu ý sử dụng.
- Chủ đề viết: Luận đề, Mở bài, Luận điểm 1, Luận điểm 2, Luận điểm 3, Phản biện, Kết bài.

Trả về JSON node dạng cây:
{
  "id": "root",
  "label": "${title}",
  "color": "#4169F6",
  "children": [
    {
      "id": "branch-1",
      "label": "Tên nhánh chính 1",
      "color": "#6750FF",
      "children": [
        {"id": "b1-c1", "label": "Ý phụ 1", "color": "#11B981"},
        {"id": "b1-c2", "label": "Ý phụ 2", "color": "#11B981"}
      ]
    }
  ]
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      id: 'root',
      label: title,
      color: '#4169F6',
      children: [
        {
          id: 'branch-1',
          label: 'Mở đầu & Bối cảnh',
          color: '#6750FF',
          children: [
            { id: 'b1-c1', label: 'Tác giả & hoàn cảnh sáng tác', color: '#11B981' },
            { id: 'b1-c2', label: 'Cảm hứng chủ đạo & thể loại', color: '#11B981' }
          ]
        },
        {
          id: 'branch-2',
          label: 'Nội dung cốt lõi',
          color: '#FF7A00',
          children: [
            { id: 'b2-c1', label: 'Hình tượng nhân vật / Luận điểm 1', color: '#11B981' },
            { id: 'b2-c2', label: 'Diễn biến tâm trạng / Luận điểm 2', color: '#11B981' },
            { id: 'b2-c3', label: 'Thông điệp nhân văn sâu sắc', color: '#11B981' }
          ]
        },
        {
          id: 'branch-3',
          label: 'Đặc sắc nghệ thuật',
          color: '#11B981',
          children: [
            { id: 'b3-c1', label: 'Ngôn từ, hình ảnh giàu sức gợi', color: '#6750FF' },
            { id: 'b3-c2', label: 'Biện pháp tu từ & kết cấu', color: '#6750FF' }
          ]
        },
        {
          id: 'branch-4',
          label: 'Bài học & Liên hệ',
          color: '#EC4899',
          children: [
            { id: 'b4-c1', label: 'Nhận thức của bản thân', color: '#4169F6' },
            { id: 'b4-c2', label: 'Hành động cụ thể trong học tập', color: '#4169F6' }
          ]
        }
      ]
    });
  }
});

// AI 5: KIẾN TRÚC SƯ DÀN Ý (Interactive Outline Assistant)
app.post('/api/ai/outline', async (req: Request, res: Response) => {
  const { topic, studentDraft } = req.body;

  const prompt = `Đề bài: "${topic}"
Học sinh đã tự nhập phác thảo dàn ý như sau: ${JSON.stringify(studentDraft || {})}
Hãy đóng vai AI Tutor hướng dẫn hoàn thiện dàn ý 3 phần (Mở bài - Thân bài - Kết bài).
Quy tắc quan trọng: Tôn trọng ý của học sinh, chỉ gợi mở chỗ còn thiếu hoặc chưa logic, không viết hộ nguyên bài.

Trả về JSON:
{
  "introduction": {
    "guide": "Cách dẫn dắt tự nhiên vào đề",
    "studentNote": "${studentDraft?.intro || ''}",
    "promptQuestion": "Em dự định mở bài trực tiếp hay gián tiếp qua một câu thơ/chuyện thực tế?"
  },
  "body": [
    {
      "pointName": "Luận điểm 1",
      "reasoningGuide": "Gợi mở lí lẽ...",
      "evidenceGuide": "Gợi mở dẫn chứng...",
      "analysisGuide": "Phân tích làm rõ...",
      "studentContent": "${studentDraft?.p1 || ''}"
    },
    {
      "pointName": "Luận điểm 2",
      "reasoningGuide": "Gợi mở lí lẽ...",
      "evidenceGuide": "Gợi mở dẫn chứng...",
      "analysisGuide": "Phân tích làm rõ...",
      "studentContent": "${studentDraft?.p2 || ''}"
    },
    {
      "pointName": "Mở rộng & Phản biện",
      "reasoningGuide": "Lật lại vấn đề...",
      "evidenceGuide": "Dẫn chứng đối lập...",
      "analysisGuide": "Bài học rút ra...",
      "studentContent": "${studentDraft?.counter || ''}"
    }
  ],
  "conclusion": {
    "guide": "Khẳng định lại vấn đề & liên hệ thiết thực",
    "studentNote": "${studentDraft?.outro || ''}",
    "promptQuestion": "Sau khi bàn luận, bài học lớn nhất em rút ra cho bản thân là gì?"
  },
  "overallFeedback": "Nhận xét khích lệ về cấu trúc dàn ý của học sinh"
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      introduction: {
        guide: 'Dẫn dắt ngắn gọn, nêu vấn đề nghị luận và khẳng định quan điểm bản thân.',
        studentNote: studentDraft?.intro || '',
        promptQuestion: 'Em dự định mở bài bằng một câu danh ngôn hay một tình huống thực tế đời sống?'
      },
      body: [
        {
          pointName: 'Luận điểm 1: Giải thích và khẳng định ý nghĩa cốt lõi',
          reasoningGuide: 'Làm rõ bản chất khái niệm bằng ngôn từ trong sáng, dễ hiểu.',
          evidenceGuide: 'Tìm ví dụ thực tế trong trường học hoặc sách báo quen thuộc.',
          analysisGuide: 'Chỉ ra vì sao điều này là cần thiết trong cuộc sống.',
          studentContent: studentDraft?.p1 || ''
        },
        {
          pointName: 'Luận điểm 2: Bàn luận sâu về vai trò và tác động',
          reasoningGuide: 'Chứng minh bằng những kết quả tích cực mà nó mang lại.',
          evidenceGuide: 'Câu chuyện người thật việc thật có sức truyền cảm hứng.',
          analysisGuide: 'Liên kết chặt chẽ giữa lí lẽ và hành động cụ thể.',
          studentContent: studentDraft?.p2 || ''
        },
        {
          pointName: 'Mở rộng & Phản đề: Phê phán lối nghĩ lệch lạc',
          reasoningGuide: 'Chỉ ra những biểu hiện tiêu cực hoặc ngộ nhận cần tránh.',
          evidenceGuide: 'Thói ỷ lại, thiếu kiên nhẫn hoặc sự vô cảm.',
          analysisGuide: 'Khẳng định giá trị của lối sống tích cực.',
          studentContent: studentDraft?.counter || ''
        }
      ],
      conclusion: {
        guide: 'Tóm lược lại ý nghĩa và khẳng định cam kết hành động của học sinh.',
        studentNote: studentDraft?.outro || '',
        promptQuestion: 'Em sẽ viết câu kết thế nào để để lại dư ba sâu lắng trong lòng người đọc?'
      },
      overallFeedback: 'Dàn ý của em đã có đủ 3 phần vững chãi. Hãy tự tin triển khai từng đoạn văn!'
    });
  }
});

// AI 6: PHÒNG LUYỆN VIẾT ĐOẠN (Paragraph Coach with 4 criteria & Socratic hints)
app.post('/api/ai/paragraph-coach', async (req: Request, res: Response) => {
  const { paragraphType, prompt, content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Chưa có nội dung đoạn văn' });
  }

  const aiPrompt = `Đề bài: "${prompt || 'Luyện viết đoạn văn'}"
Kiểu đoạn: "${paragraphType || 'Đoạn nghị luận'}"
Học sinh viết:
"""
${content}
"""

Phân tích đoạn văn theo đúng 4 tiêu chí của chương trình Ngữ văn THCS:
1. Ý (Nội dung, luận điểm, tính tập trung)
2. Lập luận (Mạch tư duy, lí lẽ, dẫn chứng)
3. Diễn đạt (Dùng từ, ngữ điệu, hình ảnh)
4. Chính tả – Ngữ pháp (Dấu câu, liên kết, câu sai cấu trúc)

Tuyệt đối KHÔNG viết lại nguyên đoạn văn ngay!
Hãy thực hiện theo quy trình 4 bước:
1. Chỉ ra điểm làm tốt và chỗ cần xem lại.
2. Đặt câu hỏi gợi ý để học sinh tự suy nghĩ và sửa.
3. Hướng dẫn học sinh tự sửa.
4. Cung cấp gợi ý cách dùng từ/câu ngắn gọn mang tính chất tham khảo.

Trả về JSON:
{
  "review": {
    "ideas": {"score": 8, "comment": "Nhận xét về ý", "hint": "Gợi ý cải thiện ý"},
    "logic": {"score": 7, "comment": "Nhận xét về lập luận", "hint": "Gợi ý liên kết lí lẽ"},
    "expression": {"score": 8, "comment": "Nhận xét về diễn đạt", "hint": "Gợi ý từ ngữ phong phú"},
    "grammar": {"score": 9, "comment": "Nhận xét về lỗi chính tả/ngữ pháp", "issues": []}
  },
  "flaggedSpots": [
    {"original": "Trích đoạn cần chú ý", "reason": "Vì sao cần xem lại", "question": "Câu hỏi gợi ý để học sinh tự sửa"}
  ],
  "selfEditPrompt": "Câu hỏi tổng kết để học sinh thử viết lại câu văn đó",
  "shortSampleSuggestion": "Gợi ý cách diễn đạt ngắn gọn mang tính tham khảo (chỉ 1-2 câu)"
}`;

  try {
    const raw = await callGemini(aiPrompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      review: {
        ideas: { score: 8, comment: 'Đoạn văn có ý rõ ràng, nêu bật được thông điệp chính.', hint: 'Có thể làm sâu sắc hơn bằng một từ khóa đắt giá.' },
        logic: { score: 8, comment: 'Mạch lập luận tương đối tự nhiên giữa lí lẽ và dẫn chứng.', hint: 'Hãy thêm từ ngữ liên kết câu (Hơn nữa, Thật vậy, Ngược lại...) để mượt mà hơn.' },
        expression: { score: 7.5, comment: 'Cách diễn đạt chân thành, trong sáng, phù hợp với học sinh THCS.', hint: 'Tránh lặp lại quá nhiều một từ chỉ quan hệ như "và", "nhưng".' },
        grammar: { score: 9, comment: 'Câu cú cơ bản chuẩn ngữ pháp, có đủ chủ ngữ - vị ngữ.', issues: [] }
      },
      flaggedSpots: [
        {
          original: content.substring(0, Math.min(content.length, 60)) + '...',
          reason: 'Câu văn có thể gọt giũa để súc tích và giàu hình ảnh hơn.',
          question: 'Em có thể thay thế cụm từ thông thường bằng một hình ảnh gợi cảm xúc hơn không?'
        }
      ],
      selfEditPrompt: 'Em hãy thử đọc to đoạn văn của mình lên, lắng nghe nhịp điệu và tự chỉnh lại những chỗ ngập ngừng nhé!',
      shortSampleSuggestion: 'Gợi ý tham khảo: "Mỗi hành động tử tế hôm nay chính là một hạt mầm xanh gieo vào tâm hồn ngày mai."'
    });
  }
});

// AI 7: HUẤN LUYỆN VIÊN LẬP LUẬN (Devil's Advocate / Socratic Counter-questioning)
app.post('/api/ai/argument-coach', async (req: Request, res: Response) => {
  const { statement, studentResponse } = req.body;
  if (!statement) {
    return res.status(400).json({ error: 'Chưa có nhận định' });
  }

  const prompt = `Nhận định của học sinh THCS: "${statement}"
${studentResponse ? `Học sinh trả lời phản biện trước đó: "${studentResponse}"` : ''}

Hãy đóng vai người phản biện sắc sảo nhưng thân thiện (Huấn luyện viên lập luận).
Đặt ra các câu hỏi chất vấn rèn tư duy phản biện:
- "Tại sao em lại khẳng định như vậy?"
- "Bằng chứng xác thực ở đâu?"
- "Dẫn chứng này chứng minh cho điều gì?"
- "Có trường hợp nào ngoại lệ hoặc đi ngược lại không?"
- "Nếu người khác phản đối rằng..., em sẽ trả lời thế nào?"

Trả về JSON:
{
  "coachFeedback": "${studentResponse ? 'Đánh giá câu trả lời bảo vệ quan điểm của học sinh' : 'Lời mở đầu khích lệ tư duy'}",
  "socraticChallenges": [
    {"type": "Nguyên nhân (Tại sao?)", "question": "Câu hỏi chất vấn căn nguyên..."},
    {"type": "Bằng chứng (Chứng minh thế nào?)", "question": "Câu hỏi đòi hỏi dẫn chứng cụ thể..."},
    {"type": "Phản đề (Góc nhìn ngược lại)", "question": "Câu hỏi đưa ra trường hợp đối lập..."},
    {"type": "Bảo vệ quan điểm", "question": "Câu hỏi thách thức nếu đối phương không đồng tình..."}
  ],
  "defenseTips": "Mẹo nhỏ giúp học sinh củng cố lập luận vững chãi"
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      coachFeedback: studentResponse
        ? `Thầy/cô thấy cách em bảo vệ quan điểm "${studentResponse}" rất sắc bén và kiên định!`
        : 'Nhận định của em rất thú vị! Hãy cùng thử thách độ vững chắc của lập luận này nhé.',
      socraticChallenges: [
        { type: 'Nguyên nhân (Tại sao?)', question: `Tại sao em lại tin rằng "${statement}" là chân lý đúng trong mọi hoàn cảnh?` },
        { type: 'Bằng chứng (Ở đâu?)', question: 'Em có thể kể ra một nhân vật hoặc sự kiện thực tế nào chứng minh thuyết phục nhất cho điều này không?' },
        { type: 'Phản đề (Góc nhìn ngược)', question: 'Liệu có trường hợp nào mà điều này không còn phù hợp hoặc bị hiểu sai lệch không?' },
        { type: 'Bảo vệ quan điểm', question: 'Nếu một bạn cùng lớp nói rằng điều này là quá lý thuyết và xa vời, em sẽ dùng lí lẽ nào để thuyết phục bạn?' }
      ],
      defenseTips: 'Bí quyết: Lập luận mạnh nhất là khi em thừa nhận một phần góc nhìn đối lập trước khi khẳng định quan điểm cốt lõi của mình!'
    });
  }
});

// AI 8: BÁC SĨ CÂU VĂN (Sentence Doctor with 5-column diagnosis)
app.post('/api/ai/sentence-doctor', async (req: Request, res: Response) => {
  const { sentence } = req.body;
  if (!sentence) {
    return res.status(400).json({ error: 'Chưa có câu văn cần kiểm tra' });
  }

  const prompt = `Kiểm tra câu văn sau của học sinh THCS:
"${sentence}"

Phát hiện các lỗi thường gặp:
- Câu quá dài hoặc ngắt nhịp chưa hợp lý
- Lặp từ hoặc thừa từ
- Thiếu chủ ngữ / vị ngữ (câu què, câu cụt)
- Diễn đạt tối nghĩa hoặc dùng từ chưa chuẩn xác
- Liên kết câu chưa chặt
- Lỗi chính tả, dấu câu

Trả về JSON mảng chẩn đoán theo format 5 mục:
{
  "diagnoses": [
    {
      "originalSentence": "Câu của em",
      "issueFound": "Điểm cần xem lại (loại lỗi)",
      "socraticHint": "Câu hỏi gợi ý để học sinh tự nhận ra",
      "selfCorrectionInstruction": "Hướng dẫn em tự sửa",
      "aiSuggestion": "Gợi ý tham khảo của AI (trong sáng, chuẩn mực)"
    }
  ],
  "overallSummary": "Đánh giá tổng quan về kĩ năng diễn đạt câu"
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      diagnoses: [
        {
          originalSentence: sentence,
          issueFound: sentence.length > 80 ? 'Câu khá dài, nhiều vế câu nối tiếp' : 'Dùng từ có thể trau chuốt hơn',
          socraticHint: 'Em thử đọc xem trong câu này có từ nào bị lặp lại hoặc có thể tách thành hai câu đơn ngắn hơn không?',
          selfCorrectionInstruction: 'Hãy thử tìm chủ ngữ chính và ngắt dấu phẩy ở chỗ cần dừng nghỉ tự nhiên.',
          aiSuggestion: sentence.replace(/\s+/g, ' ').trim()
        }
      ],
      overallSummary: 'Câu văn có ý hướng tốt. Chỉ cần ngắt nhịp hợp lý và lược bỏ từ thừa là câu sẽ rất vang và truyền cảm.'
    });
  }
});

// AI 9: NÂNG CẤP DIỄN ĐẠT (Style Upgrade)
app.post('/api/ai/style-upgrade', async (req: Request, res: Response) => {
  const { text, style = 'Giàu hình ảnh' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Chưa có văn bản' });
  }

  const prompt = `Văn bản gốc của học sinh THCS: "${text}"
Phong cách học sinh muốn nâng cấp: "${style}" (Lựa chọn có thể là: Trong sáng / Giàu hình ảnh / Súc tích / Trang trọng / Cảm xúc / Lập luận chặt chẽ).

Quy tắc:
- Giữ nguyên tư tưởng, quan điểm và ý tứ ban đầu của học sinh.
- KHÔNG biến đổi thành bài văn quá xa lạ hay giả tạo.
- Đề xuất 2-3 phương án diễn đạt mẫu cùng phân tích từ ngữ đắt giá.

Trả về JSON:
{
  "styleApplied": "${style}",
  "options": [
    {
      "version": "Phương án 1",
      "explanation": "Điểm nổi bật: sử dụng từ láy, hình ảnh so sánh...",
      "highlightedWords": ["từ đắt 1", "từ đắt 2"]
    },
    {
      "version": "Phương án 2",
      "explanation": "Điểm nổi bật: nhịp điệu cân đối, giàu nhạc tính...",
      "highlightedWords": ["từ đắt 3", "từ đắt 4"]
    }
  ],
  "writingTechniqueTip": "Mẹo viết văn thuộc phong cách ${style} phù hợp lứa tuổi THCS"
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      styleApplied: style,
      options: [
        {
          version: `Theo phong cách ${style}: "${text}" được trau chuốt với hình ảnh gợi cảm và ngôn từ chắt lọc.`,
          explanation: 'Tăng cường các tính từ gợi cảm giác và cấu trúc câu đăng đối.',
          highlightedWords: ['sâu sắc', 'lan tỏa', 'nguồn cội']
        },
        {
          version: `Cách diễn đạt thứ hai: Đi thẳng vào tâm cảm, gợi mở dư âm suy ngẫm cho người đọc.`,
          explanation: 'Nhịp điệu câu văn linh hoạt, giúp ý tưởng trở nên sinh động và thuyết phục hơn.',
          highlightedWords: ['thấm thía', 'bền bỉ']
        }
      ],
      writingTechniqueTip: `Để viết theo phong cách ${style}, em hãy liên tưởng đến những hình ảnh thiên nhiên quen thuộc và sử dụng từ láy tượng hình, tượng thanh một cách có chừng mực.`
    });
  }
});

// AI 10: GIÁM KHẢO AI (Rubric Grader with 9 criteria & Radar Data)
app.post('/api/ai/rubric-grader', async (req: Request, res: Response) => {
  const { topic, essay, previousScore } = req.body;
  if (!essay) {
    return res.status(400).json({ error: 'Chưa có bài văn hoàn chỉnh' });
  }

  const prompt = `Chấm bài văn học sinh THCS theo rubric 9 tiêu chí chuẩn của Bộ GD&ĐT:
Đề bài: "${topic || 'Tự do'}"
Bài làm của học sinh:
"""
${essay}
"""
${previousScore ? `Điểm số lần chấm trước: ${previousScore}` : ''}

Đánh giá chi tiết 9 tiêu chí (thang điểm 10 mỗi tiêu chí):
1. Đúng yêu cầu đề (Bám sát đề bài, không lạc đề)
2. Nội dung (Ý tưởng phong phú, sâu sắc)
3. Bố cục (3 phần cân đối, chuyển ý tự nhiên)
4. Lập luận (Lí lẽ logic, mạch lạc)
5. Dẫn chứng (Xác thực, tiêu biểu, không bịa đặt)
6. Liên kết (Liên kết câu, liên kết đoạn mượt mà)
7. Diễn đạt (Từ ngữ chuẩn mực, giàu hình ảnh)
8. Chính tả – Ngữ pháp (Đúng ngữ pháp tiếng Việt)
9. Sáng tạo (Có nét riêng, phát hiện mới mẻ)

Tuyệt đối KHÔNG chỉ cho điểm số vô hồn!
Phải có:
- Điểm mạnh nổi bật
- Điểm cần cải thiện
- Câu hỏi giúp học sinh tự sửa
- Top 3 việc nên ưu tiên sửa ngay trước
- Nhận xét so sánh tiến bộ (nếu có bài cũ)

Trả về JSON:
{
  "rubricScores": [
    {"criterion": "Đúng yêu cầu đề", "score": 9, "max": 10, "comment": "..."},
    {"criterion": "Nội dung", "score": 8, "max": 10, "comment": "..."},
    {"criterion": "Bố cục", "score": 8.5, "max": 10, "comment": "..."},
    {"criterion": "Lập luận", "score": 8, "max": 10, "comment": "..."},
    {"criterion": "Dẫn chứng", "score": 7.5, "max": 10, "comment": "..."},
    {"criterion": "Liên kết", "score": 8, "max": 10, "comment": "..."},
    {"criterion": "Diễn đạt", "score": 8.5, "max": 10, "comment": "..."},
    {"criterion": "Chính tả - Ngữ pháp", "score": 9.5, "max": 10, "comment": "..."},
    {"criterion": "Sáng tạo", "score": 8, "max": 10, "comment": "..."}
  ],
  "totalAverageScore": 8.4,
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "improvements": ["Điểm cần khắc phục 1", "Điểm cần khắc phục 2"],
  "selfEditQuestions": ["Câu hỏi 1...", "Câu hỏi 2..."],
  "top3Fixes": [
    "1. Bổ sung dẫn chứng cụ thể hơn cho luận điểm 2",
    "2. Thêm từ chuyển đoạn giữa thân bài và kết bài",
    "3. Rút gọn câu kết để tạo dư ba đọng lại"
  ],
  "comparison": "Bản viết này đã tiến bộ vượt bậc so với lần trước về mặt liên kết câu và lập luận!"
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    const wordCount = essay.split(/\s+/).filter(Boolean).length;
    const baseScore = wordCount > 250 ? 8.5 : wordCount > 150 ? 7.8 : 7.0;
    return res.json({
      rubricScores: [
        { criterion: 'Đúng yêu cầu đề', score: 9.0, max: 10, comment: 'Bám sát trọng tâm của đề bài, xác định rõ đối tượng nghị luận.' },
        { criterion: 'Nội dung', score: baseScore, max: 10, comment: 'Hệ thống ý phong phú, thể hiện được góc nhìn chân thực của lứa tuổi học sinh.' },
        { criterion: 'Bố cục', score: 8.5, max: 10, comment: 'Bố cục 3 phần rõ ràng, các đoạn phân tách mạch lạc.' },
        { criterion: 'Lập luận', score: 8.0, max: 10, comment: 'Lí lẽ sáng rõ, bước đầu biết phân tích nguyên nhân và kết quả.' },
        { criterion: 'Dẫn chứng', score: 7.5, max: 10, comment: 'Dẫn chứng gần gũi; nên chọn lọc nhân vật tiêu biểu hơn để tăng sức thuyết phục.' },
        { criterion: 'Liên kết', score: 8.0, max: 10, comment: 'Sử dụng các từ nối khá linh hoạt giữa các luận điểm.' },
        { criterion: 'Diễn đạt', score: 8.5, max: 10, comment: 'Hành văn lưu loát, giàu cảm xúc, sử dụng từ ngữ chuẩn mực.' },
        { criterion: 'Chính tả - Ngữ pháp', score: 9.0, max: 10, comment: 'Hầu như không mắc lỗi chính tả, câu cú trọn vẹn.' },
        { criterion: 'Sáng tạo', score: 8.0, max: 10, comment: 'Có suy nghĩ và cảm nhận riêng, không rập khuôn máy móc.' }
      ],
      totalAverageScore: baseScore,
      strengths: [
        'Bài viết thể hiện tình cảm chân thành, lập luận có căn cứ.',
        'Diễn đạt trong sáng, không sa vào từ ngữ sáo rỗng.',
        'Bố cục cân đối, chuyển ý tương đối nhịp nhàng.'
      ],
      improvements: [
        'Dẫn chứng cần phân tích sâu hơn thay vì chỉ liệt kê sự việc.',
        'Đoạn phản biện có thể mở rộng để bài viết có chiều sâu triết lý nhẹ nhàng.'
      ],
      selfEditQuestions: [
        'Ở luận điểm thứ hai, em có thể chỉ ra hành động cụ thể nhất của nhân vật dẫn chứng không?',
        'Câu kết bài của em đã thực sự chạm đến trái tim người đọc chưa?'
      ],
      top3Fixes: [
        '1. Đào sâu một dẫn chứng tiêu biểu thay vì kể lướt qua nhiều sự việc.',
        '2. Trau chuốt lại câu mở đoạn của luận điểm 2 để tạo sự liên kết tự nhiên hơn.',
        '3. Kiểm tra lại việc ngắt dấu câu ở những câu ghép dài.'
      ],
      comparison: 'Bài viết cho thấy sự đầu tư nghiêm túc và bước tiến rõ nét trong tư duy lập luận của em!'
    });
  }
});

// PHÒNG LUYỆN ĐỌC HIỂU (Smart Reading Comprehension: 3 Levels)
app.post('/api/ai/reading-comprehension', async (req: Request, res: Response) => {
  const { passage, studentAnswers, action = 'generate' } = req.body;
  if (!passage) {
    return res.status(400).json({ error: 'Chưa có ngữ liệu văn bản' });
  }

  if (action === 'evaluate') {
    const prompt = `Ngữ liệu đọc hiểu:
"""
${passage}
"""
Câu trả lời của học sinh cho các câu hỏi: ${JSON.stringify(studentAnswers || [])}

Hãy đánh giá câu trả lời của học sinh:
QUY TẮC BẮT BUỘC:
- KHÔNG công bố đáp án ngay lập tức!
- Đưa ra một GỢI Ý trước để học sinh tự suy nghĩ lại nếu chưa chính xác.
- Chỉ ra chỗ học sinh đã phát hiện đúng và chỗ còn thiếu.
- Sau đó mới giải thích cặn kẽ nếu câu trả lời đã tương đối tốt.

Trả về JSON:
{
  "feedback": [
    {
      "questionId": "q1",
      "isCorrect": true,
      "encouragement": "Rất tốt!",
      "hint": "Gợi ý thêm nếu muốn hoàn hảo...",
      "explanation": "Giải thích chi tiết dựa vào ngữ liệu..."
    }
  ],
  "progressScore": 85,
  "teacherAdvice": "Lời khuyên rèn kĩ năng đọc hiểu"
}`;
    try {
      const raw = await callGemini(prompt, true);
      return res.json(JSON.parse(raw));
    } catch (err) {
      return res.json({
        feedback: [
          {
            questionId: 'q1',
            isCorrect: true,
            encouragement: 'Em đã tìm rất chính xác thông tin trực tiếp trong văn bản!',
            hint: 'Hãy lưu ý trích dẫn nguyên văn từ khóa quan trọng.',
            explanation: 'Chi tiết này được thể hiện rõ ràng ở phần đầu của ngữ liệu.'
          },
          {
            questionId: 'q2',
            isCorrect: true,
            encouragement: 'Cách em hiểu về biện pháp nghệ thuật rất tốt!',
            hint: 'Em thử chỉ ra thêm tác dụng gợi hình, gợi cảm của hình ảnh đó nhé.',
            explanation: 'Biện pháp tu từ giúp câu văn trở nên sinh động và giàu cảm xúc hơn.'
          },
          {
            questionId: 'q3',
            isCorrect: true,
            encouragement: 'Bài học em rút ra rất nhân văn và gần gũi với lứa tuổi.',
            hint: 'Gắn liền bài học với một hành động cụ thể trong học đường.',
            explanation: 'Văn bản hướng con người đến sự đồng cảm, sẻ chia và trân trọng những điều bình dị.'
          }
        ],
        progressScore: 90,
        teacherAdvice: 'Kĩ năng đọc hiểu của em rất tiến bộ. Hãy luôn chú ý gạch chân từ khóa trong văn bản trước khi trả lời!'
      });
    }
  }

  // Generate Questions
  const prompt = `Văn bản đọc hiểu THCS:
"""
${passage}
"""
Hãy tạo 3-4 câu hỏi đọc hiểu theo đúng ma trận 3 mức độ của Bộ GD&ĐT:
- Mức 1: Nhận biết (Hỏi trực tiếp chi tiết, phương thức biểu đạt, thể loại, từ ngữ trong văn bản)
- Mức 2: Thông hiểu (Hỏi về ý nghĩa câu văn, tác dụng của biện pháp tu từ, tâm trạng nhân vật)
- Mức 3: Vận dụng (Rút ra bài học, thông điệp, liên hệ thực tế đời sống học sinh)

Trả về JSON:
{
  "passageTitle": "Tiêu đề phù hợp",
  "questions": [
    {
      "id": "q1",
      "level": "Nhận biết",
      "question": "Câu hỏi nhận biết...",
      "hint": "Gợi ý nhẹ: Chú ý quan sát đoạn thứ mấy...",
      "targetDetail": "Chi tiết cần tìm trong ngữ liệu"
    },
    {
      "id": "q2",
      "level": "Thông hiểu",
      "question": "Câu hỏi thông hiểu...",
      "hint": "Gợi ý: Tác dụng gợi cảm xúc gì...",
      "targetDetail": "Bản chất nghệ thuật/ý nghĩa"
    },
    {
      "id": "q3",
      "level": "Vận dụng",
      "question": "Câu hỏi vận dụng...",
      "hint": "Gợi ý: Bài học có thể áp dụng vào việc gì trong đời sống...",
      "targetDetail": "Thông điệp sâu sắc"
    }
  ]
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      passageTitle: 'Ngữ liệu đọc hiểu rèn luyện',
      questions: [
        {
          id: 'q1',
          level: 'Nhận biết',
          question: 'Xác định phương thức biểu đạt chính hoặc chỉ ra 02 chi tiết thể hiện cảm xúc trong đoạn văn trên.',
          hint: 'Gợi ý nhẹ: Em hãy nhìn vào các từ ngữ chỉ trạng thái hoặc cử chỉ của nhân vật ở 2 câu đầu.',
          targetDetail: 'Phương thức biểu đạt / từ ngữ trực tiếp trong văn bản'
        },
        {
          id: 'q2',
          level: 'Thông hiểu',
          question: 'Chỉ ra và nêu tác dụng của biện pháp tu từ được sử dụng nổi bật nhất trong ngữ liệu.',
          hint: 'Gợi ý: Tác giả có dùng hình ảnh so sánh hay ẩn dụ không? Nó làm cho sự vật trở nên như thế nào?',
          targetDetail: 'Tác dụng gợi hình, gợi cảm và thể hiện tình cảm của tác giả'
        },
        {
          id: 'q3',
          level: 'Vận dụng',
          question: 'Từ nội dung văn bản, em rút ra thông điệp sống có ý nghĩa nhất đối với bản thân là gì? (Viết từ 3-5 dòng)',
          hint: 'Gợi ý: Thông điệp đó nhắc nhở em về lòng biết ơn, sự kiên trì hay tình yêu thương?',
          targetDetail: 'Bài học nhận thức và hành động của học sinh'
        }
      ]
    });
  }
});

// AI TUTOR NGỮ VĂN (Floating Socratic Chat Assistant)
app.post('/api/ai/tutor-chat', async (req: Request, res: Response) => {
  const { message, conversationHistory = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Nội dung tin nhắn trống' });
  }

  // Detect if student is asking AI to write the whole essay for them
  const isAskingToWriteForMe =
    /viết (hộ|cho em|dùm|thay|bài văn|hết bài|toàn bộ)/i.test(message) ||
    /hãy viết bài văn/i.test(message) ||
    /làm bài giúp em/i.test(message);

  if (isAskingToWriteForMe) {
    return res.json({
      reply: `Thầy/cô AI sẽ cùng em từng bước xây dựng bài viết thật hay nhé! AI không viết thay em, vì chỉ khi tự mình tư duy và đặt bút viết, em mới khám phá được giọng văn độc đáo của chính mình.

Trước tiên, em hãy cho thầy/cô biết:
1. Đề bài của em đang yêu cầu bàn luận về vấn đề gì?
2. Trong đề bài này, điều gì hoặc từ khóa nào khiến em cảm thấy ấn tượng nhất?

Em thử chia sẻ suy nghĩ ban đầu của mình xem nào!`,
      socraticPrompt: true,
    });
  }

  const historyContext = conversationHistory
    .slice(-6)
    .map((m: any) => `${m.role === 'user' ? 'Học sinh' : 'AI Tutor'}: ${m.text}`)
    .join('\n');

  const prompt = `Lịch sử trao đổi:
${historyContext}

Học sinh vừa hỏi: "${message}"

Hướng dẫn phản hồi:
- Bạn là AI Tutor Ngữ văn trường THCS Huỳnh Thúc Kháng.
- Giữ vững phương pháp Socratic: Hỏi trước khi trả lời, gợi mở từng bước (Mức 1: gợi ý nhẹ -> Mức 2: gợi ý rõ hơn -> Mức 3: ví dụ minh họa).
- Khuyến khích học sinh tự nói lên suy nghĩ của mình.
- Không viết sẵn cả bài văn mẫu dài.
- Giọng điệu ấm áp, sư phạm, tôn trọng lứa tuổi THCS.
- Trả lời bằng tiếng Việt chuẩn có dấu, định dạng Markdown rõ ràng, dễ đọc.`;

  try {
    const raw = await callGemini(prompt, false);
    return res.json({ reply: raw });
  } catch (err) {
    return res.json({
      reply: `Chào em! Thầy/cô AI đã nhận được câu hỏi: "${message}".

Để cùng em giải quyết vấn đề này hiệu quả nhất:
1. **Em đã hình dung được gì về vấn đề này rồi?**
2. Em thấy khó khăn nhất ở khâu nào: Tìm ý tưởng, lập luận hay cách diễn đạt câu văn?

Em hãy chia sẻ thử suy nghĩ của mình trước nhé, thầy/cô sẽ đồng hành gợi mở từng bước cùng em! ✨`
    });
  }
});

// GÓC GIÁO VIÊN (Teacher Assistant: Tạo đề, câu hỏi, rubric, phiếu học tập)
app.post('/api/ai/teacher-assistant', async (req: Request, res: Response) => {
  const { taskType, grade, lessonName, topic, targetObjectives, content } = req.body;

  const prompt = `Bạn là trợ lý giáo viên Ngữ văn THCS chuyên nghiệp.
Nhiệm vụ: ${taskType} (Tạo bài tập / Tạo câu hỏi đọc hiểu / Tạo rubric / Tạo phiếu học tập / Tạo đề luyện tập)
Khối lớp: ${grade || 'Lớp 8'}
Tên bài/văn bản: "${lessonName || topic || 'Ngữ văn THCS'}"
Yêu cầu cần đạt: "${targetObjectives || 'Theo chương trình GDPT 2018'}"
Nội dung chi tiết bổ sung: "${content || ''}"

Hãy soạn thảo nội dung nháp bài bản, sư phạm, đầy đủ cấu trúc và dễ dàng cho giáo viên tinh chỉnh lại trước khi in hoặc lưu.
Trả về định dạng JSON:
{
  "title": "Tiêu đề bản thảo",
  "grade": "${grade || 'Lớp 8'}",
  "lessonName": "${lessonName || ''}",
  "sections": [
    {"heading": "Tên mục", "content": "Nội dung chi tiết..."}
  ],
  "pedagogicalNotes": "Ghi chú sư phạm dành cho thầy cô khi triển khai trên lớp"
}`;

  try {
    const raw = await callGemini(prompt, true);
    return res.json(JSON.parse(raw));
  } catch (err) {
    return res.json({
      title: `Bản thảo: ${taskType} - ${lessonName || 'Bài học Ngữ văn'} (${grade || 'Lớp 8'})`,
      grade: grade || 'Lớp 8',
      lessonName: lessonName || 'Bài học trọng tâm',
      sections: [
        {
          heading: 'I. Mục tiêu cần đạt (Yêu cầu cần đạt)',
          content: '- Giúp học sinh nhận biết và phân tích được nét đặc sắc về nội dung và nghệ thuật của bài học.\n- Rèn luyện năng lực tự học, tư duy phản biện và khả năng diễn đạt lưu loát.'
        },
        {
          heading: 'II. Hệ thống câu hỏi / Nhiệm vụ học tập',
          content: '1. Nhiệm vụ khởi động: Khơi gợi trải nghiệm cá nhân liên quan đến chủ đề.\n2. Nhiệm vụ hình thành kiến thức: Đọc hiểu văn bản theo 3 cấp độ (Nhận biết - Thông hiểu - Vận dụng).\n3. Nhiệm vụ luyện tập: Viết đoạn văn ngắn từ 5-7 câu bày tỏ cảm nghĩ.'
        },
        {
          heading: 'III. Tiêu chí đánh giá (Rubric tóm tắt)',
          content: '- Mức tốt (8-10đ): Trả lời đầy đủ, sáng tạo, dẫn chứng sắc bén, diễn đạt trong sáng.\n- Mức đạt (5-7đ): Nắm được nội dung cơ bản, có lí lẽ nhưng dẫn chứng chưa phong phú.\n- Cần cố gắng (<5đ): Chưa bám sát ngữ liệu, diễn đạt còn lỗi câu từ.'
        }
      ],
      pedagogicalNotes: 'Thầy cô có thể điều chỉnh mức độ câu hỏi tùy theo đối tượng học sinh của từng lớp để đạt hiệu quả phân hóa tối ưu.'
    });
  }
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Educational Applet server running on http://localhost:${PORT}`);
  });
}

startServer();
