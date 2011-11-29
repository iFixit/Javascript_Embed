/**
 * VERSION: 3
 * This version of the embed javascript is designed to work with everything and is 100%
 * backward compatabile.
 *
 * Version 3 and above uses an attribute on the script tag itself
 *  <script data-dozuki-embed='3' ...></script>
 *
 * Version 2 and below uses a regex on the script src url
 * ============
 * Static (www.cominor, ifixit, dozuki, make)
 *   = Params can be in these formats
 *     #site=blah.com&id=9875    for new embeds where site is the actual domain for API access
 *     ?id=9875                  for old embeds, domain is determined by filename
 *   = URLs can be in these fomats
 *     == Domains
 *       cacher.dozuki.net
 *       *.(dozukilabs|cominor).com
 *     == Paths
 *       static/embed/
 *     == File names
 *       (make|ifixit)-embed.js  (if == make, API domain should be "makeprojects.com")
 *       ifixit-embed.2.js
 *
 * Example URLS
 *   http://www.cominor.com/static/embed/ifixit-embed.js?id=345
 *   http://www.ifixit.com/static/embed/ifixit-embed.js?id=345
 *   http://static.ifixit.net/static/embed/ifixit-embed.js?id=345
 *   http://static.ifixit.net/static/embed/make-embed.js?id=345
 *   http://cacher.dozuki.net/static/embed/ifixit-embed.js?id=345

 *   http://www.cominor.com/static/embed/ifixit-embed.2.js#site=www.cominor.com&id=345
 *   http://www.ifixit.com/static/embed/ifixit-embed.2.js#site=www.ifixit.com&id=345
 *   http://static.ifixit.net/static/embed/ifixit-embed.2.js#site=www.ifixit.com&id=345
 *   http://cacher.dozuki.net/static/embed/ifixit-embed.2.js#site=www.ifixit.com&id=345
 *   http://cacher.dozuki.net/static/embed/ifixit-embed.2.js#site=sitename.dozuki.com&id=345

 * Broken down regex
 *   \/(?:
          (?:cacher\.dozuki|static\.ifixit)\.net|
          [^\.]+\.(?:dozukilabs|cominor)\.com)
          .*
          (ifixit|make)-embed(?:\.2)?\.js

 * =============
 * Dynamically Generated JS paths (developer directories)
 *   http://*.(cominor|dozukilabs).com/Embed/js/2#site=blah.com&id=9875
*/

/**
 * iFixit Javascript Guide Embed Widget
 * Copyright iFixit 2011
 */
