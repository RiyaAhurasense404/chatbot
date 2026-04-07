'use client'

import { Session } from '@/types'
import SessionItem from './SessionItem'
import NewChatButton from './NewChatButton'

import { SidebarProps } from '@/types/client'

export default function Sidebar({
  sessions,
  activeSessionId,
}: SidebarProps) {

  return (
    <div>

      <NewChatButton />

      <div>
        {sessions.length === 0 ? (
          <p>No conversations yet</p>
        ) : (
          sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
            />
          ))
        )}
      </div>

    </div>
  )
}