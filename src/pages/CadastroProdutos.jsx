import { useState } from 'react';
import styles from './CadastroProdutos.module.css';

const CATEGORIAS = ['Alimentos', 'Higiene', 'Limpeza', 'Outros'];
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
          <img src="https://img.icons8.com/ios/50/task.png" alt="" />
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
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
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
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
            </span>
            <span className={styles.actionText}>
              <strong>Cancelar</strong>
              <small>Limpar os campos</small>
            </span>
          </button>

          <button type="submit" className={styles.btnSalvar}>
            <span className={styles.actionIcon}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
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
          <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
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
                    <img src="https://img.icons8.com/ios-filled/50/9CA3AF/more.png" alt="" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.dica}>
        <img src="https://img.icons8.com/ios/50/2563EB/idea.png" alt="" />
        <span>
          <strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.
        </span>
      </div>
    </main>
  );
}

export default CadastroProdutos;