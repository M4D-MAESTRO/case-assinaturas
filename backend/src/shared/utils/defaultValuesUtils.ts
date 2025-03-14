import { ProvidersEnum } from './../constants/providers.constant';
import { BucketConstantEnum } from "../constants/buckets.constant";

export class DefaultValuesUtils{
    static getDevelopmentProviderAndBucket(){
        return {
            bucket: BucketConstantEnum.DEFAULT,
            provedor: ProvidersEnum.LOCAL,
        }
    }

    static getProductionProviderAndBucket(){
        return {
            bucket: BucketConstantEnum.DEFAULT,
            provedor: ProvidersEnum.AWS,
        }
    }
}