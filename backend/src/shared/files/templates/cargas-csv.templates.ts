import { ExcelUtils } from "../../../shared/utils/excelUtils";


export class CargasCSVTemplates {

    static async cargaProduto() {
        const [reportName, workbook] = ExcelUtils.startCsv('Template - Carga de Produtos');
        const sheet = workbook.addWorksheet('template', { properties: { tabColor: { argb: 'FFC0000' } } });
        ExcelUtils.cleanExcel(sheet);
        const sheetColumns = [
            {
                header: 'nome',
                key: 'nome'.toUpperCase(),
            },
            {
                header: 'descricao',
                key: 'descricao'.toUpperCase(),
            },
            {
                header: 'preco_compra',
                key: 'preco_compra'.toUpperCase(),
            },
            {
                header: 'preco_venda',
                key: 'preco_venda'.toUpperCase(),
            },
        ]
        sheet.columns = sheetColumns;

        const file = await workbook.csv.writeBuffer();
        const result = {
            file,
            reportName,
        }

        return result;
    }

    static async cargaEstoque() {
        const [reportName, workbook] = ExcelUtils.startCsv('Template - Carga de Estoque');
        const sheet = workbook.addWorksheet('template', { properties: { tabColor: { argb: 'FFC0000' } } });
        ExcelUtils.cleanExcel(sheet);
        const sheetColumns = [
            {
                header: 'loja',
                key: 'loja'.toUpperCase(),
            },
            {
                header: 'produto',
                key: 'produto'.toUpperCase(),
            },
            {
                header: 'quantidade',
                key: 'quantidade'.toUpperCase(),
            },
        ]
        sheet.columns = sheetColumns;

        const file = await workbook.csv.writeBuffer();
        const result = {
            file,
            reportName,
        }

        return result;
    }
}