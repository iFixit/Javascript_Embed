/**
 * iFixit Javascript Guide Embed Widget
 * Copyright iFixit 2010
 * @version 0.42
 * @author Nat Welch (nat@ifixit.com)
 */
if (!document.iFixitGuideWidget) {
   document.iFixitGuideWidget = {
      embeds: [],

      options: {
         large: true,
         small: false
      },

      contains: function(a, obj) {
         var i = a.length;
         while (i--)
            if (a[i] === obj)
               return true;
         return false;
      },

      get_param: function(name, url) {
         name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
         var regexS = "[\\?&]"+name+"=([^&#]*)";
         var regex = new RegExp(regexS);
         var results = regex.exec(url);
         return results == null ? "" : results[1];
      },

      /* For displaying intro. */
      display: function(data) {
         var guideid = data['guideid'];
         var elemid = 'ifixit-embed-' + guideid;
         var elem = document.getElementById(elemid); // Base element for everything

         // API error handling
         if (data['error']) {
            if (!elem) {
               elem = document.createElement('div');
               elem.id = elemid;
            }

            elem.innerHTML = data['msg'];
            return;
         }

         elem.innerHTML = ''; // Zero out the div basically...

         elem.hasClass = function(cname) {
            var regx = new RegExp("\\b" + cname + "\\b");
            return regx.test(elem.className);
         };

         document.iFixitGuideWidget.options.large = elem.hasClass('ifixit-guide-large');
         document.iFixitGuideWidget.options.small = elem.hasClass('ifixit-guide-small');

         // Header
         var head = document.createElement('div');
         head.id = 'ifixit-header';
         elem.appendChild(head);

         var img = document.createElement('img');
         img.setAttribute('src', data['guide']['image']['text'] + '.standard');
         img.id = 'ifixit-stepIntroImage';
         elem.appendChild(img);

         var h1 = document.createElement('h1');
         h1.innerHTML = data['guide']['title'];
         h1.id = 'ifixit-introHeader';
         elem.appendChild(h1);

         var stepText = document.createElement('div');
         stepText.id = 'ifixit-summary';
         stepText.innerHTML = data['guide']['summary'];
         elem.appendChild(stepText);

         // Footer
         var foot = document.createElement('div');
         foot.id = 'ifixit-footer';

         // Navigation
         var nav = document.createElement('div');
         var right = document.createElement('a');
         var ntext;

         if (document.iFixitGuideWidget.options.large) {
            right.innerHTML = "Begin &raquo;";
            right.className = "ifixit-buttonLink";
         } else {
            ntext = document.createElement('div');
            ntext.innerHTML = 'Begin';
            ntext.id = 'ifixit-begin';

            right = document.createElement('div');
            right.className = "ifixit-arrowNavRight";
            var hover = function() {
               right.className = right.className == "ifixit-arrowNavRight" ? "ifixit-arrowNavRightHover" : "ifixit-arrowNavRight"; 
            };

            nav.onmouseover = hover;
            nav.onmouseout = hover;
         }

         nav.onclick = function() { document.iFixitGuideWidget.displayStep(data, 0); };
         nav.appendChild(right);
         nav.appendChild(ntext);
         nav.id = 'ifixit-navigation';

         var headerTxt = document.createElement('div');
         headerTxt.innerHTML = data['guide']['type'] == 'teardown' ? 'Teardown' : data['guide']['type'] + ' Guide';
         headerTxt.id = 'ifixit-header-text';

         if (document.iFixitGuideWidget.options.large)
            foot.appendChild(nav);
         else
            head.appendChild(nav);

         // Logo
         var logo = document.createElement('img');
         if (document.iFixitGuideWidget.options.large)
            logo.setAttribute('src', 'http://static.ifixit.net/static/images/layout/logo.gif');
         else
            logo = document.createElement('div');

         logo.id = 'ifixit-logo';
         var logoa = document.createElement('a');
         logoa.href = 'http://www.ifixit.com' + data['url'];

         logoa.appendChild(logo);
         logoa.title = "view on iFixit";

         if (document.iFixitGuideWidget.options.large)
            foot.appendChild(logoa);
         else {
            head.appendChild(logoa);
            head.appendChild(headerTxt);
         }

         elem.appendChild(foot);
      },

      // For displaying steps
      displayStep: function(data, stepid) {
         var step = data['guide']['steps'][stepid];
         var guideid = data['guideid'];
         var elemid = 'ifixit-embed-' + guideid;
         var elem = document.getElementById(elemid);

         elem.innerHTML = ''; // Zero out the div basically...

         // Header
         var head = document.createElement('div');
         head.id = 'ifixit-header';
         elem.appendChild(head);

         // Images
         thumbs = document.createElement('div');
         thumbs.className = 'ifixit-stepThumbs';

         images = document.createElement('div');
         images.className = 'ifixit-stepImages';

         var thumbnailSize = document.iFixitGuideWidget.options.large ? 'thumbnail' : 'mini';
         var mainImg = document.createElement('img');
         if (step['images'].length > 0)
            mainImg.setAttribute('src', step['images'][0]['text'] + '.standard');
         mainImg.setAttribute('id', 'ifixit-stepImage');

         // Preload all the big images...
         for (var i = 0; i < step['images'].length && !isNaN(i); i++) {
            var img = new Image();
            img.src = step['images'][i]['text'] + '.standard';
         }

         // The isNaN is because mootools does crazy shit w/ JSON.
         for (var imgid = 0; imgid < step['images'].length && !isNaN(imgid); imgid++) {
            if (imgid == 0) {
               var mainImgA = document.createElement('a');
               mainImgA.href = 'http://www.ifixit.com' + '/Guide/View/' + guideid + '/' + (stepid + 1);
               mainImgA.appendChild(mainImg);
               images.appendChild(mainImgA);

            // Because of funkiness in jQuery and mootools
            } else if (imgid >= 3 || isNaN(imgid)) { 
               break;
            }

            var img = document.createElement('img');
            img.setAttribute('src', step['images'][imgid]['text'] + '.' + thumbnailSize);
            img.className = 'ifixit-stepThumb';
            img.onmouseover = function(e) {
               // NOTE: targ stuff for ie support.
               if (!e) e = window.event;
               var targ = e.target || e.srcElement;
               // Can't search by ID, this could be embeded multiple times
               var big = targ.parentNode.parentNode.children[0].children[0];
               big.setAttribute('src', targ.src.replace(thumbnailSize, 'standard'));
            };

            thumbs.appendChild(img);
         }

         if (step['images'].length == 1)
            thumbs.setAttribute('style', 'visibility: hidden;');

         images.appendChild(thumbs);

         var lines = document.createElement('ul');
         lines.className = 'ifixit-stepLines';

         /* TODO: Make lines smarter. Like Shawn says:
         <Shawn Tice 3:26 PM> For building a tree of nested uls, you'll start with
         a ul.  For each line, if the line's level is the same as the current
         level, then you add a new li. If the line's level is higher than the
         current level, then you add a ul to the last li and add the line as the
         first li in that new ul. If the line's level is lower than the current
         level, then you back up the tree until you reach an li of the same level,
         and add a new li after that.  */
         for (var lid = 0; lid < step['lines'].length && !isNaN(lid); lid++) {
            if (step['lines'][lid]['text'] != undefined) {
               var line = document.createElement('li');
               var level = step['lines'][lid]['level'];
               var bullet = document.createElement('div');
               bullet.className = 'ifixit-bullet ifixit-bullet-' + step['lines'][lid]['bullet'];
               bullet.innerHTML = '<!-- ie6 comment -->';
               line.appendChild(bullet);

               // Support for icons
               var iconr = /icon/i;
               if (iconr.test(step['lines'][lid]['bullet'])) {
                  var icon = document.createElement('div');
                  icon.className = 'ifixit-icon ifixit-' + step['lines'][lid]['bullet'];
                  icon.innerHTML = '<!-- ie6 comment -->';
                  line.appendChild(icon);
               }

               line.innerHTML = line.innerHTML + step['lines'][lid]['text'];

               // Clearer after each line
               var cl = document.createElement('div');
               cl.className = 'ifixit-clearer';
               cl.innerHTML = '<!-- ie6 comment -->';
               line.appendChild(cl);

               line.className = 'ifixit-line-' + level;
               lines.appendChild(line);
            }
         }

         var stepText = document.createElement('div');
         stepText.className = 'ifixit-stepText';

         var stepTitle = document.createElement('h3');
         if (document.iFixitGuideWidget.options.large)
            stepTitle.innerHTML = 'Step ' + (stepid + 1) + '/' + data['guide']['steps'].length + ' &mdash; ';
         var guideLink = document.createElement('a');
         guideLink.innerHTML = data['guide']['title'];
         guideLink.href = 'http://www.ifixit.com' + data['url'];
         stepTitle.appendChild(guideLink);
         stepTitle.className = 'ifixit-stepTitle';
         stepText.appendChild(stepTitle);

         // Depending on the widget, we order images and text differently.
         elem.appendChild(images);
         stepText.appendChild(lines);
         elem.appendChild(stepText);

         // Footer
         var foot = document.createElement('div');
         foot.id = 'ifixit-footer';

         // Navigation
         var nav = document.createElement('div');
         var right;
         var left;

         if (document.iFixitGuideWidget.options.large) {
            right = document.createElement('a');
            if (stepid >= (data['guide']['steps'].length-1)) {
               right.className = 'ifixit-buttonLink ifixit-buttonMuted';
               right.innerHTML = "Restart &raquo;";
               right.onclick = function() { document.iFixitGuideWidget.display(data); };
            } else {
               right.className = 'ifixit-buttonLink';
               right.innerHTML = "Next &raquo;";
               right.onclick = function() { document.iFixitGuideWidget.displayStep(data, (stepid + 1)); };
            }
         } else {
            right = document.createElement('div');
            right.className = "ifixit-arrowNavRight";

            if (stepid >= (data['guide']['steps'].length-1)) {
               right.style.visibility = "hidden";
               // right.onclick = function() { document.iFixitGuideWidget.display(data); };
            } else {
               right.onclick = function() { document.iFixitGuideWidget.displayStep(data, (stepid + 1)); };
               var hover = function() {
                  right.className = right.className == "ifixit-arrowNavRight" ? "ifixit-arrowNavRightHover" : "ifixit-arrowNavRight"; 
               };

               right.onmouseover = hover;
               right.onmouseout = hover;
            }
         }

         if (document.iFixitGuideWidget.options.large) {
            if (stepid > 0) {
               left = document.createElement('a');
               left.innerHTML = "&laquo; Previous";
               left.className = 'ifixit-buttonLink';
               left.onclick = function() { document.iFixitGuideWidget.displayStep(data, (stepid - 1)); };
            } else { // Intro button
               left = document.createElement('a');
               left.innerHTML = "&laquo; Intro";
               left.className = 'ifixit-buttonLink ifixit-buttonMuted';
               left.onclick = function() { document.iFixitGuideWidget.display(data); };
            }
         } else {
            left = document.createElement('div');
            left.className = "ifixit-arrowNavLeft";

            if (stepid > 0) {
               left.onclick = function() { document.iFixitGuideWidget.displayStep(data, (stepid - 1)); };
            } else { // Intro button
               left.onclick = function() { document.iFixitGuideWidget.display(data); };
            }

            var hover = function() {
               left.className = left.className == "ifixit-arrowNavLeft" ? "ifixit-arrowNavLeftHover" : "ifixit-arrowNavLeft"; 
            };

            left.onmouseover = hover;
            left.onmouseout = hover;
         }

         // Add navigation elements to footer/header
         nav.appendChild(right);

         if (document.iFixitGuideWidget.options.small) {
            var ntext = document.createElement('div');
            ntext.innerHTML = 'Step ' + (stepid + 1) + ' of ' + data['guide']['steps'].length;
            ntext.id = 'ifixit-stepNumber';
            nav.appendChild(ntext);
         }

         nav.appendChild(left);

         nav.id = 'ifixit-navigation';

         if (document.iFixitGuideWidget.options.large)
            foot.appendChild(nav);
         else
            head.appendChild(nav);

         // Logo
         var logo = document.createElement('img');
         if (document.iFixitGuideWidget.options.large)
            logo.setAttribute('src', 'http://static.ifixit.net/static/images/layout/logo.gif');
         else
            logo = document.createElement('div');
         logo.id = 'ifixit-logo';
         var logoa = document.createElement('a');
         logoa.href = 'http://www.ifixit.com' + data['url'];
         logoa.title = "view on iFixit";

         var headerTxt = document.createElement('div');
         headerTxt.innerHTML = data['guide']['type'] == 'teardown' ? 'Teardown' : data['guide']['type'] + ' Guide';
         headerTxt.id = 'ifixit-header-text';

         logoa.appendChild(logo);
         if (document.iFixitGuideWidget.options.large)
            foot.appendChild(logoa);
         else {
            head.appendChild(logoa);
            head.appendChild(headerTxt);
         }

         // Parts + Tools
         var ptLink = document.createElement('div');
         ptLink.id = 'ifixit-parts-link';

         if (document.iFixitGuideWidget.options.large) {
            ptLink.innerHTML = 'Parts &amp; Tools';
            ptLink.onclick = function() { document.iFixitGuideWidget.displayTools(data, stepid); };
            foot.appendChild(ptLink);
            elem.appendChild(foot);
         } else {
            ptLink.innerHTML = 'Parts &amp; tools for this guide';
            ptLink.onclick = function() { document.iFixitGuideWidget.displayTools(data, stepid); };
            elem.appendChild(ptLink);
         }
      },

      displayTools: function(data, stepid) {
         var guideid = data['guideid'];
         var elemid = 'ifixit-embed-' + guideid;
         var elem = document.getElementById(elemid);

         var modal = document.createElement('div');
         modal.id = 'ifixit-tools';

         var left = document.createElement('div');
         var h3 = document.createElement('h3');
         h3.innerHTML = 'Tools:';
         left.appendChild(h3);
         left.className = 'ifixit-parts';

         var ul = document.createElement('ul');
         for (var i = 0; i < data['guide']['tools'].length && !isNaN(i); i++) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            var img = document.createElement('img');

            img.setAttribute('src', data['guide']['tools'][i]['thumbnail']);

            a.href = data['guide']['tools'][i]['url'];
            a.innerHTML = data['guide']['tools'][i]['text'];
            
            // Not everything has a img, ignoring for now.
            //li.appendChild(img);
            li.appendChild(a);

            if (data['guide']['tools'][i]['notes'])
               li.innerHTML = li.innerHTML + ' - ' + data['guide']['tools'][i]['notes'];

            ul.appendChild(li);
         }

         if (ul.children.length == 0) {
            var li = document.createElement('li');
            li.innerHTML = 'None';
            ul.appendChild(li);
         }

         left.appendChild(ul);
         modal.appendChild(left);

         var right = document.createElement('div');
         right.className = 'ifixit-parts';
         h3 = document.createElement('h3');
         h3.innerHTML = 'Parts:';
         right.appendChild(h3);
         ul = document.createElement('ul');
         for (i = 0; i < data['guide']['parts'].length && !isNaN(i); i++) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            var img = document.createElement('img');

            img.setAttribute('src', data['guide']['parts'][i]['thumbnail']);
            a.href = data['guide']['parts'][i]['url'];
            a.innerHTML = data['guide']['parts'][i]['text'];

            //li.appendChild(img);
            li.appendChild(a);

            if (data['guide']['parts'][i]['notes'])
               li.innerHTML = li.innerHTML + ' - ' + data['guide']['parts'][i]['notes'];

            ul.appendChild(li);
         }

         if (ul.children.length == 0) {
            var li = document.createElement('li');
            li.innerHTML = 'None';
            ul.appendChild(li);
         }

         right.appendChild(ul);
         modal.appendChild(right);

         var close = document.createElement('div');
         close.id = 'ifixit-parts-link';
         close.innerHTML = "Back to the guide";
         close.onclick = function() { document.iFixitGuideWidget.displayStep(data, stepid); };
         modal.appendChild(close);

         elem.appendChild(modal);
      }
   };
}

