import { AppError } from "../../errors/AppError";

const TipoDesconto = [
  {
    cod: 10,
    descricao: "FIXO",
  },
  {
    cod: 11,
    descricao: "PERCENTUAL",
  },
];


enum TipoDescontoEnum {
  FIXO = 10,
  PERCENTUAL = 11,
}

function getTipoDescontoByCod(cod: number) {
  const status = TipoDesconto.find((s) => s.cod == cod);

  if (!status) {
    throw new AppError(`Tipo de desconto ${cod} não existe`);
  }

  return status.descricao;
}

export { getTipoDescontoByCod, TipoDescontoEnum };
