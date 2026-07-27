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

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are a professional sales coordinator for an elite moving company. Write a customized, highly effective 60-second phone call script AND a quick follow-up SMS text message for a lead with the following move details:
- Name: ${fullName}
- Move Date: ${moveDate}
- From: ${city}, ${state}
- Destination: ${destinationCity}, ${destinationState}
- Residence Type: ${residenceType} (${sqFt} sq. ft.)
- Special Notes: ${notes || 'Standard residential move'}

Instructions:
1. Phone Script: Warm greeting, reference their upcoming move date, mention their approximate square footage (${sqFt} sq ft) and residence type, explain why booking now secures their preferred time slot, and ask a closing question to offer a fast binding quote.
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
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ script: response.text });
    } catch (err: any) {
      console.error('Error in /api/generate-pitch:', err);
      res.status(500).json({ error: err.message || 'Failed to generate outreach pitch' });
    }
  });

  // API endpoint: AI Support Chat Assistant
  app.post('/api/support-chat', async (req, res) => {
    try {
      const { message, history } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are the official friendly 24/7 AI Support Assistant for "Moving Leads For Sale" (MovingLeadsForSale.Org).
Your job is to answer all customer questions clearly, professionally, and accurately.

Key Business & Service Details:
1. What we do: We provide verified, real-time USA residential moving leads across all 50 states for moving companies, brokers, and logistics professionals.
2. What data each lead contains: Lead ID, Full Name, Contact Phone, Email, Pickup Address, City, State, ZIP Code, Residence Type, Square Footage (sq ft), Move Date, Urgency Status, Estimated Value ($1500–$3000), and Special Moving Notes.
3. Lead Delivery Notice & Timeframe: ALL purchased leads will be emailed to the customer within 24 to 48 hours after payment completion.
4. Pricing & Payment:
   - Full Uncensored Leads Dataset (150 verified leads in 50 states) or Individual Lead packages: $75.
   - Payment is accepted directly via Cash App using Cashtag: $Movers312 (Direct link: https://Cash.App/$Movers312).
5. Purchase Process:
   - Click any Cash App button or "Cash App Purchase ($75)" on the website.
   - Complete the short Purchase Form with First Name, Last Name, Email Address, and Phone Number.
   - Click "Submit Info & Pay $75 via Cash App".
   - Complete the $75 payment on Cash App ($Movers312).
   - Once payment is verified, the full lead package is emailed to the customer's email within 24 to 48 hours.
6. Site Features:
   - Search & Filter by State, City, ZIP Code, Sq Ft, Move Date, and Urgency.
   - Export lead lists to CSV.
   - Built-in AI Sales Pitch & SMS Script Generator for each lead.
   - ZIP Code Clustering view to analyze lead concentration.

Tone & Style:
- Be polite, helpful, concise, and trustworthy.
- Always emphasize the 24 to 48 hour email delivery timeframe for purchased leads.
- Provide clear step-by-step guidance when asked about buying or accessing leads.
- Format responses nicely with bullet points or bold text when appropriate.`;

      const contents = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          if (item.role && item.text) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Error in /api/support-chat:', err);
      res.status(500).json({ error: err.message || 'Failed to process AI chat response' });
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
