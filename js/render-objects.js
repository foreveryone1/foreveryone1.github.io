class RenderObjects{static $getRenderedObject(a){const b=Renderer.get().setFirstSection(!0),c=[];return a.entries&&b.recursiveRender({entries:a.entries},c,{depth:2}),a.actionEntries&&b.recursiveRender({entries:a.actionEntries},c,{depth:2}),$$`
			${Renderer.utils.getBorderTr()}
			${Renderer.utils.getExcludedTr(a,"object")}
			${Renderer.utils.getNameTr(a,{extraThClasses:["objs__name--token"],page:UrlUtil.PG_OBJECTS})}
			<tr class="text"><td colspan="6"><i>${"GEN"===a.type?`Variable size object`:`${Parser.sizeAbvToFull(a.size)} object`}</i><br></td></tr>
			<tr class="text"><td colspan="6">
				<b>Armor Class:</b> ${a.ac}<br>
				<b>Hit Points:</b> ${a.hp}<br>
				${null==a.speed?"":`<b>Speed:</b> ${Parser.getSpeedString(a)}<br>`}
				<b>Damage Immunities:</b> ${a.immune}<br>
				${Parser.ABIL_ABVS.some(b=>null!=a[b])?`<b>Ability Scores:</b> ${Parser.ABIL_ABVS.filter(b=>null!=a[b]).map(c=>b.render(`${c.toUpperCase()} ${Renderer.utils.getAbilityRoller(a,c)}`)).join(", ")}`:""}
				${a.resist?`<b>Damage Resistances:</b> ${a.resist}<br>`:""}
				${a.vulnerable?`<b>Damage Vulnerabilities:</b> ${a.vulnerable}<br>`:""}
			</td></tr>
			<tr class="text"><td colspan="6">${c.join("")}</td></tr>
			${Renderer.utils.getPageTr(a)}
			${Renderer.utils.getBorderTr()}`}}