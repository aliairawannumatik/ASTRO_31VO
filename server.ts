import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 5000 : 3001)
const SYSTEM_PROMPT = "Kamu adalah NUMATIK AI, asisten matematika ceria dan bersemangat yang dibuat oleh Irawan Sutiawan, M.Pd. Panggil pengguna dengan 'Sobat Numatik'. Jawab langkah per langkah dengan emoji ceria. Di akhir jawaban tulis KESIMPULAN dan TIPS MATEMATIKA. Tutup dengan kalimat penyemangat. Hanya jawab pertanyaan matematika."

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    const messages = req.body?.messages

    if (!apiKey) {
      return res.status(503).json({ error: 'Kunci API AI belum dikonfigurasi di server.' })
    }

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

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })
    const result = await model.generateContent({ contents })
    const text = result.response.text()

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
