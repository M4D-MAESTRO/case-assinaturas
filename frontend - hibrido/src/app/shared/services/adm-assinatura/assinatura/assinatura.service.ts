

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';
import { AssinaturaDto } from './../../../../shared/interfaces/adm-assinatura/assinatura/assinatura.dto';
import { CreateAssinaturaDto, SearchAssinaturaDto, UpdateAssinaturaDto } from './../../../interfaces/adm-assinatura/assinatura/assinatura.dto';

@Injectable({
  providedIn: 'root'
})
export class AssinaturaService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  list(filterDto?: SearchAssinaturaDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<AssinaturaDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto && filterDto.assinante_id) {
      params = params.append('assinante_id', filterDto.assinante_id);
    }

    if (filterDto && filterDto.modalidade) {
      params = params.append('modalidade', filterDto.modalidade);
    }

    if (filterDto && filterDto.status) {
      params = params.append('status', filterDto.status);
    }

    if (filterDto && filterDto.searchedAssinatura) {
      params = params.append('searchedAssinatura', filterDto.searchedAssinatura);
    }

    if (filterDto && filterDto.plano_assinatura_id) {
      params = params.append('plano_assinatura_id', filterDto.plano_assinatura_id);
    }

    if (filterDto && filterDto.searchedAssinante) {
      params = params.append('searchedAssinante', filterDto.searchedAssinante);
    }

    if (filterDto && filterDto.searchedPlano) {
      params = params.append('searchedPlano', filterDto.searchedPlano);
    }

    if (filterDto && filterDto.created_at) {
      params = params.append('created_at', filterDto.created_at.toDateString());
    }

    return this.http.get<PageableDto<AssinaturaDto>>(`${API_CONFIG.baseURL}/assinaturas`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<AssinaturaDto> {
    return this.http.get<AssinaturaDto>(`${API_CONFIG.baseURL}/assinaturas/${id}`, {
      responseType: 'json',
    });
  }

  create(dto: CreateAssinaturaDto): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/assinaturas`,
      dto,
      {
        responseType: 'json',
      });
  }

  update(id: string, dto: UpdateAssinaturaDto): Observable<AssinaturaDto> {
    return this.http.put<AssinaturaDto>(
      `${API_CONFIG.baseURL}/assinaturas/${id}`,
      dto,
      {
        responseType: 'json',
      });
  }


  startById(id: string): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseURL}/assinaturas/${id}/ativo`, {
      responseType: 'json',
    });
  }
  cancelById(id: string): Observable<any> {
    return this.http.delete<any>(`${API_CONFIG.baseURL}/assinaturas/${id}`, {
      responseType: 'json',
    });
  }

  pendenteById(id: string): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseURL}/assinaturas/${id}/pendente`, {
      responseType: 'json',
    });
  }
  pausadaById(id: string): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseURL}/assinaturas/${id}/pausada`, {
      responseType: 'json',
    });
  }

}
