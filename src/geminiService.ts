import axios from 'axios';

export async function generateDocWithGemini(code: string, apiKey: string): Promise<string> {
  const prompt = `Génère une documentation claire et concise pour ce code d'API (route ou contrôleur) en Markdown :

${code}

Documentation :`;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };
  const response = await axios.post(url, body);
  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Réponse Gemini invalide ou vide.');
  return text;
}
