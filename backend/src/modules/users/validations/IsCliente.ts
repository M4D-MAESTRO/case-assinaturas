
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UsersRepository } from '../repositories/implementations/UsersRepository';
import { Role } from './../../../shared/authorizations/enums/role.enum';

@ValidatorConstraint({ name: 'IsCliente', async: true })
@Injectable()
export class IsClienteConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: UsersRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const user = await this.repo.findById(value);

        if (user && user.perfil && user.perfil.nome == Role.CLIENTE) {
            return true;
        }
        return false;
    }

    defaultMessage(args: ValidationArguments) {
        console.log(args);
        return `Este usuário não é um cliente`;
    }
}

export function IsCliente(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsClienteConstraint,
        });
    };
}