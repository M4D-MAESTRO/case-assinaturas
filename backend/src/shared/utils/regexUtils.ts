import { ArquivosTipoEnum } from "../constants/arquivos-tipo.constant";


export class RegexUtils {
    static generateRegexValidationForTypes(allowedFileTypes: ArquivosTipoEnum[]) {
        const fileTypesRegex = allowedFileTypes.map(fileType => fileType.toString()).join('|');
        const fileTypesRegexString = `^(${fileTypesRegex})$`;

        return fileTypesRegexString;
    }
}