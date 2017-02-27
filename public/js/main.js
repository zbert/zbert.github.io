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

			isAnimating = true;


			//delay inline with transition
			setTimeout(function(){
				isAnimating = false;

				//resume fulpage functionality
				$.fn.fullpage.setAllowScrolling(true);
    			$.fn.fullpage.setKeyboardScrolling(true);
			}, 1300);

						
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
},{}],4:[function(require,module,exports){
'use strict';

var $siteHeader = $('.js-site-header');


$siteHeader.on('click.Menu', '.js-menu-toggle', function(ev){
    ev.stopPropagation();
    ev.preventDefault();

    $siteHeader.toggleClass('show-site-menu');
});
},{}],5:[function(require,module,exports){
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

    require('./app/site-header');
    require('./app/homepage');

    require('./app/modal-overlay').init();
    require('./app/brew-view').init();
   
})(window);

},{"./app/brew-view":1,"./app/homepage":2,"./app/modal-overlay":3,"./app/site-header":4,"./app/util-helper":5,"./app/variables":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2pzL2FwcC9icmV3LXZpZXcuanMiLCJzcmMvcHVibGljL2pzL2FwcC9ob21lcGFnZS5qcyIsInNyYy9wdWJsaWMvanMvYXBwL21vZGFsLW92ZXJsYXkuanMiLCJzcmMvcHVibGljL2pzL2FwcC9zaXRlLWhlYWRlci5qcyIsInNyYy9wdWJsaWMvanMvYXBwL3V0aWwtaGVscGVyLmpzIiwic3JjL3B1YmxpYy9qcy9hcHAvdmFyaWFibGVzLmpzIiwic3JjL3B1YmxpYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYnJld1ZpZXcgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGluaXRCcmV3Vmlldyxcblx0XHRzaG93QnJld0RldGFpbCxcblx0XHRjbG9zZUJyZXdEZXRhaWwsXG5cdFx0JGJyZXdQYWdlLFxuXHRcdFxuXHRcdGlzQW5pbWF0aW5nID0gZmFsc2UsXG5cdFx0c2hvd0JyZXdDbGFzcyA9ICdzaG93LWJyZXctb3ZlcmxheSc7XG5cblxuXHRcdGNsb3NlQnJld0RldGFpbCA9IGZ1bmN0aW9uKCl7XG5cblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcyhzaG93QnJld0NsYXNzKTtcblxuXHRcdFx0JGJyZXdQYWdlLm9mZignY2xpY2suYnJld0Nsb3NlJyk7XG5cblx0XHRcdGlzQW5pbWF0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFxuXHRcdH07XG5cblx0XHRzaG93QnJld0RldGFpbCA9IGZ1bmN0aW9uKCRsaW5rKXtcblxuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKHNob3dCcmV3Q2xhc3MpO1xuXG5cdFx0XHQkYnJld1BhZ2Uub24oJ2NsaWNrLmJyZXdDbG9zZScsICcuanMtY2xvc2UtYnJldycsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQ7XG5cdFx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbjtcblxuXHRcdFx0XHRjbG9zZUJyZXdEZXRhaWwoKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0aW5pdEJyZXdWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0JCgnI2JlZXItZ3JpZCcpLm9uKCdjbGljaycsICcuanMtYnJldy1saW5rJywgZnVuY3Rpb24oZXYpe1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQ7XG5cdFx0XHRldi5zdG9wUHJvcGFnYXRpb247XG5cblx0XHRcdHNob3dCcmV3RGV0YWlsKCQodGhpcykpO1xuXHRcdH0pO1xuXG5cdFx0JGJyZXdQYWdlID0gJCgnI2JyZXcnKTtcblx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdEJyZXdWaWV3XG5cdH07XG5cblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBicmV3VmlldzsiLCIoZnVuY3Rpb24oKXtcblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuICAgIHZhciBjdXN0b21OZXh0U2xpZGVMb2dpYyxcbiAgICAgICAgc2hvd0xvZ29QaWVjZVRyYW5zaXRpb24sXG4gICAgICAgIHJlc3VtZUZ1bGxwYWdlLFxuXG4gICAgICAgIG92ZXJsYXlDbGFzcyA9ICdzaG93LWxvZ28tb3ZlcmxheScsXG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyA9ICBmYWxzZSxcbiAgICAgICAgZm9yY2VkVHJhbnNpdGlvbiA9IGZhbHNlLFxuICAgICAgICBvdmVybGF5VHJhbnNpdGlvblRpbWluZyA9IDE1MDAsXG4gICAgICAgIGZ1bGxUcmFzaXRpb25EZWxheSA9IG92ZXJsYXlUcmFuc2l0aW9uVGltaW5nICsgNjAwLFxuXG4gICAgICAgICRsb2dvT3ZlcmxheUJnID0gJCgnI2xvZ28tb3ZlcmxheS1iZycpO1xuXG4gICAgcmVzdW1lRnVsbHBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyh0cnVlKTtcblxuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3Mob3ZlcmxheUNsYXNzKTtcblxuICAgICAgICBpc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgc2hvd0xvZ29QaWVjZVRyYW5zaXRpb24gPSBmdW5jdGlvbihuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSkge1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3Mob3ZlcmxheUNsYXNzKTtcblxuICAgICAgICB2YXIgaW1nVXJsID0gJG5leHRTbGlkZS5maW5kKCcuanMtcGFuZWwtYmcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcblxuICAgICAgICAkbG9nb092ZXJsYXlCZy5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCBpbWdVcmwpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zaWxlbnRNb3ZlVG8obmV4dFNsaWRlSW5kZXgpO1xuXG5cbiAgICAgICAgfSwgb3ZlcmxheVRyYW5zaXRpb25UaW1pbmcvMik7XG5cblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXN1bWVGdWxscGFnZSgpO1xuICAgICAgICB9LCBmdWxsVHJhc2l0aW9uRGVsYXkpO1xuICAgIH07XG5cbiAgICBcblxuICAgIGN1c3RvbU5leHRTbGlkZUxvZ2ljID0gZnVuY3Rpb24gbmV4dFNsaWRlKG5leHRTbGlkZUluZGV4LCAkbmV4dFNsaWRlKXtcbiAgICAgICAgaXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIC8vZGlzYWJsZSBzY3JvbGxpbmcgZnVuY3Rpb25hbGl0eSB1bnRpbCB3ZSBmaW5pc2ggdHJhbnNpdGlvbmluZyBvdXQgXG4gICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcoZmFsc2UpO1xuICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKGZhbHNlKTtcblxuICAgICAgICBzaG93TG9nb1BpZWNlVHJhbnNpdGlvbihuZXh0U2xpZGVJbmRleCwgJG5leHRTbGlkZSk7ICAgIFxuICAgICAgICBcbiAgICB9O1xuICAgIFxuICAgICQoJyNmdWxscGFnZScpLmZ1bGxwYWdlKHtcbiAgICAgICAgdmVydGljYWxDZW50ZXJlZDogZmFsc2UsXG4gICAgICAgIHNlY3Rpb25TZWxlY3RvcjogJy5wYW5lbCcsXG4gICAgICAgIHNjcm9sbGluZ1NwZWVkOiAxMDAwLFxuICAgICAgICBmaXRUb1NlY3Rpb246IGZhbHNlLFxuICAgICAgICBmaXRUb1NlY3Rpb25EZWxheTogNTAwMCxcbiAgICAgICAgbm9ybWFsU2Nyb2xsRWxlbWVudFRvdWNoVGhyZXNob2xkOiAxMCxcbiAgICAgICAgdG91Y2hTZW5zaXRpdml0eTogMTAsXG4gICAgICAgIC8vYW5pbWF0ZUFuY2hvcjogZmFsc2VcbiAgICAgICAgb25MZWF2ZTogZnVuY3Rpb24oaW5kZXgsIG5leHRJbmRleCwgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghaXNUcmFuc2l0aW9uaW5nKSB7XG4gICAgICAgICAgICAgICAgY3VzdG9tTmV4dFNsaWRlTG9naWMobmV4dEluZGV4LCAkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBcbiAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKGZhbHNlKTtcblxuXG4gICAgXG4gICAgJChmdW5jdGlvbigpe1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2RvbS1sb2FkZWQnKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRLZXlib2FyZFNjcm9sbGluZyh0cnVlKTtcbiAgICAgICAgfSwgMjAwMCk7XG4gICAgfSk7IFxuICAgIFxuXG4gICAgXG59KCkpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1vZGFsT3ZlcmxheSA9IChmdW5jdGlvbigpe1xuXG5cblxuXHR2YXIgaW5pdE1vZGFsT3ZlcmxheSxcblx0XHRoYW5kbGVNb2RhbEV2ZW50LFxuXHRcdG9wZW5Nb2RhbCxcblx0XHRjbG9zZU1vZGFsLFxuXHRcdGN0YUxhYmVsLFxuXHRcdCRhY3RpdmVQYW5lbCxcblx0XHRpc0FuaW1hdGluZyA9IGZhbHNlLFxuXHRcdHNob3dNb2RhbENsYXNzID0gJ3Nob3ctbW9kYWwtb3ZlcmxheSc7XG5cblxuXHRcdGNsb3NlTW9kYWwgPSBmdW5jdGlvbigkYnV0dG9uKXtcblxuXHRcdFx0aWYoICRhY3RpdmVQYW5lbC5sZW5ndGgpIHtcblx0XHRcdFx0JGFjdGl2ZVBhbmVsLnJlbW92ZUNsYXNzKHNob3dNb2RhbENsYXNzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNmdWxscGFnZScpXG5cdFx0XHRcdFx0LmZpbmQoc2hvd01vZGFsQ2xhc3MpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKHNob3dNb2RhbENsYXNzKTtcblx0XHRcdH1cblxuXHRcdFx0JGJ1dHRvbi50ZXh0KGN0YUxhYmVsKVxuXHRcdFx0XHQuZGF0YSgnbW9kYWwtb3BlbicsIGZhbHNlKTtcblxuXHRcdFx0JGFjdGl2ZVBhbmVsID0gbnVsbDtcblxuXHRcdFx0aXNBbmltYXRpbmcgPSB0cnVlO1xuXG5cblx0XHRcdC8vZGVsYXkgaW5saW5lIHdpdGggdHJhbnNpdGlvblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vcmVzdW1lIGZ1bHBhZ2UgZnVuY3Rpb25hbGl0eVxuXHRcdFx0XHQkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKHRydWUpO1xuICAgIFx0XHRcdCQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG5cdFx0XHR9LCAxMzAwKTtcblxuXHRcdFx0XHRcdFx0XG5cdFx0fTtcblxuXHRcdG9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCRidXR0b24pe1xuXHRcdFx0JGFjdGl2ZVBhbmVsID0gJGJ1dHRvbi5jbG9zZXN0KCcucGFuZWwnKTtcblxuXHRcdFx0JGFjdGl2ZVBhbmVsLmFkZENsYXNzKHNob3dNb2RhbENsYXNzKTtcblxuXHRcdFx0Y3RhTGFiZWwgPSAkYnV0dG9uLnRleHQoKTtcblxuXHRcdFx0JGJ1dHRvbi50ZXh0KCdjbG9zZScpXG5cdFx0XHRcdC5kYXRhKCdtb2RhbC1vcGVuJywgdHJ1ZSk7XG5cblx0XHRcdC8vc3RvcCBmdWxscGFnZSBmcm9tIHdvcmtpbmdcblx0XHRcdCQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcoZmFsc2UpO1xuICAgIFx0XHQkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKGZhbHNlKTtcblxuICAgIFx0XHQkYWN0aXZlUGFuZWwuZmluZCgnLm1vZGFsLW92ZXJsYXktY29udGVudCcpLnNjcm9sbFRvcCgwKTtcblx0XHR9O1xuXG5cblx0XHRoYW5kbGVNb2RhbEV2ZW50ID0gZnVuY3Rpb24gKGJ1dHRvbikge1xuXHRcdFx0dmFyICRidXR0b24gPSAkKGJ1dHRvbik7XG5cblx0XHRcdCgkYnV0dG9uLmRhdGEoJ21vZGFsLW9wZW4nKSkgPyBjbG9zZU1vZGFsKCRidXR0b24pIDogb3Blbk1vZGFsKCRidXR0b24pO1xuXHRcdH07XG5cblx0aW5pdE1vZGFsT3ZlcmxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdHZhciAkcGFuZWxzID0gJCgnI2Z1bGxwYWdlJykuZmluZCgnLnBhbmVsJyk7XG5cblx0XHQkcGFuZWxzLm9uKCdjbGljaycsICcuanMtbW9kYWwtb3BlbicsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdGV2LnN0b3BQcm9wb2dhdGlvbjtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0O1xuXHRcdFx0XG5cdFx0XHRpZihpc0FuaW1hdGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGhhbmRsZU1vZGFsRXZlbnQodGhpcyk7XG5cblx0XHR9KTtcblxuXHRcdCRwYW5lbHMgPSBudWxsO1xuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0TW9kYWxPdmVybGF5XG5cdH07XG5cblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb2RhbE92ZXJsYXk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJHNpdGVIZWFkZXIgPSAkKCcuanMtc2l0ZS1oZWFkZXInKTtcblxuXG4kc2l0ZUhlYWRlci5vbignY2xpY2suTWVudScsICcuanMtbWVudS10b2dnbGUnLCBmdW5jdGlvbihldil7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcblxuICAgICRzaXRlSGVhZGVyLnRvZ2dsZUNsYXNzKCdzaG93LXNpdGUtbWVudScpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbndpbmRvdy5oZWxwZXJVdGlscyA9IHtcbiAgICBnZXREb2NEaW1lbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd2luRGltZW4gPSB7fTtcblxuICAgICAgICB3aW5EaW1lbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIHdpbkRpbWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgcmV0dXJuIHdpbkRpbWVuO1xuICAgIH1cbn07XG5cbndpbmRvdy5wYXJzZVF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZSgvXlxcPy8sICcnKTtcbiAgICBpZiAoIXN0cikge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIHJldHVybiBzdHIudHJpbSgpLnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uIChyZXQsIHBhcmFtKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IHBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpLnNwbGl0KCc9Jyk7XG4gICAgICAgIHJldFtwYXJ0c1swXV0gPSBwYXJ0c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSwge30pO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlIG9mIGEgcXVlcnlzdHJpbmdcbiAqIEBwYXJhbSAge1N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHRvIGdldCB0aGUgdmFsdWUgb2ZcbiAqIEBwYXJhbSAge1N0cmluZ30gdXJsICAgVGhlIFVSTCB0byBnZXQgdGhlIHZhbHVlIGZyb20gKG9wdGlvbmFsKVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICBUaGUgZmllbGQgdmFsdWVcbiAqL1xud2luZG93LmdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKGZpZWxkLCB1cmwpIHtcbiAgICB2YXIgaHJlZiA9IHVybCA/IHVybCA6IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdbPyZdJyArIGZpZWxkICsgJz0oW14mI10qKScsICdpJyk7XG4gICAgdmFyIHN0cmluZyA9IHJlZy5leGVjKGhyZWYpO1xuICAgIHJldHVybiBzdHJpbmcgPyBzdHJpbmdbMV0gOiBudWxsO1xufTtcblxuXG4vLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuXG4vLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyXG4vLyBmaXhlcyBmcm9tIFBhdWwgSXJpc2ggYW5kIFRpbm8gWmlqZGVsXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG5cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sXG5cdCAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfTtcbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxWYXJzID0ge1xuXG4gICAgZGV2aWNlOiB7XG4gICAgICAgIGlzSXBhZDogbnVsbCxcbiAgICAgICAgaXNJcGhvbmU6IG51bGxcbiAgICB9LFxuXG4gICAgZWxlbWVudFN0YXRlczoge1xuICAgICAgICBoZWFkZXJIZWlnaHQ6IG51bGxcbiAgICB9LFxuXG4gICAgZWxlbWVudHM6IHtcbiAgICAgICAgJHNpdGVIZWFkZXI6ICQoJy5qcy1zaXRlLWhlYWRlcicpXG4gICAgfSxcblxuICAgIGlzTW9iaWxlOiBmYWxzZSxcbiAgICBpc1RhYmxldE1heDogZmFsc2UsXG59O1xuXG52YXIgc2V0dXBWYWx1ZXMsXG5cblx0Ly9yZXNwb25zaXZlIG1lZGlhIHF1ZXJ5IGZ1bmN0aW9uXG5cdG1xTW9iaWxlO1xuXG5cbmdsb2JhbFZhcnMuZWxlbWVudFN0YXRlcyA9IHtcbiAgICBoZWFkZXJIZWlnaHQ6IGdsb2JhbFZhcnMuZWxlbWVudHMuJHNpdGVIZWFkZXIub3V0ZXJIZWlnaHQoKVxufTtcblxuc2V0dXBWYWx1ZXMgPSBmdW5jdGlvbiAodGFibGV0U3RhdGUpe1xuXG5cdGdsb2JhbFZhcnMuaXNNb2JpbGUgPSAod2luZG93LmlubmVyV2lkdGggPCA3NjcpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgZ2xvYmFsVmFycy5pc1RhYmxldE1heCA9IHRhYmxldFN0YXRlO1xuXG4gICAgZ2xvYmFsVmFycy5lbGVtZW50U3RhdGVzLmhlYWRlckhlaWdodCA9IE1hdGguY2VpbCggZ2xvYmFsVmFycy5lbGVtZW50cy4kc2l0ZUhlYWRlci5vdXRlckhlaWdodCgpICk7XG59O1xuXG4vL21ha2Ugc3VyZSB0aGlzIG1hdGNoZXMgY3NzXG5tcU1vYmlsZSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiA5NjBweCknKTtcblxuKG1xTW9iaWxlLm1hdGNoZXMpID8gc2V0dXBWYWx1ZXModHJ1ZSkgOiBzZXR1cFZhbHVlcyhmYWxzZSk7XG5cdFxubXFNb2JpbGUuYWRkTGlzdGVuZXIoIGZ1bmN0aW9uKGNoYW5nZWQpIHtcblx0KGNoYW5nZWQubWF0Y2hlcykgPyBzZXR1cFZhbHVlcyh0cnVlKSA6IHNldHVwVmFsdWVzKGZhbHNlKTtcbn0pOyBcblxuXG5cbiggbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lL2kpICkgPyBnbG9iYWxWYXJzLmRldmljZS5pc0lwaG9uZSA9IHRydWUgOiBnbG9iYWxWYXJzLmRldmljZS5pc0lwaG9uZSA9IGZhbHNlO1xuKCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpICkgPyBnbG9iYWxWYXJzLmRldmljZS5pc0lwYWQgPSB0cnVlIDogZ2xvYmFsVmFycy5kZXZpY2UuaXNJcGFkID0gZmFsc2U7XG5cblxuZ2xvYmFsVmFycy53aW5kb3dSZXNpemUgPSAgKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGNhbGxiYWNrcyA9IFtdLFxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG5cbiAgICAvLyBmaXJlZCBvbiByZXNpemUgZXZlbnRcbiAgICBmdW5jdGlvbiByZXNpemUoKSB7XG5cbiAgICAgICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJ1bkNhbGxiYWNrcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocnVuQ2FsbGJhY2tzLCA2Nik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIHJ1biB0aGUgYWN0dWFsIGNhbGxiYWNrc1xuICAgIGZ1bmN0aW9uIHJ1bkNhbGxiYWNrcygpIHtcblxuICAgICAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGFkZHMgY2FsbGJhY2sgdG8gbG9vcFxuICAgIGZ1bmN0aW9uIGFkZENhbGxiYWNrKGNhbGxiYWNrKSB7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2QgdG8gYWRkIGFkZGl0aW9uYWwgY2FsbGJhY2tcbiAgICAgICAgYWRkOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRDYWxsYmFjayhjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9O1xufSgpKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFZhcnM7XG5cbiAgIiwiXG5cbihmdW5jdGlvbiAod2luZG93KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmVxdWlyZSgnLi9hcHAvdmFyaWFibGVzJyk7XG4gICAgcmVxdWlyZSgnLi9hcHAvdXRpbC1oZWxwZXInKTtcblxuICAgIHJlcXVpcmUoJy4vYXBwL3NpdGUtaGVhZGVyJyk7XG4gICAgcmVxdWlyZSgnLi9hcHAvaG9tZXBhZ2UnKTtcblxuICAgIHJlcXVpcmUoJy4vYXBwL21vZGFsLW92ZXJsYXknKS5pbml0KCk7XG4gICAgcmVxdWlyZSgnLi9hcHAvYnJldy12aWV3JykuaW5pdCgpO1xuICAgXG59KSh3aW5kb3cpO1xuIl19
