import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import {
  AccompanyingVisitorAgeCategory,
  CreateVisitorDto,
} from './visitor.dto'

const validVisitorPayload = {
  name: 'John Doe',
  phone: '08012345678',
  purpose: 'Dinner visit',
  visit_date: '2099-05-10T14:00:00.000Z',
  total_entries: 2,
}

describe('CreateVisitorDto accompanying visitors', () => {
  it('allows invitations without accompanying visitors', async () => {
    const dto = plainToInstance(CreateVisitorDto, validVisitorPayload)

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('allows mixed adult and child accompanying visitors', async () => {
    const dto = plainToInstance(CreateVisitorDto, {
      ...validVisitorPayload,
      hasAccompanyingVisitor: true,
      accompanyingVisitors: [
        {
          name: 'Adult Guest',
          ageCategory: AccompanyingVisitorAgeCategory.ADULT_10_PLUS,
          phoneNumber: '08011112222',
        },
        {
          name: 'Child Guest',
          ageCategory: AccompanyingVisitorAgeCategory.CHILD_UNDER_10,
        },
      ],
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('requires phone number for adult accompanying visitors', async () => {
    const dto = plainToInstance(CreateVisitorDto, {
      ...validVisitorPayload,
      hasAccompanyingVisitor: true,
      accompanyingVisitors: [
        {
          name: 'Adult Guest',
          ageCategory: AccompanyingVisitorAgeCategory.ADULT_10_PLUS,
        },
      ],
    })

    const errors = await validate(dto)
    const accompanyingVisitorErrors = errors.find(
      (error) => error.property === 'accompanyingVisitors',
    )

    expect(accompanyingVisitorErrors).toBeDefined()
  })

  it('requires at least one guest when hasAccompanyingVisitor is true', async () => {
    const dto = plainToInstance(CreateVisitorDto, {
      ...validVisitorPayload,
      hasAccompanyingVisitor: true,
      accompanyingVisitors: [],
    })

    const errors = await validate(dto)

    expect(errors.some((error) => error.property === 'accompanyingVisitors')).toBe(true)
  })
})
