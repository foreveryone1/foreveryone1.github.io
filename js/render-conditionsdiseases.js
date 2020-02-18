class RenderConditionDiseases{static $getRenderedConditionDisease(a){const b={type:"entries",entries:a.entries},c=[];return Renderer.get().setFirstSection(!0).recursiveRender(b,c),$$`
			${Renderer.utils.getBorderTr()}
			${Renderer.utils.getExcludedTr(a,a.__prop||("c"===a._type?"condition":"disease"))}
			${Renderer.utils.getNameTr(a,{page:UrlUtil.PG_CONDITIONS_DISEASES})}
			<tr><td class="divider" colspan="6"><div></div></td></tr>
			<tr class="text"><td colspan="6">${c.join("")}</td></tr>
			${Renderer.utils.getPageTr(a)}
			${Renderer.utils.getBorderTr()}
		`}}