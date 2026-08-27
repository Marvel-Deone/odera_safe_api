import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class NinVerificationDto {
    @IsString()
    @Length(11, 13)
    @ApiProperty({ example: '63184876213' })
    idNumber!: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    firstname!: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastname!: string;
}