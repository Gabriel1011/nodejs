import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static build(props: InstructorProps, id?: UniqueEntityID) {
    const question = new Instructor(props, id)
    return question
  }
}
