
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PerfisRepository } from '../repositories/implementations/PerfisRepository';

@ValidatorConstraint({ name: 'IsUniqueNome', async: true })
@Injectable()
export class IsUniqueNomeConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: PerfisRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const { id } = args.object as any;

        const perfil = await this.repo.findByNome(value);

        if (perfil && perfil.id !== id) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Já existe uma perfil com este nome!`;
    }
}

export function IsUniqueNome(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueNomeConstraint,
        });
    };
}