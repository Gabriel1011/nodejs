import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface SearchGymsRequest {
  query: string
  page: number
}

interface SearchGymsResponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymRepository: GymsRepository) { }

  async execute({
    query,
    page,
  }: SearchGymsRequest): Promise<SearchGymsResponse> {
    const gyms = await this.gymRepository.search(query, page)

    return { gyms }
  }
}
