"use strict";class TableConverter extends BaseConverter{constructor(a){super(a,{converterId:"Table",modes:["html","md"],prop:"table"})}_renderSidebar(a,b){b.empty()}handleParse(a,b,c,d){const e={cbWarning:c,cbOutput:b,isAppend:d};switch(this._state.mode){case"html":return this.doParseHtml(a,e);case"md":return this.doParseMarkdown(a,e);default:throw new Error(`Unimplemented!`);}}_getSample(a){switch(a){case"html":return TableConverter.SAMPLE_HTML;case"md":return TableConverter.SAMPLE_MARKDOWN;default:throw new Error(`Unknown format "${a}"`);}}doParseHtml(a,b){if(!a||!a.trim())return b.cbWarning("No input!");a=this._getCleanInput(a);const c=(a,c)=>{const d={type:"table",caption:c,colLabels:[],colStyles:[],rows:[]},e=a=>{let b=a.text().trim();return b.toUpperCase()===b&&(b=b.toTitleCase()),b};if(a.find(`caption`)&&(d.caption=a.find(`caption`).text().trim()),a.find(`thead`)){const c=a.find(`thead tr`);1!==c.length&&b.cbWarning(`Table header had ${c.length} rows!`),c.each((a,b)=>{const c=$(b);if(0===a)c.find(`th, td`).each((a,b)=>d.colLabels.push(e($(b))));else{const a=[];c.find(`th, td`).each((b,c)=>a.push(e($(c)))),a.length&&d.rows.push(a)}}),a.find(`thead`).remove()}else a.find(`th`)&&(a.find(`th`).each((a,b)=>d.colLabels.push(e($(b)))),a.find(`th`).parent().remove());const f=(a,b)=>{const c=$(b),e=[];c.find(`td`).each((a,b)=>{const c=$(b);e.push(c.text().trim())}),d.rows.push(e)};a.find(`tbody`)?a.find(`tbody tr`).each(f):a.find(`tr`).each(f),MarkdownConverter.postProcessTable(d),b.cbOutput(d,b.isAppend)},d=$(a);if(d.is("table"))c(d);else{d.find("table").each((a,b)=>{const d=$(b);c(d,"")})}}doParseMarkdown(a,b){if(!a||!a.trim())return b.cbWarning("No input!");a=this._getCleanInput(a);const c=a.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split(/\n/g),d=[];let e=null;c.forEach(a=>{a.trim().startsWith("##### ")?(e&&e.lines.length&&d.push(e),e={caption:a.trim().replace(/^##### /,""),lines:[]}):(e=e||{lines:[]},e.lines.push(a))}),e&&e.lines.length&&d.push(e);const f=d.map(a=>MarkdownConverter.getConvertedTable(a.lines,a.caption)).reverse();f.forEach((a,c)=>{b.isAppend?b.cbOutput(a,!0):0===c?b.cbOutput(a,!1):b.cbOutput(a,!0)})}}TableConverter.SAMPLE_HTML=`<table>
  <thead>
    <tr>
      <td><p><strong>Character Level</strong></p></td>
      <td><p><strong>Low Magic Campaign</strong></p></td>
      <td><p><strong>Standard Campaign</strong></p></td>
      <td><p><strong>High Magic Campaign</strong></p></td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p>1st–4th</p></td>
      <td><p>Normal starting equipment</p></td>
      <td><p>Normal starting equipment</p></td>
      <td><p>Normal starting equipment</p></td>
    </tr>
    <tr>
      <td><p>5th–10th</p></td>
      <td><p>500 gp plus 1d10 × 25 gp, normal starting equipment</p></td>
      <td><p>500 gp plus 1d10 × 25 gp, normal starting equipment</p></td>
      <td><p>500 gp plus 1d10 × 25 gp, one uncommon magic item, normal starting equipment</p></td>
    </tr>
    <tr>
      <td><p>11th–16th</p></td>
      <td><p>5,000 gp plus 1d10 × 250 gp, one uncommon magic item, normal starting equipment</p></td>
      <td><p>5,000 gp plus 1d10 × 250 gp, two uncommon magic items, normal starting equipment</p></td>
      <td><p>5,000 gp plus 1d10 × 250 gp, three uncommon magic items, one rare item, normal starting equipment</p></td>
    </tr>
    <tr>
      <td><p>17th–20th</p></td>
      <td><p>20,000 gp plus 1d10 × 250 gp, two uncommon magic items, normal starting equipment</p></td>
      <td><p>20,000 gp plus 1d10 × 250 gp, two uncommon magic items, one rare item, normal starting equipment</p></td>
      <td><p>20,000 gp plus 1d10 × 250 gp, three uncommon magic items, two rare items, one very rare item, normal starting equipment</p></td>
    </tr>
  </tbody>
</table>`,TableConverter.SAMPLE_MARKDOWN=`| Character Level | Low Magic Campaign                                                                | Standard Campaign                                                                                | High Magic Campaign                                                                                                     |
|-----------------|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| 1st–4th         | Normal starting equipment                                                         | Normal starting equipment                                                                        | Normal starting equipment                                                                                               |
| 5th–10th        | 500 gp plus 1d10 × 25 gp, normal starting equipment                               | 500 gp plus 1d10 × 25 gp, normal starting equipment                                              | 500 gp plus 1d10 × 25 gp, one uncommon magic item, normal starting equipment                                            |
| 11th–16th       | 5,000 gp plus 1d10 × 250 gp, one uncommon magic item, normal starting equipment   | 5,000 gp plus 1d10 × 250 gp, two uncommon magic items, normal starting equipment                 | 5,000 gp plus 1d10 × 250 gp, three uncommon magic items, one rare item, normal starting equipment                       |
| 17th–20th       | 20,000 gp plus 1d10 × 250 gp, two uncommon magic items, normal starting equipment | 20,000 gp plus 1d10 × 250 gp, two uncommon magic items, one rare item, normal starting equipment | 20,000 gp plus 1d10 × 250 gp, three uncommon magic items, two rare items, one very rare item, normal starting equipment |`;