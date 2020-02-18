"use strict";class FeatsPage extends ListPage{constructor(){const a=new PageFilterFeats;super({dataSource:"data/feats.json",pageFilter:a,listClass:"feats",sublistClass:"subfeats",dataProps:["feat"]})}getListItem(a,b,c){this._pageFilter.mutateAndAddToFilters(a,c);const d=document.createElement("li");d.className=`row ${c?"row--blacklisted":""}`;const e=Parser.sourceJsonToAbv(a.source),f=UrlUtil.autoEncodeHash(a);d.innerHTML=`<a href="#${f}" class="lst--border">
			<span class="bold col-3-8 pl-0">${a.name}</span>
			<span class="col-3-5 ${a._slAbility===STR_NONE?"list-entry-none ":""}">${a._slAbility}</span>
			<span class="col-3 ${a._slPrereq===STR_NONE?"list-entry-none ":""}">${a._slPrereq}</span>
			<span class="source col-1-7 text-center ${Parser.sourceJsonToColor(a.source)} pr-0" title="${Parser.sourceJsonToFull(a.source)}" ${BrewUtil.sourceJsonToStyle(a.source)}>${e}</span>
		</a>`;const g=new ListItem(b,d,a.name,{hash:f,source:e,ability:a._slAbility,prerequisite:a._slPrereq},{uniqueId:a.uniqueId?a.uniqueId:b,isExcluded:c});return d.addEventListener("click",a=>this._list.doSelect(g,a)),d.addEventListener("contextmenu",a=>ListUtil.openContextMenu(a,this._list,g)),g}handleFilterChange(){const a=this._filterBox.getValues();this._list.filter(b=>this._pageFilter.toDisplay(a,this._dataList[b.ix])),FilterBox.selectFirstVisible(this._dataList)}getSublistItem(a,b){const c=UrlUtil.autoEncodeHash(a),d=$(`<li class="row">
			<a href="#${c}" class="lst--border">
				<span class="bold col-4 pl-0">${a.name}</span>
				<span class="col-4 ${a._slAbility===STR_NONE?"list-entry-none":""}">${a._slAbility}</span>
				<span class="col-4 ${a._slPrereq===STR_NONE?"list-entry-none":""} pr-0">${a._slPrereq}</span>
			</a>
		</li>`).contextmenu(a=>ListUtil.openSubContextMenu(a,e)),e=new ListItem(b,d,a.name,{hash:c,ability:a._slAbility,prerequisite:a._slPrereq});return e}doLoadHash(a){const b=this._dataList[a];$("#pagecontent").empty().append(RenderFeats.$getRenderedFeat(b)),ListUtil.updateSelected()}async pDoLoadSubHash(a){a=this._filterBox.setFromSubHashes(a),await ListUtil.pSetFromSubHashes(a)}}const featsPage=new FeatsPage;window.addEventListener("load",()=>featsPage.pOnLoad());