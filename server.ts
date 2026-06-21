import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route for Roblox Game Idea Generation
app.post("/api/generate", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are an expert Roblox game designer. Generate a highly creative, unique, and engaging concept for a new Roblox game. 
Return the concept strictly as a JSON object with the following fields:
- title: A catchy and punchy title for the game.
- genre: The main genre (e.g., Simulator, Tycoon, Obby, RPG, Survival).
- pitch: A one or two sentence elevator pitch.
- mechanics: An array of exactly 3 strings, each describing a core gameplay mechanic.
- gamepass: A fun and slightly overpowered 'gamepass' or premium item idea that players would want to buy with Robux.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            pitch: { type: Type.STRING },
            mechanics: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            gamepass: { type: Type.STRING }
          },
          required: ["title", "genre", "pitch", "mechanics", "gamepass"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      res.json(data);
    } else {
      res.status(500).json({ error: "Failed to generate idea" });
    }
  } catch (error) {
    console.error("Error generating game idea:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vite middleware for development or serving static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
