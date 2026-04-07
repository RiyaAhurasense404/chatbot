import { getAllSessions } from '@/lib/db/sessions'
import ChatLayout from '@/components/ChatLayout'

export default async function ChatPage() {
  const sessions = await getAllSessions()

  return (
    <ChatLayout
      sessions={sessions}
      activeSessionId={undefined}
      initialMessages={[]}
    />
  )
}