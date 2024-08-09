import { CheckIn, Gym } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-instance-between-coordinates'
import { MaxNumberOfCheckInsError } from './errors/max-numbe-off-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInResponse {
  checkIn: CheckIn
}

export class CheckInsService {
  constructor(
    private checkInRepository: CheckInsRepository,
    private gymsRepositoy: GymsRepository,
  ) { }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInResponse> {
    const gym = await this.gymsRepositoy.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    this.checkDistanceFromGym(userLatitude, userLongitude, gym)

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }

  private checkDistanceFromGym(
    userLatitude: number,
    userLongitude: number,
    gym: Gym,
  ) {
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }
  }
}
