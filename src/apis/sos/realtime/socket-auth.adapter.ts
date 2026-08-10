import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { ServerOptions, Socket } from 'socket.io';
import { PrismaService } from '../../../database/prisma/prisma.service';

export class SocketAuthAdapter extends IoAdapter {
    private readonly jwtService: JwtService;
    private readonly prisma: PrismaService;

    constructor(app: INestApplicationContext) {
        super(app);
        this.jwtService = app.get(JwtService);
        this.prisma = app.get(PrismaService);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, options);

        server.use(async (socket: Socket, next: (error?: Error) => void) => {
            try {
                const token = this.extractToken(socket);
                const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
                const user = await this.prisma.user.findUnique({
                    where: { id: payload.sub },
                    select: { id: true, estateId: true, role: true },
                });
                if (!user) throw new UnauthorizedException('User not found');
                socket.data.user = user;
                next();
            } catch (err) {
                console.error("Socket auth error:", err);
                next(new Error("Unauthorized socket connection"));
            }
        });

        return server;
    }

    private extractToken(socket: Socket): string {
        const authToken = socket.handshake.auth?.token as string | undefined;
        const header = socket.handshake.headers.authorization;
        const token = authToken ?? header?.replace(/^Bearer\s+/i, '');
        if (!token) throw new UnauthorizedException('Missing socket token');
        return token;
    }
}
