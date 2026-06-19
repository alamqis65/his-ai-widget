import { ChatLayout } from '@/components/chat/ChatLayout'
import type { SDKCallbacks } from '@/types'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultChat'>
}

export function ChatFeature({ callbacks }: Props) {
  return <ChatLayout callbacks={callbacks} />
}
