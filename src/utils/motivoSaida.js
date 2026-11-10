
const PREFIXO_PERDA = 'Perda: ';

export const MOTIVOS_SAIDA = [
  { valor: 'Doação de cestas básicas', perda: false },
  { valor: 'Doação para famílias cadastradas', perda: false },
  { valor: 'Distribuição em evento/ação social', perda: false },
  { valor: 'Doação para instituição parceira', perda: false },
  { valor: 'Consumo interno', perda: false },
  { valor: 'Produto vencido', perda: true },
  { valor: 'Produto danificado', perda: true },
];

export const MOTIVO_OUTROS = 'Outros';

export function motivoEhPerda(valor) {
  return MOTIVOS_SAIDA.some((item) => item.valor === valor && item.perda);
}

export function resolverMotivo({ motivoSelecionado, motivoOutro }) {
  return motivoSelecionado === MOTIVO_OUTROS ? (motivoOutro || '').trim() : motivoSelecionado;
}

export function separarMotivo(texto) {
  if (MOTIVOS_SAIDA.some((item) => item.valor === texto)) {
    return { motivoSelecionado: texto, motivoOutro: '' };
  }
  if (texto) return { motivoSelecionado: MOTIVO_OUTROS, motivoOutro: texto };
  return { motivoSelecionado: '', motivoOutro: '' };
}

export function formatarMotivoSaida({ motivo, perda }) {
  const texto = (motivo || '').trim();
  return perda ? `${PREFIXO_PERDA}${texto}` : texto;
}

export function interpretarMotivoSaida(motivoBruto) {
  const texto = motivoBruto || '';
  if (texto.startsWith(PREFIXO_PERDA)) {
    return { perda: true, motivo: texto.slice(PREFIXO_PERDA.length) };
  }
  return { perda: false, motivo: texto };
}

export function rotuloMotivoSaida(motivoBruto) {
  const { perda, motivo } = interpretarMotivoSaida(motivoBruto);
  if (!perda) return motivo || '-';
  return motivo ? `Perda (${motivo})` : 'Perda';
}
