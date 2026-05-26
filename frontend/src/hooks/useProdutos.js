import { useState, useEffect } from "react";
import { produtosService } from "../services/produtos.service.js";

export function useProdutos(params = {}) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fetchProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await produtosService.listar(params);
      setProdutos(data.items ?? data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProdutos(); }, []);

  return { produtos, loading, error, refetch: fetchProdutos };
}
