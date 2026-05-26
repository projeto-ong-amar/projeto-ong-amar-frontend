import { useState, useEffect } from "react";
import { relatoriosService } from "../services/relatorios.service.js";

export function useRelatorios(tipo, periodo) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!tipo || !periodo) return;

    setLoading(true);
    setError(null);

    const fetchMap = {
      entrada:    () => relatoriosService.getHistoricoEntrada(periodo),
      saida:      () => relatoriosService.getHistoricoSaida(periodo),
      desempenho: () => relatoriosService.getPainelDesempenho(periodo),
      produtos:   () => relatoriosService.getHistoricoProdutos(periodo),
    };

    (fetchMap[tipo] || (() => Promise.resolve(null)))()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [tipo, periodo]);

  return { data, loading, error };
}
