
const PREFIXO_PERDA = 'Perda: ';

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
