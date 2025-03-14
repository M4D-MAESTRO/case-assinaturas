import { NotificacaoStatus } from "../../../shared/constants/notificacao-status.constant";
import { User } from "../../../modules/users/entities/user.entity";
import { NotificacaoTipoEnum } from "../../../shared/constants/notificacao-tipo.dto";

export class CreateNotificacoeDto {
    nome: string;
    descricao: string;
    tipo: NotificacaoTipoEnum;
    status: NotificacaoStatus;
    requester_user: User;
}
