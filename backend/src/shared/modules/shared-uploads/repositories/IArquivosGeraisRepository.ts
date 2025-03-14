import { ArquivoGeral } from "../entities/arquivo-geral.entity";



export interface IArquivosGeraisRepository {
  findById(id: string): Promise<ArquivoGeral>
}