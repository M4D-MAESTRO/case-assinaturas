import { AppError } from "../../errors/AppError";

const StatusUsuario = [
  {
    cod: 10,
    descricao: "ATIVO",
  },
  {
    cod: 11,
    descricao: "AFASTADO",
  },
  {
    cod: 12,
    descricao: "FÉRIAS",
  },
  {
    cod: 13,
    descricao: "DESLIGADO",
  },
  {
    cod: 14,
    descricao: "DELETADO",
  },
];

// Ver os erros que vao dar por causa da alteracao desse enum
enum StatusUsuarioEnum {
  ATIVO = 'ATIVO',
  AFASTADO = 'AFASTADO',
  FERIAS = 'FERIAS',
  DESLIGADO = 'DESLIGADO',
  DELETADO = 'DELETADO',
}

enum TipoUsuarioEnum {
  FUNCIONARIO = 'FUNCIONARIO',
  CLIENTE = 'CLIENTE',
}

function getStatusUsuarioByCod(cod: number) {
  const status = StatusUsuario.find((s) => s.cod == cod);

  if (!status) {
    throw new AppError(`Status de código ${cod} não existe`);
  }

  return status.descricao;
}

export { getStatusUsuarioByCod, StatusUsuarioEnum, TipoUsuarioEnum };
