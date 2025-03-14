
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';

import { PerfilDto } from '../../../../../shared/interfaces/perfis/perfil.dto';
import { PerfilService } from '../../../../../shared/services/perfil/perfil.service';
import { UserService } from '../../../../../shared/services/user/user.service';
import { PageOrder } from './../../../../constants/page.constant';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { Role } from './../../../../constants/role.constants';

@Component({
  selector: 'app-funcionario-cadastro',
  templateUrl: './funcionario-cadastro.component.html',
  styleUrls: ['./funcionario-cadastro.component.scss'],
})
export class FuncionarioCadastroComponent implements OnInit, OnDestroy {

  form: UntypedFormGroup;
  perfis: PageableDto<PerfilDto>;
  currentPerfilTake = 15;


  steps: MenuItem[];
  stepIndex = 0;

  createdUserId = '';
  userWasCreated = false;

  isCliente = false;

  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly userService: UserService,
    private readonly perfilService: PerfilService,
    private readonly modal: ModalController,

  ) {
    this.form = this.formBuilder.group({
      nome: [, [Validators.required]],
      email: [, [Validators.required, Validators.email]],
      senha: [, [Validators.required,]],
      cpf: [, [Validators.required,]],
      perfil_id: [, [Validators.required,]],
    });
  }

  ngOnInit() {
    this.steps = [
      {
        label: 'Informações',
      },
      {
        label: 'Endereço',
      },
    ];
    this.loadPerfis();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPerfis(page = 1) {
    const sub = this.perfilService.list({ order: PageOrder.ASC, page, take: 10 })
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



  create() {
    const nome = this.form.get('nome').value;
    const email = this.form.get('email').value;
    const senha = this.form.get('senha').value;
    const cpf = this.form.get('cpf').value;
    const { id: perfil_id } = this.form.get('perfil_id').value;

    console.log({ nome, email, senha, cpf, perfil_id, });

    const sub = this.userService.createUser({ nome, email, senha, cpf, perfil_id,  })
      .subscribe(response => {
        this.createdUserId = response.id;
        this.userWasCreated = true;
        this.stepIndex++;
      });
    this.subscriptions.add(sub);
  }

  changePerfil(event) {
    this.form.get('cargo_id').setValue(undefined);
    const nome = this.form.get('perfil_id').value?.nome || undefined;

    if (nome == Role.CLIENTE) {
      this.isCliente = true;
      return;
    }

    this.isCliente = false;
  }

  listenEndereco(event) {
    this.fechar(this.userWasCreated);
  }

  fechar(userWasCreated = false) {
    this.modal.dismiss(userWasCreated);
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

  disableCreateBtn(): boolean {
    const situacao = !this.form.valid;

    return situacao;
  }
}
