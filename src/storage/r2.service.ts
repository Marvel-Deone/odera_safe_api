import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2Service {
    private readonly client: S3Client;
    private readonly bucket: string;

    constructor() {
        this.bucket = process.env.R2_BUCKET_NAME!;

        this.client = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
        });
    }

    async upload(
        key: string,
        buffer: Buffer,
        contentType: string,
    ) {
        try {
            await this.client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: contentType,
                }),
            );

            return {
                key,
            };
        } catch (error) {
            console.error('R2 upload error:', error);

            throw new InternalServerErrorException(
                'Failed to upload file',
            );
        }
    }

    async delete(key: string) {
        try {
            await this.client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                }),
            );
        } catch (error) {
            console.error('R2 delete error:', error);
        }
    }

    async getSignedUrl(
        key: string,
        expiresIn = 300,
    ): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            return await getSignedUrl(
                this.client,
                command,
                { expiresIn },
            );
        } catch (error) {
            console.error('R2 signed URL error:', error);

            throw new InternalServerErrorException(
                'Failed to generate image URL',
            );
        }
    }
}