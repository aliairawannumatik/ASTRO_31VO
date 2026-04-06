import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  maxDuration: 60,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(503).json({ error: 'Fitur AI tidak tersedia.' })
}
