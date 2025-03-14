import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { validate } from "uuid";
import { AppError } from "../../../errors/AppError";


export class UpdateResourceValidationPipe implements PipeTransform {
    transform(value, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {

            if (!validate(value)) {
                throw new AppError('O parâmetro deve ser um UUID!');
            }

            return value;
        } else {
            return value;
        }
    }
}