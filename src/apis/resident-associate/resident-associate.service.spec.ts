import { HttpException } from '@nestjs/common'
import { ResidentAssociateCategory, Weekday } from '@prisma/client'
import { of } from 'rxjs'
import { ResidentAssociateService } from './resident-associate.service'

const payload = {
  fullName: 'Jane Doe',
  phoneNumber: '08012345678',
  role: undefined,
  idType: 'VOTER_CARD',
  idNumber: 'VC123456',
  faceCapture: undefined,
  workingDays: [Weekday.MONDAY],
  entryTime: '08:00',
  exitTime: '18:00',
}

describe('ResidentAssociateService', () => {
  const resident = { id: 'resident-id' }
  const env = process.env
  let prisma: any
  let http: any
  let service: ResidentAssociateService

  beforeEach(() => {
    process.env = { ...env }
    prisma = {
      resident: {
        findFirst: jest.fn().mockResolvedValue(resident),
      },
      residentAssociate: {
        create: jest.fn().mockResolvedValue({ id: 'associate-id' }),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    }

    http = {
      post: jest.fn(),
    }

    service = new ResidentAssociateService(prisma, http)
  })

  afterAll(() => {
    process.env = env
  })

  it('creates a co-resident by default', async () => {
    await service.create('user-id', payload)

    expect(prisma.residentAssociate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        category: ResidentAssociateCategory.CO_RESIDENT,
        role: 'Co-resident',
        resident: { connect: { id: resident.id } },
      }),
    })
  })

  it('rejects invalid time ranges', async () => {
    await expect(
      service.create('user-id', {
        ...payload,
        entryTime: '18:00',
        exitTime: '08:00',
      }),
    ).rejects.toBeInstanceOf(HttpException)
  })

  it('requires face capture before NIN verification', async () => {
    await expect(
      service.create('user-id', {
        ...payload,
        idType: 'NIN',
        idNumber: '63184876213',
      }),
    ).rejects.toBeInstanceOf(HttpException)

    expect(prisma.residentAssociate.create).not.toHaveBeenCalled()
  })

  it('verifies NIN before creating the associate', async () => {
    process.env.QORE_ID_BASE_URL = 'https://qoreid.example'
    process.env.QORE_ID_CLIENT_ID = 'client-id'
    process.env.QORE_ID_SECRET_KEY = 'secret'
    service = new ResidentAssociateService(prisma, http)

    http.post
      .mockReturnValueOnce(of({ data: { accessToken: 'token' } }))
      .mockReturnValueOnce(of({ data: { face_verification: { match: true } } }))

    await service.create('user-id', {
      ...payload,
      idType: 'NIN',
      idNumber: '63184876213',
      faceCapture: 'https://example.com/face.jpg',
    })

    expect(http.post).toHaveBeenCalledTimes(2)
    expect(prisma.residentAssociate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ninVerificationStatus: 'VERIFIED',
        ninVerificationData: { face_verification: { match: true } },
      }),
    })
  })
})
