import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from 'src/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
  ) { }

  getById(id: number, data: any): Observable<any> {
    const dto = {
      data
    }
    const HTTPOptions: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob' as 'json',
    };


    return this.http.post<any>(`${API_CONFIG.baseURL}/relatorio/${id}`, dto, HTTPOptions);
  }
}
