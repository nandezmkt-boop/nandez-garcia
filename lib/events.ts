import { prisma } from '@/lib/prisma'
import { EventType } from './generated/prisma/enums'

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export type CreateEventParams = {
  type: EventType
  entity?: string
  entityId?: string
  payload?: { [key: string]: JsonValue }
}

export async function createEvent(params: CreateEventParams): Promise<void> {
  try {
    await prisma.event.create({
      data: {
        type: params.type,
        entity: params.entity,
        entityId: params.entityId,
        payload: params.payload,
      },
    })
    // Future extension points:
    //   triggerWebhooks(params)
    //   pushToQueue(params)
    //   sendToExternalLogger(params)
  } catch (err) {
    // Non-blocking: event tracking must never interrupt the main flow
    console.error('[events] Failed to persist event:', params.type, err)
  }
}

export { EventType } from './generated/prisma/enums'