(function(){
var widget,
    libraryName = 'iFixitGuideWidgetV2',
    scriptTagIDPrefix = 'ifixit-embed-',
    scriptTagVersionAttribute = 'data-dozuki-embed',
    rightArrow = '&#x25B6;',
    leftArrow = '&#x25C0;';
    

if (document[libraryName]) {
   widget = document[libraryName];
} else {
   // This obviously gets executed only once per page
   // no matter how many times this script is included
   widget = document[libraryName] = (function(){
      var embeds = [];

      function initialize(script_id){
         return function(data){
            data.embed = embeds[script_id];
            new Embed(data);
         }
      }

      function Embed(data){
         var embed   = data.embed,
             guideid = data.guideid,
             root    = embed.elem,
             guideData   = data.guide || {},
             guideSteps  = guideData.steps || [],
             intro   = createIntro(),
             steps   = {intro:intro},
             previousStepid = null,
             currentStepid = null;

         root.appendChild(intro);
         displayPane('intro', false, true);
         
         function displayPane(id, backward, immediate) {
            if(!steps[id]){
               var pane = id == 'tools' ? createTools() : createStep(id);
               root.appendChild(pane);
               steps[id] = pane;
            }

            var pane = steps[id],
                positions = ['next', 'previous'];

            if(backward)
               positions.push(positions.shift());

            // The CSS class name to add to the upcoming pane before the 'current' class is applied
            var animateFromPosition = positions[0],
            // The CSS class name to add to the current pane to hide it
                animateToPosition = positions[1];

            // Move the current pane to the "To" position
            if (currentStepid !== null) {
               removeClassName(steps[currentStepid],  paneClass('current'));
               addClassName(   steps[currentStepid],  paneClass(animateToPosition));
            }

            // Ensure the upcoming pane is in the correct position
            removeClassName(pane,            paneClass(animateToPosition));
            addClassName(pane,               paneClass(animateFromPosition));

            // Allow the above CSS class changes to take effect, then move the upcoming pane
            // into the 'current' position
            function animate(){
               removeClassName(pane,         paneClass(animateFromPosition));
               addClassName(pane,            paneClass('current'));
            }

            // Applying the new CSS classes without waiting
            // skips the browsers built-in CSS transitions
            if(immediate)
               animate();
            else
               setTimeout(animate, 0);
            
            previousStepid = currentStepid;
            currentStepid = id;            
         }

      /**
       * The below functions have been slightly reworked to create a step/intro and return
       * the container element.  They still use terrible javascript from the original embed
       * and need to be redone entirely, but we'll leave that till we redesign the embed entirely
       * /
      
      /* For displaying intro. */
      function createIntro() {
         var elem     = createPane();

         // API error handling
         if (data.error) {
            if (!elem) {
               elem = createElement('div');
               elem.id = elemid;
            }

            elem.innerHTML = data.msg || '';
            return;
         }

         embed.large = embed.size == 'large';
         embed.small = embed.size == 'small';

         // Header
         var head = createElement('div');
         head.id = 'ifixit-header';
         elem.appendChild(head);

         var img,
             guideImage = guideData['image'];

         // TODO, our API returns imageid = 0 if there is no image,
         // this check obviously needs to change if that functionality does
         if (guideImage && guideImage.imageid != 0) {
            img = createElements({
               tag      : 'img',
               src      : guideImage['text'] + '.standard',
               id       : 'ifixit-stepIntroImage'
            });
         } else {
            img = createElements({
               id    :'ifixit-stepIntroImage',
               c     :'empty',
               html  :'No Image'
            });
         }

         elem.appendChild(img);

         var h1 = createElement('h1');
         h1.innerHTML = guideData['title'];

         var h1a = createElement('a');
         h1a.href = data['url'];
         h1a.className = 'ifixit-introHeader';

         h1a.appendChild(h1);
         elem.appendChild(h1a);

         var stepText = createElement('div');
         stepText.id = 'ifixit-summary';
         stepText.innerHTML = guideData['summary'] || '';
         elem.appendChild(stepText);

         // Footer
         var foot = createElement('div');
         foot.id = 'ifixit-footer';

         // Navigation
         var nav = createElements({id: 'ifixit-navigation'});

         if (embed.large) {
            nav.appendChild(createElements({
               tag      :'a',
               c        :"ifixit-buttonLink",
               html     :"Begin " + rightArrow
            }));
         } else {
            nav.appendChild(createElements({
               id    :'ifixit-begin',
               html  : guideSteps.length > 0 ? 'Begin ' + rightArrow : 'No Steps'
            }));
         }

         if (guideSteps.length > 0)
            nav.onclick = function() { displayPane(0); };

         var headerTxt = createElement('div');
         headerTxt.innerHTML = guideData['type'] == 'teardown' ? 'Teardown' : guideData['type'] + ' Guide';
         headerTxt.id = 'ifixit-header-text';

         if (embed.large)
            foot.appendChild(nav);
         else
            head.appendChild(nav);

         createLogo(data, function(logo){
            if (embed.large)
               foot.appendChild(logo);
            else {
               head.appendChild(logo);
               head.appendChild(headerTxt);
            }
         });

         elem.appendChild(foot);
         return elem;
      }

      function createStep(stepid) {
         var step       = guideSteps[stepid],
             stepImages = step['images'],
             elem       = createPane();

         // Header
         var head = createElement('div');
         head.id = 'ifixit-header';
         elem.appendChild(head);

         // Images
         thumbs = createElement('div');
         thumbs.className = 'ifixit-stepThumbs';

         images = createElement('div');
         images.className = 'ifixit-stepImages';

         var thumbnailSize = embed.large ? 'thumbnail' : 'mini',
             mainImg;

         if (stepImages.length > 0){
            mainImg = createElements({
               tag      :'img',
               src      :stepImages[0]['text'] + '.standard',
               c        :'ifixit-stepImage'
            });
         } else {
            images.appendChild(createElements({
               c        :'ifixit-stepImage empty',
               html     :'No Image'
            }));
         }

         // Preload all the big images...
         var img;
         for (var i = 0; i < stepImages.length && !isNaN(i); i++) {
            img = new Image();
            img.src = stepImages[i]['text'] + '.standard';
         }

         // The isNaN is because mootools does crazy shit w/ JSON.
         for (var imgid = 0; imgid < stepImages.length && !isNaN(imgid); imgid++) {
            if (imgid == 0) {
               var mainImgA = createElement('a');
               // TODO: Make clicking the image do something else, like maybe zoom the image
               //mainImgA.href = "http://www.ifixit.com" + '/Guide/View/' + guideid + '/' + (stepid + 1);
               mainImgA.appendChild(mainImg);
               images.appendChild(mainImgA);

            // Because of funkiness in jQuery and mootools
            } else if (imgid >= 3 || isNaN(imgid)) {
               break;
            }

            img = createElement('img');
            img.setAttribute('src', stepImages[imgid]['text'] + '.' + thumbnailSize);
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

         if (stepImages.length == 1)
            thumbs.setAttribute('style', 'visibility: hidden;');

         images.appendChild(thumbs);

         var lines = createElement('ul');
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
               var line = createElement('li');
               var level = step['lines'][lid]['level'];
               var bullet = createElement('div');
               bullet.className = 'ifixit-bullet ifixit-bullet-' + step['lines'][lid]['bullet'];
               bullet.innerHTML = '<!-- ie6 comment -->';
               line.appendChild(bullet);

               // Support for icons
               var iconr = /icon/i;
               if (iconr.test(step['lines'][lid]['bullet'])) {
                  var icon = createElement('div');
                  icon.className = 'ifixit-icon ifixit-' + step['lines'][lid]['bullet'];
                  icon.innerHTML = '<!-- ie6 comment -->';
                  line.appendChild(icon);
               }

               line.innerHTML = line.innerHTML + step['lines'][lid]['text'];

               // Clearer after each line
               var cl = createElement('div');
               cl.className = 'ifixit-clearer';
               cl.innerHTML = '<!-- ie6 comment -->';
               line.appendChild(cl);

               line.className = 'ifixit-line-' + level;
               lines.appendChild(line);
            }
         }

         var stepText = createElement('div');
         stepText.className = 'ifixit-stepText';

         var stepTitle = createElement('h3');
         if (embed.large)
            stepTitle.innerHTML = 'Step ' + (stepid + 1) + '/' + guideSteps.length + ' &mdash; ';
         var guideLink = createElement('a');
         guideLink.innerHTML = guideData['title'];
         guideLink.href = data['url'];
         stepTitle.appendChild(guideLink);
         stepTitle.className = 'ifixit-stepTitle';
         stepText.appendChild(stepTitle);

         // Depending on the widget, we order images and text differently.
         elem.appendChild(images);
         stepText.appendChild(lines);
         elem.appendChild(stepText);

         // Footer
         var foot = createElement('div');
         foot.id = 'ifixit-footer';

         // Navigation
         var nav = createElement('div');
         var right;
         var left;

         if (embed.large) {
            right = createElement('a');
            if (stepid >= (guideSteps.length-1)) {
               right.className = 'ifixit-buttonLink ifixit-buttonMuted';
               right.innerHTML = "Restart " + rightArrow;
               right.onclick = function() { displayPane('intro', true); };
            } else {
               right.className = 'ifixit-buttonLink';
               right.innerHTML = "Next " + rightArrow;
               right.onclick = function() { displayPane(stepid + 1); };
            }
         } else {
            right = createElement('div');
            right.innerHTML =  rightArrow;
            addClassName(right, "ifixit-arrowNavRight");

            if (stepid >= (guideSteps.length-1)) {
               right.style.visibility = "hidden";
            } else {
               right.onclick = function() { displayPane(stepid + 1); };
            }
         }

         if (embed.large) {
            if (stepid > 0) {
               left = createElement('a');
               left.innerHTML =  leftArrow +" Previous";
               left.className = 'ifixit-buttonLink';
               left.onclick = function() { displayPane(stepid - 1, true); };
            } else { // Intro button
               left = createElement('a');
               left.innerHTML =  leftArrow + " Intro";
               left.className = 'ifixit-buttonLink ifixit-buttonMuted';
               left.onclick = function() { displayPane('intro', true); };
            }
         } else {
            left = createElement('div');
            addClassName(left, "ifixit-arrowNavLeft");
            left.innerHTML = leftArrow;
            
            if (stepid > 0) {
               left.onclick = function() { displayPane(stepid - 1, true); };
            } else { // Intro button
               left.onclick = function() { displayPane('intro', true)};
            }
         }

         // Add navigation elements to footer/header
         nav.appendChild(right);

         if (embed.small) {
            var ntext = createElement('div');
            ntext.innerHTML = 'Step ' + (stepid + 1) + ' of ' + guideSteps.length;
            ntext.id = 'ifixit-stepNumber';
            nav.appendChild(ntext);
         }

         nav.appendChild(left);

         nav.id = 'ifixit-navigation';

         if (embed.large)
            foot.appendChild(nav);
         else
            head.appendChild(nav);

         var headerTxt = createElement('div');
         headerTxt.innerHTML = guideData['type'] == 'teardown' ? 'Teardown' : guideData['type'] + ' Guide';
         headerTxt.id = 'ifixit-header-text';

         createLogo(data, function(logo){
            if (embed.large)
               foot.appendChild(logo);
            else {
               head.appendChild(logo);
               head.appendChild(headerTxt);
            }
         })

         // Parts + Tools
         var ptLink = createElement('div');
         ptLink.id = 'ifixit-parts-link';

         function displayToolsPane() { displayPane('tools'); };
         if (embed.large) {
            ptLink.innerHTML = 'Parts &amp; Tools';
            ptLink.onclick = displayToolsPane;
            foot.appendChild(ptLink);
            elem.appendChild(foot);
         } else {
            ptLink.innerHTML = 'Parts &amp; tools for this guide';
            ptLink.onclick = displayToolsPane;
            elem.appendChild(ptLink);
         }
         
         return elem;
      }

      // Creates and returns a Tools pane
      function createTools() {
         var elem      = createPane();

         var modal = createElement('div');
         modal.id = 'ifixit-tools';

         var left = createElement('div');
         var h3 = createElement('h3');
         h3.innerHTML = 'Tools:';
         left.appendChild(h3);
         left.className = 'ifixit-parts';

         var ul = createElement('ul');
         var li, a, img;
         for (var i = 0; i < guideData['tools'].length && !isNaN(i); i++) {
            li = createElement('li');
            a = createElement('a');
            //img = createElement('img');

            //img.setAttribute('src', guideData['tools'][i]['thumbnail']);

            a.href = guideData['tools'][i]['url'];
            a.innerHTML = guideData['tools'][i]['text'];

            // Not everything has a img, ignoring for now.
            //li.appendChild(img);
            li.appendChild(a);

            if (guideData['tools'][i]['notes'])
               li.innerHTML = li.innerHTML + ' - ' + guideData['tools'][i]['notes'];

            ul.appendChild(li);
         }

         if (ul.children.length == 0) {
            li = createElement('li');
            li.innerHTML = 'None';
            ul.appendChild(li);
         }

         left.appendChild(ul);
         modal.appendChild(left);

         var right = createElement('div');
         right.className = 'ifixit-parts';
         h3 = createElement('h3');
         h3.innerHTML = 'Parts:';
         right.appendChild(h3);
         ul = createElement('ul');
         for (i = 0; i < guideData['parts'].length; i++) {
            var li  = createElement('li'),
                a   = createElement('a'),
                img = createElement('img');

            //img.setAttribute('src', guideData['parts'][i]['thumbnail']);
            a.href = guideData['parts'][i]['url'];
            a.innerHTML = guideData['parts'][i]['text'];

            //li.appendChild(img);
            li.appendChild(a);

            if (guideData['parts'][i]['notes'])
               li.innerHTML = li.innerHTML + ' - ' + guideData['parts'][i]['notes'];

            ul.appendChild(li);
         }

         if (ul.children.length == 0) {
            li = createElement('li');
            li.innerHTML = 'None';
            ul.appendChild(li);
         }

         right.appendChild(ul);
         modal.appendChild(right);

         var close = createElement('div');
         close.id = 'ifixit-parts-link';
         close.innerHTML = "Back to the guide";
         close.onclick = function() { displayPane(previousStepid, true); };
         modal.appendChild(close);

         elem.appendChild(modal);
         return elem;
      }
      }
      

      // Stores functions that create and return a logo (and link), keyed by site name
      // it's only used by the below function.
      var logoCreators = {};      
      // Creates a logo for the specific site and passes it to the callback
      // The created element might be <a><img</a> or <a><span></a> depending on whether a logo
      // exists for this domain.
      function createLogo(data, callback){
         var embed = data.embed;

         if(!logoCreators[embed.site]){
            var logo = createElement('img');

            testLoadImage({
               img: logo,
               src: logoImageSrc(),
               container: embed.elem,

               failure: function onError(){
                  removeElement(logo);
                  logoCreators[embed.site] = createTextLogo;
                  finished();
               },

               success: function onSuccess(){
                  removeElement(logo);
                  logoCreators[embed.site] = createImageLogo;
                  // since we already created a logo image, pass that through
                  finished(logo);
               }
            });
         } else {
            finished();
         }

         // executes the callback with the results from running the logoCreator function
         // and optionally passes the logoOverride object through
         function finished(logoOverride){
            return callback(logoCreators[embed.site](logoOverride));
         }

         function createLogoLink(){
            var link = createElement('a');
            link.href = data['url'];
            link.title = "";
            addClassName(link,'ifixit-logo');

            return link;
         }

         function createTextLogo(){
            var logo = createElement('span'),
            logoa = createLogoLink();

            // TODO: This sucks  and needs to be different
            logo.innerHTML = domainToName(embed.site);

            logoa.appendChild(logo);
            addCSS("http://fonts.googleapis.com/css?family=Lobster");

            return logoa;
         }

         function createImageLogo(logoOverride){
            var logo = logoOverride || createElement('img'),
            logoa = createLogoLink();

            logo.className = 'ifixit-logo';
            logo.src = logoImageSrc();
            logoa.appendChild(logo);
            return logoa;
         }

         function logoImageSrc(){
            return 'http://cacher.dozuki.net/static/images/logos/[DOMAIN].png'.replace('[DOMAIN]', domainToName(embed.site));
         }

         // Turns a domain into a name
         // www.ifixit.com -> ifixit
         // blah.dozuki.com -> blah
         // makeprojects.com -> makeprojects
         // blah.cominor.com -> cominor
         function domainToName(domain){
            var name = domain.replace('www.', '');
            return name.match(/^([^\.]*)/)[1].toLowerCase();
         }
      }

      // This is the public API of our embed widget
      return {
         initialize  : initialize,
         embeds      : embeds
      };
   })()
}

// There is only one capturing subgroup (ifixit|make) which is only for compatibility with
// V1 embeds.  This leaves the version number as optional to work with v1 embeds.
// See the top of this script for human readable versions of the script URLs we are looking for
var live_regex = /\/(?:(?:cacher\.dozuki|static\.ifixit)\.net|[^\.]+\.(?:dozukilabs|cominor)\.com).*(ifixit|make)-embed(?:\.2)?\.js/,
    dev_regex  = /\/[^\.]+.(?:cominor|dozukilabs)\.com\/Embed\/js\/2/;


// Try to set the src of an image, if it generates a 404, this calls cfg.failure(), otherwise
// it calls cfg.success()
// cfg = {
//    img       : DOMElement (img)
//    container : DOMElement to add the image to
//    src       : url of the image to add
//    success   : function to call if the image loads
//    failure   : function to call if the image fails to load
// }
function testLoadImage(cfg){
   var prop, img = cfg.img;
   
   prop = isType(img.naturalWidth,'u') ? 'width' : 'naturalWidth';
   
   // Add the image and insert if requested (must be on DOM to load or
   // pull from cache)
   img.src = cfg.src;   
   cfg.container.appendChild(img);
   
   // Loaded?
   if (img.complete) {
      if (img[prop]) {
         if (isType(cfg.success,'f')) {
            cfg.success.call(img);
         }
      } else {
         if (isType(cfg.failure,'f')) {
            cfg.failure.call(img);
         }
      }
   } else {
      if (isType(cfg.success,'f')) {
         img.onload = cfg.success;
      }
      if (isType(cfg.failure,'f')) {
         img.onerror = cfg.failure;
      }
   }
   
   return img;

   function isType(o,t) {
      return (typeof o).indexOf(t.charAt(0).toLowerCase()) === 0;
   }
}

function addCSS(url){
   var loaded = (widget.cssFiles = widget.cssFiles || {});

   // Only embed the CSS on the first time through.
   if (!loaded[url]) {
      loaded[url] = true;
      var link = createElement("link");
      link.href = url;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.media = "screen";
      head().appendChild(link);
   }
}

function head(){
   return document.getElementsByTagName("head")[0];
}

// Gets a query parameter from a URL.
// The parameter is allowed to be traditional OR come AFTER the hash
// i.e. both of these work fine: http://blah.com?name=value#name2=value2
function get_param(name, url) {
   name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
   var regexS = "[\\?&#]"+name+"=([^&#]*)";
   var regex = new RegExp(regexS);
   var results = regex.exec(url);
   return results == null ? "" : results[1];
}

// This is used when iterating over properties in an object, to ensure we can check if
// a property is actually used in the object, vs it's prototype chain
var hasOwnProperty = function(obj, prop){
   var proto = obj.__proto__ || obj.constructor.prototype;
   return (prop in obj) &&
      (!(prop in proto) || proto[prop] !== obj[prop]);
}
// if the native version exists, use that
if(Object.prototype.hasOwnProperty){
   hasOwnProperty = function(obj, prop){
      return obj.hasOwnProperty(prop);
   }
}

function createElement(tag){
   return document.createElement(tag);
}

function createPane(){
   var element = createElement('div');
   addClassName(element, 'ifixit-pane');
   addClassName(element, paneClass('next'));
   return element;
}

function paneClass(type){
   return 'ifixit-pane-' + type;
}

// CSS Class name utility functions
function addClassName(el, classname){
   if(!el.className.match(classNameMatcher(classname)))
      el.className +=  ' ' + classname; 
}

function removeClassName(el, classname){
   var regex = classNameMatcher(classname);
   el.className = el.className.replace(regex, ' ');
}

function classNameMatcher(name){
   return new RegExp('(?:^|\\s+)' + name + '(?:$|\\s+)', 'g');
}


function removeElement(el){
   if (el.parentNode)
      el.parentNode.removeChild(el);
}

function removeChildren(node){
   while (node.hasChildNodes()) {
       node.removeChild(node.lastChild);
   }
}

// Do the actual work, this gets run each time the script is included
(function() {
   var embeds    = widget.embeds,
       scripts   = document.getElementsByTagName("script");

   var guideid, script, size;
   for (var i = 0; i < scripts.length; i++) {
      // Look for the ifixit include...
      var script = scripts[i],
            // this allows us to test embeds and script url matching with whatever path
            // we want while still using the path to the dynamic JS
          src = script.getAttribute('devsrc') || script.src;

      if (!src) continue;
      var liveMatch = src.match(live_regex),
         // This is for embed version 3 and above. A much easier way, instead
         // of regexing the src URL
         embedVersion = script.getAttribute(scriptTagVersionAttribute);

      if (embedVersion || (liveMatch || src.match(dev_regex))
         // this part ensures that this script tag is not added to the list more than once
         && String(script.id).indexOf(scriptTagIDPrefix) != 0) {
         var size = get_param('size', src),
         guideid = get_param('id', src),
         site = get_param('site', src) || nameToDomain((liveMatch && liveMatch[1]) || 'ifixit'),
         id = scriptTagIDPrefix + Math.floor(Math.random()*10000000);

         // Mark this script tag as added to the list
         script.id = id;

         embeds[id] = {
            script: scripts[i],
            guideid: guideid,
            site: site,
            size: size == "" ? 'small' : size
         };
      }
   }

   var head = document.getElementsByTagName("head")[0];

   // It's best if we keep the CSS version and embed JS version synchronized
   // it make generation and tracking a bit easier
   addCSS("http://cacher.dozuki.net/static/embed/ifixit-embed.3.css");
   
   // Give the browser a chance to continue loading the page
   setTimeout(function(){
   for (var script_id in embeds){
      // This is because some js libraries add properties to Object.prototype that would
      // show up in this loop
      if(!hasOwnProperty(embeds, script_id)) continue;

      var embed = embeds[script_id];

      // Check if this embed has already be processed
      if(embed.done) continue;
      embed.done = true;

      embed.elem = createElement('div');
      embed.script.parentNode.insertBefore(embed.elem, embed.script);

      addClassName(embed.elem, "ifixit-guide");
      if(embed.size) addClassName(embed.elem, "ifixit-guide-" + embed.size);

      var base = 'http://' + embed.site,
          js = createElement('script');

      js.type = 'text/javascript';
      // This literally passes a function call as the JSONP parameter
      // upon being included, the api response is JS like this:
      // document.iFixitGuideWidgetV2.initialize('f4f834hfklsej')({...})
      js.src = base + "/api/0.1/guide/" + embed.guideid +
        "?jsonp=document."+libraryName+".initialize('"+script_id+"')";
      js.async = true;
      head.appendChild(js);
   }
   },0);

   return true;

   // This is primarily used for compatability with version 1 embeds (no dozuki necessary)
   // we have to transform a site name (make or ifixit) into the domain actually used
   // for the guide API call
   function nameToDomain(name){
      if (name == 'make')
         name = 'makeprojects.com';
      else
         name = 'www.ifixit.com';
      return name;
   }

})();


/**
 * Helper function to create a DOM structure
 *
 * Pass it an object like the following:
 *
 * config = {
 *    tag: 'span', // not required, defaults to 'div'
 *    c  : 'list_of css-classes', // not required
 *    // All other properties will be passed straight through to new Element(...)
 *    children : [array of DOM elements or config objects that will be passed to this function]
 * }
 */
function createElements(config){
   if (typeof(config) === 'string') {
      return document.createTextNode(config);
   }

   // If this is already a DOM element, just return it;
   if (config.tagName) return config;

   // parameters with special meanings
   var children   = config.children,
       tag        = config.tag,
       html       = config.html,
       className  = config.c;

   // Don't want these getting through as attributes
   delete config.children;
   delete config.tag;
   delete config.c;
   delete config.html;

   var el = createElement(tag || 'div');

   if (className) {
      el.className = className;
   }

   if (html) {
      el.innerHTML = html;
   }

   for (var k in config) {
      if (!hasOwnProperty(config, k))
         continue;

      el.setAttribute(k, config[k]);
   }

   if (children) {
      for (var i = 0; i < children.length; i++) {
         el.appendChild(createElements(children[i]));
      }
   }

   return el;
}

})();
