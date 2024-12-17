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
        {text: "Generate the flashcard on topic : Flutter Fundamentals,User Interface (UI) Development,Basic App Navigation in JSON format with front back content 104 characters max, Maximum 15 cards\n\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n[\n  {\n    \"front\": \"What is a Widget in Flutter?\",\n    \"back\": \"A Widget is the basic building block of a Flutter UI.  Everything you see on the screen is a widget, including layout elements, text, images, and more. They are immutable and describe part of the user interface.\"\n  },\n  {\n    \"front\": \"What are the two main types of Widgets?\",\n    \"back\": \"StatelessWidget (immutable) and StatefulWidget (mutable).\"\n  },\n  {\n    \"front\": \"Explain the difference between StatelessWidget and StatefulWidget.\",\n    \"back\": \"StatelessWidget doesn't change its state over time, while StatefulWidget can change its state and rebuild parts of the UI in response to events.\"\n  },\n  {\n    \"front\": \"What is a BuildContext?\",\n    \"back\": \"BuildContext provides information about a widget's location in the widget tree. It's used to access various services and information like theme data.\"\n  },\n  {\n    \"front\": \"Name three common layout widgets in Flutter.\",\n    \"back\": \"Row, Column, and Stack.\"\n  },\n  {\n    \"front\": \"What is the purpose of a `Scaffold` widget?\",\n    \"back\": \"Scaffold provides a basic visual layout structure for an app, including an AppBar, body, and bottom navigation bar.\"\n  },\n  {\n    \"front\": \"How do you navigate to a new screen in Flutter?\",\n    \"back\": \"Use `Navigator.push(context, MaterialPageRoute(builder: (context) => NewScreen()));`\"\n  },\n  {\n    \"front\": \"How do you pop (go back) from a screen in Flutter?\",\n    \"back\": \"Use `Navigator.pop(context);`\"\n  },\n  {\n    \"front\": \"What is a Route in Flutter navigation?\",\n    \"back\": \"A Route represents a screen or page in your application.  `MaterialPageRoute` is a common type of route.\"\n  },\n  {\n    \"front\": \"What is the purpose of `MaterialApp`?\",\n    \"back\": \"MaterialApp is a widget that provides a Material Design theme and manages navigation for your app.\"\n  },\n  {\n    \"front\": \"What is a key in Flutter?\",\n    \"back\": \"A key helps Flutter identify widgets in the widget tree, especially when widgets are dynamically added, removed, or reordered.  This allows Flutter to efficiently update the UI.\"\n  },\n  {\n    \"front\": \"Explain the concept of the Widget tree.\",\n    \"back\": \"The Widget tree is a hierarchical representation of all the widgets in your Flutter app.  The root widget is usually MaterialApp.  Children widgets are nested within their parent widgets.\"\n  },\n  {\n    \"front\": \"What is the role of `setState()`?\",\n    \"back\": \"Used in StatefulWidgets to rebuild the UI after changing the widget's state.  It triggers a UI update.\"\n  },\n  {\n    \"front\": \"How to pass data between screens using navigation?\",\n    \"back\": \"Use arguments in `MaterialPageRoute` (e.g., `MaterialPageRoute(builder: (context) => NewScreen(data: myData),)` and access it in the `NewScreen` widget's constructor.\"\n  },\n  {\n    \"front\": \"What is a `FutureBuilder` widget used for?\",\n    \"back\": \"It is used to build a UI that depends on the result of an asynchronous operation (e.g., fetching data from a network).\"\n  }\n]\n```\n"},
      ],
    },
  ],
});


