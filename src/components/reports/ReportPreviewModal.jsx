import { useEffect } from 'react';
import styles from '../../pages/Relatorios.module.css';

const ROTULOS_PRIORIDADE = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};

export function ReportPreviewModal({ open, report, data, loading, error, onClose, onBaixar, downloading }) {
  useEffect(() => {
    if (!open) return undefined;

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', aoPressionarTecla);
    return () => window.removeEventListener('keydown', aoPressionarTecla);
  }, [open, onClose]);

  if (!open) return null;

  const prioridade = data?.prioridade?.toLowerCase();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={report ? report.title : 'Relatório'}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{report ? report.title : 'Relatório'}</h2>
            {data?.periodo && <p className={styles.modalPeriodo}>Período: {data.periodo}</p>}
          </div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Fechar relatório">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading && (
            <div className={styles.modalCarregando}>
              <div className={styles.modalSpinner} />
              <p className={styles.loadingTitle}>Gerando relatório...</p>
              <p className={styles.loadingSub}>Aguarde enquanto a IA processa sua solicitação.</p>
            </div>
          )}

          {!loading && error && <p className={styles.error}>Erro ao gerar relatório: {error}</p>}

          {!loading && !error && data && (
            <>
              {prioridade && (
                <span className={`${styles.badge} ${styles[`prioridade${prioridade[0]?.toUpperCase()}${prioridade.slice(1)}`] || ''}`}>
                  Prioridade: {ROTULOS_PRIORIDADE[prioridade] || data.prioridade}
                </span>
              )}

              {data.titulo && (
                <section className={styles.previewSection}>
                  <h3 className={styles.previewSectionTitle}>Resumo executivo</h3>
                  <p className={styles.previewText}>{data.titulo}</p>
                </section>
              )}

              {data.response?.length > 0 && (
                <section className={styles.previewSection}>
                  <h3 className={styles.previewSectionTitle}>Análise</h3>
                  <ul className={styles.previewList}>
                    {data.response.map((item, indice) => (
                      <li key={indice}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {data.acoes_recomendadas?.length > 0 && (
                <section className={styles.previewSection}>
                  <h3 className={styles.previewSectionTitle}>Ações recomendadas</h3>
                  <ul className={styles.previewList}>
                    {data.acoes_recomendadas.map((item, indice) => (
                      <li key={indice}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {data.tabelas?.map((tabela, indiceTabela) => (
                <section className={styles.previewSection} key={`${tabela.titulo}-${indiceTabela}`}>
                  <h3 className={styles.previewSectionTitle}>{tabela.titulo}</h3>
                  <div className={styles.previewTableWrap}>
                    <table className={styles.previewTable}>
                      <thead>
                        <tr>
                          {tabela.colunas?.map((coluna, indice) => (
                            <th key={`${coluna}-${indice}`}>{coluna}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tabela.linhas?.map((linha, indiceLinha) => (
                          <tr key={indiceLinha}>
                            {linha.map((celula, indiceCelula) => (
                              <td key={indiceCelula}>{celula}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.modalCancelarBtn} onClick={onClose}>
            Fechar
          </button>
          <button
            type="button"
            className={styles.modalBaixarBtn}
            onClick={() => onBaixar(report.id)}
            disabled={downloading || loading || Boolean(error)}
          >
            {downloading ? 'Gerando...' : 'Baixar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPreviewModal;
