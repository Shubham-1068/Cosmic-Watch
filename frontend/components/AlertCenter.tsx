'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Alert {
  id: string
  asteroidName: string
  type: 'approach' | 'hazard' | 'update'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: Date
  read: boolean
}

interface AlertCenterProps {
  alerts?: Alert[]
  onDismiss?: (id: string) => void
  autoOpenOnNew?: boolean
}

export default function AlertCenter({
  alerts = [],
  onDismiss,
  autoOpenOnNew = false,
}: AlertCenterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const prevUnreadCount = useRef(0)

  const severityColors = {
    low: 'bg-secondary/20 text-secondary border-secondary/30',
    medium: 'bg-accent/20 text-accent border-accent/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30',
  }

  const severityIcons = {
    low: '📢',
    medium: '⚠️',
    high: '🚨',
  }

  const typeLabels = {
    approach: 'Close Approach',
    hazard: 'Hazard Alert',
    update: 'Data Update',
  }

  const unreadCount = alerts.filter(a => !a.read).length

  useEffect(() => {
    if (!autoOpenOnNew) return
    if (unreadCount > prevUnreadCount.current) {
      setIsExpanded(true)
    }
    prevUnreadCount.current = unreadCount
  }, [unreadCount, autoOpenOnNew])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-4">
        {/* Alert Popup */}
        {isExpanded && (
          <Card className="border-primary/20 bg-card/90 backdrop-blur w-80 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Alerts</CardTitle>
                  <CardDescription>Recent notifications</CardDescription>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">No alerts</p>
              ) : (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border space-y-2 ${
                      alert.read ? 'border-border/50 bg-background/30' : `border-l-4 ${severityColors[alert.severity]}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="text-lg mt-0.5">{severityIcons[alert.severity]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {alert.asteroidName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {typeLabels[alert.type]}
                          </p>
                        </div>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-[10px] text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                      {onDismiss && (
                        <button
                          onClick={() => onDismiss(alert.id)}
                          className="text-[10px] text-primary hover:text-secondary transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Alert Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center gap-2 w-14 h-14 rounded-full font-semibold transition-all shadow-lg ${
            unreadCount > 0
              ? 'bg-gradient-to-br from-primary to-secondary text-foreground hover:from-primary/90 hover:to-secondary/90'
              : 'bg-primary/40 text-primary border border-primary/30 hover:bg-primary/30'
          }`}
        >
          {unreadCount > 0 ? (
            <>
              <span className="text-lg">🔔</span>
              <span className="text-xs font-bold w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          ) : (
            <span className="text-lg">🔔</span>
          )}
        </button>
      </div>
    </div>
  )
}
