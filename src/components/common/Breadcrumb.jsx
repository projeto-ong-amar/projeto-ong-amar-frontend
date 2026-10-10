import styles from './Breadcrumb.module.css';

export function Breadcrumb({ etapas, aoNavegar }) {
  if (!Array.isArray(etapas) || etapas.length === 0) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Caminho de navegação">
      <ol className={styles.lista}>
        {etapas.map((etapa, indice) => {
          const ehAtual = indice === etapas.length - 1;
          const ehLink = !ehAtual && Boolean(etapa.pagina) && Boolean(aoNavegar);

          return (
            <li key={`${etapa.pagina ?? etapa.label}-${indice}`} className={styles.item}>
              {ehLink ? (
                <a
                  className={styles.link}
                  href={`#${etapa.pagina}`}
                  onClick={(evento) => {
                    evento.preventDefault();
                    aoNavegar(etapa.pagina);
                  }}
                >
                  {etapa.label}
                </a>
              ) : (
                <span
                  className={ehAtual ? styles.atual : styles.texto}
                  aria-current={ehAtual ? 'page' : undefined}
                >
                  {etapa.label}
                </span>
              )}
              {!ehAtual && <span className={styles.separador} aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
