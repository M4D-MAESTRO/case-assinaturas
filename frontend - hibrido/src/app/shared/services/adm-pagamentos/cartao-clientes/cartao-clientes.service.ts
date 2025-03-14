import { CartaoClienteDto, CreateCartaoClienteDto, SearchCartaoClienteDto } from './../../../interfaces/adm-pagamentos/cartao-clientes/cartao-cliente.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CartaoClientesService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  //CONTINUE

  list(filterDto?: SearchCartaoClienteDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<CartaoClienteDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto && filterDto.cliente_id) {
      params = params.append('cliente_id', filterDto.cliente_id);
    }

    if (filterDto && filterDto.status) {
      params = params.append('status', filterDto.status);
    }

    if (filterDto && filterDto.tipo) {
      params = params.append('tipo', filterDto.tipo);
    }

    if (filterDto && filterDto.user_registrou_id) {
      params = params.append('user_registrou_id', filterDto.user_registrou_id);
    }

    return this.http.get<PageableDto<CartaoClienteDto>>(`${API_CONFIG.baseURL}/cartao-clientes`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<CartaoClienteDto> {
    return this.http.get<CartaoClienteDto>(`${API_CONFIG.baseURL}/cartao-clientes/${id}`, {
      responseType: 'json',
    });
  }
  //CreateCartaoCLienteDto
  create(dto: CreateCartaoClienteDto): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/cartao-clientes`,
      dto,
      {
        responseType: 'json',
      });
  }



}
