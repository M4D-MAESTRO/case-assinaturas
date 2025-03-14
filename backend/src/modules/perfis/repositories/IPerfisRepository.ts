import { PageOptionsDto } from "src/shared/dtos/page/page-options.dto";
import { Perfil } from "../entities/perfil.entity";


interface IPerfisRepository {
  findByNome(nome: string): Promise<Perfil>;
  findById(id: string): Promise<Perfil>;
  list(pageOptionsDto: PageOptionsDto): Promise<[Perfil[], number]>;
  getAllAuthorizationsByUser(user_id: string): Promise<[string, string]>;
}

export { IPerfisRepository };
