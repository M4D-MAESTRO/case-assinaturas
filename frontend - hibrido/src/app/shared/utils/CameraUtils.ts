

import { Platform } from '@ionic/angular';
import { Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';

class CameraUtils {

    static async readAsBase64(photo: Photo, platform: Platform) {
        if (platform.is('hybrid')) {
            console.log('photo');
            console.log(photo);
            const file = await Filesystem.readFile({
                path: photo.path
            });
            console.log('file');
            console.log(file);
            return file.data;
        } else {
            console.log('entrou no ELSE')
            const response = await fetch(photo.webPath);
            const blob = await response.blob();

            return await this.convertBlobToBase64(blob) as string;
        }
    }

    private static convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

}

export { CameraUtils };