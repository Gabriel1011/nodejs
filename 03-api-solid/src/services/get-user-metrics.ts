import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsServiceRequest {
  userId: string
}

interface GetUserMetricsResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
