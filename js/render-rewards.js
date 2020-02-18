class RenderRewards{static $getRenderedReward(a){return $$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getExcludedTr(a,"reward")}
		${Renderer.utils.getNameTr(a,{page:UrlUtil.PG_REWARDS})}
		<tr id="text"><td class="divider" colspan="6"><div></div></td></tr>
		${Renderer.reward.getRenderedString(a)}
		${Renderer.utils.getPageTr(a)}
		${Renderer.utils.getBorderTr()}`}}