

import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UsersRepository } from '../repositories/implementations/UsersRepository';
import { Role } from '../../../shared/authorizations/enums/role.enum';

@ValidatorConstraint({ name: 'IsFuncionario', async: true })
@Injectable()
export class IsFuncionarioConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: UsersRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const user = await this.repo.findById(value);

        if (user && user.perfil && user.perfil.nome != Role.CLIENTE) {
            return true;
        }
        return false;
    }

    defaultMessage(args: ValidationArguments) {
        console.log(args);
        return `Este usuário não é um funcionário!`;
    }
}

export function IsFuncionario(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsFuncionarioConstraint,
        });
    };
}