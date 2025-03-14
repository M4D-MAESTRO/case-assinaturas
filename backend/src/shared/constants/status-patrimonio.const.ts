import { AppError } from "../../errors/AppError";

const StatusPatrimonio = [
  {
    cod: 10,
    descricao: "ATIVO",
  },
  {
    cod: 11,
    descricao: "EM MANUTENCAO",
  },
  {
    cod: 12,
    descricao: "VENDIDO",
  },
  {
    cod: 13,
    descricao: "FORA DE OPERACAO",
  },
];


enum StatusPatrimonioEnum {
  ATIVO = 'ATIVO',
  EM_MANUTENCAO = 'EM MANUTENCAO',
  VENDIDO = 'VENDIDO',
  FORA_DE_OPERACAO = 'FORA DE OPERACAO',
}

function getStatusPatrimonioByCod(cod: number) {
  const status = StatusPatrimonio.find((s) => s.cod == cod);

  if (!status) {
    throw new AppError(`Status de código ${cod} não existe`);
  }

  return status.descricao;
}

export { getStatusPatrimonioByCod, StatusPatrimonioEnum };
