"use strict";class PageFilterVariantRules extends PageFilter{constructor(){super(),this._sourceFilter=SourceFilter.getInstance(),this._miscFilter=new Filter({header:"Miscellaneous",items:["SRD"]})}mutateForFilters(a){a._fMisc=a.srd?["SRD"]:[]}addToFilters(a,b){b||this._sourceFilter.addItem(a.source)}async _pPopulateBoxOptions(a){a.filters=[this._sourceFilter,this._miscFilter]}toDisplay(a,b){return this._filterBox.toDisplay(a,b.source,b._fMisc)}}