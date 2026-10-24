import { useEffect, useState } from 'react';
import {
  EVENTO_ALTO_CONTRASTE,
  altoContrasteAtivo,
  definirAltoContraste,
} from '../utils/altoContraste.js';

export function useAltoContraste() {
  const [ativo, setAtivo] = useState(altoContrasteAtivo);

  useEffect(() => {
    function sincronizar(evento) {
      setAtivo(Boolean(evento.detail));
    }

    window.addEventListener(EVENTO_ALTO_CONTRASTE, sincronizar);
    return () => window.removeEventListener(EVENTO_ALTO_CONTRASTE, sincronizar);
  }, []);

  function alternar() {
    definirAltoContraste(!ativo);
  }

  return { ativo, alternar };
}

export default useAltoContraste;
