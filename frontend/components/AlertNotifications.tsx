'use client'

import { useEffect, useMemo, useState } from 'react'
import AlertCenter from '@/components/AlertCenter'
import { alertsAPI, storageHelpers } from '@/lib/api'

interface BackendNotification {
  id: string
  message: string
  isRead: boolean
  createdAt: string
}

interface AlertItem {
  id: string
  asteroidName: string
  type: 'approach' | 'hazard' | 'update'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: Date
  read: boolean
}

const POLL_INTERVAL_MS = 30000

function parseAlertDetails(message: string): {
  asteroidName: string
  type: 'approach' | 'hazard' | 'update'
  severity: 'low' | 'medium' | 'high'
} {
  const riskMatch = message.match(/risk level for asteroid\s+(.+?)\s+is\s+(low|medium|high)/i)
  if (riskMatch) {
    return {
      asteroidName: riskMatch[1].trim(),
      type: 'hazard',
      severity: riskMatch[2].toLowerCase() as 'low' | 'medium' | 'high',
    }
  }

  const approachMatch = message.match(/Asteroid\s+(.+?)\s+(is within|will pass)/i)
  if (approachMatch) {
    return {
      asteroidName: approachMatch[1].trim(),
      type: 'approach',
      severity: 'medium',
    }
  }

  return {
    asteroidName: 'Unknown Asteroid',
    type: 'update',
    severity: 'low',
  }
}

export default function AlertNotifications() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([])

  useEffect(() => {
    let isMounted = true
    let intervalId: number | undefined

    const loadNotifications = async () => {
      const token = storageHelpers.getToken()
      if (!token) return

      try {
        const data = await alertsAPI.getNotifications()
        const items = Array.isArray(data?.notifications) ? data.notifications : []
        if (!isMounted) return
        setNotifications(items)
      } catch (err) {
      }
    }

    loadNotifications()
    intervalId = window.setInterval(loadNotifications, POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [])

  const alerts = useMemo<AlertItem[]>(() =>
    notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => {
        const details = parseAlertDetails(notification.message)
        return {
          id: notification.id,
          asteroidName: details.asteroidName,
          type: details.type,
          severity: details.severity,
          message: notification.message,
          timestamp: new Date(notification.createdAt),
          read: notification.isRead,
        }
      }), [notifications])

  const handleDismiss = async (id: string) => {
    try {
      await alertsAPI.markNotificationRead(id)
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      )
    } catch (err) {
    }
  }

  return (
    <AlertCenter
      alerts={alerts}
      onDismiss={handleDismiss}
      autoOpenOnNew
    />
  )
}
