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
    const fileName = path.split("/").pop(); // Extract file name from path
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: fileName,
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
  maxOutputTokens: 2048, // Maximum response length (adjusted for compatibility)
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
      console.error("AI response is missing valid text:", response);
      throw new Error("AI response does not contain valid candidates or text.");
    }

    // Parse and return JSON response
    try {
      return JSON.parse(aiText.trim());
    } catch (error) {
      console.error("Failed to parse AI response text as JSON:", aiText);
      throw new Error("Invalid JSON format in AI response.");
    }
  } catch (error) {
    console.error("Error generating course outline:", error);
    throw error;
  }
}

// Generate Notes AI Model
export const generateNotesAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `
Generate detailed, interactive study material for the following chapter. Each chapter should include:
1. A **chapter summary** introducing the key concepts.
2. A **section for each topic** with:
   - **Subheadings** for clarity.
   - Concise **explanations** of the concepts.
   - **Code snippets** or examples (if applicable).
   - **Visuals or diagrams** with real image URLs.
   - Real-world applications or clinical correlations (if relevant).
3. End each chapter with a **quick revision section** summarizing the key points in a bullet list.

Please ensure that the content is in **HTML format**, but **without** including the \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, or \`<body>\` tags. Below is the chapter information (note that this is **clean JSON format** without extra characters or placeholders):

{
  "chapterTitle": "Anatomy",
  "chapterSummary": "In-depth study of human anatomy, focusing on intricate relationships between structures and clinical correlations.",
  "topics": [
    {
      "topicTitle": "Detailed Regional Anatomy",
      "subtopics": [
        {
          "subtopicTitle": "Upper Limb",
          "explanation": "Study of the anatomy of the upper limb including muscles, nerves, and bones.",
          "codeExample": null,
          "imageUrl": "https://example.com/upper-limb-image.jpg",
          "realWorldApplication": "Understanding upper limb anatomy is essential for clinical procedures like surgeries and physical therapy."
        },
        {
          "subtopicTitle": "Lower Limb",
          "explanation": "Study of the anatomy of the lower limb, focusing on skeletal and muscular structures.",
          "codeExample": null,
          "imageUrl": "https://example.com/lower-limb-image.jpg",
          "realWorldApplication": "Vital for diagnosing and treating leg injuries and conditions."
        }
      ]
    },
    {
      "topicTitle": "Microscopic Anatomy",
      "subtopics": [
        {
          "subtopicTitle": "Cell Structure",
          "explanation": "Detailed analysis of cell structure and its importance in tissue function.",
          "codeExample": null,
          "imageUrl": "https://example.com/cell-structure-image.jpg",
          "realWorldApplication": "Understanding cell structure is fundamental for many medical treatments and diagnostics."
        }
      ]
    }
  ],
  "revision": "Key Concepts:\n- Detailed regional anatomy\n- Microscopic anatomy\n- Clinical applications of anatomical knowledge"
}
`,
        },
      ],
    },
  ],
});

export const GenerateStudyTypeContentAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate the flashcard on topic : Flutter Fundamentals,User Interface (UI) Development,Basic App Navigation in JSON format with front back content, Maximum 15\n\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n[\n  {\n    \"front\": \"What is a Widget in Flutter?\",\n    \"back\": \"A Widget is the fundamental building block of Flutter's UI.  Everything you see on the screen is a widget, including text, images, buttons, and layouts.\"\n  },\n  {\n    \"front\": \"What are the two main types of Widgets?\",\n    \"back\": \"StatelessWidget and StatefulWidget. StatelessWidgets don't change their state, while StatefulWidgets can update their UI in response to changes.\"\n  },\n  {\n    \"front\": \"Explain the difference between StatelessWidget and StatefulWidget.\",\n    \"back\": \"StatelessWidget: Immutable, its UI is built once and never changes. StatefulWidget: Mutable, its UI can rebuild based on state changes using setState().\"\n  },\n  {\n    \"front\": \"What is a build method in a Widget?\",\n    \"back\": \"The build method is where you define the UI of a widget. It returns a widget tree representing the widget's visual structure.\"\n  },\n  {\n    \"front\": \"Name three common layout widgets.\",\n    \"back\": \"Row, Column, and Stack. Row arranges children horizontally, Column vertically, and Stack overlays them.\"\n  },\n  {\n    \"front\": \"What is the purpose of Scaffold?\",\n    \"back\": \"Scaffold provides a basic visual layout structure for an app, including AppBar, body, and bottomNavigationBar.\"\n  },\n  {\n    \"front\": \"How do you navigate to a new screen in Flutter?\",\n    \"back\": \"Use Navigator.push() to push a new route onto the navigation stack.  Navigator.pop() returns to the previous screen.\"\n  },\n  {\n    \"front\": \"What is a Route in Flutter Navigation?\",\n    \"back\": \"A Route represents a single screen or page in your application's navigation stack.\"\n  },\n  {\n    \"front\": \"What is Material Design in Flutter?\",\n    \"back\": \"A design language created by Google, providing a set of visual, motion, and interaction guidelines to ensure consistency and a pleasant user experience. Flutter readily incorporates Material Design.\"\n  },\n  {\n    \"front\": \"How to pass data between screens using navigation?\",\n    \"back\": \"Use arguments in Navigator.push() and receive them in the new screen's constructor or via ModalRoute.of(context).settings.arguments\"\n  },\n  {\n    \"front\": \"What is a Key in Flutter?\",\n    \"back\": \"Keys help Flutter identify widgets across rebuilds, particularly useful when dealing with dynamic lists or animations, preventing unnecessary rebuilds.\"\n  },\n  {\n    \"front\": \"What is the purpose of `setState()`?\",\n    \"back\": \"In a StatefulWidget, `setState()` triggers a rebuild of the widget's UI, reflecting changes in the widget's state.\"\n  },\n  {\n    \"front\": \"What is a `BuildContext`?\",\n    \"back\": \"A `BuildContext` provides information about the widget's position in the widget tree. It's used for accessing other widgets, themes, and navigation.\"\n  },\n  {\n    \"front\": \"Name a widget useful for displaying a list of items.\",\n    \"back\": \"ListView\"\n  },\n  {\n    \"front\": \"What's the difference between `Navigator.push` and `Navigator.pushReplacement`?\",\n    \"back\": \"`Navigator.push` adds a new route to the stack. `Navigator.pushReplacement` replaces the current route with the new one, removing the previous route.\"\n  }\n]\n```\n"},
      ],
    },
  ],
});