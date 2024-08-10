import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DateTime } from 'luxon'
import { LateCheckInValidationError } from './errors/late-check-in-error'

interface ValidateCheckInServiceRequest {
  checkInId: string
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) { }
  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    const distanceInMinutesFromCheckInCreation = DateTime.fromJSDate(
      new Date(),
    ).diff(DateTime.fromJSDate(checkIn.created_at), 'minutes')

    if (distanceInMinutesFromCheckInCreation.minutes > 20) {
      throw new LateCheckInValidationError()
    }
    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)
    return { checkIn }
  }
}
