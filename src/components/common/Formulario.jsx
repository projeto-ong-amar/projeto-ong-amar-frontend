import { useId, useState } from 'react';

function validarCampo(campo) {
  if (typeof campo.setCustomValidity !== 'function') return;
  if (!campo.willValidate) return;
  campo.setCustomValidity('');
  const valor = ['text', 'email'].includes(campo.type) ? campo.value.trim() : campo.value;
  let mensagem = '';
  if (campo.validity.badInput) mensagem = 'Informe um valor válido.';
  else if (campo.required && !valor) mensagem = 'Preencha este campo.';
  else if (campo.type === 'date') {
    const minimoRelacionado = campo.ownerDocument.getElementById(campo.dataset.minCampo);
    if (valor && minimoRelacionado?.value && valor < minimoRelacionado.value) {
      mensagem = campo.dataset.erroRelacao || 'A data não pode ser anterior à data inicial.';
    } else if (campo.validity.rangeUnderflow) {
      mensagem = campo.dataset.erroMin || `Informe uma data igual ou posterior a ${campo.min.split('-').reverse().join('/')}.`;
    } else if (campo.validity.rangeOverflow) {
      mensagem = campo.dataset.erroMax || `Informe uma data igual ou anterior a ${campo.max.split('-').reverse().join('/')}.`;
    }
  } else if (campo.validity.typeMismatch) mensagem = 'Informe um e-mail válido.';
  else if (valor && campo.minLength > 0 && valor.length < campo.minLength) {
    mensagem = `Informe pelo menos ${campo.minLength} caracteres.`;
  } else if (campo.maxLength > 0 && valor.length > campo.maxLength) {
    mensagem = `Informe no máximo ${campo.maxLength} caracteres.`;
  } else if (campo.validity.rangeUnderflow) mensagem = `Informe um valor maior ou igual a ${campo.min}.`;
  else if (campo.validity.rangeOverflow) mensagem = `Informe um valor menor ou igual a ${campo.max}.`;
  else if (campo.validity.stepMismatch) mensagem = 'Informe uma quantidade inteira.';
  else if (!campo.validity.valid) mensagem = 'Confira o valor informado.';
  campo.setCustomValidity(mensagem);
  return mensagem ? campo : null;
}

// A validação explícita permite traduzir também os avisos nativos do navegador.
export function Formulario({ onSubmit, onInput, onChange, children, ...props }) {
  const id = useId();
  const [erros, setErros] = useState([]);

  function validar(campo, formulario) {
    const invalido = validarCampo(campo);
    const indice = Array.from(formulario.elements).indexOf(campo);
    const idErro = `${id}-erro-${indice}`;
    const descricoes = (campo.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    const semErro = descricoes.filter((descricao) => descricao !== idErro);
    if (invalido) semErro.push(idErro);
    if (semErro.length) campo.setAttribute('aria-describedby', semErro.join(' '));
    else campo.removeAttribute('aria-describedby');
    if (invalido) campo.setAttribute('aria-invalid', 'true');
    else if (descricoes.includes(idErro)) campo.removeAttribute('aria-invalid');
    return invalido ? { campo, id: idErro, mensagem: campo.validationMessage } : null;
  }

  function atualizar(evento) {
    const campo = evento.target;
    if (typeof campo.setCustomValidity !== 'function') return;
    const formulario = evento.currentTarget;
    const campos = Array.from(formulario.elements).filter((item) =>
      item === campo || (campo.id && item.dataset.minCampo === campo.id));
    const novosErros = campos.map((item) => validar(item, formulario)).filter(Boolean);
    setErros((atuais) => [
      ...atuais.filter((item) => !campos.includes(item.campo)),
      ...novosErros,
    ]);
  }

  function enviar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const invalidos = Array.from(formulario.elements).map((campo) => validar(campo, formulario)).filter(Boolean);
    setErros(invalidos);
    if (invalidos.length) invalidos[0].campo.focus();
    else onSubmit?.(evento);
  }

  return (
    <form {...props} noValidate onSubmit={enviar}
      onInput={(evento) => { atualizar(evento); onInput?.(evento); }}
      onChange={(evento) => { atualizar(evento); onChange?.(evento); }}>
      {children}
      {erros.map((erro) => <p key={erro.id} id={erro.id} role="alert">{erro.mensagem}</p>)}
    </form>
  );
}
