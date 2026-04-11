import { getAllSessions } from '@/lib/db/sessions'
import ChatLayout from '@/components/ChatLayout'

export default async function ChatWithUsPage() {
  const sessions = await getAllSessions()

  return (
    <main className="h-screen overflow-hidden">
      <ChatLayout
        sessions={sessions}
        activeSessionId={undefined}
        initialMessages={[]}
      />
    </main>
  )
}