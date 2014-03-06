(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['lodash', 'jquery'], factory);
    }
    else {
        root['SVGIcon'] = factory(root._, root.$);
    }
}(this, function(_, $) {

    /**
     * SVG-icon - v0.0.1
     * Copyright (c) 2014 Matt Styles
     * License MIT
     */
    
    
    function shim( dep ) {
    
        function jq() {
            var $ = function( selector ) {
    
            };
    
            $.ajax = function( args ) {
    
            };
    
            return $;
        }
    
        function lodash() {
            return {
                find: function( args ) {
    
                }
            };
        }
    
        var delegate = {
            jquery: jq,
            lodash: lodash,
            'default': function() {
                console.log( 'Specified dependency for svg-icon not handled' );
            }
        };
    
        if ( dep ) {
            return delegate[ dep ]();
        }
    }
    
    
    // @todo add shims for dependencies
    var _ = _ || shim( 'lodash' ),
        $ = $ || shim( 'jquery' );
    
    
    var path = './',
        req = null,
        cache = [];
    
    // Export public API
    var exports = function( opts ) {
        exports.selfRegister = typeof opts.selfRegister === 'undefined' ? true : opts.selfRegister;
    };
    
    exports.VERSION = '0.0.2';
    exports.selfRegister = true;
    
    exports.injectSVG = function( el, svg ) {
        el.outerHTML = svg;
    };
    
    exports.inject = function() {
        var els = document.querySelectorAll( '.icon' );
    
        _.each( els, function( el ) {
            // Bail
            if ( !el.dataset.src ) {
                console.error( 'No URL specified for icon' );
                return;
            }
    
            // Check the cache
            var cached = _.find( cache, function( item ) {
                return item.id === el.dataset.src;
            });
    
            if ( cached ) {
                console.log( 'loading icon from cache' );
                exports.injectSVG( el, cached.content );
                return;
            }
    
            // Load the icon
            exports.ajax( el );
        } );
    };
    
    exports.ajax = function( el ) {
        var res = '';
    
        console.log( 'loading new icon' );
    
        req = new XMLHttpRequest();
        req.open( 'GET', path + el.dataset.src, false );    // Do a dirty synchronous get
        req.onload = function() {
            if ( req.status === 200 ) {
                iconClass = el.dataset.class || '';
                res = req.response.replace( /\r?\n|\r/g, '' )
                                  .replace( /<svg/, '<svg class="' + iconClass + '" ')
                                  .match( /<svg(.*?)svg>/g );
    
                cache.push( {
                    id: el.dataset.src,
                    content: res
                });
    
                exports.injectSVG( el, res );
            }
        };
        req.onerror = function( err ) {
            console.error( 'Error loading icon ' );
            console.error( err );
        };
        req.send();
    };
    
    
    
    // Self running module
    document.addEventListener( 'DOMContentLoaded', function( event ) {
        if ( !exports.selfRegister ) {
            return;
        }
    
        console.log( 'SVGIcon self registered' );
        exports.inject();
    });
    

    return exports;

}));
