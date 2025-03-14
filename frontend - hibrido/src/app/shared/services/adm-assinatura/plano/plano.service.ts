
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';

import { CreatePlanoDto, PlanoDto, SearchPlanoDto, UpdatePlanoDto } from './../../../interfaces/adm-assinatura/plano/plano.dto';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  list(filterDto?: SearchPlanoDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<PlanoDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto && filterDto.nome) {
      params = params.append('nome', filterDto.nome);
    }

    if (filterDto && filterDto.descricao) {
      params = params.append('descricao', filterDto.descricao);
    }

    if (filterDto && filterDto.searchedPlano) {
      params = params.append('searchedPlano', filterDto.searchedPlano);
    }

    if (filterDto && filterDto.created_at) {
      params = params.append('created_at', filterDto.created_at.toDateString());
    }

    return this.http.get<PageableDto<PlanoDto>>(`${API_CONFIG.baseURL}/planos`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<PlanoDto> {
    return this.http.get<PlanoDto>(`${API_CONFIG.baseURL}/planos/${id}`, {
      responseType: 'json',
    });
  }

  create(dto: CreatePlanoDto): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/planos`,
      dto,
      {
        responseType: 'json',
      });
  }

  update(id: string, dto: UpdatePlanoDto): Observable<PlanoDto> {
    return this.http.put<PlanoDto>(
      `${API_CONFIG.baseURL}/planos/${id}`,
      dto,
      {
        responseType: 'json',
      });
  }
  
}
