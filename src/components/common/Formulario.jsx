function validarCampo(campo) {
  if (!campo.willValidate) return;
  campo.setCustomValidity('');
  const valor = ['text', 'email'].includes(campo.type) ? campo.value.trim() : campo.value;
  let mensagem = '';
  if (campo.validity.badInput) mensagem = 'Informe um valor válido.';
  else if (campo.required && !valor) mensagem = 'Preencha este campo.';
  else if (campo.validity.typeMismatch) mensagem = 'Informe um e-mail válido.';
  else if (valor && campo.minLength > 0 && valor.length < campo.minLength) {
    mensagem = `Informe pelo menos ${campo.minLength} caracteres.`;
  } else if (campo.maxLength > 0 && valor.length > campo.maxLength) {
    mensagem = `Informe no máximo ${campo.maxLength} caracteres.`;
  } else if (campo.validity.rangeUnderflow) mensagem = `Informe um valor maior ou igual a ${campo.min}.`;
  else if (campo.validity.rangeOverflow) mensagem = `Informe um valor menor ou igual a ${campo.max}.`;
  else if (campo.validity.stepMismatch) mensagem = 'Informe uma quantidade inteira.';
  else if (!campo.validity.valid) mensagem = 'Confira o valor informado.';
  campo.setCustomValidity(mensagem);
}

// A validação explícita permite traduzir também os avisos nativos do navegador.
export function Formulario({ onSubmit, children, ...props }) {
  function enviar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    Array.from(formulario.elements).forEach(validarCampo);
    if (formulario.reportValidity()) onSubmit?.(evento);
  }

  return (
    <form {...props} noValidate onSubmit={enviar} onInput={(evento) => validarCampo(evento.target)}>
      {children}
    </form>
  );
}
