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
    ['date', '2099-12-01', { max: '2026-11-22' }, 'Informe uma data igual ou anterior a 22/11/2026.'],
    ['date', '2026-11-01', { min: '2026-11-22' }, 'Informe uma data igual ou posterior a 22/11/2026.'],
  ])('bloqueia %s com valor "%s"', (type, valor, restricoes, mensagem) => {
    const salvar = vi.fn();
    render(<Formulario onSubmit={salvar}><input aria-label="Campo" type={type} {...restricoes} /></Formulario>);
    const campo = screen.getByLabelText('Campo');
    fireEvent.input(campo, { target: { value: valor } });
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe(mensagem);
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(campo.getAttribute('aria-describedby')).textContent).toBe(mensagem);
    expect(document.activeElement).toBe(campo);
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

  it('preserva a mensagem específica de datas e bloqueia valores vazios e futuros', () => {
    const validarDatas = vi.fn((evento) => evento.preventDefault());
    render(
      <Formulario onSubmit={validarDatas}>
        <input aria-label="Data" type="date" max="2026-11-22" data-erro-max="A data de entrada não pode ser futura." required />
      </Formulario>,
    );
    const campo = screen.getByLabelText('Data');
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe('Preencha este campo.');
    expect(validarDatas).not.toHaveBeenCalled();
    fireEvent.input(campo, { target: { value: '2099-12-01' } });
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe('A data de entrada não pode ser futura.');
    expect(validarDatas).not.toHaveBeenCalled();
    fireEvent.input(campo, { target: { value: '2026-11-22' } });
    expect(campo.validationMessage).toBe('');
    expect(campo.hasAttribute('aria-invalid')).toBe(false);
    expect(campo.hasAttribute('aria-describedby')).toBe(false);
    fireEvent.submit(campo.form);
    expect(validarDatas).toHaveBeenCalledOnce();
  });

  it('limpa o erro de select ao mudar e preserva descrições existentes', () => {
    const salvar = vi.fn();
    render(
      <Formulario onSubmit={salvar}>
        <p id="ajuda">Escolha uma categoria.</p>
        <select aria-label="Categoria" aria-describedby="ajuda" required defaultValue="">
          <option value="">Selecione</option>
          <option value="alimentos">Alimentos</option>
        </select>
      </Formulario>,
    );
    const campo = screen.getByLabelText('Categoria');
    fireEvent.submit(campo.form);
    expect(campo.getAttribute('aria-describedby').split(' ')).toHaveLength(2);
    fireEvent.change(campo, { target: { value: 'alimentos' } });
    expect(campo.validationMessage).toBe('');
    expect(campo.getAttribute('aria-describedby')).toBe('ajuda');
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.submit(campo.form);
    expect(salvar).toHaveBeenCalledOnce();
  });

  it('valida a relação entre datas e limpa o erro ao corrigir a data inicial', () => {
    const salvar = vi.fn();
    render(
      <Formulario onSubmit={salvar}>
        <input id="inicio" aria-label="Entrada" type="date" defaultValue="2026-11-22" />
        <input aria-label="Validade" type="date" defaultValue="2026-11-20"
          data-min-campo="inicio"
          data-erro-relacao="A data de validade não pode ser anterior à data de entrada." />
      </Formulario>,
    );
    const inicio = screen.getByLabelText('Entrada');
    const validade = screen.getByLabelText('Validade');
    fireEvent.submit(inicio.form);
    expect(validade.validationMessage).toBe('A data de validade não pode ser anterior à data de entrada.');
    expect(document.activeElement).toBe(validade);
    expect(salvar).not.toHaveBeenCalled();
    fireEvent.input(inicio, { target: { value: '2026-11-19' } });
    expect(validade.validationMessage).toBe('');
    expect(validade.hasAttribute('aria-describedby')).toBe(false);
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.submit(inicio.form);
    expect(salvar).toHaveBeenCalledOnce();
  });
});
