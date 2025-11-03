import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

console.log('🔧 [SW] Service Worker 스크립트 로드됨', { timestamp: new Date().toISOString() })

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)

// Install 이벤트
self.addEventListener('install', () => {
  console.log('📦 [SW] Install 이벤트', {
    timestamp: new Date().toISOString(),
    manifestLength: self.__WB_MANIFEST?.length
  })
})

// Activate 이벤트
self.addEventListener('activate', () => {
  console.log('✅ [SW] Activate 이벤트', { timestamp: new Date().toISOString() })
})

// Fetch 이벤트 (모든 네트워크 요청 추적)
let fetchCount = 0
self.addEventListener('fetch', (event) => {
  fetchCount++
  if (fetchCount % 10 === 0) {
    console.log(`🌐 [SW] Fetch 이벤트 (${fetchCount}번째)`, {
      url: event.request.url,
      method: event.request.method,
      timestamp: new Date().toISOString()
    })
  }
})

// Message 이벤트
self.addEventListener('message', (event) => {
  console.log('💬 [SW] 메시지 수신:', {
    data: event.data,
    timestamp: new Date().toISOString()
  })

  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏩ [SW] SKIP_WAITING 수신, skipWaiting 실행')
    self.skipWaiting()
  }
})

console.log('✅ [SW] Service Worker 초기화 완료', { timestamp: new Date().toISOString() })

