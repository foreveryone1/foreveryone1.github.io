class RenderPsionics{static $getRenderedPsionic(a){const b=Renderer.get().setFirstSection(!0);return $$`
			${Renderer.utils.getBorderTr()}
			${Renderer.utils.getExcludedTr(a,"psionic")}
			${Renderer.utils.getNameTr(a,{page:UrlUtil.PG_PSIONICS})}
			<tr><td colspan="6"><i>${Renderer.psionic.getTypeOrderString(a)}</i></td></tr>
			<tr><td class="divider" colspan="6"><div></div></td></tr>
			<tr class="text"><td colspan="6">${Renderer.psionic.getBodyText(a,b)}</td></tr>
			${Renderer.utils.getPageTr(a)}
			${Renderer.utils.getBorderTr()}
		`}}