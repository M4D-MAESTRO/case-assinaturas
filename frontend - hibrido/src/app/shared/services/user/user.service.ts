import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/config/api.config';
import { CreateEnderecoDto } from '../../interfaces/enderecos/endereco.dto';
import { PageableDto, PageOptionsDto } from '../../interfaces/others/pageable.dto';
import { CreateUserDto, SearchUserDto, UpdateUserDto, UserDto } from '../../interfaces/users/user.dto';
import { PageUtils } from '../../utils/PageUtils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  findById(user_id): Observable<UserDto> {
    return this.http.get<UserDto>(
      `${API_CONFIG.baseURL}/users/${user_id}`,
      {
        responseType: 'json',
      });
  }

  listUsers(searchUserDto: SearchUserDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<UserDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (searchUserDto && searchUserDto.searchedUser) {
      params = params.append('searchedUser', searchUserDto.searchedUser);
    }

    if (searchUserDto && searchUserDto.status) {
      params = params.append('status', searchUserDto.status);
    }

    if (searchUserDto && searchUserDto.nome) {
      params = params.append('nome', searchUserDto.nome);
    }

    if (searchUserDto && searchUserDto.cpf) {
      params = params.append('cpf', searchUserDto.cpf);
    }

    if (searchUserDto && searchUserDto.email) {
      params = params.append('email', searchUserDto.email);
    }

    if (searchUserDto && searchUserDto.loja_id) {
      params = params.append('loja_id', searchUserDto.loja_id);
    }

    if (searchUserDto && searchUserDto.tipo_usuario) {
      params = params.append('tipo_usuario', searchUserDto.tipo_usuario);
    }

    if (searchUserDto &&
      searchUserDto.load_cliente_nao_identificado == false || searchUserDto.load_cliente_nao_identificado == true) {
      params = params.append('load_cliente_nao_identificado', searchUserDto.load_cliente_nao_identificado);
    }

    return this.http.get<PageableDto<UserDto>>(
      `${API_CONFIG.baseURL}/users`,
      {
        responseType: 'json',
        params,
      });
  }

  createUser(newUser: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${API_CONFIG.baseURL}/users`,
      newUser,
      {
        responseType: 'json',
      });
  }

  updateUser(updatedUser: UpdateUserDto, idUser: string): Observable<UserDto> {
    return this.http.put<UserDto>(
      `${API_CONFIG.baseURL}/users/${idUser}`,
      updatedUser,
      {
        responseType: 'json',
      });
  }

  createEndereco(newEndereco: CreateEnderecoDto, user_id: string): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/users/${user_id}/endereco`,
      newEndereco,
      {
        responseType: 'json',
      });
  }

  updateEndereco(newEndereco: CreateEnderecoDto, user_id: string): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/users/${user_id}/endereco`,
      newEndereco,
      {
        responseType: 'json',
      });
  }

  updatePassword(newPassword: string): Observable<any> {
    return this.http.patch<any>(
      `${API_CONFIG.baseURL}/users/password`,
      { senha: newPassword },
      {
        responseType: 'json',
      });
  }

  uploadAvatar(anexo: File): Observable<UserDto> {
    const formData = new FormData();

    formData.append('file', anexo);

    return this.http.patch<UserDto>(`${API_CONFIG.baseURL}/users/avatar`, formData);
  }
}
