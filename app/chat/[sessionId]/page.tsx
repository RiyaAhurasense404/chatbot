import { getAllSessions, getSessionById } from '@/lib/db/sessions'
import { getMessagesBySessionId } from '@/lib/db/messages'
import ChatLayout from '@/components/ChatLayout'
import { notFound } from 'next/navigation'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const resolvedParams = await params
  const sessionId = resolvedParams.sessionId

  console.log('sessionId:', sessionId)

  if (!sessionId || sessionId === 'undefined') {
    notFound()
  }

  const session = await getSessionById(sessionId)

  if (!session) {
    notFound()
  }

  const [sessions, messages] = await Promise.all([
    getAllSessions(),
    getMessagesBySessionId(sessionId),
  ])

  return (
    <ChatLayout
      sessions={sessions}
      activeSessionId={sessionId}
      initialMessages={messages}
    />
  )
}
