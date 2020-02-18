"use strict";class Counter{static $getCounter(a,b){const c=$(`<div class="w-100 h-100 dm-cnt__root dm__panel-bg dm__data-anchor"/>`).data("getState",()=>d.getSaveableState()),d=new CounterRoot(a,c);return d.setStateFrom(b),d.render(c),c}}class CounterComponent extends BaseComponent{constructor(a,b){super(),this._board=a,this._$wrpPanel=b,this._addHookAll("state",()=>this._board.doSaveStateDebounced())}}class CounterRoot extends CounterComponent{constructor(a,b){super(a,b),this._childComps=[],this._$wrpRows=null}render(a){a.empty();const b=this.getPod();this._$wrpRows=$$`<div class="flex-col w-100 h-100 overflow-y-auto relative"/>`,this._childComps.forEach(a=>a.render(this._$wrpRows,b));const c=$(`<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-plus"/> Add Counter</button>`).click(()=>{const a=new CounterRow(this._board,this._$wrpPanel);this._childComps.push(a),a.render(this._$wrpRows,b),this._board.doSaveStateDebounced()});$$`<div class="w-100 h-100 flex-col px-2 pb-3">
			<div class="no-shrink pt-4"/>
			${this._$wrpRows}
			<div class="no-shrink flex-h-right">${c}</div>
		</div>`.appendTo(a)}_swapRowPositions(b,c){const d=this._childComps[b];this._childComps[b]=this._childComps[c],this._childComps[c]=d,this._childComps.forEach(a=>a.$row.detach().appendTo(this._$wrpRows)),this._board.doSaveStateDebounced()}_removeRow(a){const b=this._childComps.indexOf(a);~b&&(this._childComps.splice(b,1),a.$row.remove(),this._board.doSaveStateDebounced())}getPod(){const a=super.getPod();return a.swapRowPositions=this._swapRowPositions.bind(this),a.removeRow=this._removeRow.bind(this),a.$getChildren=()=>this._childComps.map(a=>a.$row),a}setStateFrom(a){this.setBaseSaveableStateFrom(a),this._childComps=[],a.rowState&&a.rowState.forEach(a=>{const b=new CounterRow(this._board,this._$wrpPanel);b.setStateFrom(a),this._childComps.push(b)})}getSaveableState(){return{...this.getBaseSaveableState(),rowState:this._childComps.map(a=>a.getSaveableState())}}}class CounterRow extends CounterComponent{constructor(a,b){super(a,b),this._$row=null}get $row(){return this._$row}render(a,b){this._parent=b;const c=ComponentUiUtil.$getIptStr(this,"name").addClass("mr-2 small-caps"),d=ComponentUiUtil.$getIptInt(this,"current",0,{$ele:$(`<input class="form-control input-xs form-control--minimal text-center dm-cnt__ipt dm-cnt__ipt--cur bold">`)}),e=ComponentUiUtil.$getIptInt(this,"max",0,{$ele:$(`<input class="form-control input-xs form-control--minimal text-center dm-cnt__ipt dm-cnt__ipt--max mr-2 text-muted bold">`)}),f=()=>{d.removeClass("text-success text-danger"),this._state.current>=this._state.max?d.addClass("text-success"):0>=this._state.current&&d.addClass("text-danger")};this._addHookBase("current",f),this._addHookBase("max",f),f();const g=$(`<button class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-minus"/></button>`).click(()=>this._state.current--),h=$(`<button class="btn btn-success btn-xs"><span class="glyphicon glyphicon-plus"/></button>`).click(()=>this._state.current++),i=$(`<button class="btn btn-danger btn-xxs"><span class="glyphicon glyphicon-trash"/></button>`).click(()=>{const{removeRow:a}=this._parent;a(this)});this._$row=$$`<div class="flex-v-center w-100 my-1">
			${c}
			<div class="relative flex-vh-center">
				${d}
				<div class="dm-cnt__slash text-muted text-center">/</div>
				${e}
			</div>
			<div class="flex btn-group mr-2">
				${g}
				${h}
			</div>

			${DragReorderUiUtil.$getDragPad2(()=>this._$row,a,this._parent)}
			${i}
		</div>`.appendTo(a)}_getDefaultState(){return MiscUtil.copy(CounterRow._DEFAULT_STATE)}}CounterRow._DEFAULT_STATE={name:"",current:0,max:1};