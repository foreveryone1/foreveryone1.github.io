"use strict";class InitiativeTrackerPlayer{static make$tracker(a,b){const c=$(`<div class="initp__meta"/>`).hide(),d=$(`<div class="initp__header"/>`).hide(),e=$(`<div class="initp__rows"/>`).hide(),f=$$`<div class="initp__wrp_active">
			${c}
			${d}
			${e}
		</div>`,g=new InitiativeTrackerPlayerMessageHandlerScreen;g.setElements(c,d,e);let h;const i=$(`<button class="btn btn-primary mb-2" style="min-width: 200px;" title="Connect to a tracker outside of this browser tab.">Connect to Remote Tracker</button>`).click(async()=>{i.detach(),j.detach();const a=$(`<input class="form-control input-sm code">`).change(()=>a.removeClass("form-control--error")).disableSpellcheck(),b=$(`<input class="form-control input-sm code">`).change(()=>b.removeClass("form-control--error")).disableSpellcheck(),c=$(`<button class="btn btn-primary btn-xs mr-2">Connect</button>`),d=$(`<button class="btn btn-default btn-xs">Back</button>`).click(()=>{e.remove(),g.$wrpInitial.append(i).append(j)}),e=$$`<div class="flex-col w-100">
					<div class="flex-vh-center px-4 mb-2">
						<span style="min-width: fit-content;" class="mr-2">Player Name</span>
						${a}
					</div>

					<div class="flex-vh-center px-4 mb-2">
						<span style="min-width: fit-content;" class="mr-2">Server Token</span>
						${b}
					</div>

					<div class="split px-4 flex-vh-center">
						${c}${d}
					</div>
				</div>`.appendTo(g.$wrpInitial);c.click(async()=>{if(!a.val().trim())return a.addClass("form-control--error");if(!b.val().trim())return b.addClass("form-control--error");try{h=new InitiativeTrackerPlayerUi(g,a.val(),b.val()),await h.pInit(),InitiativeTrackerPlayerMessageHandlerScreen.initUnloadMessage(),c.attr("disabled",!0)}catch(a){JqueryUtil.doToast({content:`Failed to get connect. ${STR_SEE_CONSOLE}`,type:"danger"}),setTimeout(()=>{throw a})}})}),j=$(`<button class="btn btn-primary" style="min-width: 200px;">Connect to Local Tracker</button>`).click(async()=>{const b=a.getPanelsByType(PANEL_TYP_INITIATIVE_TRACKER).map(a=>a.tabDatas.filter(a=>a.type===PANEL_TYP_INITIATIVE_TRACKER).map(a=>a.$content.find(`.dm__data-anchor`))).flat();if(!b.length)return JqueryUtil.doToast({content:"No local trackers detected!",type:"warning"});if(1===b.length)try{const a=await b[0].data("pDoConnectLocal")(g);h=new InitiativeTrackerPlayerUi(g,"Local",a),await h.pInit(),InitiativeTrackerPlayerMessageHandlerScreen.initUnloadMessage()}catch(a){JqueryUtil.doToast({content:`Failed to get connect. ${STR_SEE_CONSOLE}`,type:"danger"}),setTimeout(()=>{throw a})}else{i.detach(),j.detach();const a=$(`<select class="form-control input-xs mr-1">
							<option value="-1" disabled>Select a local tracker</option>
						</select>`).change(()=>a.removeClass("form-control--error"));b.forEach((b,c)=>a.append(`<option value="${c}">${b.data("getSummary")()}</option>`)),a.val("-1");const c=$(`<button class="btn btn-primary btn-xs">OK</button>`).click(async()=>{if(null==a.val())return a.addClass("form-control--error");c.prop("disabled",!0);try{const c=await b[+a.val()].data("pDoConnectLocal")(g);h=new InitiativeTrackerPlayerUi(g,"Local",c),await h.pInit(),InitiativeTrackerPlayerMessageHandlerScreen.initUnloadMessage()}catch(a){JqueryUtil.doToast({content:`Failed to get connect. ${STR_SEE_CONSOLE}`,type:"danger"}),f.remove(),d.remove(),g.$wrpInitial.append(i).append(j),setTimeout(()=>{throw a})}}),d=$$`<div class="flex-vh-center mb-2">
						${a}
						${c}
					</div>`.appendTo(g.$wrpInitial),f=$(`<button class="btn btn-default btn-xs">Back</button>`).click(()=>{f.remove(),d.remove(),g.$wrpInitial.append(i).append(j)}).appendTo(g.$wrpInitial)}});return g.$wrpInitial=$$`<div class="flex-vh-center h-100 flex-col dm__panel-bg">
			${i}
			${j}
		</div>`.appendTo(f),f}}class InitiativeTrackerPlayerMessageHandlerScreen extends InitiativeTrackerPlayerMessageHandler{constructor(){super(!0),this._$wrpInitial=null}initUi(){this._isUiInit||(this._isUiInit=!0,this._$meta.show(),this._$head.show(),this._$rows.show(),this._$wrpInitial.addClass("hidden"))}set $wrpInitial(a){this._$wrpInitial=a}get $wrpInitial(){return this._$wrpInitial}static initUnloadMessage(){$(window).on("beforeunload",a=>{return(a||window.event).message="The connection will be closed","The connection will be closed"})}}