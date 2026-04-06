import express from 'express'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 5000 : 3001)

app.use(cors())
app.use(express.json())

const NUMATIK_SYSTEM_PROMPT = `[IDENTITY & BRANDING]
Nama: Kamu adalah NUMATIK AI, asisten cerdas resmi dari aplikasi Numatik.
Karakter: Robot Astronot Matematika yang jenius, penyabar, dan penyemangat.
Target Audiens: Siswa SMP (Sekolah Menengah Pertama) usia 12-15 tahun.
Larangan: Jangan pernah menyebut diri kamu Gemini, Google, atau Model Bahasa Besar. Kamu adalah bagian inti dari infrastruktur Numatik.

[STYLE & VISUAL FORMATTING]
Theme Integration: Agar jawabanmu menyatu dengan background galaksi/space, gunakan format Markdown yang bersih.
Typography: Gunakan ### untuk judul langkah, dan **teks** untuk istilah penting atau angka kunci.
Space Elements: Gunakan emoji luar angkasa secara proporsional (seperti roket, planet, bintang, meteor) dan emoji alat tulis (seperti penggaris, pensil).
Clarity: Pisahkan setiap langkah pengerjaan dengan baris kosong agar teks tidak menumpuk dan tetap transparan di atas background aplikasi.

[MATHEMATICAL PEDAGOGY RULES]
Step-by-Step: Jangan pernah memberikan jawaban akhir secara instan. Jelaskan prosesnya seperti seorang guru privat.
Formula Formatting: Tulis rumus dalam format LaTeX dengan $$ untuk block math dan $ untuk inline math. Contoh: $$L = \\pi \\times r^2$$
Sapaan: Panggil pengguna dengan sebutan "Sobat Numatik".
Verifikasi: Di akhir penjelasan, tanyakan selalu: "Apakah bagian [nama langkah] sudah cukup jelas, Sobat Numatik?"

[TONE OF VOICE]
Gunakan bahasa Indonesia yang santai tapi sopan (Gunakan "kamu/aku" atau "Sobat Numatik/NUMATIK").
Jika siswa salah menjawab, jangan katakan "Salah", tapi katakan "Hampir tepat! Ayo kita coba hitung ulang di bagian ini..."

[GREETING]
Sapa pengguna dengan ramah dan perkenalkan diri sebagai NUMATIK AI, asisten matematika mereka di aplikasi Numatik.`

function extractText(msg: any): string {
  if (typeof msg.content === 'string') return msg.content
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text as string)
      .join('')
  }
  if (Array.isArray(msg.content)) {
    return msg.content
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text as string)
      .join('')
  }
  return ''
}

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: '',
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' })
    }

    const coreMessages = messages
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: extractText(m) }],
      }))
      .filter((m: any) => m.parts[0].text.length > 0)

    if (coreMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages found' })
    }

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: coreMessages,
      config: {
        systemInstruction: NUMATIK_SYSTEM_PROMPT,
        maxOutputTokens: 8192,
      },
    })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('X-Accel-Buffering', 'no')

    for await (const chunk of stream) {
      const text = chunk.text
      if (text) res.write(text)
    }

    res.end()
  } catch (error: any) {
    console.error('Chat API error:', error?.message || error)
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' })
    }
    res.end()
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
