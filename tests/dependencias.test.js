import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));

// Guarda contra reintrodução das versões conhecidas da QA-ATUAL-05.
// Não substitui npm audit: advisories novos exigem nova avaliação.
describe('dependências corrigidas da QA-ATUAL-05', () => {
  it.each([
    ['follow-redirects', [1, 16, 2]],
    ['source-map-js', [1, 2, 2]],
    ['vite', [8, 2, 4]],
  ])('%s não possui cópias anteriores à correção conhecida', (nome, minima) => {
    const copias = Object.entries(lock.packages)
      .filter(([path]) => path.endsWith(`node_modules/${nome}`));

    expect(copias.length).toBeGreaterThan(0);
    for (const [path, pacote] of copias) {
      expect(pacote.version, path).toMatch(/^\d+\.\d+\.\d+$/);
      const versao = pacote.version.split('.').map(Number);
      const diferenca = versao.map((parte, i) => parte - minima[i])
        .find((valor) => valor !== 0) ?? 0;
      expect(diferenca, `${path}@${pacote.version}`).toBeGreaterThanOrEqual(0);
    }
  });
});
