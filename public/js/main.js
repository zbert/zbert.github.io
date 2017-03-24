(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * JavaScript Templates
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/* global define */

;(function ($) {
  'use strict'
  var tmpl = function (str, data) {
    var f = !/[^\w\-\.:]/.test(str)
      ? tmpl.cache[str] = tmpl.cache[str] || tmpl(tmpl.load(str))
      : new Function(// eslint-disable-line no-new-func
        tmpl.arg + ',tmpl',
        'var _e=tmpl.encode' + tmpl.helper + ",_s='" +
          str.replace(tmpl.regexp, tmpl.func) + "';return _s;"
      )
    return data ? f(data, tmpl) : function (data) {
      return f(data, tmpl)
    }
  }
  tmpl.cache = {}
  tmpl.load = function (id) {
    return document.getElementById(id).innerHTML
  }
  tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g
  tmpl.func = function (s, p1, p2, p3, p4, p5) {
    if (p1) { // whitespace, quote and backspace in HTML context
      return {
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        ' ': ' '
      }[p1] || '\\' + p1
    }
    if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
      if (p2 === '=') {
        return "'+_e(" + p3 + ")+'"
      }
      return "'+(" + p3 + "==null?'':" + p3 + ")+'"
    }
    if (p4) { // evaluation start tag: {%
      return "';"
    }
    if (p5) { // evaluation end tag: %}
      return "_s+='"
    }
  }
  tmpl.encReg = /[<>&"'\x00]/g // eslint-disable-line no-control-regex
  tmpl.encMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  }
  tmpl.encode = function (s) {
    return (s == null ? '' : '' + s).replace(
      tmpl.encReg,
      function (c) {
        return tmpl.encMap[c] || ''
      }
    )
  }
  tmpl.arg = 'o'
  tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
                  ',include=function(s,d){_s+=tmpl(s,d);}'
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return tmpl
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = tmpl
  } else {
    $.tmpl = tmpl
  }
}(this))

},{}],2:[function(require,module,exports){
var brewView = (function() {
	'use strict';

	var tmpl = require('blueimp-tmpl'),
		view  = $('#brew').find('.brew-body')[0],
		brewJson,
		initialize,
		compile;


	compile =  function(brewName) {

		view.innerHTML = tmpl('tmpl-brew', brewJson[brewName]);

	};

	initialize = function() {
		brewJson = initialJsonData;
	};

	return {
		init: initialize,
		template: compile
	};
})();

module.exports = brewView;
},{"blueimp-tmpl":1}],3:[function(require,module,exports){
var brewView = (function(){
	'use strict';

	var initBrewView,
		showBrewDetail,
		closeBrewDetail,
		$brewPage,
		
		isAnimating = false,
		showBrewClass = 'show-brew-overlay',

		brewCompile = require('./brew-compile');


	closeBrewDetail = function(){

		$('body').removeClass(showBrewClass);

		$brewPage.off('click.brewClose');

		isAnimating = true;
					
	};

	showBrewDetail = function($link, brewName){

		$('body').addClass(showBrewClass);

		brewCompile.template(brewName);

		$brewPage.on('click.brewClose', '.js-close-brew', function(ev){
			ev.preventDefault;
			ev.stopPropagation;

			closeBrewDetail();
		});
	};

	initBrewView = function() {
		
		$('#beer-grid').on('click', '.js-brew-link', function(ev){
			ev.preventDefault;
			ev.stopPropagation;

			var beerId = this.getAttribute('href');
			beerId = beerId.slice(1);

			showBrewDetail($(this), beerId);
		});

		$brewPage = $('#brew');

		brewCompile.init();
		
	};


	return {
		init: initBrewView
	};


})();

module.exports = brewView;
},{"./brew-compile":2}],4:[function(require,module,exports){
var fullpage =  (function(){
    'use strict';

    var customNextSlideLogic,
        showLogoPieceTransition,
        resumeFullpage,
        deactivateFullpage,
        initialize,

        overlayClassForward = 'show-logo-overlay',
        overlayClassInverse = 'show-logo-overlay-inverse',
        overlayClass = 'show-logo-overlay',
        isTransitioning =  false,
        forcedTransition = false,
        overlayTransitionTiming = 1500,
        fullTrasitionDelay = overlayTransitionTiming + 600,

        $logoOverlayBg = $('#logo-overlay-bg');




    resumeFullpage = function() {
        $.fn.fullpage.setAllowScrolling(true);
        $.fn.fullpage.setKeyboardScrolling(true);

        $('body').removeClass(overlayClass);

        isTransitioning = false;
    };

    deactivateFullpage = function() {
        $.fn.fullpage.setAllowScrolling(false);
        $.fn.fullpage.setKeyboardScrolling(false);
    };

    showLogoPieceTransition = function(nextSlideIndex, $nextSlide) {
        $('body').addClass(overlayClass);

        var imgUrl = $nextSlide.find('.js-panel-bg').css('background-image');

        $logoOverlayBg.css('background-image', imgUrl);

        setTimeout(function(){

            $.fn.fullpage.silentMoveTo(nextSlideIndex);


        }, overlayTransitionTiming/2);


        setTimeout(function(){
            resumeFullpage();
        }, fullTrasitionDelay);
    };

    

    customNextSlideLogic = function nextSlide(nextSlideIndex, $nextSlide){
        isTransitioning = true;
        
        //disable scrolling functionality until we finish transitioning out 
        deactivateFullpage();

        showLogoPieceTransition(nextSlideIndex, $nextSlide);    
        
    };

    

    initialize = function() {


        $('#fullpage').fullpage({
            anchors: ['beer', 'food', 'craft-cocktails', 'contact-location', 'private-events', 'events'],
            menu: '#site-nav-menu',
            verticalCentered: false,
            sectionSelector: '.panel',
            scrollingSpeed: 1000,
            fitToSection: false,
            fitToSectionDelay: 5000,
            normalScrollElementTouchThreshold: 10,
            touchSensitivity: 10,
            //animateAnchor: false
            onLeave: function(index, nextIndex, direction) {
                
                if (!isTransitioning) {
                    
                    overlayClass = (direction === "down") ? overlayClassForward : overlayClassInverse;

                    customNextSlideLogic(nextIndex, $(this));
                    return false;
                }
            }
        });
        
        
        deactivateFullpage();
        
        $(function(){
            
            $('body').addClass('dom-loaded');

            setTimeout(function(){
                $.fn.fullpage.setAllowScrolling(true);
                $.fn.fullpage.setKeyboardScrolling(true);
            }, 2000);
        }); 

    };
    
    


    return {
        init: initialize,
        deactivate: deactivateFullpage,
        enable: resumeFullpage,
    };
    
}());

module.exports = fullpage;
},{}],5:[function(require,module,exports){
'use strict';

var modalOverlay = (function(){



	var initModalOverlay,
		handleModalEvent,
		openModal,
		closeModal,
		ctaLabel,
		$activePanel,
		isAnimating = false,
		showModalClass = 'show-modal-overlay',

		//module imports
		fullpage = require('./fullpage.js');


		closeModal = function($button){

			if( $activePanel.length) {
				$activePanel.removeClass(showModalClass);
			} else {
				$('#fullpage')
					.find(showModalClass)
					.removeClass(showModalClass);
			}

			$button.text(ctaLabel)
				.data('modal-open', false);

			$activePanel = null;

			isAnimating = true;


			//delay inline with transition
			setTimeout(function(){
				isAnimating = false;

				//resume fulpage functionality
				fullpage.enable();
			}, 1300);

						
		};

		openModal = function($button){
			$activePanel = $button.closest('.panel');

			$activePanel.addClass(showModalClass);

			ctaLabel = $button.text();

			$button.text('close')
				.data('modal-open', true);

			//stop fullpage from working
			fullpage.deactivate();

    		$activePanel.find('.modal-overlay-content').scrollTop(0);
		};


		handleModalEvent = function (button) {
			var $button = $(button);

			($button.data('modal-open')) ? closeModal($button) : openModal($button);
		};

	initModalOverlay = function() {
		
		var $panels = $('#fullpage').find('.panel');

		$panels.on('click', '.js-modal-open', function(ev){
			ev.stopPropogation;
			ev.preventDefault;
			
			if(isAnimating) {
				return;
			}

			handleModalEvent(this);

		});

		$panels = null;
	};


	return {
		init: initModalOverlay
	};


})();

module.exports = modalOverlay;
},{"./fullpage.js":4}],6:[function(require,module,exports){
'use strict';

var $siteHeader = $('.js-site-header'),
	$siteNav = $('.js-site-nav'),

	//module imports
	fullpage = require('./fullpage.js');


$siteHeader.on('click.Menu', '.js-menu-toggle', function(ev){
    ev.stopPropagation();
    ev.preventDefault();

    $siteHeader.toggleClass('show-site-menu');
});


$siteNav.on('click.Menu', '.js-nav-link', function(ev){

    $siteHeader.removeClass('show-site-menu');
});
},{"./fullpage.js":4}],7:[function(require,module,exports){
'use strict';

//helper functions
window.helperUtils = {
    getDocDimen: function () {
        var winDimen = {};

        winDimen.height = window.innerHeight;
        winDimen.width = window.innerWidth;

        return winDimen;
    }
};

window.parseQueryString = function (str) {
    if (typeof str !== 'string') {
        return {};
    }
    str = str.trim().replace(/^\?/, '');
    if (!str) {
        return {};
    }
    return str.trim().split('&').reduce(function (ret, param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        ret[parts[0]] = parts[1] === undefined ? null : decodeURIComponent(parts[1]);
        return ret;
    }, {});
};

/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
window.getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
	          timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

},{}],8:[function(require,module,exports){
'use strict';

var globalVars = {

    device: {
        isIpad: null,
        isIphone: null
    },

    elementStates: {
        headerHeight: null
    },

    elements: {
        $siteHeader: $('.js-site-header')
    },

    isMobile: false,
    isTabletMax: false,
};

var setupValues,

	//responsive media query function
	mqMobile;


globalVars.elementStates = {
    headerHeight: globalVars.elements.$siteHeader.outerHeight()
};

setupValues = function (tabletState){

	globalVars.isMobile = (window.innerWidth < 767) ? true : false;

    globalVars.isTabletMax = tabletState;

    globalVars.elementStates.headerHeight = Math.ceil( globalVars.elements.$siteHeader.outerHeight() );
};

//make sure this matches css
mqMobile = window.matchMedia('(max-width: 960px)');

(mqMobile.matches) ? setupValues(true) : setupValues(false);
	
mqMobile.addListener( function(changed) {
	(changed.matches) ? setupValues(true) : setupValues(false);
}); 



( navigator.userAgent.match(/iPhone/i) ) ? globalVars.device.isIphone = true : globalVars.device.isIphone = false;
( navigator.userAgent.match(/iPod/i) ) ? globalVars.device.isIpad = true : globalVars.device.isIpad = false;


globalVars.windowResize =  (function() {

    var callbacks = [],
        running = false;

    // fired on resize event
    function resize() {

        if (!running) {
            running = true;

            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(runCallbacks);
            } else {
                setTimeout(runCallbacks, 66);
            }
        }

    }

    // run the actual callbacks
    function runCallbacks() {

        callbacks.forEach(function(callback) {
            callback();
        });

        running = false;
    }

    // adds callback to loop
    function addCallback(callback) {

        if (callback) {
            callbacks.push(callback);
        }

    }

    return {
        // public method to add additional callback
        add: function(callback) {
            if (!callbacks.length) {
                window.addEventListener('resize', resize);
            }
            addCallback(callback);
        }
    };
}());


module.exports = globalVars;

  
},{}],9:[function(require,module,exports){


(function (window) {
    'use strict';

    require('./app/variables');
    require('./app/util-helper');

    
    require('./app/fullpage').init();

    require('./app/site-header');
    
    require('./app/modal-overlay').init();
    require('./app/brew-view').init();
   
})(window);

},{"./app/brew-view":3,"./app/fullpage":4,"./app/modal-overlay":5,"./app/site-header":6,"./app/util-helper":7,"./app/variables":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmx1ZWltcC10bXBsL2pzL3RtcGwuanMiLCJzcmMvcHVibGljL2pzL2FwcC9icmV3LWNvbXBpbGUuanMiLCJzcmMvcHVibGljL2pzL2FwcC9icmV3LXZpZXcuanMiLCJzcmMvcHVibGljL2pzL2FwcC9mdWxscGFnZS5qcyIsInNyYy9wdWJsaWMvanMvYXBwL21vZGFsLW92ZXJsYXkuanMiLCJzcmMvcHVibGljL2pzL2FwcC9zaXRlLWhlYWRlci5qcyIsInNyYy9wdWJsaWMvanMvYXBwL3V0aWwtaGVscGVyLmpzIiwic3JjL3B1YmxpYy9qcy9hcHAvdmFyaWFibGVzLmpzIiwic3JjL3B1YmxpYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBKYXZhU2NyaXB0IFRlbXBsYXRlc1xuICogaHR0cHM6Ly9naXRodWIuY29tL2JsdWVpbXAvSmF2YVNjcmlwdC1UZW1wbGF0ZXNcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogSW5zcGlyZWQgYnkgSm9obiBSZXNpZydzIEphdmFTY3JpcHQgTWljcm8tVGVtcGxhdGluZzpcbiAqIGh0dHA6Ly9lam9obi5vcmcvYmxvZy9qYXZhc2NyaXB0LW1pY3JvLXRlbXBsYXRpbmcvXG4gKi9cblxuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG47KGZ1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0J1xuICB2YXIgdG1wbCA9IGZ1bmN0aW9uIChzdHIsIGRhdGEpIHtcbiAgICB2YXIgZiA9ICEvW15cXHdcXC1cXC46XS8udGVzdChzdHIpXG4gICAgICA/IHRtcGwuY2FjaGVbc3RyXSA9IHRtcGwuY2FjaGVbc3RyXSB8fCB0bXBsKHRtcGwubG9hZChzdHIpKVxuICAgICAgOiBuZXcgRnVuY3Rpb24oLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctZnVuY1xuICAgICAgICB0bXBsLmFyZyArICcsdG1wbCcsXG4gICAgICAgICd2YXIgX2U9dG1wbC5lbmNvZGUnICsgdG1wbC5oZWxwZXIgKyBcIixfcz0nXCIgK1xuICAgICAgICAgIHN0ci5yZXBsYWNlKHRtcGwucmVnZXhwLCB0bXBsLmZ1bmMpICsgXCInO3JldHVybiBfcztcIlxuICAgICAgKVxuICAgIHJldHVybiBkYXRhID8gZihkYXRhLCB0bXBsKSA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICByZXR1cm4gZihkYXRhLCB0bXBsKVxuICAgIH1cbiAgfVxuICB0bXBsLmNhY2hlID0ge31cbiAgdG1wbC5sb2FkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5pbm5lckhUTUxcbiAgfVxuICB0bXBsLnJlZ2V4cCA9IC8oW1xccydcXFxcXSkoPyEoPzpbXntdfFxceyg/ISUpKSolXFx9KXwoPzpcXHslKD18IykoW1xcc1xcU10rPyklXFx9KXwoXFx7JSl8KCVcXH0pL2dcbiAgdG1wbC5mdW5jID0gZnVuY3Rpb24gKHMsIHAxLCBwMiwgcDMsIHA0LCBwNSkge1xuICAgIGlmIChwMSkgeyAvLyB3aGl0ZXNwYWNlLCBxdW90ZSBhbmQgYmFja3NwYWNlIGluIEhUTUwgY29udGV4dFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAnXFx0JzogJ1xcXFx0JyxcbiAgICAgICAgJyAnOiAnICdcbiAgICAgIH1bcDFdIHx8ICdcXFxcJyArIHAxXG4gICAgfVxuICAgIGlmIChwMikgeyAvLyBpbnRlcnBvbGF0aW9uOiB7JT1wcm9wJX0sIG9yIHVuZXNjYXBlZDogeyUjcHJvcCV9XG4gICAgICBpZiAocDIgPT09ICc9Jykge1xuICAgICAgICByZXR1cm4gXCInK19lKFwiICsgcDMgKyBcIikrJ1wiXG4gICAgICB9XG4gICAgICByZXR1cm4gXCInKyhcIiArIHAzICsgXCI9PW51bGw/Jyc6XCIgKyBwMyArIFwiKSsnXCJcbiAgICB9XG4gICAgaWYgKHA0KSB7IC8vIGV2YWx1YXRpb24gc3RhcnQgdGFnOiB7JVxuICAgICAgcmV0dXJuIFwiJztcIlxuICAgIH1cbiAgICBpZiAocDUpIHsgLy8gZXZhbHVhdGlvbiBlbmQgdGFnOiAlfVxuICAgICAgcmV0dXJuIFwiX3MrPSdcIlxuICAgIH1cbiAgfVxuICB0bXBsLmVuY1JlZyA9IC9bPD4mXCInXFx4MDBdL2cgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb250cm9sLXJlZ2V4XG4gIHRtcGwuZW5jTWFwID0ge1xuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7J1xuICB9XG4gIHRtcGwuZW5jb2RlID0gZnVuY3Rpb24gKHMpIHtcbiAgICByZXR1cm4gKHMgPT0gbnVsbCA/ICcnIDogJycgKyBzKS5yZXBsYWNlKFxuICAgICAgdG1wbC5lbmNSZWcsXG4gICAgICBmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4gdG1wbC5lbmNNYXBbY10gfHwgJydcbiAgICAgIH1cbiAgICApXG4gIH1cbiAgdG1wbC5hcmcgPSAnbydcbiAgdG1wbC5oZWxwZXIgPSBcIixwcmludD1mdW5jdGlvbihzLGUpe19zKz1lPyhzPT1udWxsPycnOnMpOl9lKHMpO31cIiArXG4gICAgICAgICAgICAgICAgICAnLGluY2x1ZGU9ZnVuY3Rpb24ocyxkKXtfcys9dG1wbChzLGQpO30nXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRtcGxcbiAgICB9KVxuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0bXBsXG4gIH0gZWxzZSB7XG4gICAgJC50bXBsID0gdG1wbFxuICB9XG59KHRoaXMpKVxuIiwidmFyIGJyZXdWaWV3ID0gKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRtcGwgPSByZXF1aXJlKCdibHVlaW1wLXRtcGwnKSxcblx0XHR2aWV3ICA9ICQoJyNicmV3JykuZmluZCgnLmJyZXctYm9keScpWzBdLFxuXHRcdGJyZXdKc29uLFxuXHRcdGluaXRpYWxpemUsXG5cdFx0Y29tcGlsZTtcblxuXG5cdGNvbXBpbGUgPSAgZnVuY3Rpb24oYnJld05hbWUpIHtcblxuXHRcdHZpZXcuaW5uZXJIVE1MID0gdG1wbCgndG1wbC1icmV3JywgYnJld0pzb25bYnJld05hbWVdKTtcblxuXHR9O1xuXG5cdGluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRicmV3SnNvbiA9IGluaXRpYWxKc29uRGF0YTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRpYWxpemUsXG5cdFx0dGVtcGxhdGU6IGNvbXBpbGVcblx0fTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYnJld1ZpZXc7IiwidmFyIGJyZXdWaWV3ID0gKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaW5pdEJyZXdWaWV3LFxuXHRcdHNob3dCcmV3RGV0YWlsLFxuXHRcdGNsb3NlQnJld0RldGFpbCxcblx0XHQkYnJld1BhZ2UsXG5cdFx0XG5cdFx0aXNBbmltYXRpbmcgPSBmYWxzZSxcblx0XHRzaG93QnJld0NsYXNzID0gJ3Nob3ctYnJldy1vdmVybGF5JyxcblxuXHRcdGJyZXdDb21waWxlID0gcmVxdWlyZSgnLi9icmV3LWNvbXBpbGUnKTtcblxuXG5cdGNsb3NlQnJld0RldGFpbCA9IGZ1bmN0aW9uKCl7XG5cblx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3Moc2hvd0JyZXdDbGFzcyk7XG5cblx0XHQkYnJld1BhZ2Uub2ZmKCdjbGljay5icmV3Q2xvc2UnKTtcblxuXHRcdGlzQW5pbWF0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcblx0fTtcblxuXHRzaG93QnJld0RldGFpbCA9IGZ1bmN0aW9uKCRsaW5rLCBicmV3TmFtZSl7XG5cblx0XHQkKCdib2R5JykuYWRkQ2xhc3Moc2hvd0JyZXdDbGFzcyk7XG5cblx0XHRicmV3Q29tcGlsZS50ZW1wbGF0ZShicmV3TmFtZSk7XG5cblx0XHQkYnJld1BhZ2Uub24oJ2NsaWNrLmJyZXdDbG9zZScsICcuanMtY2xvc2UtYnJldycsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0O1xuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uO1xuXG5cdFx0XHRjbG9zZUJyZXdEZXRhaWwoKTtcblx0XHR9KTtcblx0fTtcblxuXHRpbml0QnJld1ZpZXcgPSBmdW5jdGlvbigpIHtcblx0XHRcblx0XHQkKCcjYmVlci1ncmlkJykub24oJ2NsaWNrJywgJy5qcy1icmV3LWxpbmsnLCBmdW5jdGlvbihldil7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdDtcblx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbjtcblxuXHRcdFx0dmFyIGJlZXJJZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFx0XHRiZWVySWQgPSBiZWVySWQuc2xpY2UoMSk7XG5cblx0XHRcdHNob3dCcmV3RGV0YWlsKCQodGhpcyksIGJlZXJJZCk7XG5cdFx0fSk7XG5cblx0XHQkYnJld1BhZ2UgPSAkKCcjYnJldycpO1xuXG5cdFx0YnJld0NvbXBpbGUuaW5pdCgpO1xuXHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0QnJld1ZpZXdcblx0fTtcblxuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyZXdWaWV3OyIsInZhciBmdWxscGFnZSA9ICAoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgY3VzdG9tTmV4dFNsaWRlTG9naWMsXG4gICAgICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uLFxuICAgICAgICByZXN1bWVGdWxscGFnZSxcbiAgICAgICAgZGVhY3RpdmF0ZUZ1bGxwYWdlLFxuICAgICAgICBpbml0aWFsaXplLFxuXG4gICAgICAgIG92ZXJsYXlDbGFzc0ZvcndhcmQgPSAnc2hvdy1sb2dvLW92ZXJsYXknLFxuICAgICAgICBvdmVybGF5Q2xhc3NJbnZlcnNlID0gJ3Nob3ctbG9nby1vdmVybGF5LWludmVyc2UnLFxuICAgICAgICBvdmVybGF5Q2xhc3MgPSAnc2hvdy1sb2dvLW92ZXJsYXknLFxuICAgICAgICBpc1RyYW5zaXRpb25pbmcgPSAgZmFsc2UsXG4gICAgICAgIGZvcmNlZFRyYW5zaXRpb24gPSBmYWxzZSxcbiAgICAgICAgb3ZlcmxheVRyYW5zaXRpb25UaW1pbmcgPSAxNTAwLFxuICAgICAgICBmdWxsVHJhc2l0aW9uRGVsYXkgPSBvdmVybGF5VHJhbnNpdGlvblRpbWluZyArIDYwMCxcblxuICAgICAgICAkbG9nb092ZXJsYXlCZyA9ICQoJyNsb2dvLW92ZXJsYXktYmcnKTtcblxuXG5cblxuICAgIHJlc3VtZUZ1bGxwYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG5cbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGRlYWN0aXZhdGVGdWxscGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyhmYWxzZSk7XG4gICAgfTtcblxuICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uID0gZnVuY3Rpb24obmV4dFNsaWRlSW5kZXgsICRuZXh0U2xpZGUpIHtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgdmFyIGltZ1VybCA9ICRuZXh0U2xpZGUuZmluZCgnLmpzLXBhbmVsLWJnJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG5cbiAgICAgICAgJGxvZ29PdmVybGF5QmcuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1nVXJsKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2lsZW50TW92ZVRvKG5leHRTbGlkZUluZGV4KTtcblxuXG4gICAgICAgIH0sIG92ZXJsYXlUcmFuc2l0aW9uVGltaW5nLzIpO1xuXG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmVzdW1lRnVsbHBhZ2UoKTtcbiAgICAgICAgfSwgZnVsbFRyYXNpdGlvbkRlbGF5KTtcbiAgICB9O1xuXG4gICAgXG5cbiAgICBjdXN0b21OZXh0U2xpZGVMb2dpYyA9IGZ1bmN0aW9uIG5leHRTbGlkZShuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSl7XG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvL2Rpc2FibGUgc2Nyb2xsaW5nIGZ1bmN0aW9uYWxpdHkgdW50aWwgd2UgZmluaXNoIHRyYW5zaXRpb25pbmcgb3V0IFxuICAgICAgICBkZWFjdGl2YXRlRnVsbHBhZ2UoKTtcblxuICAgICAgICBzaG93TG9nb1BpZWNlVHJhbnNpdGlvbihuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSk7ICAgIFxuICAgICAgICBcbiAgICB9O1xuXG4gICAgXG5cbiAgICBpbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAkKCcjZnVsbHBhZ2UnKS5mdWxscGFnZSh7XG4gICAgICAgICAgICBhbmNob3JzOiBbJ2JlZXInLCAnZm9vZCcsICdjcmFmdC1jb2NrdGFpbHMnLCAnY29udGFjdC1sb2NhdGlvbicsICdwcml2YXRlLWV2ZW50cycsICdldmVudHMnXSxcbiAgICAgICAgICAgIG1lbnU6ICcjc2l0ZS1uYXYtbWVudScsXG4gICAgICAgICAgICB2ZXJ0aWNhbENlbnRlcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIHNlY3Rpb25TZWxlY3RvcjogJy5wYW5lbCcsXG4gICAgICAgICAgICBzY3JvbGxpbmdTcGVlZDogMTAwMCxcbiAgICAgICAgICAgIGZpdFRvU2VjdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBmaXRUb1NlY3Rpb25EZWxheTogNTAwMCxcbiAgICAgICAgICAgIG5vcm1hbFNjcm9sbEVsZW1lbnRUb3VjaFRocmVzaG9sZDogMTAsXG4gICAgICAgICAgICB0b3VjaFNlbnNpdGl2aXR5OiAxMCxcbiAgICAgICAgICAgIC8vYW5pbWF0ZUFuY2hvcjogZmFsc2VcbiAgICAgICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uKGluZGV4LCBuZXh0SW5kZXgsIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghaXNUcmFuc2l0aW9uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q2xhc3MgPSAoZGlyZWN0aW9uID09PSBcImRvd25cIikgPyBvdmVybGF5Q2xhc3NGb3J3YXJkIDogb3ZlcmxheUNsYXNzSW52ZXJzZTtcblxuICAgICAgICAgICAgICAgICAgICBjdXN0b21OZXh0U2xpZGVMb2dpYyhuZXh0SW5kZXgsICQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBkZWFjdGl2YXRlRnVsbHBhZ2UoKTtcbiAgICAgICAgXG4gICAgICAgICQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdkb20tbG9hZGVkJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgfSk7IFxuXG4gICAgfTtcbiAgICBcbiAgICBcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdGlhbGl6ZSxcbiAgICAgICAgZGVhY3RpdmF0ZTogZGVhY3RpdmF0ZUZ1bGxwYWdlLFxuICAgICAgICBlbmFibGU6IHJlc3VtZUZ1bGxwYWdlLFxuICAgIH07XG4gICAgXG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bGxwYWdlOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1vZGFsT3ZlcmxheSA9IChmdW5jdGlvbigpe1xuXG5cblxuXHR2YXIgaW5pdE1vZGFsT3ZlcmxheSxcblx0XHRoYW5kbGVNb2RhbEV2ZW50LFxuXHRcdG9wZW5Nb2RhbCxcblx0XHRjbG9zZU1vZGFsLFxuXHRcdGN0YUxhYmVsLFxuXHRcdCRhY3RpdmVQYW5lbCxcblx0XHRpc0FuaW1hdGluZyA9IGZhbHNlLFxuXHRcdHNob3dNb2RhbENsYXNzID0gJ3Nob3ctbW9kYWwtb3ZlcmxheScsXG5cblx0XHQvL21vZHVsZSBpbXBvcnRzXG5cdFx0ZnVsbHBhZ2UgPSByZXF1aXJlKCcuL2Z1bGxwYWdlLmpzJyk7XG5cblxuXHRcdGNsb3NlTW9kYWwgPSBmdW5jdGlvbigkYnV0dG9uKXtcblxuXHRcdFx0aWYoICRhY3RpdmVQYW5lbC5sZW5ndGgpIHtcblx0XHRcdFx0JGFjdGl2ZVBhbmVsLnJlbW92ZUNsYXNzKHNob3dNb2RhbENsYXNzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNmdWxscGFnZScpXG5cdFx0XHRcdFx0LmZpbmQoc2hvd01vZGFsQ2xhc3MpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKHNob3dNb2RhbENsYXNzKTtcblx0XHRcdH1cblxuXHRcdFx0JGJ1dHRvbi50ZXh0KGN0YUxhYmVsKVxuXHRcdFx0XHQuZGF0YSgnbW9kYWwtb3BlbicsIGZhbHNlKTtcblxuXHRcdFx0JGFjdGl2ZVBhbmVsID0gbnVsbDtcblxuXHRcdFx0aXNBbmltYXRpbmcgPSB0cnVlO1xuXG5cblx0XHRcdC8vZGVsYXkgaW5saW5lIHdpdGggdHJhbnNpdGlvblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vcmVzdW1lIGZ1bHBhZ2UgZnVuY3Rpb25hbGl0eVxuXHRcdFx0XHRmdWxscGFnZS5lbmFibGUoKTtcblx0XHRcdH0sIDEzMDApO1xuXG5cdFx0XHRcdFx0XHRcblx0XHR9O1xuXG5cdFx0b3Blbk1vZGFsID0gZnVuY3Rpb24oJGJ1dHRvbil7XG5cdFx0XHQkYWN0aXZlUGFuZWwgPSAkYnV0dG9uLmNsb3Nlc3QoJy5wYW5lbCcpO1xuXG5cdFx0XHQkYWN0aXZlUGFuZWwuYWRkQ2xhc3Moc2hvd01vZGFsQ2xhc3MpO1xuXG5cdFx0XHRjdGFMYWJlbCA9ICRidXR0b24udGV4dCgpO1xuXG5cdFx0XHQkYnV0dG9uLnRleHQoJ2Nsb3NlJylcblx0XHRcdFx0LmRhdGEoJ21vZGFsLW9wZW4nLCB0cnVlKTtcblxuXHRcdFx0Ly9zdG9wIGZ1bGxwYWdlIGZyb20gd29ya2luZ1xuXHRcdFx0ZnVsbHBhZ2UuZGVhY3RpdmF0ZSgpO1xuXG4gICAgXHRcdCRhY3RpdmVQYW5lbC5maW5kKCcubW9kYWwtb3ZlcmxheS1jb250ZW50Jykuc2Nyb2xsVG9wKDApO1xuXHRcdH07XG5cblxuXHRcdGhhbmRsZU1vZGFsRXZlbnQgPSBmdW5jdGlvbiAoYnV0dG9uKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9ICQoYnV0dG9uKTtcblxuXHRcdFx0KCRidXR0b24uZGF0YSgnbW9kYWwtb3BlbicpKSA/IGNsb3NlTW9kYWwoJGJ1dHRvbikgOiBvcGVuTW9kYWwoJGJ1dHRvbik7XG5cdFx0fTtcblxuXHRpbml0TW9kYWxPdmVybGF5ID0gZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0dmFyICRwYW5lbHMgPSAkKCcjZnVsbHBhZ2UnKS5maW5kKCcucGFuZWwnKTtcblxuXHRcdCRwYW5lbHMub24oJ2NsaWNrJywgJy5qcy1tb2RhbC1vcGVuJywgZnVuY3Rpb24oZXYpe1xuXHRcdFx0ZXYuc3RvcFByb3BvZ2F0aW9uO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQ7XG5cdFx0XHRcblx0XHRcdGlmKGlzQW5pbWF0aW5nKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aGFuZGxlTW9kYWxFdmVudCh0aGlzKTtcblxuXHRcdH0pO1xuXG5cdFx0JHBhbmVscyA9IG51bGw7XG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRNb2RhbE92ZXJsYXlcblx0fTtcblxuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vZGFsT3ZlcmxheTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkc2l0ZUhlYWRlciA9ICQoJy5qcy1zaXRlLWhlYWRlcicpLFxuXHQkc2l0ZU5hdiA9ICQoJy5qcy1zaXRlLW5hdicpLFxuXG5cdC8vbW9kdWxlIGltcG9ydHNcblx0ZnVsbHBhZ2UgPSByZXF1aXJlKCcuL2Z1bGxwYWdlLmpzJyk7XG5cblxuJHNpdGVIZWFkZXIub24oJ2NsaWNrLk1lbnUnLCAnLmpzLW1lbnUtdG9nZ2xlJywgZnVuY3Rpb24oZXYpe1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkc2l0ZUhlYWRlci50b2dnbGVDbGFzcygnc2hvdy1zaXRlLW1lbnUnKTtcbn0pO1xuXG5cbiRzaXRlTmF2Lm9uKCdjbGljay5NZW51JywgJy5qcy1uYXYtbGluaycsIGZ1bmN0aW9uKGV2KXtcblxuICAgICRzaXRlSGVhZGVyLnJlbW92ZUNsYXNzKCdzaG93LXNpdGUtbWVudScpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbndpbmRvdy5oZWxwZXJVdGlscyA9IHtcbiAgICBnZXREb2NEaW1lbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd2luRGltZW4gPSB7fTtcblxuICAgICAgICB3aW5EaW1lbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIHdpbkRpbWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgcmV0dXJuIHdpbkRpbWVuO1xuICAgIH1cbn07XG5cbndpbmRvdy5wYXJzZVF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZSgvXlxcPy8sICcnKTtcbiAgICBpZiAoIXN0cikge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIHJldHVybiBzdHIudHJpbSgpLnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uIChyZXQsIHBhcmFtKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IHBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpLnNwbGl0KCc9Jyk7XG4gICAgICAgIHJldFtwYXJ0c1swXV0gPSBwYXJ0c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSwge30pO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlIG9mIGEgcXVlcnlzdHJpbmdcbiAqIEBwYXJhbSAge1N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHRvIGdldCB0aGUgdmFsdWUgb2ZcbiAqIEBwYXJhbSAge1N0cmluZ30gdXJsICAgVGhlIFVSTCB0byBnZXQgdGhlIHZhbHVlIGZyb20gKG9wdGlvbmFsKVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICBUaGUgZmllbGQgdmFsdWVcbiAqL1xud2luZG93LmdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKGZpZWxkLCB1cmwpIHtcbiAgICB2YXIgaHJlZiA9IHVybCA/IHVybCA6IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdbPyZdJyArIGZpZWxkICsgJz0oW14mI10qKScsICdpJyk7XG4gICAgdmFyIHN0cmluZyA9IHJlZy5leGVjKGhyZWYpO1xuICAgIHJldHVybiBzdHJpbmcgPyBzdHJpbmdbMV0gOiBudWxsO1xufTtcblxuXG4vLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuXG4vLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyXG4vLyBmaXhlcyBmcm9tIFBhdWwgSXJpc2ggYW5kIFRpbm8gWmlqZGVsXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG5cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sXG5cdCAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfTtcbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxWYXJzID0ge1xuXG4gICAgZGV2aWNlOiB7XG4gICAgICAgIGlzSXBhZDogbnVsbCxcbiAgICAgICAgaXNJcGhvbmU6IG51bGxcbiAgICB9LFxuXG4gICAgZWxlbWVudFN0YXRlczoge1xuICAgICAgICBoZWFkZXJIZWlnaHQ6IG51bGxcbiAgICB9LFxuXG4gICAgZWxlbWVudHM6IHtcbiAgICAgICAgJHNpdGVIZWFkZXI6ICQoJy5qcy1zaXRlLWhlYWRlcicpXG4gICAgfSxcblxuICAgIGlzTW9iaWxlOiBmYWxzZSxcbiAgICBpc1RhYmxldE1heDogZmFsc2UsXG59O1xuXG52YXIgc2V0dXBWYWx1ZXMsXG5cblx0Ly9yZXNwb25zaXZlIG1lZGlhIHF1ZXJ5IGZ1bmN0aW9uXG5cdG1xTW9iaWxlO1xuXG5cbmdsb2JhbFZhcnMuZWxlbWVudFN0YXRlcyA9IHtcbiAgICBoZWFkZXJIZWlnaHQ6IGdsb2JhbFZhcnMuZWxlbWVudHMuJHNpdGVIZWFkZXIub3V0ZXJIZWlnaHQoKVxufTtcblxuc2V0dXBWYWx1ZXMgPSBmdW5jdGlvbiAodGFibGV0U3RhdGUpe1xuXG5cdGdsb2JhbFZhcnMuaXNNb2JpbGUgPSAod2luZG93LmlubmVyV2lkdGggPCA3NjcpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgZ2xvYmFsVmFycy5pc1RhYmxldE1heCA9IHRhYmxldFN0YXRlO1xuXG4gICAgZ2xvYmFsVmFycy5lbGVtZW50U3RhdGVzLmhlYWRlckhlaWdodCA9IE1hdGguY2VpbCggZ2xvYmFsVmFycy5lbGVtZW50cy4kc2l0ZUhlYWRlci5vdXRlckhlaWdodCgpICk7XG59O1xuXG4vL21ha2Ugc3VyZSB0aGlzIG1hdGNoZXMgY3NzXG5tcU1vYmlsZSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiA5NjBweCknKTtcblxuKG1xTW9iaWxlLm1hdGNoZXMpID8gc2V0dXBWYWx1ZXModHJ1ZSkgOiBzZXR1cFZhbHVlcyhmYWxzZSk7XG5cdFxubXFNb2JpbGUuYWRkTGlzdGVuZXIoIGZ1bmN0aW9uKGNoYW5nZWQpIHtcblx0KGNoYW5nZWQubWF0Y2hlcykgPyBzZXR1cFZhbHVlcyh0cnVlKSA6IHNldHVwVmFsdWVzKGZhbHNlKTtcbn0pOyBcblxuXG5cbiggbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lL2kpICkgPyBnbG9iYWxWYXJzLmRldmljZS5pc0lwaG9uZSA9IHRydWUgOiBnbG9iYWxWYXJzLmRldmljZS5pc0lwaG9uZSA9IGZhbHNlO1xuKCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpICkgPyBnbG9iYWxWYXJzLmRldmljZS5pc0lwYWQgPSB0cnVlIDogZ2xvYmFsVmFycy5kZXZpY2UuaXNJcGFkID0gZmFsc2U7XG5cblxuZ2xvYmFsVmFycy53aW5kb3dSZXNpemUgPSAgKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGNhbGxiYWNrcyA9IFtdLFxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG5cbiAgICAvLyBmaXJlZCBvbiByZXNpemUgZXZlbnRcbiAgICBmdW5jdGlvbiByZXNpemUoKSB7XG5cbiAgICAgICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJ1bkNhbGxiYWNrcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocnVuQ2FsbGJhY2tzLCA2Nik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIHJ1biB0aGUgYWN0dWFsIGNhbGxiYWNrc1xuICAgIGZ1bmN0aW9uIHJ1bkNhbGxiYWNrcygpIHtcblxuICAgICAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGFkZHMgY2FsbGJhY2sgdG8gbG9vcFxuICAgIGZ1bmN0aW9uIGFkZENhbGxiYWNrKGNhbGxiYWNrKSB7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2QgdG8gYWRkIGFkZGl0aW9uYWwgY2FsbGJhY2tcbiAgICAgICAgYWRkOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRDYWxsYmFjayhjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9O1xufSgpKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFZhcnM7XG5cbiAgIiwiXG5cbihmdW5jdGlvbiAod2luZG93KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmVxdWlyZSgnLi9hcHAvdmFyaWFibGVzJyk7XG4gICAgcmVxdWlyZSgnLi9hcHAvdXRpbC1oZWxwZXInKTtcblxuICAgIFxuICAgIHJlcXVpcmUoJy4vYXBwL2Z1bGxwYWdlJykuaW5pdCgpO1xuXG4gICAgcmVxdWlyZSgnLi9hcHAvc2l0ZS1oZWFkZXInKTtcbiAgICBcbiAgICByZXF1aXJlKCcuL2FwcC9tb2RhbC1vdmVybGF5JykuaW5pdCgpO1xuICAgIHJlcXVpcmUoJy4vYXBwL2JyZXctdmlldycpLmluaXQoKTtcbiAgIFxufSkod2luZG93KTtcbiJdfQ==
