(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){

'use strict';



    var customNextSlideLogic,
        showLogoPieceTransition,
        resumeFullpage,

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
        $.fn.fullpage.setAllowScrolling(false);
        $.fn.fullpage.setKeyboardScrolling(false);

        showLogoPieceTransition(nextSlideIndex, $nextSlide);    
        
    };
    
    $('#fullpage').fullpage({
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
    
    
    $.fn.fullpage.setAllowScrolling(false);
    $.fn.fullpage.setKeyboardScrolling(false);


    
    $(function(){
        $('body').addClass('dom-loaded');

        setTimeout(function(){
            $.fn.fullpage.setAllowScrolling(true);
            $.fn.fullpage.setKeyboardScrolling(true);
        }, 2000);
    }); 
    

    
}());
},{}],2:[function(require,module,exports){
'use strict';

var modalOverlay = (function(){



	var initModalOverlay,
		handleModalEvent,
		openModal,
		closeModal,
		ctaLabel,
		$activePanel,
		showModalClass = 'show-modal-overlay';


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


			
						
		};

		openModal = function($button){
			$activePanel = $button.closest('.panel');

			$activePanel.addClass(showModalClass);

			ctaLabel = $button.text();

			$button.text('close')
				.data('modal-open', true);

			//stop fullpage from working
			$.fn.fullpage.setAllowScrolling(false);
    		$.fn.fullpage.setKeyboardScrolling(false);
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
			
			handleModalEvent(this);

		});

		$panels = null;
	};


	return {
		init: initModalOverlay
	};


})();

