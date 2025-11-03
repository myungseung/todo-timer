import { useState, useEffect, useRef } from 'react'
import { logTimerOnUnmount, logIntervalCleanupFailure, logTimerAbnormalStop } from '../utils/logger'

const INITIAL_TIMER_SECONDS = 50 * 60

export const useTimer = ({ onTodoTimeUpdate }) => {
  const [timerState, setTimerState] = useState('stopped')
  const [currentTodoId, setCurrentTodoId] = useState(null)
  const [currentTimeSpent, setCurrentTimeSpent] = useState(0)
  const timerIntervalRef = useRef(null)
  const onTodoTimeUpdateRef = useRef(onTodoTimeUpdate)
  const startTimeRef = useRef(null)
  const lastUpdateTimeRef = useRef(null)
  // cleanup에서 최신 값에 접근하기 위한 ref
  const timerStateRef = useRef(timerState)
  const currentTodoIdRef = useRef(currentTodoId)
  const currentTimeSpentRef = useRef(currentTimeSpent)

  useEffect(() => {
    onTodoTimeUpdateRef.current = onTodoTimeUpdate
  }, [onTodoTimeUpdate])

  // ref 업데이트
  useEffect(() => {
    timerStateRef.current = timerState
    currentTodoIdRef.current = currentTodoId
    currentTimeSpentRef.current = currentTimeSpent
  }, [timerState, currentTodoId, currentTimeSpent])

  useEffect(() => {
    console.log('⏱️ [Timer] useTimer hook 마운트됨', { timestamp: new Date().toISOString() })

    return () => {
      const hadActiveInterval = !!timerIntervalRef.current
      const wasRunning = timerStateRef.current === 'running'

      console.log('🔥 [Timer] useTimer hook 언마운트됨', {
        hadActiveInterval,
        wasRunning,
        currentTodoId: currentTodoIdRef.current,
        currentTimeSpent: currentTimeSpentRef.current,
        timestamp: new Date().toISOString()
      })

      // Crash case: 언마운트시 타이머가 실행 중이었는지 로깅
      logTimerOnUnmount({
        state: timerStateRef.current,
        todoId: currentTodoIdRef.current,
        timeSpent: currentTimeSpentRef.current,
        hadActiveInterval
      })

      if (timerIntervalRef.current) {
        try {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
        } catch (error) {
          // Crash case: interval 정리 실패 로깅
          logIntervalCleanupFailure({
            state: timerStateRef.current,
            todoId: currentTodoIdRef.current,
            timeSpent: currentTimeSpentRef.current,
            error: error.message
          })
        }
      }
    }
  }, [])

  const startTimer = (todoId, existingTimeSpent = 0, getCurrentTimeSpent) => {
    console.log('▶️ [Timer] 타이머 시작 요청', {
      todoId,
      existingTimeSpent,
      hasGetCurrentTimeSpent: !!getCurrentTimeSpent,
      timestamp: new Date().toISOString()
    })

    // 기존 interval 정리
    if (timerIntervalRef.current) {
      console.log('⚠️ [Timer] 기존 interval 정리', { timestamp: new Date().toISOString() })
      try {
        clearInterval(timerIntervalRef.current)
      } catch (error) {
        // Crash case: interval 정리 실패 로깅
        logIntervalCleanupFailure({
          state: timerState,
          todoId: currentTodoId,
          timeSpent: currentTimeSpent,
          error: error.message,
          context: 'startTimer'
        })
      }
    }

    setCurrentTodoId(todoId)
    setTimerState('running')
    setCurrentTimeSpent(existingTimeSpent)

    const now = Date.now()
    startTimeRef.current = now
    lastUpdateTimeRef.current = now

    // getCurrentTimeSpent를 통해 최신 값을 가져오는 함수
    const getLatestTimeSpent = () => {
      return getCurrentTimeSpent ? getCurrentTimeSpent() : existingTimeSpent
    }

    let tickCount = 0
    timerIntervalRef.current = setInterval(() => {
      try {
        tickCount++
        const currentTime = Date.now()
        const elapsedSeconds = Math.floor((currentTime - lastUpdateTimeRef.current) / 1000)

        if (tickCount % 60 === 0) {
          console.log(`⏲️ [Timer] 1분 경과 (${tickCount}초)`, {
            todoId,
            elapsedSeconds,
            timestamp: new Date().toISOString()
          })
        }

        if (elapsedSeconds > 0) {
          onTodoTimeUpdateRef.current(todoId, elapsedSeconds)
          lastUpdateTimeRef.current = currentTime

          // 실시간으로 현재 timeSpent 계산
          const baseTimeSpent = getLatestTimeSpent()
          const totalElapsed = Math.floor((currentTime - startTimeRef.current) / 1000)
          const newTimeSpent = baseTimeSpent + totalElapsed
          setCurrentTimeSpent(newTimeSpent)
        }
      } catch (error) {
        // Crash case: interval 콜백 실행 중 에러 발생
        logTimerAbnormalStop('interval-callback-error', {
          state: timerState,
          todoId,
          timeSpent: currentTimeSpent,
          tickCount,
          error: error.message,
          errorStack: error.stack
        })
      }
    }, 1000)

    console.log('✅ [Timer] 타이머 시작됨', {
      intervalId: timerIntervalRef.current,
      timestamp: new Date().toISOString()
    })
  }

  const stopTimer = () => {
    console.log('⏹️ [Timer] 타이머 정지 요청', {
      hasInterval: !!timerIntervalRef.current,
      currentTodoId,
      currentTimeSpent,
      timestamp: new Date().toISOString()
    })

    if (timerIntervalRef.current) {
      try {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
        console.log('✅ [Timer] Interval 정리됨', { timestamp: new Date().toISOString() })
      } catch (error) {
        // Crash case: interval 정리 실패 로깅
        logIntervalCleanupFailure({
          state: timerState,
          todoId: currentTodoId,
          timeSpent: currentTimeSpent,
          error: error.message,
          context: 'stopTimer'
        })
      }
    } else if (timerState === 'running') {
      // Crash case: 타이머가 running 상태인데 interval이 없는 경우
      logTimerAbnormalStop('interval-missing-on-stop', {
        state: timerState,
        todoId: currentTodoId,
        timeSpent: currentTimeSpent
      })
    }

    setTimerState('stopped')
    console.log('✅ [Timer] 타이머 정지됨', { timestamp: new Date().toISOString() })
  }

  const getRemainingTime = (spentTime) => {
    const nextMilestone = Math.ceil(spentTime / INITIAL_TIMER_SECONDS) * INITIAL_TIMER_SECONDS
    return nextMilestone - spentTime
  }

  const getTimerDisplay = () => {
    const remainingSeconds = getRemainingTime(currentTimeSpent)

    const mins = Math.floor(remainingSeconds / 60)
    const secs = remainingSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerRatios = () => {
    const remainingSeconds = getRemainingTime(currentTimeSpent)
    const elapsedInCycle = INITIAL_TIMER_SECONDS - remainingSeconds
    const FULL_CIRCLE_SECONDS = 60 * 60

    const backgroundRatio = (10 * 60) / FULL_CIRCLE_SECONDS
    const elapsedRatio = elapsedInCycle / FULL_CIRCLE_SECONDS
    const remainingRatio = remainingSeconds / FULL_CIRCLE_SECONDS

    return { backgroundRatio, elapsedRatio, remainingRatio }
  }

  return {
    timerState,
    currentTodoId,
    startTimer,
    stopTimer,
    getTimerDisplay,
    getTimerRatios
  }
}

