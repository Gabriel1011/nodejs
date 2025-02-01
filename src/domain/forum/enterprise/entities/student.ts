import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  static build(props: StudentProps, id?: UniqueEntityID) {
    const question = new Student(props, id)
    return question
  }
}
