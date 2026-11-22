import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Formulario } from '../src/components/common/Formulario.jsx';

describe('avisos nativos em português', () => {
  it.each([
    ['text', '', { required: true }, 'Preencha este campo.'],
    ['text', '  ab  ', { minLength: 3 }, 'Informe pelo menos 3 caracteres.'],
    ['text', 'abcd', { maxLength: 3 }, 'Informe no máximo 3 caracteres.'],
    ['email', 'invalido', {}, 'Informe um e-mail válido.'],
    ['number', '2147483648', { max: 2147483647 }, 'Informe um valor menor ou igual a 2147483647.'],
    ['number', '0', { min: 1 }, 'Informe um valor maior ou igual a 1.'],
    ['number', '1.5', { step: 1 }, 'Informe uma quantidade inteira.'],
  ])('bloqueia %s com valor "%s"', (type, valor, restricoes, mensagem) => {
    const salvar = vi.fn();
    render(<Formulario onSubmit={salvar}><input aria-label="Campo" type={type} {...restricoes} /></Formulario>);
    const campo = screen.getByLabelText('Campo');
    fireEvent.input(campo, { target: { value: valor } });
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe(mensagem);
    expect(salvar).not.toHaveBeenCalled();
  });

  it('permite enviar depois de corrigir o campo e ignora campos desabilitados', () => {
    const salvar = vi.fn();
    render(
      <Formulario onSubmit={salvar}>
        <input aria-label="Nome" required minLength={3} />
        <input required disabled />
        <button type="submit">Salvar</button>
      </Formulario>,
    );
    const campo = screen.getByLabelText('Nome');
    fireEvent.submit(campo.form);
    expect(salvar).not.toHaveBeenCalled();
    fireEvent.input(campo, { target: { value: 'Arroz' } });
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe('');
    expect(salvar).toHaveBeenCalledOnce();
  });

  it('preserva a validação de datas da página sem permitir data obrigatória vazia', () => {
    const validarDatas = vi.fn((evento) => evento.preventDefault());
    render(
      <Formulario onSubmit={validarDatas}>
        <input aria-label="Data" type="date" max="2026-11-22" required />
      </Formulario>,
    );
    const campo = screen.getByLabelText('Data');
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe('Preencha este campo.');
    expect(validarDatas).not.toHaveBeenCalled();
    fireEvent.input(campo, { target: { value: '2099-12-01' } });
    fireEvent.submit(campo.form);
    expect(validarDatas).toHaveBeenCalledOnce();
  });
});