module.exports = modalOverlay;
},{}],3:[function(require,module,exports){
'use strict';

var $siteHeader = $('.js-site-header');


$siteHeader.on('click.Menu', '.js-menu-toggle', function(ev){
    ev.stopPropagation();
    ev.preventDefault();

    $siteHeader.toggleClass('show-site-menu');
});
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

  
},{}],6:[function(require,module,exports){


(function (window) {
    'use strict';

    require('./app/variables');
    require('./app/util-helper');

    require('./app/site-header');
    require('./app/homepage');

    require('./app/modal-overlay').init();
   
})(window);

},{"./app/homepage":1,"./app/modal-overlay":2,"./app/site-header":3,"./app/util-helper":4,"./app/variables":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2pzL2FwcC9ob21lcGFnZS5qcyIsInNyYy9wdWJsaWMvanMvYXBwL21vZGFsLW92ZXJsYXkuanMiLCJzcmMvcHVibGljL2pzL2FwcC9zaXRlLWhlYWRlci5qcyIsInNyYy9wdWJsaWMvanMvYXBwL3V0aWwtaGVscGVyLmpzIiwic3JjL3B1YmxpYy9qcy9hcHAvdmFyaWFibGVzLmpzIiwic3JjL3B1YmxpYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG5cbid1c2Ugc3RyaWN0JztcblxuXG5cbiAgICB2YXIgY3VzdG9tTmV4dFNsaWRlTG9naWMsXG4gICAgICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uLFxuICAgICAgICByZXN1bWVGdWxscGFnZSxcblxuICAgICAgICBvdmVybGF5Q2xhc3MgPSAnc2hvdy1sb2dvLW92ZXJsYXknLFxuICAgICAgICBpc1RyYW5zaXRpb25pbmcgPSAgZmFsc2UsXG4gICAgICAgIGZvcmNlZFRyYW5zaXRpb24gPSBmYWxzZSxcbiAgICAgICAgb3ZlcmxheVRyYW5zaXRpb25UaW1pbmcgPSAxNTAwLFxuICAgICAgICBmdWxsVHJhc2l0aW9uRGVsYXkgPSBvdmVybGF5VHJhbnNpdGlvblRpbWluZyArIDYwMCxcblxuICAgICAgICAkbG9nb092ZXJsYXlCZyA9ICQoJyNsb2dvLW92ZXJsYXktYmcnKTtcblxuICAgIHJlc3VtZUZ1bGxwYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG5cbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHNob3dMb2dvUGllY2VUcmFuc2l0aW9uID0gZnVuY3Rpb24obmV4dFNsaWRlSW5kZXgsICRuZXh0U2xpZGUpIHtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKG92ZXJsYXlDbGFzcyk7XG5cbiAgICAgICAgdmFyIGltZ1VybCA9ICRuZXh0U2xpZGUuZmluZCgnLmpzLXBhbmVsLWJnJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG5cbiAgICAgICAgJGxvZ29PdmVybGF5QmcuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1nVXJsKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2lsZW50TW92ZVRvKG5leHRTbGlkZUluZGV4KTtcblxuXG4gICAgICAgIH0sIG92ZXJsYXlUcmFuc2l0aW9uVGltaW5nLzIpO1xuXG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmVzdW1lRnVsbHBhZ2UoKTtcbiAgICAgICAgfSwgZnVsbFRyYXNpdGlvbkRlbGF5KTtcbiAgICB9O1xuXG4gICAgXG5cbiAgICBjdXN0b21OZXh0U2xpZGVMb2dpYyA9IGZ1bmN0aW9uIG5leHRTbGlkZShuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSl7XG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvL2Rpc2FibGUgc2Nyb2xsaW5nIGZ1bmN0aW9uYWxpdHkgdW50aWwgd2UgZmluaXNoIHRyYW5zaXRpb25pbmcgb3V0IFxuICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyhmYWxzZSk7XG5cbiAgICAgICAgc2hvd0xvZ29QaWVjZVRyYW5zaXRpb24obmV4dFNsaWRlSW5kZXgsICRuZXh0U2xpZGUpOyAgICBcbiAgICAgICAgXG4gICAgfTtcbiAgICBcbiAgICAkKCcjZnVsbHBhZ2UnKS5mdWxscGFnZSh7XG4gICAgICAgIHZlcnRpY2FsQ2VudGVyZWQ6IGZhbHNlLFxuICAgICAgICBzZWN0aW9uU2VsZWN0b3I6ICcucGFuZWwnLFxuICAgICAgICBzY3JvbGxpbmdTcGVlZDogMTAwMCxcbiAgICAgICAgZml0VG9TZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgZml0VG9TZWN0aW9uRGVsYXk6IDUwMDAsXG4gICAgICAgIG5vcm1hbFNjcm9sbEVsZW1lbnRUb3VjaFRocmVzaG9sZDogMTAsXG4gICAgICAgIHRvdWNoU2Vuc2l0aXZpdHk6IDEwLFxuICAgICAgICAvL2FuaW1hdGVBbmNob3I6IGZhbHNlXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uKGluZGV4LCBuZXh0SW5kZXgsIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWlzVHJhbnNpdGlvbmluZykge1xuICAgICAgICAgICAgICAgIGN1c3RvbU5leHRTbGlkZUxvZ2ljKG5leHRJbmRleCwgJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgXG4gICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyhmYWxzZSk7XG4gICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyhmYWxzZSk7XG5cblxuICAgIFxuICAgICQoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdkb20tbG9hZGVkJyk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH0pOyBcbiAgICBcblxuICAgIFxufSgpKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtb2RhbE92ZXJsYXkgPSAoZnVuY3Rpb24oKXtcblxuXG5cblx0dmFyIGluaXRNb2RhbE92ZXJsYXksXG5cdFx0aGFuZGxlTW9kYWxFdmVudCxcblx0XHRvcGVuTW9kYWwsXG5cdFx0Y2xvc2VNb2RhbCxcblx0XHRjdGFMYWJlbCxcblx0XHQkYWN0aXZlUGFuZWwsXG5cdFx0c2hvd01vZGFsQ2xhc3MgPSAnc2hvdy1tb2RhbC1vdmVybGF5JztcblxuXG5cdFx0Y2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCRidXR0b24pe1xuXG5cdFx0XHRpZiggJGFjdGl2ZVBhbmVsLmxlbmd0aCkge1xuXHRcdFx0XHQkYWN0aXZlUGFuZWwucmVtb3ZlQ2xhc3Moc2hvd01vZGFsQ2xhc3MpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2Z1bGxwYWdlJylcblx0XHRcdFx0XHQuZmluZChzaG93TW9kYWxDbGFzcylcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3Moc2hvd01vZGFsQ2xhc3MpO1xuXHRcdFx0fVxuXG5cdFx0XHQkYnV0dG9uLnRleHQoY3RhTGFiZWwpXG5cdFx0XHRcdC5kYXRhKCdtb2RhbC1vcGVuJywgZmFsc2UpO1xuXG5cdFx0XHQkYWN0aXZlUGFuZWwgPSBudWxsO1xuXG5cblx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0fTtcblxuXHRcdG9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCRidXR0b24pe1xuXHRcdFx0JGFjdGl2ZVBhbmVsID0gJGJ1dHRvbi5jbG9zZXN0KCcucGFuZWwnKTtcblxuXHRcdFx0JGFjdGl2ZVBhbmVsLmFkZENsYXNzKHNob3dNb2RhbENsYXNzKTtcblxuXHRcdFx0Y3RhTGFiZWwgPSAkYnV0dG9uLnRleHQoKTtcblxuXHRcdFx0JGJ1dHRvbi50ZXh0KCdjbG9zZScpXG5cdFx0XHRcdC5kYXRhKCdtb2RhbC1vcGVuJywgdHJ1ZSk7XG5cblx0XHRcdC8vc3RvcCBmdWxscGFnZSBmcm9tIHdvcmtpbmdcblx0XHRcdCQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcoZmFsc2UpO1xuICAgIFx0XHQkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKGZhbHNlKTtcblx0XHR9O1xuXG5cblx0XHRoYW5kbGVNb2RhbEV2ZW50ID0gZnVuY3Rpb24gKGJ1dHRvbikge1xuXHRcdFx0dmFyICRidXR0b24gPSAkKGJ1dHRvbik7XG5cblx0XHRcdCgkYnV0dG9uLmRhdGEoJ21vZGFsLW9wZW4nKSkgPyBjbG9zZU1vZGFsKCRidXR0b24pIDogb3Blbk1vZGFsKCRidXR0b24pO1xuXHRcdH07XG5cblx0aW5pdE1vZGFsT3ZlcmxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdHZhciAkcGFuZWxzID0gJCgnI2Z1bGxwYWdlJykuZmluZCgnLnBhbmVsJyk7XG5cblx0XHQkcGFuZWxzLm9uKCdjbGljaycsICcuanMtbW9kYWwtb3BlbicsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdGV2LnN0b3BQcm9wb2dhdGlvbjtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0O1xuXHRcdFx0XG5cdFx0XHRoYW5kbGVNb2RhbEV2ZW50KHRoaXMpO1xuXG5cdFx0fSk7XG5cblx0XHQkcGFuZWxzID0gbnVsbDtcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdE1vZGFsT3ZlcmxheVxuXHR9O1xuXG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW9kYWxPdmVybGF5OyIsIid1c2Ugc3RyaWN0JztcblxudmFyICRzaXRlSGVhZGVyID0gJCgnLmpzLXNpdGUtaGVhZGVyJyk7XG5cblxuJHNpdGVIZWFkZXIub24oJ2NsaWNrLk1lbnUnLCAnLmpzLW1lbnUtdG9nZ2xlJywgZnVuY3Rpb24oZXYpe1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkc2l0ZUhlYWRlci50b2dnbGVDbGFzcygnc2hvdy1zaXRlLW1lbnUnKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuLy9oZWxwZXIgZnVuY3Rpb25zXG53aW5kb3cuaGVscGVyVXRpbHMgPSB7XG4gICAgZ2V0RG9jRGltZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdpbkRpbWVuID0ge307XG5cbiAgICAgICAgd2luRGltZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB3aW5EaW1lbi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgIHJldHVybiB3aW5EaW1lbjtcbiAgICB9XG59O1xuXG53aW5kb3cucGFyc2VRdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG4gICAgaWYgKCFzdHIpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnRyaW0oKS5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbiAocmV0LCBwYXJhbSkge1xuICAgICAgICB2YXIgcGFydHMgPSBwYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKS5zcGxpdCgnPScpO1xuICAgICAgICByZXRbcGFydHNbMF1dID0gcGFydHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sIHt9KTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5c3RyaW5nXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpZWxkIFRoZSBmaWVsZCB0byBnZXQgdGhlIHZhbHVlIG9mXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHVybCAgIFRoZSBVUkwgdG8gZ2V0IHRoZSB2YWx1ZSBmcm9tIChvcHRpb25hbClcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgVGhlIGZpZWxkIHZhbHVlXG4gKi9cbndpbmRvdy5nZXRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChmaWVsZCwgdXJsKSB7XG4gICAgdmFyIGhyZWYgPSB1cmwgPyB1cmwgOiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnWz8mXScgKyBmaWVsZCArICc9KFteJiNdKiknLCAnaScpO1xuICAgIHZhciBzdHJpbmcgPSByZWcuZXhlYyhocmVmKTtcbiAgICByZXR1cm4gc3RyaW5nID8gc3RyaW5nWzFdIDogbnVsbDtcbn07XG5cblxuLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbi8vIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcblxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlclxuLy8gZml4ZXMgZnJvbSBQYXVsIElyaXNoIGFuZCBUaW5vIFppamRlbFxuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgfVxuXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LFxuXHQgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcblxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFsVmFycyA9IHtcblxuICAgIGRldmljZToge1xuICAgICAgICBpc0lwYWQ6IG51bGwsXG4gICAgICAgIGlzSXBob25lOiBudWxsXG4gICAgfSxcblxuICAgIGVsZW1lbnRTdGF0ZXM6IHtcbiAgICAgICAgaGVhZGVySGVpZ2h0OiBudWxsXG4gICAgfSxcblxuICAgIGVsZW1lbnRzOiB7XG4gICAgICAgICRzaXRlSGVhZGVyOiAkKCcuanMtc2l0ZS1oZWFkZXInKVxuICAgIH0sXG5cbiAgICBpc01vYmlsZTogZmFsc2UsXG4gICAgaXNUYWJsZXRNYXg6IGZhbHNlLFxufTtcblxudmFyIHNldHVwVmFsdWVzLFxuXG5cdC8vcmVzcG9uc2l2ZSBtZWRpYSBxdWVyeSBmdW5jdGlvblxuXHRtcU1vYmlsZTtcblxuXG5nbG9iYWxWYXJzLmVsZW1lbnRTdGF0ZXMgPSB7XG4gICAgaGVhZGVySGVpZ2h0OiBnbG9iYWxWYXJzLmVsZW1lbnRzLiRzaXRlSGVhZGVyLm91dGVySGVpZ2h0KClcbn07XG5cbnNldHVwVmFsdWVzID0gZnVuY3Rpb24gKHRhYmxldFN0YXRlKXtcblxuXHRnbG9iYWxWYXJzLmlzTW9iaWxlID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgNzY3KSA/IHRydWUgOiBmYWxzZTtcblxuICAgIGdsb2JhbFZhcnMuaXNUYWJsZXRNYXggPSB0YWJsZXRTdGF0ZTtcblxuICAgIGdsb2JhbFZhcnMuZWxlbWVudFN0YXRlcy5oZWFkZXJIZWlnaHQgPSBNYXRoLmNlaWwoIGdsb2JhbFZhcnMuZWxlbWVudHMuJHNpdGVIZWFkZXIub3V0ZXJIZWlnaHQoKSApO1xufTtcblxuLy9tYWtlIHN1cmUgdGhpcyBtYXRjaGVzIGNzc1xubXFNb2JpbGUgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogOTYwcHgpJyk7XG5cbihtcU1vYmlsZS5tYXRjaGVzKSA/IHNldHVwVmFsdWVzKHRydWUpIDogc2V0dXBWYWx1ZXMoZmFsc2UpO1xuXHRcbm1xTW9iaWxlLmFkZExpc3RlbmVyKCBmdW5jdGlvbihjaGFuZ2VkKSB7XG5cdChjaGFuZ2VkLm1hdGNoZXMpID8gc2V0dXBWYWx1ZXModHJ1ZSkgOiBzZXR1cFZhbHVlcyhmYWxzZSk7XG59KTsgXG5cblxuXG4oIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZS9pKSApID8gZ2xvYmFsVmFycy5kZXZpY2UuaXNJcGhvbmUgPSB0cnVlIDogZ2xvYmFsVmFycy5kZXZpY2UuaXNJcGhvbmUgPSBmYWxzZTtcbiggbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZC9pKSApID8gZ2xvYmFsVmFycy5kZXZpY2UuaXNJcGFkID0gdHJ1ZSA6IGdsb2JhbFZhcnMuZGV2aWNlLmlzSXBhZCA9IGZhbHNlO1xuXG5cbmdsb2JhbFZhcnMud2luZG93UmVzaXplID0gIChmdW5jdGlvbigpIHtcblxuICAgIHZhciBjYWxsYmFja3MgPSBbXSxcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuXG4gICAgLy8gZmlyZWQgb24gcmVzaXplIGV2ZW50XG4gICAgZnVuY3Rpb24gcmVzaXplKCkge1xuXG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcnVubmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShydW5DYWxsYmFja3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bkNhbGxiYWNrcywgNjYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBydW4gdGhlIGFjdHVhbCBjYWxsYmFja3NcbiAgICBmdW5jdGlvbiBydW5DYWxsYmFja3MoKSB7XG5cbiAgICAgICAgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBhZGRzIGNhbGxiYWNrIHRvIGxvb3BcbiAgICBmdW5jdGlvbiBhZGRDYWxsYmFjayhjYWxsYmFjaykge1xuXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kIHRvIGFkZCBhZGRpdGlvbmFsIGNhbGxiYWNrXG4gICAgICAgIGFkZDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkQ2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfTtcbn0oKSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxWYXJzO1xuXG4gICIsIlxuXG4oZnVuY3Rpb24gKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJlcXVpcmUoJy4vYXBwL3ZhcmlhYmxlcycpO1xuICAgIHJlcXVpcmUoJy4vYXBwL3V0aWwtaGVscGVyJyk7XG5cbiAgICByZXF1aXJlKCcuL2FwcC9zaXRlLWhlYWRlcicpO1xuICAgIHJlcXVpcmUoJy4vYXBwL2hvbWVwYWdlJyk7XG5cbiAgICByZXF1aXJlKCcuL2FwcC9tb2RhbC1vdmVybGF5JykuaW5pdCgpO1xuICAgXG59KSh3aW5kb3cpO1xuIl19
