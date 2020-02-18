class RenderBackgrounds{static $getRenderedBackground(a){const b=[],c={type:"entries",entries:a.entries};return Renderer.get().setFirstSection(!0).recursiveRender(c,b),$$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getExcludedTr(a,"background")}
		${Renderer.utils.getNameTr(a,{page:UrlUtil.PG_BACKGROUNDS})}
		<tr><td class="divider" colspan="6"><div></div></td></tr>
		<tr class="text"><td colspan="6">${b.join("")}</td></tr>
		${Renderer.utils.getPageTr(a)}
		${Renderer.utils.getBorderTr()}
		`}}