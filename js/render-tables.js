class RenderTables{static $getRenderedTable(a){return a.type=a.type||"table",$$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getExcludedTr(a,"table")}
		${Renderer.utils.getNameTr(a,{page:UrlUtil.PG_TABLES})}
		<tr><td class="divider" colspan="6"><div></div></td></tr>
		<tr><td colspan="6">${Renderer.get().setFirstSection(!0).render(a)}</td></tr>
		
		${a.class?`<tr class="text"><td colspan="6">
		${Renderer.get().render(`{@note ${"table"===a.__prop?`This table is`:"These tables are"} from the {@class ${a.class.name}|${a.class.source}} class.`)}
		</td></tr>`:""}
		
		${a.subclass?`<tr class="text"><td colspan="6">
		${Renderer.get().render(`{@note ${"table"===a.__prop?`This table is`:"These tables are"} from the {@class ${a.subclass.className}|${a.subclass.classSource}|${a.subclass.name}|${a.subclass.name}|${a.subclass.source}} <span title="Source: ${Parser.sourceJsonToFull(a.subclass.classSource)}">${a.subclass.className}</span> subclass.`)}
		</td></tr>`:""}
		
		${a.chapter?`<tr class="text"><td colspan="6">
		${Renderer.get().render(`{@note ${"table"===a.__prop?`This table`:"These tables"} can be found in ${Parser.sourceJsonToFull(a.source)}${Parser.bookOrdinalToAbv(a.chapter.ordinal,!0)}, {@book ${a.chapter.name}|${a.source}|${a.chapter.index}|${a.chapter.name}}.}`)}
		</td></tr>`:""}
		
		${Renderer.utils.getPageTr(a)}
		${Renderer.utils.getBorderTr()}`}}