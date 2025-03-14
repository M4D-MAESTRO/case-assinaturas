import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/config/api.config';
import { StorageService } from './storage.service';
import { PreferencesService } from '../preferences/preferences.service';
import { StartSocketService } from '../../webSocket/start/start-socket.service';
import { CredenciaisDto } from '../../interfaces/authentication/credencias.dto';
import { LocalUserDto, SuccessLoginDto } from '../../interfaces/authentication/local-user.dto';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
    private readonly preferencesService: PreferencesService,
    private readonly startSocketService: StartSocketService,
    private readonly userService: UserService,
  ) { }


  authenticate(credenciais: CredenciaisDto): Observable<SuccessLoginDto> {
    return this.http.post<SuccessLoginDto>(`${API_CONFIG.baseURL}/auth/login`, credenciais, {
      responseType: 'json',
    });
  }

  refreshToken(): Observable<any> {
    try {
      const token = {
        token: this.storage.getLocalUser().refresh_token
      };

      return this.http.post<any>(
        `${API_CONFIG.baseURL}/auth/refresh`,
        token,
        {
          responseType: 'json',
        }
      );
    } catch (e) {
    }
  }

  async loginSucesso(loginDto: SuccessLoginDto) {
    //email, perfil_id, perfil_nome, avatar, id, nome
    const { email, perfil_id, perfil_nome, avatar, id, nome } = jwt_decode(loginDto.token) as any;

    const localUser: LocalUserDto = {
      email, perfil_id, perfil_nome, avatar, id, nome,
      refresh_token: loginDto.refresh_token
    }
    this.storage.setLocalUser(localUser);

    const data = await this.userService.findById(id).toPromise();
    this.storage.setCompleteLocalUser(data);

    this.startSocketService.emitNewConnection(id);
  }

  logout() {
    //this.preferencesService.setThemePreference('light');
    this.storage.setLocalUser(null);
    this.storage.setCompleteLocalUser(null);
  }
}
