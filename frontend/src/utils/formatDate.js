/**
 * Formata uma data para o padrão brasileiro: dd/mm/aaaa
 */
export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Formata data com hora: dd/mm/aaaa às hh:mm
 */
export function formatDateTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/**
 * Retorna a data de início de um período relativo
 * @param {"hoje"|"7dias"|"30dias"|"estemes"} periodo
 */
export function periodoParaDatas(periodo) {
  const hoje = new Date();
  const fim  = hoje.toISOString().split("T")[0];

  const mapa = {
    hoje:    0,
    "7dias": 7,
    "30dias":30,
    estemes: hoje.getDate() - 1,
  };

  const dias   = mapa[periodo] ?? 30;
  const inicio = new Date(hoje);
  inicio.setDate(hoje.getDate() - dias);

  return { inicio: inicio.toISOString().split("T")[0], fim };
}
