if(!document.iFixitGuideWidget){document.iFixitGuideWidget={embeds:[],options:{large:true,small:false},contains:function(b,d){var c=b.length;while(c--){if(b[c]===d){return true}}return false},get_param:function(c,b){c=c.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var a="[\\?&]"+c+"=([^&#]*)";var e=new RegExp(a);var d=e.exec(b);return d==null?"":d[1]},display:function(g){var m=g.guideid;var b="ifixit-embed-"+m;var d=document.getElementById(b);if(g.error){if(!d){d=document.createElement("div");d.id=b}d.innerHTML=g.msg;return}d.innerHTML="";d.hasClass=function(q){var r=new RegExp("\\b"+q+"\\b");return r.test(d.className)};document.iFixitGuideWidget.options.large=d.hasClass("ifixit-guide-large");document.iFixitGuideWidget.options.small=d.hasClass("ifixit-guide-small");var l=document.createElement("div");l.id="ifixit-header";d.appendChild(l);var j=document.createElement("h1");j.innerHTML=g.guide["title"];j.id="ifixit-introHeader";d.appendChild(j);var h=document.createElement("img");h.setAttribute("src",g.guide["image"]["text"]+".standard");h.id="ifixit-stepIntroImage";d.appendChild(h);var k=document.createElement("div");k.id="ifixit-summary";k.innerHTML=g.guide["summary"];d.appendChild(k);var o=document.createElement("div");o.id="ifixit-footer";var a=document.createElement("div");var n=document.createElement("a");var f;if(document.iFixitGuideWidget.options.large){n.innerHTML="Begin &raquo;";n.className="ifixit-buttonLink"}else{f=document.createElement("div");f.innerHTML="Begin";f.id="ifixit-begin";n=document.createElement("div");n.className="ifixit-arrowNavRight";var i=function(){n.className=n.className=="ifixit-arrowNavRight"?"ifixit-arrowNavRightHover":"ifixit-arrowNavRight"};a.onmouseover=i;a.onmouseout=i}a.onclick=function(){document.iFixitGuideWidget.displayStep(g,0)};a.appendChild(n);a.appendChild(f);a.id="ifixit-navigation";var p=document.createElement("div");p.innerHTML=g.guide["type"]=="teardown"?"Teardown":g.guide["type"]+" Guide";p.id="ifixit-header-text";if(document.iFixitGuideWidget.options.large){o.appendChild(a)}else{l.appendChild(a)}var e=document.createElement("img");if(document.iFixitGuideWidget.options.large){e.setAttribute("src","http://static.ifixit.net/static/images/layout/logo.gif")}else{e=document.createElement("div")}e.id="ifixit-logo";var c=document.createElement("a");c.href="http://makeprojects.com"+g.url;c.appendChild(e);c.title="view on iFixit";if(document.iFixitGuideWidget.options.large){o.appendChild(c)}else{l.appendChild(c);l.appendChild(p)}d.appendChild(o)},displayStep:function(G,m){var l=G.guide["steps"][m];var p=G.guideid;var E="ifixit-embed-"+p;var x=document.getElementById(E);x.innerHTML="";var h=document.createElement("div");h.id="ifixit-header";x.appendChild(h);thumbs=document.createElement("div");thumbs.className="ifixit-stepThumbs";images=document.createElement("div");images.className="ifixit-stepImages";var d=document.iFixitGuideWidget.options.large?"thumbnail":"mini";var u=document.createElement("img");if(l.images.length>0){u.setAttribute("src",l.images[0]["text"]+".standard")}u.setAttribute("id","ifixit-stepImage");for(var v=0;v<l.images.length&&!isNaN(v);v++){var H=new Image();H.src=l.images[v]["text"]+".standard"}for(var v=0;v<l.images.length&&!isNaN(v);v++){if(v==0){var k=document.createElement("a");k.href="http://makeprojects.com/Guide/View/"+p+"/"+(m+1);k.appendChild(u);images.appendChild(k)}else{if(v>=3||isNaN(v)){break}}var H=document.createElement("img");H.setAttribute("src",l.images[v]["text"]+"."+d);H.className="ifixit-stepThumb";H.onmouseover=function(J){if(!J){J=window.event}var I=J.target||J.srcElement;var i=I.parentNode.parentNode.children[0].children[0];i.setAttribute("src",I.src.replace(d,"standard"))};thumbs.appendChild(H)}if(l.images.length==1){thumbs.setAttribute("style","visibility: hidden;")}images.appendChild(thumbs);var b=document.createElement("ul");b.className="ifixit-stepLines";for(var o=0;o<l.lines.length&&!isNaN(o);o++){if(l.lines[o]["text"]!=undefined){var s=document.createElement("li");var a=l.lines[o]["level"];var B=document.createElement("div");B.className="ifixit-bullet ifixit-bullet-"+l.lines[o]["bullet"];B.innerHTML="<!-- ie6 comment -->";s.appendChild(B);var F=/icon/i;if(F.test(l.lines[o]["bullet"])){var w=document.createElement("div");w.className="ifixit-icon ifixit-"+l.lines[o]["bullet"];w.innerHTML="<!-- ie6 comment -->";s.appendChild(w)}s.innerHTML=s.innerHTML+l.lines[o]["text"];var r=document.createElement("div");r.className="ifixit-clearer";r.innerHTML="<!-- ie6 comment -->";s.appendChild(r);s.className="ifixit-line-"+a;b.appendChild(s)}}var e=document.createElement("div");e.className="ifixit-stepText";var t=document.createElement("h3");if(document.iFixitGuideWidget.options.large){t.innerHTML="Step "+(m+1)+"/"+G.guide["steps"].length+" &mdash; "}var j=document.createElement("a");j.innerHTML=G.guide["title"];j.href="http://makeprojects.com"+G.url;t.appendChild(j);t.className="ifixit-stepTitle";e.appendChild(t);x.appendChild(images);e.appendChild(b);x.appendChild(e);var C=document.createElement("div");C.id="ifixit-footer";var n=document.createElement("div");var A;var g;if(document.iFixitGuideWidget.options.large){A=document.createElement("a");if(m>=(G.guide["steps"].length-1)){A.className="ifixit-buttonLink ifixit-buttonMuted";A.innerHTML="Restart &raquo;";A.onclick=function(){document.iFixitGuideWidget.display(G)}}else{A.className="ifixit-buttonLink";A.innerHTML="Next &raquo;";A.onclick=function(){document.iFixitGuideWidget.displayStep(G,(m+1))}}}else{A=document.createElement("div");A.className="ifixit-arrowNavRight";if(m>=(G.guide["steps"].length-1)){A.style.visibility="hidden"}else{A.onclick=function(){document.iFixitGuideWidget.displayStep(G,(m+1))};var D=function(){A.className=A.className=="ifixit-arrowNavRight"?"ifixit-arrowNavRightHover":"ifixit-arrowNavRight"};A.onmouseover=D;A.onmouseout=D}}if(document.iFixitGuideWidget.options.large){if(m>0){g=document.createElement("a");g.innerHTML="&laquo; Previous";g.className="ifixit-buttonLink";g.onclick=function(){document.iFixitGuideWidget.displayStep(G,(m-1))}}else{g=document.createElement("a");g.innerHTML="&laquo; Intro";g.className="ifixit-buttonLink ifixit-buttonMuted";g.onclick=function(){document.iFixitGuideWidget.display(G)}}}else{g=document.createElement("div");g.className="ifixit-arrowNavLeft";if(m>0){g.onclick=function(){document.iFixitGuideWidget.displayStep(G,(m-1))}}else{g.onclick=function(){document.iFixitGuideWidget.display(G)}}var D=function(){g.className=g.className=="ifixit-arrowNavLeft"?"ifixit-arrowNavLeftHover":"ifixit-arrowNavLeft"};g.onmouseover=D;g.onmouseout=D}n.appendChild(A);if(document.iFixitGuideWidget.options.small){var q=document.createElement("div");q.innerHTML="Step "+(m+1)+" of "+G.guide["steps"].length;q.id="ifixit-stepNumber";n.appendChild(q)}n.appendChild(g);n.id="ifixit-navigation";if(document.iFixitGuideWidget.options.large){C.appendChild(n)}else{h.appendChild(n)}var f=document.createElement("img");if(document.iFixitGuideWidget.options.large){f.setAttribute("src","http://static.ifixit.net/static/images/layout/logo.gif")}else{f=document.createElement("div")}f.id="ifixit-logo";var y=document.createElement("a");y.href="http://makeprojects.com"+G.url;y.title="view on iFixit";var c=document.createElement("div");c.innerHTML=G.guide["type"]=="teardown"?"Teardown":G.guide["type"]+" Guide";c.id="ifixit-header-text";y.appendChild(f);if(document.iFixitGuideWidget.options.large){C.appendChild(y)}else{h.appendChild(y);h.appendChild(c)}var z=document.createElement("div");z.id="ifixit-parts-link";if(document.iFixitGuideWidget.options.large){z.innerHTML="Parts &amp; Tools";z.onclick=function(){document.iFixitGuideWidget.displayTools(G,m)};C.appendChild(z);x.appendChild(C)}else{z.innerHTML="Parts &amp; tools for this guide";z.onclick=function(){document.iFixitGuideWidget.displayTools(G,m)};x.appendChild(z)}},displayTools:function(h,e){var l=h.guideid;var b="ifixit-embed-"+l;var d=document.getElementById(b);var p=document.createElement("div");p.id="ifixit-tools";var c=document.createElement("div");var k=document.createElement("h3");k.innerHTML="Tools:";c.appendChild(k);c.className="ifixit-parts";var j=document.createElement("ul");for(var g=0;g<h.guide["tools"].length&&!isNaN(g);g++){var o=document.createElement("li");var m=document.createElement("a");var f=document.createElement("img");f.setAttribute("src",h.guide["tools"][g]["thumbnail"]);m.href=h.guide["tools"][g]["url"];m.innerHTML=h.guide["tools"][g]["text"];o.appendChild(m);if(h.guide["tools"][g]["notes"]){o.innerHTML=o.innerHTML+" - "+h.guide["tools"][g]["notes"]}j.appendChild(o)}if(j.children.length==0){var o=document.createElement("li");o.innerHTML="None";j.appendChild(o)}c.appendChild(j);p.appendChild(c);var n=document.createElement("div");n.className="ifixit-parts";k=document.createElement("h3");k.innerHTML="Parts:";n.appendChild(k);j=document.createElement("ul");for(g=0;g<h.guide["parts"].length&&!isNaN(g);g++){var o=document.createElement("li");var m=document.createElement("a");var f=document.createElement("img");f.setAttribute("src",h.guide["parts"][g]["thumbnail"]);m.href=h.guide["parts"][g]["url"];m.innerHTML=h.guide["parts"][g]["text"];o.appendChild(m);if(h.guide["parts"][g]["notes"]){o.innerHTML=o.innerHTML+" - "+h.guide["parts"][g]["notes"]}j.appendChild(o)}if(j.children.length==0){var o=document.createElement("li");o.innerHTML="None";j.appendChild(o)}n.appendChild(j);p.appendChild(n);var q=document.createElement("div");q.id="ifixit-parts-link";q.innerHTML="Back to the guide";q.onclick=function(){document.iFixitGuideWidget.displayStep(h,e)};p.appendChild(q);d.appendChild(p)}}}document.iFixitGuideWidget.loaded=(function(){var c="http://makeprojects.com";var d=[];var f=document.getElementsByTagName("script");for(var h in f){var n=f[h];if(n.src&&n.src.search(/((ifixit)|(cominor)|(faranor))\.com\/Embed\/js/i)>-1){var o=document.iFixitGuideWidget.get_param("size",n.src);var m=document.iFixitGuideWidget.get_param("id",n.src);if(!document.iFixitGuideWidget.contains(document.iFixitGuideWidget.embeds,m)){d.push({script:f[h],guideid:m,size:o==""?"small":o});document.iFixitGuideWidget.embeds.push(m)}}}var l=document.getElementsByTagName("head")[0];for(var g in d){var m=d[g].guideid;var n=d[g].script;var o=d[g].size;var a="ifixit-embed-"+m;var e=document.getElementById(a);if(e==null&&m){e=document.createElement("div");e.id=a;n.parentNode.appendChild(e)}if(o=="small"){e.className="ifixit-guide ifixit-guide-small"}else{if(o=="large"){e.className="ifixit-guide ifixit-guide-large"}}var b=document.createElement("script");b.type="text/javascript";b.src=c+"/api/0.1/guide/"+m+"?jsonp=document.iFixitGuideWidget.display";l.appendChild(b)}if(!document.iFixitGuideWidget.loaded){var k=document.createElement("link");k.setAttribute("href","http://static.ifixit.net/static/embed/make-embed.css");k.setAttribute("rel","stylesheet");k.setAttribute("type","text/css");k.setAttribute("media","screen");l.appendChild(k)}return true})();