class RenderActions{static $getRenderedAction(a){return $$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getExcludedTr(a,"action")}
		${Renderer.utils.getNameTr(a,{page:UrlUtil.PG_ACTIONS})}
		<tr><td class="divider" colspan="6"><div></div></td></tr>
		<tr class="text"><td colspan="6">
		${Renderer.get().setFirstSection(!0).render({entries:a.entries})}
		${a.isOptional?Renderer.get().render("{@note This action is an optional addition to the game.}"):""}
		</td></tr>
		${Renderer.utils.getPageTr(a)}
		${Renderer.utils.getBorderTr()}
		`}}