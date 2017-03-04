(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var brewView = (function(){
	var initBrewView,
		showBrewDetail,
		closeBrewDetail,
		$brewPage,
		
		isAnimating = false,
		showBrewClass = 'show-brew-overlay';


		closeBrewDetail = function(){

			$('body').removeClass(showBrewClass);

			$brewPage.off('click.brewClose');

			isAnimating = true;
						
		};

		showBrewDetail = function($link){

			$('body').addClass(showBrewClass);

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

			showBrewDetail($(this));
		});

		$brewPage = $('#brew');
		
	};


	return {
		init: initBrewView
	};


})();

module.exports = brewView;
},{}],2:[function(require,module,exports){
var fullpage =  (function(){
    'use strict';

    var customNextSlideLogic,
        showLogoPieceTransition,
        resumeFullpage,
        deactivateFullpage,
        initialize,

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
},{}],3:[function(require,module,exports){
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
},{"./fullpage.js":2}],4:[function(require,module,exports){
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
},{"./fullpage.js":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

  
},{}],7:[function(require,module,exports){


(function (window) {
    'use strict';

    require('./app/variables');
    require('./app/util-helper');

    
    require('./app/fullpage').init();

    require('./app/site-header');
    
    require('./app/modal-overlay').init();
    require('./app/brew-view').init();
   
})(window);

},{"./app/brew-view":1,"./app/fullpage":2,"./app/modal-overlay":3,"./app/site-header":4,"./app/util-helper":5,"./app/variables":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2pzL2FwcC9icmV3LXZpZXcuanMiLCJzcmMvcHVibGljL2pzL2FwcC9mdWxscGFnZS5qcyIsInNyYy9wdWJsaWMvanMvYXBwL21vZGFsLW92ZXJsYXkuanMiLCJzcmMvcHVibGljL2pzL2FwcC9zaXRlLWhlYWRlci5qcyIsInNyYy9wdWJsaWMvanMvYXBwL3V0aWwtaGVscGVyLmpzIiwic3JjL3B1YmxpYy9qcy9hcHAvdmFyaWFibGVzLmpzIiwic3JjL3B1YmxpYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYnJld1ZpZXcgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGluaXRCcmV3Vmlldyxcblx0XHRzaG93QnJld0RldGFpbCxcblx0XHRjbG9zZUJyZXdEZXRhaWwsXG5cdFx0JGJyZXdQYWdlLFxuXHRcdFxuXHRcdGlzQW5pbWF0aW5nID0gZmFsc2UsXG5cdFx0c2hvd0JyZXdDbGFzcyA9ICdzaG93LWJyZXctb3ZlcmxheSc7XG5cblxuXHRcdGNsb3NlQnJld0RldGFpbCA9IGZ1bmN0aW9uKCl7XG5cblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcyhzaG93QnJld0NsYXNzKTtcblxuXHRcdFx0JGJyZXdQYWdlLm9mZignY2xpY2suYnJld0Nsb3NlJyk7XG5cblx0XHRcdGlzQW5pbWF0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFxuXHRcdH07XG5cblx0XHRzaG93QnJld0RldGFpbCA9IGZ1bmN0aW9uKCRsaW5rKXtcblxuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKHNob3dCcmV3Q2xhc3MpO1xuXG5cdFx0XHQkYnJld1BhZ2Uub24oJ2NsaWNrLmJyZXdDbG9zZScsICcuanMtY2xvc2UtYnJldycsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQ7XG5cdFx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbjtcblxuXHRcdFx0XHRjbG9zZUJyZXdEZXRhaWwoKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0aW5pdEJyZXdWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0JCgnI2JlZXItZ3JpZCcpLm9uKCdjbGljaycsICcuanMtYnJldy1saW5rJywgZnVuY3Rpb24oZXYpe1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQ7XG5cdFx0XHRldi5zdG9wUHJvcGFnYXRpb247XG5cblx0XHRcdHNob3dCcmV3RGV0YWlsKCQodGhpcykpO1xuXHRcdH0pO1xuXG5cdFx0JGJyZXdQYWdlID0gJCgnI2JyZXcnKTtcblx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdEJyZXdWaWV3XG5cdH07XG5cblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBicmV3VmlldzsiLCJ2YXIgZnVsbHBhZ2UgPSAgKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGN1c3RvbU5leHRTbGlkZUxvZ2ljLFxuICAgICAgICBzaG93TG9nb1BpZWNlVHJhbnNpdGlvbixcbiAgICAgICAgcmVzdW1lRnVsbHBhZ2UsXG4gICAgICAgIGRlYWN0aXZhdGVGdWxscGFnZSxcbiAgICAgICAgaW5pdGlhbGl6ZSxcblxuICAgICAgICBvdmVybGF5Q2xhc3MgPSAnc2hvdy1sb2dvLW92ZXJsYXknLFxuICAgICAgICBpc1RyYW5zaXRpb25pbmcgPSAgZmFsc2UsXG4gICAgICAgIGZvcmNlZFRyYW5zaXRpb24gPSBmYWxzZSxcbiAgICAgICAgb3ZlcmxheVRyYW5zaXRpb25UaW1pbmcgPSAxNTAwLFxuICAgICAgICBmdWxsVHJhc2l0aW9uRGVsYXkgPSBvdmVybGF5VHJhbnNpdGlvblRpbWluZyArIDYwMCxcblxuICAgICAgICAkbG9nb092ZXJsYXlCZyA9ICQoJyNsb2dvLW92ZXJsYXktYmcnKTtcblxuXG5cblxuICAgIHJlc3VtZUZ1bGxwYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG5cbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGRlYWN0aXZhdGVGdWxscGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyhmYWxzZSk7XG4gICAgfTtcblxuICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uID0gZnVuY3Rpb24obmV4dFNsaWRlSW5kZXgsICRuZXh0U2xpZGUpIHtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgdmFyIGltZ1VybCA9ICRuZXh0U2xpZGUuZmluZCgnLmpzLXBhbmVsLWJnJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG5cbiAgICAgICAgJGxvZ29PdmVybGF5QmcuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1nVXJsKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2lsZW50TW92ZVRvKG5leHRTbGlkZUluZGV4KTtcblxuXG4gICAgICAgIH0sIG92ZXJsYXlUcmFuc2l0aW9uVGltaW5nLzIpO1xuXG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmVzdW1lRnVsbHBhZ2UoKTtcbiAgICAgICAgfSwgZnVsbFRyYXNpdGlvbkRlbGF5KTtcbiAgICB9O1xuXG4gICAgXG5cbiAgICBjdXN0b21OZXh0U2xpZGVMb2dpYyA9IGZ1bmN0aW9uIG5leHRTbGlkZShuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSl7XG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvL2Rpc2FibGUgc2Nyb2xsaW5nIGZ1bmN0aW9uYWxpdHkgdW50aWwgd2UgZmluaXNoIHRyYW5zaXRpb25pbmcgb3V0IFxuICAgICAgICBkZWFjdGl2YXRlRnVsbHBhZ2UoKTtcblxuICAgICAgICBzaG93TG9nb1BpZWNlVHJhbnNpdGlvbihuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSk7ICAgIFxuICAgICAgICBcbiAgICB9O1xuXG4gICAgXG5cbiAgICBpbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAkKCcjZnVsbHBhZ2UnKS5mdWxscGFnZSh7XG4gICAgICAgICAgICBhbmNob3JzOiBbJ2JlZXInLCAnZm9vZCcsICdjcmFmdC1jb2NrdGFpbHMnLCAnY29udGFjdC1sb2NhdGlvbicsICdwcml2YXRlLWV2ZW50cycsICdldmVudHMnXSxcbiAgICAgICAgICAgIG1lbnU6ICcjc2l0ZS1uYXYtbWVudScsXG4gICAgICAgICAgICB2ZXJ0aWNhbENlbnRlcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIHNlY3Rpb25TZWxlY3RvcjogJy5wYW5lbCcsXG4gICAgICAgICAgICBzY3JvbGxpbmdTcGVlZDogMTAwMCxcbiAgICAgICAgICAgIGZpdFRvU2VjdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBmaXRUb1NlY3Rpb25EZWxheTogNTAwMCxcbiAgICAgICAgICAgIG5vcm1hbFNjcm9sbEVsZW1lbnRUb3VjaFRocmVzaG9sZDogMTAsXG4gICAgICAgICAgICB0b3VjaFNlbnNpdGl2aXR5OiAxMCxcbiAgICAgICAgICAgIC8vYW5pbWF0ZUFuY2hvcjogZmFsc2VcbiAgICAgICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uKGluZGV4LCBuZXh0SW5kZXgsIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghaXNUcmFuc2l0aW9uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbU5leHRTbGlkZUxvZ2ljKG5leHRJbmRleCwgJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGRlYWN0aXZhdGVGdWxscGFnZSgpO1xuXG5cbiAgICAgICAgXG4gICAgICAgICQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdkb20tbG9hZGVkJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgfSk7IFxuXG4gICAgfTtcbiAgICBcbiAgICBcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdGlhbGl6ZSxcbiAgICAgICAgZGVhY3RpdmF0ZTogZGVhY3RpdmF0ZUZ1bGxwYWdlLFxuICAgICAgICBlbmFibGU6IHJlc3VtZUZ1bGxwYWdlLFxuICAgIH07XG4gICAgXG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bGxwYWdlOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1vZGFsT3ZlcmxheSA9IChmdW5jdGlvbigpe1xuXG5cblxuXHR2YXIgaW5pdE1vZGFsT3ZlcmxheSxcblx0XHRoYW5kbGVNb2RhbEV2ZW50LFxuXHRcdG9wZW5Nb2RhbCxcblx0XHRjbG9zZU1vZGFsLFxuXHRcdGN0YUxhYmVsLFxuXHRcdCRhY3RpdmVQYW5lbCxcblx0XHRpc0FuaW1hdGluZyA9IGZhbHNlLFxuXHRcdHNob3dNb2RhbENsYXNzID0gJ3Nob3ctbW9kYWwtb3ZlcmxheScsXG5cblx0XHQvL21vZHVsZSBpbXBvcnRzXG5cdFx0ZnVsbHBhZ2UgPSByZXF1aXJlKCcuL2Z1bGxwYWdlLmpzJyk7XG5cblxuXHRcdGNsb3NlTW9kYWwgPSBmdW5jdGlvbigkYnV0dG9uKXtcblxuXHRcdFx0aWYoICRhY3RpdmVQYW5lbC5sZW5ndGgpIHtcblx0XHRcdFx0JGFjdGl2ZVBhbmVsLnJlbW92ZUNsYXNzKHNob3dNb2RhbENsYXNzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNmdWxscGFnZScpXG5cdFx0XHRcdFx0LmZpbmQoc2hvd01vZGFsQ2xhc3MpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKHNob3dNb2RhbENsYXNzKTtcblx0XHRcdH1cblxuXHRcdFx0JGJ1dHRvbi50ZXh0KGN0YUxhYmVsKVxuXHRcdFx0XHQuZGF0YSgnbW9kYWwtb3BlbicsIGZhbHNlKTtcblxuXHRcdFx0JGFjdGl2ZVBhbmVsID0gbnVsbDtcblxuXHRcdFx0aXNBbmltYXRpbmcgPSB0cnVlO1xuXG5cblx0XHRcdC8vZGVsYXkgaW5saW5lIHdpdGggdHJhbnNpdGlvblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vcmVzdW1lIGZ1bHBhZ2UgZnVuY3Rpb25hbGl0eVxuXHRcdFx0XHRmdWxscGFnZS5lbmFibGUoKTtcblx0XHRcdH0sIDEzMDApO1xuXG5cdFx0XHRcdFx0XHRcblx0XHR9O1xuXG5cdFx0b3Blbk1vZGFsID0gZnVuY3Rpb24oJGJ1dHRvbil7XG5cdFx0XHQkYWN0aXZlUGFuZWwgPSAkYnV0dG9uLmNsb3Nlc3QoJy5wYW5lbCcpO1xuXG5cdFx0XHQkYWN0aXZlUGFuZWwuYWRkQ2xhc3Moc2hvd01vZGFsQ2xhc3MpO1xuXG5cdFx0XHRjdGFMYWJlbCA9ICRidXR0b24udGV4dCgpO1xuXG5cdFx0XHQkYnV0dG9uLnRleHQoJ2Nsb3NlJylcblx0XHRcdFx0LmRhdGEoJ21vZGFsLW9wZW4nLCB0cnVlKTtcblxuXHRcdFx0Ly9zdG9wIGZ1bGxwYWdlIGZyb20gd29ya2luZ1xuXHRcdFx0ZnVsbHBhZ2UuZGVhY3RpdmF0ZSgpO1xuXG4gICAgXHRcdCRhY3RpdmVQYW5lbC5maW5kKCcubW9kYWwtb3ZlcmxheS1jb250ZW50Jykuc2Nyb2xsVG9wKDApO1xuXHRcdH07XG5cblxuXHRcdGhhbmRsZU1vZGFsRXZlbnQgPSBmdW5jdGlvbiAoYnV0dG9uKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9ICQoYnV0dG9uKTtcblxuXHRcdFx0KCRidXR0b24uZGF0YSgnbW9kYWwtb3BlbicpKSA/IGNsb3NlTW9kYWwoJGJ1dHRvbikgOiBvcGVuTW9kYWwoJGJ1dHRvbik7XG5cdFx0fTtcblxuXHRpbml0TW9kYWxPdmVybGF5ID0gZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0dmFyICRwYW5lbHMgPSAkKCcjZnVsbHBhZ2UnKS5maW5kKCcucGFuZWwnKTtcblxuXHRcdCRwYW5lbHMub24oJ2NsaWNrJywgJy5qcy1tb2RhbC1vcGVuJywgZnVuY3Rpb24oZXYpe1xuXHRcdFx0ZXYuc3RvcFByb3BvZ2F0aW9uO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQ7XG5cdFx0XHRcblx0XHRcdGlmKGlzQW5pbWF0aW5nKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aGFuZGxlTW9kYWxFdmVudCh0aGlzKTtcblxuXHRcdH0pO1xuXG5cdFx0JHBhbmVscyA9IG51bGw7XG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRNb2RhbE92ZXJsYXlcblx0fTtcblxuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vZGFsT3ZlcmxheTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkc2l0ZUhlYWRlciA9ICQoJy5qcy1zaXRlLWhlYWRlcicpLFxuXHQkc2l0ZU5hdiA9ICQoJy5qcy1zaXRlLW5hdicpLFxuXG5cdC8vbW9kdWxlIGltcG9ydHNcblx0ZnVsbHBhZ2UgPSByZXF1aXJlKCcuL2Z1bGxwYWdlLmpzJyk7XG5cblxuJHNpdGVIZWFkZXIub24oJ2NsaWNrLk1lbnUnLCAnLmpzLW1lbnUtdG9nZ2xlJywgZnVuY3Rpb24oZXYpe1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkc2l0ZUhlYWRlci50b2dnbGVDbGFzcygnc2hvdy1zaXRlLW1lbnUnKTtcbn0pO1xuXG5cbiRzaXRlTmF2Lm9uKCdjbGljay5NZW51JywgJy5qcy1uYXYtbGluaycsIGZ1bmN0aW9uKGV2KXtcbiAgICBcbiAgICBcblxuXG4gICAgJHNpdGVIZWFkZXIucmVtb3ZlQ2xhc3MoJ3Nob3ctc2l0ZS1tZW51Jyk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbi8vaGVscGVyIGZ1bmN0aW9uc1xud2luZG93LmhlbHBlclV0aWxzID0ge1xuICAgIGdldERvY0RpbWVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3aW5EaW1lbiA9IHt9O1xuXG4gICAgICAgIHdpbkRpbWVuLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgd2luRGltZW4ud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICByZXR1cm4gd2luRGltZW47XG4gICAgfVxufTtcblxud2luZG93LnBhcnNlUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eXFw/LywgJycpO1xuICAgIGlmICghc3RyKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoJyYnKS5yZWR1Y2UoZnVuY3Rpb24gKHJldCwgcGFyYW0pIHtcbiAgICAgICAgdmFyIHBhcnRzID0gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykuc3BsaXQoJz0nKTtcbiAgICAgICAgcmV0W3BhcnRzWzBdXSA9IHBhcnRzWzFdID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgb2YgYSBxdWVyeXN0cmluZ1xuICogQHBhcmFtICB7U3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgdG8gZ2V0IHRoZSB2YWx1ZSBvZlxuICogQHBhcmFtICB7U3RyaW5nfSB1cmwgICBUaGUgVVJMIHRvIGdldCB0aGUgdmFsdWUgZnJvbSAob3B0aW9uYWwpXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgIFRoZSBmaWVsZCB2YWx1ZVxuICovXG53aW5kb3cuZ2V0UXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAoZmllbGQsIHVybCkge1xuICAgIHZhciBocmVmID0gdXJsID8gdXJsIDogd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ1s/Jl0nICsgZmllbGQgKyAnPShbXiYjXSopJywgJ2knKTtcbiAgICB2YXIgc3RyaW5nID0gcmVnLmV4ZWMoaHJlZik7XG4gICAgcmV0dXJuIHN0cmluZyA/IHN0cmluZ1sxXSA6IG51bGw7XG59O1xuXG5cbi8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4vLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG5cbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXJcbi8vIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcblxuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cblxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSxcblx0ICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbFZhcnMgPSB7XG5cbiAgICBkZXZpY2U6IHtcbiAgICAgICAgaXNJcGFkOiBudWxsLFxuICAgICAgICBpc0lwaG9uZTogbnVsbFxuICAgIH0sXG5cbiAgICBlbGVtZW50U3RhdGVzOiB7XG4gICAgICAgIGhlYWRlckhlaWdodDogbnVsbFxuICAgIH0sXG5cbiAgICBlbGVtZW50czoge1xuICAgICAgICAkc2l0ZUhlYWRlcjogJCgnLmpzLXNpdGUtaGVhZGVyJylcbiAgICB9LFxuXG4gICAgaXNNb2JpbGU6IGZhbHNlLFxuICAgIGlzVGFibGV0TWF4OiBmYWxzZSxcbn07XG5cbnZhciBzZXR1cFZhbHVlcyxcblxuXHQvL3Jlc3BvbnNpdmUgbWVkaWEgcXVlcnkgZnVuY3Rpb25cblx0bXFNb2JpbGU7XG5cblxuZ2xvYmFsVmFycy5lbGVtZW50U3RhdGVzID0ge1xuICAgIGhlYWRlckhlaWdodDogZ2xvYmFsVmFycy5lbGVtZW50cy4kc2l0ZUhlYWRlci5vdXRlckhlaWdodCgpXG59O1xuXG5zZXR1cFZhbHVlcyA9IGZ1bmN0aW9uICh0YWJsZXRTdGF0ZSl7XG5cblx0Z2xvYmFsVmFycy5pc01vYmlsZSA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8IDc2NykgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBnbG9iYWxWYXJzLmlzVGFibGV0TWF4ID0gdGFibGV0U3RhdGU7XG5cbiAgICBnbG9iYWxWYXJzLmVsZW1lbnRTdGF0ZXMuaGVhZGVySGVpZ2h0ID0gTWF0aC5jZWlsKCBnbG9iYWxWYXJzLmVsZW1lbnRzLiRzaXRlSGVhZGVyLm91dGVySGVpZ2h0KCkgKTtcbn07XG5cbi8vbWFrZSBzdXJlIHRoaXMgbWF0Y2hlcyBjc3Ncbm1xTW9iaWxlID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDk2MHB4KScpO1xuXG4obXFNb2JpbGUubWF0Y2hlcykgPyBzZXR1cFZhbHVlcyh0cnVlKSA6IHNldHVwVmFsdWVzKGZhbHNlKTtcblx0XG5tcU1vYmlsZS5hZGRMaXN0ZW5lciggZnVuY3Rpb24oY2hhbmdlZCkge1xuXHQoY2hhbmdlZC5tYXRjaGVzKSA/IHNldHVwVmFsdWVzKHRydWUpIDogc2V0dXBWYWx1ZXMoZmFsc2UpO1xufSk7IFxuXG5cblxuKCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkgKSA/IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBob25lID0gdHJ1ZSA6IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBob25lID0gZmFsc2U7XG4oIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSkgKSA/IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBhZCA9IHRydWUgOiBnbG9iYWxWYXJzLmRldmljZS5pc0lwYWQgPSBmYWxzZTtcblxuXG5nbG9iYWxWYXJzLndpbmRvd1Jlc2l6ZSA9ICAoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgY2FsbGJhY2tzID0gW10sXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIC8vIGZpcmVkIG9uIHJlc2l6ZSBldmVudFxuICAgIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcblxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocnVuQ2FsbGJhY2tzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChydW5DYWxsYmFja3MsIDY2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gcnVuIHRoZSBhY3R1YWwgY2FsbGJhY2tzXG4gICAgZnVuY3Rpb24gcnVuQ2FsbGJhY2tzKCkge1xuXG4gICAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gYWRkcyBjYWxsYmFjayB0byBsb29wXG4gICAgZnVuY3Rpb24gYWRkQ2FsbGJhY2soY2FsbGJhY2spIHtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZCB0byBhZGQgYWRkaXRpb25hbCBjYWxsYmFja1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH07XG59KCkpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVmFycztcblxuICAiLCJcblxuKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXF1aXJlKCcuL2FwcC92YXJpYWJsZXMnKTtcbiAgICByZXF1aXJlKCcuL2FwcC91dGlsLWhlbHBlcicpO1xuXG4gICAgXG4gICAgcmVxdWlyZSgnLi9hcHAvZnVsbHBhZ2UnKS5pbml0KCk7XG5cbiAgICByZXF1aXJlKCcuL2FwcC9zaXRlLWhlYWRlcicpO1xuICAgIFxuICAgIHJlcXVpcmUoJy4vYXBwL21vZGFsLW92ZXJsYXknKS5pbml0KCk7XG4gICAgcmVxdWlyZSgnLi9hcHAvYnJldy12aWV3JykuaW5pdCgpO1xuICAgXG59KSh3aW5kb3cpO1xuIl19
