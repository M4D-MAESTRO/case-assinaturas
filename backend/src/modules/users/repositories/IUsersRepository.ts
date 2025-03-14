import { PageOptionsDto } from "../../../shared/dtos/page/page-options.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { FilterUserDto } from "../dto/filter-user.dto";
import { SearchUserDto } from "../dto/search-user.dto";
import { User } from "../entities/user.entity";

interface IUsersRepository {
  createSuperAdmin(data: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByEmailOrCpf(email: string, cpf: string): Promise<User>;
  findById(id: string): Promise<User>;
  listAllUsers(search: SearchUserDto, pageOptionsDto: PageOptionsDto, filter?: FilterUserDto): Promise<[User[], number]>;
  listUsersByRoleName(roleName: string): Promise<User[]>;
  patchCurrentSocket(socket_id: string, user_id: string): Promise<void>;
  findBySocketId(socket_id: string): Promise<User>;
}

export { IUsersRepository };
