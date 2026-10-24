var KEY="friday-review-v1",S={goals:["","",""],daily:[],reviews:[]};
try{var raw=localStorage.getItem(KEY);if(raw){var p=JSON.parse(raw);S.goals=(p.goals||[]).concat(["","",""]).slice(0,3);S.daily=p.daily||[];S.reviews=p.reviews||[];}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function $(id){return document.getElementById(id);}
function h(tag,txt,cls){var e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
function ds(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function ago(n){var d=new Date();d.setDate(d.getDate()-n);return ds(d);}
function weekEntries(){var from=ago(6);return S.daily.filter(function(x){return x.date>=from;});}

function strip(){
  var box=$("strip");box.textContent="";
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);var k=ds(d);
    var on=S.daily.some(function(x){return x.date===k;});
    var c=h("div","","day"+(on?" on":""));
    c.appendChild(h("span",d.toLocaleDateString(undefined,{weekday:"short"})));
    c.appendChild(h("b",String(d.getDate())));
    box.appendChild(c);
  }
}
function groups(list,host,del){
  host.textContent="";
  if(!list.length){host.appendChild(h("p","Nothing logged yet.","empty"));return;}
  var cur=null,ul=null;
  list.slice().sort(function(a,b){return a.date<b.date?1:-1;}).forEach(function(x){
    if(x.date!==cur){cur=x.date;host.appendChild(h("div",cur,"date"));ul=h("ul");ul.style.marginTop="0";host.appendChild(ul);}
    var li=h("li");li.appendChild(h("span",x.text));
    if(del){var b=h("button","×");b.setAttribute("aria-label","Delete entry");b.onclick=function(){S.daily.splice(S.daily.indexOf(x),1);save();draw();};li.appendChild(b);}
    ul.appendChild(li);
  });
}
function draw(){
  strip();
  var t=ds(new Date()),td=S.daily.filter(function(x){return x.date===t;});
  var ul=$("dlist");ul.textContent="";
  if(!td.length)ul.appendChild(h("p","Nothing yet today. Add your first one above.","empty"));
  td.forEach(function(x){var li=h("li");li.appendChild(h("span",x.text));var b=h("button","×");b.setAttribute("aria-label","Delete entry");b.onclick=function(){S.daily.splice(S.daily.indexOf(x),1);save();draw();};li.appendChild(b);ul.appendChild(li);});
  groups(weekEntries(),$("wlist"),false);
  var rl=$("rlist");rl.textContent="";
  if(!S.reviews.length)rl.appendChild(h("p","No reviews yet.","empty"));
  S.reviews.slice().reverse().forEach(function(r){
    var d=h("div","","rev");d.appendChild(h("div",r.date,"date"));
    d.appendChild(h("div","Finished: "+r.finished));d.appendChild(h("div","Proud of: "+r.proud));d.appendChild(h("div","Next week: "+r.next));rl.appendChild(d);
  });
  for(var i=0;i<3;i++)$("g"+i).value=S.goals[i]||"";
}
function addDaily(){
  var v=$("dtext").value.trim();
  if(!v){$("dmsg").textContent="Write what you did first.";return;}
  S.daily.push({date:ds(new Date()),text:v});save();$("dtext").value="";
  var n=S.daily.filter(function(x){return x.date===ds(new Date());}).length;
  $("dmsg").textContent="Added. "+n+" thing"+(n===1?"":"s")+" today.";draw();$("dtext").focus();
}
$("dadd").onclick=addDaily;
$("dtext").onkeydown=function(e){if(e.key==="Enter")addDaily();};
$("rfill").onclick=function(){$("rf").value=weekEntries().map(function(x){return x.text;}).join("; ");};
$("rsave").onclick=function(){
  var f=$("rf").value.trim(),p=$("rp").value.trim(),n=$("rn").value.trim();
  if(!f||!p||!n){$("rmsg").textContent="Fill in all three fields.";return;}
  S.reviews.push({date:ds(new Date()),finished:f,proud:p,next:n});save();
  $("rf").value=$("rp").value=$("rn").value="";$("rmsg").textContent="Review saved. "+S.reviews.length+" week(s) logged.";draw();
};
$("gsave").onclick=function(){S.goals=[$("g0").value.trim(),$("g1").value.trim(),$("g2").value.trim()];save();$("gmsg").textContent="Goals saved.";};
$("tabs").onclick=function(e){
  var t=e.target.getAttribute("data-t");if(!t)return;
  ["today","week","review","goals"].forEach(function(k){$(k).hidden=(k!==t);});
  Array.prototype.forEach.call($("tabs").children,function(b){b.className=b===e.target?"act":"";});
};
draw();