export const GenerateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate Quiz on topic: Setting up the Development Environment, Backend Development with Node.js and Express.js, Frontend Development with React, Connecting Frontend and Backend, Deploying the E-commerce Website, Advanced Features and Optimization with Questions and Options along with correct answer in JSON format, (max 20)"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"quiz\": [\n    {\n      \"question\": \"Which command installs Node.js and npm on a macOS system using a package manager?\",\n      \"options\": [\"brew install node\", \"apt-get install nodejs\", \"yum install nodejs\", \"choco install nodejs\"],\n      \"answer\": \"brew install node\"\n    },\n    {\n      \"question\": \"What is the purpose of package.json in a Node.js project?\",\n      \"options\": [\"Stores project dependencies\", \"Contains the project's source code\", \"Defines the project's deployment strategy\", \"Manages the database connection\"],\n      \"answer\": \"Stores project dependencies\"\n    },\n    {\n      \"question\": \"Which command initializes a new Node.js project with npm?\",\n      \"options\": [\"npm init\", \"npm start\", \"npm install\", \"npm run build\"],\n      \"answer\": \"npm init\"\n    },\n    {\n      \"question\": \"What is Express.js primarily used for in Node.js development?\",\n      \"options\": [\"Database management\", \"Frontend rendering\", \"Backend server framework\", \"Testing framework\"],\n      \"answer\": \"Backend server framework\"\n    },\n    {\n      \"question\": \"Which HTTP method is typically used to retrieve data from a server?\",\n      \"options\": [\"POST\", \"PUT\", \"GET\", \"DELETE\"],\n      \"answer\": \"GET\"\n    },\n    {\n      \"question\": \"In React, what is JSX?\",\n      \"options\": [\"A JavaScript testing framework\", \"A syntax extension to JavaScript\", \"A CSS preprocessor\", \"A Node.js package manager\"],\n      \"answer\": \"A syntax extension to JavaScript\"\n    },\n    {\n      \"question\": \"What is the purpose of `npm start` in a React application?\",\n      \"options\": [\"Builds the application for production\", \"Installs project dependencies\", \"Starts the development server\", \"Runs the unit tests\"],\n      \"answer\": \"Starts the development server\"\n    },\n    {\n      \"question\": \"How do you typically connect a React frontend to a Node.js/Express backend?\",\n      \"options\": [\"Using a shared database\", \"Through direct file access\", \"Using API calls (e.g., fetch or Axios)\", \"Via a shared memory space\"],\n      \"answer\": \"Using API calls (e.g., fetch or Axios)\"\n    },\n    {\n      \"question\": \"Which command is commonly used to deploy a Node.js application to Heroku?\",\n      \"options\": [\"git push heroku master\", \"npm deploy heroku\", \"heroku deploy node\", \"aws deploy node\"],\n      \"answer\": \"git push heroku master\"\n    },\n    {\n      \"question\": \"What is a common method for optimizing images for an e-commerce website?\",\n      \"options\": [\"Using larger images for better quality\", \"Using lossless compression formats always\",  \"Using image optimization tools and lossy compression where appropriate\", \"Not optimizing images for performance\"],\n      \"answer\": \"Using image optimization tools and lossy compression where appropriate\"\n    },\n    {\n      \"question\": \"What is caching and how does it improve website performance?\",\n      \"options\": [\"Storing frequently accessed data to reduce database load\", \"A type of database optimization\", \"A method for increasing website traffic\", \"A technique for encrypting user data\"],\n      \"answer\": \"Storing frequently accessed data to reduce database load\"\n    },\n    {\n      \"question\": \"What is the purpose of a 'middleware' function in Express.js?\",\n      \"options\": [\"To handle database connections\", \"To define API routes\", \"To execute code before reaching the next middleware or route handler\", \"To manage user authentication only\"],\n      \"answer\": \"To execute code before reaching the next middleware or route handler\"\n    },\n    {\n      \"question\": \"What is a common way to handle user authentication in a Node.js/Express application?\",\n      \"options\": [\"Using JWT (JSON Web Tokens)\", \"Storing passwords directly in the database\", \"Using session cookies only\", \"Not implementing authentication\"],\n      \"answer\": \"Using JWT (JSON Web Tokens)\"\n    },\n    {\n      \"question\": \"In React, what is the purpose of `useState` hook?\",\n      \"options\": [\"To manage component state\", \"To handle HTTP requests\", \"To define component styles\", \"To manage routing\"],\n      \"answer\": \"To manage component state\"\n    },\n    {\n      \"question\": \"What is 'SEO' in the context of an e-commerce website?\",\n      \"options\": [\"Search Engine Optimization\", \"Secure Email Optimization\", \"Social Engagement Optimization\", \"Software Engineering Optimization\"],\n      \"answer\": \"Search Engine Optimization\"\n    },\n    {\n      \"question\": \"What does REST stand for in RESTful APIs?\",\n      \"options\": [\"Representational State Transfer\", \"Remote Server Technology\", \"Resourceful Server Transfer\", \"Remote System Transfer\"],\n      \"answer\": \"Representational State Transfer\"\n    },\n    {\n      \"question\": \"How can you improve the loading speed of a React application?\",\n      \"options\": [\"Code splitting and lazy loading\", \"Using larger images\", \"Not optimizing code\", \"Ignoring user experience\"],\n      \"answer\": \"Code splitting and lazy loading\"\n    },\n     {\n      \"question\": \"What is one way to handle errors gracefully in a Node.js/Express application?\",\n      \"options\": [\"Using try...catch blocks and error handling middleware\", \"Ignoring all errors\", \"Printing error messages directly to the console\", \"Not handling errors\"],\n      \"answer\": \"Using try...catch blocks and error handling middleware\"\n    }\n  ]\n}\n```\n"},
      ],
    },
  ],
});