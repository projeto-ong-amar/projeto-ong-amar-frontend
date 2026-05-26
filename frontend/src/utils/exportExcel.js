/**
 * Faz o download do Excel chamando o endpoint de export do backend.
 * Usa o relatoriosService para não duplicar a lógica de autenticação.
 */
export { relatoriosService as downloadExcel } from "../services/relatorios.service.js";
