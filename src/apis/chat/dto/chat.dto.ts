import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SendMessageDto {
    @ApiProperty({
        example: 'This is a message to a specific user.',
    })
    @IsString()
    message!: string
}

export class BroadcastMessageDto {
    @ApiProperty({
        example: 'This is a broadcast message to all users.',
    })
    @IsString()
    message!: string
}