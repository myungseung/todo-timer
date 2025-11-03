/**
 * Vercel Serverless Function for logging crash cases
 * 로그는 Vercel Dashboard > Logs에서 확인 가능합니다
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const logData = req.body

    // Vercel의 console.log는 자동으로 Dashboard Logs에 기록됩니다
    console.log('[TIMER-CRASH]', JSON.stringify({
      timestamp: new Date().toISOString(),
      type: logData.type || 'unknown',
      level: logData.level || 'error',
      message: logData.message,
      data: logData.data || {},
      userAgent: req.headers['user-agent'],
      url: logData.url || 'unknown'
    }, null, 2))

    // 심각한 에러는 추가로 표준 에러 로그에도 기록
    if (logData.level === 'error' || logData.level === 'critical') {
      console.error('[TIMER-CRASH-ERROR]', {
        type: logData.type,
        message: logData.message,
        data: logData.data,
        timestamp: new Date().toISOString()
      })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('[LOG-HANDLER-ERROR]', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    return res.status(500).json({ error: 'Internal server error' })
  }
}

