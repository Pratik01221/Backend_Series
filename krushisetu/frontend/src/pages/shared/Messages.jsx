import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Search, MessageSquare } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { messageAPI } from '../../api/services'
import { useSocket } from '../../hooks/useSocket'
import { useDebounce } from '../../hooks/useDebounce'
import { getRoomId, timeAgo, getInitials } from '../../utils/helpers'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Messages() {
  const { user } = useAuthStore()
  const socket = useSocket()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Load conversation list
  useEffect(() => {
    messageAPI.getList()
      .then(r => setConversations(r.data || []))
      .catch(() => toast.error('Failed to load conversations'))
      .finally(() => setLoadingConvos(false))
  }, [])

  // Load messages + join socket room when a conversation is selected
  useEffect(() => {
    if (!selected || !user) return

    setLoadingMsgs(true)
    const roomId = getRoomId(user._id, selected._id)

    if (socket) socket.emit('join_room', roomId)

    messageAPI.getConversation(selected._id)
      .then(r => {
        setMessages(r.data || [])
        // Mark as read in conversation list
        setConversations(prev =>
          prev.map(c => c.user._id === selected._id ? { ...c, unread: false } : c)
        )
      })
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoadingMsgs(false))
  }, [selected?._id])

  // Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return

    const handler = (msg) => {
      const roomId = getRoomId(user._id, selected?._id || '')
      // If message is for current open conversation
      if (msg.roomId === roomId) {
        setMessages(prev => {
          // avoid duplicates
          if (prev.some(m => m._id === msg._id)) return prev
          return [...prev, msg]
        })
      } else {
        // Update unread badge in sidebar
        setConversations(prev =>
          prev.map(c => {
            const otherId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId
            return c.user._id === otherId ? { ...c, unread: true, lastMessage: msg.message } : c
          })
        )
      }
    }

    socket.on('receive_message', handler)
    return () => socket.off('receive_message', handler)
  }, [socket, selected?._id, user._id])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMsg = useCallback(async (e) => {
    e.preventDefault()
    if (!text.trim() || !selected || sending) return
    setSending(true)
    const optimistic = {
      _id: `temp-${Date.now()}`,
      senderId: { _id: user._id },
      message: text,
      createdAt: new Date().toISOString(),
      roomId: getRoomId(user._id, selected._id),
    }
    setMessages(prev => [...prev, optimistic])
    setText('')
    try {
      await messageAPI.send({ receiverId: selected._id, message: optimistic.message })
    } catch {
      toast.error('Failed to send message')
      setMessages(prev => prev.filter(m => m._id !== optimistic._id))
      setText(optimistic.message)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [text, selected, sending, user._id])

  const filteredConvos = conversations.filter(c =>
    !debouncedSearch ||
    c.user?.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const isMine = (msg) => {
    const sid = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId
    return sid === user._id
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden flex" style={{ height: 'calc(100vh - 220px)', minHeight: 480 }}>

        {/* ── Sidebar ── */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className="input pl-8 text-sm py-2"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="space-y-1 p-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8 px-4 text-center">
                <MessageSquare size={32} className="mb-2 opacity-40" />
                <p className="text-xs">{search ? 'No results' : 'No conversations yet'}</p>
              </div>
            ) : (
              filteredConvos.map(conv => (
                <button
                  key={conv.user._id}
                  onClick={() => setSelected(conv.user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left hover:bg-gray-50 ${
                    selected?._id === conv.user._id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 font-bold text-xs">
                      {getInitials(conv.user.fullName)}
                    </div>
                    {conv.unread && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${conv.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {conv.user.fullName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{conv.lastMessage || '…'}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <MessageSquare size={28} className="opacity-40" />
              </div>
              <p className="text-sm font-medium">Select a conversation to chat</p>
              <p className="text-xs text-gray-300">Messages are end-to-end between farmers and traders</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
                <div className="w-9 h-9 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 font-bold text-sm flex-shrink-0">
                  {getInitials(selected.fullName)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{selected.fullName}</p>
                  <p className="text-xs text-gray-400 capitalize">{selected.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-2 bg-gray-50">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-sm animate-pulse">Loading messages…</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <p className="text-sm">Start the conversation</p>
                    <p className="text-xs">Your messages are private</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => {
                      const mine = isMine(msg)
                      const showTime = i === 0 ||
                        new Date(msg.createdAt) - new Date(messages[i-1]?.createdAt) > 5 * 60 * 1000

                      return (
                        <div key={msg._id}>
                          {showTime && (
                            <div className="text-center my-3">
                              <span className="text-xs text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full">
                                {timeAgo(msg.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              mine
                                ? 'bg-primary-600 text-white rounded-br-sm'
                                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                            } ${msg._id?.startsWith('temp-') ? 'opacity-60' : ''}`}>
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <form onSubmit={sendMsg} className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2 items-end">
                <input
                  ref={inputRef}
                  className="input flex-1 resize-none text-sm"
                  placeholder={`Message ${selected.fullName}…`}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(e) } }}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="btn-primary px-4 py-2.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
