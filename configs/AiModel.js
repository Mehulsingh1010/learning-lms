const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

// Ensure API key is provided
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is missing. Please set it in your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// File Upload Helper
async function uploadToGemini(path, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("Error uploading file to Gemini:", error);
    throw error;
  }
}

// Model Configuration
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Ensure the model name is correct
});

const generationConfig = {
  temperature: 1, // Creativity level
  topP: 0.95, // Probability mass for sampling
  topK: 40, // Limit to the top-k candidates
  maxOutputTokens: 8192, // Maximum response length
  responseMimeType: "application/json", // Expected response type
};

// Chat-based AI Interaction
export const courseOutlineAIModel = model.startChat({
  generationConfig,
  history: [], // No prior chat history by default
});

/**
 * Generate course outline
 * @param {string} prompt - The AI prompt for generating a course outline
 * @returns {object} Parsed JSON response from the AI
 */
export async function generateCourseOutline(prompt) {
  try {
    console.log("Sending prompt to AI:", prompt);
    const response = await courseOutlineAIModel.sendMessage(prompt);

    console.log("Raw AI response:", JSON.stringify(response, null, 2));

    // Ensure the response contains valid candidates
    const aiText = response?.response?.candidates?.[0]?.text;
    if (!aiText) {
      throw new Error("AI response is missing valid text.");
    }

    // Parse and return JSON response
    try {
      return JSON.parse(aiText);
    } catch (error) {
      console.error("Failed to parse AI response text as JSON:", aiText);
      throw new Error("Invalid JSON format in AI response.");
    }
  } catch (error) {
    console.error("Error generating course outline:", error);
    throw error;
  }
}

export const generateNotesAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate exam material detail content for each chapter, make sure to include all topic points in content, make sure to give content in HTML format(do not add GTMLKL, head, body, title tag). The chapters :"},
        {text: "Generate exam material detail content for each chapter, make sure to include all topic points in content, make sure to give content in HTML format (do not add GTMLKL, head, body, title tag). The chapters: {\n      \"chapterName\": \"Anatomy\",\n      \"summary\": \"In-depth study of human anatomy, focusing on intricate relationships between structures and clinical correlations.\",\n      \"topics\": [\n        \"Detailed regional anatomy\",\n        \"Microscopic anatomy\",\n        \"Neuroanatomy\",\n        \"Embryology\",\n        \"Clinical applications of anatomical knowledge\"\n      ]\n    }, "},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```html\n<h3>Anatomy</h3>\n<p>This chapter covers the intricate details of human anatomy, emphasizing the relationships between different structures and their clinical significance.</p>\n\n<h4>Detailed Regional Anatomy</h4>\n<ul>\n  <li>Thorax:  Detailed study of the organs, vessels, and nerves within the thoracic cavity.  Expect questions on the relationships between structures such as the heart, lungs, and great vessels.</li>\n  <li>Abdomen:  Comprehensive understanding of abdominal viscera, including their blood supply, innervation, and lymphatic drainage.  Emphasis on the location and relationships of organs.</li>\n  <li>Pelvis and Perineum:  Thorough knowledge of pelvic bones, muscles, and organs.  Questions will cover the male and female reproductive systems, urinary system, and their anatomical relationships.</li>\n  <li>Head and Neck:  In-depth study of the cranial nerves, muscles of facial expression, salivary glands, and other structures of the head and neck region.</li>\n  <li>Upper and Lower Limbs:  Detailed understanding of the bones, joints, muscles, nerves, and blood vessels of the upper and lower limbs.  Focus on functional anatomy and clinical correlations.</li>\n</ul>\n\n<h4>Microscopic Anatomy</h4>\n<ul>\n  <li>Histology:  Knowledge of the microscopic structure of tissues, including epithelial, connective, muscle, and nervous tissues.  Expect questions on tissue types, their functions, and identifying them under a microscope (if applicable).</li>\n  <li>Cytology:  Understanding of cell structure and function, including organelles and their roles.</li>\n</ul>\n\n<h4>Neuroanatomy</h4>\n<ul>\n  <li>Central Nervous System (CNS):  Detailed knowledge of the brain and spinal cord, including their regions, tracts, and functional areas.  Expect questions on neurological pathways and clinical presentations.</li>\n  <li>Peripheral Nervous System (PNS):  Understanding of cranial nerves, spinal nerves, and autonomic nervous system.  Focus on nerve pathways, dermatomes, and myotomes.</li>\n</ul>\n\n<h4>Embryology</h4>\n<ul>\n  <li>Developmental stages:  Understanding of the major developmental stages of the human body, from fertilization to birth.  Emphasis on organogenesis and potential developmental anomalies.</li>\n  <li>Teratogenesis:  Knowledge of factors that can cause birth defects.</li>\n</ul>\n\n<h4>Clinical Applications of Anatomical Knowledge</h4>\n<ul>\n  <li>Imaging Interpretation:  Ability to interpret basic medical images (X-rays, CT scans, MRI) to identify anatomical structures and potential pathologies.</li>\n  <li>Surgical Approaches:  Understanding of common surgical approaches and their anatomical considerations.</li>\n  <li>Clinical Correlations:  Ability to relate anatomical knowledge to clinical scenarios and understand the implications of anatomical variations.</li>\n</ul>\n```\n"},
      ],
    },
  ],
});