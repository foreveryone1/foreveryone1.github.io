"use strict";class EncounterBuilder extends ProxyBase{constructor(){super(),this.stateInit=!1,this._cache=null,this._lastPlayerCount=null,this._advanced=!1,this._lock=new VeLock,this._cachedTitle=null,this.__state={savedEncounters:{},activeKey:null},this._state=this._getProxy("state",this.__state),this._$iptName=null,this._$btnSave=null,this._$btnReload=null,this._$btnLoad=null,this.pSetSavedEncountersThrottled=MiscUtil.throttle(this._pSetSavedEncounters.bind(this),50),this._infoHoverId=null,this.doSaveStateDebounced=MiscUtil.debounce(this.doSaveState,50)}initUi(){$(`#btn-encounterbuild`).click(()=>Hist.setSubhash(EncounterBuilder.HASH_KEY,!0)),$(`#btn-encounterstatblock`).click(()=>Hist.setSubhash(EncounterBuilder.HASH_KEY,null)),this._initRandomHandlers(),this._initAdjustHandlers(),$(`.ecgen__add_players`).click(()=>{this._advanced?this.addAdvancedPlayerRow(!1):this.addPlayerRow(!1)});const a=$(`.ecgen__players_advanced`).change(()=>{const b=this.getParty();if(this._advanced=!!a.prop("checked"),this._advanced){let a=!0;b.forEach(b=>{[...Array(b.count)].forEach(()=>{this.addAdvancedPlayerRow(a,!1,"",b.level),a=!1})}),$(`.ecgen__player_group`).remove(),this.updateDifficulty()}else{let a=!0;b.forEach(b=>{this.addPlayerRow(a,!1,b.count,b.level),a=!1}),$(`.ecgen__player_advanced`).remove(),this.updateDifficulty()}this.updateUiIsAdvanced(this._advanced)}),b=$(`.ecgen__sv_url`).click(async()=>{const a=UrlUtil.packSubHash(EncounterUtil.SUB_HASH_PREFIX,[JSON.stringify(this.getSaveableState())],{isEncodeBoth:!0}),c=[location.href,a];await MiscUtil.pCopyTextToClipboard(c.join(HASH_PART_SEP)),JqueryUtil.showCopiedEffect(b)});$(`.ecgen__sv_file`).click(()=>DataUtil.userDownload(`encounter`,this.getSaveableState())),$(`.ecgen__ld_file`).click(async()=>{const a=await DataUtil.pUserUpload();a.items&&a.sources&&(a.l={items:a.items,sources:a.sources}),this.pDoLoadState(a)}),$(`.ecgen__reset`).title(`SHIFT-click to reset players`).click(a=>confirm("Are you sure?")&&encounterBuilder.pReset({isNotResetPlayers:!a.shiftKey,isNotAddInitialPlayers:!a.shiftKey}));const c=$(`.ecgen__sv_text`).click(()=>{let a=0;const b=ListUtil.sublist.items.map(a=>a.values).sort((c,a)=>SortUtil.ascSortLower(c.name,a.name)).map(b=>(a+=Parser.crToXpNumber(b.cr)*b.count,`${b.count}× ${b.name}`)).join(", ");MiscUtil.pCopyTextToClipboard(`${b} (${a.toLocaleString()} XP)`),JqueryUtil.showCopiedEffect(c)})}_initRandomHandlers(){JqueryUtil.bindDropdownButton($(`#ecgen_dropdown_rng`));const a=$(`.ecgen_rng`).click(b=>{b.preventDefault(),this.pDoGenerateEncounter(a.data("mode"))});$(`.ecgen_rng_easy`).click(b=>{b.preventDefault(),this.pDoGenerateEncounter("easy"),a.data("mode","easy").text("Random Easy").title("Randomly generate an Easy encounter")}),$(`.ecgen_rng_medium`).click(b=>{b.preventDefault(),this.pDoGenerateEncounter("medium"),a.data("mode","medium").text("Random Medium").title("Randomly generate a Medium encounter")}),$(`.ecgen_rng_hard`).click(b=>{b.preventDefault(),this.pDoGenerateEncounter("hard"),a.data("mode","hard").text("Random Hard").title("Randomly generate a Hard encounter")}),$(`.ecgen_rng_deadly`).click(b=>{b.preventDefault(),this.pDoGenerateEncounter("deadly"),a.data("mode","deadly").text("Random Deadly").title("Randomly generate a Deadly encounter")})}_initAdjustHandlers(){JqueryUtil.bindDropdownButton($(`#ecgen_dropdown_adj`));const a=$(`.ecgen_adj`).click(b=>{b.preventDefault(),this.pDoAdjustEncounter(a.data("mode"))});$(`.ecgen_adj_easy`).click(b=>{b.preventDefault(),this.pDoAdjustEncounter("easy"),a.data("mode","easy").text("Adjust to Easy").title("Adjust the current encounter difficulty to Easy")}),$(`.ecgen_adj_medium`).click(b=>{b.preventDefault(),this.pDoAdjustEncounter("medium"),a.data("mode","medium").text("Adjust to Medium").title("Adjust the current encounter difficulty to Medium")}),$(`.ecgen_adj_hard`).click(b=>{b.preventDefault(),this.pDoAdjustEncounter("hard"),a.data("mode","hard").text("Adjust to Hard").title("Adjust the current encounter difficulty to Hard")}),$(`.ecgen_adj_deadly`).click(b=>{b.preventDefault(),this.pDoAdjustEncounter("deadly"),a.data("mode","deadly").text("Adjust to Deadly").title("Adjust the current encounter difficulty to Deadly")})}updateUiIsAdvanced(){$(`.ecgen__players_advanced`).prop("checked",this._advanced),$(`.ecgen__player_advanced_extra_head `).remove(),$(`.ecgen__player_advanced_extra_foot`).remove(),this._advanced?($(`.ecgen__add_players`).html(`<span class="glyphicon glyphicon-plus"></span> Add Another Player`),$(`.ecgen__group_lhs`).addClass(`ecgen__group_lhs--advanced`),$(`.ecgen__advanced_help`).show()):($(`.ecgen__add_players`).html(`<span class="glyphicon glyphicon-plus"></span> Add Another Level`),$(`.ecgen__group_lhs`).removeClass(`ecgen__group_lhs--advanced`),$(`.ecgen__advanced_help`).hide())}async initState(){const a=await EncounterUtil.pGetInitialState();a&&a.data?await this.pDoLoadState(a.data,"local"===a.type):this.addInitialPlayerRows(),this.stateInit=!0,await this._initSavedEncounters()}addInitialPlayerRows(a){this._advanced?this.addAdvancedPlayerRow(a):this.addPlayerRow(a,!0,ECGEN_BASE_PLAYERS)}async pReset(a){a=a||{},a.isNotRemoveCreatures||(await ListUtil.pDoSublistRemoveAll()),a.isNotResetPlayers||this.removeAllPlayerRows(),a.isNotAddInitialPlayers||this.addInitialPlayerRows(),this._state.activeKey=null,this.pSetSavedEncountersThrottled()}async pDoLoadState(a,b){if(await this.pReset({isNotAddInitialPlayers:!0,isNotRemoveCreatures:b}),!!a)try{a.a?(this._advanced=!0,this.updateUiIsAdvanced(),a.d&&a.d.length?a.d.forEach((a,b)=>this.addAdvancedPlayerRow(!b,!1,a.n,a.l,a.x)):this.addInitialPlayerRows(!1),a.c&&a.c.length&&a.c.forEach(a=>{this.addAdvancedColumnHeader(a),this.addAdvancedColumnFooter()})):a.p&&a.p.length?a.p.forEach(({count:a,level:b},c)=>this.addPlayerRow(!c,!1,a,b)):this.addInitialPlayerRows(!1),a.l&&!b&&(await pPreloadSublistSources(a.l),await ListUtil.pDoJsonLoad(a.l,!1)),this.updateDifficulty()}catch(a){JqueryUtil.doToast({content:`Could not load encounter! Was the file valid?`,type:"danger"}),this.pReset()}}getSaveableState(){const a={p:this.getParty(),l:ListUtil.getExportableSublist(),a:this._advanced};return this._advanced&&(a.c=$(`.ecgen__players_head_advanced`).find(`.ecgen__player_advanced_extra_head`).map((a,b)=>$(b).val()).get(),a.d=$(`.ecgen__player_advanced`).map((b,c)=>{const d=$(c),e=d.find(`.ecgen__player_advanced_extra`).map((a,b)=>$(b).val()).get();for(;e.length<a.c.length;)e.push("");return{n:d.find(`.ecgen__player_advanced__name`).val(),l:+d.find(`.ecgen__player_advanced__level`).val(),x:e.slice(0,a.c.length)}}).get()),a}doSaveState(){this.stateInit&&EncounterUtil.pDoSaveState(this.getSaveableState())}generateCache(){null==this._cache&&(this._cache=(()=>{const a={};return list.visibleItems.map(a=>monsters[a.ix]).filter(a=>!a.isNpc).forEach(b=>{const c=Parser.crToXpNumber(b.cr);c&&(a[c]=a[c]||[]).push(b)}),a})())}resetCache(){this._cache=null}async pDoAdjustEncounter(a){var b=Math.ceil,c=Math.floor;let d=EncounterBuilderUtils.getSublistedEncounter();if(!d.length)return JqueryUtil.doToast({content:`The current encounter contained no creatures! Please add some first.`,type:"warning"});d.forEach(a=>a.count=1);const e=this.getPartyXpThresholds();let f=EncounterBuilderUtils.calculateEncounterXp(d,e.count);const g=EncounterBuilder.TIERS.indexOf(a);if(!~g)throw new Error(`Unhandled difficulty level: "${a}"`);const[h,i]=[c(.9*e[EncounterBuilder.TIERS[g]]),b(1.1*(e[EncounterBuilder.TIERS[g+1]]-1))];if(f.adjustedXp>i)JqueryUtil.doToast({content:`Could not adjust the current encounter to ${a.uppercaseFirst()}, try removing some creatures!`,type:"danger"});else{const a=EncounterBuilderUtils.getCrCutoff(d),g=[...Array(d.length)].map((a,b)=>b),j=()=>{if(!g.length)return-1;let a=0;for(;!(7<RollerUtil.randomise(12))&&a<g.length-1;)a++;const b=g.splice(a,1)[0],j=[...d];b&&[...Array(b)].forEach(()=>{const a=RollerUtil.randomise(j.length)-1;j.splice(a,1)});let k=999;for(;!(f.adjustedXp>h&&f.adjustedXp<i)&&0<k--;){const a=[...j];if(1<a.length){let b=c(a.length/2);for(b=RollerUtil.randomise(a.length-1,b);0<b--;){const b=RollerUtil.randomise(a.length)-1;a.splice(b,1)}}for(;a.length;){const b=RollerUtil.randomise(a.length)-1,c=a.splice(b,1)[0];c.count++,f=EncounterBuilderUtils.calculateEncounterXp(d,e.count),f.adjustedXp>i&&(c.count--,f=EncounterBuilderUtils.calculateEncounterXp(d,e.count))}}return 0>k?0:1},k=[];let l;for(;!(l=j());)k.push(MiscUtil.copy(d)),d.forEach(a=>a.count=1);-1===l&&k.length&&(d=k.map(a=>({encounter:a,distance:(()=>{const b=EncounterBuilderUtils.calculateEncounterXp(a,e.count);return b>i?b-i:b<h?h-b:0})()})).sort((c,a)=>SortUtil.ascSort(c.distance,a.distance))[0].encounter);const m=d.filter(b=>b.cr&&b.cr<a);if(m.length){let a=i-f.adjustedXp;if(0<a){m.forEach(a=>a._xp=Parser.crToXpNumber(Parser.numberToCr(a.cr)));const g=m.filter(b=>b._xp<a);if(g.length){const a=this.getParty(),g=a.map(a=>a.count).reduce((c,a)=>c+a,0),h=a.map(a=>a.level*a.count).reduce((c,a)=>c+a,0)/g,j=(()=>5>h?[.8,1.3]:11>h?[1,2]:17>h?[1,3]:[1,4])(),[k,l]=[c(j[0]*g),b(j[1]*g)];for(;f.adjustedXp<=i;){const a=d.map(a=>a.count).reduce((c,a)=>c+a,0),b=a<k?90:a>l?40:75,c=RollerUtil.roll(100)<b;if(c)RollerUtil.rollOnArray(m).count++,f=EncounterBuilderUtils.calculateEncounterXp(d,e.count);else break}}}}}await this._pLoadSublist({items:d.map(a=>({h:a.hash,c:`${a.count}`,customHashId:a.customHashId||void 0})),sources:ListUtil.getExportableSublist().sources})}async pDoGenerateEncounter(a){const b=this.calculateXp(),c=EncounterBuilder.TIERS.indexOf(a);if(!~c)throw new Error(`Unhandled difficulty level: "${a}"`);const d=b.party[EncounterBuilder.TIERS[c+1]]-1;this.generateCache();const e=(()=>{if(5<b.party.count){const a=[...Array(10)].map((a,c)=>this._pDoGenerateEncounter_generateClosestEncounter(b,d*((c>=Math.floor(5))+1))),c=a.filter(a=>a.adjustedXp>=.6*d&&a.adjustedXp<=1.1*d);return c.length?RollerUtil.rollOnArray(c):null}return this._pDoGenerateEncounter_generateClosestEncounter(b,d)})();if(e){const a={items:[]},b=new Set;e.encounter.forEach(c=>{a.items.push({h:UrlUtil.autoEncodeHash(c.mon),c:c.count+""}),b.add(c.mon.source)}),a.sources=[...b],await this._pLoadSublist(a)}else await ListUtil.pDoSublistRemoveAll(),this.updateDifficulty()}_pDoGenerateEncounter_generateClosestEncounter(a,b){const c=Object.keys(this._cache).map(a=>+a).sort(SortUtil.ascSort).reverse(),d=Object.entries(Parser.XP_CHART_ALT).map(([a,b])=>({cr:a,xp:b,crNum:Parser.crToNumber(a)})).sort((c,a)=>SortUtil.ascSort(a.crNum,c.crNum)),e=a=>c.filter(b=>b<=a),f=b=>{const c=b.map(a=>({cr:Parser.crToNumber(a.mon.cr),count:a.count}));return EncounterBuilderUtils.calculateEncounterXp(c,a.party.count)},g=c=>{if(!c.length)return b;const e=f(c),g=b-e.adjustedXp,h=d.filter(a=>a.xp<=g);if(h.length&&h[0].crNum>=e.meta.crCutoff){const c=Parser.numMonstersToXpMult(e.relevantCount+1,a.party.count);return Math.floor((b-c*e.baseXp)/c)}return g},h=(a,b)=>{const c=a.filter(a=>a.xp===b);if(c.length&&85>RollerUtil.roll(100))RollerUtil.rollOnArray(c).count++;else{const c=RollerUtil.rollOnArray(this._cache[b]),d=a.find(a=>a.mon.source===c.source&&a.mon.name===c.name);d?d.count++:a.push({xp:b,mon:c,count:1})}};let i=0;const j=(a,b,c)=>{const d=b.filter(a=>a.xp===c);if(d.length)return!1;if(1<a.length){const b=RollerUtil.roll(100)<70-13*i;if(b){i++;const b=a.length-1;for(let a=0;a<b;++a)if(0===RollerUtil.roll(2))return a;return b-1}return 0}return!1},k=a=>{if(4<a.length&&1===RollerUtil.roll(2)){const b=RollerUtil.roll(Math.ceil(a.length/3));return a.slice(b)}return a},l=(a=>{const b=[],c=k(e(a));let d=a,f=0,i=0;for(;c.length&&!(100<i++);){if(f){f--,c.shift();continue}const a=c[0];if(a>d){c.shift();continue}if(f=j(c,b,a),f){f--,c.shift();continue}h(b,a),d=g(b)}return b})(b);return{encounter:l,adjustedXp:f(l).adjustedXp}}async _pLoadSublist(a){await pPreloadSublistSources(a),await ListUtil.pDoJsonLoad(a,!1),this.updateDifficulty()}addAdvancedPlayerRow(a=!0,b=!0,c,d,e){$(`.ecgen__wrp_add_players`).before(EncounterBuilder.getAdvancedPlayerRow(a,c,d,e)),b&&this.updateDifficulty()}addPlayerRow(a=!0,b=!0,c,d){$(`.ecgen__wrp_add_players`).before(EncounterBuilder.getPlayerRow(a,c,d)),b&&this.updateDifficulty()}removeAllPlayerRows(){$(`.ecgen__player_group`).remove(),$(`.ecgen__player_advanced`).remove()}isActive(){return"true"===Hist.getSubHash(EncounterBuilder.HASH_KEY)}show(){this._cachedTitle=this._cachedTitle||document.title,document.title="Encounter Builder - 5etools",$(`body`).addClass("ecgen_active"),this.updateDifficulty()}hide(){this._cachedTitle&&(document.title=this._cachedTitle,this._cachedTitle=null),$(`body`).removeClass("ecgen_active")}handleClick(a,b,c,d){const e=d?{customHashId:d}:void 0;c?ListUtil.pDoSublistAdd(b,!0,a.shiftKey?5:1,e):ListUtil.pDoSublistSubtract(b,a.shiftKey?5:1,e)}async pHandleShuffleClick(a){await this._lock.pLock();try{const b=monsters[a],c=Parser.crToXpNumber(b.cr);if(!c)return;const d=ListUtil.getExportableSublist(),e=UrlUtil.autoEncodeHash(b),f=d.items.find(a=>a.h===e);this.generateCache();const g=this._cache[c];if(1!==g.length){let a=b,c=e;for(;c===e;)a=RollerUtil.rollOnArray(g),c=UrlUtil.autoEncodeHash(a);f.h=c,d.sources.includes(a.source)||d.sources.push(a.source);outer:for(let a=0;a<d.items.length;++a){const b=d.items[a];for(let c=a-1;0<=c;--c){const e=d.items[c];if(b.h===e.h){e.c=+e.c+ +b.c+"",d.items.splice(a,1);continue outer}}}await this._pLoadSublist(d)}}finally{this._lock.unlock()}}handleSubhash(){"true"===Hist.getSubHash(EncounterBuilder.HASH_KEY)?this.show():this.hide()}removeAdvancedPlayerRow(a){const b=$(a);b.closest(`.ecgen__player_advanced`).remove(),this.updateDifficulty()}removePlayerRow(a){const b=$(a);b.closest(`.ecgen__player_group`).remove(),this.updateDifficulty()}updateDifficulty(){var a=Math.floor;const b=this.calculateXp(),c=$(`.ecgen__easy`).removeClass("bold").text(`Easy: ${b.party.easy.toLocaleString()} XP`),d=$(`.ecgen__medium`).removeClass("bold").text(`Medium: ${b.party.medium.toLocaleString()} XP`),e=$(`.ecgen__hard`).removeClass("bold").text(`Hard: ${b.party.hard.toLocaleString()} XP`),f=$(`.ecgen__deadly`).removeClass("bold").text(`Deadly: ${b.party.deadly.toLocaleString()} XP`),g=$(`.ecgen__absurd`).removeClass("bold").text(`Absurd: ${b.party.absurd.toLocaleString()} XP`);$(`.ecgen__daily_budget`).removeClass("bold").text(`Daily Budget: ${b.party.daily.toLocaleString()} XP`);let h="Trivial";if(b.encounter.adjustedXp>=b.party.absurd?(h="Absurd",g.addClass("bold")):b.encounter.adjustedXp>=b.party.deadly?(h="Deadly",f.addClass("bold")):b.encounter.adjustedXp>=b.party.hard?(h="Hard",e.addClass("bold")):b.encounter.adjustedXp>=b.party.medium?(h="Medium",d.addClass("bold")):b.encounter.adjustedXp>=b.party.easy&&(h="Easy",c.addClass("bold")),b.encounter.relevantCount){$(`.ecgen__req_creatures`).show(),$(`.ecgen__rating`).text(`Difficulty: ${h}`),$(`.ecgen__raw_total`).text(`Total XP: ${b.encounter.baseXp.toLocaleString()}`),$(`.ecgen__raw_per_player`).text(`(${a(b.encounter.baseXp/b.party.count).toLocaleString()} per player)`);const c={type:"entries",entries:[`{@b Adjusted by a ${b.encounter.meta.playerAdjustedXpMult}× multiplier, based on a minimum challenge rating threshold of approximately ${`${b.encounter.meta.crCutoff.toFixed(2)}`.replace(/[,.]?0+$/,"")}*&dagger;, and a party size of ${b.encounter.meta.playerCount} players.}`,`{@note * Calculated as half of the maximum challenge rating, unless the highest challenge rating is two or less, in which case there is no threshold.}`,`<hr>`,{type:"quote",entries:[`&dagger; [...] don't count any monsters whose challenge rating is significantly below the average challenge rating of the other monsters in the group [...]`],by:"{@book Dungeon Master's Guide, page 82|DMG|3|4 Modify Total XP for Multiple Monsters}"}]};if(null==this._infoHoverId){const a=Renderer.hover.getMakePredefinedHover(c,!0);this._infoHoverId=a.id;const b=$(`.ecgen__adjusted_total_info`);b.on("mouseover",function(b){a.mouseOver(b,this)}),b.on("mousemove",function(b){a.mouseMove(b,this)}),b.on("mouseleave",function(b){a.mouseLeave(b,this)})}else Renderer.hover.updatePredefinedHover(this._infoHoverId,c);$(`.ecgen__adjusted_total`).text(`Adjusted XP: ${b.encounter.adjustedXp.toLocaleString()}`),$(`.ecgen__adjusted_per_player`).text(`(${a(b.encounter.adjustedXp/b.party.count).toLocaleString()} per player)`)}else $(`.ecgen__req_creatures`).hide();this.doSaveState()}getParty(){if(this._advanced){const a=$(`.ecgen__player_advanced`),b={};return a.each((a,c)=>{const d=$(c).find(`.ecgen__player_advanced__level`).val();b[d]=(b[d]||0)+1}),Object.entries(b).map(([a,b])=>({level:a,count:b}))}return $(`.ecgen__player_group`).map((a,b)=>{const c=$(b);return{count:+c.find(`.ecgen__player_group__count`).val(),level:+c.find(`.ecgen__player_group__level`).val()}}).get()}get lastPlayerCount(){return this._lastPlayerCount}getPartyXpThresholds(){const a=this.getParty();a.forEach(a=>{a.easy=LEVEL_TO_XP_EASY[a.level]*a.count,a.medium=LEVEL_TO_XP_MEDIUM[a.level]*a.count,a.hard=LEVEL_TO_XP_HARD[a.level]*a.count,a.deadly=LEVEL_TO_XP_DEADLY[a.level]*a.count,a.daily=LEVEL_TO_XP_DAILY[a.level]*a.count});const b=a.reduce((c,a)=>(Object.keys(c).forEach(b=>c[b]+=a[b]),c),{count:0,level:0,easy:0,medium:0,hard:0,deadly:0,daily:0});return b.absurd=b.deadly+(b.deadly-b.hard),this._lastPlayerCount=b.count,b}calculateXp(){const a=this.getPartyXpThresholds(),b=EncounterBuilderUtils.calculateListEncounterXp(a.count);return{party:a,encounter:b}}static async doStatblockMouseOver(a,b,c,d){const e=monsters[c],f=UrlUtil.autoEncodeHash(e),g=null==d?null:`${MON_HASH_SCALED}:${d}`;return Renderer.hover.pHandleLinkMouseOver(a,b,UrlUtil.PG_BESTIARY,e.source,f,g)}static getTokenHoverMeta(a){return Renderer.hover.getMakePredefinedHover({type:"image",href:{type:"external",url:Renderer.monster.getTokenUrl(a)},data:{hoverTitle:`Token \u2014 ${a.name}`}},!0)}static async handleImageMouseOver(a,b,c){b.off("mouseover");const d=monsters[c],e=()=>{const a=Renderer.hover.getMakePredefinedHover({type:"entries",entries:[Renderer.utils.HTML_NO_IMAGES],data:{hoverTitle:`Image \u2014 ${d.name}`}},!0);b.mouseover(c=>a.mouseOver(c,b[0])).mousemove(c=>a.mouseMove(c,b[0])).mouseleave(c=>a.mouseLeave(c,b[0])),b.mouseover()},f=a=>{const c=Renderer.monster.getFluff(d,meta,a);if(c&&c.images&&c.images.length){const a=Renderer.hover.getMakePredefinedHover({type:"image",href:c.images[0].href,data:{hoverTitle:`Image \u2014 ${d.name}`}},!0);b.mouseover(c=>a.mouseOver(c,b[0])).mousemove(c=>a.mouseMove(c,b[0])).mouseleave(c=>a.mouseLeave(c,b[0])),b.mouseover()}else e()};if(!(ixFluff[d.source]||d.fluff))e();else if(d.fluff)f();else{const a=await DataUtil.loadJSON(`${JSON_DIR}${ixFluff[d.source]}`);f(a)}}async pDoCrChange(a,b,c){if(await this._lock.pLock(),!!a)try{const d=monsters[b],e=d.cr.cr||d.cr;if(null==e)return;const f=Parser.crToNumber(e),g=a.val();if(Parser.isValidCr(g)){const a=Parser.crToNumber(g);if(a===c)return;const b=ListUtil.getExportableSublist(),e=UrlUtil.autoEncodeHash(d),h=null==c||f===c?null:getCustomHashId(d.name,d.source,c),i=b.items.findIndex(a=>null==c||c===f?!a.customHashId&&a.h===e:a.customHashId===h);if(!~i)throw new Error(`Could not find previously sublisted item!`);const j=f===a?null:getCustomHashId(d.name,d.source,a),k=b.items.find(b=>a===f?!b.customHashId&&b.h===e:b.customHashId===j);if(k){const a=b.items[i];k.c=`${+(k.c||1)+ +(a.c||1)}`,b.items.splice(i,1)}else a===f?delete b.items[i].customHashId:b.items[i].customHashId=getCustomHashId(d.name,d.source,a);await this._pLoadSublist(b)}else JqueryUtil.doToast({content:`"${a.val()}" is not a valid Challenge Rating! Please enter a valid CR (0-30). For fractions, "1/X" should be used.`,type:"danger"}),a.val(Parser.numberToCr(c||e))}finally{this._lock.unlock()}}addAdvancedColumnHeader(a){$(`.ecgen__advanced_add_col`).before(EncounterBuilder.getAdvancedPlayerDetailHeader(a))}addAdvancedColumnFooter(){$(`.ecgen__wrp_add_players`).append(`
			<div class="ecgen__player_advanced_narrow ecgen__player_advanced_extra_foot mr-1">
				<button class="btn btn-xs btn-danger ecgen__advanced_remove_col" onclick="encounterBuilder.removeAdvancedColumn(this)" title="Remove Column"><span class="glyphicon-trash glyphicon"/></button>
			</div>
		`)}addAdvancedColumn(){this.addAdvancedColumnHeader(),$(`.ecgen__player_advanced`).each((a,b)=>{$(b).find(`input`).last().after(EncounterBuilder.getAdvancedPlayerDetailColumn())}),this.addAdvancedColumnFooter(),this.doSaveStateDebounced()}removeAdvancedColumn(a){const b=$(a),c=$(`.ecgen__wrp_add_players`).find(`.ecgen__player_advanced_extra_foot`).index(b.parent());b.parent().remove(),$(`.ecgen__player_advanced`).each((a,b)=>{$($(b).find(`.ecgen__player_advanced_extra`)[c]).remove()}),$($(`.ecgen__players_head_advanced .ecgen__player_advanced_extra_head`)[c]).remove()}static getAdvancedPlayerDetailHeader(a){return`
			<input class="ecgen__player_advanced_narrow ecgen__player_advanced_extra_head form-control form-control--minimal input-xs text-center mr-1" value="${(a||"").escapeQuotes()}" onchange="encounterBuilder.doSaveStateDebounced()">
		`}static getAdvancedPlayerDetailColumn(a){return`
			<input class="ecgen__player_advanced_narrow ecgen__player_advanced_extra form-control form-control--minimal input-xs text-center mr-1" value="${(a||"").escapeQuotes()}" onchange="encounterBuilder.doSaveStateDebounced()">
		`}static getAdvancedPlayerRow(a,b,c,d){return d=d||[...Array($(`.ecgen__player_advanced_extra_head`).length)].map(()=>""),`
			<div class="row mb-2 ecgen__player_advanced">
				<div class="w-100 flex ecgen__player_advanced_flex">
					<input class="ecgen__player_advanced__name form-control form-control--minimal input-xs mr-1" value="${(b||"").escapeQuotes()}" onchange="encounterBuilder.doSaveStateDebounced()">
					<input value="${c||1}" min="1" max="20" type="number" class="ecgen__player_advanced__level ecgen__player_advanced_narrow form-control form-control--minimal input-xs text-right mr-1" onchange="encounterBuilder.updateDifficulty()">
					${d.map(a=>EncounterBuilder.getAdvancedPlayerDetailColumn(a)).join("")}
					${a?`<div class="ecgen__del_players_filler"/>`:`
					<button class="btn btn-danger btn-xs ecgen__del_players" onclick="encounterBuilder.removeAdvancedPlayerRow(this)" title="Remove Player">
						<span class="glyphicon glyphicon-trash"></span>
					</button>
					`}
				</div>
			</div>
		`}static getPlayerRow(a,b,c){return b=+b||1,c=+c||1,`
			<div class="row mb-2 ecgen__player_group">
				<div class="col-2">
					<select class="ecgen__player_group__count form-control form-control--minimal input-xs" onchange="encounterBuilder.updateDifficulty()">
					${[...Array(12)].map((a,c)=>`<option ${b===c+1?"selected":""}>${c+1}</option>`).join("")}
					</select>
				</div>
				<div class="col-2">
					<select class="ecgen__player_group__level form-control form-control--minimal input-xs" onchange="encounterBuilder.updateDifficulty()" >
						${[...Array(20)].map((a,b)=>`<option ${c===b+1?"selected":""}>${b+1}</option>`).join("")}
					</select>
				</div>
				${a?"":`
				<div class="col-2 flex" style="margin-left: -10px; align-items: center; height: 20px;">
					<button class="btn btn-danger btn-xs ecgen__del_players" onclick="encounterBuilder.removePlayerRow(this)" title="Remove Player Group">
						<span class="glyphicon glyphicon-trash"></span>
					</button>
				</div>
				`}
			</div>
		`}static getButtons(a){return`<span class="ecgen__visible col-1 no-wrap pl-0" onclick="event.preventDefault(); event.stopPropagation()">
			<button title="Add (SHIFT for 5)" class="btn btn-success btn-xs ecgen__btn_list" onclick="encounterBuilder.handleClick(event, ${a}, 1)"><span class="glyphicon glyphicon-plus"></span></button>
			<button title="Subtract (SHIFT for 5)" class="btn btn-danger btn-xs ecgen__btn_list" onclick="encounterBuilder.handleClick(event, ${a}, 0)"><span class="glyphicon glyphicon-minus"></span></button>
		</span>`}static $getSublistButtons(a,b){const c=$(`<button title="Add (SHIFT for 5)" class="btn btn-success btn-xs ecgen__btn_list"><span class="glyphicon glyphicon-plus"/></button>`).click(c=>encounterBuilder.handleClick(c,a,1,b)),d=$(`<button title="Subtract (SHIFT for 5)" class="btn btn-danger btn-xs ecgen__btn_list"><span class="glyphicon glyphicon-minus"/></button>`).click(c=>encounterBuilder.handleClick(c,a,0,b)),e=$(`<button title="Randomize Monster" class="btn btn-default btn-xs ecgen__btn_list"><span class="glyphicon glyphicon-random" style="right: 1px"/></button>`).click(()=>encounterBuilder.pHandleShuffleClick(a));return $$`<span class="ecgen__visible col-1-5 no-wrap pl-0">
			${c}
			${d}
			${e}
		</span>`.click(a=>{a.preventDefault(),a.stopPropagation()})}async _initSavedEncounters(){const a=$(`#ecgen__wrp-save-controls`).empty(),b=await EncounterUtil.pGetSavedState();Object.assign(this._state,b);const c=async()=>{const a=this._state.activeKey,b=this._state.savedEncounters[this._state.activeKey];await this.pDoLoadState(b.data),this._state.activeKey=a,this.pSetSavedEncountersThrottled()};this._$iptName=$(`<input class="form-control form-control--minimal mb-3 mt-0 px-2 text-right bold" style="max-width: 330px;"/>`).change(()=>{const a=this._$iptName.val().trim()||"(Unnamed Encounter)";this._$iptName.val(a);const b=this._state.savedEncounters[this._state.activeKey];b.name=a,this._state.savedEncounters={...this._state.savedEncounters,[this._state.activeKey]:b},this.pSetSavedEncountersThrottled()});const d=()=>{if(this._state.activeKey){const a=this._state.savedEncounters[this._state.activeKey];this._$iptName.val(a.name)}else this._$iptName.val("");this.pSetSavedEncountersThrottled()};this._addHook("state","savedEncounters",d),this._addHook("state","activeKey",d),d(),this._$btnNew=$(`<button class="btn btn-default btn-xs mr-2" title="New Encounter"><span class="glyphicon glyphicon glyphicon-file"/></button>`).click(()=>{this._state.activeKey=null,encounterBuilder.pReset()});const e=()=>this._$btnNew.toggleClass("hidden",!this._state.activeKey);this._addHook("state","activeKey",e),e(),this._$btnSave=$(`<button class="btn btn-default btn-xs mr-2" title="Save Encounter"/>`).click(async()=>{if(this._state.activeKey){const a=this._state.savedEncounters[this._state.activeKey];a.data=this.getSaveableState(),this._state.savedEncounters={...this._state.savedEncounters,[this._state.activeKey]:a},this.pSetSavedEncountersThrottled(),JqueryUtil.doToast({type:"success",content:"Saved!"})}else{const a=await InputUiUtil.pGetUserString({title:"Enter Encounter Name"});if(null!=a){const b=CryptUtil.uid();this._state.savedEncounters={...this._state.savedEncounters,[b]:{name:a,data:this.getSaveableState()}},this._state.activeKey=b,this.pSetSavedEncountersThrottled(),JqueryUtil.doToast({type:"success",content:"Saved!"})}}});const f=()=>this._$btnSave.html(this._state.activeKey?`<span class="glyphicon glyphicon-floppy-disk"/>`:"Save Encounter");this._addHook("state","activeKey",f),f();const g=async()=>{const a=await EncounterUtil.pGetSavedState(),b=a.savedEncounters[this._state.activeKey];return b?void(this._state.savedEncounters={...this._state.savedEncounters,[this._state.activeKey]:b},await c()):JqueryUtil.doToast({content:`Could not find encounter in storage! Has it been deleted?`,type:"danger"})};this._$btnReload=$(`<button class="btn btn-default btn-xs mr-2" title="Reload Current Encounter"><span class="glyphicon glyphicon-refresh"/></button>`).click(()=>g()),this._$btnLoad=$(`<button class="btn btn-default btn-xs">Load Encounter</button>`).click(async()=>{const a=await EncounterUtil.pGetSavedState(),{$modalInner:b}=UiUtil.getShowModal({title:"Saved Encounters"}),d=$(`<div class="flex-col w-100 h-100"/>`).appendTo(b),e=a.savedEncounters;if(Object.keys(e).length){let a=Object.keys(e).length;Object.entries(e).sort((c,a)=>SortUtil.ascSortLower(c[1].name||"",a[1].name||"")).forEach(([b,e])=>{const f=$(`<input class="input input-xs form-control form-control--minimal mr-2">`).val(e.name).change(()=>{const a=f.val().trim()||"(Unnamed Encounter)";f.val(a);const c=this._state.savedEncounters[b];c.name=a,this._state.savedEncounters={...this._state.savedEncounters},this.pSetSavedEncountersThrottled()}),h=$(`<button class="btn btn-primary btn-xs mr-2">Load</button>`).click(async()=>{this._state.activeKey===b?await g():this._state.activeKey=b,await c()}),i=$(`<button class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-trash"/></button>`).click(()=>{this._state.activeKey===b&&(this._state.activeKey=null),this._state.savedEncounters=Object.keys(this._state.savedEncounters).filter(a=>a!==b).mergeMap(a=>({[a]:this._state.savedEncounters[a]})),j.remove(),--a||$$`<div class="w-100 flex-vh-center italic">No saved encounters</div>`.appendTo(d),this.pSetSavedEncountersThrottled()}),j=$$`<div class="flex-v-center w-100 mb-2">
								${f}
								${h}
								${i}
							</div>`.appendTo(d)})}else $$`<div class="w-100 flex-vh-center italic">No saved encounters</div>`.appendTo(d)});const h=()=>{this._$iptName.toggle(!!this._state.activeKey),this._$btnReload.toggle(!!this._state.activeKey)};this._addHook("state","activeKey",h),h(),$$`<div class="flex-col" style="align-items: flex-end;">
			${this._$iptName}
			<div class="flex-h-right">${this._$btnNew}${this._$btnSave}${this._$btnReload}${this._$btnLoad}</div>
		</div>`.appendTo(a)}_pSetSavedEncounters(){return this.stateInit?StorageUtil.pSet(EncounterUtil.SAVED_ENCOUNTER_SAVE_LOCATION,this.__state):void 0}}EncounterBuilder.HASH_KEY="encounterbuilder",EncounterBuilder.TIERS=["easy","medium","hard","deadly","absurd"];