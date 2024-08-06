import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInServiceRequest {
  userId: string
  gymId: string
}

interface CheckInResponse {
  checkIn: CheckIn
}

export class CheckInsService {
  constructor(private checkInRepository: CheckInsRepository) { }

  async execute({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInResponse> {
    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
