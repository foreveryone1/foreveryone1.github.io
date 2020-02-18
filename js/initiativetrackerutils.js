"use strict";class InitiativeTrackerUtil{static getWoundLevel(a){var b=Math.round,c=Math.max,d=Math.min;return a=b(c(d(a,100),0)),100===a?0:50<a?1:0<a?2:0===a?3:-1}static getWoundMeta(a){return InitiativeTrackerUtil._WOUND_META[a]||InitiativeTrackerUtil._WOUND_META[-1]}static get$condition(a){var b=Math.min;const c=a.onStateChange,d={name:a.name,color:a.color,turns:a.turns?+a.turns:null},f=b=>{if(!a.readonly){if(b&&null==d.turns&&h(),null==d.turns)return c&&c();d.turns--,0>=d.turns?h():i(b),c&&c()}},g=b=>{if(!a.readonly){if(b&&null==d.turns&&(d.turns=0),null==d.turns)return c&&c();d.turns++,i(b),c&&c()}},h=()=>k.tooltip("destroy").remove(),i=e=>{const f=`${d.turns} turn${1<d.turns?"s":""} remaining`,g=d.name&&d.turns?`${d.name.escapeQuotes()} (${f})`:d.name?d.name.escapeQuotes():d.turns?f:"",h=()=>{const b=[null==d.turns||3<d.turns?`background-image: linear-gradient(135deg, ${d.color} 41.67%, transparent 41.67%, transparent 50%, ${d.color} 50%, ${d.color} 91.67%, transparent 91.67%, transparent 100%); background-size: 8.49px 8.49px;`:`background: ${d.color};`];return a.width&&b.push(`width: ${a.width}px;`),`<div class="init__cond_bar" style="${b.join(" ")}"/>`},i=d.turns?[...Array(b(d.turns,3))].map(()=>h()).join(""):h();k.title(g),k.tooltip({trigger:"hover",placement:"auto-x"}),g?(k.tooltip("enable").tooltip("fixTitle"),e&&k.tooltip("show")):k.tooltip("disable"),k.html(i),c&&c()},j=[];a.width&&j.push(`width: ${a.width}px;`),a.height&&j.push(`height: ${a.height}px;`);const k=$(`<div class="init__cond" ${j.length?`style="${j.join(" ")}"`:""}/>`).data("doTickDown",f).data("getState",()=>JSON.parse(JSON.stringify(d))).on("contextmenu",a=>a.preventDefault()||f(!0)).click(()=>g(!0));if(a.name){const b=InitiativeTrackerUtil.CONDITIONS.find(b=>null!==b.condName&&b.name.toLowerCase()===a.name.toLowerCase().trim());if(b){const a=k[0];k.on("mouseover",c=>{if(c.shiftKey){c.shiftKey=!1;const d=UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CONDITIONS_DISEASES]({name:b.condName||b.name,source:SRC_PHB});Renderer.hover.pHandleLinkMouseOver(c,a,UrlUtil.PG_CONDITIONS_DISEASES,SRC_PHB,d)}}),k.on("mousemove",b=>Renderer.hover.handleLinkMouseMove(b,a)),k.on("mouseleave",b=>Renderer.hover.handleLinkMouseLeave(b,a))}}return i(),k}}InitiativeTrackerUtil._WOUND_META={[-1]:{text:"Unknown",color:"#a5a5a5"},0:{text:"Healthy",color:MiscUtil.COLOR_HEALTHY},1:{text:"Hurt",color:MiscUtil.COLOR_HURT},2:{text:"Bloodied",color:MiscUtil.COLOR_BLOODIED},3:{text:"Defeated",color:MiscUtil.COLOR_DEFEATED}},InitiativeTrackerUtil.CONDITIONS=[{name:"Blinded",color:"#434343"},{name:"Charmed",color:"#f01789"},{name:"Concentrating",color:"#009f7a",condName:null},{name:"Deafened",color:"#c7d0d3"},{name:"Drunk",color:"#ffcc00"},{name:"Exhausted",color:"#947a47",condName:"Exhaustion"},{name:"Frightened",color:"#c9ca18"},{name:"Grappled",color:"#8784a0"},{name:"Incapacitated",color:"#3165a0"},{name:"Invisible",color:"#7ad2d6"},{name:"!!On Fire!!",color:"#ff6800",condName:null},{name:"Paralyzed",color:"#c00900"},{name:"Petrified",color:"#a0a0a0"},{name:"Poisoned",color:"#4dc200"},{name:"Prone",color:"#5e60a0"},{name:"Restrained",color:"#d98000"},{name:"Stunned",color:"#a23bcb"},{name:"Unconscious",color:"#1c2383"}];class InitiativeTrackerPlayerUi{constructor(a,b,c){this._view=a,this._playerName=b,this._serverToken=c,this._clientPeer=new PeerVeClient}async pInit(){try{await this._clientPeer.pConnectToServer(this._serverToken,a=>this._view.handleMessage(a),{label:this._playerName,serialization:"json"})}catch(a){JqueryUtil.doToast({content:`Failed to create client! Are you sure the token was valid? (See the log for more details.)`,type:"danger"}),setTimeout(()=>{throw a})}}}class InitiativeTrackerPlayerMessageHandler{constructor(a){this._isCompact=a,this._isUiInit=!1,this._$meta=null,this._$head=null,this._$rows=null}get isActive(){return this._isUiInit}setElements(a,b,c){this._$meta=a,this._$head=b,this._$rows=c}initUi(){}handleMessage(a){this.initUi();const b=a.data||{};this._$meta.empty(),this._$head.empty(),this._$rows.empty(),b.n&&this._$meta.append(`
				<div class="${this._isCompact?"flex-vh-center":"flex-v-center"}${this._isCompact?" mb-3":""}">
					<div class="mr-2">Round: </div>
					<div class="bold">${b.n}</div>
				</div>
			`),this._$head.append(`
			<div class="initp__h_name${this._isCompact?" initp__h_name--compact":""}">Creature/Status</div>
			<div class="initp__h_hp${this._isCompact?" initp__h_hp--compact":""}">Health</div>
			${(b.c||[]).map(a=>`<div class="initp__h_stat">${a.a||""}</div>`).join("")}
			<div class="initp__h_score${this._isCompact?" initp__h_score--compact":""}">${this._isCompact?"#":"Init."}</div>
		`),(b.r||[]).forEach(a=>{this._$rows.append(this._get$row(a))})}_get$row(a){const b=$(`<div class="init__wrp_conds"/>`);(a.c||[]).forEach(a=>{const c={...a,readonly:!0};this._isCompact||(c.width=24,c.height=24),InitiativeTrackerUtil.get$condition(c).appendTo(b)});const{hpText:c,hpColor:d}=(()=>{if(null!=a.hh){const{text:b,color:c}=InitiativeTrackerUtil.getWoundMeta(a.hh);return{hpText:b,hpColor:c}}else{const b=InitiativeTrackerUtil.getWoundLevel(100*+a.h/+a.g);return{hpText:`${null==a.h?"?":a.h}/${null==a.g?"?":a.g}`,hpColor:InitiativeTrackerUtil.getWoundMeta(b).color}}})(),e=$(`<div/>`).text(`${a.m||a.n||""}${null==a.o?"":` (${a.o})`}`);return $$`
			<div class="initp__r${a.a?` initp__r--active`:""}">
				<div class="initp__r_name">
					${e}
					${b}
				</div>
				<div class="initp__r_hp">
					<div class="initp__r_hp_pill" style="background: ${d};">${c}</div>
				</div>
				${(a.k||[]).map(a=>`<div class="initp__r_stat flex-vh-center">
					${a.u?"?":!0===a.v?`<span class="text-success glyphicon glyphicon-ok"/>`:!1===a.v?`<span class="text-danger glyphicon glyphicon-remove"/>`:a.v}
				</div>`).join("")}
				<div class="initp__r_score${this._isCompact?" initp__r_score--compact":""}">${a.i}</div>
			</div>
		`}}