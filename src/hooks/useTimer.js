import { useState, useEffect, useRef } from 'react'

const INITIAL_TIMER_SECONDS = 50 * 60

export const useTimer = ({ onTodoTimeUpdate }) => {
  const [timerState, setTimerState] = useState('stopped')
  const [currentTodoId, setCurrentTodoId] = useState(null)
  const [currentTimeSpent, setCurrentTimeSpent] = useState(0)
  const timerIntervalRef = useRef(null)
  const onTodoTimeUpdateRef = useRef(onTodoTimeUpdate)
  const startTimeRef = useRef(null)
  const lastUpdateTimeRef = useRef(null)

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

  const startTimer = (todoId, existingTimeSpent = 0, getCurrentTimeSpent) => {
    // 기존 interval 정리
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
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

    timerIntervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - lastUpdateTimeRef.current) / 1000)

      if (elapsedSeconds > 0) {
        onTodoTimeUpdateRef.current(todoId, elapsedSeconds)
        lastUpdateTimeRef.current = currentTime

        // 실시간으로 현재 timeSpent 계산
        const baseTimeSpent = getLatestTimeSpent()
        const totalElapsed = Math.floor((currentTime - startTimeRef.current) / 1000)
        const newTimeSpent = baseTimeSpent + totalElapsed
        setCurrentTimeSpent(newTimeSpent)
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    setTimerState('stopped')
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

