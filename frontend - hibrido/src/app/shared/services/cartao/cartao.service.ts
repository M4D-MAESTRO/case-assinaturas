import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/config/api.config';
//import { CartaoDTO } from '../../interfaces/cartoes/cartao.dto';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {

  constructor(
    private http: HttpClient,
  ) { }
/*
  list(): Observable<CartaoDTO[]> {
    return this.http.get<CartaoDTO[]>(`${API_CONFIG.baseURL}/cartao`, {
      responseType: 'json',
    });
  }*/
}
