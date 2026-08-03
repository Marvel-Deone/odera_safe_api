import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { ResidentAssociateCategory, Weekday } from '@prisma/client'
import { CreateResidentAssociateDto } from './resident-associate.dto'

const validPayload = {
  fullName: 'Jane Doe',
  phoneNumber: '08012345678',
  idType: 'NIN',
  idNumber: '63184876213',
  faceCapture: 'https://example.com/face.jpg',
  workingDays: [Weekday.MONDAY, Weekday.TUESDAY],
  entryTime: '06:00',
  exitTime: '19:00',
}

describe('CreateResidentAssociateDto', () => {
  it('accepts default co-resident payload without category', async () => {
    const dto = plainToInstance(CreateResidentAssociateDto, validPayload)

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('accepts staff category', async () => {
    const dto = plainToInstance(CreateResidentAssociateDto, {
      ...validPayload,
      category: ResidentAssociateCategory.STAFF,
      role: 'Nanny',
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('requires at least one working day', async () => {
    const dto = plainToInstance(CreateResidentAssociateDto, {
      ...validPayload,
      workingDays: [],
    })

    const errors = await validate(dto)

    expect(errors.some((error) => error.property === 'workingDays')).toBe(true)
  })

  it('requires HH:mm time format', async () => {
    const dto = plainToInstance(CreateResidentAssociateDto, {
      ...validPayload,
      entryTime: '6 AM',
    })

    const errors = await validate(dto)

    expect(errors.some((error) => error.property === 'entryTime')).toBe(true)
  })
})
