'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { chatAPI, storageHelpers } from '@/lib/api'
import FloatingNavbar from '@/components/FloatingNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Send, MessageCircle, Hash } from 'lucide-react'

interface Channel {
  id: string
  name: string
  neoId: string | null
  count: number
  lastMessageAt: string | null
}

interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  neoId: string | null
  createdAt: string
}

const POLL_INTERVAL_MS = 5000

export default function CommunityChat() {
  const router = useRouter()
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannelId, setActiveChannelId] = useState('global')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [isLoadingChannels, setIsLoadingChannels] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId),
    [channels, activeChannelId]
  )

  useEffect(() => {
    const token = storageHelpers.getToken()
    if (!token) {
      setIsAuthenticated(false)
      router.push('/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const loadChannels = async () => {
    try {
      setIsLoadingChannels(true)
      const data = await chatAPI.getChannels()
      setChannels(data.channels || [])
      setError('')
    } catch (err) {
      setError('Failed to load channels')
    } finally {
      setIsLoadingChannels(false)
    }
  }

  const loadMessages = async (neoId: string | null) => {
    try {
      setIsLoadingMessages(true)
      const data = await chatAPI.getMessages({ neoId })
      setMessages(data.messages || [])
      setError('')
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setIsLoadingMessages(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setChannels([])
      setIsLoadingChannels(false)
      return
    }

    loadChannels()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([])
      setIsLoadingMessages(false)
      return
    }

    if (!activeChannel) {
      setMessages([])
      return
    }

    let isActive = true

    const fetchMessages = async () => {
      try {
        const data = await chatAPI.getMessages({ neoId: activeChannel.neoId })
        if (isActive) {
          setMessages(data.messages || [])
        }
      } catch (err) {
        if (isActive) {
          setError('Failed to load messages')
        }
      } finally {
        if (isActive) {
          setIsLoadingMessages(false)
        }
      }
    }

    setIsLoadingMessages(true)
    fetchMessages()
    const interval = window.setInterval(fetchMessages, POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(interval)
    }
  }, [activeChannel, isAuthenticated])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async () => {
    if (!activeChannel || !draft.trim()) {
      return
    }

    try {
      setIsSending(true)
      await chatAPI.sendMessage({
        message: draft.trim(),
        neoId: activeChannel.neoId,
      })
      setDraft('')
      await Promise.all([loadMessages(activeChannel.neoId), loadChannels()])
    } catch (err) {
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const currentUserId = storageHelpers.getUserId()

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl" />
        <div className="absolute top-20 left-12 h-28 w-28 rounded-full bg-orange-400/15 blur-2xl" />
      </div>

      <FloatingNavbar
        navLinks={[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/analytics', label: 'Analytics' },
          { href: '/watchlist', label: 'Watchlist' },
          { href: '/community', label: 'Community' },
        ]}
      />

      <div className="relative mt-5 z-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white">Community Comms Hub</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 glass-strong border-cyan-400/20 bg-slate-900/70">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-cyan-200 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingChannels ? (
                <div className="text-sm text-slate-400">Loading channels...</div>
              ) : channels.length === 0 ? (
                <div className="text-sm text-slate-400">No channels yet. Start the first thread.</div>
              ) : (
                channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left transition ${
                      activeChannelId === channel.id
                        ? 'bg-cyan-500/15 text-cyan-100 border border-cyan-400/30'
                        : 'bg-slate-800/40 text-slate-200 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium text-sm">{channel.name}</div>
                        <div className="text-xs text-slate-400">
                          {channel.neoId ? `Asteroid ${channel.neoId}` : 'Global channel'}
                        </div>
                      </div>
                      <Badge className="bg-slate-800/80 text-slate-200 border border-slate-700">
                        {channel.count}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 glass-strong border-emerald-400/20 bg-slate-900/70">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-emerald-200">
                  {activeChannel?.name || 'Channel'}
                </CardTitle>
                {activeChannel?.neoId && (
                  <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
                    Neo {activeChannel.neoId}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[560px]">
              <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                {isLoadingMessages ? (
                  <div className="text-sm text-slate-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-sm text-slate-400">No messages yet. Start the conversation.</div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isSelf = currentUserId && message.userId === currentUserId
                      return (
                        <div
                          key={message.id}
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
                            isSelf
                              ? 'ml-auto bg-cyan-500/20 text-cyan-100 border border-cyan-400/30'
                              : 'bg-slate-800/70 text-slate-100 border border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-300">
                            <span className="font-medium text-slate-200">{message.username}</span>
                            <span>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{message.message}</p>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3">
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Share updates, sightings, or a quick hello..."
                    className="min-h-[100px] resize-none border-0 bg-transparent text-slate-100 placeholder:text-slate-500 focus-visible:ring-0"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span></span>
                    <Button
                      size="sm"
                      disabled={isSending || !draft.trim()}
                      onClick={handleSend}
                      className="bg-cyan-500/90 text-slate-950 hover:bg-cyan-400"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="mt-3 text-sm text-red-300">{error}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