// Do the actual work
document.iFixitGuideWidget.loaded = (function() {
   var base = "http://www.ifixit.com";
   var embeds = [];

   var script_regex = /((ifixit|cominor|makeprojects)\.com\/Embed\/js)|((static\.ifixit\.net|cominor\.com)\/static\/embed\/\w+-embed(\.uncompressed)?\.js)/i;

   var scripts = document.getElementsByTagName("script");

   for (var i in scripts) {
      // Look for the ifixit include...
      var script = scripts[i];
      if (script.src && script.src.search(script_regex) > -1) {
         var size = document.iFixitGuideWidget.get_param('size', script.src);
         var guideid = document.iFixitGuideWidget.get_param('id', script.src);
         if (!document.iFixitGuideWidget.contains(document.iFixitGuideWidget.embeds, guideid)) {
            embeds.push({
               script: scripts[i],
               guideid: guideid,
               size: size == "" ? 'small' : size
            });

            document.iFixitGuideWidget.embeds.push(guideid);
         }
      }
   }

   var head = document.getElementsByTagName("head")[0];
   for (var j in embeds) {
      var guideid = embeds[j].guideid;
      var script = embeds[j].script;
      var size = embeds[j].size;

      // Let users specify their own div.
      var elemid = 'ifixit-embed-' + guideid;
      var elem = document.getElementById(elemid);

      if (elem == null && guideid) {
         elem = document.createElement('div');
         elem.id = elemid;
         script.parentNode.appendChild(elem);
      }

      if (!guideid)
         return false;

      if (size == 'small')
         elem.className = 'ifixit-guide ifixit-guide-small';
      else if (size == 'large')
         elem.className = 'ifixit-guide ifixit-guide-large';

      var js = document.createElement('script');
      js.type = 'text/javascript';
      js.src = base + "/api/0.1/guide/" + guideid + "?jsonp=document.iFixitGuideWidget.display";

      head.appendChild(js);

      // Needs to be in this loop to be embedable via a js post page load. 
      // Why? I don't know.
      if (!document.iFixitGuideWidget.loaded) {
         var link = document.createElement("link");
         link.href = "http://static.ifixit.net/static/embed/ifixit-embed.css";
         link.rel = "stylesheet";
         link.type = "text/css";
         link.media = "screen";
         head.appendChild(link);
      }
   }

   return true;
})();