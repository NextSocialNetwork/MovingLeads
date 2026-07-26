import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint: Generate AI Outreach Call Script / Pitch using Gemini
  app.post('/api/generate-pitch', async (req, res) => {
    try {
      const { fullName, sqFt, residenceType, moveDate, city, state, destinationCity, destinationState, notes } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a professional sales coordinator for an elite moving company. Write a customized, highly effective 60-second phone call script AND a quick follow-up SMS text message for a lead with the following move details:
- Name: ${fullName}
- Move Date: ${moveDate} (Next Week)
- From: ${city}, ${state}
- Destination: ${destinationCity}, ${destinationState}
- Residence Type: ${residenceType} (${sqFt} sq. ft.)
- Special Notes: ${notes || 'Standard residential move'}

Instructions:
1. Phone Script: Warm greeting, reference their upcoming move date next week, mention their approximate square footage (${sqFt} sq ft) and residence type, explain why booking now secures their preferred time slot, and ask a closing question to offer a fast binding quote.
2. SMS Text Template: Friendly, short (under 160 characters), offering a free estimate or quick chat.
3. Key Selling Points: Highlight transparent pricing, certified movers, and specialized handling for ${sqFt} sq ft homes.

Format the response clearly with headers:
### 📞 Phone Call Script
[script]

### 📱 SMS Follow-Up
[sms]

### 💡 Agent Quick Tips
[2 bullet points]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ script: response.text });
    } catch (err: any) {
      console.error('Error in /api/generate-pitch:', err);
      res.status(500).json({ error: err.message || 'Failed to generate outreach pitch' });
    }
  });

  // Serve static assets or Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
