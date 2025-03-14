import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from 'src/config/api.config';
import { PageableDto, PageOptionsDto } from '../../interfaces/others/pageable.dto';
import { PerfilDto } from '../../interfaces/perfis/perfil.dto';
import { PageUtils } from '../../utils/PageUtils';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
    private http: HttpClient,
  ) { }

  list(pageOptions = new PageOptionsDto()): Observable<PageableDto<PerfilDto>> {
    const params = PageUtils.getPageOptionsParams(pageOptions);
    return this.http.get<PageableDto<PerfilDto>>(`${API_CONFIG.baseURL}/perfis`, {
      responseType: 'json',
      params,
    });
  }
}
