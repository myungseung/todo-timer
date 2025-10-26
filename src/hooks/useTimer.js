import { useState, useEffect, useRef } from 'react'

const INITIAL_TIMER_SECONDS = 50 * 60

export const useTimer = ({ onTodoTimeUpdate }) => {
  const [timerSeconds, setTimerSeconds] = useState(INITIAL_TIMER_SECONDS)
  const [timerState, setTimerState] = useState('stopped')
  const [currentTodoId, setCurrentTodoId] = useState(null)
  const [initialTimeSpent, setInitialTimeSpent] = useState(0)
  const timerIntervalRef = useRef(null)
  const onTodoTimeUpdateRef = useRef(onTodoTimeUpdate)

  useEffect(() => {
    onTodoTimeUpdateRef.current = onTodoTimeUpdate
  }, [onTodoTimeUpdate])

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const startTimer = (todoId, existingTimeSpent = 0) => {
    // 50분 초과분을 계산하여 초기 타이머 설정
    const timeInCurrentCycle = existingTimeSpent % INITIAL_TIMER_SECONDS
    const remainingSeconds = INITIAL_TIMER_SECONDS - timeInCurrentCycle

    setCurrentTodoId(todoId)
    setTimerSeconds(remainingSeconds)
    setInitialTimeSpent(existingTimeSpent)
    setTimerState('running')

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev - 1)
      // 매 초마다 1초씩 저장 (새로고침 시 데이터 손실 방지)
      onTodoTimeUpdateRef.current(todoId, 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    setTimerState('stopped')
  }

  const getTimerDisplay = () => {
    const mins = Math.floor(timerSeconds / 60)
    const secs = timerSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerRatios = () => {
    const FULL_CIRCLE_SECONDS = 60 * 60
    // 현재 사이클에서의 총 경과 시간
    const totalElapsedInCycle = INITIAL_TIMER_SECONDS - timerSeconds

    const backgroundRatio = (10 * 60) / FULL_CIRCLE_SECONDS
    const elapsedRatio = totalElapsedInCycle / FULL_CIRCLE_SECONDS
    const remainingRatio = timerSeconds / FULL_CIRCLE_SECONDS

    return { backgroundRatio, elapsedRatio, remainingRatio }
  }

  return {
    timerSeconds,
    timerState,
    currentTodoId,
    startTimer,
    stopTimer,
    getTimerDisplay,
    getTimerRatios
  }
}

