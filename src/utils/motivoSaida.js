
const PREFIXO_PERDA = 'Perda: ';

export const MOTIVOS_SAIDA = [
  { valor: 'Doação de cestas básicas', perda: false },
  { valor: 'Doação esporádica', perda: false },
  { valor: 'Doação para instituição parceira', perda: false },
  { valor: 'Produto inválido', perda: false },
  { valor: 'Consumo interno', perda: false },
  { valor: 'Produto vencido', perda: false }
];

export const MOTIVO_OUTROS = 'Outros';

export function motivoEhPerda(valor) {
  return MOTIVOS_SAIDA.some((item) => item.valor === valor && item.perda);
}

export function resolverMotivo({ motivoSelecionado, motivoOutro, perda }) {
  return perda || motivoSelecionado === MOTIVO_OUTROS ? (motivoOutro || '').trim() : motivoSelecionado;
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
  return perda ? (texto ? `${PREFIXO_PERDA}${texto}` : 'Perda') : texto;
}

export function interpretarMotivoSaida(motivoBruto) {
  const texto = motivoBruto || '';
  if (texto === 'Perda') {
    return { perda: true, motivo: '' };
  }
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
