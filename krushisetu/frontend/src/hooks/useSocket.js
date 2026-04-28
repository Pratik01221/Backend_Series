import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

let socketInstance = null

/**
 * useSocket — singleton Socket.IO connection hook
 * Returns the socket instance, connecting once on first use.
 */
export function useSocket() {
  const socketRef = useRef(null)

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io('/', {
        auth: { token: localStorage.getItem('ks_token') },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socketInstance.on('connect', () => {
        console.log('🔌 Socket connected:', socketInstance.id)
      })
      socketInstance.on('disconnect', () => {
        console.log('🔌 Socket disconnected')
      })
      socketInstance.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message)
      })
    }

    socketRef.current = socketInstance

    return () => {
      // Don't disconnect on unmount — we share one connection
    }
  }, [])

  return socketRef.current
}

/**
 * Disconnect the socket entirely (call on logout)
 */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }
}
