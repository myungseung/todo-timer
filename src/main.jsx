import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('✅ [PWA] 새 버전 발견! 업데이트 가능')
  },
  onOfflineReady() {
    console.log('📱 [PWA] 오프라인 모드 준비 완료')
  },
  onRegistered(registration) {
    console.log('🔄 [PWA] Service Worker 등록 완료', registration)
  },
  onRegisterError(error) {
    console.error('❌ [PWA] Service Worker 등록 실패:', error)
  }
})

window.__updateSW = async (reloadPage = true) => {
  console.log('🔍 [PWA] 업데이트 버튼 클릭 - 서버 확인 시작...')

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (!registration) {
      console.error('❌ [PWA] Service Worker가 등록되지 않음')
      return
    }

    console.log('📋 [PWA] 현재 SW 상태:', {
      active: !!registration.active,
      waiting: !!registration.waiting,
      installing: !!registration.installing
    })

    console.log('🔎 [PWA] 서버에 새 버전 확인 중...')
    const newRegistration = await registration.update()

    console.log('📊 [PWA] 업데이트 확인 후 상태:', {
      active: !!newRegistration.active,
      waiting: !!newRegistration.waiting,
      installing: !!newRegistration.installing
    })

    if (newRegistration.waiting) {
      console.log('✨ [PWA] 새 버전 다운로드 완료! 적용 중...')
      if (updateSW) {
        updateSW(reloadPage)
      }
    } else if (newRegistration.installing) {
      console.log('⏳ [PWA] 새 버전 설치 중...')
      newRegistration.installing.addEventListener('statechange', (e) => {
        console.log('📦 [PWA] 설치 상태 변경:', e.target.state)
        if (e.target.state === 'installed') {
          console.log('✅ [PWA] 설치 완료! 리로드합니다...')
          if (reloadPage) {
            window.location.reload()
          }
        }
      })
    } else {
      console.log('ℹ️ [PWA] 이미 최신 버전입니다.')
    }

  } catch (error) {
    console.error('❌ [PWA] 업데이트 확인 실패:', error)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

