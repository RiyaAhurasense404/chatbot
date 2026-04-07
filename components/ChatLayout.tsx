'use client'

import Sidebar from './sidebar/Sidebar'
import ChatWindow from './chat/ChatWindow'
import { ChatLayoutProps } from '@/types/client'

export default function ChatLayout({
  sessions,
  activeSessionId,
  initialMessages = [],
}: ChatLayoutProps) {

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      <div style={{ width: '260px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeSessionId ? (
          <ChatWindow
            sessionId={activeSessionId}
            initialMessages={initialMessages}
          />
        ) : (
          <div>
            <p>Select a conversation or start a new one</p>
          </div>
        )}
      </div>

    </div>
  )
}