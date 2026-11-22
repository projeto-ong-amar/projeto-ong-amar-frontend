export const QUANTIDADE_MAXIMA = 2147483647;
export const TAMANHO_TEXTO_PRODUTO = 45;

export function validarTexto(valor, rotulo, minimo, maximo) {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  if (texto.length < minimo || texto.length > maximo) {
    throw new Error(`${rotulo} deve ter entre ${minimo} e ${maximo} caracteres.`);
  }
  return texto;
}

export function validarQuantidade(quantidade) {
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > QUANTIDADE_MAXIMA) {
    throw new Error(`Informe uma quantidade inteira entre 1 e ${QUANTIDADE_MAXIMA}.`);
  }
  return quantidade;
}
