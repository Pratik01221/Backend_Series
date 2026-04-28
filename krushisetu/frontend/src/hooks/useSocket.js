import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

let socketInstance = null

/**
 * useSocket — singleton Socket.IO connection hook
 * Returns the socket instance, connecting once on first use.
 */
export function useSocket() {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!socketInstance) {
      const token = localStorage.getItem('ks_token')
      
      socketInstance = io('/', {
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
      })

      socketInstance.on('connect', () => {
        console.log('🔌 Socket connected:', socketInstance.id)
        setIsConnected(true)
      })

      socketInstance.on('disconnect', () => {
        console.log('🔌 Socket disconnected')
        setIsConnected(false)
      })

      socketInstance.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message)
        setIsConnected(false)
      })

      socketInstance.on('reconnect', (attemptNumber) => {
        console.log('🔌 Socket reconnected after', attemptNumber, 'attempts')
        setIsConnected(true)
      })
    }

    socketRef.current = socketInstance

    return () => {
      // Don't disconnect on unmount — we share one connection
    }
  }, [])

  return { socket: socketRef.current, isConnected }
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
