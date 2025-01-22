import { Either, left, right } from '@/core/either'

import { NotificationsRepository } from '../repositories/notifications-repository'
import { NotAllowedError } from '@/domain/forum/application/services/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/forum/application/services/errors/resource-not-found-error'
import { Notification } from '../../enterprise/entities/notifications'

interface ReadNotificationServiceRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationService {
  constructor(private notificationsRepository: NotificationsRepository) { }

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationServiceRequest): Promise<ReadNotificationServiceResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
