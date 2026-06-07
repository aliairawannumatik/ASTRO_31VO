import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

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

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return res.status(503).json({ error: 'Layanan AI belum dikonfigurasi di server.' })
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Pesan tidak valid.' })
    }

    const chatMessages = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
      .map((m) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text as string,
      }))

    if (chatMessages.length === 0) {
      return res.status(400).json({ error: 'Pesan tidak valid.' })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatMessages,
        ],
        max_tokens: 8192,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq API error:', err)
      return res.status(502).json({ error: 'Terjadi kesalahan saat menghubungi NUMATIK AI.' })
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] }
    const text = data.choices?.[0]?.message?.content ?? ''

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
