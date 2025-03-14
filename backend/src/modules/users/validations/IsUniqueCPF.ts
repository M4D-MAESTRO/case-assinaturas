
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UsersRepository } from '../repositories/implementations/UsersRepository';

@ValidatorConstraint({ name: 'IsUniqueCPF', async: true })
@Injectable()
export class IsUniqueCPFConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: UsersRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const { id } = args.object as any;
        const user = await this.repo.findByCpf(value);

        if (user && user.id !== id) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Já existe um usuário com este CPF!`;
    }
}

export function IsUniqueCPF(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueCPFConstraint,
        });
    };
}