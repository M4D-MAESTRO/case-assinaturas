import { Injectable, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Alert } from '../../interfaces/others/alert.dto';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnDestroy {

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscriptions = new Subscription();

  constructor(
    private readonly alertController: AlertController,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async autoALertLoader() {
    /*
    const sub = this.isLoading.
      subscribe(async value => {
        console.log(value);
        if (value) {
          await this.defaultLoader();
          console.log('CRIOU');
        } else {
          await this.dismissLoader();
          console.log('DIMISS');
        }
      });

    this.subscriptions.add(sub);*/

  }

  async presentCustomLoader({ cssClass, header, subHeader, message }: Alert) {
    const alert = await this.alertController.create({
      cssClass,
      header,
      subHeader,
      message,
      backdropDismiss: false,
    });

    await alert.present();
  }
  async changeCustomLoader({ cssClass, header, subHeader, message }: Alert) {
    const alert = await this.alertController.getTop();
    alert.cssClass = cssClass || alert.cssClass;
    alert.header = header || alert.header;
    alert.subHeader = subHeader || alert.subHeader;
    alert.message = message || alert.message;
  }

  async defaultLoader() {
    const alert = await this.alertController.create({
      header: "Aguarde!",
      message: "Carregando...",
      id: 'default',
      backdropDismiss: false,
    });
    await alert.present();
  }

  async dismissLoader() {
    try {
      await this.alertController.dismiss();
      await this.alertController.dismiss();
      await this.alertController.dismiss();
      await this.alertController.dismiss();
    } catch (e) { }
  }
}
