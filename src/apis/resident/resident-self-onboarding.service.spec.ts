import { Test, TestingModule } from '@nestjs/testing'
import { ResidentSelfOnboardingService } from './resident-self-onboarding.service'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ResidentWhatsappService } from './resident-whatsapp.service'
import { ResidentEmailService } from './resident-email.service'

describe('ResidentSelfOnboardingService', () => {
  let service: ResidentSelfOnboardingService
  let prisma: any
  let whatsappService: any
  let emailService: any

  beforeEach(async () => {
    prisma = {
      estate: {
        findFirst: jest.fn(),
      },
      residentSelfOnboarding: {
        findUnique: jest.fn(),
      },
      activityLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    }

    whatsappService = {
      sendOnboardingActivationMessage: jest.fn(),
    }

    emailService = {
      sendOnboardingActivationEmail: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidentSelfOnboardingService,
        { provide: PrismaService, useValue: prisma },
        { provide: ResidentWhatsappService, useValue: whatsappService },
        { provide: ResidentEmailService, useValue: emailService },
      ],
    }).compile()

    service = module.get<ResidentSelfOnboardingService>(ResidentSelfOnboardingService)
  })

  it('sends the onboarding activation email to the supplied email address', async () => {
    prisma.estate.findFirst.mockResolvedValue({ id: 'estate-id' })
    prisma.residentSelfOnboarding.findUnique.mockResolvedValue(null)

    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        residentSelfOnboarding: {
          create: jest.fn().mockResolvedValue({
            id: 'onboarding-id',
            fullName: 'Jane Doe',
            houseNumber: 'A1',
            residentAddress: 'Block A',
            whatsappPhone: '+2348012345678',
            status: 'PENDING',
            activationCodeExpiresAt: new Date(),
            createdAt: new Date(),
          }),
        },
        activityLog: {
          create: jest.fn().mockResolvedValue({}),
        },
      }

      return callback(tx)
    })

    whatsappService.sendOnboardingActivationMessage.mockResolvedValue({
      accepted: true,
      status: 'ACCEPTED',
    })
    emailService.sendOnboardingActivationEmail.mockResolvedValue({
      accepted: true,
      status: 'SENT',
    })

    const dto = {
      fullName: 'Jane Doe',
      houseNumber: 'A1',
      residentAddress: 'Block A',
      whatsappPhone: '08012345678',
      email: 'jane@example.com',
    }

    await service.register(dto as any)

    expect(emailService.sendOnboardingActivationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        toEmail: dto.email,
        houseNumber: dto.houseNumber,
        activationCode: expect.any(String),
      }),
    )
  })
})
