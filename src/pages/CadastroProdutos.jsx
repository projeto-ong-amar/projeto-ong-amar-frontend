import { useState } from 'react';
import styles from './CadastroProdutos.module.css';

const CATEGORIAS = ['Alimentos', 'Higiene'];
const UNIDADES = ['Quilograma (kg)', 'Litro (l)', 'Unidade (un)', 'Caixa (cx)'];

const HISTORICO_MOCK = [
  { data: '29/04/2025', responsavel: 'Juliana Albuquerque', produto: 'Arroz', categoria: 'Alimentos' },
];

const emptyForm = { nome: '', categoria: '', dataEntrada: '', unidade: '' };

export function CadastroProdutos() {
  const [form, setForm] = useState(emptyForm);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleCancelar() {
    setForm(emptyForm);
  }

  function handleSalvar(e) {
    e.preventDefault();
    console.log('Salvar produto:', form);
  }

  return (
    <main className={styles.content}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 3h6v2H9z" />
            <path d="M9 13l5-5 2 2-5 5H9v-2z" />
          </svg>
        </div>
        <div>
          <h1>Cadastro de Produto</h1>
          <p>Preencha os dados do produto abaixo.</p>
        </div>
      </div>

      <form className={styles.formCard} onSubmit={handleSalvar}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="nome-produto">
              1. Nome do Produto <span className={styles.required}>*</span>
            </label>
            <input
              id="nome-produto"
              type="text"
              placeholder="Digite o nome do produto"
              value={form.nome}
              onChange={handleChange('nome')}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="categoria-produto">
              2. Categoria <span className={styles.required}>*</span>
            </label>
            <select
              id="categoria-produto"
              value={form.categoria}
              onChange={handleChange('categoria')}
              required
            >
              <option value="">Selecione a categoria</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="data-entrada">
              3. Data de Entrada <span className={styles.required}>*</span>
            </label>
            <div className={styles.dateInputWrap}>
              <input
                id="data-entrada"
                type="text"
                placeholder="DD/MM/AAAA"
                value={form.dataEntrada}
                onChange={handleChange('dataEntrada')}
                required
              />
              <button type="button" className={styles.calendarBtn} aria-label="Selecionar data">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="unidade-medida">
              4. Unidade de Medida <span className={styles.required}>*</span>
            </label>
            <select
              id="unidade-medida"
              value={form.unidade}
              onChange={handleChange('unidade')}
              required
            >
              <option value="">Selecione a unidade de medida</option>
              {UNIDADES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" className={styles.btnCancelar} onClick={handleCancelar}>
            <span className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
            <span className={styles.actionText}>
              <strong>Cancelar</strong>
              <small>Limpar os campos</small>
            </span>
          </button>

          <button type="submit" className={styles.btnSalvar}>
            <span className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </span>
            <span className={styles.actionText}>
              <strong>Salvar Produto</strong>
              <small>Registrar no estoque</small>
            </span>
          </button>
        </div>
      </form>

      <div className={styles.historicoHeader}>
        <div className={styles.historicoHeading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v5h5" />
            <path d="M3.05 13A9 9 0 106 5.3L3 8" />
            <path d="M12 7v5l4 2" />
          </svg>
          <div>
            <h2>Histórico de Produto</h2>
            <p>Veja os produtos cadastrados no estoque.</p>
          </div>
        </div>
        <button className={styles.historicoBtn} type="button">Histórico</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Responsável</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {HISTORICO_MOCK.map((h, i) => (
              <tr key={i}>
                <td>{h.data}</td>
                <td>{h.responsavel}</td>
                <td>{h.produto}</td>
                <td>{h.categoria}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionsMenuBtn} type="button" aria-label="Mais ações">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.dica}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.4.4.6.9.6 1.3H8v0h8v0h-.6c0-.4.2-.9.6-1.3A7 7 0 0012 2z" />
        </svg>
        <span>
          <strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.
        </span>
      </div>
    </main>
  );
}

export default CadastroProdutos;