"use strict";window.addEventListener("load",()=>{ExcludeUtil.pInitialise();const a=new InitiativeTrackerPlayerMessageHandlerPage,b=$(`#initp__ipt_player_name`).change(()=>c.removeClass("form-control--error")).disableSpellcheck(),c=$(`#initp__ipt_server_token`).change(()=>b.removeClass("form-control--error")).disableSpellcheck();$(`#initp__btn_gen_client_token`).click(async()=>{if(!b.val().trim())return b.addClass("form-control--error");if(!c.val().trim())return c.addClass("form-control--error");const d=new InitiativeTrackerPlayerUi(a,b.val(),c.val());await d.pInit(),InitiativeTrackerPlayerMessageHandlerPage.initUnloadMessage(),a.initUi()});const d=$(`body`);d.on("keypress",b=>{if("f"===b.key&&noModifierKeys(b)){if(MiscUtil.isInInput(b))return;b.preventDefault(),a.isActive&&d.toggleClass("is-fullscreen")}}),window.dispatchEvent(new Event("toolsLoaded"))});class InitiativeTrackerPlayerMessageHandlerPage extends InitiativeTrackerPlayerMessageHandler{constructor(){super(!1)}initUi(){this._isUiInit||(this._isUiInit=!0,$(`.initp__initial`).remove(),$(`.initp__wrp_active`).show(),this._$meta=$(`.initp__meta`),this._$head=$(`.initp__header`),this._$rows=$(`.initp__rows`))}static initUnloadMessage(){$(window).on("beforeunload",a=>{return(a||window.event).message="The connection will be closed","The connection will be closed"})}}