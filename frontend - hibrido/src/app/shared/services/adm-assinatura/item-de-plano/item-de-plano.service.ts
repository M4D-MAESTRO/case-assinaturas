import { CreateItemDePlanoDto, ItemDePlanoDto, SearchItemDePlanoDto, UpdateItemDePlanoDto } from './../../../interfaces/adm-assinatura/item-de-plano/item-de-plano.dto';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ItemDePlanoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  list(filterDto?: SearchItemDePlanoDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<ItemDePlanoDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto && filterDto.nome) {
      params = params.append('nome', filterDto.nome);
    }

    if (filterDto && filterDto.descricao) {
      params = params.append('descricao', filterDto.descricao);
    }

    if (filterDto && filterDto.searchedItem) {
      params = params.append('searchedItem', filterDto.searchedItem);
    }

    if (filterDto && filterDto.created_at) {
      params = params.append('created_at', filterDto.created_at.toDateString());
    }

    return this.http.get<PageableDto<ItemDePlanoDto>>(`${API_CONFIG.baseURL}/item-de-planos`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<ItemDePlanoDto> {
    return this.http.get<ItemDePlanoDto>(`${API_CONFIG.baseURL}/item-de-planos/${id}`, {
      responseType: 'json',
    });
  }

  create(dto: CreateItemDePlanoDto): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/item-de-planos`,
      dto,
      {
        responseType: 'json',
      });
  }

  update(id: string, dto: UpdateItemDePlanoDto): Observable<ItemDePlanoDto> {
    return this.http.put<ItemDePlanoDto>(
      `${API_CONFIG.baseURL}/item-de-planos/${id}`,
      dto,
      {
        responseType: 'json',
      });
  }

}
