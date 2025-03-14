
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as mime from 'mime';
import { ProvidersEnum } from '../constants/providers.constant';
import { BucketConstantEnum } from '../constants/buckets.constant';

export function getFileUrl(
    fileName: string,
    folder: string,
    bucket = BucketConstantEnum.DEFAULT,
    provedor = ProvidersEnum.LOCAL
): string {
    const newFolder = folder.trim().replace(/[^a-zA-Z0-9./-]/g, '')
    const newFileName = fileName.trim().replace(/[^a-zA-Z0-9./]/g, '');

    switch (provedor) {
        case ProvidersEnum.LOCAL:
            return `http://${process.env.SYSTEM_URL}:${process.env.PORT}/${newFolder}/${newFileName}`;

        case ProvidersEnum.AWS:
            return `${bucket}/${newFolder}/${newFileName}`;

        case ProvidersEnum.AZURE:
            return `${bucket}/${newFolder}/${newFileName}`;

        default:
            return null;
    }
}


export function diskStorageConfig(destination: string) {
    diskStorage({
        destination,
        filename: (req, file, cb) => {
            const extension = mime.getExtension(file.mimetype);
            return cb(null, `${Date.now()}${extname(file.originalname)}.${extension}`);
        }
    });
}