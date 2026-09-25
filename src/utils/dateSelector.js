export function todaysDate(inputId) {
  const hoje = new Date().toISOString().split('T')[0]

  document.getElementById(inputId).min = hoje
}