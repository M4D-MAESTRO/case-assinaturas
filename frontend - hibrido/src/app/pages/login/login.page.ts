/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { Device } from '@capacitor/device';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PreferencesService } from '../../shared/services/preferences/preferences.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { changeBaseURL } from 'src/config/api.config';
import { CredenciaisDto } from 'src/app/shared/interfaces/authentication/credencias.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  credenciais: CredenciaisDto = {
    username: 'super-admin@dominio.com',
    password: '123',
  };
  features: any[] = [];

  private subscriptions = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly menu: MenuController,
    private readonly auth: AuthService,
    private readonly preferencesService: PreferencesService,
    private readonly themeService: ThemeService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    document.body.setAttribute('color-theme', 'light');
    this.themeService.switchTheme('saga-blue');
    this.menu.close();

    this.features = [
      { title: 'Gestão', image: 'assets/imgs/login/gestao.jpg', text: 'Gerencie seus colaboradores, recursos, produtos, serviços, pedidos e por ai vai.' },
      { title: 'Operação', image: 'assets/imgs/login/operacao.jpg', text: 'Realiza a operação de sua empresa, seja venda, prestação de serviços ou mesmo assinaturas.' },
      { title: 'Infinitas possibilidades', image: 'assets/imgs/login/infinito.jpg', text: 'Adquira toda sabedoria necessária por meio de dashboards e dados na tomada de decisão, sem achismos!' }
    ];

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ionViewWillEnter() {
    document.body.setAttribute('color-theme', 'light');
    this.themeService.switchTheme('saga-blue');
    this.menu.close();
    this.menu.enable(false);
  }

  ionViewDidEnter() {
    try {
      const sub = this.auth.refreshToken()
        .subscribe(async (response) => {
          await this.auth.loginSucesso(response);
          this.router.navigateByUrl('home');
        }, error => {
          this.menu.enable(true);
          this.menu.close();
          this.menu.enable(false);
          this.auth.logout();
        });
      this.subscriptions.add(sub);
    } catch (e) {
      this.menu.enable(true);
      this.menu.close();
      this.menu.enable(false);
    }
  }

  ionViewWillLeave() {
    const theme = this.preferencesService.getThemePreference();
    document.body.setAttribute('color-theme', theme);
    if (theme === 'dark') {
      const themeName = this.preferencesService.getThemeName() || 'arya-blue';
      this.preferencesService.setThemePreference('dark', themeName);
      this.themeService.switchTheme(themeName);
    } else {
      const themeName = this.preferencesService.getThemeName() || 'saga-blue';
      this.preferencesService.setThemePreference('light', themeName);
      this.themeService.switchTheme(themeName);
    }

    this.menu.enable(true);
  }

  async login() {
    if (this.controlLoginButton()) {
      return;
    }

    if (this.credenciais.username.trim().toUpperCase().includes('URL:')) {
      this.forceNewUrl();
      return;
    }

    const { uuid } = await Device.getId();
    //this.credenciais.current_machine_id = uuid;

    const sub = this.auth.authenticate(this.credenciais).subscribe(async (response) => {
      await this.auth.loginSucesso(response);
      const url =
        this.activatedRoute.snapshot.queryParamMap.get('redirect') ||
        'home';
      this.router.navigateByUrl(url);
    },
      error => { });

    this.subscriptions.add(sub);
  }

  async goToRequestReset() {
    this.router.navigateByUrl('password-reset');
  }

  setFocus(nextElement) {
    nextElement.setFocus();
  }

  controlLoginButton(): boolean {
    if (this.credenciais.username && this.credenciais.username) {
      return false;
    }
    return true;
  }

  private forceNewUrl() {
    const { username } = this.credenciais;
    const newUrl = username.trim().toUpperCase().split('URL:').pop().trim();
    changeBaseURL(newUrl);
  }

}
