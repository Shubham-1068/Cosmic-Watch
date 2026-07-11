'use client'

import { Bell, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Alert { id: string; asteroidName: string; type: 'approach' | 'hazard' | 'update'; severity: 'low' | 'medium' | 'high'; message: string; timestamp: Date; read: boolean }
interface AlertCenterProps { alerts?: Alert[]; onDismiss?: (id: string) => void; autoOpenOnNew?: boolean }

const labels = { approach: 'Close approach', hazard: 'Risk assessment', update: 'Feed update' }

export default function AlertCenter({ alerts = [], onDismiss, autoOpenOnNew = false }: AlertCenterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const previousCount = useRef(0)
  const unreadCount = alerts.filter((alert) => !alert.read).length

  useEffect(() => {
    if (autoOpenOnNew && unreadCount > previousCount.current) setIsExpanded(true)
    previousCount.current = unreadCount
  }, [autoOpenOnNew, unreadCount])

  return <aside className="alert-center" aria-label="Notifications">
    {isExpanded && <section className="alert-panel">
      <header className="alert-panel__header"><div><p className="eyebrow">Signals</p><h2>Notifications</h2></div><button onClick={() => setIsExpanded(false)} className="alert-close" aria-label="Close notifications"><X size={18}/></button></header>
      <div className="alert-panel__body">{alerts.length === 0 ? <div className="alert-empty"><Bell size={20}/><p>You’re all caught up.</p><span>New asteroid signals will appear here.</span></div> : alerts.map((alert) => <article className={`alert-item alert-item--${alert.severity}`} key={alert.id}>
        <div className="alert-item__top"><span className="alert-level">{labels[alert.type]}</span><time>{alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>
        <h3>{alert.asteroidName}</h3><p>{alert.message}</p>
        {onDismiss && <button className="alert-dismiss" onClick={() => onDismiss(alert.id)}>Mark as read <ChevronRight size={14}/></button>}
      </article>)}</div>
    </section>}
    <button className="alert-trigger" onClick={() => setIsExpanded((open) => !open)} aria-expanded={isExpanded} aria-label="Open notifications"><Bell size={19}/>{unreadCount > 0 && <span>{unreadCount > 9 ? '9+' : unreadCount}</span>}</button>
  </aside>
}
