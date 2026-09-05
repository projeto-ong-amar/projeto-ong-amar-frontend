
const CHAVE_USUARIO = 'usuarioLogado';

// Usuário padrão fictício para testes
const USUARIO_TESTE = {
  id: 1,
  nome: 'Usuário de Teste',
  email: 'teste@local.com'
};

export async function login(email, senha) {
  // Retorna o usuário fictício diretamente sem chamar a API
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(USUARIO_TESTE));
  localStorage.setItem('loggedIn', 'true');
  return USUARIO_TESTE;
}

export async function logout() {
  // Apenas limpa o armazenamento sem chamar a API de logout
  localStorage.removeItem(CHAVE_USUARIO);
  localStorage.removeItem('loggedIn');
}

export function getUsuarioLogado() {
  const bruto = localStorage.getItem(CHAVE_USUARIO);
  
  // Se não houver nada no localStorage, define e retorna o usuário de teste automaticamente
  if (!bruto) {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(USUARIO_TESTE));
    localStorage.setItem('loggedIn', 'true');
    return USUARIO_TESTE;
  }
  
  return JSON.parse(bruto);
}