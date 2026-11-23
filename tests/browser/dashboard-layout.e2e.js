import { expect, test } from '@playwright/test';

// Somente a API usa fixtures. Os gráficos são renderizados pelo Google Charts real.
async function simularApi(page) {
  await page.route('http://localhost:8080/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const respostas = {
      '/usuarios/me': { id: 1, nome: 'Admin QA', email: 'qa@example.test', tipoUsuario: 'ADMINISTRADOR' },
      '/csrf': { token: 'token-ficticio', headerName: 'X-CSRF-TOKEN' },
      '/dashboard/kpi-risco-vencimento': 2,
      '/dashboard/movimentacoes-por-mes': [
        { mes: 1, itensRecebidos: 120, itensEntregues: 80 },
        { mes: 2, itensRecebidos: 140, itensEntregues: 100 },
      ],
      '/dashboard/estoque-por-tipo': [
        { tipo: 'Alimentos', quantidade: 120 },
        { tipo: 'Higiene', quantidade: 80 },
      ],
      '/dashboard/estoque-fechamento-por-mes': [
        { mes: 1, estoqueFechamento: 40 },
        { mes: 2, estoqueFechamento: 80 },
      ],
      '/dashboard/estoque-atual-por-produto': [],
    };
    // Falhar em chamadas inesperadas evita esconder mudanças no contrato.
    expect(path in respostas, `Chamada não simulada: ${path}`).toBe(true);
    await route.fulfill({ json: respostas[path] });
  });
}

for (const viewport of [
  { width: 375, height: 667 },
  { width: 768, height: 800 },
  { width: 1280, height: 800 },
]) {
  test(`dashboard sem overflow em ${viewport.width}×${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await simularApi(page);
    await page.goto('/');

    const menu = page.getByRole('complementary', { name: 'Menu de navegação' });
    const abrirMenu = page.getByRole('button', { name: 'Abrir menu de navegação' });
    if (viewport.width < 768) await abrirMenu.click();
    await menu.getByRole('link', { name: 'Desempenho', exact: true }).click();

    const data = page.getByLabel('Data da próxima doação');
    await expect(data).toBeVisible();
    const principal = page.getByRole('main', { name: 'Desempenho' });
    await expect(page.locator('main, [role="main"]')).toHaveCount(1);
    await expect(principal.locator('main, [role="main"]')).toHaveCount(0);
    await expect(principal.getByLabel('Data da próxima doação')).toBeVisible();
    const pagina = principal.locator('..');
    // Esperar o SVG, e não apenas o wrapper, garante gráficos carregados.
    const graficos = pagina.locator('[class*="divGraficosBarraEPizza"] > div, [class*="divGraficoLinhaEAcoes"] > div:first-child');
    await expect(graficos).toHaveCount(3);
    for (const grafico of await graficos.all()) {
      await expect(grafico.locator('svg').first()).toBeVisible({ timeout: 30000 });
      const limites = await grafico.evaluate((el) => {
        const svg = el.querySelector('svg').getBoundingClientRect();
        const card = el.getBoundingClientRect();
        return { dentro: svg.left >= card.left && svg.right <= card.right + 1, largura: svg.width };
      });
      expect(limites.dentro).toBe(true);
      expect(limites.largura).toBeGreaterThan(100);
    }

    async function conferirLargura() {
      const dimensoes = await pagina.evaluate((el) => ({
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        overflowX: getComputedStyle(el).overflowX,
      }));
      expect(dimensoes.scrollWidth).toBeLessThanOrEqual(dimensoes.clientWidth);
      expect(['hidden', 'clip']).not.toContain(dimensoes.overflowX);
      return dimensoes;
    }

    const dimensoes = await conferirLargura();
    const ajuda = pagina.locator('[data-tooltip]');
    await ajuda.hover();
    await expect.poll(() => ajuda.evaluate((el) => getComputedStyle(el, '::after').opacity)).toBe('1');
    await conferirLargura();
    const balao = await ajuda.evaluate((el) => {
      const css = getComputedStyle(el, '::after');
      return {
        largura: parseFloat(css.width),
        larguraContainer: el.parentElement.clientWidth,
        quebraLinha: css.whiteSpace,
      };
    });
    expect(balao.largura).toBeLessThanOrEqual(balao.larguraContainer);
    expect(balao.quebraLinha).toBe('normal');
    await testInfo.attach('dimensoes', { body: JSON.stringify(dimensoes), contentType: 'application/json' });
    await page.screenshot({ path: testInfo.outputPath('dashboard.png') });

    // Navegação e menu continuam utilizáveis nos dois lados do breakpoint.
    if (viewport.width < 768) {
      await abrirMenu.click();
      await expect(abrirMenu).toHaveAttribute('aria-expanded', 'true');
    }
    await menu.getByRole('link', { name: 'Início', exact: true }).click();
    await expect(page.locator('#menu-navegacao [data-page="inicio"]')).toHaveAttribute('aria-current', 'page');
    if (viewport.width < 768) {
      await expect(abrirMenu).toHaveAttribute('aria-expanded', 'false');
      await expect(abrirMenu).toBeFocused();
    }
  });
}
