"use strict";const RACE_JSON_URL="data/races.json";class StatGen{static isValidState(a){return!!a&&!("object"!=typeof a)&&!!(a.t&&a.m&&a.p)&&!!Object.keys(a.t).length&&!Object.entries(a.t).some(([a,b])=>isNaN(+a)||isNaN(+b))}async init(){this.raceStats=null,this.raceChoiceAmount=null,this.raceChoiceCount=null,this.raceData=null,this.$advanced=$(`#advanced`),this.$budget=$(`#budget`),this.budget=StatGen.DEFAULT_POINTS,this.doSaveDebounced=MiscUtil.debounce(this.doSaveState,200,{leading:!0}),await ExcludeUtil.pInitialise(),await this.pLoadRaceJson(),this.initialiseChangeHandlers();try{const a=await StorageUtil.pGet(POINTBUY_STORAGE);StatGen.isValidState(a)?this.doLoadStateFrom(a):this.savedState=MiscUtil.copy(StatGen.DEFAULT_COSTS)}catch(a){this.savedState=MiscUtil.copy(StatGen.DEFAULT_COSTS)}try{this.doLoadUrlState(!0)}catch(a){window.location.hash=""}this.renderCostsTable(),this.$advanced.change(()=>{const a=this.isAdvanced;$(`#pointbuy`).toggleClass("pbuy__advanced_active",a),this.$budget.attr("readonly",!a),a?this.$budget.val(this.budget):this.$budget.val(StatGen.DEFAULT_POINTS),this.renderCostsTable(),this.handleCostChanges(),this.doSaveDebounced()}).change(),$(`#pbuy__save_file`).click(()=>DataUtil.userDownload(`statgen-pointbuy`,this.getSaveableState())),$(`#pbuy__load_file`).click(async()=>{const a=await DataUtil.pUserUpload();return StatGen.isValidState(a)?void(this.doLoadStateFrom(a),this.doSaveDebounced(),this.handleCostChanges()):JqueryUtil.doToast({content:`Invalid save file!`,type:"danger"})});const a=$(`#pbuy__save_url`).click(async()=>{const b=`${window.location.href.split("#")[0]}#pointbuy${HASH_PART_SEP}${encodeURIComponent(JSON.stringify(this.getSaveableState()))}`;await MiscUtil.pCopyTextToClipboard(b),JqueryUtil.showCopiedEffect(a)});this.isInit=!0}doLoadStateFrom(a){this.savedState=a.t,this.$advanced.prop("checked",!!a.m.a),this.$budget.val(a.p),this.budget=a.p,this.renderCostsTable();const b=b=>a[b]&&a[b]instanceof Array&&6===a[b].length,c=$(`.pbuy__cb_choose`);b("b")&&$(`.base`).each((b,c)=>c.value=a.b[b]),b("u")&&$(`.pbuy__user_add`).each((b,c)=>c.value=a.u[b]),a.r&&$(`#race`).val(a.r),this.changeRace(),b("c")&&c.each((b,c)=>$(c).prop("checked",a.c[b])),c.each((a,b)=>this.chooseRacialBonus(b,!1))}doLoadUrlState(a){if(window.location.hash.length){const b=window.location.hash.slice(1).split(",");if(1<b.length){const c=JSON.parse(decodeURIComponent(b[1]));StatGen.isValidState(c)&&(this.doLoadStateFrom(c),!0!==a&&this.handleCostChanges()),location.replace("#pointbuy")}}}handleCostChanges(){$(".base").each((a,b)=>b.value=this.limit(b.value)),this.changeBase()}getSaveableState(){const a=a=>$(a).map((a,b)=>+b.value).get();return MiscUtil.copy({b:a(`.base`),u:a(`.pbuy__user_add`),r:$(`#race`).val(),c:$(`.pbuy__cb_choose`).map((a,b)=>$(b).prop("checked")).get(),t:this.savedState,p:this.budget,m:{a:this.isAdvanced}})}doSaveState(){this.isInit&&StorageUtil.pSet(POINTBUY_STORAGE,this.getSaveableState())}async pLoadRaceJson(){const a=await DataUtil.loadJSON(RACE_JSON_URL),b=await BrewUtil.pAddBrewData();this.raceData=Renderer.race.mergeSubraces(a.race),b.race&&(this.raceData=this.raceData.concat(b.race)),this.raceData=this.raceData.filter(a=>!ExcludeUtil.isExcluded(a.name,"race",a.source)),$("#rollbutton").click(()=>this.rollStats());const c=RollerUtil.isCrypto(),d=c?"Numbers will be generated using Crypto.getRandomValues()":"Numbers will be generated using Math.random()";$(`#roller-mode`).html(`Cryptographically strong random generation: <span title="${d}" class="crypto-${c}">${c?`<span class="glyphicon glyphicon-lock"></span> enabled`:`<span class="glyphicon glyphicon-ban-circle"></span> not available`}</span>`);const e=()=>{$(".base").val(this.statMin),$(".pbuy__user_add").val(0),$(".choose").prop("checked",!1),this.changeBase()};$("#reset").click(()=>e()),$("#randomise").click(()=>{e();let a=999;for(const b=[...$(".base")].map(a=>$(a));0<a;){a--;const c=RollerUtil.rollOnArray(b),d=+c.val();c.val(d+1),this.changeBase();const e=this.getCostAndBudget(),f=e.budget-e.cost;if(0===f)return;0>f&&c.val(d)}}),$(".base").on("input",()=>this.changeBase()),$("input.choose").on("change",a=>this.chooseRacialBonus(a.target));const f=this.raceData.map(a=>({name:a.name,source:a.source})).sort((c,a)=>SortUtil.ascSort(c.name,a.name)||SortUtil.ascSort(c.source,a.source)),g=f.map(a=>`<option value="${a.name}_${a.source}">${a.name} ${a.source===SRC_PHB?"":`[${Parser.sourceJsonToAbv(a.source)}]`}</option>`).join("");$("#race").append(`<option value="">None</option>`).append(`<option value="_CUSTOM">Custom</option>`).append(g).change(()=>this.changeRace()).change()}renderCostsTable(){$(`.pbuy__add_row_btn_wrap`).remove();const a=$(`#costs`);a.empty().append(`
			<thead>
				<tr>
					<th class="col-4 pbuy__adv-col-3">Score</th>
					<th class="col-4 pbuy__adv-col-3">Modifier</th>
					<th class="col-4 pbuy__adv-col-3">Point Cost</th>
					<th class="col-3 pbuy__adv--visible"></th>
				</tr>
			</thead>
		`);const b=$(`<tbody/>`).appendTo(a),c=a=>{const c=a?this.savedState:StatGen.DEFAULT_COSTS,d=Object.keys(c).map(Number).sort(SortUtil.ascSort);for(let e=0;e<d.length;++e){const f=d[e],g=c[f],h=$(`
					<tr${a?` class="pbuy__tbl_row"`:""}>
						<td>${f}</td>
						<td>${Parser.getAbilityModifier(+f)}</td>
						<td>
							<span class="pbuy__adv--hidden">${g}</span>
							<span class="pbuy__wrp_cost_ipt pbuy__adv--visible"/>
						</td>
						<td class="pbuy__adv--visible"/>
					</tr>
				`).appendTo(b);if($(`<input value="${g}" type="number">`).on("change",a=>{c[f]=+a.target.value,this.doSaveDebounced(),this.handleCostChanges()}).appendTo(h.find(`.pbuy__wrp_cost_ipt`)),a&&(0===e||e===d.length-1)&&1<d.length){const a=$(`<button class="btn btn-xs btn-danger"><span class="glyphicon glyphicon-remove"></span></button>`).click(()=>{delete c[f],this.doSaveDebounced(),this.renderCostsTable(),this.handleCostChanges()});$(`<div class="pbuy__wrp-btn-rem">`).append(a).appendTo(h.find(`td`).last())}}};if(this.isAdvanced){c(!0);const b=$(`<div class="pbuy__add_row_btn_wrap"/>`).insertBefore(a),d=$(`<button class="btn btn-xs btn-primary" style="margin-right: 7px;">Add Lower Score</button>`).click(()=>{const a=Object.keys(this.savedState).map(Number).sort(SortUtil.ascSort)[0];return 0===a?JqueryUtil.doToast({content:"Can't go any lower!",type:"danger"}):void(this.savedState[a-1]=this.savedState[a],this.doSaveDebounced(),this.renderCostsTable())}).appendTo(b),e=$(`<button class="btn btn-xs btn-primary" style="margin-right: 14px;">Add Higher Score</button>`).click(()=>{const a=Object.keys(this.savedState).map(Number).sort(SortUtil.ascSort).reverse()[0];this.savedState[a+1]=this.savedState[a],this.doSaveDebounced(),this.renderCostsTable()}).appendTo(b),f=$(`<button class="btn btn-xs btn-default">Reset</button>`).click(()=>{this.savedState=MiscUtil.copy(StatGen.DEFAULT_COSTS),this.budget=StatGen.DEFAULT_POINTS,this.$budget.val(this.budget),this.doSaveDebounced(),this.renderCostsTable(),this.handleCostChanges()}).appendTo(b)}else c()}initialiseChangeHandlers(){$(`.base`).each((a,b)=>{const c=$(b);c.on("change",a=>{const b=a.target;let c=parseInt(b.value);b.value=isNaN(c)?this.statMin:this.limit(c),this.changeTotal()})}),$(`.pbuy__user_add`).each((a,b)=>{const c=$(b);c.on("change",a=>{const b=a.target;let c=parseInt(b.value);isNaN(c)&&(b.value=0),this.changeTotal()})}),this.$budget.on("change",()=>{this.changeBase(),this.isAdvanced&&(this.budget=+this.$budget.val(),this.doSaveDebounced())})}limit(a){return Math.max(Math.min(a,this.statMax),this.statMin)}get statMin(){return this.isAdvanced?Object.keys(this.savedState).map(Number).sort(SortUtil.ascSort)[0]:StatGen.DEFAULT_MIN}get statMax(){return this.isAdvanced?Object.keys(this.savedState).map(Number).sort(SortUtil.ascSort).reverse()[0]:StatGen.DEFAULT_MAX}getPointBuyCost(a){return this.isAdvanced?this.savedState[a]:StatGen.DEFAULT_COSTS[a]}chooseRacialBonus(a,b=!0){if(null!=this.raceChoiceAmount){if($("input.choose:checked").length>this.raceChoiceCount)return a.checked=!1;const c=this.raceStats[$(a).closest("tr").attr("id")]||0;$(".racial",a.parentNode.parentNode).val(a.checked?c+this.raceChoiceAmount:c),b&&this.changeTotal()}}changeRace(){const a=a=>{$(".racial").val(0),Object.keys(a).forEach(b=>$(`#${b} .racial`).val(a[b])),this.changeTotal();const b=$("td.choose_head").hide();if($(".choose").hide().prop("checked",!1),$(".pbuy__choose_dummy").hide(),!a.choose||!a.choose.from)return this.raceChoiceAmount=null,void(this.raceChoiceCount=null);this.raceStats=a;const{from:c}=a.choose;this.raceChoiceAmount=a.choose.amount||1,this.raceChoiceCount=a.choose.count,b.text(`Choose ${this.raceChoiceCount}`).show(),Parser.ABIL_ABVS.forEach(a=>$(`#${a} .${c.includes(a)?"choose":"pbuy__choose_dummy"}`).show())},b=$(`#race`).val();if("_CUSTOM"===b){$(`#custom`).show();const b=$(`.custom`);b.off("input").on("input",()=>{const c={};b.each((a,b)=>{const d=+$(b).val();c[$(b).attr("name")]=d||0}),a(c)})}else{$(`#custom`).hide();const c=""===b?{}:this.raceData.find(({name:a,source:c})=>`${a}_${c}`===b).ability[0];a(c)}}getCostAndBudget(){const a=+this.$budget.val();let b=0;return $(".base").each((a,c)=>b+=this.getPointBuyCost(this.limit(+c.value))),{cost:b,budget:a}}checkBudget(a){a||(a=this.getCostAndBudget()),$(`#remaining`).toggleClass("form-control--error",a.cost>a.budget)}changeBase(){const a=this.getCostAndBudget();$("#remaining").val(a.budget-a.cost),this.checkBudget(a),this.changeTotal()}changeTotal(){$("#pointbuy tr[id]").each((a,b)=>{const[c,d,e,f,g]=$(`input[data-select="number"]`,b).get(),h=f.value=+c.value+ +d.value+ +e.value,i=Math.floor((h-10)/2);g.value=0<=i?`+${i}`:i}),this.doSaveDebounced()}rollStats(){const a=$(`#stats-formula`).val(),b=Renderer.dice.lang.getTree3(a),c=$("#rolled");if(!b)c.find("#rolls").prepend(`<p>Invalid dice formula!</p>`);else{const a=[];for(let c=0;6>c;c++){const c={};c.__total=b.evl(c),a.push(c)}a.sort((c,a)=>SortUtil.ascSort(a.__total,c.__total)),c.find("#rolls").prepend(`<p class="stat-roll-line">${a.map(a=>`<span class="stat-roll-item" title="${a.rawText}">${a.__total}</span>`).join("")}</p>`)}c.find("#rolls p:eq(15)").remove()}get isAdvanced(){return this.$advanced.prop("checked")}}StatGen.DEFAULT_COSTS={8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9},StatGen.DEFAULT_MIN=8,StatGen.DEFAULT_MAX=15,StatGen.DEFAULT_POINTS=27;const statGen=new StatGen;window.onload=async function(){await statGen.init(),hashchange(),window.dispatchEvent(new Event("toolsLoaded"))};function hashchange(){ExcludeUtil.pInitialise();let a=(window.location.hash.slice(1)||"").trim().toLowerCase();const b=(a.split(HASH_PART_SEP)||[""])[0];$(".statmethod").hide(),["rolled","array","pointbuy"].includes(b)?($(`#${b}`).show(),statGen.isInit&&statGen.doLoadUrlState()):(window.history.replaceState({},document.title,`${location.origin}${location.pathname}#rolled`),hashchange())}window.onhashchange=hashchange;