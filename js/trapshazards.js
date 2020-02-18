"use strict";function filterTypeSort(c,d){return c=c.item,d=d.item,SortUtil.ascSortLower(Parser.trapHazTypeToFull(c),Parser.trapHazTypeToFull(d))}class TrapsHazardsPage extends ListPage{constructor(){const a=SourceFilter.getInstance(),b=new Filter({header:"Type",items:["MECH","MAG","SMPL","CMPX","HAZ","WTH","ENV","WLD","GEN"],displayFn:Parser.trapHazTypeToFull,itemSortFn:filterTypeSort});super({dataSource:"data/trapshazards.json",filters:[a,b],filterSource:a,listClass:"trapshazards",sublistClass:"subtrapshazards",dataProps:["trap","hazard"]}),this._sourceFilter=a}getListItem(a,b,c){a.trapHazType=a.trapHazType||"HAZ",c||this._sourceFilter.addItem(a.source);const d=document.createElement("li");d.className=`row ${c?"row--blacklisted":""}`;const e=Parser.sourceJsonToAbv(a.source),f=UrlUtil.autoEncodeHash(a),g=Parser.trapHazTypeToFull(a.trapHazType);d.innerHTML=`<a href="#${f}" class="lst--border">
			<span class="col-3 pl-0 text-center">${g}</span>
			<span class="bold col-7">${a.name}</span>
			<span class="col-2 text-center ${Parser.sourceJsonToColor(a.source)} pr-0" title="${Parser.sourceJsonToFull(a.source)}" ${BrewUtil.sourceJsonToStyle(a.source)}>${e}</span>
		</a>`;const h=new ListItem(b,d,a.name,{hash:f,source:e,trapType:g},{uniqueId:a.uniqueId?a.uniqueId:b,isExcluded:c});return d.addEventListener("click",a=>this._list.doSelect(h,a)),d.addEventListener("contextmenu",a=>ListUtil.openContextMenu(a,this._list,h)),h}handleFilterChange(){const a=this._filterBox.getValues();this._list.filter(b=>{const c=this._dataList[b.ix];return this._filterBox.toDisplay(a,c.source,c.trapHazType)}),FilterBox.selectFirstVisible(this._dataList)}getSublistItem(a,b){const c=UrlUtil.autoEncodeHash(a),d=Parser.trapHazTypeToFull(a.trapHazType),e=$(`<li class="row">
			<a href="#${c}" class="lst--border">
				<span class="col-4 pr-0">${d}</span>
				<span class="bold col-8 pl-0">${a.name}</span>
			</a>
		</li>`).contextmenu(a=>ListUtil.openSubContextMenu(a,f)),f=new ListItem(b,e,a.name,{hash:c,trapType:d});return f}doLoadHash(a){Renderer.get().setFirstSection(!0);const b=this._dataList[a];$(`#pagecontent`).empty().append(RenderTrapsHazards.$getRenderedTrapHazard(b)),ListUtil.updateSelected()}async pDoLoadSubHash(a){a=this._filterBox.setFromSubHashes(a),await ListUtil.pSetFromSubHashes(a)}}const trapsHazardsPage=new TrapsHazardsPage;window.addEventListener("load",()=>trapsHazardsPage.pOnLoad());