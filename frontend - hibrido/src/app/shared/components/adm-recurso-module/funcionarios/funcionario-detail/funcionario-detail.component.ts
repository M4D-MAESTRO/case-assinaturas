import { Role } from './../../../../constants/role.constants';

import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { FileUpload } from 'primeng/fileupload';

import { PerfilDto } from '../../../../../shared/interfaces/perfis/perfil.dto';
import { PerfilService } from '../../../../../shared/services/perfil/perfil.service';
import { UserService } from '../../../../../shared/services/user/user.service';
import { PageOrder } from './../../../../constants/page.constant';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { UserDto } from './../../../../interfaces/users/user.dto';
import { StatusUser } from './../../../../constants/status.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { ToastEnum, ToastPrimeSeverityEnum } from '../../../../../shared/constants/toast.constant';
import { StorageService } from './../../../../services/auth/storage.service';

@Component({
  selector: 'app-funcionario-detail',
  templateUrl: './funcionario-detail.component.html',
  styleUrls: ['./funcionario-detail.component.scss'],
})
export class FuncionarioDetailComponent implements OnInit, OnDestroy {

  @Input()
  user: UserDto;

  @Input()
  isModal = true;

  @Output()
  updatedEvent: EventEmitter<any> = new EventEmitter();

  form: UntypedFormGroup;
  perfis: PageableDto<PerfilDto>;
  currentPerfilTake = 15;


  steps: MenuItem[];
  stepIndex = 0;

  createdUserId = '';
  userWasCreated = false;
  sortStatus = StatusUser;

  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly userService: UserService,
    private readonly perfilService: PerfilService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly toastMessageService: ToastMessageService,
    private readonly storage: StorageService
  ) { }

  ngOnInit() {
    this.loadPerfis();
    const { nome, status, perfil,  } = this.user;

    this.form = this.formBuilder.group({
      nome: [nome, [Validators.required]],
      status: [status, [Validators.required,]],
      perfil_id: [perfil, [Validators.required,]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPerfis(page = 1) {
    const sub = this.perfilService.list({ order: PageOrder.ASC, page, take: 5 })
      .subscribe(data => {
        this.perfis = data;
      });
    this.subscriptions.add(sub);
  }

  lazyLoadPerfis(dropdown: Dropdown) {
    this.currentPerfilTake += 5;
    const sub = this.perfilService.list({ order: PageOrder.ASC, page: 1, take: this.currentPerfilTake })
      .subscribe(data => {
        this.perfis = data;
        dropdown.show();
      });
    this.subscriptions.add(sub);
  }


  update() {
    if (!this.checkUpdatePermission()) {
      this.toastService.presentToast({
        titulo: 'Não autorizado',
        detalhe: `Apenas ${Role.ADMIN} e ${Role.GERENTE} podem atualizar essas informações`,
        duracao: ToastEnum.mediumDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO
      });
      return;
    }

    const { id } = this.user;
    const nome = this.form.get('nome').value;
    const status = this.form.get('status').value;
    const { id: perfil_id } = this.form.get('perfil_id').value;

    const sub = this.userService.updateUser({ nome, perfil_id, status, }, id)
      .subscribe(response => {
        this.user = response;
        this.createdUserId = response.id;
        this.userWasCreated = true;
        if (this.isModal) {
          this.fechar(true);
        } else {
          this.toastService.presentToast({
            titulo: 'Sucesso',
            detalhe: 'Operação bem sucedida!',
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO
          });
          this.updatedEvent.emit(this.user);
        }
      });
    this.subscriptions.add(sub);
  }

  uploadFile(event, fileUpload: FileUpload) {
    const { id: updated_user_id } = this.user;
    const { id: local_user_id } = this.storage.getLocalUser();
    
    if (!(updated_user_id == local_user_id || this.checkUpdatePermission())) {
      console.log('entrou');
      this.toastService.presentToast({
        titulo: 'Não autorizado',
        detalhe: `Apenas ${Role.ADMIN} e ${Role.GERENTE} podem atualizar essas informações`,
        duracao: ToastEnum.mediumDuration,
        gravidade: ToastPrimeSeverityEnum.ATENCAO
      });
      return;
    }

    const file = event.files[0];
    const sub = this.userService.uploadAvatar(file)
      .subscribe(response => {
        this.user = response;
        this.createdUserId = response.id;
        this.userWasCreated = true;
        this.toastMessageService.presentToast({
          detalhe: 'Foto alterada',
          duracao: ToastEnum.shortDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO,
          titulo: 'Sucesso!'
        });
        this.updatedEvent.emit(this.user);
        fileUpload.clear();
      });
    this.subscriptions.add(sub);
  }

  fechar(userWasCreated = false) {
    this.modal.dismiss(this.userWasCreated);
  }

  isInputError(inputName: string): boolean {
    const resp =
      !this.form.controls[inputName].untouched &&
      this.form.controls[inputName].errors;

    if (resp) {
      return true;
    }
    return false;
  }

  disableUpdateBtn(): boolean {
    const situacao = !this.form.valid;

    return situacao;
  }

  checkUpdatePermission(): boolean {
    const role = this.storage.getRole();
    if (role == Role.GERENTE || role == Role.ADMIN) {
      return true;
    }
    return false;
  }

}