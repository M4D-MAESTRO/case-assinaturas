
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UsersRepository } from '../repositories/implementations/UsersRepository';

@ValidatorConstraint({ name: 'IsUniqueEmail', async: true })
@Injectable()
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: UsersRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const { id } = args.object as any;
        const user = await this.repo.findByEmail(value);

        if (user && user.id !== id) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Já existe um usuário com este e-mail!`;
    }
}

export function IsUniqueEmail(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueEmailConstraint,
        });
    };
}