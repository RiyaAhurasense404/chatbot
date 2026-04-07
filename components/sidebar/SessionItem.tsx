'use client'

import { useRouter } from 'next/navigation'

import { SessionItemProps } from '@/types/client'

export default function SessionItem({
  session,
  isActive,
}: SessionItemProps) {

  const router = useRouter()

  const handleClick = () => {
    router.push(`/chat/${session.id}`)
  }

  const title = session.title ?? 'New conversation'

  return (
    <div
      onClick={handleClick}
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      <p>{title}</p>
    </div>
  )
}