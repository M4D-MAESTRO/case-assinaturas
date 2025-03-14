import { ProvidersEnum } from './../../../constants/providers.constant';
import { User } from './../../../../modules/users/entities/user.entity';
import { BucketConstantEnum } from './../../../../shared/constants/buckets.constant';


export class CreateArquivoGeralDto {
    file: Express.Multer.File;
    folder: string;
    user: User;
    provedor: ProvidersEnum;
    bucket: BucketConstantEnum;
}

export class DeleteArquivoGeralDto {
    file_name: string;
    folder: string;
    user: User;
    provedor: ProvidersEnum;
    bucket: BucketConstantEnum;
}
