/**
 * Vercel Logging Utility
 * 타이머 crash case를 Vercel Dashboard Logs에 기록합니다
 */

const LOG_ENABLED = !import.meta.env.DEV // 프로덕션에서만 활성화

/**
 * Vercel API로 로그 전송
 */
async function sendLog(logData) {
  if (!LOG_ENABLED) {
    console.log('[Logger] 개발 모드 - 로그 전송 건너뜀:', logData)
    return
  }

  try {
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...logData,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      console.error('[Logger] 로그 전송 실패:', response.status)
    }
  } catch (error) {
    // 네트워크 에러는 조용히 실패 (사용자 경험 방해하지 않음)
    console.error('[Logger] 로그 전송 중 에러:', error.message)
  }
}

/**
 * 타이머 crash case 로깅
 */
export function logTimerCrash(type, message, data = {}) {
  sendLog({
    type: 'timer-crash',
    level: 'error',
    category: type,
    message,
    data: {
      ...data,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    }
  })
}

/**
 * 타이머 비정상 종료 로깅
 */
export function logTimerAbnormalStop(reason, timerData) {
  logTimerCrash('abnormal-stop', `타이머 비정상 종료: ${reason}`, {
    reason,
    timerState: timerData.state,
    currentTodoId: timerData.todoId,
    timeSpent: timerData.timeSpent,
    hadActiveInterval: timerData.hadActiveInterval
  })
}

/**
 * 타이머 interval 정리 실패 로깅
 */
export function logIntervalCleanupFailure(timerData) {
  logTimerCrash('interval-cleanup-failure', '타이머 interval 정리 실패', {
    timerState: timerData.state,
    currentTodoId: timerData.todoId,
    timeSpent: timerData.timeSpent
  })
}

/**
 * 컴포넌트 언마운트시 타이머 상태 로깅
 */
export function logTimerOnUnmount(timerData) {
  if (timerData.state === 'running') {
    logTimerCrash('unmount-with-running-timer', '컴포넌트 언마운트시 타이머가 실행 중이었음', {
      currentTodoId: timerData.todoId,
      timeSpent: timerData.timeSpent,
      hadActiveInterval: timerData.hadActiveInterval
    })
  }
}

/**
 * 일반 에러 로깅
 */
export function logError(error, context = {}) {
  sendLog({
    type: 'error',
    level: 'error',
    message: error.message || 'Unknown error',
    data: {
      ...context,
      errorName: error.name,
      errorStack: error.stack,
      errorString: String(error)
    }
  })
}

/**
 * 경고 로깅
 */
export function logWarning(message, data = {}) {
  sendLog({
    type: 'warning',
    level: 'warning',
    message,
    data
  })
}

