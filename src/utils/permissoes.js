export const PERFIL_ADMINISTRADOR = 'ADMINISTRADOR';
export const PERFIL_VOLUNTARIO = 'VOLUNTARIO';

const PAGINAS_SOMENTE_ADMIN = [
  'cadastro-produtos',
  'historico-produtos',
  'relatorios',
  'desempenho',
  'estoque-atual',
  'risco-vencimento',
  'cadastro-usuario',
  'historico-usuario',
];

export function ehAdministrador(usuario) {
  return usuario?.tipoUsuario === PERFIL_ADMINISTRADOR;
}

export function podeAcessarPagina(usuario, pagina) {
  if (!PAGINAS_SOMENTE_ADMIN.includes(pagina)) return true;
  return ehAdministrador(usuario);
}

export function podeConfigurarMetricas(usuario) {
  return ehAdministrador(usuario);
}
