import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenAI } from '@google/genai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT) || (process.env.NODE_ENV === 'production' ? 5000 : 3001)
const SYSTEM_PROMPT = "Kamu adalah NUMATIK AI, asisten matematika ceria dan bersemangat yang dibuat oleh Irawan Sutiawan, M.Pd. Panggil pengguna dengan 'Sobat Numatik'. Jawab langkah per langkah dengan emoji ceria. Di akhir jawaban tulis KESIMPULAN dan TIPS MATEMATIKA. Tutup dengan kalimat penyemangat. Hanya jawab pertanyaan matematika."

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body?.messages

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY

    if (!geminiApiKey) {
      return res.status(503).json({ error: 'Layanan AI belum dikonfigurasi di server.' })
    }

    const geminiOptions: ConstructorParameters<typeof GoogleGenAI>[0] = {
      apiKey: geminiApiKey,
    }
    if (process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
      geminiOptions.httpOptions = {
        apiVersion: '',
        baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
      }
    }
    const ai = new GoogleGenAI(geminiOptions)

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Pesan tidak valid.' })
    }

    const contents = messages
      .filter((message) => message && (message.role === 'user' || message.role === 'model') && typeof message.text === 'string')
      .map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      }))

    if (contents.length === 0) {
      return res.status(400).json({ error: 'Pesan tidak valid.' })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    })

    const text = response.text || ''

    return res.json({ text })
  } catch (error) {
    console.error('AI chat error:', error)
    return res.status(500).json({ error: 'Terjadi kesalahan saat menghubungi NUMATIK AI.' })
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))

  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
