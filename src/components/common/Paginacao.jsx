import styles from './Paginacao.module.css';

function calcularPaginasVisiveis(paginaAtual, totalPaginas, janela = 5) {
  if (totalPaginas <= janela) {
    return Array.from({ length: totalPaginas }, (_, i) => i);
  }
  let inicio = Math.max(0, paginaAtual - Math.floor(janela / 2));
  let fim = inicio + janela;
  if (fim > totalPaginas) {
    fim = totalPaginas;
    inicio = fim - janela;
  }
  return Array.from({ length: fim - inicio }, (_, i) => inicio + i);
}

export function Paginacao({ paginaAtual, totalPaginas, aoMudarPagina }) {
  if (!totalPaginas || totalPaginas <= 1) return null;

  const paginas = calcularPaginasVisiveis(paginaAtual, totalPaginas);

  return (
    <nav className={styles.paginacao} aria-label="Paginação do histórico">
      <button
        type="button"
        className={styles.botaoSeta}
        aria-label="Página anterior"
        disabled={paginaAtual === 0}
        onClick={() => aoMudarPagina(paginaAtual - 1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {paginas[0] > 0 && (
        <>
          <button type="button" className={styles.botaoPagina} onClick={() => aoMudarPagina(0)}>1</button>
          {paginas[0] > 1 && <span className={styles.reticencias}>…</span>}
        </>
      )}

      {paginas.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`${styles.botaoPagina} ${pagina === paginaAtual ? styles.paginaAtiva : ''}`}
          aria-current={pagina === paginaAtual ? 'page' : undefined}
          onClick={() => aoMudarPagina(pagina)}
        >
          {pagina + 1}
        </button>
      ))}

      {paginas[paginas.length - 1] < totalPaginas - 1 && (
        <>
          {paginas[paginas.length - 1] < totalPaginas - 2 && <span className={styles.reticencias}>…</span>}
          <button type="button" className={styles.botaoPagina} onClick={() => aoMudarPagina(totalPaginas - 1)}>
            {totalPaginas}
          </button>
        </>
      )}

      <button
        type="button"
        className={styles.botaoSeta}
        aria-label="Próxima página"
        disabled={paginaAtual >= totalPaginas - 1}
        onClick={() => aoMudarPagina(paginaAtual + 1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}

export default Paginacao;
