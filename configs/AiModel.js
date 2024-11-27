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
