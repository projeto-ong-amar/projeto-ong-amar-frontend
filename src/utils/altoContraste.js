const CHAVE_ARMAZENAMENTO = 'altoContraste';
const CLASSE_ALTO_CONTRASTE = 'alto-contraste';

export const EVENTO_ALTO_CONTRASTE = 'alto-contraste-alterado';

export function altoContrasteAtivo() {
  try {
    return localStorage.getItem(CHAVE_ARMAZENAMENTO) === 'true';
  } catch {
    return false;
  }
}

function aplicarClasse(ativo) {
  document.documentElement.classList.toggle(CLASSE_ALTO_CONTRASTE, ativo);
}

export function definirAltoContraste(ativo) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, String(ativo));
  } catch {
   
  }
  aplicarClasse(ativo);
  window.dispatchEvent(new CustomEvent(EVENTO_ALTO_CONTRASTE, { detail: ativo }));
}

export function iniciarAltoContraste() {
  aplicarClasse(altoContrasteAtivo());

  window.addEventListener('storage', (evento) => {
    if (evento.key === CHAVE_ARMAZENAMENTO) {
      const ativo = evento.newValue === 'true';
      aplicarClasse(ativo);
      window.dispatchEvent(new CustomEvent(EVENTO_ALTO_CONTRASTE, { detail: ativo }));
    }
  });
}
