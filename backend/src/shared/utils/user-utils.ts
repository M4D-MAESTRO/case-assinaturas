import { Request } from 'express';
import { AppError } from '../../errors/AppError';

export function getUserId(req: Request) {
    if (!req.user) {
        return undefined;
    }

    const { id } = req.user as any;
    return id;
}

export function getUserIdService(req: Request) {
    if (!req.user) {
        throw new AppError(`Seu usuário não foi encontrado`, 500);
    }

    const { id } = req.user as any;
    return id;
}