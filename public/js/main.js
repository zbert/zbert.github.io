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
            anchors: ['home','beer', 'food', 'craft-cocktails', 'contact-location', 'private-events', 'events'],
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

                    //if there's an active modal
                    window.modalOverlay.closeActiveModal();
                    
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

			$activePanel = undefined;

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
		init: initModalOverlay,
		closeActiveModal: function(){
			if ($activePanel !== undefined) {
				closeModal($activePanel.find('.js-modal-open'));
			}
		}
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
    
    
    require('./app/brew-view').init();

    window.modalOverlay = require('./app/modal-overlay');

    window.modalOverlay.init();
   
})(window);

},{"./app/brew-view":3,"./app/fullpage":4,"./app/modal-overlay":5,"./app/site-header":6,"./app/util-helper":7,"./app/variables":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmx1ZWltcC10bXBsL2pzL3RtcGwuanMiLCJzcmMvcHVibGljL2pzL2FwcC9icmV3LWNvbXBpbGUuanMiLCJzcmMvcHVibGljL2pzL2FwcC9icmV3LXZpZXcuanMiLCJzcmMvcHVibGljL2pzL2FwcC9mdWxscGFnZS5qcyIsInNyYy9wdWJsaWMvanMvYXBwL21vZGFsLW92ZXJsYXkuanMiLCJzcmMvcHVibGljL2pzL2FwcC9zaXRlLWhlYWRlci5qcyIsInNyYy9wdWJsaWMvanMvYXBwL3V0aWwtaGVscGVyLmpzIiwic3JjL3B1YmxpYy9qcy9hcHAvdmFyaWFibGVzLmpzIiwic3JjL3B1YmxpYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBKYXZhU2NyaXB0IFRlbXBsYXRlc1xuICogaHR0cHM6Ly9naXRodWIuY29tL2JsdWVpbXAvSmF2YVNjcmlwdC1UZW1wbGF0ZXNcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogSW5zcGlyZWQgYnkgSm9obiBSZXNpZydzIEphdmFTY3JpcHQgTWljcm8tVGVtcGxhdGluZzpcbiAqIGh0dHA6Ly9lam9obi5vcmcvYmxvZy9qYXZhc2NyaXB0LW1pY3JvLXRlbXBsYXRpbmcvXG4gKi9cblxuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG47KGZ1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0J1xuICB2YXIgdG1wbCA9IGZ1bmN0aW9uIChzdHIsIGRhdGEpIHtcbiAgICB2YXIgZiA9ICEvW15cXHdcXC1cXC46XS8udGVzdChzdHIpXG4gICAgICA/IHRtcGwuY2FjaGVbc3RyXSA9IHRtcGwuY2FjaGVbc3RyXSB8fCB0bXBsKHRtcGwubG9hZChzdHIpKVxuICAgICAgOiBuZXcgRnVuY3Rpb24oLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctZnVuY1xuICAgICAgICB0bXBsLmFyZyArICcsdG1wbCcsXG4gICAgICAgICd2YXIgX2U9dG1wbC5lbmNvZGUnICsgdG1wbC5oZWxwZXIgKyBcIixfcz0nXCIgK1xuICAgICAgICAgIHN0ci5yZXBsYWNlKHRtcGwucmVnZXhwLCB0bXBsLmZ1bmMpICsgXCInO3JldHVybiBfcztcIlxuICAgICAgKVxuICAgIHJldHVybiBkYXRhID8gZihkYXRhLCB0bXBsKSA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICByZXR1cm4gZihkYXRhLCB0bXBsKVxuICAgIH1cbiAgfVxuICB0bXBsLmNhY2hlID0ge31cbiAgdG1wbC5sb2FkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5pbm5lckhUTUxcbiAgfVxuICB0bXBsLnJlZ2V4cCA9IC8oW1xccydcXFxcXSkoPyEoPzpbXntdfFxceyg/ISUpKSolXFx9KXwoPzpcXHslKD18IykoW1xcc1xcU10rPyklXFx9KXwoXFx7JSl8KCVcXH0pL2dcbiAgdG1wbC5mdW5jID0gZnVuY3Rpb24gKHMsIHAxLCBwMiwgcDMsIHA0LCBwNSkge1xuICAgIGlmIChwMSkgeyAvLyB3aGl0ZXNwYWNlLCBxdW90ZSBhbmQgYmFja3NwYWNlIGluIEhUTUwgY29udGV4dFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAnXFx0JzogJ1xcXFx0JyxcbiAgICAgICAgJyAnOiAnICdcbiAgICAgIH1bcDFdIHx8ICdcXFxcJyArIHAxXG4gICAgfVxuICAgIGlmIChwMikgeyAvLyBpbnRlcnBvbGF0aW9uOiB7JT1wcm9wJX0sIG9yIHVuZXNjYXBlZDogeyUjcHJvcCV9XG4gICAgICBpZiAocDIgPT09ICc9Jykge1xuICAgICAgICByZXR1cm4gXCInK19lKFwiICsgcDMgKyBcIikrJ1wiXG4gICAgICB9XG4gICAgICByZXR1cm4gXCInKyhcIiArIHAzICsgXCI9PW51bGw/Jyc6XCIgKyBwMyArIFwiKSsnXCJcbiAgICB9XG4gICAgaWYgKHA0KSB7IC8vIGV2YWx1YXRpb24gc3RhcnQgdGFnOiB7JVxuICAgICAgcmV0dXJuIFwiJztcIlxuICAgIH1cbiAgICBpZiAocDUpIHsgLy8gZXZhbHVhdGlvbiBlbmQgdGFnOiAlfVxuICAgICAgcmV0dXJuIFwiX3MrPSdcIlxuICAgIH1cbiAgfVxuICB0bXBsLmVuY1JlZyA9IC9bPD4mXCInXFx4MDBdL2cgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb250cm9sLXJlZ2V4XG4gIHRtcGwuZW5jTWFwID0ge1xuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7J1xuICB9XG4gIHRtcGwuZW5jb2RlID0gZnVuY3Rpb24gKHMpIHtcbiAgICByZXR1cm4gKHMgPT0gbnVsbCA/ICcnIDogJycgKyBzKS5yZXBsYWNlKFxuICAgICAgdG1wbC5lbmNSZWcsXG4gICAgICBmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4gdG1wbC5lbmNNYXBbY10gfHwgJydcbiAgICAgIH1cbiAgICApXG4gIH1cbiAgdG1wbC5hcmcgPSAnbydcbiAgdG1wbC5oZWxwZXIgPSBcIixwcmludD1mdW5jdGlvbihzLGUpe19zKz1lPyhzPT1udWxsPycnOnMpOl9lKHMpO31cIiArXG4gICAgICAgICAgICAgICAgICAnLGluY2x1ZGU9ZnVuY3Rpb24ocyxkKXtfcys9dG1wbChzLGQpO30nXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRtcGxcbiAgICB9KVxuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0bXBsXG4gIH0gZWxzZSB7XG4gICAgJC50bXBsID0gdG1wbFxuICB9XG59KHRoaXMpKVxuIiwidmFyIGJyZXdWaWV3ID0gKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRtcGwgPSByZXF1aXJlKCdibHVlaW1wLXRtcGwnKSxcblx0XHR2aWV3ICA9ICQoJyNicmV3JykuZmluZCgnLmJyZXctYm9keScpWzBdLFxuXHRcdGJyZXdKc29uLFxuXHRcdGluaXRpYWxpemUsXG5cdFx0Y29tcGlsZTtcblxuXG5cdGNvbXBpbGUgPSAgZnVuY3Rpb24oYnJld05hbWUpIHtcblxuXHRcdHZpZXcuaW5uZXJIVE1MID0gdG1wbCgndG1wbC1icmV3JywgYnJld0pzb25bYnJld05hbWVdKTtcblxuXHR9O1xuXG5cdGluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRicmV3SnNvbiA9IGluaXRpYWxKc29uRGF0YTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRpYWxpemUsXG5cdFx0dGVtcGxhdGU6IGNvbXBpbGVcblx0fTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYnJld1ZpZXc7IiwidmFyIGJyZXdWaWV3ID0gKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaW5pdEJyZXdWaWV3LFxuXHRcdHNob3dCcmV3RGV0YWlsLFxuXHRcdGNsb3NlQnJld0RldGFpbCxcblx0XHQkYnJld1BhZ2UsXG5cdFx0XG5cdFx0aXNBbmltYXRpbmcgPSBmYWxzZSxcblx0XHRzaG93QnJld0NsYXNzID0gJ3Nob3ctYnJldy1vdmVybGF5JyxcblxuXHRcdGJyZXdDb21waWxlID0gcmVxdWlyZSgnLi9icmV3LWNvbXBpbGUnKTtcblxuXG5cdGNsb3NlQnJld0RldGFpbCA9IGZ1bmN0aW9uKCl7XG5cblx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3Moc2hvd0JyZXdDbGFzcyk7XG5cblx0XHQkYnJld1BhZ2Uub2ZmKCdjbGljay5icmV3Q2xvc2UnKTtcblxuXHRcdGlzQW5pbWF0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcblx0fTtcblxuXHRzaG93QnJld0RldGFpbCA9IGZ1bmN0aW9uKCRsaW5rLCBicmV3TmFtZSl7XG5cblx0XHQkKCdib2R5JykuYWRkQ2xhc3Moc2hvd0JyZXdDbGFzcyk7XG5cblx0XHRicmV3Q29tcGlsZS50ZW1wbGF0ZShicmV3TmFtZSk7XG5cblx0XHQkYnJld1BhZ2Uub24oJ2NsaWNrLmJyZXdDbG9zZScsICcuanMtY2xvc2UtYnJldycsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0O1xuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uO1xuXG5cdFx0XHRjbG9zZUJyZXdEZXRhaWwoKTtcblx0XHR9KTtcblx0fTtcblxuXHRpbml0QnJld1ZpZXcgPSBmdW5jdGlvbigpIHtcblx0XHRcblx0XHQkKCcjYmVlci1ncmlkJykub24oJ2NsaWNrJywgJy5qcy1icmV3LWxpbmsnLCBmdW5jdGlvbihldil7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdDtcblx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbjtcblxuXHRcdFx0dmFyIGJlZXJJZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFx0XHRiZWVySWQgPSBiZWVySWQuc2xpY2UoMSk7XG5cblx0XHRcdHNob3dCcmV3RGV0YWlsKCQodGhpcyksIGJlZXJJZCk7XG5cdFx0fSk7XG5cblx0XHQkYnJld1BhZ2UgPSAkKCcjYnJldycpO1xuXG5cdFx0YnJld0NvbXBpbGUuaW5pdCgpO1xuXHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0QnJld1ZpZXdcblx0fTtcblxuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyZXdWaWV3OyIsInZhciBmdWxscGFnZSA9ICAoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgY3VzdG9tTmV4dFNsaWRlTG9naWMsXG4gICAgICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uLFxuICAgICAgICByZXN1bWVGdWxscGFnZSxcbiAgICAgICAgZGVhY3RpdmF0ZUZ1bGxwYWdlLFxuICAgICAgICBpbml0aWFsaXplLFxuXG4gICAgICAgIG92ZXJsYXlDbGFzc0ZvcndhcmQgPSAnc2hvdy1sb2dvLW92ZXJsYXknLFxuICAgICAgICBvdmVybGF5Q2xhc3NJbnZlcnNlID0gJ3Nob3ctbG9nby1vdmVybGF5LWludmVyc2UnLFxuICAgICAgICBvdmVybGF5Q2xhc3MgPSAnc2hvdy1sb2dvLW92ZXJsYXknLFxuICAgICAgICBpc1RyYW5zaXRpb25pbmcgPSAgZmFsc2UsXG4gICAgICAgIGZvcmNlZFRyYW5zaXRpb24gPSBmYWxzZSxcbiAgICAgICAgb3ZlcmxheVRyYW5zaXRpb25UaW1pbmcgPSAxNTAwLFxuICAgICAgICBmdWxsVHJhc2l0aW9uRGVsYXkgPSBvdmVybGF5VHJhbnNpdGlvblRpbWluZyArIDYwMCxcblxuICAgICAgICAkbG9nb092ZXJsYXlCZyA9ICQoJyNsb2dvLW92ZXJsYXktYmcnKTtcblxuXG5cblxuICAgIHJlc3VtZUZ1bGxwYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG5cbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGRlYWN0aXZhdGVGdWxscGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyhmYWxzZSk7XG4gICAgfTtcblxuICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uID0gZnVuY3Rpb24obmV4dFNsaWRlSW5kZXgsICRuZXh0U2xpZGUpIHtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgdmFyIGltZ1VybCA9ICRuZXh0U2xpZGUuZmluZCgnLmpzLXBhbmVsLWJnJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG5cbiAgICAgICAgJGxvZ29PdmVybGF5QmcuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1nVXJsKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2lsZW50TW92ZVRvKG5leHRTbGlkZUluZGV4KTtcblxuXG4gICAgICAgIH0sIG92ZXJsYXlUcmFuc2l0aW9uVGltaW5nLzIpO1xuXG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmVzdW1lRnVsbHBhZ2UoKTtcbiAgICAgICAgfSwgZnVsbFRyYXNpdGlvbkRlbGF5KTtcbiAgICB9O1xuXG4gICAgXG5cbiAgICBjdXN0b21OZXh0U2xpZGVMb2dpYyA9IGZ1bmN0aW9uIG5leHRTbGlkZShuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSl7XG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvL2Rpc2FibGUgc2Nyb2xsaW5nIGZ1bmN0aW9uYWxpdHkgdW50aWwgd2UgZmluaXNoIHRyYW5zaXRpb25pbmcgb3V0IFxuICAgICAgICBkZWFjdGl2YXRlRnVsbHBhZ2UoKTtcblxuICAgICAgICBzaG93TG9nb1BpZWNlVHJhbnNpdGlvbihuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSk7ICAgIFxuICAgICAgICBcbiAgICB9O1xuXG4gICAgXG5cbiAgICBpbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAkKCcjZnVsbHBhZ2UnKS5mdWxscGFnZSh7XG4gICAgICAgICAgICBhbmNob3JzOiBbJ2hvbWUnLCdiZWVyJywgJ2Zvb2QnLCAnY3JhZnQtY29ja3RhaWxzJywgJ2NvbnRhY3QtbG9jYXRpb24nLCAncHJpdmF0ZS1ldmVudHMnLCAnZXZlbnRzJ10sXG4gICAgICAgICAgICBtZW51OiAnI3NpdGUtbmF2LW1lbnUnLFxuICAgICAgICAgICAgdmVydGljYWxDZW50ZXJlZDogZmFsc2UsXG4gICAgICAgICAgICBzZWN0aW9uU2VsZWN0b3I6ICcucGFuZWwnLFxuICAgICAgICAgICAgc2Nyb2xsaW5nU3BlZWQ6IDEwMDAsXG4gICAgICAgICAgICBmaXRUb1NlY3Rpb246IGZhbHNlLFxuICAgICAgICAgICAgZml0VG9TZWN0aW9uRGVsYXk6IDUwMDAsXG4gICAgICAgICAgICBub3JtYWxTY3JvbGxFbGVtZW50VG91Y2hUaHJlc2hvbGQ6IDEwLFxuICAgICAgICAgICAgdG91Y2hTZW5zaXRpdml0eTogMTAsXG4gICAgICAgICAgICAvL2FuaW1hdGVBbmNob3I6IGZhbHNlXG4gICAgICAgICAgICBvbkxlYXZlOiBmdW5jdGlvbihpbmRleCwgbmV4dEluZGV4LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIWlzVHJhbnNpdGlvbmluZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNsYXNzID0gKGRpcmVjdGlvbiA9PT0gXCJkb3duXCIpID8gb3ZlcmxheUNsYXNzRm9yd2FyZCA6IG92ZXJsYXlDbGFzc0ludmVyc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tTmV4dFNsaWRlTG9naWMobmV4dEluZGV4LCAkKHRoaXMpKTtcblxuICAgICAgICAgICAgICAgICAgICAvL2lmIHRoZXJlJ3MgYW4gYWN0aXZlIG1vZGFsXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb2RhbE92ZXJsYXkuY2xvc2VBY3RpdmVNb2RhbCgpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgZGVhY3RpdmF0ZUZ1bGxwYWdlKCk7XG4gICAgICAgIFxuICAgICAgICAkKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZG9tLWxvYWRlZCcpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKHRydWUpO1xuICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgIH0pOyBcblxuICAgIH07XG4gICAgXG4gICAgXG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGluaXRpYWxpemUsXG4gICAgICAgIGRlYWN0aXZhdGU6IGRlYWN0aXZhdGVGdWxscGFnZSxcbiAgICAgICAgZW5hYmxlOiByZXN1bWVGdWxscGFnZSxcbiAgICB9O1xuICAgIFxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdWxscGFnZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtb2RhbE92ZXJsYXkgPSAoZnVuY3Rpb24oKXtcblxuXG5cblx0dmFyIGluaXRNb2RhbE92ZXJsYXksXG5cdFx0aGFuZGxlTW9kYWxFdmVudCxcblx0XHRvcGVuTW9kYWwsXG5cdFx0Y2xvc2VNb2RhbCxcblx0XHRjdGFMYWJlbCxcblx0XHQkYWN0aXZlUGFuZWwsXG5cdFx0aXNBbmltYXRpbmcgPSBmYWxzZSxcblx0XHRzaG93TW9kYWxDbGFzcyA9ICdzaG93LW1vZGFsLW92ZXJsYXknLFxuXG5cdFx0Ly9tb2R1bGUgaW1wb3J0c1xuXHRcdGZ1bGxwYWdlID0gcmVxdWlyZSgnLi9mdWxscGFnZS5qcycpO1xuXG5cblx0XHRjbG9zZU1vZGFsID0gZnVuY3Rpb24oJGJ1dHRvbil7XG5cblx0XHRcdGlmKCAkYWN0aXZlUGFuZWwubGVuZ3RoKSB7XG5cdFx0XHRcdCRhY3RpdmVQYW5lbC5yZW1vdmVDbGFzcyhzaG93TW9kYWxDbGFzcyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZnVsbHBhZ2UnKVxuXHRcdFx0XHRcdC5maW5kKHNob3dNb2RhbENsYXNzKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhzaG93TW9kYWxDbGFzcyk7XG5cdFx0XHR9XG5cblx0XHRcdCRidXR0b24udGV4dChjdGFMYWJlbClcblx0XHRcdFx0LmRhdGEoJ21vZGFsLW9wZW4nLCBmYWxzZSk7XG5cblx0XHRcdCRhY3RpdmVQYW5lbCA9IHVuZGVmaW5lZDtcblxuXHRcdFx0aXNBbmltYXRpbmcgPSB0cnVlO1xuXG5cdFx0XHQvL2RlbGF5IGlubGluZSB3aXRoIHRyYW5zaXRpb25cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0aXNBbmltYXRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHQvL3Jlc3VtZSBmdWxwYWdlIGZ1bmN0aW9uYWxpdHlcblx0XHRcdFx0ZnVsbHBhZ2UuZW5hYmxlKCk7XG5cdFx0XHR9LCAxMzAwKTtcblxuXHRcdFx0XHRcdFx0XG5cdFx0fTtcblxuXHRcdG9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCRidXR0b24pe1xuXHRcdFx0JGFjdGl2ZVBhbmVsID0gJGJ1dHRvbi5jbG9zZXN0KCcucGFuZWwnKTtcblxuXHRcdFx0JGFjdGl2ZVBhbmVsLmFkZENsYXNzKHNob3dNb2RhbENsYXNzKTtcblxuXHRcdFx0Y3RhTGFiZWwgPSAkYnV0dG9uLnRleHQoKTtcblxuXHRcdFx0JGJ1dHRvbi50ZXh0KCdjbG9zZScpXG5cdFx0XHRcdC5kYXRhKCdtb2RhbC1vcGVuJywgdHJ1ZSk7XG5cblx0XHRcdC8vc3RvcCBmdWxscGFnZSBmcm9tIHdvcmtpbmdcblx0XHRcdGZ1bGxwYWdlLmRlYWN0aXZhdGUoKTtcblxuICAgIFx0XHQkYWN0aXZlUGFuZWwuZmluZCgnLm1vZGFsLW92ZXJsYXktY29udGVudCcpLnNjcm9sbFRvcCgwKTtcblx0XHR9O1xuXG5cblx0XHRoYW5kbGVNb2RhbEV2ZW50ID0gZnVuY3Rpb24gKGJ1dHRvbikge1xuXHRcdFx0dmFyICRidXR0b24gPSAkKGJ1dHRvbik7XG5cblx0XHRcdCgkYnV0dG9uLmRhdGEoJ21vZGFsLW9wZW4nKSkgPyBjbG9zZU1vZGFsKCRidXR0b24pIDogb3Blbk1vZGFsKCRidXR0b24pO1xuXHRcdH07XG5cblx0aW5pdE1vZGFsT3ZlcmxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdHZhciAkcGFuZWxzID0gJCgnI2Z1bGxwYWdlJykuZmluZCgnLnBhbmVsJyk7XG5cblx0XHQkcGFuZWxzLm9uKCdjbGljaycsICcuanMtbW9kYWwtb3BlbicsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdGV2LnN0b3BQcm9wb2dhdGlvbjtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0O1xuXHRcdFx0XG5cdFx0XHRpZihpc0FuaW1hdGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGhhbmRsZU1vZGFsRXZlbnQodGhpcyk7XG5cblx0XHR9KTtcblxuXHRcdCRwYW5lbHMgPSBudWxsO1xuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0TW9kYWxPdmVybGF5LFxuXHRcdGNsb3NlQWN0aXZlTW9kYWw6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoJGFjdGl2ZVBhbmVsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y2xvc2VNb2RhbCgkYWN0aXZlUGFuZWwuZmluZCgnLmpzLW1vZGFsLW9wZW4nKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW9kYWxPdmVybGF5OyIsIid1c2Ugc3RyaWN0JztcblxudmFyICRzaXRlSGVhZGVyID0gJCgnLmpzLXNpdGUtaGVhZGVyJyksXG5cdCRzaXRlTmF2ID0gJCgnLmpzLXNpdGUtbmF2JyksXG5cblx0Ly9tb2R1bGUgaW1wb3J0c1xuXHRmdWxscGFnZSA9IHJlcXVpcmUoJy4vZnVsbHBhZ2UuanMnKTtcblxuXG4kc2l0ZUhlYWRlci5vbignY2xpY2suTWVudScsICcuanMtbWVudS10b2dnbGUnLCBmdW5jdGlvbihldil7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcblxuICAgICRzaXRlSGVhZGVyLnRvZ2dsZUNsYXNzKCdzaG93LXNpdGUtbWVudScpO1xufSk7XG5cblxuJHNpdGVOYXYub24oJ2NsaWNrLk1lbnUnLCAnLmpzLW5hdi1saW5rJywgZnVuY3Rpb24oZXYpe1xuXG4gICAgJHNpdGVIZWFkZXIucmVtb3ZlQ2xhc3MoJ3Nob3ctc2l0ZS1tZW51Jyk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbi8vaGVscGVyIGZ1bmN0aW9uc1xud2luZG93LmhlbHBlclV0aWxzID0ge1xuICAgIGdldERvY0RpbWVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3aW5EaW1lbiA9IHt9O1xuXG4gICAgICAgIHdpbkRpbWVuLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgd2luRGltZW4ud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICByZXR1cm4gd2luRGltZW47XG4gICAgfVxufTtcblxud2luZG93LnBhcnNlUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eXFw/LywgJycpO1xuICAgIGlmICghc3RyKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoJyYnKS5yZWR1Y2UoZnVuY3Rpb24gKHJldCwgcGFyYW0pIHtcbiAgICAgICAgdmFyIHBhcnRzID0gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykuc3BsaXQoJz0nKTtcbiAgICAgICAgcmV0W3BhcnRzWzBdXSA9IHBhcnRzWzFdID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgb2YgYSBxdWVyeXN0cmluZ1xuICogQHBhcmFtICB7U3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgdG8gZ2V0IHRoZSB2YWx1ZSBvZlxuICogQHBhcmFtICB7U3RyaW5nfSB1cmwgICBUaGUgVVJMIHRvIGdldCB0aGUgdmFsdWUgZnJvbSAob3B0aW9uYWwpXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgIFRoZSBmaWVsZCB2YWx1ZVxuICovXG53aW5kb3cuZ2V0UXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAoZmllbGQsIHVybCkge1xuICAgIHZhciBocmVmID0gdXJsID8gdXJsIDogd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ1s/Jl0nICsgZmllbGQgKyAnPShbXiYjXSopJywgJ2knKTtcbiAgICB2YXIgc3RyaW5nID0gcmVnLmV4ZWMoaHJlZik7XG4gICAgcmV0dXJuIHN0cmluZyA/IHN0cmluZ1sxXSA6IG51bGw7XG59O1xuXG5cbi8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4vLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG5cbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXJcbi8vIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcblxuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cblxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSxcblx0ICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbFZhcnMgPSB7XG5cbiAgICBkZXZpY2U6IHtcbiAgICAgICAgaXNJcGFkOiBudWxsLFxuICAgICAgICBpc0lwaG9uZTogbnVsbFxuICAgIH0sXG5cbiAgICBlbGVtZW50U3RhdGVzOiB7XG4gICAgICAgIGhlYWRlckhlaWdodDogbnVsbFxuICAgIH0sXG5cbiAgICBlbGVtZW50czoge1xuICAgICAgICAkc2l0ZUhlYWRlcjogJCgnLmpzLXNpdGUtaGVhZGVyJylcbiAgICB9LFxuXG4gICAgaXNNb2JpbGU6IGZhbHNlLFxuICAgIGlzVGFibGV0TWF4OiBmYWxzZSxcbn07XG5cbnZhciBzZXR1cFZhbHVlcyxcblxuXHQvL3Jlc3BvbnNpdmUgbWVkaWEgcXVlcnkgZnVuY3Rpb25cblx0bXFNb2JpbGU7XG5cblxuZ2xvYmFsVmFycy5lbGVtZW50U3RhdGVzID0ge1xuICAgIGhlYWRlckhlaWdodDogZ2xvYmFsVmFycy5lbGVtZW50cy4kc2l0ZUhlYWRlci5vdXRlckhlaWdodCgpXG59O1xuXG5zZXR1cFZhbHVlcyA9IGZ1bmN0aW9uICh0YWJsZXRTdGF0ZSl7XG5cblx0Z2xvYmFsVmFycy5pc01vYmlsZSA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8IDc2NykgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBnbG9iYWxWYXJzLmlzVGFibGV0TWF4ID0gdGFibGV0U3RhdGU7XG5cbiAgICBnbG9iYWxWYXJzLmVsZW1lbnRTdGF0ZXMuaGVhZGVySGVpZ2h0ID0gTWF0aC5jZWlsKCBnbG9iYWxWYXJzLmVsZW1lbnRzLiRzaXRlSGVhZGVyLm91dGVySGVpZ2h0KCkgKTtcbn07XG5cbi8vbWFrZSBzdXJlIHRoaXMgbWF0Y2hlcyBjc3Ncbm1xTW9iaWxlID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDk2MHB4KScpO1xuXG4obXFNb2JpbGUubWF0Y2hlcykgPyBzZXR1cFZhbHVlcyh0cnVlKSA6IHNldHVwVmFsdWVzKGZhbHNlKTtcblx0XG5tcU1vYmlsZS5hZGRMaXN0ZW5lciggZnVuY3Rpb24oY2hhbmdlZCkge1xuXHQoY2hhbmdlZC5tYXRjaGVzKSA/IHNldHVwVmFsdWVzKHRydWUpIDogc2V0dXBWYWx1ZXMoZmFsc2UpO1xufSk7IFxuXG5cblxuKCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkgKSA/IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBob25lID0gdHJ1ZSA6IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBob25lID0gZmFsc2U7XG4oIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSkgKSA/IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBhZCA9IHRydWUgOiBnbG9iYWxWYXJzLmRldmljZS5pc0lwYWQgPSBmYWxzZTtcblxuXG5nbG9iYWxWYXJzLndpbmRvd1Jlc2l6ZSA9ICAoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgY2FsbGJhY2tzID0gW10sXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIC8vIGZpcmVkIG9uIHJlc2l6ZSBldmVudFxuICAgIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcblxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocnVuQ2FsbGJhY2tzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChydW5DYWxsYmFja3MsIDY2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gcnVuIHRoZSBhY3R1YWwgY2FsbGJhY2tzXG4gICAgZnVuY3Rpb24gcnVuQ2FsbGJhY2tzKCkge1xuXG4gICAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gYWRkcyBjYWxsYmFjayB0byBsb29wXG4gICAgZnVuY3Rpb24gYWRkQ2FsbGJhY2soY2FsbGJhY2spIHtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZCB0byBhZGQgYWRkaXRpb25hbCBjYWxsYmFja1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH07XG59KCkpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVmFycztcblxuICAiLCJcblxuKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXF1aXJlKCcuL2FwcC92YXJpYWJsZXMnKTtcbiAgICByZXF1aXJlKCcuL2FwcC91dGlsLWhlbHBlcicpO1xuXG4gICAgXG4gICAgcmVxdWlyZSgnLi9hcHAvZnVsbHBhZ2UnKS5pbml0KCk7XG5cbiAgICByZXF1aXJlKCcuL2FwcC9zaXRlLWhlYWRlcicpO1xuICAgIFxuICAgIFxuICAgIHJlcXVpcmUoJy4vYXBwL2JyZXctdmlldycpLmluaXQoKTtcblxuICAgIHdpbmRvdy5tb2RhbE92ZXJsYXkgPSByZXF1aXJlKCcuL2FwcC9tb2RhbC1vdmVybGF5Jyk7XG5cbiAgICB3aW5kb3cubW9kYWxPdmVybGF5LmluaXQoKTtcbiAgIFxufSkod2luZG93KTtcbiJdfQ==
