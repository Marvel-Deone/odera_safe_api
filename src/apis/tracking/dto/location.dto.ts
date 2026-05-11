import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString } from "class-validator"

export class UpdateLocationDto {
    @ApiProperty({
        example: 'efff334555555555',
    })
    // @IsString()
    // trackingSessionId!: string

    @IsString()
    token!: string

    @ApiProperty({
        example: 287.000,
        description: 'visitor latitude',
    })
    @IsInt()
    latitude!: number

    @ApiProperty({
        example: 4587.000,
        description: 'visitor longitude',
    })
    @IsInt()
    longitude!: number

    @ApiProperty({
        example: 287,
        description: 'visitor gps accuracy',
    })
    @IsInt()
    accuracy?: number
}