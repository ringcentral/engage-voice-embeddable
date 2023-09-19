/*! @ringcentral/engage-voice-agent - v5.18.1-rc.0 - 2023-08-23 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SoftphoneService = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return _assign.apply(this, arguments);
  };
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
        f,
        y,
        t,
        g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
      return this;
    }), g;

    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }

    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");

      while (g && (g = 0, op[0] && (_ = 0)), _) {
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];

          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;

            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };

            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;

            case 7:
              op = _.ops.pop();

              _.trys.pop();

              continue;

            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }

              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }

              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }

              if (t && _.label < t[2]) {
                _.label = t[2];

                _.ops.push(op);

                break;
              }

              if (t[2]) _.ops.pop();

              _.trys.pop();

              continue;
          }

          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }

      if (op[0] & 5) throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  }
  /** @deprecated */

  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
      s += arguments[i].length;
    }

    for (var r = Array(s), k = 0, i = 0; i < il; i++) {
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
        r[k] = a[j];
      }
    }

    return r;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var sip=createCommonjsModule(function(module,exports){(function webpackUniversalModuleDefinition(root,factory){module.exports=factory();})(commonjsGlobal,function(){return(/******/function(modules){// webpackBootstrap
  /******/ // The module cache
  /******/var installedModules={};/******/ /******/ // The require function
  /******/function __webpack_require__(moduleId){/******/ /******/ // Check if module is in cache
  /******/if(installedModules[moduleId]){/******/return installedModules[moduleId].exports;/******/}/******/ // Create a new module (and put it into the cache)
  /******/var module=installedModules[moduleId]={/******/i:moduleId,/******/l:false,/******/exports:{}/******/};/******/ /******/ // Execute the module function
  /******/modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);/******/ /******/ // Flag the module as loaded
  /******/module.l=true;/******/ /******/ // Return the exports of the module
  /******/return module.exports;/******/}/******/ /******/ /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m=modules;/******/ /******/ // expose the module cache
  /******/__webpack_require__.c=installedModules;/******/ /******/ // define getter function for harmony exports
  /******/__webpack_require__.d=function(exports,name,getter){/******/if(!__webpack_require__.o(exports,name)){/******/Object.defineProperty(exports,name,{enumerable:true,get:getter});/******/}/******/};/******/ /******/ // define __esModule on exports
  /******/__webpack_require__.r=function(exports){/******/if(typeof Symbol!=='undefined'&&Symbol.toStringTag){/******/Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});/******/}/******/Object.defineProperty(exports,'__esModule',{value:true});/******/};/******/ /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/__webpack_require__.t=function(value,mode){/******/if(mode&1)value=__webpack_require__(value);/******/if(mode&8)return value;/******/if(mode&4&&_typeof(value)==='object'&&value&&value.__esModule)return value;/******/var ns=Object.create(null);/******/__webpack_require__.r(ns);/******/Object.defineProperty(ns,'default',{enumerable:true,value:value});/******/if(mode&2&&typeof value!='string')for(var key in value){__webpack_require__.d(ns,key,function(key){return value[key];}.bind(null,key));}/******/return ns;/******/};/******/ /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n=function(module){/******/var getter=module&&module.__esModule?/******/function getDefault(){return module['default'];}:/******/function getModuleExports(){return module;};/******/__webpack_require__.d(getter,'a',getter);/******/return getter;/******/};/******/ /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property);};/******/ /******/ // __webpack_public_path__
  /******/__webpack_require__.p="";/******/ /******/ /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s=0);/******/}/************************************************************************/ /******/([/* 0 */ /***/function(module,exports,__webpack_require__){module.exports=__webpack_require__(1)(__webpack_require__(40));/***/},/* 1 */ /***/function(module,exports,__webpack_require__){/**
   * @name SIP
   * @namespace
   */module.exports=function(environment){var pkg=__webpack_require__(2),version=pkg.version,title=pkg.title;var SIP=Object.defineProperties({},{version:{get:function get(){return version;}},name:{get:function get(){return title;}}});__webpack_require__(3)(SIP,environment);SIP.LoggerFactory=__webpack_require__(4)(environment.console);SIP.EventEmitter=__webpack_require__(5)();SIP.C=__webpack_require__(7)(SIP.name,SIP.version);SIP.Exceptions=__webpack_require__(8);SIP.Timers=__webpack_require__(9)(environment.timers);SIP.Transport=__webpack_require__(10)(SIP);__webpack_require__(11)(SIP);__webpack_require__(12)(SIP);__webpack_require__(13)(SIP);__webpack_require__(14)(SIP);__webpack_require__(15)(SIP);__webpack_require__(16)(SIP);__webpack_require__(18)(SIP);__webpack_require__(19)(SIP);SIP.SessionDescriptionHandler=__webpack_require__(20)(SIP.EventEmitter);__webpack_require__(21)(SIP);__webpack_require__(22)(SIP);__webpack_require__(23)(SIP);__webpack_require__(25)(SIP);__webpack_require__(26)(SIP);__webpack_require__(27)(SIP,environment);__webpack_require__(32)(SIP);SIP.DigestAuthentication=__webpack_require__(33)(SIP.Utils);SIP.Grammar=__webpack_require__(36)(SIP);SIP.Web={Modifiers:__webpack_require__(38)(SIP),Simple:__webpack_require__(39)(SIP)};return SIP;};/***/},/* 2 */ /***/function(module){module.exports={"name":"sip.js","title":"SIP.js","description":"A simple, intuitive, and powerful JavaScript signaling library","version":"0.11.6","main":"dist/sip.js","browser":{"./src/environment.js":"./src/environment_browser.js"},"homepage":"https://sipjs.com","author":"OnSIP <developer@onsip.com> (https://sipjs.com/aboutus/)","contributors":[{"url":"https://github.com/onsip/SIP.js/blob/master/THANKS.md"}],"repository":{"type":"git","url":"https://github.com/onsip/SIP.js.git"},"keywords":["sip","websocket","webrtc","library","javascript"],"devDependencies":{"awesome-typescript-loader":"^5.2.1","eslint":"^5.4.0","jasmine-core":"^3.2.1","karma":"^3.0.0","karma-chrome-launcher":"^2.2.0","karma-cli":"^1.0.1","karma-jasmine":"^1.1.0","karma-jasmine-html-reporter":"^1.3.1","karma-mocha-reporter":"^2.2.5","karma-webpack":"^3.0.0","pegjs":"^0.10.0","pegjs-loader":"^0.5.4","typescript":"^3.0.3","webpack":"^4.19.0","webpack-cli":"^3.0.8"},"engines":{"node":">=6.0"},"license":"MIT","scripts":{"prebuild":"eslint src/*.js src/**/*.js","build-dev":"webpack --progress --env.buildType dev","build-prod":"webpack --progress --env.buildType prod","copy-dist-files":"cp dist/sip.js dist/sip-$npm_package_version.js && cp dist/sip.min.js  dist/sip-$npm_package_version.min.js","build":"npm run build-dev && npm run build-prod && npm run copy-dist-files","browserTest":"sleep 2 && open http://0.0.0.0:9876/debug.html & karma start --reporters kjhtml --no-single-run","commandLineTest":"karma start --reporters mocha --browsers ChromeHeadless --single-run","buildAndTest":"npm run build && npm run commandLineTest","buildAndBrowserTest":"npm run build && npm run browserTest"},"dependencies":{"crypto-js":"^3.1.9-1"},"optionalDependencies":{"promiscuous":"^0.6.0"}};/***/},/* 3 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview Utils
   */module.exports=function(SIP,environment){var Utils;Utils={Promise:environment.Promise,defer:function defer(){var deferred={};deferred.promise=new Utils.Promise(function(resolve,reject){deferred.resolve=resolve;deferred.reject=reject;});return deferred;},reducePromises:function reducePromises(arr,val){return arr.reduce(function(acc,fn){acc=acc.then(fn);return acc;},SIP.Utils.Promise.resolve(val));},augment:function augment(object,constructor,args,override){var idx,proto;// Add public properties from constructor's prototype onto object
  proto=constructor.prototype;for(idx in proto){if(override||object[idx]===undefined){object[idx]=proto[idx];}}// Construct the object as though it were just created by constructor
  constructor.apply(object,args);},defaultOptions:function defaultOptions(_defaultOptions,overridingOptions){_defaultOptions=_defaultOptions||{};overridingOptions=overridingOptions||{};return Object.assign({},_defaultOptions,overridingOptions);},optionsOverride:function optionsOverride(options,winner,loser,isDeprecated,logger,defaultValue){if(isDeprecated&&options[loser]){logger.warn(loser+' is deprecated, please use '+winner+' instead');}if(options[winner]&&options[loser]){logger.warn(winner+' overriding '+loser);}options[winner]=options[winner]||options[loser]||defaultValue;},str_utf8_length:function str_utf8_length(string){return encodeURIComponent(string).replace(/%[A-F\d]{2}/g,'U').length;},generateFakeSDP:function generateFakeSDP(body){if(!body){return;}var start=body.indexOf('o=');var end=body.indexOf('\r\n',start);return 'v=0\r\n'+body.slice(start,end)+'\r\ns=-\r\nt=0 0\r\nc=IN IP4 0.0.0.0';},isFunction:function isFunction(fn){if(fn!==undefined){return Object.prototype.toString.call(fn)==='[object Function]';}else {return false;}},isDecimal:function isDecimal(num){return !isNaN(num)&&parseFloat(num)===parseInt(num,10);},createRandomToken:function createRandomToken(size,base){var i,r,token='';base=base||32;for(i=0;i<size;i++){r=Math.random()*base|0;token+=r.toString(base);}return token;},newTag:function newTag(){return SIP.Utils.createRandomToken(SIP.UA.C.TAG_LENGTH);},// http://stackoverflow.com/users/109538/broofa
  newUUID:function newUUID(){var UUID='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:r&0x3|0x8;return v.toString(16);});return UUID;},hostType:function hostType(host){if(!host){return;}else {host=SIP.Grammar.parse(host,'host');if(host!==-1){return host.host_type;}}},/**
          * Normalize SIP URI.
          * NOTE: It does not allow a SIP URI without username.
          * Accepts 'sip', 'sips' and 'tel' URIs and convert them into 'sip'.
          * Detects the domain part (if given) and properly hex-escapes the user portion.
          * If the user portion has only 'tel' number symbols the user portion is clean of 'tel' visual separators.
          * @private
          * @param {String} target
          * @param {String} [domain]
          */normalizeTarget:function normalizeTarget(target,domain){var uri,target_array,target_user,target_domain;// If no target is given then raise an error.
  if(!target){return;// If a SIP.URI instance is given then return it.
  }else if(target instanceof SIP.URI){return target;// If a string is given split it by '@':
  // - Last fragment is the desired domain.
  // - Otherwise append the given domain argument.
  }else if(typeof target==='string'){target_array=target.split('@');switch(target_array.length){case 1:if(!domain){return;}target_user=target;target_domain=domain;break;case 2:target_user=target_array[0];target_domain=target_array[1];break;default:target_user=target_array.slice(0,target_array.length-1).join('@');target_domain=target_array[target_array.length-1];}// Remove the URI scheme (if present).
  target_user=target_user.replace(/^(sips?|tel):/i,'');// Remove 'tel' visual separators if the user portion just contains 'tel' number symbols.
  if(/^[\-\.\(\)]*\+?[0-9\-\.\(\)]+$/.test(target_user)){target_user=target_user.replace(/[\-\.\(\)]/g,'');}// Build the complete SIP URI.
  target=SIP.C.SIP+':'+SIP.Utils.escapeUser(target_user)+'@'+target_domain;// Finally parse the resulting URI.
  uri=SIP.URI.parse(target);return uri;}else {return;}},/**
          * Hex-escape a SIP URI user.
          * @private
          * @param {String} user
          */escapeUser:function escapeUser(user){// Don't hex-escape ':' (%3A), '+' (%2B), '?' (%3F"), '/' (%2F).
  return encodeURIComponent(decodeURIComponent(user)).replace(/%3A/ig,':').replace(/%2B/ig,'+').replace(/%3F/ig,'?').replace(/%2F/ig,'/');},headerize:function headerize(string){var exceptions={'Call-Id':'Call-ID','Cseq':'CSeq','Min-Se':'Min-SE','Rack':'RAck','Rseq':'RSeq','Www-Authenticate':'WWW-Authenticate'},name=string.toLowerCase().replace(/_/g,'-').split('-'),hname='',parts=name.length,part;for(part=0;part<parts;part++){if(part!==0){hname+='-';}hname+=name[part].charAt(0).toUpperCase()+name[part].substring(1);}if(exceptions[hname]){hname=exceptions[hname];}return hname;},sipErrorCause:function sipErrorCause(status_code){var cause;for(cause in SIP.C.SIP_ERROR_CAUSES){if(SIP.C.SIP_ERROR_CAUSES[cause].indexOf(status_code)!==-1){return SIP.C.causes[cause];}}return SIP.C.causes.SIP_FAILURE_CODE;},getReasonPhrase:function getReasonPhrase(code,specific){return specific||SIP.C.REASON_PHRASE[code]||'';},getReasonHeaderValue:function getReasonHeaderValue(code,reason){reason=SIP.Utils.getReasonPhrase(code,reason);return 'SIP;cause='+code+';text="'+reason+'"';},getCancelReason:function getCancelReason(code,reason){if(code&&code<200||code>699){throw new TypeError('Invalid status_code: '+code);}else if(code){return SIP.Utils.getReasonHeaderValue(code,reason);}},buildStatusLine:function buildStatusLine(code,reason){code=code||null;reason=reason||null;// Validate code and reason values
  if(!code||code<100||code>699){throw new TypeError('Invalid status_code: '+code);}else if(reason&&typeof reason!=='string'&&!(reason instanceof String)){throw new TypeError('Invalid reason_phrase: '+reason);}reason=Utils.getReasonPhrase(code,reason);return 'SIP/2.0 '+code+' '+reason+'\r\n';},/**
          * Generate a random Test-Net IP (http://tools.ietf.org/html/rfc5735)
          * @private
          */getRandomTestNetIP:function getRandomTestNetIP(){function getOctet(from,to){return Math.floor(Math.random()*(to-from+1)+from);}return '192.0.2.'+getOctet(1,254);}};SIP.Utils=Utils;};/***/},/* 4 */ /***/function(module,exports,__webpack_require__){var levels={'error':0,'warn':1,'log':2,'debug':3};module.exports=function(console){var LoggerFactory=function LoggerFactory(){var logger,level=2,builtinEnabled=true,connector=null;this.loggers={};logger=this.getLogger('sip.loggerfactory');Object.defineProperties(this,{builtinEnabled:{get:function get(){return builtinEnabled;},set:function set(value){if(typeof value==='boolean'){builtinEnabled=value;}else {logger.error('invalid "builtinEnabled" parameter value: '+JSON.stringify(value));}}},level:{get:function get(){return level;},set:function set(value){if(value>=0&&value<=3){level=value;}else if(value>3){level=3;}else if(levels.hasOwnProperty(value)){level=levels[value];}else {logger.error('invalid "level" parameter value: '+JSON.stringify(value));}}},connector:{get:function get(){return connector;},set:function set(value){if(value===null||value===""||value===undefined){connector=null;}else if(typeof value==='function'){connector=value;}else {logger.error('invalid "connector" parameter value: '+JSON.stringify(value));}}}});};LoggerFactory.prototype.print=function(target,category,label,content){if(typeof content==='string'){var prefix=[new Date(),category];if(label){prefix.push(label);}content=prefix.concat(content).join(' | ');}target.call(console,content);};function Logger(logger,category,label){this.logger=logger;this.category=category;this.label=label;}Object.keys(levels).forEach(function(targetName){Logger.prototype[targetName]=function(content){this.logger[targetName](this.category,this.label,content);};LoggerFactory.prototype[targetName]=function(category,label,content){if(this.level>=levels[targetName]){if(this.builtinEnabled){this.print(console[targetName],category,label,content);}if(this.connector){this.connector(targetName,category,label,content);}}};});LoggerFactory.prototype.getLogger=function(category,label){var logger;if(label&&this.level===3){return new Logger(this,category,label);}else if(this.loggers[category]){return this.loggers[category];}else {logger=new Logger(this,category);this.loggers[category]=logger;return logger;}};return LoggerFactory;};/***/},/* 5 */ /***/function(module,exports,__webpack_require__){var NodeEventEmitter=__webpack_require__(6).EventEmitter;module.exports=function(){// Don't use `new SIP.EventEmitter()` for inheriting.
  // Use Object.create(SIP.EventEmitter.prototoype);
  function EventEmitter(){NodeEventEmitter.call(this);}EventEmitter.prototype=Object.create(NodeEventEmitter.prototype,{constructor:{value:EventEmitter,enumerable:false,writable:true,configurable:true}});return EventEmitter;};/***/},/* 6 */ /***/function(module,exports){// Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  function EventEmitter(){this._events=this._events||{};this._maxListeners=this._maxListeners||undefined;}module.exports=EventEmitter;// Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter=EventEmitter;EventEmitter.prototype._events=undefined;EventEmitter.prototype._maxListeners=undefined;// By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners=10;// Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners=function(n){if(!isNumber(n)||n<0||isNaN(n))throw TypeError('n must be a positive number');this._maxListeners=n;return this;};EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(!this._events)this._events={};// If there is no 'error' event listener then throw.
  if(type==='error'){if(!this._events.error||isObject(this._events.error)&&!this._events.error.length){er=arguments[1];if(er instanceof Error){throw er;// Unhandled 'error' event
  }else {// At least give some kind of context to the user
  var err=new Error('Uncaught, unspecified "error" event. ('+er+')');err.context=er;throw err;}}}handler=this._events[type];if(isUndefined(handler))return false;if(isFunction(handler)){switch(arguments.length){// fast cases
  case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;// slower
  default:args=Array.prototype.slice.call(arguments,1);handler.apply(this,args);}}else if(isObject(handler)){args=Array.prototype.slice.call(arguments,1);listeners=handler.slice();len=listeners.length;for(i=0;i<len;i++){listeners[i].apply(this,args);}}return true;};EventEmitter.prototype.addListener=function(type,listener){var m;if(!isFunction(listener))throw TypeError('listener must be a function');if(!this._events)this._events={};// To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if(this._events.newListener)this.emit('newListener',type,isFunction(listener.listener)?listener.listener:listener);if(!this._events[type])// Optimize the case of one listener. Don't need the extra array object.
  this._events[type]=listener;else if(isObject(this._events[type]))// If we've already got an array, just append.
  this._events[type].push(listener);else// Adding the second element, need to change to array.
  this._events[type]=[this._events[type],listener];// Check for listener leak
  if(isObject(this._events[type])&&!this._events[type].warned){if(!isUndefined(this._maxListeners)){m=this._maxListeners;}else {m=EventEmitter.defaultMaxListeners;}if(m&&m>0&&this._events[type].length>m){this._events[type].warned=true;console.error('(node) warning: possible EventEmitter memory '+'leak detected. %d listeners added. '+'Use emitter.setMaxListeners() to increase limit.',this._events[type].length);if(typeof console.trace==='function'){// not supported in IE 10
  console.trace();}}}return this;};EventEmitter.prototype.on=EventEmitter.prototype.addListener;EventEmitter.prototype.once=function(type,listener){if(!isFunction(listener))throw TypeError('listener must be a function');var fired=false;function g(){this.removeListener(type,g);if(!fired){fired=true;listener.apply(this,arguments);}}g.listener=listener;this.on(type,g);return this;};// emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!isFunction(listener))throw TypeError('listener must be a function');if(!this._events||!this._events[type])return this;list=this._events[type];length=list.length;position=-1;if(list===listener||isFunction(list.listener)&&list.listener===listener){delete this._events[type];if(this._events.removeListener)this.emit('removeListener',type,listener);}else if(isObject(list)){for(i=length;i-->0;){if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break;}}if(position<0)return this;if(list.length===1){list.length=0;delete this._events[type];}else {list.splice(position,1);}if(this._events.removeListener)this.emit('removeListener',type,listener);}return this;};EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;// not listening for removeListener, no need to emit
  if(!this._events.removeListener){if(arguments.length===0)this._events={};else if(this._events[type])delete this._events[type];return this;}// emit removeListener for all listeners on all events
  if(arguments.length===0){for(key in this._events){if(key==='removeListener')continue;this.removeAllListeners(key);}this.removeAllListeners('removeListener');this._events={};return this;}listeners=this._events[type];if(isFunction(listeners)){this.removeListener(type,listeners);}else if(listeners){// LIFO order
  while(listeners.length){this.removeListener(type,listeners[listeners.length-1]);}}delete this._events[type];return this;};EventEmitter.prototype.listeners=function(type){var ret;if(!this._events||!this._events[type])ret=[];else if(isFunction(this._events[type]))ret=[this._events[type]];else ret=this._events[type].slice();return ret;};EventEmitter.prototype.listenerCount=function(type){if(this._events){var evlistener=this._events[type];if(isFunction(evlistener))return 1;else if(evlistener)return evlistener.length;}return 0;};EventEmitter.listenerCount=function(emitter,type){return emitter.listenerCount(type);};function isFunction(arg){return typeof arg==='function';}function isNumber(arg){return typeof arg==='number';}function isObject(arg){return _typeof(arg)==='object'&&arg!==null;}function isUndefined(arg){return arg===void 0;}/***/},/* 7 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Constants
   */ /**
   * SIP Constants.
   * @augments SIP
   */module.exports=function(name,version){return {USER_AGENT:name+'/'+version,// SIP scheme
  SIP:'sip',SIPS:'sips',// End and Failure causes
  causes:{// Generic error causes
  CONNECTION_ERROR:'Connection Error',REQUEST_TIMEOUT:'Request Timeout',SIP_FAILURE_CODE:'SIP Failure Code',INTERNAL_ERROR:'Internal Error',// SIP error causes
  BUSY:'Busy',REJECTED:'Rejected',REDIRECTED:'Redirected',UNAVAILABLE:'Unavailable',NOT_FOUND:'Not Found',ADDRESS_INCOMPLETE:'Address Incomplete',INCOMPATIBLE_SDP:'Incompatible SDP',AUTHENTICATION_ERROR:'Authentication Error',DIALOG_ERROR:'Dialog Error',// Session error causes
  WEBRTC_NOT_SUPPORTED:'WebRTC Not Supported',WEBRTC_ERROR:'WebRTC Error',CANCELED:'Canceled',NO_ANSWER:'No Answer',EXPIRES:'Expires',NO_ACK:'No ACK',NO_PRACK:'No PRACK',USER_DENIED_MEDIA_ACCESS:'User Denied Media Access',BAD_MEDIA_DESCRIPTION:'Bad Media Description',RTP_TIMEOUT:'RTP Timeout'},supported:{UNSUPPORTED:'none',SUPPORTED:'supported',REQUIRED:'required'},SIP_ERROR_CAUSES:{REDIRECTED:[300,301,302,305,380],BUSY:[486,600],REJECTED:[403,603],NOT_FOUND:[404,604],UNAVAILABLE:[480,410,408,430],ADDRESS_INCOMPLETE:[484],INCOMPATIBLE_SDP:[488,606],AUTHENTICATION_ERROR:[401,407]},// SIP Methods
  ACK:'ACK',BYE:'BYE',CANCEL:'CANCEL',INFO:'INFO',INVITE:'INVITE',MESSAGE:'MESSAGE',NOTIFY:'NOTIFY',OPTIONS:'OPTIONS',REGISTER:'REGISTER',UPDATE:'UPDATE',SUBSCRIBE:'SUBSCRIBE',PUBLISH:'PUBLISH',REFER:'REFER',PRACK:'PRACK',/* SIP Response Reasons
           * DOC: http://www.iana.org/assignments/sip-parameters
           * Copied from https://github.com/versatica/OverSIP/blob/master/lib/oversip/sip/constants.rb#L7
           */REASON_PHRASE:{100:'Trying',180:'Ringing',181:'Call Is Being Forwarded',182:'Queued',183:'Session Progress',199:'Early Dialog Terminated',200:'OK',202:'Accepted',204:'No Notification',300:'Multiple Choices',301:'Moved Permanently',302:'Moved Temporarily',305:'Use Proxy',380:'Alternative Service',400:'Bad Request',401:'Unauthorized',402:'Payment Required',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',406:'Not Acceptable',407:'Proxy Authentication Required',408:'Request Timeout',410:'Gone',412:'Conditional Request Failed',413:'Request Entity Too Large',414:'Request-URI Too Long',415:'Unsupported Media Type',416:'Unsupported URI Scheme',417:'Unknown Resource-Priority',420:'Bad Extension',421:'Extension Required',422:'Session Interval Too Small',423:'Interval Too Brief',428:'Use Identity Header',429:'Provide Referrer Identity',430:'Flow Failed',433:'Anonymity Disallowed',436:'Bad Identity-Info',437:'Unsupported Certificate',438:'Invalid Identity Header',439:'First Hop Lacks Outbound Support',440:'Max-Breadth Exceeded',469:'Bad Info Package',470:'Consent Needed',478:'Unresolvable Destination',480:'Temporarily Unavailable',481:'Call/Transaction Does Not Exist',482:'Loop Detected',483:'Too Many Hops',484:'Address Incomplete',485:'Ambiguous',486:'Busy Here',487:'Request Terminated',488:'Not Acceptable Here',489:'Bad Event',491:'Request Pending',493:'Undecipherable',494:'Security Agreement Required',500:'Internal Server Error',501:'Not Implemented',502:'Bad Gateway',503:'Service Unavailable',504:'Server Time-out',505:'Version Not Supported',513:'Message Too Large',580:'Precondition Failure',600:'Busy Everywhere',603:'Decline',604:'Does Not Exist Anywhere',606:'Not Acceptable'},/* SIP Option Tags
           * DOC: http://www.iana.org/assignments/sip-parameters/sip-parameters.xhtml#sip-parameters-4
           */OPTION_TAGS:{'100rel':true,199:true,answermode:true,'early-session':true,eventlist:true,explicitsub:true,'from-change':true,'geolocation-http':true,'geolocation-sip':true,gin:true,gruu:true,histinfo:true,ice:true,join:true,'multiple-refer':true,norefersub:true,nosub:true,outbound:true,path:true,policy:true,precondition:true,pref:true,privacy:true,'recipient-list-invite':true,'recipient-list-message':true,'recipient-list-subscribe':true,replaces:true,'resource-priority':true,'sdp-anat':true,'sec-agree':true,tdialog:true,timer:true,uui:true// RFC 7433
  },dtmfType:{INFO:'info',RTP:'rtp'}};};/***/},/* 8 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview Exceptions
   */ /**
   * SIP Exceptions.
   * @augments SIP
   */module.exports={ConfigurationError:function(){var exception=function exception(parameter,value){this.code=1;this.name='CONFIGURATION_ERROR';this.parameter=parameter;this.value=value;this.message=!this.value?'Missing parameter: '+this.parameter:'Invalid value '+JSON.stringify(this.value)+' for parameter "'+this.parameter+'"';};exception.prototype=new Error();return exception;}(),InvalidStateError:function(){var exception=function exception(status){this.code=2;this.name='INVALID_STATE_ERROR';this.status=status;this.message='Invalid status: '+status;};exception.prototype=new Error();return exception;}(),NotSupportedError:function(){var exception=function exception(message){this.code=3;this.name='NOT_SUPPORTED_ERROR';this.message=message;};exception.prototype=new Error();return exception;}(),// Deprecated
  GetDescriptionError:function(){var exception=function exception(message){this.code=4;this.name='GET_DESCRIPTION_ERROR';this.message=message;};exception.prototype=new Error();return exception;}(),RenegotiationError:function(){var exception=function exception(message){this.code=5;this.name='RENEGOTIATION_ERROR';this.message=message;};exception.prototype=new Error();return exception;}(),MethodParameterError:function(){var exception=function exception(method,parameter,value){this.code=6;this.name='METHOD_PARAMETER_ERROR';this.method=method;this.parameter=parameter;this.value=value;this.message=!this.value?'Missing parameter: '+this.parameter:'Invalid value '+JSON.stringify(this.value)+' for parameter "'+this.parameter+'"';};exception.prototype=new Error();return exception;}(),TransportError:function(){var exception=function exception(message){this.code=7;this.name='TRANSPORT_ERROR';this.message=message;};exception.prototype=new Error();return exception;}(),SessionDescriptionHandlerError:function(){var exception=function exception(method,error,message){this.code=8;this.name='SESSION_DESCRIPTION_HANDLER_ERROR';this.method=method;this.error=error;this.message=message||'Error with Session Description Handler';};exception.prototype=new Error();return exception;}()};/***/},/* 9 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP TIMERS
   */ /**
   * @augments SIP
   */var T1=500,T2=4000,T4=5000;module.exports=function(timers){var Timers={T1:T1,T2:T2,T4:T4,TIMER_B:64*T1,TIMER_D:0*T1,TIMER_F:64*T1,TIMER_H:64*T1,TIMER_I:0*T1,TIMER_J:0*T1,TIMER_K:0*T4,TIMER_L:64*T1,TIMER_M:64*T1,TIMER_N:64*T1,PROVISIONAL_RESPONSE_INTERVAL:60000// See RFC 3261 Section 13.3.1.1
  };['setTimeout','clearTimeout','setInterval','clearInterval'].forEach(function(name){// can't just use timers[name].bind(timers) since it bypasses jasmine's
  // clock-mocking
  Timers[name]=function(){return timers[name].apply(timers,arguments);};});return Timers;};/***/},/* 10 */ /***/function(module,exports,__webpack_require__){/* eslint-disable */ /**
   * @fileoverview Transport
   */ /* Transport
   * @class Abstract transport layer parent class
   * @param {Logger} logger
   * @param {Object} [options]
   */module.exports=function(SIP){var Transport=function Transport(logger,options){};Transport.prototype=Object.create(SIP.EventEmitter.prototype,{/**
          * Returns the promise designated by the child layer then emits a connected event. Automatically emits an event upon resolution, unless overrideEvent is set. If you override the event in this fashion, you should emit it in your implementation of connectPromise
          * @param {Object} [options]
          * @returns {Promise}
          */connect:{writable:true,value:function connect(options){options=options||{};return this.connectPromise(options).then(function(data){!data.overrideEvent&&this.emit('connected');}.bind(this));}},/**
          * Called by connect, must return a promise
          * promise must resolve to an object. object supports 1 parameter: overrideEvent - Boolean
          * @abstract
          * @private
          * @param {Object} [options]
          * @returns {Promise}
          */connectPromise:{writable:true,value:function connectPromise(options){}},/**
          * Returns true if the transport is connected
          * @abstract
          * @returns {Boolean}
          */isConnected:{writable:true,value:function isConnected(){}},/**
          * Sends a message then emits a 'messageSent' event. Automatically emits an event upon resolution, unless data.overrideEvent is set. If you override the event in this fashion, you should emit it in your implementation of sendPromise
          * @param {SIP.OutgoingRequest|String} msg
          * @param {Object} options
          * @returns {Promise}
          */send:{writable:true,value:function send(msg,options){return this.sendPromise(msg).then(function(data){!data.overrideEvent&&this.emit('messageSent',data.msg);}.bind(this));}},/**
          * Called by send, must return a promise
          * promise must resolve to an object. object supports 2 parameters: msg - string (mandatory) and overrideEvent - Boolean (optional)
          * @abstract
          * @private
          * @param {SIP.OutgoingRequest|String} msg
          * @param {Object} [options]
          * @returns {Promise}
          */sendPromise:{writable:true,value:function sendPromise(msg,options){}},/**
          * To be called when a message is received
          * @abstract
          * @param {Event} e
          */onMessage:{writable:true,value:function onMessage(e){}},/**
          * Returns the promise designated by the child layer then emits a disconnected event. Automatically emits an event upon resolution, unless overrideEvent is set. If you override the event in this fashion, you should emit it in your implementation of disconnectPromise
          * @param {Object} [options]
          * @returns {Promise}
          */disconnect:{writable:true,value:function disconnect(options){options=options||{};return this.disconnectPromise(options).then(function(data){!data.overrideEvent&&this.emit('disconnected');}.bind(this));}},/**
          * Called by disconnect, must return a promise
          * promise must resolve to an object. object supports 1 parameter: overrideEvent - Boolean
          * @abstract
          * @private
          * @param {Object} [options]
          * @returns {Promise}
          */disconnectPromise:{writable:true,value:function disconnectPromise(options){}},afterConnected:{writable:true,value:function afterConnected(callback){if(this.isConnected()){callback();}else {this.once('connected',callback);}}},/**
           * Returns a promise which resolves once the UA is connected. DEPRECATION WARNING: just use afterConnected()
           * @returns {Promise}
           */waitForConnected:{writable:true,value:function waitForConnected(){console.warn("DEPRECATION WARNING Transport.waitForConnected(): use afterConnected() instead");return new SIP.Utils.Promise(function(resolve){this.afterConnected(resolve);}.bind(this));}}});return Transport;};/***/},/* 11 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Message Parser
   */ /**
   * Extract and parse every header of a SIP message.
   * @augments SIP
   * @namespace
   */module.exports=function(SIP){var Parser;function getHeader(data,headerStart){var// 'start' position of the header.
  start=headerStart,// 'end' position of the header.
  end=0,// 'partial end' position of the header.
  partialEnd=0;//End of message.
  if(data.substring(start,start+2).match(/(^\r\n)/)){return -2;}while(end===0){// Partial End of Header.
  partialEnd=data.indexOf('\r\n',start);// 'indexOf' returns -1 if the value to be found never occurs.
  if(partialEnd===-1){return partialEnd;}if(!data.substring(partialEnd+2,partialEnd+4).match(/(^\r\n)/)&&data.charAt(partialEnd+2).match(/(^\s+)/)){// Not the end of the message. Continue from the next position.
  start=partialEnd+2;}else {end=partialEnd;}}return end;}function parseHeader(message,data,headerStart,headerEnd){var header,idx,length,parsed,hcolonIndex=data.indexOf(':',headerStart),headerName=data.substring(headerStart,hcolonIndex).trim(),headerValue=data.substring(hcolonIndex+1,headerEnd).trim();// If header-field is well-known, parse it.
  switch(headerName.toLowerCase()){case'via':case'v':message.addHeader('via',headerValue);if(message.getHeaders('via').length===1){parsed=message.parseHeader('Via');if(parsed){message.via=parsed;message.via_branch=parsed.branch;}}else {parsed=0;}break;case'from':case'f':message.setHeader('from',headerValue);parsed=message.parseHeader('from');if(parsed){message.from=parsed;message.from_tag=parsed.getParam('tag');}break;case'to':case't':message.setHeader('to',headerValue);parsed=message.parseHeader('to');if(parsed){message.to=parsed;message.to_tag=parsed.getParam('tag');}break;case'record-route':parsed=SIP.Grammar.parse(headerValue,'Record_Route');if(parsed===-1){parsed=undefined;break;}length=parsed.length;for(idx=0;idx<length;idx++){header=parsed[idx];message.addHeader('record-route',headerValue.substring(header.position,header.offset));message.headers['Record-Route'][message.getHeaders('record-route').length-1].parsed=header.parsed;}break;case'call-id':case'i':message.setHeader('call-id',headerValue);parsed=message.parseHeader('call-id');if(parsed){message.call_id=headerValue;}break;case'contact':case'm':parsed=SIP.Grammar.parse(headerValue,'Contact');if(parsed===-1){parsed=undefined;break;}length=parsed.length;for(idx=0;idx<length;idx++){header=parsed[idx];message.addHeader('contact',headerValue.substring(header.position,header.offset));message.headers['Contact'][message.getHeaders('contact').length-1].parsed=header.parsed;}break;case'content-length':case'l':message.setHeader('content-length',headerValue);parsed=message.parseHeader('content-length');break;case'content-type':case'c':message.setHeader('content-type',headerValue);parsed=message.parseHeader('content-type');break;case'cseq':message.setHeader('cseq',headerValue);parsed=message.parseHeader('cseq');if(parsed){message.cseq=parsed.value;}if(message instanceof SIP.IncomingResponse){message.method=parsed.method;}break;case'max-forwards':message.setHeader('max-forwards',headerValue);parsed=message.parseHeader('max-forwards');break;case'www-authenticate':message.setHeader('www-authenticate',headerValue);parsed=message.parseHeader('www-authenticate');break;case'proxy-authenticate':message.setHeader('proxy-authenticate',headerValue);parsed=message.parseHeader('proxy-authenticate');break;case'refer-to':case'r':message.setHeader('refer-to',headerValue);parsed=message.parseHeader('refer-to');if(parsed){message.refer_to=parsed;}break;default:// Do not parse this header.
  message.setHeader(headerName,headerValue);parsed=0;}if(parsed===undefined){return {error:'error parsing header "'+headerName+'"'};}else {return true;}}/** Parse SIP Message
       * @function
       * @param {String} message SIP message.
       * @param {Object} logger object.
       * @returns {SIP.IncomingRequest|SIP.IncomingResponse|undefined}
       */Parser={};Parser.parseMessage=function(data,ua){var message,firstLine,contentLength,bodyStart,parsed,headerStart=0,headerEnd=data.indexOf('\r\n'),logger=ua.getLogger('sip.parser');if(headerEnd===-1){logger.warn('no CRLF found, not a SIP message, discarded');return;}// Parse first line. Check if it is a Request or a Reply.
  firstLine=data.substring(0,headerEnd);parsed=SIP.Grammar.parse(firstLine,'Request_Response');if(parsed===-1){logger.warn('error parsing first line of SIP message: "'+firstLine+'"');return;}else if(!parsed.status_code){message=new SIP.IncomingRequest(ua);message.method=parsed.method;message.ruri=parsed.uri;}else {message=new SIP.IncomingResponse(ua);message.status_code=parsed.status_code;message.reason_phrase=parsed.reason_phrase;}message.data=data;headerStart=headerEnd+2;/* Loop over every line in data. Detect the end of each header and parse
          * it or simply add to the headers collection.
          */while(true){headerEnd=getHeader(data,headerStart);// The SIP message has normally finished.
  if(headerEnd===-2){bodyStart=headerStart+2;break;}// data.indexOf returned -1 due to a malformed message.
  else if(headerEnd===-1){logger.error('malformed message');return;}parsed=parseHeader(message,data,headerStart,headerEnd);if(parsed!==true){logger.error(parsed.error);return;}headerStart=headerEnd+2;}/* RFC3261 18.3.
           * If there are additional bytes in the transport packet
           * beyond the end of the body, they MUST be discarded.
           */if(message.hasHeader('content-length')){contentLength=message.getHeader('content-length');message.body=data.substr(bodyStart,contentLength);}else {message.body=data.substring(bodyStart);}return message;};SIP.Parser=Parser;};/***/},/* 12 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Message
   */module.exports=function(SIP){var OutgoingRequest,IncomingMessage,IncomingRequest,IncomingResponse;function getSupportedHeader(request){var allowUnregistered=request.ua.configuration.hackAllowUnregisteredOptionTags;var optionTags=[];var optionTagSet={};if(request.method===SIP.C.REGISTER){optionTags.push('path','gruu');}else if(request.method===SIP.C.INVITE&&(request.ua.contact.pub_gruu||request.ua.contact.temp_gruu)){optionTags.push('gruu');}if(request.ua.configuration.rel100===SIP.C.supported.SUPPORTED){optionTags.push('100rel');}if(request.ua.configuration.replaces===SIP.C.supported.SUPPORTED){optionTags.push('replaces');}optionTags.push('outbound');optionTags=optionTags.concat(request.ua.configuration.extraSupported);optionTags=optionTags.filter(function(optionTag){var registered=SIP.C.OPTION_TAGS[optionTag];var unique=!optionTagSet[optionTag];optionTagSet[optionTag]=true;return (registered||allowUnregistered)&&unique;});return 'Supported: '+optionTags.join(', ')+'\r\n';}/**
       * @augments SIP
       * @class Class for outgoing SIP request.
       * @param {String} method request method
       * @param {String} ruri request uri
       * @param {SIP.UA} ua
       * @param {Object} params parameters that will have priority over ua.configuration parameters:
       * <br>
       *  - cseq, call_id, from_tag, from_uri, from_displayName, to_uri, to_tag, route_set
       * @param {Object} [headers] extra headers
       * @param {String} [body]
       */OutgoingRequest=function OutgoingRequest(method,ruri,ua,params,extraHeaders,body){var to,from,call_id,cseq,to_uri,from_uri;params=params||{};// Mandatory parameters check
  if(!method||!ruri||!ua){return null;}this.logger=ua.getLogger('sip.sipmessage');this.ua=ua;this.headers={};this.method=method;this.ruri=ruri;this.body=body;this.extraHeaders=(extraHeaders||[]).slice();this.statusCode=params.status_code;this.reasonPhrase=params.reason_phrase;// Fill the Common SIP Request Headers
  // Route
  if(params.route_set){this.setHeader('route',params.route_set);}else if(ua.configuration.usePreloadedRoute){this.setHeader('route',ua.transport.server.sip_uri);}// Via
  // Empty Via header. Will be filled by the client transaction.
  this.setHeader('via','');// Max-Forwards
  this.setHeader('max-forwards',SIP.UA.C.MAX_FORWARDS);// To
  to_uri=params.to_uri||ruri;to=params.to_displayName||params.to_displayName===0?'"'+params.to_displayName+'" ':'';to+='<'+(to_uri&&to_uri.toRaw?to_uri.toRaw():to_uri)+'>';to+=params.to_tag?';tag='+params.to_tag:'';this.to=new SIP.NameAddrHeader.parse(to);this.setHeader('to',to);// From
  from_uri=params.from_uri||ua.configuration.uri;if(params.from_displayName||params.from_displayName===0){from='"'+params.from_displayName+'" ';}else if(ua.configuration.displayName){from='"'+ua.configuration.displayName+'" ';}else {from='';}from+='<'+(from_uri&&from_uri.toRaw?from_uri.toRaw():from_uri)+'>;tag=';from+=params.from_tag||SIP.Utils.newTag();this.from=new SIP.NameAddrHeader.parse(from);this.setHeader('from',from);// Call-ID
  call_id=params.call_id||ua.configuration.sipjsId+SIP.Utils.createRandomToken(15);this.call_id=call_id;this.setHeader('call-id',call_id);// CSeq
  cseq=params.cseq||Math.floor(Math.random()*10000);this.cseq=cseq;this.setHeader('cseq',cseq+' '+method);};OutgoingRequest.prototype={/**
           * Replace the the given header by the given value.
           * @param {String} name header name
           * @param {String | Array} value header value
           */setHeader:function setHeader(name,value){this.headers[SIP.Utils.headerize(name)]=value instanceof Array?value:[value];},/**
           * Get the value of the given header name at the given position.
           * @param {String} name header name
           * @returns {String|undefined} Returns the specified header, undefined if header doesn't exist.
           */getHeader:function getHeader(name){var regexp,idx,length=this.extraHeaders.length,header=this.headers[SIP.Utils.headerize(name)];if(header){if(header[0]){return header[0];}}else {regexp=new RegExp('^\\s*'+name+'\\s*:','i');for(idx=0;idx<length;idx++){header=this.extraHeaders[idx];if(regexp.test(header)){return header.substring(header.indexOf(':')+1).trim();}}}return;},/**
           * Get the header/s of the given name.
           * @param {String} name header name
           * @returns {Array} Array with all the headers of the specified name.
           */getHeaders:function getHeaders(name){var idx,length,regexp,header=this.headers[SIP.Utils.headerize(name)],result=[];if(header){length=header.length;for(idx=0;idx<length;idx++){result.push(header[idx]);}return result;}else {length=this.extraHeaders.length;regexp=new RegExp('^\\s*'+name+'\\s*:','i');for(idx=0;idx<length;idx++){header=this.extraHeaders[idx];if(regexp.test(header)){result.push(header.substring(header.indexOf(':')+1).trim());}}return result;}},/**
           * Verify the existence of the given header.
           * @param {String} name header name
           * @returns {boolean} true if header with given name exists, false otherwise
           */hasHeader:function hasHeader(name){var regexp,idx,length=this.extraHeaders.length;if(this.headers[SIP.Utils.headerize(name)]){return true;}else {regexp=new RegExp('^\\s*'+name+'\\s*:','i');for(idx=0;idx<length;idx++){if(regexp.test(this.extraHeaders[idx])){return true;}}}return false;},toString:function toString(){var msg='',header,length,idx;msg+=this.method+' '+(this.ruri.toRaw?this.ruri.toRaw():this.ruri)+' SIP/2.0\r\n';for(header in this.headers){length=this.headers[header].length;for(idx=0;idx<length;idx++){msg+=header+': '+this.headers[header][idx]+'\r\n';}}length=this.extraHeaders.length;for(idx=0;idx<length;idx++){msg+=this.extraHeaders[idx].trim()+'\r\n';}msg+=getSupportedHeader(this);msg+='User-Agent: '+this.ua.configuration.userAgentString+'\r\n';if(this.body){if(typeof this.body==='string'){length=SIP.Utils.str_utf8_length(this.body);msg+='Content-Length: '+length+'\r\n\r\n';msg+=this.body;}else {if(this.body.body&&this.body.contentType){length=SIP.Utils.str_utf8_length(this.body.body);msg+='Content-Type: '+this.body.contentType+'\r\n';msg+='Content-Length: '+length+'\r\n\r\n';msg+=this.body.body;}else {msg+='Content-Length: '+0+'\r\n\r\n';}}}else {msg+='Content-Length: '+0+'\r\n\r\n';}return msg;}};/**
       * @augments SIP
       * @class Class for incoming SIP message.
       */IncomingMessage=function IncomingMessage(){this.data=null;this.headers=null;this.method=null;this.via=null;this.via_branch=null;this.call_id=null;this.cseq=null;this.from=null;this.from_tag=null;this.to=null;this.to_tag=null;this.body=null;};IncomingMessage.prototype={/**
          * Insert a header of the given name and value into the last position of the
          * header array.
          * @param {String} name header name
          * @param {String} value header value
          */addHeader:function addHeader(name,value){var header={raw:value};name=SIP.Utils.headerize(name);if(this.headers[name]){this.headers[name].push(header);}else {this.headers[name]=[header];}},/**
           * Get the value of the given header name at the given position.
           * @param {String} name header name
           * @returns {String|undefined} Returns the specified header, null if header doesn't exist.
           */getHeader:function getHeader(name){var header=this.headers[SIP.Utils.headerize(name)];if(header){if(header[0]){return header[0].raw;}}else {return;}},/**
           * Get the header/s of the given name.
           * @param {String} name header name
           * @returns {Array} Array with all the headers of the specified name.
           */getHeaders:function getHeaders(name){var idx,length,header=this.headers[SIP.Utils.headerize(name)],result=[];if(!header){return [];}length=header.length;for(idx=0;idx<length;idx++){result.push(header[idx].raw);}return result;},/**
           * Verify the existence of the given header.
           * @param {String} name header name
           * @returns {boolean} true if header with given name exists, false otherwise
           */hasHeader:function hasHeader(name){return this.headers[SIP.Utils.headerize(name)]?true:false;},/**
          * Parse the given header on the given index.
          * @param {String} name header name
          * @param {Number} [idx=0] header index
          * @returns {Object|undefined} Parsed header object, undefined if the header is not present or in case of a parsing error.
          */parseHeader:function parseHeader(name,idx){var header,value,parsed;name=SIP.Utils.headerize(name);idx=idx||0;if(!this.headers[name]){this.logger.log('header "'+name+'" not present');return;}else if(idx>=this.headers[name].length){this.logger.log('not so many "'+name+'" headers present');return;}header=this.headers[name][idx];value=header.raw;if(header.parsed){return header.parsed;}//substitute '-' by '_' for grammar rule matching.
  parsed=SIP.Grammar.parse(value,name.replace(/-/g,'_'));if(parsed===-1){this.headers[name].splice(idx,1);//delete from headers
  this.logger.warn('error parsing "'+name+'" header field with value "'+value+'"');return;}else {header.parsed=parsed;return parsed;}},/**
           * Message Header attribute selector. Alias of parseHeader.
           * @param {String} name header name
           * @param {Number} [idx=0] header index
           * @returns {Object|undefined} Parsed header object, undefined if the header is not present or in case of a parsing error.
           *
           * @example
           * message.s('via',3).port
           */s:function s(name,idx){return this.parseHeader(name,idx);},/**
          * Replace the value of the given header by the value.
          * @param {String} name header name
          * @param {String} value header value
          */setHeader:function setHeader(name,value){var header={raw:value};this.headers[SIP.Utils.headerize(name)]=[header];},toString:function toString(){return this.data;}};/**
       * @augments IncomingMessage
       * @class Class for incoming SIP request.
       */IncomingRequest=function IncomingRequest(ua){this.logger=ua.getLogger('sip.sipmessage');this.ua=ua;this.headers={};this.ruri=null;this.transport=null;this.server_transaction=null;};IncomingRequest.prototype=new IncomingMessage();/**
      * Stateful reply.
      * @param {Number} code status code
      * @param {String} reason reason phrase
      * @param {Object} headers extra headers
      * @param {String} body body
      * @param {Function} [onSuccess] onSuccess callback
      * @param {Function} [onFailure] onFailure callback
      */ // TODO: Get rid of callbacks and make promise based
  IncomingRequest.prototype.reply=function(code,reason,extraHeaders,body,onSuccess,onFailure){var rr,vias,length,idx,response,to=this.getHeader('To'),r=0,v=0;response=SIP.Utils.buildStatusLine(code,reason);extraHeaders=(extraHeaders||[]).slice();if(this.method===SIP.C.INVITE&&code>100&&code<=200){rr=this.getHeaders('record-route');length=rr.length;for(r;r<length;r++){response+='Record-Route: '+rr[r]+'\r\n';}}vias=this.getHeaders('via');length=vias.length;for(v;v<length;v++){response+='Via: '+vias[v]+'\r\n';}if(!this.to_tag&&code>100){to+=';tag='+SIP.Utils.newTag();}else if(this.to_tag&&!this.s('to').hasParam('tag')){to+=';tag='+this.to_tag;}response+='To: '+to+'\r\n';response+='From: '+this.getHeader('From')+'\r\n';response+='Call-ID: '+this.call_id+'\r\n';response+='CSeq: '+this.cseq+' '+this.method+'\r\n';length=extraHeaders.length;for(idx=0;idx<length;idx++){response+=extraHeaders[idx].trim()+'\r\n';}response+=getSupportedHeader(this);response+='User-Agent: '+this.ua.configuration.userAgentString+'\r\n';if(body){if(typeof body==='string'){length=SIP.Utils.str_utf8_length(body);response+='Content-Type: application/sdp\r\n';response+='Content-Length: '+length+'\r\n\r\n';response+=body;}else {if(body.body&&body.contentType){length=SIP.Utils.str_utf8_length(body.body);response+='Content-Type: '+body.contentType+'\r\n';response+='Content-Length: '+length+'\r\n\r\n';response+=body.body;}else {response+='Content-Length: '+0+'\r\n\r\n';}}}else {response+='Content-Length: '+0+'\r\n\r\n';}this.server_transaction.receiveResponse(code,response).then(onSuccess,onFailure);return response;};/**
      * Stateless reply.
      * @param {Number} code status code
      * @param {String} reason reason phrase
      */IncomingRequest.prototype.reply_sl=function(code,reason){var to,response,v=0,vias=this.getHeaders('via'),length=vias.length;response=SIP.Utils.buildStatusLine(code,reason);for(v;v<length;v++){response+='Via: '+vias[v]+'\r\n';}to=this.getHeader('To');if(!this.to_tag&&code>100){to+=';tag='+SIP.Utils.newTag();}else if(this.to_tag&&!this.s('to').hasParam('tag')){to+=';tag='+this.to_tag;}response+='To: '+to+'\r\n';response+='From: '+this.getHeader('From')+'\r\n';response+='Call-ID: '+this.call_id+'\r\n';response+='CSeq: '+this.cseq+' '+this.method+'\r\n';response+='User-Agent: '+this.ua.configuration.userAgentString+'\r\n';response+='Content-Length: '+0+'\r\n\r\n';this.transport.send(response);};/**
       * @augments IncomingMessage
       * @class Class for incoming SIP response.
       */IncomingResponse=function IncomingResponse(ua){this.logger=ua.getLogger('sip.sipmessage');this.headers={};this.status_code=null;this.reason_phrase=null;};IncomingResponse.prototype=new IncomingMessage();SIP.OutgoingRequest=OutgoingRequest;SIP.IncomingRequest=IncomingRequest;SIP.IncomingResponse=IncomingResponse;};/***/},/* 13 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP URI
   */ /**
   * @augments SIP
   * @class Class creating a SIP URI.
   *
   * @param {String} [scheme]
   * @param {String} [user]
   * @param {String} host
   * @param {String} [port]
   * @param {Object} [parameters]
   * @param {Object} [headers]
   *
   */module.exports=function(SIP){var URI;URI=function URI(scheme,user,host,port,parameters,headers){var param,header,raw,normal;// Checks
  if(!host){throw new TypeError('missing or invalid "host" parameter');}// Initialize parameters
  scheme=scheme||SIP.C.SIP;this.parameters={};this.headers={};for(param in parameters){this.setParam(param,parameters[param]);}for(header in headers){this.setHeader(header,headers[header]);}// Raw URI
  raw={scheme:scheme,user:user,host:host,port:port};// Normalized URI
  normal={scheme:scheme.toLowerCase(),user:user,host:host.toLowerCase(),port:port};Object.defineProperties(this,{_normal:{get:function get(){return normal;}},_raw:{get:function get(){return raw;}},scheme:{get:function get(){return normal.scheme;},set:function set(value){raw.scheme=value;normal.scheme=value.toLowerCase();}},user:{get:function get(){return normal.user;},set:function set(value){normal.user=raw.user=value;}},host:{get:function get(){return normal.host;},set:function set(value){raw.host=value;normal.host=value.toLowerCase();}},aor:{get:function get(){return normal.user+'@'+normal.host;}},port:{get:function get(){return normal.port;},set:function set(value){normal.port=raw.port=value===0?value:parseInt(value,10)||null;}}});};URI.prototype={setParam:function setParam(key,value){if(key){this.parameters[key.toLowerCase()]=typeof value==='undefined'||value===null?null:value.toString();}},getParam:function getParam(key){if(key){return this.parameters[key.toLowerCase()];}},hasParam:function hasParam(key){if(key){return this.parameters.hasOwnProperty(key.toLowerCase())&&true||false;}},deleteParam:function deleteParam(parameter){var value;parameter=parameter.toLowerCase();if(this.parameters.hasOwnProperty(parameter)){value=this.parameters[parameter];delete this.parameters[parameter];return value;}},clearParams:function clearParams(){this.parameters={};},setHeader:function setHeader(name,value){this.headers[SIP.Utils.headerize(name)]=value instanceof Array?value:[value];},getHeader:function getHeader(name){if(name){return this.headers[SIP.Utils.headerize(name)];}},hasHeader:function hasHeader(name){if(name){return this.headers.hasOwnProperty(SIP.Utils.headerize(name))&&true||false;}},deleteHeader:function deleteHeader(header){var value;header=SIP.Utils.headerize(header);if(this.headers.hasOwnProperty(header)){value=this.headers[header];delete this.headers[header];return value;}},clearHeaders:function clearHeaders(){this.headers={};},clone:function clone(){return new URI(this._raw.scheme,this._raw.user,this._raw.host,this._raw.port,JSON.parse(JSON.stringify(this.parameters)),JSON.parse(JSON.stringify(this.headers)));},toRaw:function toRaw(){return this._toString(this._raw);},toString:function toString(){return this._toString(this._normal);},_toString:function _toString(uri){var header,parameter,idx,uriString,headers=[];uriString=uri.scheme+':';// add slashes if it's not a sip(s) URI
  if(!uri.scheme.toLowerCase().match("^sips?$")){uriString+="//";}if(uri.user){uriString+=SIP.Utils.escapeUser(uri.user)+'@';}uriString+=uri.host;if(uri.port||uri.port===0){uriString+=':'+uri.port;}for(parameter in this.parameters){uriString+=';'+parameter;if(this.parameters[parameter]!==null){uriString+='='+this.parameters[parameter];}}for(header in this.headers){for(idx in this.headers[header]){headers.push(header+'='+this.headers[header][idx]);}}if(headers.length>0){uriString+='?'+headers.join('&');}return uriString;}};/**
        * Parse the given string and returns a SIP.URI instance or undefined if
        * it is an invalid URI.
        * @public
        * @param {String} uri
        */URI.parse=function(uri){uri=SIP.Grammar.parse(uri,'SIP_URI');if(uri!==-1){return uri;}else {return undefined;}};SIP.URI=URI;};/***/},/* 14 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP NameAddrHeader
   */ /**
   * @augments SIP
   * @class Class creating a Name Address SIP header.
   *
   * @param {SIP.URI} uri
   * @param {String} [displayName]
   * @param {Object} [parameters]
   *
   */module.exports=function(SIP){var NameAddrHeader;NameAddrHeader=function NameAddrHeader(uri,displayName,parameters){var param;// Checks
  if(!uri||!(uri instanceof SIP.URI)){throw new TypeError('missing or invalid "uri" parameter');}// Initialize parameters
  this.uri=uri;this.parameters={};for(param in parameters){this.setParam(param,parameters[param]);}Object.defineProperties(this,{friendlyName:{get:function get(){return this.displayName||uri.aor;}},displayName:{get:function get(){return displayName;},set:function set(value){displayName=value===0?'0':value;}}});};NameAddrHeader.prototype={setParam:function setParam(key,value){if(key){this.parameters[key.toLowerCase()]=typeof value==='undefined'||value===null?null:value.toString();}},getParam:SIP.URI.prototype.getParam,hasParam:SIP.URI.prototype.hasParam,deleteParam:SIP.URI.prototype.deleteParam,clearParams:SIP.URI.prototype.clearParams,clone:function clone(){return new NameAddrHeader(this.uri.clone(),this.displayName,JSON.parse(JSON.stringify(this.parameters)));},toString:function toString(){var body,parameter;body=this.displayName||this.displayName===0?'"'+this.displayName+'" ':'';body+='<'+this.uri.toString()+'>';for(parameter in this.parameters){body+=';'+parameter;if(this.parameters[parameter]!==null){body+='='+this.parameters[parameter];}}return body;}};/**
        * Parse the given string and returns a SIP.NameAddrHeader instance or undefined if
        * it is an invalid NameAddrHeader.
        * @public
        * @param {String} name_addr_header
        */NameAddrHeader.parse=function(name_addr_header){name_addr_header=SIP.Grammar.parse(name_addr_header,'Name_Addr_Header');if(name_addr_header!==-1){return name_addr_header;}else {return undefined;}};SIP.NameAddrHeader=NameAddrHeader;};/***/},/* 15 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Transactions
   */ /**
   * SIP Transactions module.
   * @augments SIP
   */module.exports=function(SIP){var C={// Transaction states
  STATUS_TRYING:1,STATUS_PROCEEDING:2,STATUS_CALLING:3,STATUS_ACCEPTED:4,STATUS_COMPLETED:5,STATUS_TERMINATED:6,STATUS_CONFIRMED:7,// Transaction types
  NON_INVITE_CLIENT:'nict',NON_INVITE_SERVER:'nist',INVITE_CLIENT:'ict',INVITE_SERVER:'ist'};function buildViaHeader(request_sender,transport,id){var via;via='SIP/2.0/'+(request_sender.ua.configuration.hackViaTcp?'TCP':transport.server.scheme);via+=' '+request_sender.ua.configuration.viaHost+';branch='+id;if(request_sender.ua.configuration.forceRport){via+=';rport';}return via;}/**
      * @augments SIP.Transactions
      * @class Non Invite Client Transaction
      * @param {SIP.RequestSender} request_sender
      * @param {SIP.OutgoingRequest} request
      * @param {SIP.Transport} transport
      */var NonInviteClientTransaction=function NonInviteClientTransaction(request_sender,request,transport){var via;this.type=C.NON_INVITE_CLIENT;this.transport=transport;this.id='z9hG4bK'+Math.floor(Math.random()*10000000);this.request_sender=request_sender;this.request=request;this.logger=request_sender.ua.getLogger('sip.transaction.nict',this.id);via=buildViaHeader(request_sender,transport,this.id);this.request.setHeader('via',via);this.request_sender.ua.newTransaction(this);};NonInviteClientTransaction.prototype=Object.create(SIP.EventEmitter.prototype);NonInviteClientTransaction.prototype.stateChanged=function(state){this.state=state;this.emit('stateChanged');};NonInviteClientTransaction.prototype.send=function(){var tr=this;this.stateChanged(C.STATUS_TRYING);this.F=SIP.Timers.setTimeout(tr.timer_F.bind(tr),SIP.Timers.TIMER_F);this.transport.send(this.request)["catch"](function(){this.onTransportError();}.bind(this));};NonInviteClientTransaction.prototype.onTransportError=function(){this.logger.log('transport error occurred, deleting non-INVITE client transaction '+this.id);SIP.Timers.clearTimeout(this.F);SIP.Timers.clearTimeout(this.K);this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);this.request_sender.onTransportError();};NonInviteClientTransaction.prototype.timer_F=function(){this.logger.debug('Timer F expired for non-INVITE client transaction '+this.id);this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);this.request_sender.onRequestTimeout();};NonInviteClientTransaction.prototype.timer_K=function(){this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);};NonInviteClientTransaction.prototype.receiveResponse=function(response){var tr=this,status_code=response.status_code;if(status_code<200){switch(this.state){case C.STATUS_TRYING:case C.STATUS_PROCEEDING:this.stateChanged(C.STATUS_PROCEEDING);this.request_sender.receiveResponse(response);break;}}else {switch(this.state){case C.STATUS_TRYING:case C.STATUS_PROCEEDING:this.stateChanged(C.STATUS_COMPLETED);SIP.Timers.clearTimeout(this.F);if(status_code===408){this.request_sender.onRequestTimeout();}else {this.request_sender.receiveResponse(response);}this.K=SIP.Timers.setTimeout(tr.timer_K.bind(tr),SIP.Timers.TIMER_K);break;}}};/**
      * @augments SIP.Transactions
      * @class Invite Client Transaction
      * @param {SIP.RequestSender} request_sender
      * @param {SIP.OutgoingRequest} request
      * @param {SIP.Transport} transport
      */var InviteClientTransaction=function InviteClientTransaction(request_sender,request,transport){var via,tr=this;this.type=C.INVITE_CLIENT;this.transport=transport;this.id='z9hG4bK'+Math.floor(Math.random()*10000000);this.request_sender=request_sender;this.request=request;this.logger=request_sender.ua.getLogger('sip.transaction.ict',this.id);via=buildViaHeader(request_sender,transport,this.id);this.request.setHeader('via',via);this.request_sender.ua.newTransaction(this);// Add the cancel property to the request.
  //Will be called from the request instance, not the transaction itself.
  this.request.cancel=function(reason,extraHeaders){extraHeaders=(extraHeaders||[]).slice();var length=extraHeaders.length;var extraHeadersString=null;for(var idx=0;idx<length;idx++){extraHeadersString=(extraHeadersString||'')+extraHeaders[idx].trim()+'\r\n';}tr.cancel_request(tr,reason,extraHeadersString);};};InviteClientTransaction.prototype=Object.create(SIP.EventEmitter.prototype);InviteClientTransaction.prototype.stateChanged=function(state){this.state=state;this.emit('stateChanged');};InviteClientTransaction.prototype.send=function(){var tr=this;this.stateChanged(C.STATUS_CALLING);this.B=SIP.Timers.setTimeout(tr.timer_B.bind(tr),SIP.Timers.TIMER_B);this.transport.send(this.request)["catch"](function(){this.onTransportError();}.bind(this));};InviteClientTransaction.prototype.onTransportError=function(){this.logger.log('transport error occurred, deleting INVITE client transaction '+this.id);SIP.Timers.clearTimeout(this.B);SIP.Timers.clearTimeout(this.D);SIP.Timers.clearTimeout(this.M);this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);if(this.state!==C.STATUS_ACCEPTED){this.request_sender.onTransportError();}};// RFC 6026 7.2
  InviteClientTransaction.prototype.timer_M=function(){this.logger.debug('Timer M expired for INVITE client transaction '+this.id);if(this.state===C.STATUS_ACCEPTED){SIP.Timers.clearTimeout(this.B);this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);}};// RFC 3261 17.1.1
  InviteClientTransaction.prototype.timer_B=function(){this.logger.debug('Timer B expired for INVITE client transaction '+this.id);if(this.state===C.STATUS_CALLING){this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);this.request_sender.onRequestTimeout();}};InviteClientTransaction.prototype.timer_D=function(){this.logger.debug('Timer D expired for INVITE client transaction '+this.id);SIP.Timers.clearTimeout(this.B);this.stateChanged(C.STATUS_TERMINATED);this.request_sender.ua.destroyTransaction(this);};InviteClientTransaction.prototype.sendACK=function(options){// TODO: Move PRACK stuff into the transaction layer. That is really where it should be
  var self=this,ruri;options=options||{};if(this.response.getHeader('contact')){ruri=this.response.parseHeader('contact').uri;}else {ruri=this.request.ruri;}var ack=new SIP.OutgoingRequest("ACK",ruri,this.request.ua,{cseq:this.response.cseq,call_id:this.response.call_id,from_uri:this.response.from.uri,from_tag:this.response.from_tag,to_uri:this.response.to.uri,to_tag:this.response.to_tag,route_set:this.response.getHeaders('record-route').reverse()},options.extraHeaders||[],options.body);this.ackSender=new SIP.RequestSender({request:ack,onRequestTimeout:this.request_sender.applicant.applicant?this.request_sender.applicant.applicant.onRequestTimeout:function(){self.logger.warn("ACK Request timed out");},onTransportError:this.request_sender.applicant.applicant?this.request_sender.applicant.applicant.onRequestTransportError:function(){self.logger.warn("ACK Request had a transport error");},receiveResponse:options.receiveResponse||function(){self.logger.warn("Received a response to an ACK which was unexpected. Dropping Response.");}},this.request.ua).send();return ack;};InviteClientTransaction.prototype.cancel_request=function(tr,reason,extraHeaders){var request=tr.request;this.cancel=SIP.C.CANCEL+' '+request.ruri+' SIP/2.0\r\n';this.cancel+='Via: '+request.headers['Via'].toString()+'\r\n';if(this.request.headers['Route']){this.cancel+='Route: '+request.headers['Route'].toString()+'\r\n';}this.cancel+='To: '+request.headers['To'].toString()+'\r\n';this.cancel+='From: '+request.headers['From'].toString()+'\r\n';this.cancel+='Call-ID: '+request.headers['Call-ID'].toString()+'\r\n';this.cancel+='Max-Forwards: '+SIP.UA.C.MAX_FORWARDS+'\r\n';this.cancel+='CSeq: '+request.headers['CSeq'].toString().split(' ')[0]+' CANCEL\r\n';if(reason){this.cancel+='Reason: '+reason+'\r\n';}if(extraHeaders){this.cancel+=extraHeaders;}this.cancel+='Content-Length: 0\r\n\r\n';// Send only if a provisional response (>100) has been received.
  if(this.state===C.STATUS_PROCEEDING){this.transport.send(this.cancel);}};InviteClientTransaction.prototype.receiveResponse=function(response){var tr=this,status_code=response.status_code;// This may create a circular dependency...
  response.transaction=this;if(this.response&&this.response.status_code===response.status_code&&this.response.cseq===response.cseq){this.logger.debug("ICT Received a retransmission for cseq: "+response.cseq);if(this.ackSender){this.ackSender.send();}return;}this.response=response;if(status_code>=100&&status_code<=199){switch(this.state){case C.STATUS_CALLING:this.stateChanged(C.STATUS_PROCEEDING);this.request_sender.receiveResponse(response);if(this.cancel){this.transport.send(this.cancel);}break;case C.STATUS_PROCEEDING:this.request_sender.receiveResponse(response);break;}}else if(status_code>=200&&status_code<=299){switch(this.state){case C.STATUS_CALLING:case C.STATUS_PROCEEDING:this.stateChanged(C.STATUS_ACCEPTED);this.M=SIP.Timers.setTimeout(tr.timer_M.bind(tr),SIP.Timers.TIMER_M);this.request_sender.receiveResponse(response);break;case C.STATUS_ACCEPTED:this.request_sender.receiveResponse(response);break;}}else if(status_code>=300&&status_code<=699){switch(this.state){case C.STATUS_CALLING:case C.STATUS_PROCEEDING:this.stateChanged(C.STATUS_COMPLETED);this.sendACK();this.request_sender.receiveResponse(response);break;case C.STATUS_COMPLETED:this.sendACK();break;}}};/**
       * @augments SIP.Transactions
       * @class ACK Client Transaction
       * @param {SIP.RequestSender} request_sender
       * @param {SIP.OutgoingRequest} request
       * @param {SIP.Transport} transport
       */var AckClientTransaction=function AckClientTransaction(request_sender,request,transport){var via;this.transport=transport;this.id='z9hG4bK'+Math.floor(Math.random()*10000000);this.request_sender=request_sender;this.request=request;this.logger=request_sender.ua.getLogger('sip.transaction.nict',this.id);via=buildViaHeader(request_sender,transport,this.id);this.request.setHeader('via',via);};AckClientTransaction.prototype=Object.create(SIP.EventEmitter.prototype);AckClientTransaction.prototype.send=function(){this.transport.send(this.request)["catch"](function(){this.onTransportError();}.bind(this));};AckClientTransaction.prototype.onTransportError=function(){this.logger.log('transport error occurred, for an ACK client transaction '+this.id);this.request_sender.onTransportError();};/**
      * @augments SIP.Transactions
      * @class Non Invite Server Transaction
      * @param {SIP.IncomingRequest} request
      * @param {SIP.UA} ua
      */var NonInviteServerTransaction=function NonInviteServerTransaction(request,ua){this.type=C.NON_INVITE_SERVER;this.id=request.via_branch;this.request=request;this.transport=ua.transport;this.ua=ua;this.last_response='';request.server_transaction=this;this.logger=ua.getLogger('sip.transaction.nist',this.id);this.state=C.STATUS_TRYING;ua.newTransaction(this);};NonInviteServerTransaction.prototype=Object.create(SIP.EventEmitter.prototype);NonInviteServerTransaction.prototype.stateChanged=function(state){this.state=state;this.emit('stateChanged');};NonInviteServerTransaction.prototype.timer_J=function(){this.logger.debug('Timer J expired for non-INVITE server transaction '+this.id);this.stateChanged(C.STATUS_TERMINATED);this.ua.destroyTransaction(this);};NonInviteServerTransaction.prototype.onTransportError=function(){if(!this.transportError){this.transportError=true;this.logger.log('transport error occurred, deleting non-INVITE server transaction '+this.id);SIP.Timers.clearTimeout(this.J);this.stateChanged(C.STATUS_TERMINATED);this.ua.destroyTransaction(this);}};NonInviteServerTransaction.prototype.receiveResponse=function(status_code,response){var tr=this;var deferred=SIP.Utils.defer();if(status_code===100){/* RFC 4320 4.1
               * 'A SIP element MUST NOT
               * send any provisional response with a
               * Status-Code other than 100 to a non-INVITE request.'
               */switch(this.state){case C.STATUS_TRYING:this.stateChanged(C.STATUS_PROCEEDING);this.transport.send(response)["catch"](function(){this.onTransportError();}.bind(this));break;case C.STATUS_PROCEEDING:this.last_response=response;this.transport.send(response).then(function(){deferred.resolve();})["catch"](function(){this.onTransportError();deferred.reject();}.bind(this));break;}}else if(status_code>=200&&status_code<=699){switch(this.state){case C.STATUS_TRYING:case C.STATUS_PROCEEDING:this.stateChanged(C.STATUS_COMPLETED);this.last_response=response;this.J=SIP.Timers.setTimeout(tr.timer_J.bind(tr),SIP.Timers.TIMER_J);this.transport.send(response).then(function(){deferred.resolve();})["catch"](function(){this.onTransportError();deferred.reject();}.bind(this));break;}}return deferred.promise;};/**
      * @augments SIP.Transactions
      * @class Invite Server Transaction
      * @param {SIP.IncomingRequest} request
      * @param {SIP.UA} ua
      */var InviteServerTransaction=function InviteServerTransaction(request,ua){this.type=C.INVITE_SERVER;this.id=request.via_branch;this.request=request;this.transport=ua.transport;this.ua=ua;this.last_response='';request.server_transaction=this;this.logger=ua.getLogger('sip.transaction.ist',this.id);this.state=C.STATUS_PROCEEDING;ua.newTransaction(this);this.resendProvisionalTimer=null;request.reply(100);};InviteServerTransaction.prototype=Object.create(SIP.EventEmitter.prototype);InviteServerTransaction.prototype.stateChanged=function(state){this.state=state;this.emit('stateChanged');};InviteServerTransaction.prototype.timer_H=function(){this.logger.debug('Timer H expired for INVITE server transaction '+this.id);if(this.state===C.STATUS_COMPLETED){this.logger.warn('transactions','ACK for INVITE server transaction was never received, call will be terminated');}this.stateChanged(C.STATUS_TERMINATED);this.ua.destroyTransaction(this);};InviteServerTransaction.prototype.timer_I=function(){this.stateChanged(C.STATUS_TERMINATED);this.ua.destroyTransaction(this);};// RFC 6026 7.1
  InviteServerTransaction.prototype.timer_L=function(){this.logger.debug('Timer L expired for INVITE server transaction '+this.id);if(this.state===C.STATUS_ACCEPTED){this.stateChanged(C.STATUS_TERMINATED);this.ua.destroyTransaction(this);}};InviteServerTransaction.prototype.onTransportError=function(){if(!this.transportError){this.transportError=true;this.logger.log('transport error occurred, deleting INVITE server transaction '+this.id);if(this.resendProvisionalTimer!==null){SIP.Timers.clearInterval(this.resendProvisionalTimer);this.resendProvisionalTimer=null;}SIP.Timers.clearTimeout(this.L);SIP.Timers.clearTimeout(this.H);SIP.Timers.clearTimeout(this.I);this.stateChanged(C.STATUS_TERMINATED);this.ua.destroyTransaction(this);}};InviteServerTransaction.prototype.resend_provisional=function(){this.transport.send(this.request)["catch"](function(){this.onTransportError();}.bind(this));};// INVITE Server Transaction RFC 3261 17.2.1
  InviteServerTransaction.prototype.receiveResponse=function(status_code,response){var tr=this;var deferred=SIP.Utils.defer();if(status_code>=100&&status_code<=199){switch(this.state){case C.STATUS_PROCEEDING:this.transport.send(response)["catch"](function(){this.onTransportError();}.bind(this));this.last_response=response;break;}}if(status_code>100&&status_code<=199&&this.state===C.STATUS_PROCEEDING){// Trigger the resendProvisionalTimer only for the first non 100 provisional response.
  if(this.resendProvisionalTimer===null){this.resendProvisionalTimer=SIP.Timers.setInterval(tr.resend_provisional.bind(tr),SIP.Timers.PROVISIONAL_RESPONSE_INTERVAL);}}else if(status_code>=200&&status_code<=299){switch(this.state){case C.STATUS_PROCEEDING:this.stateChanged(C.STATUS_ACCEPTED);this.last_response=response;this.L=SIP.Timers.setTimeout(tr.timer_L.bind(tr),SIP.Timers.TIMER_L);if(this.resendProvisionalTimer!==null){SIP.Timers.clearInterval(this.resendProvisionalTimer);this.resendProvisionalTimer=null;}/* falls through */case C.STATUS_ACCEPTED:// Note that this point will be reached for proceeding tr.state also.
  this.transport.send(response).then(function(){deferred.resolve();})["catch"](function(error){this.logger.error(error);this.onTransportError();deferred.reject();}.bind(this));break;}}else if(status_code>=300&&status_code<=699){switch(this.state){case C.STATUS_PROCEEDING:if(this.resendProvisionalTimer!==null){SIP.Timers.clearInterval(this.resendProvisionalTimer);this.resendProvisionalTimer=null;}this.transport.send(response).then(function(){this.stateChanged(C.STATUS_COMPLETED);this.H=SIP.Timers.setTimeout(tr.timer_H.bind(tr),SIP.Timers.TIMER_H);deferred.resolve();}.bind(this))["catch"](function(error){this.logger.error(error);this.onTransportError();deferred.reject();}.bind(this));break;}}return deferred.promise;};/**
       * @function
       * @param {SIP.UA} ua
       * @param {SIP.IncomingRequest} request
       *
       * @return {boolean}
       * INVITE:
       *  _true_ if retransmission
       *  _false_ new request
       *
       * ACK:
       *  _true_  ACK to non2xx response
       *  _false_ ACK must be passed to TU (accepted state)
       *          ACK to 2xx response
       *
       * CANCEL:
       *  _true_  no matching invite transaction
       *  _false_ matching invite transaction and no final response sent
       *
       * OTHER:
       *  _true_  retransmission
       *  _false_ new request
       */var checkTransaction=function checkTransaction(ua,request){var tr;switch(request.method){case SIP.C.INVITE:tr=ua.transactions.ist[request.via_branch];if(tr){switch(tr.state){case C.STATUS_PROCEEDING:tr.transport.send(tr.last_response);break;// RFC 6026 7.1 Invite retransmission
  }return true;}break;case SIP.C.ACK:tr=ua.transactions.ist[request.via_branch];// RFC 6026 7.1
  if(tr){if(tr.state===C.STATUS_ACCEPTED){return false;}else if(tr.state===C.STATUS_COMPLETED){tr.stateChanged(C.STATUS_CONFIRMED);tr.I=SIP.Timers.setTimeout(tr.timer_I.bind(tr),SIP.Timers.TIMER_I);return true;}}// ACK to 2XX Response.
  else {return false;}break;case SIP.C.CANCEL:tr=ua.transactions.ist[request.via_branch];if(tr){request.reply_sl(200);if(tr.state===C.STATUS_PROCEEDING){return false;}else {return true;}}else {request.reply_sl(481);return true;}default:// Non-INVITE Server Transaction RFC 3261 17.2.2
  tr=ua.transactions.nist[request.via_branch];if(tr){switch(tr.state){case C.STATUS_TRYING:break;case C.STATUS_PROCEEDING:case C.STATUS_COMPLETED:tr.transport.send(tr.last_response);break;}return true;}break;}};SIP.Transactions={C:C,checkTransaction:checkTransaction,NonInviteClientTransaction:NonInviteClientTransaction,InviteClientTransaction:InviteClientTransaction,AckClientTransaction:AckClientTransaction,NonInviteServerTransaction:NonInviteServerTransaction,InviteServerTransaction:InviteServerTransaction};};/***/},/* 16 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Dialog
   */ /**
   * @augments SIP
   * @class Class creating a SIP dialog.
   * @param {SIP.RTCSession} owner
   * @param {SIP.IncomingRequest|SIP.IncomingResponse} message
   * @param {Enum} type UAC / UAS
   * @param {Enum} state SIP.Dialog.C.STATUS_EARLY / SIP.Dialog.C.STATUS_CONFIRMED
   */module.exports=function(SIP){var RequestSender=__webpack_require__(17)(SIP);var Dialog,C={// Dialog states
  STATUS_EARLY:1,STATUS_CONFIRMED:2};// RFC 3261 12.1
  Dialog=function Dialog(owner,message,type,state){var contact;this.uac_pending_reply=false;this.uas_pending_reply=false;if(!message.hasHeader('contact')){return {error:'unable to create a Dialog without Contact header field'};}if(message instanceof SIP.IncomingResponse){state=message.status_code<200?C.STATUS_EARLY:C.STATUS_CONFIRMED;}else {// Create confirmed dialog if state is not defined
  state=state||C.STATUS_CONFIRMED;}contact=message.parseHeader('contact');// RFC 3261 12.1.1
  if(type==='UAS'){this.id={call_id:message.call_id,local_tag:message.to_tag,remote_tag:message.from_tag,toString:function toString(){return this.call_id+this.local_tag+this.remote_tag;}};this.state=state;this.remote_seqnum=message.cseq;this.local_uri=message.parseHeader('to').uri;this.remote_uri=message.parseHeader('from').uri;this.remote_target=contact.uri;this.route_set=message.getHeaders('record-route');this.invite_seqnum=message.cseq;this.local_seqnum=message.cseq;}// RFC 3261 12.1.2
  else if(type==='UAC'){this.id={call_id:message.call_id,local_tag:message.from_tag,remote_tag:message.to_tag,toString:function toString(){return this.call_id+this.local_tag+this.remote_tag;}};this.state=state;this.invite_seqnum=message.cseq;this.local_seqnum=message.cseq;this.local_uri=message.parseHeader('from').uri;this.pracked=[];this.remote_uri=message.parseHeader('to').uri;this.remote_target=contact.uri;this.route_set=message.getHeaders('record-route').reverse();}this.logger=owner.ua.getLogger('sip.dialog',this.id.toString());this.owner=owner;owner.ua.dialogs[this.id.toString()]=this;this.logger.log('new '+type+' dialog created with status '+(this.state===C.STATUS_EARLY?'EARLY':'CONFIRMED'));owner.emit('dialog',this);};Dialog.prototype={/**
           * @param {SIP.IncomingMessage} message
           * @param {Enum} UAC/UAS
           */update:function update(message,type){this.state=C.STATUS_CONFIRMED;this.logger.log('dialog '+this.id.toString()+'  changed to CONFIRMED state');if(type==='UAC'){// RFC 3261 13.2.2.4
  this.route_set=message.getHeaders('record-route').reverse();}},terminate:function terminate(){this.logger.log('dialog '+this.id.toString()+' deleted');if(this.sessionDescriptionHandler&&this.state!==C.STATUS_CONFIRMED){// TODO: This should call .close() on the handler when implemented
  this.sessionDescriptionHandler.close();}delete this.owner.ua.dialogs[this.id.toString()];},/**
          * @param {String} method request method
          * @param {Object} extraHeaders extra headers
          * @returns {SIP.OutgoingRequest}
          */ // RFC 3261 12.2.1.1
  createRequest:function createRequest(method,extraHeaders,body){var cseq,request;extraHeaders=(extraHeaders||[]).slice();if(!this.local_seqnum){this.local_seqnum=Math.floor(Math.random()*10000);}cseq=method===SIP.C.CANCEL||method===SIP.C.ACK?this.invite_seqnum:this.local_seqnum+=1;request=new SIP.OutgoingRequest(method,this.remote_target,this.owner.ua,{'cseq':cseq,'call_id':this.id.call_id,'from_uri':this.local_uri,'from_tag':this.id.local_tag,'to_uri':this.remote_uri,'to_tag':this.id.remote_tag,'route_set':this.route_set},extraHeaders,body);request.dialog=this;return request;},/**
          * @param {SIP.IncomingRequest} request
          * @returns {Boolean}
          */ // RFC 3261 12.2.2
  checkInDialogRequest:function checkInDialogRequest(request){var self=this;if(!this.remote_seqnum){this.remote_seqnum=request.cseq;}else if(request.cseq<this.remote_seqnum){//Do not try to reply to an ACK request.
  if(request.method!==SIP.C.ACK){request.reply(500);}if(request.cseq===this.invite_seqnum){return true;}return false;}switch(request.method){// RFC3261 14.2 Modifying an Existing Session -UAS BEHAVIOR-
  case SIP.C.INVITE:if(this.uac_pending_reply===true){request.reply(491);}else if(this.uas_pending_reply===true&&request.cseq>this.remote_seqnum){var retryAfter=(Math.random()*10|0)+1;request.reply(500,null,['Retry-After:'+retryAfter]);this.remote_seqnum=request.cseq;return false;}else {this.uas_pending_reply=true;request.server_transaction.on('stateChanged',function stateChanged(){if(this.state===SIP.Transactions.C.STATUS_ACCEPTED||this.state===SIP.Transactions.C.STATUS_COMPLETED||this.state===SIP.Transactions.C.STATUS_TERMINATED){this.removeListener('stateChanged',stateChanged);self.uas_pending_reply=false;}});}// RFC3261 12.2.2 Replace the dialog`s remote target URI if the request is accepted
  if(request.hasHeader('contact')){request.server_transaction.on('stateChanged',function(){if(this.state===SIP.Transactions.C.STATUS_ACCEPTED){self.remote_target=request.parseHeader('contact').uri;}});}break;case SIP.C.NOTIFY:// RFC6665 3.2 Replace the dialog`s remote target URI if the request is accepted
  if(request.hasHeader('contact')){request.server_transaction.on('stateChanged',function(){if(this.state===SIP.Transactions.C.STATUS_COMPLETED){self.remote_target=request.parseHeader('contact').uri;}});}break;}if(request.cseq>this.remote_seqnum){this.remote_seqnum=request.cseq;}return true;},sendRequest:function sendRequest(applicant,method,options){options=options||{};var extraHeaders=(options.extraHeaders||[]).slice();var body=null;if(options.body){if(options.body.body){body=options.body;}else {body={};body.body=options.body;if(options.contentType){body.contentType=options.contentType;}}}var request=this.createRequest(method,extraHeaders,body),request_sender=new RequestSender(this,applicant,request);request_sender.send();return request;},/**
          * @param {SIP.IncomingRequest} request
          */receiveRequest:function receiveRequest(request){//Check in-dialog request
  if(!this.checkInDialogRequest(request)){return;}this.owner.receiveRequest(request);}};Dialog.C=C;SIP.Dialog=Dialog;};/***/},/* 17 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview In-Dialog Request Sender
   */ /**
   * @augments SIP.Dialog
   * @class Class creating an In-dialog request sender.
   * @param {SIP.Dialog} dialog
   * @param {Object} applicant
   * @param {SIP.OutgoingRequest} request
   */ /**
   * @fileoverview in-Dialog Request Sender
   */module.exports=function(SIP){var RequestSender;RequestSender=function RequestSender(dialog,applicant,request){this.dialog=dialog;this.applicant=applicant;this.request=request;// RFC3261 14.1 Modifying an Existing Session. UAC Behavior.
  this.reattempt=false;this.reattemptTimer=null;};RequestSender.prototype={send:function send(){var self=this,request_sender=new SIP.RequestSender(this,this.dialog.owner.ua);request_sender.send();// RFC3261 14.2 Modifying an Existing Session -UAC BEHAVIOR-
  if(this.request.method===SIP.C.INVITE&&request_sender.clientTransaction.state!==SIP.Transactions.C.STATUS_TERMINATED){this.dialog.uac_pending_reply=true;request_sender.clientTransaction.on('stateChanged',function stateChanged(){if(this.state===SIP.Transactions.C.STATUS_ACCEPTED||this.state===SIP.Transactions.C.STATUS_COMPLETED||this.state===SIP.Transactions.C.STATUS_TERMINATED){this.removeListener('stateChanged',stateChanged);self.dialog.uac_pending_reply=false;}});}},onRequestTimeout:function onRequestTimeout(){this.applicant.onRequestTimeout();},onTransportError:function onTransportError(){this.applicant.onTransportError();},receiveResponse:function receiveResponse(response){var self=this;// RFC3261 12.2.1.2 408 or 481 is received for a request within a dialog.
  if(response.status_code===408||response.status_code===481){this.applicant.onDialogError(response);}else if(response.method===SIP.C.INVITE&&response.status_code===491){if(this.reattempt){this.applicant.receiveResponse(response);}else {this.request.cseq.value=this.dialog.local_seqnum+=1;this.reattemptTimer=SIP.Timers.setTimeout(function(){if(self.applicant.owner.status!==SIP.Session.C.STATUS_TERMINATED){self.reattempt=true;self.request_sender.send();}},this.getReattemptTimeout());}}else {this.applicant.receiveResponse(response);}}};return RequestSender;};/***/},/* 18 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview Request Sender
   */ /**
   * @augments SIP
   * @class Class creating a request sender.
   * @param {Object} applicant
   * @param {SIP.UA} ua
   */module.exports=function(SIP){var RequestSender;RequestSender=function RequestSender(applicant,ua){this.logger=ua.getLogger('sip.requestsender');this.ua=ua;this.applicant=applicant;this.method=applicant.request.method;this.request=applicant.request;this.credentials=null;this.challenged=false;this.staled=false;// If ua is in closing process or even closed just allow sending Bye and ACK
  if(ua.status===SIP.UA.C.STATUS_USER_CLOSED&&(this.method!==SIP.C.BYE||this.method!==SIP.C.ACK)){this.onTransportError();}};/**
      * Create the client transaction and send the message.
      */RequestSender.prototype={send:function send(){switch(this.method){case"INVITE":this.clientTransaction=new SIP.Transactions.InviteClientTransaction(this,this.request,this.ua.transport);break;case"ACK":this.clientTransaction=new SIP.Transactions.AckClientTransaction(this,this.request,this.ua.transport);break;default:this.clientTransaction=new SIP.Transactions.NonInviteClientTransaction(this,this.request,this.ua.transport);}this.clientTransaction.send();return this.clientTransaction;},/**
          * Callback fired when receiving a request timeout error from the client transaction.
          * To be re-defined by the applicant.
          * @event
          */onRequestTimeout:function onRequestTimeout(){this.applicant.onRequestTimeout();},/**
          * Callback fired when receiving a transport error from the client transaction.
          * To be re-defined by the applicant.
          * @event
          */onTransportError:function onTransportError(){this.applicant.onTransportError();},/**
          * Called from client transaction when receiving a correct response to the request.
          * Authenticate request if needed or pass the response back to the applicant.
          * @param {SIP.IncomingResponse} response
          */receiveResponse:function receiveResponse(response){var cseq,challenge,authorization_header_name,status_code=response.status_code;/*
              * Authentication
              * Authenticate once. _challenged_ flag used to avoid infinite authentications.
              */if(status_code===401||status_code===407){// Get and parse the appropriate WWW-Authenticate or Proxy-Authenticate header.
  if(response.status_code===401){challenge=response.parseHeader('www-authenticate');authorization_header_name='authorization';}else {challenge=response.parseHeader('proxy-authenticate');authorization_header_name='proxy-authorization';}// Verify it seems a valid challenge.
  if(!challenge){this.logger.warn(response.status_code+' with wrong or missing challenge, cannot authenticate');this.applicant.receiveResponse(response);return;}if(!this.challenged||!this.staled&&challenge.stale===true){if(!this.credentials){this.credentials=this.ua.configuration.authenticationFactory(this.ua);}// Verify that the challenge is really valid.
  if(!this.credentials.authenticate(this.request,challenge)){this.applicant.receiveResponse(response);return;}this.challenged=true;if(challenge.stale){this.staled=true;}if(response.method===SIP.C.REGISTER){cseq=this.applicant.cseq+=1;}else if(this.request.dialog){cseq=this.request.dialog.local_seqnum+=1;}else {cseq=this.request.cseq+1;this.request.cseq=cseq;}this.request.setHeader('cseq',cseq+' '+this.method);this.request.setHeader(authorization_header_name,this.credentials.toString());this.send();}else {this.applicant.receiveResponse(response);}}else {this.applicant.receiveResponse(response);}}};SIP.RequestSender=RequestSender;};/***/},/* 19 */ /***/function(module,exports,__webpack_require__){module.exports=function(SIP){var RegisterContext;RegisterContext=function RegisterContext(ua){var params={},regId=1;this.registrar=ua.configuration.registrarServer;this.expires=ua.configuration.registerExpires;// Contact header
  this.contact=ua.contact.toString();{this.contact+=';reg-id='+regId;this.contact+=';+sip.instance="<urn:uuid:'+ua.configuration.instanceId+'>"';}// Call-ID and CSeq values RFC3261 10.2
  this.call_id=SIP.Utils.createRandomToken(22);this.cseq=Math.floor(Math.random()*10000);this.to_uri=ua.configuration.uri;params.to_uri=this.to_uri;params.to_displayName=ua.configuration.displayName;params.call_id=this.call_id;params.cseq=this.cseq;// Extends ClientContext
  SIP.Utils.augment(this,SIP.ClientContext,[ua,'REGISTER',this.registrar,{params:params}]);this.registrationTimer=null;this.registrationExpiredTimer=null;// Set status
  this.registered=false;this.logger=ua.getLogger('sip.registercontext');ua.on('transportCreated',function(transport){transport.on('disconnected',this.onTransportDisconnected.bind(this));}.bind(this));};RegisterContext.prototype=Object.create({},{register:{writable:true,value:function register(options){var self=this,extraHeaders;// Handle Options
  this.options=options||{};extraHeaders=(this.options.extraHeaders||[]).slice();extraHeaders.push('Contact: '+this.contact+';expires='+this.expires);extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());// Save original extraHeaders to be used in .close
  this.closeHeaders=this.options.closeWithHeaders?(this.options.extraHeaders||[]).slice():[];this.receiveResponse=function(response){var contact,expires,contacts=response.getHeaders('contact').length,cause;// Discard responses to older REGISTER/un-REGISTER requests.
  if(response.cseq!==this.cseq){return;}// Clear registration timer
  if(this.registrationTimer!==null){SIP.Timers.clearTimeout(this.registrationTimer);this.registrationTimer=null;}switch(true){case /^1[0-9]{2}$/.test(response.status_code):this.emit('progress',response);break;case /^2[0-9]{2}$/.test(response.status_code):this.emit('accepted',response);if(response.hasHeader('expires')){expires=response.getHeader('expires');}if(this.registrationExpiredTimer!==null){SIP.Timers.clearTimeout(this.registrationExpiredTimer);this.registrationExpiredTimer=null;}// Search the Contact pointing to us and update the expires value accordingly.
  if(!contacts){this.logger.warn('no Contact header in response to REGISTER, response ignored');break;}while(contacts--){contact=response.parseHeader('contact',contacts);if(contact.uri.user===this.ua.contact.uri.user){expires=contact.getParam('expires');break;}else {contact=null;}}if(!contact){this.logger.warn('no Contact header pointing to us, response ignored');break;}if(!expires){expires=this.expires;}// Re-Register before the expiration interval has elapsed.
  // For that, decrease the expires value. ie: 3 seconds
  this.registrationTimer=SIP.Timers.setTimeout(function(){self.registrationTimer=null;self.register(self.options);},expires*1000-3000);this.registrationExpiredTimer=SIP.Timers.setTimeout(function(){self.logger.warn('registration expired');if(self.registered){self.unregistered(null,SIP.C.causes.EXPIRES);}},expires*1000);//Save gruu values
  if(contact.hasParam('temp-gruu')){this.ua.contact.temp_gruu=SIP.URI.parse(contact.getParam('temp-gruu').replace(/"/g,''));}if(contact.hasParam('pub-gruu')){this.ua.contact.pub_gruu=SIP.URI.parse(contact.getParam('pub-gruu').replace(/"/g,''));}this.registered=true;this.emit('registered',response||null);break;// Interval too brief RFC3261 10.2.8
  case /^423$/.test(response.status_code):if(response.hasHeader('min-expires')){// Increase our registration interval to the suggested minimum
  this.expires=response.getHeader('min-expires');// Attempt the registration again immediately
  this.register(this.options);}else {//This response MUST contain a Min-Expires header field
  this.logger.warn('423 response received for REGISTER without Min-Expires');this.registrationFailure(response,SIP.C.causes.SIP_FAILURE_CODE);}break;default:cause=SIP.Utils.sipErrorCause(response.status_code);this.registrationFailure(response,cause);}};this.onRequestTimeout=function(){this.registrationFailure(null,SIP.C.causes.REQUEST_TIMEOUT);};this.onTransportError=function(){this.registrationFailure(null,SIP.C.causes.CONNECTION_ERROR);};this.cseq++;this.request.cseq=this.cseq;this.request.setHeader('cseq',this.cseq+' REGISTER');this.request.extraHeaders=extraHeaders;this.send();}},registrationFailure:{writable:true,value:function registrationFailure(response,cause){this.emit('failed',response||null,cause||null);}},onTransportDisconnected:{writable:true,value:function onTransportDisconnected(){this.registered_before=this.registered;if(this.registrationTimer!==null){SIP.Timers.clearTimeout(this.registrationTimer);this.registrationTimer=null;}if(this.registrationExpiredTimer!==null){SIP.Timers.clearTimeout(this.registrationExpiredTimer);this.registrationExpiredTimer=null;}if(this.registered){this.unregistered(null,SIP.C.causes.CONNECTION_ERROR);}}},onTransportConnected:{writable:true,value:function onTransportConnected(){this.register(this.options);}},close:{writable:true,value:function close(){var options={all:false,extraHeaders:this.closeHeaders};this.registered_before=this.registered;if(this.registered){this.unregister(options);}}},unregister:{writable:true,value:function unregister(options){var extraHeaders;options=options||{};if(!this.registered&&!options.all){this.logger.warn('Already unregistered, but sending an unregister anyways.');}extraHeaders=(options.extraHeaders||[]).slice();this.registered=false;// Clear the registration timer.
  if(this.registrationTimer!==null){SIP.Timers.clearTimeout(this.registrationTimer);this.registrationTimer=null;}if(options.all){extraHeaders.push('Contact: *');extraHeaders.push('Expires: 0');}else {extraHeaders.push('Contact: '+this.contact+';expires=0');}this.receiveResponse=function(response){var cause;switch(true){case /^1[0-9]{2}$/.test(response.status_code):this.emit('progress',response);break;case /^2[0-9]{2}$/.test(response.status_code):this.emit('accepted',response);if(this.registrationExpiredTimer!==null){SIP.Timers.clearTimeout(this.registrationExpiredTimer);this.registrationExpiredTimer=null;}this.unregistered(response);break;default:cause=SIP.Utils.sipErrorCause(response.status_code);this.unregistered(response,cause);}};this.onRequestTimeout=function(){// Not actually unregistered...
  //this.unregistered(null, SIP.C.causes.REQUEST_TIMEOUT);
  };this.cseq++;this.request.cseq=this.cseq;this.request.setHeader('cseq',this.cseq+' REGISTER');this.request.extraHeaders=extraHeaders;this.send();}},unregistered:{writable:true,value:function unregistered(response,cause){this.registered=false;this.emit('unregistered',response||null,cause||null);}}});SIP.RegisterContext=RegisterContext;};/***/},/* 20 */ /***/function(module,exports,__webpack_require__){/* eslint-disable */ /**
   * @fileoverview SessionDescriptionHandler
   */ /* SessionDescriptionHandler
   * @class PeerConnection helper Class.
   * @param {SIP.Session} session
   * @param {Object} [options]
   */module.exports=function(EventEmitter){var SessionDescriptionHandler=function SessionDescriptionHandler(){};SessionDescriptionHandler.prototype=Object.create(EventEmitter.prototype,{/**
           * Destructor
           */close:{value:function close(){}},/**
           * Gets the local description from the underlying media implementation
           * @param {Object} [options] Options object to be used by getDescription
           * @param {Array} [modifiers] Array with one time use description modifiers
           * @returns {Promise} Promise that resolves with the local description to be used for the session
           */getDescription:{value:function getDescription(options,modifiers){}},/**
           * Check if the Session Description Handler can handle the Content-Type described by a SIP Message
           * @param {String} contentType The content type that is in the SIP Message
           * @returns {boolean}
           */hasDescription:{value:function hasSessionDescription(contentType){}},/**
           * The modifier that should be used when the session would like to place the call on hold
           * @param {String} [sdp] The description that will be modified
           * @returns {Promise} Promise that resolves with modified SDP
           */holdModifier:{value:function holdModifier(sdp){}},/**
           * Set the remote description to the underlying media implementation
           * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation
           * @param {Object} [options] Options object to be used by setDescription
           * @param {Array} [modifiers] Array with one time use description modifiers
           * @returns {Promise} Promise that resolves once the description is set
           */setDescription:{value:function setDescription(sessionDescription,options,modifiers){}},/**
           * Send DTMF via RTP (RFC 4733)
           * @param {String} tones A string containing DTMF digits
           * @param {Object} [options] Options object to be used by sendDtmf
           * @returns {boolean} true if DTMF send is successful, false otherwise
           */sendDtmf:{value:function sendDtmf(tones,options){}},/**
          * Get the direction of the session description
          * @returns {String} direction of the description
          */getDirection:{value:function getDirection(){}}});return SessionDescriptionHandler;};/***/},/* 21 */ /***/function(module,exports,__webpack_require__){module.exports=function(SIP){var ClientContext;ClientContext=function ClientContext(ua,method,target,options){var originalTarget=target;// Validate arguments
  if(target===undefined){throw new TypeError('Not enough arguments');}this.ua=ua;this.logger=ua.getLogger('sip.clientcontext');this.method=method;target=ua.normalizeTarget(target);if(!target){throw new TypeError('Invalid target: '+originalTarget);}/* Options
           * - extraHeaders
           * - params
           * - contentType
           * - body
           */options=Object.create(options||Object.prototype);options.extraHeaders=(options.extraHeaders||[]).slice();// Build the request
  this.request=new SIP.OutgoingRequest(this.method,target,this.ua,options.params,options.extraHeaders);if(options.body){this.body={};this.body.body=options.body;if(options.contentType){this.body.contentType=options.contentType;}this.request.body=this.body;}/* Set other properties from the request */this.localIdentity=this.request.from;this.remoteIdentity=this.request.to;this.data={};};ClientContext.prototype=Object.create(SIP.EventEmitter.prototype);ClientContext.prototype.send=function(){new SIP.RequestSender(this,this.ua).send();return this;};ClientContext.prototype.cancel=function(options){options=options||{};options.extraHeaders=(options.extraHeaders||[]).slice();var cancel_reason=SIP.Utils.getCancelReason(options.status_code,options.reason_phrase);this.request.cancel(cancel_reason,options.extraHeaders);this.emit('cancel');};ClientContext.prototype.receiveResponse=function(response){var cause=SIP.Utils.getReasonPhrase(response.status_code);switch(true){case /^1[0-9]{2}$/.test(response.status_code):this.emit('progress',response,cause);break;case /^2[0-9]{2}$/.test(response.status_code):if(this.ua.applicants[this]){delete this.ua.applicants[this];}this.emit('accepted',response,cause);break;default:if(this.ua.applicants[this]){delete this.ua.applicants[this];}this.emit('rejected',response,cause);this.emit('failed',response,cause);break;}};ClientContext.prototype.onRequestTimeout=function(){this.emit('failed',null,SIP.C.causes.REQUEST_TIMEOUT);};ClientContext.prototype.onTransportError=function(){this.emit('failed',null,SIP.C.causes.CONNECTION_ERROR);};SIP.ClientContext=ClientContext;};/***/},/* 22 */ /***/function(module,exports,__webpack_require__){module.exports=function(SIP){var ServerContext;ServerContext=function ServerContext(ua,request){this.ua=ua;this.logger=ua.getLogger('sip.servercontext');this.request=request;if(request.method===SIP.C.INVITE){this.transaction=new SIP.Transactions.InviteServerTransaction(request,ua);}else {this.transaction=new SIP.Transactions.NonInviteServerTransaction(request,ua);}if(request.body){this.body=request.body;}if(request.hasHeader('Content-Type')){this.contentType=request.getHeader('Content-Type');}this.method=request.method;this.data={};this.localIdentity=request.to;this.remoteIdentity=request.from;if(request.hasHeader('P-Asserted-Identity')){this.assertedIdentity=new SIP.NameAddrHeader.parse(request.getHeader('P-Asserted-Identity'));}};ServerContext.prototype=Object.create(SIP.EventEmitter.prototype);ServerContext.prototype.progress=function(options){options=Object.create(options||Object.prototype);options.statusCode||(options.statusCode=180);options.minCode=100;options.maxCode=199;options.events=['progress'];return this.reply(options);};ServerContext.prototype.accept=function(options){options=Object.create(options||Object.prototype);options.statusCode||(options.statusCode=200);options.minCode=200;options.maxCode=299;options.events=['accepted'];return this.reply(options);};ServerContext.prototype.reject=function(options){options=Object.create(options||Object.prototype);options.statusCode||(options.statusCode=480);options.minCode=300;options.maxCode=699;options.events=['rejected','failed'];return this.reply(options);};ServerContext.prototype.reply=function(options){options=options||{};// This is okay, so long as we treat options as read-only in this method
  var statusCode=options.statusCode||100,minCode=options.minCode||100,maxCode=options.maxCode||699,reasonPhrase=SIP.Utils.getReasonPhrase(statusCode,options.reasonPhrase),extraHeaders=options.extraHeaders||[],body=options.body,events=options.events||[],response;if(statusCode<minCode||statusCode>maxCode){throw new TypeError('Invalid statusCode: '+statusCode);}response=this.request.reply(statusCode,reasonPhrase,extraHeaders,body);events.forEach(function(event){this.emit(event,response,reasonPhrase);},this);return this;};ServerContext.prototype.onRequestTimeout=function(){this.emit('failed',null,SIP.C.causes.REQUEST_TIMEOUT);};ServerContext.prototype.onTransportError=function(){this.emit('failed',null,SIP.C.causes.CONNECTION_ERROR);};SIP.ServerContext=ServerContext;};/***/},/* 23 */ /***/function(module,exports,__webpack_require__){module.exports=function(SIP){var DTMF=__webpack_require__(24)(SIP);var Session,InviteServerContext,InviteClientContext,ReferServerContext,ReferClientContext,C={//Session states
  STATUS_NULL:0,STATUS_INVITE_SENT:1,STATUS_1XX_RECEIVED:2,STATUS_INVITE_RECEIVED:3,STATUS_WAITING_FOR_ANSWER:4,STATUS_ANSWERED:5,STATUS_WAITING_FOR_PRACK:6,STATUS_WAITING_FOR_ACK:7,STATUS_CANCELED:8,STATUS_TERMINATED:9,STATUS_ANSWERED_WAITING_FOR_PRACK:10,STATUS_EARLY_MEDIA:11,STATUS_CONFIRMED:12};/*
       * @param {function returning SIP.sessionDescriptionHandler} [sessionDescriptionHandlerFactory]
       *        (See the documentation for the sessionDescriptionHandlerFactory argument of the UA constructor.)
       */Session=function Session(sessionDescriptionHandlerFactory){this.status=C.STATUS_NULL;this.dialog=null;this.pendingReinvite=false;this.earlyDialogs={};if(!sessionDescriptionHandlerFactory){throw new SIP.Exceptions.SessionDescriptionHandlerMissing('A session description handler is required for the session to function');}this.sessionDescriptionHandlerFactory=sessionDescriptionHandlerFactory;this.hasOffer=false;this.hasAnswer=false;// Session Timers
  this.timers={ackTimer:null,expiresTimer:null,invite2xxTimer:null,userNoAnswerTimer:null,rel1xxTimer:null,prackTimer:null};// Session info
  this.startTime=null;this.endTime=null;this.tones=null;// Hold state
  this.local_hold=false;this.early_sdp=null;this.rel100=SIP.C.supported.UNSUPPORTED;};Session.prototype={dtmf:function dtmf(tones,options){var dtmfs=[],self=this,dtmfType=this.ua.configuration.dtmfType;options=options||{};if(tones===undefined){throw new TypeError('Not enough arguments');}// Check Session Status
  if(this.status!==C.STATUS_CONFIRMED&&this.status!==C.STATUS_WAITING_FOR_ACK){throw new SIP.Exceptions.InvalidStateError(this.status);}// Check tones
  if(typeof tones!=='string'&&typeof tones!=='number'||!tones.toString().match(/^[0-9A-D#*,]+$/i)){throw new TypeError('Invalid tones: '+tones);}var sendDTMF=function sendDTMF(){var dtmf,timeout;if(self.status===C.STATUS_TERMINATED||!self.tones||self.tones.length===0){// Stop sending DTMF
  self.tones=null;return this;}dtmf=self.tones.shift();{dtmf.on('failed',function(){self.tones=null;});dtmf.send(options);timeout=dtmf.duration+dtmf.interToneGap;}// Set timeout for the next tone
  SIP.Timers.setTimeout(sendDTMF,timeout);};tones=tones.toString();if(dtmfType===SIP.C.dtmfType.RTP){var sent=this.sessionDescriptionHandler.sendDtmf(tones,options);if(!sent){this.logger.warn("Attempt to use dtmfType 'RTP' has failed, falling back to INFO packet method");dtmfType=SIP.C.dtmfType.INFO;}}if(dtmfType===SIP.C.dtmfType.INFO){tones=tones.split('');while(tones.length>0){dtmfs.push(new DTMF(this,tones.shift(),options));}if(this.tones){// Tones are already queued, just add to the queue
  this.tones=this.tones.concat(dtmfs);return this;}this.tones=dtmfs;sendDTMF();}return this;},bye:function bye(options){options=Object.create(options||Object.prototype);var statusCode=options.statusCode;// Check Session Status
  if(this.status===C.STATUS_TERMINATED){this.logger.error('Error: Attempted to send BYE in a terminated session.');return this;}this.logger.log('terminating Session');if(statusCode&&(statusCode<200||statusCode>=700)){throw new TypeError('Invalid statusCode: '+statusCode);}options.receiveResponse=function(){};return this.sendRequest(SIP.C.BYE,options).terminated();},refer:function refer(target,options){options=options||{};// Check Session Status
  if(this.status!==C.STATUS_CONFIRMED){throw new SIP.Exceptions.InvalidStateError(this.status);}this.referContext=new SIP.ReferClientContext(this.ua,this,target,options);this.emit('referRequested',this.referContext);this.referContext.refer(options);},sendRequest:function sendRequest(method,options){options=options||{};var self=this;var request=new SIP.OutgoingRequest(method,this.dialog.remote_target,this.ua,{cseq:options.cseq||(this.dialog.local_seqnum+=1),call_id:this.dialog.id.call_id,from_uri:this.dialog.local_uri,from_tag:this.dialog.id.local_tag,to_uri:this.dialog.remote_uri,to_tag:this.dialog.id.remote_tag,route_set:this.dialog.route_set,statusCode:options.statusCode,reasonPhrase:options.reasonPhrase},options.extraHeaders||[],options.body);new SIP.RequestSender({request:request,onRequestTimeout:function onRequestTimeout(){self.onRequestTimeout();},onTransportError:function onTransportError(){self.onTransportError();},receiveResponse:options.receiveResponse||function(response){self.receiveNonInviteResponse(response);}},this.ua).send();// Emit the request event
  this.emit(method.toLowerCase(),request);return this;},close:function close(){var idx;if(this.status===C.STATUS_TERMINATED){return this;}this.logger.log('closing INVITE session '+this.id);// 1st Step. Terminate media.
  if(this.sessionDescriptionHandler){this.sessionDescriptionHandler.close();}// 2nd Step. Terminate signaling.
  // Clear session timers
  for(idx in this.timers){SIP.Timers.clearTimeout(this.timers[idx]);}// Terminate dialogs
  // Terminate confirmed dialog
  if(this.dialog){this.dialog.terminate();delete this.dialog;}// Terminate early dialogs
  for(idx in this.earlyDialogs){this.earlyDialogs[idx].terminate();delete this.earlyDialogs[idx];}this.status=C.STATUS_TERMINATED;this.ua.transport.removeListener("transportError",this.errorListener);delete this.ua.sessions[this.id];return this;},createDialog:function createDialog(message,type,early){var dialog,early_dialog,local_tag=message[type==='UAS'?'to_tag':'from_tag'],remote_tag=message[type==='UAS'?'from_tag':'to_tag'],id=message.call_id+local_tag+remote_tag;early_dialog=this.earlyDialogs[id];// Early Dialog
  if(early){if(early_dialog){return true;}else {early_dialog=new SIP.Dialog(this,message,type,SIP.Dialog.C.STATUS_EARLY);// Dialog has been successfully created.
  if(early_dialog.error){this.logger.error(early_dialog.error);this.failed(message,SIP.C.causes.INTERNAL_ERROR);return false;}else {this.earlyDialogs[id]=early_dialog;return true;}}}// Confirmed Dialog
  else {// In case the dialog is in _early_ state, update it
  if(early_dialog){early_dialog.update(message,type);this.dialog=early_dialog;delete this.earlyDialogs[id];for(var dia in this.earlyDialogs){this.earlyDialogs[dia].terminate();delete this.earlyDialogs[dia];}return true;}// Otherwise, create a _confirmed_ dialog
  dialog=new SIP.Dialog(this,message,type);if(dialog.error){this.logger.error(dialog.error);this.failed(message,SIP.C.causes.INTERNAL_ERROR);return false;}else {this.to_tag=message.to_tag;this.dialog=dialog;return true;}}},/**
           * Hold
           */hold:function hold(options,modifiers){if(this.status!==C.STATUS_WAITING_FOR_ACK&&this.status!==C.STATUS_CONFIRMED){throw new SIP.Exceptions.InvalidStateError(this.status);}if(this.local_hold){this.logger.log('Session is already on hold, cannot put it on hold again');return;}options=options||{};options.modifiers=modifiers||[];options.modifiers.push(this.sessionDescriptionHandler.holdModifier);this.local_hold=true;this.sendReinvite(options);},/**
           * Unhold
           */unhold:function unhold(options,modifiers){if(this.status!==C.STATUS_WAITING_FOR_ACK&&this.status!==C.STATUS_CONFIRMED){throw new SIP.Exceptions.InvalidStateError(this.status);}if(!this.local_hold){this.logger.log('Session is not on hold, cannot unhold it');return;}options=options||{};if(modifiers){options.modifiers=modifiers;}this.local_hold=false;this.sendReinvite(options);},reinvite:function reinvite(options,modifiers){options=options||{};if(modifiers){options.modifiers=modifiers;}return this.sendReinvite(options);},/**
           * In dialog INVITE Reception
           * @private
           */receiveReinvite:function receiveReinvite(request){var self=this,promise;// TODO: Should probably check state of the session
  self.emit('reinvite',this);if(request.hasHeader('P-Asserted-Identity')){this.assertedIdentity=new SIP.NameAddrHeader.parse(request.getHeader('P-Asserted-Identity'));}// Invite w/o SDP
  if(request.getHeader('Content-Length')==='0'&&!request.getHeader('Content-Type')){promise=this.sessionDescriptionHandler.getDescription(this.sessionDescriptionHandlerOptions,this.modifiers);// Invite w/ SDP
  }else if(this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))){promise=this.sessionDescriptionHandler.setDescription(request.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(this.sessionDescriptionHandler.getDescription.bind(this.sessionDescriptionHandler,this.sessionDescriptionHandlerOptions,this.modifiers));// Bad Packet (should never get hit)
  }else {request.reply(415);this.emit('reinviteFailed',self);return;}this.receiveRequest=function(request){if(request.method===SIP.C.ACK&&this.status===C.STATUS_WAITING_FOR_ACK){if(this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))){this.hasAnswer=true;this.sessionDescriptionHandler.setDescription(request.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function(){SIP.Timers.clearTimeout(this.timers.ackTimer);SIP.Timers.clearTimeout(this.timers.invite2xxTimer);this.status=C.STATUS_CONFIRMED;this.emit('confirmed',request);}.bind(this));}else {SIP.Timers.clearTimeout(this.timers.ackTimer);SIP.Timers.clearTimeout(this.timers.invite2xxTimer);this.status=C.STATUS_CONFIRMED;this.emit('confirmed',request);}}else {SIP.Session.prototype.receiveRequest.apply(this,[request]);}}.bind(this);promise["catch"](function onFailure(e){var statusCode;if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){statusCode=500;}else if(e instanceof SIP.Exceptions.RenegotiationError){self.emit('renegotiationError',e);self.logger.warn(e);statusCode=488;}else {self.logger.error(e);statusCode=488;}request.reply(statusCode);self.emit('reinviteFailed',self);// TODO: This could be better
  throw e;}).then(function(description){var extraHeaders=['Contact: '+self.contact];request.reply(200,null,extraHeaders,description,function(){self.status=C.STATUS_WAITING_FOR_ACK;self.setACKTimer();self.emit('reinviteAccepted',self);});});},sendReinvite:function sendReinvite(options){if(this.pendingReinvite){this.logger.warn('Reinvite in progress. Please wait until complete, then try again.');return;}this.pendingReinvite=true;options=options||{};options.modifiers=options.modifiers||[];var self=this,extraHeaders=(options.extraHeaders||[]).slice();extraHeaders.push('Contact: '+this.contact);extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions,options.modifiers).then(function(description){self.sendRequest(SIP.C.INVITE,{extraHeaders:extraHeaders,body:description,receiveResponse:self.receiveReinviteResponse.bind(self)});})["catch"](function onFailure(e){if(e instanceof SIP.Exceptions.RenegotiationError){self.pendingReinvite=false;self.emit('renegotiationError',e);self.logger.warn('Renegotiation Error');self.logger.warn(e);return;}self.logger.error('sessionDescriptionHandler error');self.logger.error(e);});},receiveRequest:function receiveRequest(request){switch(request.method){case SIP.C.BYE:request.reply(200);if(this.status===C.STATUS_CONFIRMED){this.emit('bye',request);this.terminated(request,SIP.C.causes.BYE);}break;case SIP.C.INVITE:if(this.status===C.STATUS_CONFIRMED){this.logger.log('re-INVITE received');this.receiveReinvite(request);}break;case SIP.C.INFO:if(this.status===C.STATUS_CONFIRMED||this.status===C.STATUS_WAITING_FOR_ACK){if(this.onInfo){return this.onInfo(request);}var body,tone,duration,contentType=request.getHeader('content-type'),reg_tone=/^(Signal\s*?=\s*?)([0-9A-D#*]{1})(\s)?.*/,reg_duration=/^(Duration\s?=\s?)([0-9]{1,4})(\s)?.*/;if(contentType){if(contentType.match(/^application\/dtmf-relay/i)){if(request.body){body=request.body.split('\r\n',2);if(body.length===2){if(reg_tone.test(body[0])){tone=body[0].replace(reg_tone,"$2");}if(reg_duration.test(body[1])){duration=parseInt(body[1].replace(reg_duration,"$2"),10);}}}new DTMF(this,tone,{duration:duration}).init_incoming(request);}else {request.reply(415,null,["Accept: application/dtmf-relay"]);}}}break;case SIP.C.REFER:if(this.status===C.STATUS_CONFIRMED){this.logger.log('REFER received');this.referContext=new SIP.ReferServerContext(this.ua,request);var hasReferListener=this.listeners('referRequested').length;if(hasReferListener){this.emit('referRequested',this.referContext);}else {this.logger.log('No referRequested listeners, automatically accepting and following the refer');var options={followRefer:true};if(this.passedOptions){options.inviteOptions=this.passedOptions;}this.referContext.accept(options,this.modifiers);}}break;case SIP.C.NOTIFY:if(this.referContext&&this.referContext instanceof SIP.ReferClientContext&&request.hasHeader('event')&&/^refer(;.*)?$/.test(request.getHeader('event'))){this.referContext.receiveNotify(request);return;}request.reply(200,'OK');this.emit('notify',request);break;}},/**
           * Reception of Response for in-dialog INVITE
           * @private
           */receiveReinviteResponse:function receiveReinviteResponse(response){var self=this;if(this.status===C.STATUS_TERMINATED){this.logger.error('Received reinvite response, but in STATUS_TERMINATED');// TODO: Do we need to send a SIP response?
  return;}if(!this.pendingReinvite){this.logger.error('Received reinvite response, but have no pending reinvite');// TODO: Do we need to send a SIP response?
  return;}switch(true){case /^1[0-9]{2}$/.test(response.status_code):break;case /^2[0-9]{2}$/.test(response.status_code):this.status=C.STATUS_CONFIRMED;// 17.1.1.1 - For each final response that is received at the client transaction, the client transaction sends an ACK,
  this.emit("ack",response.transaction.sendACK());this.pendingReinvite=false;// TODO: All of these timers should move into the Transaction layer
  SIP.Timers.clearTimeout(self.timers.invite2xxTimer);if(!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))){this.logger.error('2XX response received to re-invite but did not have a description');this.emit('reinviteFailed',self);this.emit('renegotiationError',new SIP.Exceptions.RenegotiationError('2XX response received to re-invite but did not have a description'));break;}this.sessionDescriptionHandler.setDescription(response.body,this.sessionDescriptionHandlerOptions,this.modifiers)["catch"](function onFailure(e){self.logger.error('Could not set the description in 2XX response');self.logger.error(e);self.emit('reinviteFailed',self);self.emit('renegotiationError',e);self.sendRequest(SIP.C.BYE,{extraHeaders:['Reason: '+SIP.Utils.getReasonHeaderValue(488,'Not Acceptable Here')]});self.terminated(null,SIP.C.causes.INCOMPATIBLE_SDP);}).then(function(){self.emit('reinviteAccepted',self);});break;default:this.pendingReinvite=false;this.logger.log('Received a non 1XX or 2XX response to a re-invite');this.emit('reinviteFailed',self);this.emit('renegotiationError',new SIP.Exceptions.RenegotiationError('Invalid response to a re-invite'));}},acceptAndTerminate:function acceptAndTerminate(response,status_code,reason_phrase){var extraHeaders=[];if(status_code){extraHeaders.push('Reason: '+SIP.Utils.getReasonHeaderValue(status_code,reason_phrase));}// An error on dialog creation will fire 'failed' event
  if(this.dialog||this.createDialog(response,'UAC')){this.emit("ack",response.transaction.sendACK());this.sendRequest(SIP.C.BYE,{extraHeaders:extraHeaders});}return this;},/**
           * RFC3261 13.3.1.4
           * Response retransmissions cannot be accomplished by transaction layer
           *  since it is destroyed when receiving the first 2xx answer
           */setInvite2xxTimer:function setInvite2xxTimer(request,description){var self=this,timeout=SIP.Timers.T1;this.timers.invite2xxTimer=SIP.Timers.setTimeout(function invite2xxRetransmission(){if(self.status!==C.STATUS_WAITING_FOR_ACK){return;}self.logger.log('no ACK received, attempting to retransmit OK');var extraHeaders=['Contact: '+self.contact];request.reply(200,null,extraHeaders,description);timeout=Math.min(timeout*2,SIP.Timers.T2);self.timers.invite2xxTimer=SIP.Timers.setTimeout(invite2xxRetransmission,timeout);},timeout);},/**
           * RFC3261 14.2
           * If a UAS generates a 2xx response and never receives an ACK,
           *  it SHOULD generate a BYE to terminate the dialog.
           */setACKTimer:function setACKTimer(){var self=this;this.timers.ackTimer=SIP.Timers.setTimeout(function(){if(self.status===C.STATUS_WAITING_FOR_ACK){self.logger.log('no ACK received for an extended period of time, terminating the call');SIP.Timers.clearTimeout(self.timers.invite2xxTimer);self.sendRequest(SIP.C.BYE);self.terminated(null,SIP.C.causes.NO_ACK);}},SIP.Timers.TIMER_H);},/*
           * @private
           */onTransportError:function onTransportError(){if(this.status!==C.STATUS_CONFIRMED&&this.status!==C.STATUS_TERMINATED){this.failed(null,SIP.C.causes.CONNECTION_ERROR);}},onRequestTimeout:function onRequestTimeout(){if(this.status===C.STATUS_CONFIRMED){this.terminated(null,SIP.C.causes.REQUEST_TIMEOUT);}else if(this.status!==C.STATUS_TERMINATED){this.failed(null,SIP.C.causes.REQUEST_TIMEOUT);this.terminated(null,SIP.C.causes.REQUEST_TIMEOUT);}},onDialogError:function onDialogError(response){if(this.status===C.STATUS_CONFIRMED){this.terminated(response,SIP.C.causes.DIALOG_ERROR);}else if(this.status!==C.STATUS_TERMINATED){this.failed(response,SIP.C.causes.DIALOG_ERROR);this.terminated(response,SIP.C.causes.DIALOG_ERROR);}},/**
           * @private
           */failed:function failed(response,cause){if(this.status===C.STATUS_TERMINATED){return this;}this.emit('failed',response||null,cause||null);return this;},rejected:function rejected(response,cause){this.emit('rejected',response||null,cause||null);return this;},canceled:function canceled(){if(this.sessionDescriptionHandler){this.sessionDescriptionHandler.close();}this.emit('cancel');return this;},accepted:function accepted(response,cause){cause=SIP.Utils.getReasonPhrase(response&&response.status_code,cause);this.startTime=new Date();if(this.replacee){this.replacee.emit('replaced',this);this.replacee.terminate();}this.emit('accepted',response,cause);return this;},terminated:function terminated(message,cause){if(this.status===C.STATUS_TERMINATED){return this;}this.endTime=new Date();this.close();this.emit('terminated',message||null,cause||null);return this;},connecting:function connecting(request){this.emit('connecting',{request:request});return this;}};Session.C=C;SIP.Session=Session;InviteServerContext=function InviteServerContext(ua,request){var expires,self=this,contentType=request.getHeader('Content-Type'),contentDisp=request.parseHeader('Content-Disposition');SIP.Utils.augment(this,SIP.ServerContext,[ua,request]);SIP.Utils.augment(this,SIP.Session,[ua.configuration.sessionDescriptionHandlerFactory]);if(contentDisp&&contentDisp.type==='render'){this.renderbody=request.body;this.rendertype=contentType;}this.status=C.STATUS_INVITE_RECEIVED;this.from_tag=request.from_tag;this.id=request.call_id+this.from_tag;this.request=request;this.contact=this.ua.contact.toString();this.receiveNonInviteResponse=function(){};// intentional no-op
  this.logger=ua.getLogger('sip.inviteservercontext',this.id);//Save the session into the ua sessions collection.
  this.ua.sessions[this.id]=this;//Get the Expires header value if exists
  if(request.hasHeader('expires')){expires=request.getHeader('expires')*1000;}//Set 100rel if necessary
  function set100rel(h,c){if(request.hasHeader(h)&&request.getHeader(h).toLowerCase().indexOf('100rel')>=0){self.rel100=c;}}set100rel('require',SIP.C.supported.REQUIRED);set100rel('supported',SIP.C.supported.SUPPORTED);/* Set the to_tag before
           * replying a response code that will create a dialog.
           */request.to_tag=SIP.Utils.newTag();// An error on dialog creation will fire 'failed' event
  if(!this.createDialog(request,'UAS',true)){request.reply(500,'Missing Contact header field');return;}var options={extraHeaders:['Contact: '+self.contact]};if(self.rel100!==SIP.C.supported.REQUIRED){self.progress(options);}self.status=C.STATUS_WAITING_FOR_ANSWER;// Set userNoAnswerTimer
  self.timers.userNoAnswerTimer=SIP.Timers.setTimeout(function(){request.reply(408);self.failed(request,SIP.C.causes.NO_ANSWER);self.terminated(request,SIP.C.causes.NO_ANSWER);},self.ua.configuration.noAnswerTimeout);/* Set expiresTimer
           * RFC3261 13.3.1
           */if(expires){self.timers.expiresTimer=SIP.Timers.setTimeout(function(){if(self.status===C.STATUS_WAITING_FOR_ANSWER){request.reply(487);self.failed(request,SIP.C.causes.EXPIRES);self.terminated(request,SIP.C.causes.EXPIRES);}},expires);}this.errorListener=this.onTransportError.bind(this);ua.transport.on('transportError',this.errorListener);};InviteServerContext.prototype=Object.create({},{reject:{writable:true,value:function value(options){// Check Session Status
  if(this.status===C.STATUS_TERMINATED){throw new SIP.Exceptions.InvalidStateError(this.status);}this.logger.log('rejecting RTCSession');SIP.ServerContext.prototype.reject.call(this,options);return this.terminated();}},terminate:{writable:true,value:function value(options){options=options||{};var extraHeaders=(options.extraHeaders||[]).slice(),body=options.body,dialog,self=this;if(this.status===C.STATUS_WAITING_FOR_ACK&&this.request.server_transaction.state!==SIP.Transactions.C.STATUS_TERMINATED){dialog=this.dialog;this.receiveRequest=function(request){if(request.method===SIP.C.ACK){this.sendRequest(SIP.C.BYE,{extraHeaders:extraHeaders,body:body});dialog.terminate();}};this.request.server_transaction.on('stateChanged',function(){if(this.state===SIP.Transactions.C.STATUS_TERMINATED&&this.dialog){this.request=new SIP.OutgoingRequest(SIP.C.BYE,this.dialog.remote_target,this.ua,{'cseq':this.dialog.local_seqnum+=1,'call_id':this.dialog.id.call_id,'from_uri':this.dialog.local_uri,'from_tag':this.dialog.id.local_tag,'to_uri':this.dialog.remote_uri,'to_tag':this.dialog.id.remote_tag,'route_set':this.dialog.route_set},extraHeaders,body);new SIP.RequestSender({request:this.request,onRequestTimeout:function onRequestTimeout(){self.onRequestTimeout();},onTransportError:function onTransportError(){self.onTransportError();},receiveResponse:function receiveResponse(){return;}},this.ua).send();dialog.terminate();}});this.emit('bye',this.request);this.terminated();// Restore the dialog into 'this' in order to be able to send the in-dialog BYE :-)
  this.dialog=dialog;// Restore the dialog into 'ua' so the ACK can reach 'this' session
  this.ua.dialogs[dialog.id.toString()]=dialog;}else if(this.status===C.STATUS_CONFIRMED){this.bye(options);}else {this.reject(options);}return this;}},/*
           * @param {Object} [options.sessionDescriptionHandlerOptions] gets passed to SIP.SessionDescriptionHandler.getDescription as options
           */progress:{writable:true,value:function value(options){options=options||{};var statusCode=options.statusCode||180,reasonPhrase=options.reasonPhrase,extraHeaders=(options.extraHeaders||[]).slice(),body=options.body,response;if(statusCode<100||statusCode>199){throw new TypeError('Invalid statusCode: '+statusCode);}if(this.isCanceled||this.status===C.STATUS_TERMINATED){return this;}function do100rel(){/* jshint validthis: true */statusCode=options.statusCode||183;// Set status and add extra headers
  this.status=C.STATUS_WAITING_FOR_PRACK;extraHeaders.push('Contact: '+this.contact);extraHeaders.push('Require: 100rel');extraHeaders.push('RSeq: '+Math.floor(Math.random()*10000));// Get the session description to add to preaccept with
  this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions,options.modifiers).then(function onSuccess(description){if(this.isCanceled||this.status===C.STATUS_TERMINATED){return;}this.early_sdp=description.body;this[this.hasOffer?'hasAnswer':'hasOffer']=true;// Retransmit until we get a response or we time out (see prackTimer below)
  var timeout=SIP.Timers.T1;this.timers.rel1xxTimer=SIP.Timers.setTimeout(function rel1xxRetransmission(){this.request.reply(statusCode,null,extraHeaders,description);timeout*=2;this.timers.rel1xxTimer=SIP.Timers.setTimeout(rel1xxRetransmission.bind(this),timeout);}.bind(this),timeout);// Timeout and reject INVITE if no response
  this.timers.prackTimer=SIP.Timers.setTimeout(function(){if(this.status!==C.STATUS_WAITING_FOR_PRACK){return;}this.logger.log('no PRACK received, rejecting the call');SIP.Timers.clearTimeout(this.timers.rel1xxTimer);this.request.reply(504);this.terminated(null,SIP.C.causes.NO_PRACK);}.bind(this),SIP.Timers.T1*64);// Send the initial response
  response=this.request.reply(statusCode,reasonPhrase,extraHeaders,description);this.emit('progress',response,reasonPhrase);}.bind(this),function onFailure(){this.request.reply(480);this.failed(null,SIP.C.causes.WEBRTC_ERROR);this.terminated(null,SIP.C.causes.WEBRTC_ERROR);}.bind(this));}// end do100rel
  function normalReply(){/* jshint validthis:true */response=this.request.reply(statusCode,reasonPhrase,extraHeaders,body);this.emit('progress',response,reasonPhrase);}if(options.statusCode!==100&&(this.rel100===SIP.C.supported.REQUIRED||this.rel100===SIP.C.supported.SUPPORTED&&options.rel100||this.rel100===SIP.C.supported.SUPPORTED&&this.ua.configuration.rel100===SIP.C.supported.REQUIRED)){this.sessionDescriptionHandler=this.setupSessionDescriptionHandler();this.emit('SessionDescriptionHandler-created',this.sessionDescriptionHandler);if(this.sessionDescriptionHandler.hasDescription(this.request.getHeader('Content-Type'))){this.hasOffer=true;this.sessionDescriptionHandler.setDescription(this.request.body,options.sessionDescriptionHandlerOptions,options.modifiers).then(do100rel.apply(this))["catch"](function onFailure(e){this.logger.warn('invalid description');this.logger.warn(e);this.failed(null,SIP.C.causes.WEBRTC_ERROR);this.terminated(null,SIP.C.causes.WEBRTC_ERROR);}.bind(this));}else {do100rel.apply(this);}}else {normalReply.apply(this);}return this;}},/*
           * @param {Object} [options.sessionDescriptionHandlerOptions] gets passed to SIP.SessionDescriptionHandler.getDescription as options
           */accept:{writable:true,value:function value(options){options=options||{};this.onInfo=options.onInfo;var self=this,request=this.request,extraHeaders=(options.extraHeaders||[]).slice(),descriptionCreationSucceeded=function descriptionCreationSucceeded(description){var response,// run for reply success callback
  replySucceeded=function replySucceeded(){self.status=C.STATUS_WAITING_FOR_ACK;self.setInvite2xxTimer(request,description);self.setACKTimer();},// run for reply failure callback
  replyFailed=function replyFailed(){self.failed(null,SIP.C.causes.CONNECTION_ERROR);self.terminated(null,SIP.C.causes.CONNECTION_ERROR);};extraHeaders.push('Contact: '+self.contact);extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());if(!self.hasOffer){self.hasOffer=true;}else {self.hasAnswer=true;}response=request.reply(200,null,extraHeaders,description,replySucceeded,replyFailed);if(self.status!==C.STATUS_TERMINATED){// Didn't fail
  self.accepted(response,SIP.Utils.getReasonPhrase(200));}},descriptionCreationFailed=function descriptionCreationFailed(err){if(err instanceof SIP.Exceptions.SessionDescriptionHandlerError){self.logger.log(err.message);self.logger.log(err.error);}// TODO: This should check the actual error and make sure it is an
  //        "expected" error. Otherwise it should throw.
  if(self.status===C.STATUS_TERMINATED){return;}self.request.reply(480);self.failed(null,SIP.C.causes.WEBRTC_ERROR);self.terminated(null,SIP.C.causes.WEBRTC_ERROR);};// Check Session Status
  if(this.status===C.STATUS_WAITING_FOR_PRACK){this.status=C.STATUS_ANSWERED_WAITING_FOR_PRACK;return this;}else if(this.status===C.STATUS_WAITING_FOR_ANSWER){this.status=C.STATUS_ANSWERED;}else if(this.status!==C.STATUS_EARLY_MEDIA){throw new SIP.Exceptions.InvalidStateError(this.status);}// An error on dialog creation will fire 'failed' event
  if(!this.createDialog(request,'UAS')){request.reply(500,'Missing Contact header field');return this;}SIP.Timers.clearTimeout(this.timers.userNoAnswerTimer);if(this.status===C.STATUS_EARLY_MEDIA){descriptionCreationSucceeded({});}else {this.sessionDescriptionHandler=this.setupSessionDescriptionHandler();this.emit('SessionDescriptionHandler-created',this.sessionDescriptionHandler);if(this.request.getHeader('Content-Length')==='0'&&!this.request.getHeader('Content-Type')){this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions,options.modifiers)["catch"](descriptionCreationFailed).then(descriptionCreationSucceeded);}else if(this.sessionDescriptionHandler.hasDescription(this.request.getHeader('Content-Type'))){this.hasOffer=true;this.sessionDescriptionHandler.setDescription(this.request.body,options.sessionDescriptionHandlerOptions,options.modifiers).then(function(){return this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions,options.modifiers);}.bind(this))["catch"](descriptionCreationFailed).then(descriptionCreationSucceeded);}else {this.request.reply(415);// TODO: Events
  return;}}return this;}},receiveRequest:{writable:true,value:function value(request){// ISC RECEIVE REQUEST
  function confirmSession(){/* jshint validthis:true */var contentType,contentDisp;SIP.Timers.clearTimeout(this.timers.ackTimer);SIP.Timers.clearTimeout(this.timers.invite2xxTimer);this.status=C.STATUS_CONFIRMED;contentType=request.getHeader('Content-Type');contentDisp=request.getHeader('Content-Disposition');if(contentDisp&&contentDisp.type==='render'){this.renderbody=request.body;this.rendertype=contentType;}this.emit('confirmed',request);}switch(request.method){case SIP.C.CANCEL:/* RFC3261 15 States that a UAS may have accepted an invitation while a CANCEL
                           * was in progress and that the UAC MAY continue with the session established by
                           * any 2xx response, or MAY terminate with BYE. SIP does continue with the
                           * established session. So the CANCEL is processed only if the session is not yet
                           * established.
                           */ /*
                           * Terminate the whole session in case the user didn't accept (or yet to send the answer) nor reject the
                           *request opening the session.
                           */if(this.status===C.STATUS_WAITING_FOR_ANSWER||this.status===C.STATUS_WAITING_FOR_PRACK||this.status===C.STATUS_ANSWERED_WAITING_FOR_PRACK||this.status===C.STATUS_EARLY_MEDIA||this.status===C.STATUS_ANSWERED){this.status=C.STATUS_CANCELED;this.request.reply(487);this.canceled(request);this.rejected(request,SIP.C.causes.CANCELED);this.failed(request,SIP.C.causes.CANCELED);this.terminated(request,SIP.C.causes.CANCELED);}break;case SIP.C.ACK:if(this.status===C.STATUS_WAITING_FOR_ACK){if(this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))){// ACK contains answer to an INVITE w/o SDP negotiation
  this.hasAnswer=true;this.sessionDescriptionHandler.setDescription(request.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(// TODO: Catch then .then
  confirmSession.bind(this),function onFailure(e){this.logger.warn(e);this.terminate({statusCode:'488',reasonPhrase:'Bad Media Description'});this.failed(request,SIP.C.causes.BAD_MEDIA_DESCRIPTION);this.terminated(request,SIP.C.causes.BAD_MEDIA_DESCRIPTION);}.bind(this));}else {confirmSession.apply(this);}}break;case SIP.C.PRACK:if(this.status===C.STATUS_WAITING_FOR_PRACK||this.status===C.STATUS_ANSWERED_WAITING_FOR_PRACK){if(!this.hasAnswer){this.sessionDescriptionHandler=this.setupSessionDescriptionHandler();this.emit('SessionDescriptionHandler-created',this.sessionDescriptionHandler);if(this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))){this.hasAnswer=true;this.sessionDescriptionHandler.setDescription(request.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function onSuccess(){SIP.Timers.clearTimeout(this.timers.rel1xxTimer);SIP.Timers.clearTimeout(this.timers.prackTimer);request.reply(200);if(this.status===C.STATUS_ANSWERED_WAITING_FOR_PRACK){this.status=C.STATUS_EARLY_MEDIA;this.accept();}this.status=C.STATUS_EARLY_MEDIA;}.bind(this),function onFailure(e){this.logger.warn(e);this.terminate({statusCode:'488',reasonPhrase:'Bad Media Description'});this.failed(request,SIP.C.causes.BAD_MEDIA_DESCRIPTION);this.terminated(request,SIP.C.causes.BAD_MEDIA_DESCRIPTION);}.bind(this));}else {this.terminate({statusCode:'488',reasonPhrase:'Bad Media Description'});this.failed(request,SIP.C.causes.BAD_MEDIA_DESCRIPTION);this.terminated(request,SIP.C.causes.BAD_MEDIA_DESCRIPTION);}}else {SIP.Timers.clearTimeout(this.timers.rel1xxTimer);SIP.Timers.clearTimeout(this.timers.prackTimer);request.reply(200);if(this.status===C.STATUS_ANSWERED_WAITING_FOR_PRACK){this.status=C.STATUS_EARLY_MEDIA;this.accept();}this.status=C.STATUS_EARLY_MEDIA;}}else if(this.status===C.STATUS_EARLY_MEDIA){request.reply(200);}break;default:Session.prototype.receiveRequest.apply(this,[request]);break;}}},// Internal Function to setup the handler consistently
  setupSessionDescriptionHandler:{writable:true,value:function value(){if(this.sessionDescriptionHandler){return this.sessionDescriptionHandler;}return this.sessionDescriptionHandlerFactory(this,this.ua.configuration.sessionDescriptionHandlerFactoryOptions);}},onTransportError:{writable:true,value:function value(){if(this.status!==C.STATUS_CONFIRMED&&this.status!==C.STATUS_TERMINATED){this.failed(null,SIP.C.causes.CONNECTION_ERROR);}}},onRequestTimeout:{writable:true,value:function value(){if(this.status===C.STATUS_CONFIRMED){this.terminated(null,SIP.C.causes.REQUEST_TIMEOUT);}else if(this.status!==C.STATUS_TERMINATED){this.failed(null,SIP.C.causes.REQUEST_TIMEOUT);this.terminated(null,SIP.C.causes.REQUEST_TIMEOUT);}}}});SIP.InviteServerContext=InviteServerContext;InviteClientContext=function InviteClientContext(ua,target,options,modifiers){options=options||{};this.passedOptions=options;// Save for later to use with refer
  options.params=Object.create(options.params||Object.prototype);var extraHeaders=(options.extraHeaders||[]).slice(),sessionDescriptionHandlerFactory=ua.configuration.sessionDescriptionHandlerFactory;this.sessionDescriptionHandlerFactoryOptions=ua.configuration.sessionDescriptionHandlerFactoryOptions||{};this.sessionDescriptionHandlerOptions=options.sessionDescriptionHandlerOptions||{};this.modifiers=modifiers;this.inviteWithoutSdp=options.inviteWithoutSdp||false;// Set anonymous property
  this.anonymous=options.anonymous||false;// Custom data to be sent either in INVITE or in ACK
  this.renderbody=options.renderbody||null;this.rendertype=options.rendertype||'text/plain';// Session parameter initialization
  this.from_tag=SIP.Utils.newTag();options.params.from_tag=this.from_tag;/* Do not add ;ob in initial forming dialog requests if the registration over
           *  the current connection got a GRUU URI.
           */this.contact=ua.contact.toString({anonymous:this.anonymous,outbound:this.anonymous?!ua.contact.temp_gruu:!ua.contact.pub_gruu});if(this.anonymous){options.params.from_displayName='Anonymous';options.params.from_uri='sip:anonymous@anonymous.invalid';extraHeaders.push('P-Preferred-Identity: '+ua.configuration.uri.toString());extraHeaders.push('Privacy: id');}extraHeaders.push('Contact: '+this.contact);extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());if(this.inviteWithoutSdp&&this.renderbody){extraHeaders.push('Content-Type: '+this.rendertype);extraHeaders.push('Content-Disposition: render;handling=optional');}if(ua.configuration.rel100===SIP.C.supported.REQUIRED){extraHeaders.push('Require: 100rel');}if(ua.configuration.replaces===SIP.C.supported.REQUIRED){extraHeaders.push('Require: replaces');}options.extraHeaders=extraHeaders;SIP.Utils.augment(this,SIP.ClientContext,[ua,SIP.C.INVITE,target,options]);SIP.Utils.augment(this,SIP.Session,[sessionDescriptionHandlerFactory]);// Check Session Status
  if(this.status!==C.STATUS_NULL){throw new SIP.Exceptions.InvalidStateError(this.status);}// OutgoingSession specific parameters
  this.isCanceled=false;this.received_100=false;this.method=SIP.C.INVITE;this.receiveNonInviteResponse=this.receiveResponse;this.receiveResponse=this.receiveInviteResponse;this.logger=ua.getLogger('sip.inviteclientcontext');ua.applicants[this]=this;this.id=this.request.call_id+this.from_tag;this.onInfo=options.onInfo;this.errorListener=this.onTransportError.bind(this);ua.transport.on('transportError',this.errorListener);};InviteClientContext.prototype=Object.create({},{invite:{writable:true,value:function value(){var self=this;//Save the session into the ua sessions collection.
  //Note: placing in constructor breaks call to request.cancel on close... User does not need this anyway
  this.ua.sessions[this.id]=this;// This should allow the function to return so that listeners can be set up for these events
  SIP.Utils.Promise.resolve().then(function(){if(this.inviteWithoutSdp){//just send an invite with no sdp...
  this.request.body=self.renderbody;this.status=C.STATUS_INVITE_SENT;this.send();}else {//Initialize Media Session
  this.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions);this.emit('SessionDescriptionHandler-created',this.sessionDescriptionHandler);this.sessionDescriptionHandler.getDescription(this.sessionDescriptionHandlerOptions,this.modifiers).then(function onSuccess(description){if(self.isCanceled||self.status===C.STATUS_TERMINATED){return;}self.hasOffer=true;self.request.body=description;self.status=C.STATUS_INVITE_SENT;self.send();},function onFailure(err){if(err instanceof SIP.Exceptions.SessionDescriptionHandlerError){self.logger.log(err.message);self.logger.log(err.error);}if(self.status===C.STATUS_TERMINATED){return;}self.failed(null,SIP.C.causes.WEBRTC_ERROR);self.terminated(null,SIP.C.causes.WEBRTC_ERROR);});}}.bind(this));return this;}},receiveInviteResponse:{writable:true,value:function value(response){var cause,session=this,id=response.call_id+response.from_tag+response.to_tag,extraHeaders=[],options={};if(this.status===C.STATUS_TERMINATED||response.method!==SIP.C.INVITE){return;}if(this.dialog&&response.status_code>=200&&response.status_code<=299){if(id!==this.dialog.id.toString()){if(!this.createDialog(response,'UAC',true)){return;}this.emit("ack",response.transaction.sendACK({body:SIP.Utils.generateFakeSDP(response.body)}));this.earlyDialogs[id].sendRequest(this,SIP.C.BYE);/* NOTE: This fails because the forking proxy does not recognize that an unanswerable
                           * leg (due to peerConnection limitations) has been answered first. If your forking
                           * proxy does not hang up all unanswered branches on the first branch answered, remove this.
                           */if(this.status!==C.STATUS_CONFIRMED){this.failed(response,SIP.C.causes.WEBRTC_ERROR);this.terminated(response,SIP.C.causes.WEBRTC_ERROR);}return;}else if(this.status===C.STATUS_CONFIRMED){this.emit("ack",response.transaction.sendACK());return;}else if(!this.hasAnswer){// invite w/o sdp is waiting for callback
  //an invite with sdp must go on, and hasAnswer is true
  return;}}if(this.dialog&&response.status_code<200){/*
                        Early media has been set up with at least one other different branch,
                        but a final 2xx response hasn't been received
                      */if(this.dialog.pracked.indexOf(response.getHeader('rseq'))!==-1||this.dialog.pracked[this.dialog.pracked.length-1]>=response.getHeader('rseq')&&this.dialog.pracked.length>0){return;}if(!this.earlyDialogs[id]&&!this.createDialog(response,'UAC',true)){return;}if(this.earlyDialogs[id].pracked.indexOf(response.getHeader('rseq'))!==-1||this.earlyDialogs[id].pracked[this.earlyDialogs[id].pracked.length-1]>=response.getHeader('rseq')&&this.earlyDialogs[id].pracked.length>0){return;}extraHeaders.push('RAck: '+response.getHeader('rseq')+' '+response.getHeader('cseq'));this.earlyDialogs[id].pracked.push(response.getHeader('rseq'));this.earlyDialogs[id].sendRequest(this,SIP.C.PRACK,{extraHeaders:extraHeaders,body:SIP.Utils.generateFakeSDP(response.body)});return;}// Proceed to cancellation if the user requested.
  if(this.isCanceled){if(response.status_code>=100&&response.status_code<200){this.request.cancel(this.cancelReason,extraHeaders);this.canceled(null);}else if(response.status_code>=200&&response.status_code<299){this.acceptAndTerminate(response);this.emit('bye',this.request);}else if(response.status_code>=300){cause=SIP.C.REASON_PHRASE[response.status_code]||SIP.C.causes.CANCELED;this.rejected(response,cause);this.failed(response,cause);this.terminated(response,cause);}return;}switch(true){case /^100$/.test(response.status_code):this.received_100=true;this.emit('progress',response);break;case /^1[0-9]{2}$/.test(response.status_code):// Do nothing with 1xx responses without To tag.
  if(!response.to_tag){this.logger.warn('1xx response received without to tag');break;}// Create Early Dialog if 1XX comes with contact
  if(response.hasHeader('contact')){// An error on dialog creation will fire 'failed' event
  if(!this.createDialog(response,'UAC',true)){break;}}this.status=C.STATUS_1XX_RECEIVED;if(response.hasHeader('P-Asserted-Identity')){this.assertedIdentity=new SIP.NameAddrHeader.parse(response.getHeader('P-Asserted-Identity'));}if(response.hasHeader('require')&&response.getHeader('require').indexOf('100rel')!==-1){// Do nothing if this.dialog is already confirmed
  if(this.dialog||!this.earlyDialogs[id]){break;}if(this.earlyDialogs[id].pracked.indexOf(response.getHeader('rseq'))!==-1||this.earlyDialogs[id].pracked[this.earlyDialogs[id].pracked.length-1]>=response.getHeader('rseq')&&this.earlyDialogs[id].pracked.length>0){return;}// TODO: This may be broken. It may have to be on the early dialog
  this.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions);this.emit('SessionDescriptionHandler-created',this.sessionDescriptionHandler);if(!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))){extraHeaders.push('RAck: '+response.getHeader('rseq')+' '+response.getHeader('cseq'));this.earlyDialogs[id].pracked.push(response.getHeader('rseq'));this.earlyDialogs[id].sendRequest(this,SIP.C.PRACK,{extraHeaders:extraHeaders});this.emit('progress',response);}else if(this.hasOffer){if(!this.createDialog(response,'UAC')){break;}this.hasAnswer=true;this.dialog.pracked.push(response.getHeader('rseq'));this.sessionDescriptionHandler.setDescription(response.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function onSuccess(){extraHeaders.push('RAck: '+response.getHeader('rseq')+' '+response.getHeader('cseq'));session.sendRequest(SIP.C.PRACK,{extraHeaders:extraHeaders,receiveResponse:function receiveResponse(){}});session.status=C.STATUS_EARLY_MEDIA;session.emit('progress',response);},function onFailure(e){session.logger.warn(e);session.acceptAndTerminate(response,488,'Not Acceptable Here');session.failed(response,SIP.C.causes.BAD_MEDIA_DESCRIPTION);});}else {var earlyDialog=this.earlyDialogs[id];var earlyMedia=earlyDialog.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions);this.emit('SessionDescriptionHandler-created',earlyMedia);earlyDialog.pracked.push(response.getHeader('rseq'));earlyMedia.setDescription(response.body,session.sessionDescriptionHandlerOptions,session.modifers).then(earlyMedia.getDescription.bind(earlyMedia,session.sessionDescriptionHandlerOptions,session.modifiers)).then(function onSuccess(description){extraHeaders.push('RAck: '+response.getHeader('rseq')+' '+response.getHeader('cseq'));earlyDialog.sendRequest(session,SIP.C.PRACK,{extraHeaders:extraHeaders,body:description});session.status=C.STATUS_EARLY_MEDIA;session.emit('progress',response);})["catch"](function onFailure(e){// TODO: This is a bit wonky
  if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){earlyDialog.pracked.push(response.getHeader('rseq'));if(session.status===C.STATUS_TERMINATED){return;}session.failed(null,SIP.C.causes.WEBRTC_ERROR);session.terminated(null,SIP.C.causes.WEBRTC_ERROR);}else {earlyDialog.pracked.splice(earlyDialog.pracked.indexOf(response.getHeader('rseq')),1);// Could not set remote description
  session.logger.warn('invalid description');session.logger.warn(e);}});}}else {this.emit('progress',response);}break;case /^2[0-9]{2}$/.test(response.status_code):var cseq=this.request.cseq+' '+this.request.method;if(cseq!==response.getHeader('cseq')){break;}if(response.hasHeader('P-Asserted-Identity')){this.assertedIdentity=new SIP.NameAddrHeader.parse(response.getHeader('P-Asserted-Identity'));}if(this.status===C.STATUS_EARLY_MEDIA&&this.dialog){this.status=C.STATUS_CONFIRMED;options={};if(this.renderbody){extraHeaders.push('Content-Type: '+this.rendertype);options.extraHeaders=extraHeaders;options.body=this.renderbody;}this.emit("ack",response.transaction.sendACK(options));this.accepted(response);break;}// Do nothing if this.dialog is already confirmed
  if(this.dialog){break;}// This is an invite without sdp
  if(!this.hasOffer){if(this.earlyDialogs[id]&&this.earlyDialogs[id].sessionDescriptionHandler){//REVISIT
  this.hasOffer=true;this.hasAnswer=true;this.sessionDescriptionHandler=this.earlyDialogs[id].sessionDescriptionHandler;if(!this.createDialog(response,'UAC')){break;}this.status=C.STATUS_CONFIRMED;this.emit("ack",response.transaction.sendACK());this.accepted(response);}else {this.sessionDescriptionHandler=this.sessionDescriptionHandlerFactory(this,this.sessionDescriptionHandlerFactoryOptions);this.emit('SessionDescriptionHandler-created',this.sessionDescriptionHandler);if(!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))){this.acceptAndTerminate(response,400,'Missing session description');this.failed(response,SIP.C.causes.BAD_MEDIA_DESCRIPTION);break;}if(!this.createDialog(response,'UAC')){break;}this.hasOffer=true;this.sessionDescriptionHandler.setDescription(response.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(this.sessionDescriptionHandler.getDescription.bind(this.sessionDescriptionHandler,this.sessionDescriptionHandlerOptions,this.modifiers)).then(function onSuccess(description){//var localMedia;
  if(session.isCanceled||session.status===C.STATUS_TERMINATED){return;}session.status=C.STATUS_CONFIRMED;session.hasAnswer=true;session.emit("ack",response.transaction.sendACK({body:description}));session.accepted(response);})["catch"](function onFailure(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){session.logger.warn('invalid description');session.logger.warn(e);// TODO: This message is inconsistent
  session.acceptAndTerminate(response,488,'Invalid session description');session.failed(response,SIP.C.causes.BAD_MEDIA_DESCRIPTION);}});}}else if(this.hasAnswer){if(this.renderbody){extraHeaders.push('Content-Type: '+session.rendertype);options.extraHeaders=extraHeaders;options.body=this.renderbody;}this.emit("ack",response.transaction.sendACK(options));}else {if(!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))){this.acceptAndTerminate(response,400,'Missing session description');this.failed(response,SIP.C.causes.BAD_MEDIA_DESCRIPTION);break;}if(!this.createDialog(response,'UAC')){break;}this.hasAnswer=true;this.sessionDescriptionHandler.setDescription(response.body,this.sessionDescriptionHandlerOptions,this.modifiers).then(function onSuccess(){var options={};session.status=C.STATUS_CONFIRMED;if(session.renderbody){extraHeaders.push('Content-Type: '+session.rendertype);options.extraHeaders=extraHeaders;options.body=session.renderbody;}session.emit("ack",response.transaction.sendACK(options));session.accepted(response);},function onFailure(e){session.logger.warn(e);session.acceptAndTerminate(response,488,'Not Acceptable Here');session.failed(response,SIP.C.causes.BAD_MEDIA_DESCRIPTION);});}break;default:cause=SIP.Utils.sipErrorCause(response.status_code);this.rejected(response,cause);this.failed(response,cause);this.terminated(response,cause);}}},cancel:{writable:true,value:function value(options){options=options||{};options.extraHeaders=(options.extraHeaders||[]).slice();if(this.isCanceled){throw new SIP.Exceptions.InvalidStateError('CANCELED');}// Check Session Status
  if(this.status===C.STATUS_TERMINATED||this.status===C.STATUS_CONFIRMED){throw new SIP.Exceptions.InvalidStateError(this.status);}this.logger.log('canceling RTCSession');this.isCanceled=true;var cancel_reason=SIP.Utils.getCancelReason(options.status_code,options.reason_phrase);// Check Session Status
  if(this.status===C.STATUS_NULL||this.status===C.STATUS_INVITE_SENT&&!this.received_100){this.cancelReason=cancel_reason;}else if(this.status===C.STATUS_INVITE_SENT||this.status===C.STATUS_1XX_RECEIVED||this.status===C.STATUS_EARLY_MEDIA){this.request.cancel(cancel_reason,options.extraHeaders);}return this.canceled();}},terminate:{writable:true,value:function value(options){if(this.status===C.STATUS_TERMINATED){return this;}if(this.status===C.STATUS_WAITING_FOR_ACK||this.status===C.STATUS_CONFIRMED){this.bye(options);}else {this.cancel(options);}return this;}},receiveRequest:{writable:true,value:function value(request){// ICC RECEIVE REQUEST
  // Reject CANCELs
  if(request.method===SIP.C.CANCEL);if(request.method===SIP.C.ACK&&this.status===C.STATUS_WAITING_FOR_ACK){SIP.Timers.clearTimeout(this.timers.ackTimer);SIP.Timers.clearTimeout(this.timers.invite2xxTimer);this.status=C.STATUS_CONFIRMED;this.accepted();}return Session.prototype.receiveRequest.apply(this,[request]);}},onTransportError:{writable:true,value:function value(){if(this.status!==C.STATUS_CONFIRMED&&this.status!==C.STATUS_TERMINATED){this.failed(null,SIP.C.causes.CONNECTION_ERROR);}}},onRequestTimeout:{writable:true,value:function value(){if(this.status===C.STATUS_CONFIRMED){this.terminated(null,SIP.C.causes.REQUEST_TIMEOUT);}else if(this.status!==C.STATUS_TERMINATED){this.failed(null,SIP.C.causes.REQUEST_TIMEOUT);this.terminated(null,SIP.C.causes.REQUEST_TIMEOUT);}}}});SIP.InviteClientContext=InviteClientContext;ReferClientContext=function ReferClientContext(ua,applicant,target,options){this.options=options||{};this.extraHeaders=(this.options.extraHeaders||[]).slice();if(ua===undefined||applicant===undefined||target===undefined){throw new TypeError('Not enough arguments');}SIP.Utils.augment(this,SIP.ClientContext,[ua,SIP.C.REFER,applicant.remoteIdentity.uri.toString(),options]);this.applicant=applicant;var withReplaces=target instanceof SIP.InviteServerContext||target instanceof SIP.InviteClientContext;if(withReplaces){// Attended Transfer
  // All of these fields should be defined based on the check above
  this.target='"'+target.remoteIdentity.friendlyName+'" '+'<'+target.dialog.remote_target.toString()+'?Replaces='+target.dialog.id.call_id+'%3Bto-tag%3D'+target.dialog.id.remote_tag+'%3Bfrom-tag%3D'+target.dialog.id.local_tag+'>';}else {// Blind Transfer
  // Refer-To: <sip:bob@example.com>
  try{this.target=SIP.Grammar.parse(target,'Refer_To').uri||target;}catch(e){this.logger.debug(".refer() cannot parse Refer_To from",target);this.logger.debug("...falling through to normalizeTarget()");}// Check target validity
  this.target=this.ua.normalizeTarget(this.target);if(!this.target){throw new TypeError('Invalid target: '+target);}}if(this.ua){this.extraHeaders.push('Referred-By: <'+this.ua.configuration.uri+'>');}// TODO: Check that this is correct isc/icc
  this.extraHeaders.push('Contact: '+applicant.contact);this.extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());this.extraHeaders.push('Refer-To: '+this.target);this.errorListener=this.onTransportError.bind(this);ua.transport.on('transportError',this.errorListener);};ReferClientContext.prototype=Object.create({},{refer:{writable:true,value:function value(options){options=options||{};var extraHeaders=(this.extraHeaders||[]).slice();if(options.extraHeaders){extraHeaders.concat(options.extraHeaders);}this.applicant.sendRequest(SIP.C.REFER,{extraHeaders:this.extraHeaders,receiveResponse:function(response){if(/^1[0-9]{2}$/.test(response.status_code)){this.emit('referRequestProgress',this);}else if(/^2[0-9]{2}$/.test(response.status_code)){this.emit('referRequestAccepted',this);}else if(/^[4-6][0-9]{2}$/.test(response.status_code)){this.emit('referRequestRejected',this);}if(options.receiveResponse){options.receiveResponse(response);}}.bind(this)});return this;}},receiveNotify:{writable:true,value:function value(request){// If we can correctly handle this, then we need to send a 200 OK!
  if(request.hasHeader('Content-Type')&&request.getHeader('Content-Type').search(/^message\/sipfrag/)!==-1){var messageBody=SIP.Grammar.parse(request.body,'sipfrag');if(messageBody===-1){request.reply(489,'Bad Event');return;}switch(true){case /^1[0-9]{2}$/.test(messageBody.status_code):this.emit('referProgress',this);break;case /^2[0-9]{2}$/.test(messageBody.status_code):this.emit('referAccepted',this);if(!this.options.activeAfterTransfer&&this.applicant.terminate){this.applicant.terminate();}break;default:this.emit('referRejected',this);break;}request.reply(200);this.emit('notify',request);return;}request.reply(489,'Bad Event');}}});SIP.ReferClientContext=ReferClientContext;ReferServerContext=function ReferServerContext(ua,request){SIP.Utils.augment(this,SIP.ServerContext,[ua,request]);this.ua=ua;this.status=C.STATUS_INVITE_RECEIVED;this.from_tag=request.from_tag;this.id=request.call_id+this.from_tag;this.request=request;this.contact=this.ua.contact.toString();this.logger=ua.getLogger('sip.referservercontext',this.id);// RFC 3515 2.4.1
  if(!this.request.hasHeader('refer-to')){this.logger.warn('Invalid REFER packet. A refer-to header is required. Rejecting refer.');this.reject();return;}this.referTo=this.request.parseHeader('refer-to');// TODO: Must set expiration timer and send 202 if there is no response by then
  this.referredSession=this.ua.findSession(request);// Needed to send the NOTIFY's
  this.cseq=Math.floor(Math.random()*10000);this.call_id=this.request.call_id;this.from_uri=this.request.to.uri;this.from_tag=this.request.to.parameters.tag;this.remote_target=this.request.headers.Contact[0].parsed.uri;this.to_uri=this.request.from.uri;this.to_tag=this.request.from_tag;this.route_set=this.request.getHeaders('record-route');this.receiveNonInviteResponse=function(){};if(this.request.hasHeader('referred-by')){this.referredBy=this.request.getHeader('referred-by');}if(this.referTo.uri.hasHeader('replaces')){this.replaces=this.referTo.uri.getHeader('replaces');}this.errorListener=this.onTransportError.bind(this);ua.transport.on('transportError',this.errorListener);this.status=C.STATUS_WAITING_FOR_ANSWER;};ReferServerContext.prototype=Object.create({},{progress:{writable:true,value:function value(){if(this.status!==C.STATUS_WAITING_FOR_ANSWER){throw new SIP.Exceptions.InvalidStateError(this.status);}this.request.reply(100);}},reject:{writable:true,value:function value(options){if(this.status===C.STATUS_TERMINATED){throw new SIP.Exceptions.InvalidStateError(this.status);}this.logger.log('Rejecting refer');this.status=C.STATUS_TERMINATED;SIP.ServerContext.prototype.reject.call(this,options);this.emit('referRequestRejected',this);}},accept:{writable:true,value:function value(options,modifiers){options=options||{};if(this.status===C.STATUS_WAITING_FOR_ANSWER){this.status=C.STATUS_ANSWERED;}else {throw new SIP.Exceptions.InvalidStateError(this.status);}this.request.reply(202,'Accepted');this.emit('referRequestAccepted',this);if(options.followRefer){this.logger.log('Accepted refer, attempting to automatically follow it');var target=this.referTo.uri;if(!target.scheme.match("^sips?$")){this.logger.error('SIP.js can only automatically follow SIP refer target');this.reject();return;}var inviteOptions=options.inviteOptions||{};var extraHeaders=(inviteOptions.extraHeaders||[]).slice();if(this.replaces){// decodeURIComponent is a holdover from 2c086eb4. Not sure that it is actually necessary
  extraHeaders.push('Replaces: '+decodeURIComponent(this.replaces));}if(this.referredBy){extraHeaders.push('Referred-By: '+this.referredBy);}inviteOptions.extraHeaders=extraHeaders;target.clearHeaders();this.targetSession=this.ua.invite(target,inviteOptions,modifiers);this.emit('referInviteSent',this);this.targetSession.once('progress',function(){this.sendNotify('SIP/2.0 100 Trying');this.emit('referProgress',this);if(this.referredSession){this.referredSession.emit('referProgress',this);}}.bind(this));this.targetSession.once('accepted',function(){this.logger.log('Successfully followed the refer');this.sendNotify('SIP/2.0 200 OK');this.emit('referAccepted',this);if(this.referredSession){this.referredSession.emit('referAccepted',this);}}.bind(this));var referFailed=function referFailed(response){if(this.status===C.STATUS_TERMINATED){return;// No throw here because it is possible this gets called multiple times
  }this.logger.log('Refer was not successful. Resuming session');if(response&&response.status_code===429){this.logger.log('Alerting referrer that identity is required.');this.sendNotify('SIP/2.0 429 Provide Referrer Identity');return;}this.sendNotify('SIP/2.0 603 Declined');// Must change the status after sending the final Notify or it will not send due to check
  this.status=C.STATUS_TERMINATED;this.emit('referRejected',this);if(this.referredSession){this.referredSession.emit('referRejected');}};this.targetSession.once('rejected',referFailed.bind(this));this.targetSession.once('failed',referFailed.bind(this));}else {this.logger.log('Accepted refer, but did not automatically follow it');this.sendNotify('SIP/2.0 200 OK');this.emit('referAccepted',this);if(this.referredSession){this.referredSession.emit('referAccepted',this);}}}},sendNotify:{writable:true,value:function value(body){if(this.status!==C.STATUS_ANSWERED){throw new SIP.Exceptions.InvalidStateError(this.status);}if(SIP.Grammar.parse(body,'sipfrag')===-1){throw new Error('sipfrag body is required to send notify for refer');}var request=new SIP.OutgoingRequest(SIP.C.NOTIFY,this.remote_target,this.ua,{cseq:this.cseq+=1,call_id:this.call_id,from_uri:this.from_uri,from_tag:this.from_tag,to_uri:this.to_uri,to_tag:this.to_tag,route_set:this.route_set},['Event: refer','Subscription-State: terminated','Content-Type: message/sipfrag'],body);new SIP.RequestSender({request:request,onRequestTimeout:function onRequestTimeout(){return;},onTransportError:function onTransportError(){return;},receiveResponse:function receiveResponse(){return;}},this.ua).send();}}});SIP.ReferServerContext=ReferServerContext;};/***/},/* 24 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview DTMF
   */ /**
   * @class DTMF
   * @param {SIP.Session} session
   */module.exports=function(SIP){var _DTMF,C={MIN_DURATION:70,MAX_DURATION:6000,DEFAULT_DURATION:100,MIN_INTER_TONE_GAP:50,DEFAULT_INTER_TONE_GAP:500};_DTMF=function DTMF(session,tone,options){var duration,interToneGap;if(tone===undefined){throw new TypeError('Not enough arguments');}this.logger=session.ua.getLogger('sip.invitecontext.dtmf',session.id);this.owner=session;this.direction=null;options=options||{};duration=options.duration||null;interToneGap=options.interToneGap||null;// Check tone type
  if(typeof tone==='string'){tone=tone.toUpperCase();}else if(typeof tone==='number'){tone=tone.toString();}else {throw new TypeError('Invalid tone: '+tone);}// Check tone value
  if(!tone.match(/^[0-9A-D#*]$/)){throw new TypeError('Invalid tone: '+tone);}else {this.tone=tone;}// Check duration
  if(duration&&!SIP.Utils.isDecimal(duration)){throw new TypeError('Invalid tone duration: '+duration);}else if(!duration){duration=_DTMF.C.DEFAULT_DURATION;}else if(duration<_DTMF.C.MIN_DURATION){this.logger.warn('"duration" value is lower than the minimum allowed, setting it to '+_DTMF.C.MIN_DURATION+' milliseconds');duration=_DTMF.C.MIN_DURATION;}else if(duration>_DTMF.C.MAX_DURATION){this.logger.warn('"duration" value is greater than the maximum allowed, setting it to '+_DTMF.C.MAX_DURATION+' milliseconds');duration=_DTMF.C.MAX_DURATION;}else {duration=Math.abs(duration);}this.duration=duration;// Check interToneGap
  if(interToneGap&&!SIP.Utils.isDecimal(interToneGap)){throw new TypeError('Invalid interToneGap: '+interToneGap);}else if(!interToneGap){interToneGap=_DTMF.C.DEFAULT_INTER_TONE_GAP;}else if(interToneGap<_DTMF.C.MIN_INTER_TONE_GAP){this.logger.warn('"interToneGap" value is lower than the minimum allowed, setting it to '+_DTMF.C.MIN_INTER_TONE_GAP+' milliseconds');interToneGap=_DTMF.C.MIN_INTER_TONE_GAP;}else {interToneGap=Math.abs(interToneGap);}this.interToneGap=interToneGap;};_DTMF.prototype=Object.create(SIP.EventEmitter.prototype);_DTMF.prototype.send=function(options){var extraHeaders,body={};this.direction='outgoing';// Check RTCSession Status
  if(this.owner.status!==SIP.Session.C.STATUS_CONFIRMED&&this.owner.status!==SIP.Session.C.STATUS_WAITING_FOR_ACK){throw new SIP.Exceptions.InvalidStateError(this.owner.status);}// Get DTMF options
  options=options||{};extraHeaders=options.extraHeaders?options.extraHeaders.slice():[];body.contentType='application/dtmf-relay';body.body="Signal= "+this.tone+"\r\n";body.body+="Duration= "+this.duration;this.request=this.owner.dialog.sendRequest(this,SIP.C.INFO,{extraHeaders:extraHeaders,body:body});this.owner.emit('dtmf',this.request,this);};/**
       * @private
       */_DTMF.prototype.receiveResponse=function(response){var cause;switch(true){case /^1[0-9]{2}$/.test(response.status_code):// Ignore provisional responses.
  break;case /^2[0-9]{2}$/.test(response.status_code):this.emit('succeeded',{originator:'remote',response:response});break;default:cause=SIP.Utils.sipErrorCause(response.status_code);this.emit('failed',response,cause);break;}};/**
       * @private
       */_DTMF.prototype.onRequestTimeout=function(){this.emit('failed',null,SIP.C.causes.REQUEST_TIMEOUT);this.owner.onRequestTimeout();};/**
       * @private
       */_DTMF.prototype.onTransportError=function(){this.emit('failed',null,SIP.C.causes.CONNECTION_ERROR);this.owner.onTransportError();};/**
       * @private
       */_DTMF.prototype.onDialogError=function(response){this.emit('failed',response,SIP.C.causes.DIALOG_ERROR);this.owner.onDialogError(response);};/**
       * @private
       */_DTMF.prototype.init_incoming=function(request){this.direction='incoming';this.request=request;request.reply(200);if(!this.tone||!this.duration){this.logger.warn('invalid INFO DTMF received, discarded');}else {this.owner.emit('dtmf',request,this);}};_DTMF.C=C;return _DTMF;};/***/},/* 25 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Subscriber (SIP-Specific Event Notifications RFC6665)
   */ /**
   * @augments SIP
   * @class Class creating a SIP Subscription.
   */module.exports=function(SIP){SIP.Subscription=function(ua,target,event,options){options=Object.create(options||Object.prototype);this.extraHeaders=options.extraHeaders=(options.extraHeaders||[]).slice();this.id=null;this.state='init';if(!event){throw new TypeError('Event necessary to create a subscription.');}else {//TODO: check for valid events here probably make a list in SIP.C; or leave it up to app to check?
  //The check may need to/should probably occur on the other side,
  this.event=event;}if(typeof options.expires!=='number'){ua.logger.warn('expires must be a number. Using default of 3600.');this.expires=3600;}else {this.expires=options.expires;}this.requestedExpires=this.expires;options.extraHeaders.push('Event: '+this.event);options.extraHeaders.push('Expires: '+this.expires);if(options.body){this.body=options.body;}this.contact=ua.contact.toString();options.extraHeaders.push('Contact: '+this.contact);options.extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());SIP.Utils.augment(this,SIP.ClientContext,[ua,SIP.C.SUBSCRIBE,target,options]);this.logger=ua.getLogger('sip.subscription');this.dialog=null;this.timers={N:null,sub_duration:null};this.errorCodes=[404,405,410,416,480,481,482,483,484,485,489,501,604];};SIP.Subscription.prototype={subscribe:function subscribe(){var sub=this;//these states point to an existing subscription, no subscribe is necessary
  if(this.state==='active'){this.refresh();return this;}else if(this.state==='notify_wait'){return this;}SIP.Timers.clearTimeout(this.timers.sub_duration);SIP.Timers.clearTimeout(this.timers.N);this.timers.N=SIP.Timers.setTimeout(sub.timer_fire.bind(sub),SIP.Timers.TIMER_N);this.ua.earlySubscriptions[this.request.call_id+this.request.from.parameters.tag+this.event]=this;this.send();this.state='notify_wait';return this;},refresh:function refresh(){if(this.state==='terminated'||this.state==='pending'||this.state==='notify_wait'){return;}this.dialog.sendRequest(this,SIP.C.SUBSCRIBE,{extraHeaders:this.extraHeaders,body:this.body});},receiveResponse:function receiveResponse(response){var expires,sub=this,cause=SIP.Utils.getReasonPhrase(response.status_code);if(this.state==='notify_wait'&&response.status_code>=300||this.state!=='notify_wait'&&this.errorCodes.indexOf(response.status_code)!==-1){this.failed(response,null);}else if(/^2[0-9]{2}$/.test(response.status_code)){this.emit('accepted',response,cause);//As we don't support RFC 5839 or other extensions where the NOTIFY is optional, timer N will not be cleared
  //SIP.Timers.clearTimeout(this.timers.N);
  expires=response.getHeader('Expires');if(expires&&expires<=this.requestedExpires){// Preserve new expires value for subsequent requests
  this.expires=expires;this.timers.sub_duration=SIP.Timers.setTimeout(sub.refresh.bind(sub),expires*900);}else {if(!expires){this.logger.warn('Expires header missing in a 200-class response to SUBSCRIBE');this.failed(response,SIP.C.EXPIRES_HEADER_MISSING);}else {this.logger.warn('Expires header in a 200-class response to SUBSCRIBE with a higher value than the one in the request');this.failed(response,SIP.C.INVALID_EXPIRES_HEADER);}}}else if(response.statusCode>300){this.emit('failed',response,cause);this.emit('rejected',response,cause);}},unsubscribe:function unsubscribe(){var extraHeaders=[],sub=this;this.state='terminated';extraHeaders.push('Event: '+this.event);extraHeaders.push('Expires: 0');extraHeaders.push('Contact: '+this.contact);extraHeaders.push('Allow: '+SIP.UA.C.ALLOWED_METHODS.toString());//makes sure expires isn't set, and other typical resubscribe behavior
  this.receiveResponse=function(){};this.dialog.sendRequest(this,this.method,{extraHeaders:extraHeaders,body:this.body});SIP.Timers.clearTimeout(this.timers.sub_duration);SIP.Timers.clearTimeout(this.timers.N);this.timers.N=SIP.Timers.setTimeout(sub.timer_fire.bind(sub),SIP.Timers.TIMER_N);},/**
          * @private
          */timer_fire:function timer_fire(){if(this.state==='terminated'){this.terminateDialog();SIP.Timers.clearTimeout(this.timers.N);SIP.Timers.clearTimeout(this.timers.sub_duration);delete this.ua.subscriptions[this.id];}else if(this.state==='notify_wait'||this.state==='pending'){this.close();}else {this.refresh();}},/**
          * @private
          */close:function close(){if(this.state==='notify_wait'){this.state='terminated';SIP.Timers.clearTimeout(this.timers.N);SIP.Timers.clearTimeout(this.timers.sub_duration);this.receiveResponse=function(){};delete this.ua.earlySubscriptions[this.request.call_id+this.request.from.parameters.tag+this.event];}else if(this.state!=='terminated'){this.unsubscribe();}},/**
          * @private
          */createConfirmedDialog:function createConfirmedDialog(message,type){var dialog;this.terminateDialog();dialog=new SIP.Dialog(this,message,type);dialog.invite_seqnum=this.request.cseq;dialog.local_seqnum=this.request.cseq;if(!dialog.error){this.dialog=dialog;return true;}// Dialog not created due to an error
  else {return false;}},/**
          * @private
          */terminateDialog:function terminateDialog(){if(this.dialog){delete this.ua.subscriptions[this.id];this.dialog.terminate();delete this.dialog;}},/**
          * @private
          */receiveRequest:function receiveRequest(request){var sub_state,sub=this;function setExpiresTimeout(){if(sub_state.expires){SIP.Timers.clearTimeout(sub.timers.sub_duration);sub_state.expires=Math.min(sub.expires,Math.max(sub_state.expires,0));sub.timers.sub_duration=SIP.Timers.setTimeout(sub.refresh.bind(sub),sub_state.expires*900);}}if(!this.matchEvent(request)){//checks event and subscription_state headers
  request.reply(489);return;}if(!this.dialog){if(this.createConfirmedDialog(request,'UAS')){this.id=this.dialog.id.toString();delete this.ua.earlySubscriptions[this.request.call_id+this.request.from.parameters.tag+this.event];this.ua.subscriptions[this.id]=this;// UPDATE ROUTE SET TO BE BACKWARDS COMPATIBLE?
  }}sub_state=request.parseHeader('Subscription-State');request.reply(200,SIP.C.REASON_200);SIP.Timers.clearTimeout(this.timers.N);this.emit('notify',{request:request});// if we've set state to terminated, no further processing should take place
  // and we are only interested in cleaning up after the appropriate NOTIFY
  if(this.state==='terminated'){if(sub_state.state==='terminated'){this.terminateDialog();SIP.Timers.clearTimeout(this.timers.N);SIP.Timers.clearTimeout(this.timers.sub_duration);delete this.ua.subscriptions[this.id];}return;}switch(sub_state.state){case'active':this.state='active';setExpiresTimeout();break;case'pending':if(this.state==='notify_wait'){setExpiresTimeout();}this.state='pending';break;case'terminated':SIP.Timers.clearTimeout(this.timers.sub_duration);if(sub_state.reason){this.logger.log('terminating subscription with reason '+sub_state.reason);switch(sub_state.reason){case'deactivated':case'timeout':this.subscribe();return;case'probation':case'giveup':if(sub_state.params&&sub_state.params['retry-after']){this.timers.sub_duration=SIP.Timers.setTimeout(sub.subscribe.bind(sub),sub_state.params['retry-after']);}else {this.subscribe();}return;}}this.close();break;}},failed:function failed(response,cause){this.close();this.emit('failed',response,cause);this.emit('rejected',response,cause);return this;},onDialogError:function onDialogError(response){this.failed(response,SIP.C.causes.DIALOG_ERROR);},/**
          * @private
          */matchEvent:function matchEvent(request){var event;// Check mandatory header Event
  if(!request.hasHeader('Event')){this.logger.warn('missing Event header');return false;}// Check mandatory header Subscription-State
  if(!request.hasHeader('Subscription-State')){this.logger.warn('missing Subscription-State header');return false;}// Check whether the event in NOTIFY matches the event in SUBSCRIBE
  event=request.parseHeader('event').event;if(this.event!==event){this.logger.warn('event match failed');request.reply(481,'Event Match Failed');return false;}else {return true;}}};};/***/},/* 26 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview SIP Publish (SIP Extension for Event State Publication RFC3903)
   */ /**
   * @augments SIP
   * @class Class creating a SIP PublishContext.
   */module.exports=function(SIP){var PublishContext;PublishContext=function PublishContext(ua,target,event,options){this.options=options=options||{};this.options.extraHeaders=(options.extraHeaders||[]).slice();this.options.contentType=options.contentType||'text/plain';if(typeof options.expires!=='number'||options.expires%1!==0){this.options.expires=3600;}else {this.options.expires=Number(options.expires);}if(typeof options.unpublishOnClose!=="boolean"){this.options.unpublishOnClose=true;}else {this.options.unpublishOnClose=options.unpublishOnClose;}if(target===undefined||target===null||target===''){throw new SIP.Exceptions.MethodParameterError('Publish','Target',target);}else {this.target=ua.normalizeTarget(target);}if(event===undefined||event===null||event===''){throw new SIP.Exceptions.MethodParameterError('Publish','Event',event);}else {this.event=event;}// Call parent constructor
  SIP.ClientContext.call(this,ua,SIP.C.PUBLISH,this.target,this.options);this.logger=this.ua.getLogger('sip.publish');this.pubRequestBody=null;this.pubRequestExpires=this.options.expires;this.pubRequestEtag=null;this.publish_refresh_timer=null;ua.on('transportCreated',function(transport){transport.on('transportError',this.onTransportError.bind(this));}.bind(this));};// Extend ClientContext
  PublishContext.prototype=Object.create(SIP.ClientContext.prototype);// Restore the class constructor
  PublishContext.prototype.constructor=PublishContext;/**
       * Publish
       *
       * @param {string} Event body to publish, optional
       *
       */PublishContext.prototype.publish=function(body){// Clean up before the run
  this.request=null;SIP.Timers.clearTimeout(this.publish_refresh_timer);if(body!==undefined&&body!==null&&body!==''){// is Inital or Modify request
  this.options.body=body;this.pubRequestBody=this.options.body;if(this.pubRequestExpires===0){// This is Initial request after unpublish
  this.pubRequestExpires=this.options.expires;this.pubRequestEtag=null;}if(!this.ua.publishers[this.target.toString()+':'+this.event]){this.ua.publishers[this.target.toString()+':'+this.event]=this;}}else {// This is Refresh request
  this.pubRequestBody=null;if(this.pubRequestEtag===null){//Request not valid
  throw new SIP.Exceptions.MethodParameterError('Publish','Body',body);}if(this.pubRequestExpires===0){//Request not valid
  throw new SIP.Exceptions.MethodParameterError('Publish','Expire',this.pubRequestExpires);}}this.sendPublishRequest();};/**
       * Unpublish
       *
       */PublishContext.prototype.unpublish=function(){// Clean up before the run
  this.request=null;SIP.Timers.clearTimeout(this.publish_refresh_timer);this.pubRequestBody=null;this.pubRequestExpires=0;if(this.pubRequestEtag!==null){this.sendPublishRequest();}};/**
       * Close
       *
       */PublishContext.prototype.close=function(){// Send unpublish, if requested
  if(this.options.unpublishOnClose){this.unpublish();}else {this.request=null;SIP.Timers.clearTimeout(this.publish_refresh_timer);this.pubRequestBody=null;this.pubRequestExpires=0;this.pubRequestEtag=null;}if(this.ua.publishers[this.target.toString()+':'+this.event]){delete this.ua.publishers[this.target.toString()+':'+this.event];}};/**
       * @private
       *
       */PublishContext.prototype.sendPublishRequest=function(){var reqOptions;reqOptions=Object.create(this.options||Object.prototype);reqOptions.extraHeaders=(this.options.extraHeaders||[]).slice();reqOptions.extraHeaders.push('Event: '+this.event);reqOptions.extraHeaders.push('Expires: '+this.pubRequestExpires);if(this.pubRequestEtag!==null){reqOptions.extraHeaders.push('SIP-If-Match: '+this.pubRequestEtag);}this.request=new SIP.OutgoingRequest(SIP.C.PUBLISH,this.target,this.ua,this.options.params,reqOptions.extraHeaders);if(this.pubRequestBody!==null){this.request.body={};this.request.body.body=this.pubRequestBody;this.request.body.contentType=this.options.contentType;}this.send();};/**
       * @private
       *
       */PublishContext.prototype.receiveResponse=function(response){var expires,minExpires,cause=SIP.Utils.getReasonPhrase(response.status_code);switch(true){case /^1[0-9]{2}$/.test(response.status_code):this.emit('progress',response,cause);break;case /^2[0-9]{2}$/.test(response.status_code):// Set SIP-Etag
  if(response.hasHeader('SIP-ETag')){this.pubRequestEtag=response.getHeader('SIP-ETag');}else {this.logger.warn('SIP-ETag header missing in a 200-class response to PUBLISH');}// Update Expire
  if(response.hasHeader('Expires')){expires=Number(response.getHeader('Expires'));if(typeof expires==='number'&&expires>=0&&expires<=this.pubRequestExpires){this.pubRequestExpires=expires;}else {this.logger.warn('Bad Expires header in a 200-class response to PUBLISH');}}else {this.logger.warn('Expires header missing in a 200-class response to PUBLISH');}if(this.pubRequestExpires!==0){// Schedule refresh
  this.publish_refresh_timer=SIP.Timers.setTimeout(this.publish.bind(this),this.pubRequestExpires*900);this.emit('published',response,cause);}else {this.emit('unpublished',response,cause);}break;case /^412$/.test(response.status_code):// 412 code means no matching ETag - possibly the PUBLISH expired
  // Resubmit as new request, if the current request is not a "remove"
  if(this.pubRequestEtag!==null&&this.pubRequestExpires!==0){this.logger.warn('412 response to PUBLISH, recovering');this.pubRequestEtag=null;this.emit('progress',response,cause);this.publish(this.options.body);}else {this.logger.warn('412 response to PUBLISH, recovery failed');this.pubRequestExpires=0;this.emit('failed',response,cause);this.emit('unpublished',response,cause);}break;case /^423$/.test(response.status_code):// 423 code means we need to adjust the Expires interval up
  if(this.pubRequestExpires!==0&&response.hasHeader('Min-Expires')){minExpires=Number(response.getHeader('Min-Expires'));if(typeof minExpires==='number'||minExpires>this.pubRequestExpires){this.logger.warn('423 code in response to PUBLISH, adjusting the Expires value and trying to recover');this.pubRequestExpires=minExpires;this.emit('progress',response,cause);this.publish(this.options.body);}else {this.logger.warn('Bad 423 response Min-Expires header received for PUBLISH');this.pubRequestExpires=0;this.emit('failed',response,cause);this.emit('unpublished',response,cause);}}else {this.logger.warn('423 response to PUBLISH, recovery failed');this.pubRequestExpires=0;this.emit('failed',response,cause);this.emit('unpublished',response,cause);}break;default:this.pubRequestExpires=0;this.emit('failed',response,cause);this.emit('unpublished',response,cause);break;}// Do the cleanup
  if(this.pubRequestExpires===0){SIP.Timers.clearTimeout(this.publish_refresh_timer);this.pubRequestBody=null;this.pubRequestEtag=null;}};PublishContext.prototype.onRequestTimeout=function(){SIP.ClientContext.prototype.onRequestTimeout.call(this);this.emit('unpublished',null,SIP.C.causes.REQUEST_TIMEOUT);};PublishContext.prototype.onTransportError=function(){SIP.ClientContext.prototype.onTransportError.call(this);this.emit('unpublished',null,SIP.C.causes.CONNECTION_ERROR);};SIP.PublishContext=PublishContext;};/***/},/* 27 */ /***/function(module,exports,__webpack_require__){/* WEBPACK VAR INJECTION */(function(global){/**
   * @augments SIP
   * @class Class creating a SIP User Agent.
   * @param {function returning SIP.sessionDescriptionHandler} [configuration.sessionDescriptionHandlerFactory]
   *        A function will be invoked by each of the UA's Sessions to build the sessionDescriptionHandler for that Session.
   *        If no (or a falsy) value is provided, each Session will use a default (WebRTC) sessionDescriptionHandler.
   *
   * @param {Object} [configuration.media] gets passed to SIP.sessionDescriptionHandler.getDescription as mediaHint
   */module.exports=function(SIP,environment){var UA,C={// UA status codes
  STATUS_INIT:0,STATUS_STARTING:1,STATUS_READY:2,STATUS_USER_CLOSED:3,STATUS_NOT_READY:4,// UA error codes
  CONFIGURATION_ERROR:1,NETWORK_ERROR:2,ALLOWED_METHODS:['ACK','CANCEL','INVITE','MESSAGE','BYE','OPTIONS','INFO','NOTIFY','REFER'],ACCEPTED_BODY_TYPES:['application/sdp','application/dtmf-relay'],MAX_FORWARDS:70,TAG_LENGTH:10};UA=function UA(configuration){var self=this;// Helper function for forwarding events
  function selfEmit(type){//registrationFailed handler is invoked with two arguments. Allow event handlers to be invoked with a variable no. of arguments
  return self.emit.bind(self,type);}// Set Accepted Body Types
  C.ACCEPTED_BODY_TYPES=C.ACCEPTED_BODY_TYPES.toString();this.log=new SIP.LoggerFactory();this.logger=this.getLogger('sip.ua');this.cache={credentials:{}};this.configuration={};this.dialogs={};//User actions outside any session/dialog (MESSAGE)
  this.applicants={};this.data={};this.sessions={};this.subscriptions={};this.earlySubscriptions={};this.publishers={};this.transport=null;this.contact=null;this.status=C.STATUS_INIT;this.error=null;this.transactions={nist:{},nict:{},ist:{},ict:{}};Object.defineProperties(this,{transactionsCount:{get:function get(){var type,transactions=['nist','nict','ist','ict'],count=0;for(type in transactions){count+=Object.keys(this.transactions[transactions[type]]).length;}return count;}},nictTransactionsCount:{get:function get(){return Object.keys(this.transactions['nict']).length;}},nistTransactionsCount:{get:function get(){return Object.keys(this.transactions['nist']).length;}},ictTransactionsCount:{get:function get(){return Object.keys(this.transactions['ict']).length;}},istTransactionsCount:{get:function get(){return Object.keys(this.transactions['ist']).length;}}});/**
           * Load configuration
           *
           * @throws {SIP.Exceptions.ConfigurationError}
           * @throws {TypeError}
           */if(configuration===undefined){configuration={};}else if(typeof configuration==='string'||configuration instanceof String){configuration={uri:configuration};}// Apply log configuration if present
  if(configuration.log){if(configuration.log.hasOwnProperty('builtinEnabled')){this.log.builtinEnabled=configuration.log.builtinEnabled;}if(configuration.log.hasOwnProperty('level')){this.log.level=configuration.log.level;}if(configuration.log.hasOwnProperty('connector')){this.log.connector=configuration.log.connector;}}try{this.loadConfig(configuration);}catch(e){this.status=C.STATUS_NOT_READY;this.error=C.CONFIGURATION_ERROR;throw e;}// Initialize registerContext
  this.registerContext=new SIP.RegisterContext(this);this.registerContext.on('failed',selfEmit('registrationFailed'));this.registerContext.on('registered',selfEmit('registered'));this.registerContext.on('unregistered',selfEmit('unregistered'));if(this.configuration.autostart){this.start();}};UA.prototype=Object.create(SIP.EventEmitter.prototype);//=================
  //  High Level API
  //=================
  UA.prototype.register=function(options){this.configuration.register=true;this.registerContext.register(options);return this;};/**
       * Unregister.
       *
       * @param {Boolean} [all] unregister all user bindings.
       *
       */UA.prototype.unregister=function(options){this.configuration.register=false;var context=this.registerContext;this.transport.afterConnected(context.unregister.bind(context,options));return this;};UA.prototype.isRegistered=function(){return this.registerContext.registered;};/**
       * Make an outgoing call.
       *
       * @param {String} target
       * @param {Object} views
       * @param {Object} [options.media] gets passed to SIP.sessionDescriptionHandler.getDescription as mediaHint
       *
       * @throws {TypeError}
       *
       */UA.prototype.invite=function(target,options,modifiers){var context=new SIP.InviteClientContext(this,target,options,modifiers);// Delay sending actual invite until the next 'tick' if we are already
  // connected, so that API consumers can register to events fired by the
  // the session.
  this.transport.afterConnected(function(){context.invite();this.emit('inviteSent',context);}.bind(this));return context;};UA.prototype.subscribe=function(target,event,options){var sub=new SIP.Subscription(this,target,event,options);this.transport.afterConnected(sub.subscribe.bind(sub));return sub;};/**
       * Send PUBLISH Event State Publication (RFC3903)
       *
       * @param {String} target
       * @param {String} event
       * @param {String} body
       * @param {Object} [options]
       *
       * @throws {SIP.Exceptions.MethodParameterError}
       *
       */UA.prototype.publish=function(target,event,body,options){var pub=new SIP.PublishContext(this,target,event,options);this.transport.afterConnected(pub.publish.bind(pub,body));return pub;};/**
       * Send a message.
       *
       * @param {String} target
       * @param {String} body
       * @param {Object} [options]
       *
       * @throws {TypeError}
       *
       */UA.prototype.message=function(target,body,options){if(body===undefined){throw new TypeError('Not enough arguments');}// There is no Message module, so it is okay that the UA handles defaults here.
  options=Object.create(options||Object.prototype);options.contentType||(options.contentType='text/plain');options.body=body;return this.request(SIP.C.MESSAGE,target,options);};UA.prototype.request=function(method,target,options){var req=new SIP.ClientContext(this,method,target,options);this.transport.afterConnected(req.send.bind(req));return req;};/**
       * Gracefully close.
       *
       */UA.prototype.stop=function(){var session,subscription,applicant,publisher,ua=this;function transactionsListener(){if(ua.nistTransactionsCount===0&&ua.nictTransactionsCount===0){ua.removeListener('transactionDestroyed',transactionsListener);ua.transport.disconnect();}}this.logger.log('user requested closure...');if(this.status===C.STATUS_USER_CLOSED){this.logger.warn('UA already closed');return this;}// Close registerContext
  this.logger.log('closing registerContext');this.registerContext.close();// Run  _terminate_ on every Session
  for(session in this.sessions){this.logger.log('closing session '+session);this.sessions[session].terminate();}//Run _close_ on every confirmed Subscription
  for(subscription in this.subscriptions){this.logger.log('unsubscribing from subscription '+subscription);this.subscriptions[subscription].close();}//Run _close_ on every early Subscription
  for(subscription in this.earlySubscriptions){this.logger.log('unsubscribing from early subscription '+subscription);this.earlySubscriptions[subscription].close();}//Run _close_ on every Publisher
  for(publisher in this.publishers){this.logger.log('unpublish '+publisher);this.publishers[publisher].close();}// Run  _close_ on every applicant
  for(applicant in this.applicants){this.applicants[applicant].close();}this.status=C.STATUS_USER_CLOSED;/*
           * If the remaining transactions are all INVITE transactions, there is no need to
           * wait anymore because every session has already been closed by this method.
           * - locally originated sessions where terminated (CANCEL or BYE)
           * - remotely originated sessions where rejected (4XX) or terminated (BYE)
           * Remaining INVITE transactions belong tho sessions that where answered. This are in
           * 'accepted' state due to timers 'L' and 'M' defined in [RFC 6026]
           */if(this.nistTransactionsCount===0&&this.nictTransactionsCount===0){this.transport.disconnect();}else {this.on('transactionDestroyed',transactionsListener);}if(typeof environment.removeEventListener==='function'){// Google Chrome Packaged Apps don't allow 'unload' listeners:
  // unload is not available in packaged apps
  if(!(global.chrome&&global.chrome.app&&global.chrome.app.runtime)){environment.removeEventListener('unload',this.environListener);}}return this;};/**
       * Connect to the WS server if status = STATUS_INIT.
       * Resume UA after being closed.
       *
       */UA.prototype.start=function(){// var server;
  this.logger.log('user requested startup...');if(this.status===C.STATUS_INIT){this.status=C.STATUS_STARTING;if(!this.configuration.transportConstructor){throw new SIP.Exceptions.TransportError("Transport constructor not set");}this.transport=new this.configuration.transportConstructor(this.getLogger('sip.transport'),this.configuration.transportOptions);this.setTransportListeners();this.emit('transportCreated',this.transport);this.transport.connect();}else if(this.status===C.STATUS_USER_CLOSED){this.logger.log('resuming');this.status=C.STATUS_READY;this.transport.connect();}else if(this.status===C.STATUS_STARTING){this.logger.log('UA is in STARTING status, not opening new connection');}else if(this.status===C.STATUS_READY){this.logger.log('UA is in READY status, not resuming');}else {this.logger.error('Connection is down. Auto-Recovery system is trying to connect');}if(this.configuration.autostop&&typeof environment.addEventListener==='function'){// Google Chrome Packaged Apps don't allow 'unload' listeners:
  // unload is not available in packaged apps
  if(!(global.chrome&&global.chrome.app&&global.chrome.app.runtime)){this.environListener=this.stop.bind(this);environment.addEventListener('unload',this.environListener);}}return this;};/**
       * Normalize a string into a valid SIP request URI
       *
       * @param {String} target
       *
       * @returns {SIP.URI|undefined}
       */UA.prototype.normalizeTarget=function(target){return SIP.Utils.normalizeTarget(target,this.configuration.hostportParams);};//===============================
  //  Private (For internal use)
  //===============================
  UA.prototype.saveCredentials=function(credentials){this.cache.credentials[credentials.realm]=this.cache.credentials[credentials.realm]||{};this.cache.credentials[credentials.realm][credentials.uri]=credentials;return this;};UA.prototype.getCredentials=function(request){var realm,credentials;realm=request.ruri.host;if(this.cache.credentials[realm]&&this.cache.credentials[realm][request.ruri]){credentials=this.cache.credentials[realm][request.ruri];credentials.method=request.method;}return credentials;};UA.prototype.getLogger=function(category,label){return this.log.getLogger(category,label);};//==============================
  // Event Handlers
  //==============================
  UA.prototype.onTransportError=function(){if(this.status===C.STATUS_USER_CLOSED){return;}if(!this.error||this.error!==C.NETWORK_ERROR){this.status=C.STATUS_NOT_READY;this.error=C.NETWORK_ERROR;}};/**
       * Helper function. Sets transport listeners
       * @private
       */UA.prototype.setTransportListeners=function(){this.transport.on('connected',this.onTransportConnected.bind(this));this.transport.on('message',this.onTransportReceiveMsg.bind(this));this.transport.on('transportError',this.onTransportError.bind(this));};/**
       * Transport connection event.
       * @private
       * @event
       * @param {SIP.Transport} transport.
       */UA.prototype.onTransportConnected=function(){if(this.configuration.register){this.configuration.authenticationFactory.initialize().then(function(){this.registerContext.onTransportConnected();}.bind(this));}};/**
       * Transport message receipt event.
       * @private
       * @event
       * @param {String} message
       */UA.prototype.onTransportReceiveMsg=function(message){var transaction;message=SIP.Parser.parseMessage(message,this);if(this.status===SIP.UA.C.STATUS_USER_CLOSED&&message instanceof SIP.IncomingRequest){this.logger.warn('UA received message when status = USER_CLOSED - aborting');return;}// Do some sanity check
  if(SIP.sanityCheck(message,this,this.transport)){if(message instanceof SIP.IncomingRequest){message.transport=this.transport;this.receiveRequest(message);}else if(message instanceof SIP.IncomingResponse){/* Unike stated in 18.1.2, if a response does not match
                  * any transaction, it is discarded here and no passed to the core
                  * in order to be discarded there.
                  */switch(message.method){case SIP.C.INVITE:transaction=this.transactions.ict[message.via_branch];if(transaction){transaction.receiveResponse(message);}break;case SIP.C.ACK:// Just in case ;-)
  break;default:transaction=this.transactions.nict[message.via_branch];if(transaction){transaction.receiveResponse(message);}break;}}}};/**
       * new Transaction
       * @private
       * @param {SIP.Transaction} transaction.
       */UA.prototype.newTransaction=function(transaction){this.transactions[transaction.type][transaction.id]=transaction;this.emit('newTransaction',{transaction:transaction});};/**
       * destroy Transaction
       * @private
       * @param {SIP.Transaction} transaction.
       */UA.prototype.destroyTransaction=function(transaction){delete this.transactions[transaction.type][transaction.id];this.emit('transactionDestroyed',{transaction:transaction});};//=========================
  // receiveRequest
  //=========================
  /**
       * Request reception
       * @private
       * @param {SIP.IncomingRequest} request.
       */UA.prototype.receiveRequest=function(request){var dialog,session,message,earlySubscription,method=request.method,replaces,replacedDialog,self=this;function ruriMatches(uri){return uri&&uri.user===request.ruri.user;}// Check that request URI points to us
  if(!(ruriMatches(this.configuration.uri)||ruriMatches(this.contact.uri)||ruriMatches(this.contact.pub_gruu)||ruriMatches(this.contact.temp_gruu))){this.logger.warn('Request-URI does not point to us');if(request.method!==SIP.C.ACK){request.reply_sl(404);}return;}// Check request URI scheme
  if(request.ruri.scheme===SIP.C.SIPS){request.reply_sl(416);return;}// Check transaction
  if(SIP.Transactions.checkTransaction(this,request)){return;}/* RFC3261 12.2.2
           * Requests that do not change in any way the state of a dialog may be
           * received within a dialog (for example, an OPTIONS request).
           * They are processed as if they had been received outside the dialog.
           */if(method===SIP.C.OPTIONS){new SIP.Transactions.NonInviteServerTransaction(request,this);request.reply(200,null,['Allow: '+SIP.UA.C.ALLOWED_METHODS.toString(),'Accept: '+C.ACCEPTED_BODY_TYPES]);}else if(method===SIP.C.MESSAGE){message=new SIP.ServerContext(this,request);message.body=request.body;message.content_type=request.getHeader('Content-Type')||'text/plain';request.reply(200,null);this.emit('message',message);}else if(method!==SIP.C.INVITE&&method!==SIP.C.ACK){// Let those methods pass through to normal processing for now.
  new SIP.ServerContext(this,request);}// Initial Request
  if(!request.to_tag){switch(method){case SIP.C.INVITE:replaces=this.configuration.replaces!==SIP.C.supported.UNSUPPORTED&&request.parseHeader('replaces');if(replaces){replacedDialog=this.dialogs[replaces.call_id+replaces.replaces_to_tag+replaces.replaces_from_tag];if(!replacedDialog){//Replaced header without a matching dialog, reject
  request.reply_sl(481,null);return;}else if(replacedDialog.owner.status===SIP.Session.C.STATUS_TERMINATED){request.reply_sl(603,null);return;}else if(replacedDialog.state===SIP.Dialog.C.STATUS_CONFIRMED&&replaces.early_only){request.reply_sl(486,null);return;}}session=new SIP.InviteServerContext(this,request);session.replacee=replacedDialog&&replacedDialog.owner;self.emit('invite',session);break;case SIP.C.BYE:// Out of dialog BYE received
  request.reply(481);break;case SIP.C.CANCEL:session=this.findSession(request);if(session){session.receiveRequest(request);}else {this.logger.warn('received CANCEL request for a non existent session');}break;case SIP.C.ACK:/* Absorb it.
                       * ACK request without a corresponding Invite Transaction
                       * and without To tag.
                       */break;case SIP.C.NOTIFY:if(this.configuration.allowLegacyNotifications&&this.listeners('notify').length>0){request.reply(200,null);self.emit('notify',{request:request});}else {request.reply(481,'Subscription does not exist');}break;case SIP.C.REFER:this.logger.log('Received an out of dialog refer');if(this.configuration.allowOutOfDialogRefers){this.logger.log('Allow out of dialog refers is enabled on the UA');var referContext=new SIP.ReferServerContext(this,request);var hasReferListener=this.listeners('outOfDialogReferRequested').length;if(hasReferListener){this.emit('outOfDialogReferRequested',referContext);}else {this.logger.log('No outOfDialogReferRequest listeners, automatically accepting and following the out of dialog refer');referContext.accept({followRefer:true});}break;}request.reply(405);break;default:request.reply(405);break;}}// In-dialog request
  else {dialog=this.findDialog(request);if(dialog){if(method===SIP.C.INVITE){new SIP.Transactions.InviteServerTransaction(request,this);}dialog.receiveRequest(request);}else if(method===SIP.C.NOTIFY){session=this.findSession(request);earlySubscription=this.findEarlySubscription(request);if(session){session.receiveRequest(request);}else if(earlySubscription){earlySubscription.receiveRequest(request);}else {this.logger.warn('received NOTIFY request for a non existent session or subscription');request.reply(481,'Subscription does not exist');}}/* RFC3261 12.2.2
               * Request with to tag, but no matching dialog found.
               * Exception: ACK for an Invite request for which a dialog has not
               * been created.
               */else {if(method!==SIP.C.ACK){request.reply(481);}}}};//=================
  // Utils
  //=================
  /**
       * Get the session to which the request belongs to, if any.
       * @private
       * @param {SIP.IncomingRequest} request.
       * @returns {SIP.OutgoingSession|SIP.IncomingSession|null}
       */UA.prototype.findSession=function(request){return this.sessions[request.call_id+request.from_tag]||this.sessions[request.call_id+request.to_tag]||null;};/**
       * Get the dialog to which the request belongs to, if any.
       * @private
       * @param {SIP.IncomingRequest}
       * @returns {SIP.Dialog|null}
       */UA.prototype.findDialog=function(request){return this.dialogs[request.call_id+request.from_tag+request.to_tag]||this.dialogs[request.call_id+request.to_tag+request.from_tag]||null;};/**
       * Get the subscription which has not been confirmed to which the request belongs to, if any
       * @private
       * @param {SIP.IncomingRequest}
       * @returns {SIP.Subscription|null}
       */UA.prototype.findEarlySubscription=function(request){return this.earlySubscriptions[request.call_id+request.to_tag+request.getHeader('event')]||null;};function checkAuthenticationFactory(authenticationFactory){if(!(authenticationFactory instanceof Function)){return;}if(!authenticationFactory.initialize){authenticationFactory.initialize=function initialize(){return SIP.Utils.Promise.resolve();};}return authenticationFactory;}/**
       * Configuration load.
       * @private
       * returns {Boolean}
       */UA.prototype.loadConfig=function(configuration){// Settings and default values
  var parameter,value,checked_value,hostportParams,registrarServer,settings={/* Host address
              * Value to be set in Via sent_by and host part of Contact FQDN
              */viaHost:SIP.Utils.createRandomToken(12)+'.invalid',uri:new SIP.URI('sip','anonymous.'+SIP.Utils.createRandomToken(6),'anonymous.invalid',null,null),//Custom Configuration Settings
  custom:{},//Display name
  displayName:'',// Password
  password:null,// Registration parameters
  registerExpires:600,register:true,registrarServer:null,// Transport related parameters
  transportConstructor:__webpack_require__(29)(SIP),transportOptions:{},//string to be inserted into User-Agent request header
  userAgentString:SIP.C.USER_AGENT,// Session parameters
  noAnswerTimeout:60,// Hacks
  hackViaTcp:false,hackIpInContact:false,hackWssInTransport:false,hackAllowUnregisteredOptionTags:false,// Session Description Handler Options
  sessionDescriptionHandlerFactoryOptions:{constraints:{},peerConnectionOptions:{}},contactName:SIP.Utils.createRandomToken(8),contactTransport:'ws',forceRport:false,//autostarting
  autostart:true,autostop:true,//Reliable Provisional Responses
  rel100:SIP.C.supported.UNSUPPORTED,// DTMF type: 'info' or 'rtp' (RFC 4733)
  // RTP Payload Spec: https://tools.ietf.org/html/rfc4733
  // WebRTC Audio Spec: https://tools.ietf.org/html/rfc7874
  dtmfType:SIP.C.dtmfType.INFO,// Replaces header (RFC 3891)
  // http://tools.ietf.org/html/rfc3891
  replaces:SIP.C.supported.UNSUPPORTED,sessionDescriptionHandlerFactory:__webpack_require__(30)(SIP).defaultFactory,authenticationFactory:checkAuthenticationFactory(function authenticationFactory(ua){return new SIP.DigestAuthentication(ua);}),allowLegacyNotifications:false,allowOutOfDialogRefers:false};// Pre-Configuration
  function aliasUnderscored(parameter,logger){var underscored=parameter.replace(/([a-z][A-Z])/g,function(m){return m[0]+'_'+m[1].toLowerCase();});if(parameter===underscored){return;}var hasParameter=configuration.hasOwnProperty(parameter);if(configuration.hasOwnProperty(underscored)){logger.warn(underscored+' is deprecated, please use '+parameter);if(hasParameter){logger.warn(parameter+' overriding '+underscored);}}configuration[parameter]=hasParameter?configuration[parameter]:configuration[underscored];}var configCheck=this.getConfigurationCheck();// Check Mandatory parameters
  for(parameter in configCheck.mandatory){aliasUnderscored(parameter,this.logger);if(!configuration.hasOwnProperty(parameter)){throw new SIP.Exceptions.ConfigurationError(parameter);}else {value=configuration[parameter];checked_value=configCheck.mandatory[parameter](value);if(checked_value!==undefined){settings[parameter]=checked_value;}else {throw new SIP.Exceptions.ConfigurationError(parameter,value);}}}// Check Optional parameters
  for(parameter in configCheck.optional){aliasUnderscored(parameter,this.logger);if(configuration.hasOwnProperty(parameter)){value=configuration[parameter];// If the parameter value is an empty array, but shouldn't be, apply its default value.
  if(value instanceof Array&&value.length===0){continue;}// If the parameter value is null, empty string, or undefined then apply its default value.
  if(value===null||value===""||value===undefined){continue;}// If it's a number with NaN value then also apply its default value.
  // NOTE: JS does not allow "value === NaN", the following does the work:
  else if(typeof value==='number'&&isNaN(value)){continue;}checked_value=configCheck.optional[parameter](value);if(checked_value!==undefined){settings[parameter]=checked_value;}else {throw new SIP.Exceptions.ConfigurationError(parameter,value);}}}// Post Configuration Process
  // Allow passing 0 number as displayName.
  if(settings.displayName===0){settings.displayName='0';}// Instance-id for GRUU
  if(!settings.instanceId){settings.instanceId=SIP.Utils.newUUID();}// sipjsId instance parameter. Static random tag of length 5
  settings.sipjsId=SIP.Utils.createRandomToken(5);// String containing settings.uri without scheme and user.
  hostportParams=settings.uri.clone();hostportParams.user=null;settings.hostportParams=hostportParams.toRaw().replace(/^sip:/i,'');/* Check whether authorizationUser is explicitly defined.
           * Take 'settings.uri.user' value if not.
           */if(!settings.authorizationUser){settings.authorizationUser=settings.uri.user;}/* If no 'registrarServer' is set use the 'uri' value without user portion. */if(!settings.registrarServer){registrarServer=settings.uri.clone();registrarServer.user=null;settings.registrarServer=registrarServer;}// User noAnswerTimeout
  settings.noAnswerTimeout=settings.noAnswerTimeout*1000;// Via Host
  if(settings.hackIpInContact){if(typeof settings.hackIpInContact==='boolean'){settings.viaHost=SIP.Utils.getRandomTestNetIP();}else if(typeof settings.hackIpInContact==='string'){settings.viaHost=settings.hackIpInContact;}}// Contact transport parameter
  if(settings.hackWssInTransport){settings.contactTransport='wss';}this.contact={pub_gruu:null,temp_gruu:null,uri:new SIP.URI('sip',settings.contactName,settings.viaHost,null,{transport:settings.contactTransport}),toString:function toString(options){options=options||{};var anonymous=options.anonymous||null,outbound=options.outbound||null,contact='<';if(anonymous){contact+=(this.temp_gruu||'sip:anonymous@anonymous.invalid;transport='+settings.contactTransport).toString();}else {contact+=(this.pub_gruu||this.uri).toString();}if(outbound){contact+=';ob';}contact+='>';return contact;}};var skeleton={};// Fill the value of the configuration_skeleton
  for(parameter in settings){skeleton[parameter]=settings[parameter];}Object.assign(this.configuration,skeleton);this.logger.log('configuration parameters after validation:');for(parameter in settings){switch(parameter){case'uri':case'registrarServer':case'sessionDescriptionHandlerFactory':this.logger.log('· '+parameter+': '+settings[parameter]);break;case'password':this.logger.log('· '+parameter+': '+'NOT SHOWN');break;case'transportConstructor':this.logger.log('· '+parameter+': '+settings[parameter].name);break;default:this.logger.log('· '+parameter+': '+JSON.stringify(settings[parameter]));}}return;};/**
       * Configuration checker.
       * @private
       * @return {Boolean}
       */UA.prototype.getConfigurationCheck=function(){return {mandatory:{},optional:{uri:function uri(_uri){var parsed;if(!/^sip:/i.test(_uri)){_uri=SIP.C.SIP+':'+_uri;}parsed=SIP.URI.parse(_uri);if(!parsed){return;}else if(!parsed.user){return;}else {return parsed;}},transportConstructor:function transportConstructor(_transportConstructor){if(_transportConstructor instanceof Function){return _transportConstructor;}},transportOptions:function transportOptions(_transportOptions){if(_typeof(_transportOptions)==='object'){return _transportOptions;}},authorizationUser:function authorizationUser(_authorizationUser){if(SIP.Grammar.parse('"'+_authorizationUser+'"','quoted_string')===-1){return;}else {return _authorizationUser;}},displayName:function displayName(_displayName){if(SIP.Grammar.parse('"'+_displayName+'"','displayName')===-1){return;}else {return _displayName;}},dtmfType:function dtmfType(_dtmfType){switch(_dtmfType){case SIP.C.dtmfType.RTP:return SIP.C.dtmfType.RTP;case SIP.C.dtmfType.INFO:// Fall through
  default:return SIP.C.dtmfType.INFO;}},hackViaTcp:function hackViaTcp(_hackViaTcp){if(typeof _hackViaTcp==='boolean'){return _hackViaTcp;}},hackIpInContact:function hackIpInContact(_hackIpInContact){if(typeof _hackIpInContact==='boolean'){return _hackIpInContact;}else if(typeof _hackIpInContact==='string'&&SIP.Grammar.parse(_hackIpInContact,'host')!==-1){return _hackIpInContact;}},hackWssInTransport:function hackWssInTransport(_hackWssInTransport){if(typeof _hackWssInTransport==='boolean'){return _hackWssInTransport;}},hackAllowUnregisteredOptionTags:function hackAllowUnregisteredOptionTags(_hackAllowUnregisteredOptionTags){if(typeof _hackAllowUnregisteredOptionTags==='boolean'){return _hackAllowUnregisteredOptionTags;}},contactTransport:function contactTransport(_contactTransport){if(typeof _contactTransport==='string'){return _contactTransport;}},forceRport:function forceRport(_forceRport){if(typeof _forceRport==='boolean'){return _forceRport;}},instanceId:function instanceId(_instanceId){if(typeof _instanceId!=='string'){return;}if(/^uuid:/i.test(_instanceId)){_instanceId=_instanceId.substr(5);}if(SIP.Grammar.parse(_instanceId,'uuid')===-1){return;}else {return _instanceId;}},noAnswerTimeout:function noAnswerTimeout(_noAnswerTimeout){var value;if(SIP.Utils.isDecimal(_noAnswerTimeout)){value=Number(_noAnswerTimeout);if(value>0){return value;}}},password:function password(_password){return String(_password);},rel100:function rel100(_rel){if(_rel===SIP.C.supported.REQUIRED){return SIP.C.supported.REQUIRED;}else if(_rel===SIP.C.supported.SUPPORTED){return SIP.C.supported.SUPPORTED;}else {return SIP.C.supported.UNSUPPORTED;}},replaces:function replaces(_replaces){if(_replaces===SIP.C.supported.REQUIRED){return SIP.C.supported.REQUIRED;}else if(_replaces===SIP.C.supported.SUPPORTED){return SIP.C.supported.SUPPORTED;}else {return SIP.C.supported.UNSUPPORTED;}},register:function register(_register){if(typeof _register==='boolean'){return _register;}},registerExpires:function registerExpires(_registerExpires){var value;if(SIP.Utils.isDecimal(_registerExpires)){value=Number(_registerExpires);if(value>0){return value;}}},registrarServer:function registrarServer(_registrarServer){var parsed;if(typeof _registrarServer!=='string'){return;}if(!/^sip:/i.test(_registrarServer)){_registrarServer=SIP.C.SIP+':'+_registrarServer;}parsed=SIP.URI.parse(_registrarServer);if(!parsed){return;}else if(parsed.user){return;}else {return parsed;}},userAgentString:function userAgentString(_userAgentString){if(typeof _userAgentString==='string'){return _userAgentString;}},autostart:function autostart(_autostart){if(typeof _autostart==='boolean'){return _autostart;}},autostop:function autostop(_autostop){if(typeof _autostop==='boolean'){return _autostop;}},sessionDescriptionHandlerFactory:function sessionDescriptionHandlerFactory(_sessionDescriptionHandlerFactory){if(_sessionDescriptionHandlerFactory instanceof Function){return _sessionDescriptionHandlerFactory;}},sessionDescriptionHandlerFactoryOptions:function sessionDescriptionHandlerFactoryOptions(options){if(_typeof(options)==='object'){return options;}},authenticationFactory:checkAuthenticationFactory,allowLegacyNotifications:function allowLegacyNotifications(_allowLegacyNotifications){if(typeof _allowLegacyNotifications==='boolean'){return _allowLegacyNotifications;}},custom:function custom(_custom){if(_typeof(_custom)==='object'){return _custom;}},contactName:function contactName(_contactName){if(typeof _contactName==='string'){return _contactName;}}}};};UA.C=C;SIP.UA=UA;};/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(28));/***/},/* 28 */ /***/function(module,exports){var g;// This works in non-strict mode
  g=function(){return this;}();try{// This works if eval is allowed (see CSP)
  g=g||Function("return this")()||(1,eval)("this");}catch(e){// This works if the window reference is available
  if((typeof window==="undefined"?"undefined":_typeof(window))==="object")g=window;}// g can still be undefined, but nothing to do about it...
  // We return undefined, instead of nothing here, so it's
  // easier to handle this case. if(!global) { ...}
  module.exports=g;/***/},/* 29 */ /***/function(module,exports,__webpack_require__){/* WEBPACK VAR INJECTION */(function(global){/**
   * @fileoverview Transport
   */ /**
   * @augments SIP
   * @class Transport
   * @param {Object} options
   */module.exports=function(SIP){var Transport,C={// Transport status codes
  STATUS_CONNECTING:0,STATUS_OPEN:1,STATUS_CLOSING:2,STATUS_CLOSED:3};var WebSocket=(global.window||global).WebSocket;/**
       * Compute an amount of time in seconds to wait before sending another
       * keep-alive.
       * @returns {Number}
       */function computeKeepAliveTimeout(upperBound){var lowerBound=upperBound*0.8;return 1000*(Math.random()*(upperBound-lowerBound)+lowerBound);}Transport=function Transport(logger,options){options=SIP.Utils.defaultOptions({},options);this.logger=logger;this.ws=null;this.server=null;this.connectionPromise=null;this.connectDeferredResolve=null;this.connectionTimeout=null;this.disconnectionPromise=null;this.disconnectDeferredResolve=null;this.boundOnOpen=null;this.boundOnMessage=null;this.boundOnClose=null;this.boundOnError=null;this.reconnectionAttempts=0;this.reconnectTimer=null;// Keep alive
  this.keepAliveInterval=null;this.keepAliveDebounceTimeout=null;this.status=C.STATUS_CONNECTING;this.configuration={};this.loadConfig(options);};Transport.prototype=Object.create(SIP.Transport.prototype,{/**
          *
          * @returns {Boolean}
          */isConnected:{writable:true,value:function isConnected(){return this.status===C.STATUS_OPEN;}},/**
           * Send a message.
           * @param {SIP.OutgoingRequest|String} msg
           * @param {Object} [options]
           * @returns {Promise}
           */sendPromise:{writable:true,value:function sendPromise(msg,options){options=options||{};if(!this.statusAssert(C.STATUS_OPEN,options.force)){this.onError('unable to send message - WebSocket not open');return SIP.Utils.Promise.reject();}var message=msg.toString();if(this.ws){if(this.configuration.traceSip===true){this.logger.log('sending WebSocket message:\n\n'+message+'\n');}this.ws.send(message);return SIP.Utils.Promise.resolve({msg:message});}else {this.onError('unable to send message - WebSocket does not exist');return SIP.Utils.Promise.reject();}}},/**
          * Disconnect socket.
          */disconnectPromise:{writable:true,value:function disconnectPromise(options){if(this.disconnectionPromise){return this.disconnectionPromise;}options=options||{};if(!this.statusTransition(C.STATUS_CLOSING,options.force)){return SIP.Utils.Promise.reject('Failed status transition - attempted to disconnect a socket that was not open');}this.disconnectionPromise=new SIP.Utils.Promise(function(resolve,reject){this.disconnectDeferredResolve=resolve;if(this.reconnectTimer){SIP.Timers.clearTimeout(this.reconnectTimer);this.reconnectTimer=null;}if(this.ws){this.stopSendingKeepAlives();this.logger.log('closing WebSocket '+this.server.ws_uri);this.ws.close(options.code,options.reason);}else {reject('Attempted to disconnect but the websocket doesn\'t exist');}}.bind(this));return this.disconnectionPromise;}},/**
          * Connect socket.
          */connectPromise:{writable:true,value:function connectPromise(options){if(this.connectionPromise){return this.connectionPromise;}options=options||{};this.server=this.server||this.getNextWsServer(options.force);this.connectionPromise=new SIP.Utils.Promise(function(resolve,reject){if((this.status===C.STATUS_OPEN||this.status===C.STATUS_CLOSING)&&!options.force){this.logger.warn('WebSocket '+this.server.ws_uri+' is already connected');reject('Failed status check - attempted to open a connection but already open/closing');return;}this.connectDeferredResolve=resolve;this.status=C.STATUS_CONNECTING;this.logger.log('connecting to WebSocket '+this.server.ws_uri);this.disposeWs();try{this.ws=new WebSocket(this.server.ws_uri,'sip');}catch(e){this.ws=null;this.status=C.STATUS_CLOSED;// force status to closed in error case
  this.onError('error connecting to WebSocket '+this.server.ws_uri+':'+e);reject('Failed to create a websocket');return;}if(!this.ws){reject('Unexpected instance websocket not set');return;}this.connectionTimeout=SIP.Timers.setTimeout(function(){this.onError('took too long to connect - exceeded time set in configuration.connectionTimeout: '+this.configuration.connectionTimeout+'s');}.bind(this),this.configuration.connectionTimeout*1000);this.boundOnOpen=this.onOpen.bind(this);this.boundOnMessage=this.onMessage.bind(this);this.boundOnClose=this.onClose.bind(this);this.boundOnError=this.onError.bind(this);this.ws.addEventListener('open',this.boundOnOpen);this.ws.addEventListener('message',this.boundOnMessage);this.ws.addEventListener('close',this.boundOnClose);this.ws.addEventListener('error',this.boundOnError);}.bind(this));return this.connectionPromise;}},// Transport Event Handlers
  /**
          * @event
          * @param {event} e
          */onOpen:{writable:true,value:function onOpen(){this.status=C.STATUS_OPEN;// quietly force status to open
  this.emit('connected');SIP.Timers.clearTimeout(this.connectionTimeout);this.logger.log('WebSocket '+this.server.ws_uri+' connected');// Clear reconnectTimer since we are not disconnected
  if(this.reconnectTimer!==null){SIP.Timers.clearTimeout(this.reconnectTimer);this.reconnectTimer=null;}// Reset reconnectionAttempts
  this.reconnectionAttempts=0;// Reset disconnection promise so we can disconnect from a fresh state
  this.disconnectionPromise=null;this.disconnectDeferredResolve=null;// Start sending keep-alives
  this.startSendingKeepAlives();if(this.connectDeferredResolve){this.connectDeferredResolve({overrideEvent:true});}else {this.logger.warn('Unexpected websocket.onOpen with no connectDeferredResolve');}}},/**
          * @event
          * @param {event} e
          */onClose:{writable:true,value:function onClose(e){this.logger.log('WebSocket disconnected (code: '+e.code+(e.reason?'| reason: '+e.reason:'')+')');this.emit('disconnected',{code:e.code,reason:e.reason});if(this.status!==C.STATUS_CLOSING){this.logger.warn('WebSocket abrupt disconnection');this.emit('transportError');}this.stopSendingKeepAlives();// Clean up connection variables so we can connect again from a fresh state
  SIP.Timers.clearTimeout(this.connectionTimeout);this.connectionTimeout=null;this.connectionPromise=null;this.connectDeferredResolve=null;// Check whether the user requested to close.
  if(this.disconnectDeferredResolve){this.disconnectDeferredResolve({overrideEvent:true});this.statusTransition(C.STATUS_CLOSED);this.disconnectDeferredResolve=null;return;}this.status=C.STATUS_CLOSED;// quietly force status to closed
  this.reconnect();}},/**
          * Removes event listeners and clears the instance ws
          * @private
          * @param {event} e
          */disposeWs:{writable:true,value:function disposeWs(){if(this.ws){this.ws.removeEventListener('open',this.boundOnOpen);this.ws.removeEventListener('message',this.boundOnMessage);this.ws.removeEventListener('close',this.boundOnClose);this.ws.removeEventListener('error',this.boundOnError);this.boundOnOpen=null;this.boundOnMessage=null;this.boundOnClose=null;this.boundOnError=null;this.ws=null;}}},/**
          * @event
          * @param {event} e
          */onMessage:{writable:true,value:function onMessage(e){var data=e.data;// CRLF Keep Alive response from server. Clear our keep alive timeout.
  if(/^(\r\n)+$/.test(data)){this.clearKeepAliveTimeout();if(this.configuration.traceSip===true){this.logger.log('received WebSocket message with CRLF Keep Alive response');}return;}else if(!data){this.logger.warn('received empty message, message discarded');return;}// WebSocket binary message.
  else if(typeof data!=='string'){try{data=String.fromCharCode.apply(null,new Uint8Array(data));}catch(err){this.logger.warn('received WebSocket binary message failed to be converted into string, message discarded');return;}if(this.configuration.traceSip===true){this.logger.log('received WebSocket binary message:\n\n'+data+'\n');}}// WebSocket text message.
  else {if(this.configuration.traceSip===true){this.logger.log('received WebSocket text message:\n\n'+data+'\n');}}this.emit('message',data);}},/**
          * @event
          * @param {event} e
          */onError:{writable:true,value:function onError(e){this.logger.warn('Transport error: '+e);this.emit('transportError');}},/**
          * Reconnection attempt logic.
          * @private
          */reconnect:{writable:true,value:function reconnect(){if(this.reconnectionAttempts>0){this.logger.log('Reconnection attempt '+this.reconnectionAttempts+' failed');}if(this.noAvailableServers()){this.logger.warn('no available ws servers left - going to closed state');this.status=C.STATUS_CLOSED;this.emit('closed');this.resetServerErrorStatus();return;}if(this.isConnected()){this.logger.warn('attempted to reconnect while connected - forcing disconnect');this.disconnect({force:true});}this.reconnectionAttempts+=1;if(this.reconnectionAttempts>this.configuration.maxReconnectionAttempts){this.logger.warn('maximum reconnection attempts for WebSocket '+this.server.ws_uri);this.logger.log('transport '+this.server.ws_uri+' failed | connection state set to \'error\'');this.server.isError=true;this.emit('transportError');this.server=this.getNextWsServer();this.reconnectionAttempts=0;this.reconnect();}else {this.logger.log('trying to reconnect to WebSocket '+this.server.ws_uri+' (reconnection attempt '+this.reconnectionAttempts+')');this.reconnectTimer=SIP.Timers.setTimeout(function(){this.connect();this.reconnectTimer=null;}.bind(this),this.reconnectionAttempts===1?0:this.configuration.reconnectionTimeout*1000);}}},/**
          * Resets the error state of all servers in the configuration
          */resetServerErrorStatus:{writable:true,value:function resetServerErrorStatus(){var idx,length=this.configuration.wsServers.length;for(idx=0;idx<length;idx++){this.configuration.wsServers[idx].isError=false;}}},/**
          * Retrieve the next server to which connect.
          * @private
          * @param {Boolean} force allows bypass of server error status checking
          * @returns {Object} wsServer
          */getNextWsServer:{writable:true,value:function getNextWsServer(force){if(this.noAvailableServers()){this.logger.warn('attempted to get next ws server but there are no available ws servers left');return;}// Order servers by weight
  var idx,length,wsServer,candidates=[];length=this.configuration.wsServers.length;for(idx=0;idx<length;idx++){wsServer=this.configuration.wsServers[idx];if(wsServer.isError&&!force){continue;}else if(candidates.length===0){candidates.push(wsServer);}else if(wsServer.weight>candidates[0].weight){candidates=[wsServer];}else if(wsServer.weight===candidates[0].weight){candidates.push(wsServer);}}idx=Math.floor(Math.random()*candidates.length);return candidates[idx];}},/**
          * Checks all configuration servers, returns true if all of them have isError: true and false otherwise
          * @private
          * @returns {Boolean}
          */noAvailableServers:{writable:true,value:function noAvailableServers(){var server;for(server in this.configuration.wsServers){if(!this.configuration.wsServers[server].isError){return false;}}return true;}},//==============================
  // KeepAlive Stuff
  //==============================
  /**
           * Send a keep-alive (a double-CRLF sequence).
           * @private
           * @returns {Boolean}
           */sendKeepAlive:{writable:true,value:function sendKeepAlive(){if(this.keepAliveDebounceTimeout){// We already have an outstanding keep alive, do not send another.
  return;}this.keepAliveDebounceTimeout=SIP.Timers.setTimeout(function(){this.emit('keepAliveDebounceTimeout');this.clearKeepAliveTimeout();}.bind(this),this.configuration.keepAliveDebounce*1000);return this.send('\r\n\r\n');}},clearKeepAliveTimeout:{writable:true,value:function clearKeepAliveTimeout(){SIP.Timers.clearTimeout(this.keepAliveDebounceTimeout);this.keepAliveDebounceTimeout=null;}},/**
           * Start sending keep-alives.
           * @private
           */startSendingKeepAlives:{writable:true,value:function startSendingKeepAlives(){if(this.configuration.keepAliveInterval&&!this.keepAliveInterval){this.keepAliveInterval=SIP.Timers.setInterval(function(){this.sendKeepAlive();this.startSendingKeepAlives();}.bind(this),computeKeepAliveTimeout(this.configuration.keepAliveInterval));}}},/**
           * Stop sending keep-alives.
           * @private
           */stopSendingKeepAlives:{writable:true,value:function stopSendingKeepAlives(){SIP.Timers.clearInterval(this.keepAliveInterval);SIP.Timers.clearTimeout(this.keepAliveDebounceTimeout);this.keepAliveInterval=null;this.keepAliveDebounceTimeout=null;}},//==============================
  // Status Stuff
  //==============================
  /**
          * Checks given status against instance current status. Returns true if they match
          * @private
          * @param {Number} status
          * @param {Boolean} [force]
          * @returns {Boolean}
          */statusAssert:{writable:true,value:function statusAssert(status,force){if(status===this.status){return true;}else {if(force){this.logger.warn('Attempted to assert '+Object.keys(C)[this.status]+' as '+Object.keys(C)[status]+'- continuing with option: \'force\'');return true;}else {this.logger.warn('Tried to assert '+Object.keys(C)[status]+' but is currently '+Object.keys(C)[this.status]);return false;}}}},/**
          * Transitions the status. Checks for legal transition via assertion beforehand
          * @private
          * @param {Number} status
          * @param {Boolean} [force]
          * @returns {Boolean}
          */statusTransition:{writable:true,value:function statusTransition(status,force){this.logger.log('Attempting to transition status from '+Object.keys(C)[this.status]+' to '+Object.keys(C)[status]);if(status===C.STATUS_OPEN&&this.statusAssert(C.STATUS_CONNECTING,force)||status===C.STATUS_CLOSING&&this.statusAssert(C.STATUS_OPEN,force)||status===C.STATUS_CLOSED&&this.statusAssert(C.STATUS_CLOSING,force)){this.status=status;return true;}else {this.logger.warn('Status transition failed - result: no-op - reason: either gave an nonexistent status or attempted illegal transition');return false;}}},//==============================
  // Configuration Handling
  //==============================
  /**
           * Configuration load.
           * @private
           * returns {Boolean}
           */loadConfig:{writable:true,value:function loadConfig(configuration){var parameter,value,checked_value,settings={wsServers:[{scheme:'WSS',sip_uri:'<sip:edge.sip.onsip.com;transport=ws;lr>',weight:0,ws_uri:'wss://edge.sip.onsip.com',isError:false}],connectionTimeout:5,maxReconnectionAttempts:3,reconnectionTimeout:4,keepAliveInterval:0,keepAliveDebounce:10,// Logging
  traceSip:false};// Pre-Configuration
  function aliasUnderscored(parameter,logger){var underscored=parameter.replace(/([a-z][A-Z])/g,function(m){return m[0]+'_'+m[1].toLowerCase();});if(parameter===underscored){return;}var hasParameter=configuration.hasOwnProperty(parameter);if(configuration.hasOwnProperty(underscored)){logger.warn(underscored+' is deprecated, please use '+parameter);if(hasParameter){logger.warn(parameter+' overriding '+underscored);}}configuration[parameter]=hasParameter?configuration[parameter]:configuration[underscored];}var configCheck=this.getConfigurationCheck();// Check Mandatory parameters
  for(parameter in configCheck.mandatory){aliasUnderscored(parameter,this.logger);if(!configuration.hasOwnProperty(parameter)){throw new SIP.Exceptions.ConfigurationError(parameter);}else {value=configuration[parameter];checked_value=configCheck.mandatory[parameter](value);if(checked_value!==undefined){settings[parameter]=checked_value;}else {throw new SIP.Exceptions.ConfigurationError(parameter,value);}}}// Check Optional parameters
  for(parameter in configCheck.optional){aliasUnderscored(parameter,this.logger);if(configuration.hasOwnProperty(parameter)){value=configuration[parameter];// If the parameter value is an empty array, but shouldn't be, apply its default value.
  if(value instanceof Array&&value.length===0){continue;}// If the parameter value is null, empty string, or undefined then apply its default value.
  if(value===null||value===''||value===undefined){continue;}// If it's a number with NaN value then also apply its default value.
  // NOTE: JS does not allow "value === NaN", the following does the work:
  else if(typeof value==='number'&&isNaN(value)){continue;}checked_value=configCheck.optional[parameter](value);if(checked_value!==undefined){settings[parameter]=checked_value;}else {throw new SIP.Exceptions.ConfigurationError(parameter,value);}}}var skeleton={};// Fill the value of the configuration_skeleton
  for(parameter in settings){skeleton[parameter]={value:settings[parameter]};}Object.defineProperties(this.configuration,skeleton);this.logger.log('configuration parameters after validation:');for(parameter in settings){this.logger.log('· '+parameter+': '+JSON.stringify(settings[parameter]));}return;}},/**
           * Configuration checker.
           * @private
           * @return {Boolean}
           */getConfigurationCheck:{writable:true,value:function getConfigurationCheck(){return {mandatory:{},optional:{//Note: this function used to call 'this.logger.error' but calling 'this' with anything here is invalid
  wsServers:function wsServers(_wsServers){var idx,length,url;/* Allow defining wsServers parameter as:
                               *  String: "host"
                               *  Array of Strings: ["host1", "host2"]
                               *  Array of Objects: [{ws_uri:"host1", weight:1}, {ws_uri:"host2", weight:0}]
                               *  Array of Objects and Strings: [{ws_uri:"host1"}, "host2"]
                               */if(typeof _wsServers==='string'){_wsServers=[{ws_uri:_wsServers}];}else if(_wsServers instanceof Array){length=_wsServers.length;for(idx=0;idx<length;idx++){if(typeof _wsServers[idx]==='string'){_wsServers[idx]={ws_uri:_wsServers[idx]};}}}else {return;}if(_wsServers.length===0){return false;}length=_wsServers.length;for(idx=0;idx<length;idx++){if(!_wsServers[idx].ws_uri){return;}if(_wsServers[idx].weight&&!Number(_wsServers[idx].weight)){return;}url=SIP.Grammar.parse(_wsServers[idx].ws_uri,'absoluteURI');if(url===-1){return;}else if(['wss','ws','udp'].indexOf(url.scheme)<0){return;}else {_wsServers[idx].sip_uri='<sip:'+url.host+(url.port?':'+url.port:'')+';transport='+url.scheme.replace(/^wss$/i,'ws')+';lr>';if(!_wsServers[idx].weight){_wsServers[idx].weight=0;}_wsServers[idx].isError=false;_wsServers[idx].scheme=url.scheme.toUpperCase();}}return _wsServers;},keepAliveInterval:function keepAliveInterval(_keepAliveInterval){var value;if(SIP.Utils.isDecimal(_keepAliveInterval)){value=Number(_keepAliveInterval);if(value>0){return value;}}},keepAliveDebounce:function keepAliveDebounce(_keepAliveDebounce){var value;if(SIP.Utils.isDecimal(_keepAliveDebounce)){value=Number(_keepAliveDebounce);if(value>0){return value;}}},traceSip:function traceSip(_traceSip){if(typeof _traceSip==='boolean'){return _traceSip;}},connectionTimeout:function connectionTimeout(_connectionTimeout){var value;if(SIP.Utils.isDecimal(_connectionTimeout)){value=Number(_connectionTimeout);if(value>0){return value;}}},maxReconnectionAttempts:function maxReconnectionAttempts(_maxReconnectionAttempts){var value;if(SIP.Utils.isDecimal(_maxReconnectionAttempts)){value=Number(_maxReconnectionAttempts);if(value>=0){return value;}}},reconnectionTimeout:function reconnectionTimeout(_reconnectionTimeout){var value;if(SIP.Utils.isDecimal(_reconnectionTimeout)){value=Number(_reconnectionTimeout);if(value>0){return value;}}}}};}}});Transport.C=C;SIP.Web.Transport=Transport;return Transport;};/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(28));/***/},/* 30 */ /***/function(module,exports,__webpack_require__){/* WEBPACK VAR INJECTION */(function(global){/**
   * @fileoverview SessionDescriptionHandler
   */ /* SessionDescriptionHandler
   * @class PeerConnection helper Class.
   * @param {SIP.Session} session
   * @param {Object} [options]
   */module.exports=function(SIP){// Constructor
  var SessionDescriptionHandler=function SessionDescriptionHandler(logger,observer,options){// TODO: Validate the options
  this.options=options||{};this.logger=logger;this.observer=observer;this.dtmfSender=null;this.shouldAcquireMedia=true;this.CONTENT_TYPE='application/sdp';this.C={};this.C.DIRECTION={NULL:null,SENDRECV:"sendrecv",SENDONLY:"sendonly",RECVONLY:"recvonly",INACTIVE:"inactive"};this.logger.log('SessionDescriptionHandlerOptions: '+JSON.stringify(this.options));this.direction=this.C.DIRECTION.NULL;this.modifiers=this.options.modifiers||[];if(!Array.isArray(this.modifiers)){this.modifiers=[this.modifiers];}var environment=global.window||global;this.WebRTC={MediaStream:environment.MediaStream,getUserMedia:environment.navigator.mediaDevices.getUserMedia.bind(environment.navigator.mediaDevices),RTCPeerConnection:environment.RTCPeerConnection};this.iceGatheringDeferred=null;this.iceGatheringTimeout=false;this.iceGatheringTimer=null;this.initPeerConnection(this.options.peerConnectionOptions);this.constraints=this.checkAndDefaultConstraints(this.options.constraints);};/**
       * @param {SIP.Session} session
       * @param {Object} [options]
       */SessionDescriptionHandler.defaultFactory=function defaultFactory(session,options){var logger=session.ua.getLogger('sip.invitecontext.sessionDescriptionHandler',session.id);var SessionDescriptionHandlerObserver=__webpack_require__(31);var observer=new SessionDescriptionHandlerObserver(session,options);return new SessionDescriptionHandler(logger,observer,options);};SessionDescriptionHandler.prototype=Object.create(SIP.SessionDescriptionHandler.prototype,{// Functions the sesssion can use
  /**
           * Destructor
           */close:{writable:true,value:function value(){this.logger.log('closing PeerConnection');// have to check signalingState since this.close() gets called multiple times
  if(this.peerConnection&&this.peerConnection.signalingState!=='closed'){if(this.peerConnection.getSenders){this.peerConnection.getSenders().forEach(function(sender){if(sender.track){sender.track.stop();}});}else {this.logger.warn('Using getLocalStreams which is deprecated');this.peerConnection.getLocalStreams().forEach(function(stream){stream.getTracks().forEach(function(track){track.stop();});});}if(this.peerConnection.getReceivers){this.peerConnection.getReceivers().forEach(function(receiver){if(receiver.track){receiver.track.stop();}});}else {this.logger.warn('Using getRemoteStreams which is deprecated');this.peerConnection.getRemoteStreams().forEach(function(stream){stream.getTracks().forEach(function(track){track.stop();});});}this.resetIceGatheringComplete();this.peerConnection.close();}}},/**
           * Gets the local description from the underlying media implementation
           * @param {Object} [options] Options object to be used by getDescription
           * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
           * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
           * @param {Array} [modifiers] Array with one time use description modifiers
           * @returns {Promise} Promise that resolves with the local description to be used for the session
           */getDescription:{writable:true,value:function value(options,modifiers){options=options||{};if(options.peerConnectionOptions){this.initPeerConnection(options.peerConnectionOptions);}// Merge passed constraints with saved constraints and save
  var newConstraints=Object.assign({},this.constraints,options.constraints);newConstraints=this.checkAndDefaultConstraints(newConstraints);if(JSON.stringify(newConstraints)!==JSON.stringify(this.constraints)){this.constraints=newConstraints;this.shouldAcquireMedia=true;}modifiers=modifiers||[];if(!Array.isArray(modifiers)){modifiers=[modifiers];}modifiers=modifiers.concat(this.modifiers);return SIP.Utils.Promise.resolve().then(function(){if(this.shouldAcquireMedia){return this.acquire(this.constraints).then(function(){this.shouldAcquireMedia=false;}.bind(this));}}.bind(this)).then(function(){return this.createOfferOrAnswer(options.RTCOfferOptions,modifiers);}.bind(this)).then(function(description){this.emit('getDescription',description);return {body:description.sdp,contentType:this.CONTENT_TYPE};}.bind(this));}},/**
           * Check if the Session Description Handler can handle the Content-Type described by a SIP Message
           * @param {String} contentType The content type that is in the SIP Message
           * @returns {boolean}
           */hasDescription:{writable:true,value:function hasDescription(contentType){return contentType===this.CONTENT_TYPE;}},/**
           * The modifier that should be used when the session would like to place the call on hold
           * @param {String} [sdp] The description that will be modified
           * @returns {Promise} Promise that resolves with modified SDP
           */holdModifier:{writable:true,value:function holdModifier(description){if(!/a=(sendrecv|sendonly|recvonly|inactive)/.test(description.sdp)){description.sdp=description.sdp.replace(/(m=[^\r]*\r\n)/g,'$1a=sendonly\r\n');}else {description.sdp=description.sdp.replace(/a=sendrecv\r\n/g,'a=sendonly\r\n');description.sdp=description.sdp.replace(/a=recvonly\r\n/g,'a=inactive\r\n');}return SIP.Utils.Promise.resolve(description);}},/**
           * Set the remote description to the underlying media implementation
           * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation
           * @param {Object} [options] Options object to be used by getDescription
           * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
           * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
           * @param {Array} [modifiers] Array with one time use description modifiers
           * @returns {Promise} Promise that resolves once the description is set
           */setDescription:{writable:true,value:function setDescription(sessionDescription,options,modifiers){var _this=this;var self=this;options=options||{};if(options.peerConnectionOptions){this.initPeerConnection(options.peerConnectionOptions);}modifiers=modifiers||[];if(!Array.isArray(modifiers)){modifiers=[modifiers];}modifiers=modifiers.concat(this.modifiers);var description={type:this.hasOffer('local')?'answer':'offer',sdp:sessionDescription};return SIP.Utils.Promise.resolve().then(function(){// Media should be acquired in getDescription unless we need to do it sooner for some reason (FF61+)
  if(this.shouldAcquireMedia&&this.options.alwaysAcquireMediaFirst){return this.acquire(this.constraints).then(function(){this.shouldAcquireMedia=false;}.bind(this));}}.bind(this)).then(function(){return SIP.Utils.reducePromises(modifiers,description);})["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("setDescription",e,"The modifiers did not resolve successfully");_this.logger.error(error.message);self.emit('peerConnection-setRemoteDescriptionFailed',error);throw error;}).then(function(modifiedDescription){self.emit('setDescription',modifiedDescription);return self.peerConnection.setRemoteDescription(modifiedDescription);})["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}// Check the original SDP for video, and ensure that we have want to do audio fallback
  if(/^m=video.+$/gm.test(sessionDescription)&&!options.disableAudioFallback){// Do not try to audio fallback again
  options.disableAudioFallback=true;// Remove video first, then do the other modifiers
  return _this.setDescription(sessionDescription,options,[SIP.Web.Modifiers.stripVideo].concat(modifiers));}var error=new SIP.Exceptions.SessionDescriptionHandlerError("setDescription",e);_this.logger.error(error.error);_this.emit('peerConnection-setRemoteDescriptionFailed',error);throw error;}).then(function setRemoteDescriptionSuccess(){if(self.peerConnection.getReceivers){self.emit('setRemoteDescription',self.peerConnection.getReceivers());}else {self.emit('setRemoteDescription',self.peerConnection.getRemoteStreams());}self.emit('confirmed',self);});}},/**
           * Send DTMF via RTP (RFC 4733)
           * @param {String} tones A string containing DTMF digits
           * @param {Object} [options] Options object to be used by sendDtmf
           * @returns {boolean} true if DTMF send is successful, false otherwise
           */sendDtmf:{writable:true,value:function sendDtmf(tones,options){if(!this.dtmfSender&&this.hasBrowserGetSenderSupport()){var senders=this.peerConnection.getSenders();if(senders.length>0){this.dtmfSender=senders[0].dtmf;}}if(!this.dtmfSender&&this.hasBrowserTrackSupport()){var streams=this.peerConnection.getLocalStreams();if(streams.length>0){var audioTracks=streams[0].getAudioTracks();if(audioTracks.length>0){this.dtmfSender=this.peerConnection.createDTMFSender(audioTracks[0]);}}}if(!this.dtmfSender){return false;}try{this.dtmfSender.insertDTMF(tones,options.duration,options.interToneGap);}catch(e){if(e.type==="InvalidStateError"||e.type==="InvalidCharacterError"){this.logger.error(e);return false;}else {throw e;}}this.logger.log('DTMF sent via RTP: '+tones.toString());return true;}},getDirection:{writable:true,value:function getDirection(){return this.direction;}},// Internal functions
  createOfferOrAnswer:{writable:true,value:function createOfferOrAnswer(RTCOfferOptions,modifiers){var _this=this;var self=this;var methodName;var pc=this.peerConnection;RTCOfferOptions=RTCOfferOptions||{};methodName=self.hasOffer('remote')?'createAnswer':'createOffer';return pc[methodName](RTCOfferOptions)["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("createOfferOrAnswer",e,'peerConnection-'+methodName+'Failed');_this.emit('peerConnection-'+methodName+'Failed',error);throw error;}).then(function(sdp){return SIP.Utils.reducePromises(modifiers,self.createRTCSessionDescriptionInit(sdp));}).then(function(sdp){self.resetIceGatheringComplete();return pc.setLocalDescription(sdp);})["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("createOfferOrAnswer",e,'peerConnection-SetLocalDescriptionFailed');_this.emit('peerConnection-SetLocalDescriptionFailed',error);throw error;}).then(function onSetLocalDescriptionSuccess(){return self.waitForIceGatheringComplete();}).then(function readySuccess(){var localDescription=self.createRTCSessionDescriptionInit(self.peerConnection.localDescription);return SIP.Utils.reducePromises(modifiers,localDescription);}).then(function(localDescription){self.setDirection(localDescription.sdp);return localDescription;})["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("createOfferOrAnswer",e);_this.logger.error(error);throw error;});}},// Creates an RTCSessionDescriptionInit from an RTCSessionDescription
  createRTCSessionDescriptionInit:{writable:true,value:function createRTCSessionDescriptionInit(RTCSessionDescription){return {type:RTCSessionDescription.type,sdp:RTCSessionDescription.sdp};}},addDefaultIceCheckingTimeout:{writable:true,value:function addDefaultIceCheckingTimeout(peerConnectionOptions){if(peerConnectionOptions.iceCheckingTimeout===undefined){peerConnectionOptions.iceCheckingTimeout=5000;}return peerConnectionOptions;}},addDefaultIceServers:{writable:true,value:function addDefaultIceServers(rtcConfiguration){if(!rtcConfiguration.iceServers){rtcConfiguration.iceServers=[{urls:'stun:stun.l.google.com:19302'}];}return rtcConfiguration;}},checkAndDefaultConstraints:{writable:true,value:function checkAndDefaultConstraints(constraints){var defaultConstraints={audio:true,video:!this.options.alwaysAcquireMediaFirst};constraints=constraints||defaultConstraints;// Empty object check
  if(Object.keys(constraints).length===0&&constraints.constructor===Object){return defaultConstraints;}return constraints;}},hasBrowserTrackSupport:{writable:true,value:function hasBrowserTrackSupport(){return Boolean(this.peerConnection.addTrack);}},hasBrowserGetSenderSupport:{writable:true,value:function hasBrowserGetSenderSupport(){return Boolean(this.peerConnection.getSenders);}},initPeerConnection:{writable:true,value:function initPeerConnection(options){var self=this;options=options||{};options=this.addDefaultIceCheckingTimeout(options);options.rtcConfiguration=options.rtcConfiguration||{};options.rtcConfiguration=this.addDefaultIceServers(options.rtcConfiguration);this.logger.log('initPeerConnection');if(this.peerConnection){this.logger.log('Already have a peer connection for this session. Tearing down.');this.resetIceGatheringComplete();this.peerConnection.close();}this.peerConnection=new this.WebRTC.RTCPeerConnection(options.rtcConfiguration);this.logger.log('New peer connection created');if('ontrack'in this.peerConnection){this.peerConnection.addEventListener('track',function(e){self.logger.log('track added');self.observer.trackAdded();self.emit('addTrack',e);});}else {this.logger.warn('Using onaddstream which is deprecated');this.peerConnection.onaddstream=function(e){self.logger.log('stream added');self.emit('addStream',e);};}this.peerConnection.onicecandidate=function(e){self.emit('iceCandidate',e);if(e.candidate){self.logger.log('ICE candidate received: '+(e.candidate.candidate===null?null:e.candidate.candidate.trim()));}else if(e.candidate===null){// indicates the end of candidate gathering
  self.logger.log('ICE candidate gathering complete');self.triggerIceGatheringComplete();}};this.peerConnection.onicegatheringstatechange=function(){self.logger.log('RTCIceGatheringState changed: '+this.iceGatheringState);switch(this.iceGatheringState){case'gathering':self.emit('iceGathering',this);if(!self.iceGatheringTimer&&options.iceCheckingTimeout){self.iceGatheringTimeout=false;self.iceGatheringTimer=SIP.Timers.setTimeout(function(){self.logger.log('RTCIceChecking Timeout Triggered after '+options.iceCheckingTimeout+' milliseconds');self.iceGatheringTimeout=true;self.triggerIceGatheringComplete();},options.iceCheckingTimeout);}break;case'complete':self.triggerIceGatheringComplete();break;}};this.peerConnection.oniceconnectionstatechange=function(){var stateEvent;switch(this.iceConnectionState){case'new':stateEvent='iceConnection';break;case'checking':stateEvent='iceConnectionChecking';break;case'connected':stateEvent='iceConnectionConnected';break;case'completed':stateEvent='iceConnectionCompleted';break;case'failed':stateEvent='iceConnectionFailed';break;case'disconnected':stateEvent='iceConnectionDisconnected';break;case'closed':stateEvent='iceConnectionClosed';break;default:self.logger.warn('Unknown iceConnection state:',this.iceConnectionState);return;}self.emit(stateEvent,this);};}},acquire:{writable:true,value:function acquire(constraints){var _this=this;// Default audio & video to true
  constraints=this.checkAndDefaultConstraints(constraints);return new SIP.Utils.Promise(function(resolve,reject){/*
                       * Make the call asynchronous, so that ICCs have a chance
                       * to define callbacks to `userMediaRequest`
                       */this.logger.log('acquiring local media');this.emit('userMediaRequest',constraints);if(constraints.audio||constraints.video){this.WebRTC.getUserMedia(constraints).then(function(streams){this.observer.trackAdded();this.emit('userMedia',streams);resolve(streams);}.bind(this))["catch"](function(e){this.emit('userMediaFailed',e);reject(e);}.bind(this));}else {// Local streams were explicitly excluded.
  resolve([]);}}.bind(this))["catch"](function(e){// TODO: This propogates downwards
  if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("acquire",e,"unable to acquire streams");_this.logger.error(error.message);_this.logger.error(error.error);throw error;}).then(function acquireSucceeded(streams){this.logger.log('acquired local media streams');try{// Remove old tracks
  if(this.peerConnection.removeTrack){this.peerConnection.getSenders().forEach(function(sender){this.peerConnection.removeTrack(sender);},this);}return streams;}catch(e){return SIP.Utils.Promise.reject(e);}}.bind(this))["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("acquire",e,"error removing streams");_this.logger.error(error.message);_this.logger.error(error.error);throw error;}).then(function addStreams(streams){try{streams=[].concat(streams);streams.forEach(function(stream){if(this.peerConnection.addTrack){stream.getTracks().forEach(function(track){this.peerConnection.addTrack(track,stream);},this);}else {// Chrome 59 does not support addTrack
  this.peerConnection.addStream(stream);}},this);}catch(e){return SIP.Utils.Promise.reject(e);}return SIP.Utils.Promise.resolve();}.bind(this))["catch"](function(e){if(e instanceof SIP.Exceptions.SessionDescriptionHandlerError){throw e;}var error=new SIP.Exceptions.SessionDescriptionHandlerError("acquire",e,"error adding stream");_this.logger.error(error.message);_this.logger.error(error.error);throw error;});}},hasOffer:{writable:true,value:function hasOffer(where){var offerState='have-'+where+'-offer';return this.peerConnection.signalingState===offerState;}},// ICE gathering state handling
  isIceGatheringComplete:{writable:true,value:function isIceGatheringComplete(){return this.peerConnection.iceGatheringState==='complete'||this.iceGatheringTimeout;}},resetIceGatheringComplete:{writable:true,value:function resetIceGatheringComplete(){this.iceGatheringTimeout=false;if(this.iceGatheringTimer){SIP.Timers.clearTimeout(this.iceGatheringTimer);this.iceGatheringTimer=null;}if(this.iceGatheringDeferred){this.iceGatheringDeferred.reject();this.iceGatheringDeferred=null;}}},setDirection:{writable:true,value:function setDirection(sdp){var match=sdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);if(match===null){this.direction=this.C.DIRECTION.NULL;this.observer.directionChanged();return;}var direction=match[1];switch(direction){case this.C.DIRECTION.SENDRECV:case this.C.DIRECTION.SENDONLY:case this.C.DIRECTION.RECVONLY:case this.C.DIRECTION.INACTIVE:this.direction=direction;break;default:this.direction=this.C.DIRECTION.NULL;break;}this.observer.directionChanged();}},triggerIceGatheringComplete:{writable:true,value:function triggerIceGatheringComplete(){if(this.isIceGatheringComplete()){this.emit('iceGatheringComplete',this);if(this.iceGatheringTimer){SIP.Timers.clearTimeout(this.iceGatheringTimer);this.iceGatheringTimer=null;}if(this.iceGatheringDeferred){this.iceGatheringDeferred.resolve();this.iceGatheringDeferred=null;}}}},waitForIceGatheringComplete:{writable:true,value:function waitForIceGatheringComplete(){if(this.isIceGatheringComplete()){return SIP.Utils.Promise.resolve();}else if(!this.isIceGatheringDeferred){this.iceGatheringDeferred=SIP.Utils.defer();}return this.iceGatheringDeferred.promise;}}});return SessionDescriptionHandler;};/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(28));/***/},/* 31 */ /***/function(module,exports,__webpack_require__){var SessionDescriptionHandlerObserver=function SessionDescriptionHandlerObserver(session,options){this.session=session||{};this.options=options||{};};SessionDescriptionHandlerObserver.prototype={trackAdded:function trackAdded(){this.session.emit('trackAdded');},directionChanged:function directionChanged(){this.session.emit('directionChanged');}};module.exports=SessionDescriptionHandlerObserver;/***/},/* 32 */ /***/function(module,exports,__webpack_require__){/**
   * @fileoverview Incoming SIP Message Sanity Check
   */ /**
   * SIP message sanity check.
   * @augments SIP
   * @function
   * @param {SIP.IncomingMessage} message
   * @param {SIP.UA} ua
   * @param {SIP.Transport} transport
   * @returns {Boolean}
   */module.exports=function(SIP){var sanityCheck,requests=[],responses=[],all=[];// Reply
  function reply(status_code,message,transport){var to,response=SIP.Utils.buildStatusLine(status_code),vias=message.getHeaders('via'),length=vias.length,idx=0;for(idx;idx<length;idx++){response+="Via: "+vias[idx]+"\r\n";}to=message.getHeader('To');if(!message.to_tag){to+=';tag='+SIP.Utils.newTag();}response+="To: "+to+"\r\n";response+="From: "+message.getHeader('From')+"\r\n";response+="Call-ID: "+message.call_id+"\r\n";response+="CSeq: "+message.cseq+" "+message.method+"\r\n";response+="\r\n";transport.send(response);}/*
       * Sanity Check for incoming Messages
       *
       * Requests:
       *  - _rfc3261_8_2_2_1_ Receive a Request with a non supported URI scheme
       *  - _rfc3261_16_3_4_ Receive a Request already sent by us
       *   Does not look at via sent-by but at sipjsId, which is inserted as
       *   a prefix in all initial requests generated by the ua
       *  - _rfc3261_18_3_request_ Body Content-Length
       *  - _rfc3261_8_2_2_2_ Merged Requests
       *
       * Responses:
       *  - _rfc3261_8_1_3_3_ Multiple Via headers
       *  - _rfc3261_18_1_2_ sent-by mismatch
       *  - _rfc3261_18_3_response_ Body Content-Length
       *
       * All:
       *  - Minimum headers in a SIP message
       */ // Sanity Check functions for requests
  function rfc3261_8_2_2_1(message,ua,transport){if(!message.ruri||message.ruri.scheme!=='sip'){reply(416,message,transport);return false;}}function rfc3261_16_3_4(message,ua,transport){if(!message.to_tag){if(message.call_id.substr(0,5)===ua.configuration.sipjsId){reply(482,message,transport);return false;}}}function rfc3261_18_3_request(message,ua,transport){var len=SIP.Utils.str_utf8_length(message.body),contentLength=message.getHeader('content-length');if(len<contentLength){reply(400,message,transport);return false;}}function rfc3261_8_2_2_2(message,ua,transport){var tr,idx,fromTag=message.from_tag,call_id=message.call_id,cseq=message.cseq;if(!message.to_tag){if(message.method===SIP.C.INVITE){tr=ua.transactions.ist[message.via_branch];if(tr){return;}else {for(idx in ua.transactions.ist){tr=ua.transactions.ist[idx];if(tr.request.from_tag===fromTag&&tr.request.call_id===call_id&&tr.request.cseq===cseq){reply(482,message,transport);return false;}}}}else {tr=ua.transactions.nist[message.via_branch];if(tr){return;}else {for(idx in ua.transactions.nist){tr=ua.transactions.nist[idx];if(tr.request.from_tag===fromTag&&tr.request.call_id===call_id&&tr.request.cseq===cseq){reply(482,message,transport);return false;}}}}}}// Sanity Check functions for responses
  function rfc3261_8_1_3_3(message,ua){if(message.getHeaders('via').length>1){ua.getLogger('sip.sanitycheck').warn('More than one Via header field present in the response. Dropping the response');return false;}}function rfc3261_18_1_2(message,ua){var viaHost=ua.configuration.viaHost;if(message.via.host!==viaHost||message.via.port!==undefined){ua.getLogger('sip.sanitycheck').warn('Via sent-by in the response does not match UA Via host value. Dropping the response');return false;}}function rfc3261_18_3_response(message,ua){var len=SIP.Utils.str_utf8_length(message.body),contentLength=message.getHeader('content-length');if(len<contentLength){ua.getLogger('sip.sanitycheck').warn('Message body length is lower than the value in Content-Length header field. Dropping the response');return false;}}// Sanity Check functions for requests and responses
  function minimumHeaders(message,ua){var mandatoryHeaders=['from','to','call_id','cseq','via'],idx=mandatoryHeaders.length;while(idx--){if(!message.hasHeader(mandatoryHeaders[idx])){ua.getLogger('sip.sanitycheck').warn('Missing mandatory header field : '+mandatoryHeaders[idx]+'. Dropping the response');return false;}}}requests.push(rfc3261_8_2_2_1);requests.push(rfc3261_16_3_4);requests.push(rfc3261_18_3_request);requests.push(rfc3261_8_2_2_2);responses.push(rfc3261_8_1_3_3);responses.push(rfc3261_18_1_2);responses.push(rfc3261_18_3_response);all.push(minimumHeaders);sanityCheck=function sanityCheck(message,ua,transport){var len,pass;len=all.length;while(len--){pass=all[len](message,ua,transport);if(pass===false){return false;}}if(message instanceof SIP.IncomingRequest){len=requests.length;while(len--){pass=requests[len](message,ua,transport);if(pass===false){return false;}}}else if(message instanceof SIP.IncomingResponse){len=responses.length;while(len--){pass=responses[len](message,ua,transport);if(pass===false){return false;}}}//Everything is OK
  return true;};SIP.sanityCheck=sanityCheck;};/***/},/* 33 */ /***/function(module,exports,__webpack_require__){var md5=__webpack_require__(34);/**
   * @fileoverview SIP Digest Authentication
   */ /**
   * SIP Digest Authentication.
   * @augments SIP.
   * @function Digest Authentication
   * @param {SIP.UA} ua
   */module.exports=function(Utils){var DigestAuthentication;DigestAuthentication=function DigestAuthentication(ua){this.logger=ua.getLogger('sipjs.digestauthentication');this.username=ua.configuration.authorizationUser;this.password=ua.configuration.password;this.cnonce=null;this.nc=0;this.ncHex='00000000';this.response=null;};/**
      * Performs Digest authentication given a SIP request and the challenge
      * received in a response to that request.
      * Returns true if credentials were successfully generated, false otherwise.
      *
      * @param {SIP.OutgoingRequest} request
      * @param {Object} challenge
      */DigestAuthentication.prototype.authenticate=function(request,challenge){// Inspect and validate the challenge.
  this.algorithm=challenge.algorithm;this.realm=challenge.realm;this.nonce=challenge.nonce;this.opaque=challenge.opaque;this.stale=challenge.stale;if(this.algorithm){if(this.algorithm!=='MD5'){this.logger.warn('challenge with Digest algorithm different than "MD5", authentication aborted');return false;}}else {this.algorithm='MD5';}if(!this.realm){this.logger.warn('challenge without Digest realm, authentication aborted');return false;}if(!this.nonce){this.logger.warn('challenge without Digest nonce, authentication aborted');return false;}// 'qop' can contain a list of values (Array). Let's choose just one.
  if(challenge.qop){if(challenge.qop.indexOf('auth')>-1){this.qop='auth';}else if(challenge.qop.indexOf('auth-int')>-1){this.qop='auth-int';}else {// Otherwise 'qop' is present but does not contain 'auth' or 'auth-int', so abort here.
  this.logger.warn('challenge without Digest qop different than "auth" or "auth-int", authentication aborted');return false;}}else {this.qop=null;}// Fill other attributes.
  this.method=request.method;this.uri=request.ruri;this.cnonce=Utils.createRandomToken(12);this.nc+=1;this.updateNcHex();// nc-value = 8LHEX. Max value = 'FFFFFFFF'.
  if(this.nc===4294967296){this.nc=1;this.ncHex='00000001';}// Calculate the Digest "response" value.
  this.calculateResponse();return true;};/**
      * Generate Digest 'response' value.
      * @private
      */DigestAuthentication.prototype.calculateResponse=function(){var ha1,ha2;// HA1 = MD5(A1) = MD5(username:realm:password)
  ha1=md5(this.username+":"+this.realm+":"+this.password);if(this.qop==='auth'){// HA2 = MD5(A2) = MD5(method:digestURI)
  ha2=md5(this.method+":"+this.uri);// response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)
  this.response=md5(ha1+":"+this.nonce+":"+this.ncHex+":"+this.cnonce+":auth:"+ha2);}else if(this.qop==='auth-int'){// HA2 = MD5(A2) = MD5(method:digestURI:MD5(entityBody))
  ha2=md5(this.method+":"+this.uri+":"+md5(this.body?this.body:""));// response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)
  this.response=md5(ha1+":"+this.nonce+":"+this.ncHex+":"+this.cnonce+":auth-int:"+ha2);}else if(this.qop===null){// HA2 = MD5(A2) = MD5(method:digestURI)
  ha2=md5(this.method+":"+this.uri);// response = MD5(HA1:nonce:HA2)
  this.response=md5(ha1+":"+this.nonce+":"+ha2);}};/**
      * Return the Proxy-Authorization or WWW-Authorization header value.
      */DigestAuthentication.prototype.toString=function(){var auth_params=[];if(!this.response){throw new Error('response field does not exist, cannot generate Authorization header');}auth_params.push('algorithm='+this.algorithm);auth_params.push('username="'+this.username+'"');auth_params.push('realm="'+this.realm+'"');auth_params.push('nonce="'+this.nonce+'"');auth_params.push('uri="'+this.uri+'"');auth_params.push('response="'+this.response+'"');if(this.opaque){auth_params.push('opaque="'+this.opaque+'"');}if(this.qop){auth_params.push('qop='+this.qop);auth_params.push('cnonce="'+this.cnonce+'"');auth_params.push('nc='+this.ncHex);}return 'Digest '+auth_params.join(', ');};/**
      * Generate the 'nc' value as required by Digest in this.ncHex by reading this.nc.
      * @private
      */DigestAuthentication.prototype.updateNcHex=function(){var hex=Number(this.nc).toString(16);this.ncHex='00000000'.substr(0,8-hex.length)+hex;};return DigestAuthentication;};/***/},/* 34 */ /***/function(module,exports,__webpack_require__){(function(root,factory){{// CommonJS
  module.exports=exports=factory(__webpack_require__(35));}})(this,function(CryptoJS){(function(Math){// Shortcuts
  var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;// Constants table
  var T=[];// Compute constants
  (function(){for(var i=0;i<64;i++){T[i]=Math.abs(Math.sin(i+1))*0x100000000|0;}})();/**
  	     * MD5 hash algorithm.
  	     */var MD5=C_algo.MD5=Hasher.extend({_doReset:function _doReset(){this._hash=new WordArray.init([0x67452301,0xefcdab89,0x98badcfe,0x10325476]);},_doProcessBlock:function _doProcessBlock(M,offset){// Swap endian
  for(var i=0;i<16;i++){// Shortcuts
  var offset_i=offset+i;var M_offset_i=M[offset_i];M[offset_i]=(M_offset_i<<8|M_offset_i>>>24)&0x00ff00ff|(M_offset_i<<24|M_offset_i>>>8)&0xff00ff00;}// Shortcuts
  var H=this._hash.words;var M_offset_0=M[offset+0];var M_offset_1=M[offset+1];var M_offset_2=M[offset+2];var M_offset_3=M[offset+3];var M_offset_4=M[offset+4];var M_offset_5=M[offset+5];var M_offset_6=M[offset+6];var M_offset_7=M[offset+7];var M_offset_8=M[offset+8];var M_offset_9=M[offset+9];var M_offset_10=M[offset+10];var M_offset_11=M[offset+11];var M_offset_12=M[offset+12];var M_offset_13=M[offset+13];var M_offset_14=M[offset+14];var M_offset_15=M[offset+15];// Working varialbes
  var a=H[0];var b=H[1];var c=H[2];var d=H[3];// Computation
  a=FF(a,b,c,d,M_offset_0,7,T[0]);d=FF(d,a,b,c,M_offset_1,12,T[1]);c=FF(c,d,a,b,M_offset_2,17,T[2]);b=FF(b,c,d,a,M_offset_3,22,T[3]);a=FF(a,b,c,d,M_offset_4,7,T[4]);d=FF(d,a,b,c,M_offset_5,12,T[5]);c=FF(c,d,a,b,M_offset_6,17,T[6]);b=FF(b,c,d,a,M_offset_7,22,T[7]);a=FF(a,b,c,d,M_offset_8,7,T[8]);d=FF(d,a,b,c,M_offset_9,12,T[9]);c=FF(c,d,a,b,M_offset_10,17,T[10]);b=FF(b,c,d,a,M_offset_11,22,T[11]);a=FF(a,b,c,d,M_offset_12,7,T[12]);d=FF(d,a,b,c,M_offset_13,12,T[13]);c=FF(c,d,a,b,M_offset_14,17,T[14]);b=FF(b,c,d,a,M_offset_15,22,T[15]);a=GG(a,b,c,d,M_offset_1,5,T[16]);d=GG(d,a,b,c,M_offset_6,9,T[17]);c=GG(c,d,a,b,M_offset_11,14,T[18]);b=GG(b,c,d,a,M_offset_0,20,T[19]);a=GG(a,b,c,d,M_offset_5,5,T[20]);d=GG(d,a,b,c,M_offset_10,9,T[21]);c=GG(c,d,a,b,M_offset_15,14,T[22]);b=GG(b,c,d,a,M_offset_4,20,T[23]);a=GG(a,b,c,d,M_offset_9,5,T[24]);d=GG(d,a,b,c,M_offset_14,9,T[25]);c=GG(c,d,a,b,M_offset_3,14,T[26]);b=GG(b,c,d,a,M_offset_8,20,T[27]);a=GG(a,b,c,d,M_offset_13,5,T[28]);d=GG(d,a,b,c,M_offset_2,9,T[29]);c=GG(c,d,a,b,M_offset_7,14,T[30]);b=GG(b,c,d,a,M_offset_12,20,T[31]);a=HH(a,b,c,d,M_offset_5,4,T[32]);d=HH(d,a,b,c,M_offset_8,11,T[33]);c=HH(c,d,a,b,M_offset_11,16,T[34]);b=HH(b,c,d,a,M_offset_14,23,T[35]);a=HH(a,b,c,d,M_offset_1,4,T[36]);d=HH(d,a,b,c,M_offset_4,11,T[37]);c=HH(c,d,a,b,M_offset_7,16,T[38]);b=HH(b,c,d,a,M_offset_10,23,T[39]);a=HH(a,b,c,d,M_offset_13,4,T[40]);d=HH(d,a,b,c,M_offset_0,11,T[41]);c=HH(c,d,a,b,M_offset_3,16,T[42]);b=HH(b,c,d,a,M_offset_6,23,T[43]);a=HH(a,b,c,d,M_offset_9,4,T[44]);d=HH(d,a,b,c,M_offset_12,11,T[45]);c=HH(c,d,a,b,M_offset_15,16,T[46]);b=HH(b,c,d,a,M_offset_2,23,T[47]);a=II(a,b,c,d,M_offset_0,6,T[48]);d=II(d,a,b,c,M_offset_7,10,T[49]);c=II(c,d,a,b,M_offset_14,15,T[50]);b=II(b,c,d,a,M_offset_5,21,T[51]);a=II(a,b,c,d,M_offset_12,6,T[52]);d=II(d,a,b,c,M_offset_3,10,T[53]);c=II(c,d,a,b,M_offset_10,15,T[54]);b=II(b,c,d,a,M_offset_1,21,T[55]);a=II(a,b,c,d,M_offset_8,6,T[56]);d=II(d,a,b,c,M_offset_15,10,T[57]);c=II(c,d,a,b,M_offset_6,15,T[58]);b=II(b,c,d,a,M_offset_13,21,T[59]);a=II(a,b,c,d,M_offset_4,6,T[60]);d=II(d,a,b,c,M_offset_11,10,T[61]);c=II(c,d,a,b,M_offset_2,15,T[62]);b=II(b,c,d,a,M_offset_9,21,T[63]);// Intermediate hash value
  H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;},_doFinalize:function _doFinalize(){// Shortcuts
  var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;// Add padding
  dataWords[nBitsLeft>>>5]|=0x80<<24-nBitsLeft%32;var nBitsTotalH=Math.floor(nBitsTotal/0x100000000);var nBitsTotalL=nBitsTotal;dataWords[(nBitsLeft+64>>>9<<4)+15]=(nBitsTotalH<<8|nBitsTotalH>>>24)&0x00ff00ff|(nBitsTotalH<<24|nBitsTotalH>>>8)&0xff00ff00;dataWords[(nBitsLeft+64>>>9<<4)+14]=(nBitsTotalL<<8|nBitsTotalL>>>24)&0x00ff00ff|(nBitsTotalL<<24|nBitsTotalL>>>8)&0xff00ff00;data.sigBytes=(dataWords.length+1)*4;// Hash final blocks
  this._process();// Shortcuts
  var hash=this._hash;var H=hash.words;// Swap endian
  for(var i=0;i<4;i++){// Shortcut
  var H_i=H[i];H[i]=(H_i<<8|H_i>>>24)&0x00ff00ff|(H_i<<24|H_i>>>8)&0xff00ff00;}// Return final computed hash
  return hash;},clone:function clone(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});function FF(a,b,c,d,x,s,t){var n=a+(b&c|~b&d)+x+t;return (n<<s|n>>>32-s)+b;}function GG(a,b,c,d,x,s,t){var n=a+(b&d|c&~d)+x+t;return (n<<s|n>>>32-s)+b;}function HH(a,b,c,d,x,s,t){var n=a+(b^c^d)+x+t;return (n<<s|n>>>32-s)+b;}function II(a,b,c,d,x,s,t){var n=a+(c^(b|~d))+x+t;return (n<<s|n>>>32-s)+b;}/**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.MD5('message');
  	     *     var hash = CryptoJS.MD5(wordArray);
  	     */C.MD5=Hasher._createHelper(MD5);/**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacMD5(message, key);
  	     */C.HmacMD5=Hasher._createHmacHelper(MD5);})(Math);return CryptoJS.MD5;});/***/},/* 35 */ /***/function(module,exports,__webpack_require__){(function(root,factory){{// CommonJS
  module.exports=exports=factory();}})(this,function(){/**
  	 * CryptoJS core components.
  	 */var CryptoJS=CryptoJS||function(Math,undefined$1){/*
  	     * Local polyfil of Object.create
  	     */var create=Object.create||function(){function F(){}return function(obj){var subtype;F.prototype=obj;subtype=new F();F.prototype=null;return subtype;};}();/**
  	     * CryptoJS namespace.
  	     */var C={};/**
  	     * Library namespace.
  	     */var C_lib=C.lib={};/**
  	     * Base object for prototypal inheritance.
  	     */var Base=C_lib.Base=function(){return {/**
  	             * Creates a new object that inherits from this object.
  	             *
  	             * @param {Object} overrides Properties to copy into the new object.
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         field: 'value',
  	             *
  	             *         method: function () {
  	             *         }
  	             *     });
  	             */extend:function extend(overrides){// Spawn
  var subtype=create(this);// Augment
  if(overrides){subtype.mixIn(overrides);}// Create default initializer
  if(!subtype.hasOwnProperty('init')||this.init===subtype.init){subtype.init=function(){subtype.$super.init.apply(this,arguments);};}// Initializer's prototype is the subtype object
  subtype.init.prototype=subtype;// Reference supertype
  subtype.$super=this;return subtype;},/**
  	             * Extends this object and runs the init method.
  	             * Arguments to create() will be passed to init().
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var instance = MyType.create();
  	             */create:function create(){var instance=this.extend();instance.init.apply(instance,arguments);return instance;},/**
  	             * Initializes a newly created object.
  	             * Override this method to add some logic when your objects are created.
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         init: function () {
  	             *             // ...
  	             *         }
  	             *     });
  	             */init:function init(){},/**
  	             * Copies properties into this object.
  	             *
  	             * @param {Object} properties The properties to mix in.
  	             *
  	             * @example
  	             *
  	             *     MyType.mixIn({
  	             *         field: 'value'
  	             *     });
  	             */mixIn:function mixIn(properties){for(var propertyName in properties){if(properties.hasOwnProperty(propertyName)){this[propertyName]=properties[propertyName];}}// IE won't copy toString using the loop above
  if(properties.hasOwnProperty('toString')){this.toString=properties.toString;}},/**
  	             * Creates a copy of this object.
  	             *
  	             * @return {Object} The clone.
  	             *
  	             * @example
  	             *
  	             *     var clone = instance.clone();
  	             */clone:function clone(){return this.init.prototype.extend(this);}};}();/**
  	     * An array of 32-bit words.
  	     *
  	     * @property {Array} words The array of 32-bit words.
  	     * @property {number} sigBytes The number of significant bytes in this word array.
  	     */var WordArray=C_lib.WordArray=Base.extend({/**
  	         * Initializes a newly created word array.
  	         *
  	         * @param {Array} words (Optional) An array of 32-bit words.
  	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.create();
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
  	         */init:function init(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined$1){this.sigBytes=sigBytes;}else {this.sigBytes=words.length*4;}},/**
  	         * Converts this word array to a string.
  	         *
  	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
  	         *
  	         * @return {string} The stringified word array.
  	         *
  	         * @example
  	         *
  	         *     var string = wordArray + '';
  	         *     var string = wordArray.toString();
  	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
  	         */toString:function toString(encoder){return (encoder||Hex).stringify(this);},/**
  	         * Concatenates a word array to this word array.
  	         *
  	         * @param {WordArray} wordArray The word array to append.
  	         *
  	         * @return {WordArray} This word array.
  	         *
  	         * @example
  	         *
  	         *     wordArray1.concat(wordArray2);
  	         */concat:function concat(wordArray){// Shortcuts
  var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;// Clamp excess bits
  this.clamp();// Concat
  if(thisSigBytes%4){// Copy one byte at a time
  for(var i=0;i<thatSigBytes;i++){var thatByte=thatWords[i>>>2]>>>24-i%4*8&0xff;thisWords[thisSigBytes+i>>>2]|=thatByte<<24-(thisSigBytes+i)%4*8;}}else {// Copy one word at a time
  for(var i=0;i<thatSigBytes;i+=4){thisWords[thisSigBytes+i>>>2]=thatWords[i>>>2];}}this.sigBytes+=thatSigBytes;// Chainable
  return this;},/**
  	         * Removes insignificant bits.
  	         *
  	         * @example
  	         *
  	         *     wordArray.clamp();
  	         */clamp:function clamp(){// Shortcuts
  var words=this.words;var sigBytes=this.sigBytes;// Clamp
  words[sigBytes>>>2]&=0xffffffff<<32-sigBytes%4*8;words.length=Math.ceil(sigBytes/4);},/**
  	         * Creates a copy of this word array.
  	         *
  	         * @return {WordArray} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = wordArray.clone();
  	         */clone:function clone(){var clone=Base.clone.call(this);clone.words=this.words.slice(0);return clone;},/**
  	         * Creates a word array filled with random bytes.
  	         *
  	         * @param {number} nBytes The number of random bytes to generate.
  	         *
  	         * @return {WordArray} The random word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
  	         */random:function random(nBytes){var words=[];var r=function r(m_w){var m_w=m_w;var m_z=0x3ade68b1;var mask=0xffffffff;return function(){m_z=0x9069*(m_z&0xFFFF)+(m_z>>0x10)&mask;m_w=0x4650*(m_w&0xFFFF)+(m_w>>0x10)&mask;var result=(m_z<<0x10)+m_w&mask;result/=0x100000000;result+=0.5;return result*(Math.random()>.5?1:-1);};};for(var i=0,rcache;i<nBytes;i+=4){var _r=r((rcache||Math.random())*0x100000000);rcache=_r()*0x3ade67b7;words.push(_r()*0x100000000|0);}return new WordArray.init(words,nBytes);}});/**
  	     * Encoder namespace.
  	     */var C_enc=C.enc={};/**
  	     * Hex encoding strategy.
  	     */var Hex=C_enc.Hex={/**
  	         * Converts a word array to a hex string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The hex string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
  	         */stringify:function stringify(wordArray){// Shortcuts
  var words=wordArray.words;var sigBytes=wordArray.sigBytes;// Convert
  var hexChars=[];for(var i=0;i<sigBytes;i++){var bite=words[i>>>2]>>>24-i%4*8&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16));}return hexChars.join('');},/**
  	         * Converts a hex string to a word array.
  	         *
  	         * @param {string} hexStr The hex string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
  	         */parse:function parse(hexStr){// Shortcut
  var hexStrLength=hexStr.length;// Convert
  var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<24-i%8*4;}return new WordArray.init(words,hexStrLength/2);}};/**
  	     * Latin1 encoding strategy.
  	     */var Latin1=C_enc.Latin1={/**
  	         * Converts a word array to a Latin1 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Latin1 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
  	         */stringify:function stringify(wordArray){// Shortcuts
  var words=wordArray.words;var sigBytes=wordArray.sigBytes;// Convert
  var latin1Chars=[];for(var i=0;i<sigBytes;i++){var bite=words[i>>>2]>>>24-i%4*8&0xff;latin1Chars.push(String.fromCharCode(bite));}return latin1Chars.join('');},/**
  	         * Converts a Latin1 string to a word array.
  	         *
  	         * @param {string} latin1Str The Latin1 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
  	         */parse:function parse(latin1Str){// Shortcut
  var latin1StrLength=latin1Str.length;// Convert
  var words=[];for(var i=0;i<latin1StrLength;i++){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<24-i%4*8;}return new WordArray.init(words,latin1StrLength);}};/**
  	     * UTF-8 encoding strategy.
  	     */var Utf8=C_enc.Utf8={/**
  	         * Converts a word array to a UTF-8 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The UTF-8 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
  	         */stringify:function stringify(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)));}catch(e){throw new Error('Malformed UTF-8 data');}},/**
  	         * Converts a UTF-8 string to a word array.
  	         *
  	         * @param {string} utf8Str The UTF-8 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
  	         */parse:function parse(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)));}};/**
  	     * Abstract buffered block algorithm template.
  	     *
  	     * The property blockSize must be implemented in a concrete subtype.
  	     *
  	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
  	     */var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm=Base.extend({/**
  	         * Resets this block algorithm's data buffer to its initial state.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm.reset();
  	         */reset:function reset(){// Initial values
  this._data=new WordArray.init();this._nDataBytes=0;},/**
  	         * Adds new data to this block algorithm's buffer.
  	         *
  	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm._append('data');
  	         *     bufferedBlockAlgorithm._append(wordArray);
  	         */_append:function _append(data){// Convert string to WordArray, else assume WordArray already
  if(typeof data=='string'){data=Utf8.parse(data);}// Append
  this._data.concat(data);this._nDataBytes+=data.sigBytes;},/**
  	         * Processes available data blocks.
  	         *
  	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
  	         *
  	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
  	         *
  	         * @return {WordArray} The processed data.
  	         *
  	         * @example
  	         *
  	         *     var processedData = bufferedBlockAlgorithm._process();
  	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
  	         */_process:function _process(doFlush){// Shortcuts
  var data=this._data;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSize=this.blockSize;var blockSizeBytes=blockSize*4;// Count blocks ready
  var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){// Round up to include partial blocks
  nBlocksReady=Math.ceil(nBlocksReady);}else {// Round down to include only full blocks,
  // less the number of blocks that must remain in the buffer
  nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0);}// Count words ready
  var nWordsReady=nBlocksReady*blockSize;// Count bytes ready
  var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);// Process blocks
  if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){// Perform concrete-algorithm logic
  this._doProcessBlock(dataWords,offset);}// Remove processed words
  var processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady;}// Return processed words
  return new WordArray.init(processedWords,nBytesReady);},/**
  	         * Creates a copy of this object.
  	         *
  	         * @return {Object} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = bufferedBlockAlgorithm.clone();
  	         */clone:function clone(){var clone=Base.clone.call(this);clone._data=this._data.clone();return clone;},_minBufferSize:0});/**
  	     * Abstract hasher template.
  	     *
  	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
  	     */var Hasher=C_lib.Hasher=BufferedBlockAlgorithm.extend({/**
  	         * Configuration options.
  	         */cfg:Base.extend(),/**
  	         * Initializes a newly created hasher.
  	         *
  	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
  	         *
  	         * @example
  	         *
  	         *     var hasher = CryptoJS.algo.SHA256.create();
  	         */init:function init(cfg){// Apply config defaults
  this.cfg=this.cfg.extend(cfg);// Set initial values
  this.reset();},/**
  	         * Resets this hasher to its initial state.
  	         *
  	         * @example
  	         *
  	         *     hasher.reset();
  	         */reset:function reset(){// Reset data buffer
  BufferedBlockAlgorithm.reset.call(this);// Perform concrete-hasher logic
  this._doReset();},/**
  	         * Updates this hasher with a message.
  	         *
  	         * @param {WordArray|string} messageUpdate The message to append.
  	         *
  	         * @return {Hasher} This hasher.
  	         *
  	         * @example
  	         *
  	         *     hasher.update('message');
  	         *     hasher.update(wordArray);
  	         */update:function update(messageUpdate){// Append
  this._append(messageUpdate);// Update the hash
  this._process();// Chainable
  return this;},/**
  	         * Finalizes the hash computation.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  	         *
  	         * @return {WordArray} The hash.
  	         *
  	         * @example
  	         *
  	         *     var hash = hasher.finalize();
  	         *     var hash = hasher.finalize('message');
  	         *     var hash = hasher.finalize(wordArray);
  	         */finalize:function finalize(messageUpdate){// Final message update
  if(messageUpdate){this._append(messageUpdate);}// Perform concrete-hasher logic
  var hash=this._doFinalize();return hash;},blockSize:512/32,/**
  	         * Creates a shortcut function to a hasher's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to create a helper for.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
  	         */_createHelper:function _createHelper(hasher){return function(message,cfg){return new hasher.init(cfg).finalize(message);};},/**
  	         * Creates a shortcut function to the HMAC's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
  	         */_createHmacHelper:function _createHmacHelper(hasher){return function(message,key){return new C_algo.HMAC.init(hasher,key).finalize(message);};}});/**
  	     * Algorithm namespace.
  	     */var C_algo=C.algo={};return C;}(Math);return CryptoJS;});/***/},/* 36 */ /***/function(module,exports,__webpack_require__){var Grammar=__webpack_require__(37);module.exports=function(SIP){return {parse:function parseCustom(input,startRule){var options={startRule:startRule,SIP:SIP};try{Grammar.parse(input,options);}catch(e){options.data=-1;}return options.data;}};};/***/},/* 37 */ /***/function(module,exports,__webpack_require__){/*
   * Generated by PEG.js 0.10.0.
   *
   * http://pegjs.org/
   */function peg$subclass(child,parent){function ctor(){this.constructor=child;}ctor.prototype=parent.prototype;child.prototype=new ctor();}function peg$SyntaxError(message,expected,found,location){this.message=message;this.expected=expected;this.found=found;this.location=location;this.name="SyntaxError";if(typeof Error.captureStackTrace==="function"){Error.captureStackTrace(this,peg$SyntaxError);}}peg$subclass(peg$SyntaxError,Error);peg$SyntaxError.buildMessage=function(expected,found){var DESCRIBE_EXPECTATION_FNS={literal:function literal(expectation){return "\""+literalEscape(expectation.text)+"\"";},"class":function _class(expectation){var escapedParts="",i;for(i=0;i<expectation.parts.length;i++){escapedParts+=expectation.parts[i]instanceof Array?classEscape(expectation.parts[i][0])+"-"+classEscape(expectation.parts[i][1]):classEscape(expectation.parts[i]);}return "["+(expectation.inverted?"^":"")+escapedParts+"]";},any:function any(expectation){return "any character";},end:function end(expectation){return "end of input";},other:function other(expectation){return expectation.description;}};function hex(ch){return ch.charCodeAt(0).toString(16).toUpperCase();}function literalEscape(s){return s.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\0/g,'\\0').replace(/\t/g,'\\t').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/[\x00-\x0F]/g,function(ch){return '\\x0'+hex(ch);}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(ch){return '\\x'+hex(ch);});}function classEscape(s){return s.replace(/\\/g,'\\\\').replace(/\]/g,'\\]').replace(/\^/g,'\\^').replace(/-/g,'\\-').replace(/\0/g,'\\0').replace(/\t/g,'\\t').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/[\x00-\x0F]/g,function(ch){return '\\x0'+hex(ch);}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(ch){return '\\x'+hex(ch);});}function describeExpectation(expectation){return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);}function describeExpected(expected){var descriptions=new Array(expected.length),i,j;for(i=0;i<expected.length;i++){descriptions[i]=describeExpectation(expected[i]);}descriptions.sort();if(descriptions.length>0){for(i=1,j=1;i<descriptions.length;i++){if(descriptions[i-1]!==descriptions[i]){descriptions[j]=descriptions[i];j++;}}descriptions.length=j;}switch(descriptions.length){case 1:return descriptions[0];case 2:return descriptions[0]+" or "+descriptions[1];default:return descriptions.slice(0,-1).join(", ")+", or "+descriptions[descriptions.length-1];}}function describeFound(found){return found?"\""+literalEscape(found)+"\"":"end of input";}return "Expected "+describeExpected(expected)+" but "+describeFound(found)+" found.";};function peg$parse(input,options){options=options!==void 0?options:{};var peg$FAILED={},peg$startRuleIndices={Contact:119,Name_Addr_Header:156,Record_Route:176,Request_Response:81,SIP_URI:45,Subscription_State:186,Supported:191,Require:182,Via:194,absoluteURI:84,Call_ID:118,Content_Disposition:130,Content_Length:135,Content_Type:136,CSeq:146,displayName:122,Event:149,From:151,host:52,Max_Forwards:154,Min_SE:213,Proxy_Authenticate:157,quoted_string:40,Refer_To:178,Replaces:179,Session_Expires:210,stun_URI:217,To:192,turn_URI:223,uuid:226,WWW_Authenticate:209,challenge:158,sipfrag:230,Referred_By:231},peg$startRuleIndex=119,peg$consts=["\r\n",peg$literalExpectation("\r\n",false),/^[0-9]/,peg$classExpectation([["0","9"]],false,false),/^[a-zA-Z]/,peg$classExpectation([["a","z"],["A","Z"]],false,false),/^[0-9a-fA-F]/,peg$classExpectation([["0","9"],["a","f"],["A","F"]],false,false),/^[\0-\xFF]/,peg$classExpectation([["\0","\xFF"]],false,false),/^["]/,peg$classExpectation(["\""],false,false)," ",peg$literalExpectation(" ",false),"\t",peg$literalExpectation("\t",false),/^[a-zA-Z0-9]/,peg$classExpectation([["a","z"],["A","Z"],["0","9"]],false,false),";",peg$literalExpectation(";",false),"/",peg$literalExpectation("/",false),"?",peg$literalExpectation("?",false),":",peg$literalExpectation(":",false),"@",peg$literalExpectation("@",false),"&",peg$literalExpectation("&",false),"=",peg$literalExpectation("=",false),"+",peg$literalExpectation("+",false),"$",peg$literalExpectation("$",false),",",peg$literalExpectation(",",false),"-",peg$literalExpectation("-",false),"_",peg$literalExpectation("_",false),".",peg$literalExpectation(".",false),"!",peg$literalExpectation("!",false),"~",peg$literalExpectation("~",false),"*",peg$literalExpectation("*",false),"'",peg$literalExpectation("'",false),"(",peg$literalExpectation("(",false),")",peg$literalExpectation(")",false),"%",peg$literalExpectation("%",false),function(){return " ";},function(){return ':';},/^[!-~]/,peg$classExpectation([["!","~"]],false,false),/^[\x80-\uFFFF]/,peg$classExpectation([["\x80","\uFFFF"]],false,false),/^[\x80-\xBF]/,peg$classExpectation([["\x80","\xBF"]],false,false),/^[a-f]/,peg$classExpectation([["a","f"]],false,false),"`",peg$literalExpectation("`",false),"<",peg$literalExpectation("<",false),">",peg$literalExpectation(">",false),"\\",peg$literalExpectation("\\",false),"[",peg$literalExpectation("[",false),"]",peg$literalExpectation("]",false),"{",peg$literalExpectation("{",false),"}",peg$literalExpectation("}",false),function(){return "*";},function(){return "/";},function(){return "=";},function(){return "(";},function(){return ")";},function(){return ">";},function(){return "<";},function(){return ",";},function(){return ";";},function(){return ":";},function(){return "\"";},/^[!-']/,peg$classExpectation([["!","'"]],false,false),/^[*-[]/,peg$classExpectation([["*","["]],false,false),/^[\]-~]/,peg$classExpectation([["]","~"]],false,false),function(contents){return contents;},/^[#-[]/,peg$classExpectation([["#","["]],false,false),/^[\0-\t]/,peg$classExpectation([["\0","\t"]],false,false),/^[\x0B-\f]/,peg$classExpectation([["\x0B","\f"]],false,false),/^[\x0E-\x7F]/,peg$classExpectation([["\x0E","\x7F"]],false,false),function(){options.data.uri=new options.SIP.URI(options.data.scheme,options.data.user,options.data.host,options.data.port);delete options.data.scheme;delete options.data.user;delete options.data.host;delete options.data.host_type;delete options.data.port;},function(){options.data.uri=new options.SIP.URI(options.data.scheme,options.data.user,options.data.host,options.data.port,options.data.uri_params,options.data.uri_headers);delete options.data.scheme;delete options.data.user;delete options.data.host;delete options.data.host_type;delete options.data.port;delete options.data.uri_params;if(options.startRule==='SIP_URI'){options.data=options.data.uri;}},"sips",peg$literalExpectation("sips",true),"sip",peg$literalExpectation("sip",true),function(uri_scheme){options.data.scheme=uri_scheme;},function(){options.data.user=decodeURIComponent(text().slice(0,-1));},function(){options.data.password=text();},function(){options.data.host=text();return options.data.host;},function(){options.data.host_type='domain';return text();},/^[a-zA-Z0-9_\-]/,peg$classExpectation([["a","z"],["A","Z"],["0","9"],"_","-"],false,false),/^[a-zA-Z0-9\-]/,peg$classExpectation([["a","z"],["A","Z"],["0","9"],"-"],false,false),function(){options.data.host_type='IPv6';return text();},"::",peg$literalExpectation("::",false),function(){options.data.host_type='IPv6';return text();},function(){options.data.host_type='IPv4';return text();},"25",peg$literalExpectation("25",false),/^[0-5]/,peg$classExpectation([["0","5"]],false,false),"2",peg$literalExpectation("2",false),/^[0-4]/,peg$classExpectation([["0","4"]],false,false),"1",peg$literalExpectation("1",false),/^[1-9]/,peg$classExpectation([["1","9"]],false,false),function(port){port=parseInt(port.join(''));options.data.port=port;return port;},"transport=",peg$literalExpectation("transport=",true),"udp",peg$literalExpectation("udp",true),"tcp",peg$literalExpectation("tcp",true),"sctp",peg$literalExpectation("sctp",true),"tls",peg$literalExpectation("tls",true),function(transport){if(!options.data.uri_params)options.data.uri_params={};options.data.uri_params['transport']=transport.toLowerCase();},"user=",peg$literalExpectation("user=",true),"phone",peg$literalExpectation("phone",true),"ip",peg$literalExpectation("ip",true),function(user){if(!options.data.uri_params)options.data.uri_params={};options.data.uri_params['user']=user.toLowerCase();},"method=",peg$literalExpectation("method=",true),function(method){if(!options.data.uri_params)options.data.uri_params={};options.data.uri_params['method']=method;},"ttl=",peg$literalExpectation("ttl=",true),function(ttl){if(!options.data.params)options.data.params={};options.data.params['ttl']=ttl;},"maddr=",peg$literalExpectation("maddr=",true),function(maddr){if(!options.data.uri_params)options.data.uri_params={};options.data.uri_params['maddr']=maddr;},"lr",peg$literalExpectation("lr",true),function(){if(!options.data.uri_params)options.data.uri_params={};options.data.uri_params['lr']=undefined;},function(param,value){if(!options.data.uri_params)options.data.uri_params={};if(value===null){value=undefined;}else {value=value[1];}options.data.uri_params[param.toLowerCase()]=value;},function(hname,hvalue){hname=hname.join('').toLowerCase();hvalue=hvalue.join('');if(!options.data.uri_headers)options.data.uri_headers={};if(!options.data.uri_headers[hname]){options.data.uri_headers[hname]=[hvalue];}else {options.data.uri_headers[hname].push(hvalue);}},function(){// lots of tests fail if this isn't guarded...
  if(options.startRule==='Refer_To'){options.data.uri=new options.SIP.URI(options.data.scheme,options.data.user,options.data.host,options.data.port,options.data.uri_params,options.data.uri_headers);delete options.data.scheme;delete options.data.user;delete options.data.host;delete options.data.host_type;delete options.data.port;delete options.data.uri_params;}},"//",peg$literalExpectation("//",false),function(){options.data.scheme=text();},peg$literalExpectation("SIP",true),function(){options.data.sip_version=text();},"INVITE",peg$literalExpectation("INVITE",false),"ACK",peg$literalExpectation("ACK",false),"VXACH",peg$literalExpectation("VXACH",false),"OPTIONS",peg$literalExpectation("OPTIONS",false),"BYE",peg$literalExpectation("BYE",false),"CANCEL",peg$literalExpectation("CANCEL",false),"REGISTER",peg$literalExpectation("REGISTER",false),"SUBSCRIBE",peg$literalExpectation("SUBSCRIBE",false),"NOTIFY",peg$literalExpectation("NOTIFY",false),"REFER",peg$literalExpectation("REFER",false),"PUBLISH",peg$literalExpectation("PUBLISH",false),function(){options.data.method=text();return options.data.method;},function(status_code){options.data.status_code=parseInt(status_code.join(''));},function(){options.data.reason_phrase=text();},function(){options.data=text();},function(){var idx,length;length=options.data.multi_header.length;for(idx=0;idx<length;idx++){if(options.data.multi_header[idx].parsed===null){options.data=null;break;}}if(options.data!==null){options.data=options.data.multi_header;}else {options.data=-1;}},function(){var header;if(!options.data.multi_header)options.data.multi_header=[];try{header=new options.SIP.NameAddrHeader(options.data.uri,options.data.displayName,options.data.params);delete options.data.uri;delete options.data.displayName;delete options.data.params;}catch(e){header=null;}options.data.multi_header.push({'position':peg$currPos,'offset':location().start.offset,'parsed':header});},function(displayName){displayName=text().trim();if(displayName[0]==='\"'){displayName=displayName.substring(1,displayName.length-1);}options.data.displayName=displayName;},"q",peg$literalExpectation("q",true),function(q){if(!options.data.params)options.data.params={};options.data.params['q']=q;},"expires",peg$literalExpectation("expires",true),function(expires){if(!options.data.params)options.data.params={};options.data.params['expires']=expires;},function(delta_seconds){return parseInt(delta_seconds.join(''));},"0",peg$literalExpectation("0",false),function(){return parseFloat(text());},function(param,value){if(!options.data.params)options.data.params={};if(value===null){value=undefined;}else {value=value[1];}options.data.params[param.toLowerCase()]=value;},"render",peg$literalExpectation("render",true),"session",peg$literalExpectation("session",true),"icon",peg$literalExpectation("icon",true),"alert",peg$literalExpectation("alert",true),function(){if(options.startRule==='Content_Disposition'){options.data.type=text().toLowerCase();}},"handling",peg$literalExpectation("handling",true),"optional",peg$literalExpectation("optional",true),"required",peg$literalExpectation("required",true),function(length){options.data=parseInt(length.join(''));},function(){options.data=text();},"text",peg$literalExpectation("text",true),"image",peg$literalExpectation("image",true),"audio",peg$literalExpectation("audio",true),"video",peg$literalExpectation("video",true),"application",peg$literalExpectation("application",true),"message",peg$literalExpectation("message",true),"multipart",peg$literalExpectation("multipart",true),"x-",peg$literalExpectation("x-",true),function(cseq_value){options.data.value=parseInt(cseq_value.join(''));},function(expires){options.data=expires;},function(event_type){options.data.event=event_type.toLowerCase();},function(){var tag=options.data.tag;options.data=new options.SIP.NameAddrHeader(options.data.uri,options.data.displayName,options.data.params);if(tag){options.data.setParam('tag',tag);}},"tag",peg$literalExpectation("tag",true),function(tag){options.data.tag=tag;},function(forwards){options.data=parseInt(forwards.join(''));},function(min_expires){options.data=min_expires;},function(){options.data=new options.SIP.NameAddrHeader(options.data.uri,options.data.displayName,options.data.params);},"digest",peg$literalExpectation("Digest",true),"realm",peg$literalExpectation("realm",true),function(realm){options.data.realm=realm;},"domain",peg$literalExpectation("domain",true),"nonce",peg$literalExpectation("nonce",true),function(nonce){options.data.nonce=nonce;},"opaque",peg$literalExpectation("opaque",true),function(opaque){options.data.opaque=opaque;},"stale",peg$literalExpectation("stale",true),"true",peg$literalExpectation("true",true),function(){options.data.stale=true;},"false",peg$literalExpectation("false",true),function(){options.data.stale=false;},"algorithm",peg$literalExpectation("algorithm",true),"md5",peg$literalExpectation("MD5",true),"md5-sess",peg$literalExpectation("MD5-sess",true),function(algorithm){options.data.algorithm=algorithm.toUpperCase();},"qop",peg$literalExpectation("qop",true),"auth-int",peg$literalExpectation("auth-int",true),"auth",peg$literalExpectation("auth",true),function(qop_value){options.data.qop||(options.data.qop=[]);options.data.qop.push(qop_value.toLowerCase());},function(rack_value){options.data.value=parseInt(rack_value.join(''));},function(){var idx,length;length=options.data.multi_header.length;for(idx=0;idx<length;idx++){if(options.data.multi_header[idx].parsed===null){options.data=null;break;}}if(options.data!==null){options.data=options.data.multi_header;}else {options.data=-1;}},function(){var header;if(!options.data.multi_header)options.data.multi_header=[];try{header=new options.SIP.NameAddrHeader(options.data.uri,options.data.displayName,options.data.params);delete options.data.uri;delete options.data.displayName;delete options.data.params;}catch(e){header=null;}options.data.multi_header.push({'position':peg$currPos,'offset':location().start.offset,'parsed':header});},function(){options.data=new options.SIP.NameAddrHeader(options.data.uri,options.data.displayName,options.data.params);},function(){if(!(options.data.replaces_from_tag&&options.data.replaces_to_tag)){options.data=-1;}},function(){options.data={call_id:options.data};},"from-tag",peg$literalExpectation("from-tag",true),function(from_tag){options.data.replaces_from_tag=from_tag;},"to-tag",peg$literalExpectation("to-tag",true),function(to_tag){options.data.replaces_to_tag=to_tag;},"early-only",peg$literalExpectation("early-only",true),function(){options.data.early_only=true;},function(head,r){return r;},function(head,tail){return list(head,tail);},function(value){if(options.startRule==='Require'){options.data=value||[];}},function(rseq_value){options.data.value=parseInt(rseq_value.join(''));},"active",peg$literalExpectation("active",true),"pending",peg$literalExpectation("pending",true),"terminated",peg$literalExpectation("terminated",true),function(){options.data.state=text();},"reason",peg$literalExpectation("reason",true),function(reason){if(typeof reason!=='undefined')options.data.reason=reason;},function(expires){if(typeof expires!=='undefined')options.data.expires=expires;},"retry_after",peg$literalExpectation("retry_after",true),function(retry_after){if(typeof retry_after!=='undefined')options.data.retry_after=retry_after;},"deactivated",peg$literalExpectation("deactivated",true),"probation",peg$literalExpectation("probation",true),"rejected",peg$literalExpectation("rejected",true),"timeout",peg$literalExpectation("timeout",true),"giveup",peg$literalExpectation("giveup",true),"noresource",peg$literalExpectation("noresource",true),"invariant",peg$literalExpectation("invariant",true),function(value){if(options.startRule==='Supported'){options.data=value||[];}},function(){var tag=options.data.tag;options.data=new options.SIP.NameAddrHeader(options.data.uri,options.data.displayName,options.data.params);if(tag){options.data.setParam('tag',tag);}},"ttl",peg$literalExpectation("ttl",true),function(via_ttl_value){options.data.ttl=via_ttl_value;},"maddr",peg$literalExpectation("maddr",true),function(via_maddr){options.data.maddr=via_maddr;},"received",peg$literalExpectation("received",true),function(via_received){options.data.received=via_received;},"branch",peg$literalExpectation("branch",true),function(via_branch){options.data.branch=via_branch;},"rport",peg$literalExpectation("rport",true),function(){if(typeof response_port!=='undefined')options.data.rport=response_port.join('');},function(via_protocol){options.data.protocol=via_protocol;},peg$literalExpectation("UDP",true),peg$literalExpectation("TCP",true),peg$literalExpectation("TLS",true),peg$literalExpectation("SCTP",true),function(via_transport){options.data.transport=via_transport;},function(){options.data.host=text();},function(via_sent_by_port){options.data.port=parseInt(via_sent_by_port.join(''));},function(ttl){return parseInt(ttl.join(''));},function(deltaSeconds){if(options.startRule==='Session_Expires'){options.data.deltaSeconds=deltaSeconds;}},"refresher",peg$literalExpectation("refresher",false),"uas",peg$literalExpectation("uas",false),"uac",peg$literalExpectation("uac",false),function(endpoint){if(options.startRule==='Session_Expires'){options.data.refresher=endpoint;}},function(deltaSeconds){if(options.startRule==='Min_SE'){options.data=deltaSeconds;}},"stuns",peg$literalExpectation("stuns",true),"stun",peg$literalExpectation("stun",true),function(scheme){options.data.scheme=scheme;},function(host){options.data.host=host;},"?transport=",peg$literalExpectation("?transport=",false),"turns",peg$literalExpectation("turns",true),"turn",peg$literalExpectation("turn",true),function(){options.data.transport=transport;},function(){options.data=text();},"Referred-By",peg$literalExpectation("Referred-By",false),"b",peg$literalExpectation("b",false),"cid",peg$literalExpectation("cid",false)],peg$bytecode=[peg$decode("2 \"\"6 7!"),peg$decode("4\"\"\"5!7#"),peg$decode("4$\"\"5!7%"),peg$decode("4&\"\"5!7'"),peg$decode(";'.# &;("),peg$decode("4(\"\"5!7)"),peg$decode("4*\"\"5!7+"),peg$decode("2,\"\"6,7-"),peg$decode("2.\"\"6.7/"),peg$decode("40\"\"5!71"),peg$decode("22\"\"6273.\x89 &24\"\"6475.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),peg$decode(";).# &;,"),peg$decode("2F\"\"6F7G.} &2H\"\"6H7I.q &2J\"\"6J7K.e &2L\"\"6L7M.Y &2N\"\"6N7O.M &2P\"\"6P7Q.A &2R\"\"6R7S.5 &2T\"\"6T7U.) &2V\"\"6V7W"),peg$decode("%%2X\"\"6X7Y/5#;#/,$;#/#$+#)(#'#(\"'#&'#/\"!&,)"),peg$decode("%%$;$0#*;$&/,#; /#$+\")(\"'#&'#.\" &\"/=#$;$/&#0#*;$&&&#/'$8\":Z\" )(\"'#&'#"),peg$decode(";..\" &\""),peg$decode("%$;'.# &;(0)*;'.# &;(&/?#28\"\"6879/0$;//'$8#:[# )(#'#(\"'#&'#"),peg$decode("%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+\")(\"'#&'#0=*%$;.0#*;.&/,#;2/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),peg$decode("4\\\"\"5!7].# &;3"),peg$decode("4^\"\"5!7_"),peg$decode("4`\"\"5!7a"),peg$decode(";!.) &4b\"\"5!7c"),peg$decode("%$;).\x95 &2F\"\"6F7G.\x89 &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/\x9E#0\x9B*;).\x95 &2F\"\"6F7G.\x89 &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),peg$decode("%$;).\x89 &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/\x92#0\x8F*;).\x89 &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),peg$decode("2T\"\"6T7U.\xE3 &2V\"\"6V7W.\xD7 &2f\"\"6f7g.\xCB &2h\"\"6h7i.\xBF &2:\"\"6:7;.\xB3 &2D\"\"6D7E.\xA7 &22\"\"6273.\x9B &28\"\"6879.\x8F &2j\"\"6j7k.\x83 &;&.} &24\"\"6475.q &2l\"\"6l7m.e &2n\"\"6n7o.Y &26\"\"6677.M &2>\"\"6>7?.A &2p\"\"6p7q.5 &2r\"\"6r7s.) &;'.# &;("),peg$decode("%$;).\u012B &2F\"\"6F7G.\u011F &2J\"\"6J7K.\u0113 &2L\"\"6L7M.\u0107 &2X\"\"6X7Y.\xFB &2P\"\"6P7Q.\xEF &2H\"\"6H7I.\xE3 &2@\"\"6@7A.\xD7 &2d\"\"6d7e.\xCB &2R\"\"6R7S.\xBF &2N\"\"6N7O.\xB3 &2T\"\"6T7U.\xA7 &2V\"\"6V7W.\x9B &2f\"\"6f7g.\x8F &2h\"\"6h7i.\x83 &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s/\u0134#0\u0131*;).\u012B &2F\"\"6F7G.\u011F &2J\"\"6J7K.\u0113 &2L\"\"6L7M.\u0107 &2X\"\"6X7Y.\xFB &2P\"\"6P7Q.\xEF &2H\"\"6H7I.\xE3 &2@\"\"6@7A.\xD7 &2d\"\"6d7e.\xCB &2R\"\"6R7S.\xBF &2N\"\"6N7O.\xB3 &2T\"\"6T7U.\xA7 &2V\"\"6V7W.\x9B &2f\"\"6f7g.\x8F &2h\"\"6h7i.\x83 &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s&&&#/\"!&,)"),peg$decode("%;//?#2P\"\"6P7Q/0$;//'$8#:t# )(#'#(\"'#&'#"),peg$decode("%;//?#24\"\"6475/0$;//'$8#:u# )(#'#(\"'#&'#"),peg$decode("%;//?#2>\"\"6>7?/0$;//'$8#:v# )(#'#(\"'#&'#"),peg$decode("%;//?#2T\"\"6T7U/0$;//'$8#:w# )(#'#(\"'#&'#"),peg$decode("%;//?#2V\"\"6V7W/0$;//'$8#:x# )(#'#(\"'#&'#"),peg$decode("%2h\"\"6h7i/0#;//'$8\":y\" )(\"'#&'#"),peg$decode("%;//6#2f\"\"6f7g/'$8\":z\" )(\"'#&'#"),peg$decode("%;//?#2D\"\"6D7E/0$;//'$8#:{# )(#'#(\"'#&'#"),peg$decode("%;//?#22\"\"6273/0$;//'$8#:|# )(#'#(\"'#&'#"),peg$decode("%;//?#28\"\"6879/0$;//'$8#:}# )(#'#(\"'#&'#"),peg$decode("%;//0#;&/'$8\":~\" )(\"'#&'#"),peg$decode("%;&/0#;//'$8\":~\" )(\"'#&'#"),peg$decode("%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#(\"'#&'#"),peg$decode("4\x7F\"\"5!7\x80.A &4\x81\"\"5!7\x82.5 &4\x83\"\"5!7\x84.) &;3.# &;."),peg$decode("%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#(\"'#&'#/\"!&,)"),peg$decode("%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/\"!&,)/1$;&/($8$:\x85$!!)($'#(#'#(\"'#&'#"),peg$decode(";..G &2L\"\"6L7M.; &4\x86\"\"5!7\x87./ &4\x83\"\"5!7\x84.# &;3"),peg$decode("%2j\"\"6j7k/J#4\x88\"\"5!7\x89.5 &4\x8A\"\"5!7\x8B.) &4\x8C\"\"5!7\x8D/#$+\")(\"'#&'#"),peg$decode("%;N/M#28\"\"6879/>$;O.\" &\"/0$;S/'$8$:\x8E$ )($'#(#'#(\"'#&'#"),peg$decode("%;N/d#28\"\"6879/U$;O.\" &\"/G$;S/>$;_/5$;l.\" &\"/'$8&:\x8F& )(&'#(%'#($'#(#'#(\"'#&'#"),peg$decode("%3\x90\"\"5$7\x91.) &3\x92\"\"5#7\x93/' 8!:\x94!! )"),peg$decode("%;P/]#%28\"\"6879/,#;R/#$+\")(\"'#&'#.\" &\"/6$2:\"\"6:7;/'$8#:\x95# )(#'#(\"'#&'#"),peg$decode("$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#"),peg$decode("2<\"\"6<7=.q &2>\"\"6>7?.e &2@\"\"6@7A.Y &2B\"\"6B7C.M &2D\"\"6D7E.A &22\"\"6273.5 &26\"\"6677.) &24\"\"6475"),peg$decode("%$;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E0e*;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E&/& 8!:\x96! )"),peg$decode("%;T/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),peg$decode("%;U.) &;\\.# &;X/& 8!:\x97! )"),peg$decode("%$%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#0<*%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#&/D#;W/;$2J\"\"6J7K.\" &\"/'$8#:\x98# )(#'#(\"'#&'#"),peg$decode("$4\x99\"\"5!7\x9A/,#0)*4\x99\"\"5!7\x9A&&&#"),peg$decode("%4$\"\"5!7%/?#$4\x9B\"\"5!7\x9C0)*4\x9B\"\"5!7\x9C&/#$+\")(\"'#&'#"),peg$decode("%2l\"\"6l7m/?#;Y/6$2n\"\"6n7o/'$8#:\x9D# )(#'#(\"'#&'#"),peg$decode("%%;Z/\xB3#28\"\"6879/\xA4$;Z/\x9B$28\"\"6879/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+-)(-'#(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0790 &%2\x9E\"\"6\x9E7\x9F/\xA4#;Z/\x9B$28\"\"6879/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u06F9 &%2\x9E\"\"6\x9E7\x9F/\x8C#;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u067A &%2\x9E\"\"6\x9E7\x9F/t#;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0613 &%2\x9E\"\"6\x9E7\x9F/\\#;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+&)(&'#(%'#($'#(#'#(\"'#&'#.\u05C4 &%2\x9E\"\"6\x9E7\x9F/D#;Z/;$28\"\"6879/,$;[/#$+$)($'#(#'#(\"'#&'#.\u058D &%2\x9E\"\"6\x9E7\x9F/,#;[/#$+\")(\"'#&'#.\u056E &%2\x9E\"\"6\x9E7\x9F/,#;Z/#$+\")(\"'#&'#.\u054F &%;Z/\x9B#2\x9E\"\"6\x9E7\x9F/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u04C7 &%;Z/\xAA#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x83$2\x9E\"\"6\x9E7\x9F/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0430 &%;Z/\xB9#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x92$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/k$2\x9E\"\"6\x9E7\x9F/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+))()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u038A &%;Z/\xC8#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xA1$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/z$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/S$2\x9E\"\"6\x9E7\x9F/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u02D5 &%;Z/\xD7#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xB0$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x89$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\x9E\"\"6\x9E7\x9F/,$;[/#$+')(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0211 &%;Z/\xFE#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xD7$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xB0$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x89$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\x9E\"\"6\x9E7\x9F/,$;Z/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0126 &%;Z/\u011C#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xF5$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xCE$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xA7$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x80$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/Y$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/2$2\x9E\"\"6\x9E7\x9F/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/& 8!:\xA0! )"),peg$decode("%;#/M#;#.\" &\"/?$;#.\" &\"/1$;#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),peg$decode("%;Z/;#28\"\"6879/,$;Z/#$+#)(#'#(\"'#&'#.# &;\\"),peg$decode("%;]/o#2J\"\"6J7K/`$;]/W$2J\"\"6J7K/H$;]/?$2J\"\"6J7K/0$;]/'$8':\xA1' )(''#(&'#(%'#($'#(#'#(\"'#&'#"),peg$decode("%2\xA2\"\"6\xA27\xA3/2#4\xA4\"\"5!7\xA5/#$+\")(\"'#&'#.\x98 &%2\xA6\"\"6\xA67\xA7/;#4\xA8\"\"5!7\xA9/,$;!/#$+#)(#'#(\"'#&'#.j &%2\xAA\"\"6\xAA7\xAB/5#;!/,$;!/#$+#)(#'#(\"'#&'#.B &%4\xAC\"\"5!7\xAD/,#;!/#$+\")(\"'#&'#.# &;!"),peg$decode("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:\xAE!! )"),peg$decode("$%22\"\"6273/,#;`/#$+\")(\"'#&'#0<*%22\"\"6273/,#;`/#$+\")(\"'#&'#&"),peg$decode(";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g"),peg$decode("%3\xAF\"\"5*7\xB0/a#3\xB1\"\"5#7\xB2.G &3\xB3\"\"5#7\xB4.; &3\xB5\"\"5$7\xB6./ &3\xB7\"\"5#7\xB8.# &;6/($8\":\xB9\"! )(\"'#&'#"),peg$decode("%3\xBA\"\"5%7\xBB/I#3\xBC\"\"5%7\xBD./ &3\xBE\"\"5\"7\xBF.# &;6/($8\":\xC0\"! )(\"'#&'#"),peg$decode("%3\xC1\"\"5'7\xC2/1#;\x90/($8\":\xC3\"! )(\"'#&'#"),peg$decode("%3\xC4\"\"5$7\xC5/1#;\xF0/($8\":\xC6\"! )(\"'#&'#"),peg$decode("%3\xC7\"\"5&7\xC8/1#;T/($8\":\xC9\"! )(\"'#&'#"),peg$decode("%3\xCA\"\"5\"7\xCB/N#%2>\"\"6>7?/,#;6/#$+\")(\"'#&'#.\" &\"/'$8\":\xCC\" )(\"'#&'#"),peg$decode("%;h/P#%2>\"\"6>7?/,#;i/#$+\")(\"'#&'#.\" &\"/)$8\":\xCD\"\"! )(\"'#&'#"),peg$decode("%$;j/&#0#*;j&&&#/\"!&,)"),peg$decode("%$;j/&#0#*;j&&&#/\"!&,)"),peg$decode(";k.) &;+.# &;-"),peg$decode("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &28\"\"6879.A &2<\"\"6<7=.5 &2@\"\"6@7A.) &2B\"\"6B7C"),peg$decode("%26\"\"6677/n#;m/e$$%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#0<*%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#&/#$+#)(#'#(\"'#&'#"),peg$decode("%;n/A#2>\"\"6>7?/2$;o/)$8#:\xCE#\"\" )(#'#(\"'#&'#"),peg$decode("$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#"),peg$decode("$;p.) &;+.# &;-0/*;p.) &;+.# &;-&"),peg$decode("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &26\"\"6677.A &28\"\"6879.5 &2@\"\"6@7A.) &2B\"\"6B7C"),peg$decode(";\x91.# &;r"),peg$decode("%;\x90/G#;'/>$;s/5$;'/,$;\x84/#$+%)(%'#($'#(#'#(\"'#&'#"),peg$decode(";M.# &;t"),peg$decode("%;\x7F/E#28\"\"6879/6$;u.# &;x/'$8#:\xCF# )(#'#(\"'#&'#"),peg$decode("%;v.# &;w/J#%26\"\"6677/,#;\x83/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),peg$decode("%2\xD0\"\"6\xD07\xD1/:#;\x80/1$;w.\" &\"/#$+#)(#'#(\"'#&'#"),peg$decode("%24\"\"6475/,#;{/#$+\")(\"'#&'#"),peg$decode("%;z/3#$;y0#*;y&/#$+\")(\"'#&'#"),peg$decode(";*.) &;+.# &;-"),peg$decode(";+.\x8F &;-.\x89 &22\"\"6273.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),peg$decode("%;|/e#$%24\"\"6475/,#;|/#$+\")(\"'#&'#0<*%24\"\"6475/,#;|/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%$;~0#*;~&/e#$%22\"\"6273/,#;}/#$+\")(\"'#&'#0<*%22\"\"6273/,#;}/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("$;~0#*;~&"),peg$decode(";+.w &;-.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),peg$decode("%%;\"/\x87#$;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K0M*;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K&/#$+\")(\"'#&'#/& 8!:\xD2! )"),peg$decode(";\x81.# &;\x82"),peg$decode("%%;O/2#2:\"\"6:7;/#$+\")(\"'#&'#.\" &\"/,#;S/#$+\")(\"'#&'#.\" &\""),peg$decode("$;+.\x83 &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A/\x8C#0\x89*;+.\x83 &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A&&&#"),peg$decode("$;y0#*;y&"),peg$decode("%3\x92\"\"5#7\xD3/q#24\"\"6475/b$$;!/&#0#*;!&&&#/L$2J\"\"6J7K/=$$;!/&#0#*;!&&&#/'$8%:\xD4% )(%'#($'#(#'#(\"'#&'#"),peg$decode("2\xD5\"\"6\xD57\xD6"),peg$decode("2\xD7\"\"6\xD77\xD8"),peg$decode("2\xD9\"\"6\xD97\xDA"),peg$decode("2\xDB\"\"6\xDB7\xDC"),peg$decode("2\xDD\"\"6\xDD7\xDE"),peg$decode("2\xDF\"\"6\xDF7\xE0"),peg$decode("2\xE1\"\"6\xE17\xE2"),peg$decode("2\xE3\"\"6\xE37\xE4"),peg$decode("2\xE5\"\"6\xE57\xE6"),peg$decode("2\xE7\"\"6\xE77\xE8"),peg$decode("2\xE9\"\"6\xE97\xEA"),peg$decode("%;\x85.Y &;\x86.S &;\x88.M &;\x89.G &;\x8A.A &;\x8B.; &;\x8C.5 &;\x8F./ &;\x8D.) &;\x8E.# &;6/& 8!:\xEB! )"),peg$decode("%;\x84/G#;'/>$;\x92/5$;'/,$;\x94/#$+%)(%'#($'#(#'#(\"'#&'#"),peg$decode("%;\x93/' 8!:\xEC!! )"),peg$decode("%;!/5#;!/,$;!/#$+#)(#'#(\"'#&'#"),peg$decode("%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:\xED! )"),peg$decode("%;\xB6/Y#$%;A/,#;\xB6/#$+\")(\"'#&'#06*%;A/,#;\xB6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%;9/N#%2:\"\"6:7;/,#;9/#$+\")(\"'#&'#.\" &\"/'$8\":\xEE\" )(\"'#&'#"),peg$decode("%;:.c &%;\x98/Y#$%;A/,#;\x98/#$+\")(\"'#&'#06*%;A/,#;\x98/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/& 8!:\xEF! )"),peg$decode("%;L.# &;\x99/]#$%;B/,#;\x9B/#$+\")(\"'#&'#06*%;B/,#;\x9B/#$+\")(\"'#&'#&/'$8\":\xF0\" )(\"'#&'#"),peg$decode("%;\x9A.\" &\"/>#;@/5$;M/,$;?/#$+$)($'#(#'#(\"'#&'#"),peg$decode("%%;6/Y#$%;./,#;6/#$+\")(\"'#&'#06*%;./,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#.# &;H/' 8!:\xF1!! )"),peg$decode(";\x9C.) &;\x9D.# &;\xA0"),peg$decode("%3\xF2\"\"5!7\xF3/:#;</1$;\x9F/($8#:\xF4#! )(#'#(\"'#&'#"),peg$decode("%3\xF5\"\"5'7\xF6/:#;</1$;\x9E/($8#:\xF7#! )(#'#(\"'#&'#"),peg$decode("%$;!/&#0#*;!&&&#/' 8!:\xF8!! )"),peg$decode("%2\xF9\"\"6\xF97\xFA/o#%2J\"\"6J7K/M#;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+$)($'#(#'#(\"'#&'#.\" &\"/'$8\":\xFB\" )(\"'#&'#"),peg$decode("%;6/J#%;</,#;\xA1/#$+\")(\"'#&'#.\" &\"/)$8\":\xFC\"\"! )(\"'#&'#"),peg$decode(";6.) &;T.# &;H"),peg$decode("%;\xA3/Y#$%;B/,#;\xA4/#$+\")(\"'#&'#06*%;B/,#;\xA4/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%3\xFD\"\"5&7\xFE.G &3\xFF\"\"5'7\u0100.; &3\u0101\"\"5$7\u0102./ &3\u0103\"\"5%7\u0104.# &;6/& 8!:\u0105! )"),peg$decode(";\xA5.# &;\xA0"),peg$decode("%3\u0106\"\"5(7\u0107/M#;</D$3\u0108\"\"5(7\u0109./ &3\u010A\"\"5(7\u010B.# &;6/#$+#)(#'#(\"'#&'#"),peg$decode("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u010C!! )"),peg$decode("%;\xA9/& 8!:\u010D! )"),peg$decode("%;\xAA/k#;;/b$;\xAF/Y$$%;B/,#;\xB0/#$+\")(\"'#&'#06*%;B/,#;\xB0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),peg$decode(";\xAB.# &;\xAC"),peg$decode("3\u010E\"\"5$7\u010F.S &3\u0110\"\"5%7\u0111.G &3\u0112\"\"5%7\u0113.; &3\u0114\"\"5%7\u0115./ &3\u0116\"\"5+7\u0117.# &;\xAD"),peg$decode("3\u0118\"\"5'7\u0119./ &3\u011A\"\"5)7\u011B.# &;\xAD"),peg$decode(";6.# &;\xAE"),peg$decode("%3\u011C\"\"5\"7\u011D/,#;6/#$+\")(\"'#&'#"),peg$decode(";\xAD.# &;6"),peg$decode("%;6/5#;</,$;\xB1/#$+#)(#'#(\"'#&'#"),peg$decode(";6.# &;H"),peg$decode("%;\xB3/5#;./,$;\x90/#$+#)(#'#(\"'#&'#"),peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u011E!! )"),peg$decode("%;\x9E/' 8!:\u011F!! )"),peg$decode("%;\xB6/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":\u0120\"!!)(\"'#&'#"),peg$decode("%%;7/e#$%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#0<*%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),peg$decode("%;L.# &;\x99/]#$%;B/,#;\xB8/#$+\")(\"'#&'#06*%;B/,#;\xB8/#$+\")(\"'#&'#&/'$8\":\u0121\" )(\"'#&'#"),peg$decode(";\xB9.# &;\xA0"),peg$decode("%3\u0122\"\"5#7\u0123/:#;</1$;6/($8#:\u0124#! )(#'#(\"'#&'#"),peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u0125!! )"),peg$decode("%;\x9E/' 8!:\u0126!! )"),peg$decode("%$;\x9A0#*;\x9A&/x#;@/o$;M/f$;?/]$$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8%:\u0127% )(%'#($'#(#'#(\"'#&'#"),peg$decode(";\xBE"),peg$decode("%3\u0128\"\"5&7\u0129/k#;./b$;\xC1/Y$$%;A/,#;\xC1/#$+\")(\"'#&'#06*%;A/,#;\xC1/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#.# &;\xBF"),peg$decode("%;6/k#;./b$;\xC0/Y$$%;A/,#;\xC0/#$+\")(\"'#&'#06*%;A/,#;\xC0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),peg$decode("%;6/;#;</2$;6.# &;H/#$+#)(#'#(\"'#&'#"),peg$decode(";\xC2.G &;\xC4.A &;\xC6.; &;\xC8.5 &;\xC9./ &;\xCA.) &;\xCB.# &;\xC0"),peg$decode("%3\u012A\"\"5%7\u012B/5#;</,$;\xC3/#$+#)(#'#(\"'#&'#"),peg$decode("%;I/' 8!:\u012C!! )"),peg$decode("%3\u012D\"\"5&7\u012E/\x97#;</\x8E$;D/\x85$;\xC5/|$$%$;'/&#0#*;'&&&#/,#;\xC5/#$+\")(\"'#&'#0C*%$;'/&#0#*;'&&&#/,#;\xC5/#$+\")(\"'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),peg$decode(";t.# &;w"),peg$decode("%3\u012F\"\"5%7\u0130/5#;</,$;\xC7/#$+#)(#'#(\"'#&'#"),peg$decode("%;I/' 8!:\u0131!! )"),peg$decode("%3\u0132\"\"5&7\u0133/:#;</1$;I/($8#:\u0134#! )(#'#(\"'#&'#"),peg$decode("%3\u0135\"\"5%7\u0136/]#;</T$%3\u0137\"\"5$7\u0138/& 8!:\u0139! ).4 &%3\u013A\"\"5%7\u013B/& 8!:\u013C! )/#$+#)(#'#(\"'#&'#"),peg$decode("%3\u013D\"\"5)7\u013E/R#;</I$3\u013F\"\"5#7\u0140./ &3\u0141\"\"5(7\u0142.# &;6/($8#:\u0143#! )(#'#(\"'#&'#"),peg$decode("%3\u0144\"\"5#7\u0145/\x93#;</\x8A$;D/\x81$%;\xCC/e#$%2D\"\"6D7E/,#;\xCC/#$+\")(\"'#&'#0<*%2D\"\"6D7E/,#;\xCC/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#"),peg$decode("%3\u0146\"\"5(7\u0147./ &3\u0148\"\"5$7\u0149.# &;6/' 8!:\u014A!! )"),peg$decode("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%;\xCF/G#;./>$;\xCF/5$;./,$;\x90/#$+%)(%'#($'#(#'#(\"'#&'#"),peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u014B!! )"),peg$decode("%;\xD1/]#$%;A/,#;\xD1/#$+\")(\"'#&'#06*%;A/,#;\xD1/#$+\")(\"'#&'#&/'$8\":\u014C\" )(\"'#&'#"),peg$decode("%;\x99/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":\u014D\" )(\"'#&'#"),peg$decode("%;L.O &;\x99.I &%;@.\" &\"/:#;t/1$;?.\" &\"/#$+#)(#'#(\"'#&'#/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":\u014E\" )(\"'#&'#"),peg$decode("%;\xD4/]#$%;B/,#;\xD5/#$+\")(\"'#&'#06*%;B/,#;\xD5/#$+\")(\"'#&'#&/'$8\":\u014F\" )(\"'#&'#"),peg$decode("%;\x96/& 8!:\u0150! )"),peg$decode("%3\u0151\"\"5(7\u0152/:#;</1$;6/($8#:\u0153#! )(#'#(\"'#&'#.g &%3\u0154\"\"5&7\u0155/:#;</1$;6/($8#:\u0156#! )(#'#(\"'#&'#.: &%3\u0157\"\"5*7\u0158/& 8!:\u0159! ).# &;\xA0"),peg$decode("%%;6/k#$%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#&/)$8\":\u015B\"\"! )(\"'#&'#.\" &\"/' 8!:\u015C!! )"),peg$decode("%;\xD8/Y#$%;A/,#;\xD8/#$+\")(\"'#&'#06*%;A/,#;\xD8/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%;\x99/Y#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u015D!! )"),peg$decode("%;\xDB/Y#$%;B/,#;\xDC/#$+\")(\"'#&'#06*%;B/,#;\xDC/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%3\u015E\"\"5&7\u015F.; &3\u0160\"\"5'7\u0161./ &3\u0162\"\"5*7\u0163.# &;6/& 8!:\u0164! )"),peg$decode("%3\u0165\"\"5&7\u0166/:#;</1$;\xDD/($8#:\u0167#! )(#'#(\"'#&'#.} &%3\xF5\"\"5'7\xF6/:#;</1$;\x9E/($8#:\u0168#! )(#'#(\"'#&'#.P &%3\u0169\"\"5+7\u016A/:#;</1$;\x9E/($8#:\u016B#! )(#'#(\"'#&'#.# &;\xA0"),peg$decode("3\u016C\"\"5+7\u016D.k &3\u016E\"\"5)7\u016F._ &3\u0170\"\"5(7\u0171.S &3\u0172\"\"5'7\u0173.G &3\u0174\"\"5&7\u0175.; &3\u0176\"\"5*7\u0177./ &3\u0178\"\"5)7\u0179.# &;6"),peg$decode(";1.\" &\""),peg$decode("%%;6/k#$%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#&/)$8\":\u015B\"\"! )(\"'#&'#.\" &\"/' 8!:\u017A!! )"),peg$decode("%;L.# &;\x99/]#$%;B/,#;\xE1/#$+\")(\"'#&'#06*%;B/,#;\xE1/#$+\")(\"'#&'#&/'$8\":\u017B\" )(\"'#&'#"),peg$decode(";\xB9.# &;\xA0"),peg$decode("%;\xE3/Y#$%;A/,#;\xE3/#$+\")(\"'#&'#06*%;A/,#;\xE3/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),peg$decode("%;\xEA/k#;./b$;\xED/Y$$%;B/,#;\xE4/#$+\")(\"'#&'#06*%;B/,#;\xE4/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),peg$decode(";\xE5.; &;\xE6.5 &;\xE7./ &;\xE8.) &;\xE9.# &;\xA0"),peg$decode("%3\u017C\"\"5#7\u017D/:#;</1$;\xF0/($8#:\u017E#! )(#'#(\"'#&'#"),peg$decode("%3\u017F\"\"5%7\u0180/:#;</1$;T/($8#:\u0181#! )(#'#(\"'#&'#"),peg$decode("%3\u0182\"\"5(7\u0183/F#;</=$;\\.) &;Y.# &;X/($8#:\u0184#! )(#'#(\"'#&'#"),peg$decode("%3\u0185\"\"5&7\u0186/:#;</1$;6/($8#:\u0187#! )(#'#(\"'#&'#"),peg$decode("%3\u0188\"\"5%7\u0189/O#%;</3#$;!0#*;!&/#$+\")(\"'#&'#.\" &\"/'$8\":\u018A\" )(\"'#&'#"),peg$decode("%;\xEB/G#;;/>$;6/5$;;/,$;\xEC/#$+%)(%'#($'#(#'#(\"'#&'#"),peg$decode("%3\x92\"\"5#7\xD3.# &;6/' 8!:\u018B!! )"),peg$decode("%3\xB1\"\"5#7\u018C.G &3\xB3\"\"5#7\u018D.; &3\xB7\"\"5#7\u018E./ &3\xB5\"\"5$7\u018F.# &;6/' 8!:\u0190!! )"),peg$decode("%;\xEE/D#%;C/,#;\xEF/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),peg$decode("%;U.) &;\\.# &;X/& 8!:\u0191! )"),peg$decode("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:\u0192!! )"),peg$decode("%%;!/?#;!.\" &\"/1$;!.\" &\"/#$+#)(#'#(\"'#&'#/' 8!:\u0193!! )"),peg$decode(";\xBE"),peg$decode("%;\x9E/^#$%;B/,#;\xF3/#$+\")(\"'#&'#06*%;B/,#;\xF3/#$+\")(\"'#&'#&/($8\":\u0194\"!!)(\"'#&'#"),peg$decode(";\xF4.# &;\xA0"),peg$decode("%2\u0195\"\"6\u01957\u0196/L#;</C$2\u0197\"\"6\u01977\u0198.) &2\u0199\"\"6\u01997\u019A/($8#:\u019B#! )(#'#(\"'#&'#"),peg$decode("%;\x9E/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":\u019C\"!!)(\"'#&'#"),peg$decode("%;6/5#;0/,$;\xF7/#$+#)(#'#(\"'#&'#"),peg$decode("$;2.) &;4.# &;.0/*;2.) &;4.# &;.&"),peg$decode("$;%0#*;%&"),peg$decode("%;\xFA/;#28\"\"6879/,$;\xFB/#$+#)(#'#(\"'#&'#"),peg$decode("%3\u019D\"\"5%7\u019E.) &3\u019F\"\"5$7\u01A0/' 8!:\u01A1!! )"),peg$decode("%;\xFC/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),peg$decode("%;\\.) &;X.# &;\x82/' 8!:\u01A2!! )"),peg$decode(";\".S &;!.M &2F\"\"6F7G.A &2J\"\"6J7K.5 &2H\"\"6H7I.) &2N\"\"6N7O"),peg$decode("2L\"\"6L7M.\x95 &2B\"\"6B7C.\x89 &2<\"\"6<7=.} &2R\"\"6R7S.q &2T\"\"6T7U.e &2V\"\"6V7W.Y &2P\"\"6P7Q.M &2@\"\"6@7A.A &2D\"\"6D7E.5 &22\"\"6273.) &2>\"\"6>7?"),peg$decode("%;\u0100/b#28\"\"6879/S$;\xFB/J$%2\u01A3\"\"6\u01A37\u01A4/,#;\xEC/#$+\")(\"'#&'#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),peg$decode("%3\u01A5\"\"5%7\u01A6.) &3\u01A7\"\"5$7\u01A8/' 8!:\u01A1!! )"),peg$decode("%;\xEC/O#3\xB1\"\"5#7\xB2.6 &3\xB3\"\"5#7\xB4.* &$;+0#*;+&/'$8\":\u01A9\" )(\"'#&'#"),peg$decode("%;\u0104/\x87#2F\"\"6F7G/x$;\u0103/o$2F\"\"6F7G/`$;\u0103/W$2F\"\"6F7G/H$;\u0103/?$2F\"\"6F7G/0$;\u0105/'$8):\u01AA) )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#"),peg$decode("%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#(\"'#&'#"),peg$decode("%;\u0103/,#;\u0103/#$+\")(\"'#&'#"),peg$decode("%;\u0103/5#;\u0103/,$;\u0103/#$+#)(#'#(\"'#&'#"),peg$decode("%;\x84/U#;'/L$;\x92/C$;'/:$;\x90/1$; .\" &\"/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),peg$decode("%2\u01AB\"\"6\u01AB7\u01AC.) &2\u01AD\"\"6\u01AD7\u01AE/w#;0/n$;\u0108/e$$%;B/2#;\u0109.# &;\xA0/#$+\")(\"'#&'#0<*%;B/2#;\u0109.# &;\xA0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),peg$decode(";\x99.# &;L"),peg$decode("%2\u01AF\"\"6\u01AF7\u01B0/5#;</,$;\u010A/#$+#)(#'#(\"'#&'#"),peg$decode("%;D/S#;,/J$2:\"\"6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#")],peg$currPos=0,peg$savedPos=0,peg$posDetailsCache=[{line:1,column:1}],peg$maxFailPos=0,peg$maxFailExpected=[],peg$silentFails=0,peg$result;if("startRule"in options){if(!(options.startRule in peg$startRuleIndices)){throw new Error("Can't start parsing from rule \""+options.startRule+"\".");}peg$startRuleIndex=peg$startRuleIndices[options.startRule];}function text(){return input.substring(peg$savedPos,peg$currPos);}function location(){return peg$computeLocation(peg$savedPos,peg$currPos);}function peg$literalExpectation(text,ignoreCase){return {type:"literal",text:text,ignoreCase:ignoreCase};}function peg$classExpectation(parts,inverted,ignoreCase){return {type:"class",parts:parts,inverted:inverted,ignoreCase:ignoreCase};}function peg$endExpectation(){return {type:"end"};}function peg$computePosDetails(pos){var details=peg$posDetailsCache[pos],p;if(details){return details;}else {p=pos-1;while(!peg$posDetailsCache[p]){p--;}details=peg$posDetailsCache[p];details={line:details.line,column:details.column};while(p<pos){if(input.charCodeAt(p)===10){details.line++;details.column=1;}else {details.column++;}p++;}peg$posDetailsCache[pos]=details;return details;}}function peg$computeLocation(startPos,endPos){var startPosDetails=peg$computePosDetails(startPos),endPosDetails=peg$computePosDetails(endPos);return {start:{offset:startPos,line:startPosDetails.line,column:startPosDetails.column},end:{offset:endPos,line:endPosDetails.line,column:endPosDetails.column}};}function peg$fail(expected){if(peg$currPos<peg$maxFailPos){return;}if(peg$currPos>peg$maxFailPos){peg$maxFailPos=peg$currPos;peg$maxFailExpected=[];}peg$maxFailExpected.push(expected);}function peg$buildStructuredError(expected,found,location){return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected,found),expected,found,location);}function peg$decode(s){var bc=new Array(s.length),i;for(i=0;i<s.length;i++){bc[i]=s.charCodeAt(i)-32;}return bc;}function peg$parseRule(index){var bc=peg$bytecode[index],ip=0,ips=[],end=bc.length,ends=[],stack=[],params,i;while(true){while(ip<end){switch(bc[ip]){case 0:stack.push(peg$consts[bc[ip+1]]);ip+=2;break;case 1:stack.push(void 0);ip++;break;case 2:stack.push(null);ip++;break;case 3:stack.push(peg$FAILED);ip++;break;case 4:stack.push([]);ip++;break;case 5:stack.push(peg$currPos);ip++;break;case 6:stack.pop();ip++;break;case 7:peg$currPos=stack.pop();ip++;break;case 8:stack.length-=bc[ip+1];ip+=2;break;case 9:stack.splice(-2,1);ip++;break;case 10:stack[stack.length-2].push(stack.pop());ip++;break;case 11:stack.push(stack.splice(stack.length-bc[ip+1],bc[ip+1]));ip+=2;break;case 12:stack.push(input.substring(stack.pop(),peg$currPos));ip++;break;case 13:ends.push(end);ips.push(ip+3+bc[ip+1]+bc[ip+2]);if(stack[stack.length-1]){end=ip+3+bc[ip+1];ip+=3;}else {end=ip+3+bc[ip+1]+bc[ip+2];ip+=3+bc[ip+1];}break;case 14:ends.push(end);ips.push(ip+3+bc[ip+1]+bc[ip+2]);if(stack[stack.length-1]===peg$FAILED){end=ip+3+bc[ip+1];ip+=3;}else {end=ip+3+bc[ip+1]+bc[ip+2];ip+=3+bc[ip+1];}break;case 15:ends.push(end);ips.push(ip+3+bc[ip+1]+bc[ip+2]);if(stack[stack.length-1]!==peg$FAILED){end=ip+3+bc[ip+1];ip+=3;}else {end=ip+3+bc[ip+1]+bc[ip+2];ip+=3+bc[ip+1];}break;case 16:if(stack[stack.length-1]!==peg$FAILED){ends.push(end);ips.push(ip);end=ip+2+bc[ip+1];ip+=2;}else {ip+=2+bc[ip+1];}break;case 17:ends.push(end);ips.push(ip+3+bc[ip+1]+bc[ip+2]);if(input.length>peg$currPos){end=ip+3+bc[ip+1];ip+=3;}else {end=ip+3+bc[ip+1]+bc[ip+2];ip+=3+bc[ip+1];}break;case 18:ends.push(end);ips.push(ip+4+bc[ip+2]+bc[ip+3]);if(input.substr(peg$currPos,peg$consts[bc[ip+1]].length)===peg$consts[bc[ip+1]]){end=ip+4+bc[ip+2];ip+=4;}else {end=ip+4+bc[ip+2]+bc[ip+3];ip+=4+bc[ip+2];}break;case 19:ends.push(end);ips.push(ip+4+bc[ip+2]+bc[ip+3]);if(input.substr(peg$currPos,peg$consts[bc[ip+1]].length).toLowerCase()===peg$consts[bc[ip+1]]){end=ip+4+bc[ip+2];ip+=4;}else {end=ip+4+bc[ip+2]+bc[ip+3];ip+=4+bc[ip+2];}break;case 20:ends.push(end);ips.push(ip+4+bc[ip+2]+bc[ip+3]);if(peg$consts[bc[ip+1]].test(input.charAt(peg$currPos))){end=ip+4+bc[ip+2];ip+=4;}else {end=ip+4+bc[ip+2]+bc[ip+3];ip+=4+bc[ip+2];}break;case 21:stack.push(input.substr(peg$currPos,bc[ip+1]));peg$currPos+=bc[ip+1];ip+=2;break;case 22:stack.push(peg$consts[bc[ip+1]]);peg$currPos+=peg$consts[bc[ip+1]].length;ip+=2;break;case 23:stack.push(peg$FAILED);if(peg$silentFails===0){peg$fail(peg$consts[bc[ip+1]]);}ip+=2;break;case 24:peg$savedPos=stack[stack.length-1-bc[ip+1]];ip+=2;break;case 25:peg$savedPos=peg$currPos;ip++;break;case 26:params=bc.slice(ip+4,ip+4+bc[ip+3]);for(i=0;i<bc[ip+3];i++){params[i]=stack[stack.length-1-params[i]];}stack.splice(stack.length-bc[ip+2],bc[ip+2],peg$consts[bc[ip+1]].apply(null,params));ip+=4+bc[ip+3];break;case 27:stack.push(peg$parseRule(bc[ip+1]));ip+=2;break;case 28:peg$silentFails++;ip++;break;case 29:peg$silentFails--;ip++;break;default:throw new Error("Invalid opcode: "+bc[ip]+".");}}if(ends.length>0){end=ends.pop();ip=ips.pop();}else {break;}}return stack[0];}options.data={};// Object to which header attributes will be assigned during parsing
  function list(head,tail){return [head].concat(tail);}peg$result=peg$parseRule(peg$startRuleIndex);if(peg$result!==peg$FAILED&&peg$currPos===input.length){return peg$result;}else {if(peg$result!==peg$FAILED&&peg$currPos<input.length){peg$fail(peg$endExpectation());}throw peg$buildStructuredError(peg$maxFailExpected,peg$maxFailPos<input.length?input.charAt(peg$maxFailPos):null,peg$maxFailPos<input.length?peg$computeLocation(peg$maxFailPos,peg$maxFailPos+1):peg$computeLocation(peg$maxFailPos,peg$maxFailPos));}}module.exports={SyntaxError:peg$SyntaxError,parse:peg$parse};/***/},/* 38 */ /***/function(module,exports,__webpack_require__){/**
   * @name SIP
   * @namespace
   */module.exports=function(SIP){var Modifiers;function stripPayload(sdp,payload){var i;var media_descs=[];var current_media_desc;var lines=sdp.split(/\r\n/);for(i=0;i<lines.length;){var line=lines[i];if(/^m=(?:audio|video)/.test(line)){current_media_desc={index:i,stripped:[]};media_descs.push(current_media_desc);}else if(current_media_desc){var rtpmap=/^a=rtpmap:(\d+) ([^/]+)\//.exec(line);if(rtpmap&&payload===rtpmap[2]){lines.splice(i,1);current_media_desc.stripped.push(rtpmap[1]);continue;// Don't increment 'i'
  }}i++;}for(i=0;i<media_descs.length;i++){var mline=lines[media_descs[i].index].split(' ');// Ignore the first 3 parameters of the mline. The codec information is after that
  for(var j=3;j<mline.length;){if(media_descs[i].stripped.indexOf(mline[j])!==-1){mline.splice(j,1);continue;}j++;}lines[media_descs[i].index]=mline.join(' ');}return lines.join('\r\n');}function stripMediaDescription(sdp,description){var descriptionRegExp=new RegExp("m="+description+".*$","gm");var groupRegExp=new RegExp("^a=group:.*$","gm");if(descriptionRegExp.test(sdp)){var midLineToRemove_1;sdp=sdp.split(/^m=/gm).filter(function(section){if(section.substr(0,description.length)===description){midLineToRemove_1=section.match(/^a=mid:.*$/gm);if(midLineToRemove_1){midLineToRemove_1=midLineToRemove_1[0].match(/:.+$/g)[0].substr(1);}return false;}return true;}).join('m=');var groupLine=sdp.match(groupRegExp);if(groupLine&&groupLine.length===1){groupLine=groupLine[0];var groupRegExpReplace=new RegExp("\ *"+midLineToRemove_1+"[^\ ]*","g");groupLine=groupLine.replace(groupRegExpReplace,"");sdp=sdp.split(groupRegExp).join(groupLine);}}return sdp;}Modifiers={stripTcpCandidates:function stripTcpCandidates(description){description.sdp=description.sdp.replace(/^a=candidate:\d+ \d+ tcp .*?\r\n/img,"");return SIP.Utils.Promise.resolve(description);},stripTelephoneEvent:function stripTelephoneEvent(description){description.sdp=stripPayload(description.sdp,'telephone-event');return SIP.Utils.Promise.resolve(description);},cleanJitsiSdpImageattr:function cleanJitsiSdpImageattr(description){description.sdp=description.sdp.replace(/^(a=imageattr:.*?)(x|y)=\[0-/gm,"$1$2=[1:");return SIP.Utils.Promise.resolve(description);},stripG722:function stripG722(description){description.sdp=stripPayload(description.sdp,'G722');return SIP.Utils.Promise.resolve(description);},stripRtpPayload:function stripRtpPayload(payload){return function(description){description.sdp=stripPayload(description.sdp,payload);return SIP.Utils.Promise.resolve(description);};},stripVideo:function stripVideo(description){description.sdp=stripMediaDescription(description.sdp,"video");return SIP.Utils.Promise.resolve(description);},addMidLines:function addMidLines(description){var sdp=description.sdp;if(sdp.search(/^a=mid.*$/gm)===-1){var mlines_1=sdp.match(/^m=.*$/gm);sdp=sdp.split(/^m=.*$/gm);mlines_1.forEach(function(elem,idx){mlines_1[idx]=elem+'\na=mid:'+idx;});sdp.forEach(function(elem,idx){if(mlines_1[idx]){sdp[idx]=elem+mlines_1[idx];}});sdp=sdp.join('');description.sdp=sdp;}return SIP.Utils.Promise.resolve(description);}};return Modifiers;};/***/},/* 39 */ /***/function(module,exports,__webpack_require__){/* WEBPACK VAR INJECTION */(function(global){/**
   * @fileoverview Simple
   */ /* Simple
   * @class Simple
   */module.exports=function(SIP){var C={STATUS_NULL:0,STATUS_NEW:1,STATUS_CONNECTING:2,STATUS_CONNECTED:3,STATUS_COMPLETED:4};/*
       * @param {Object} options
       */var Simple=function Simple(options){/*
           *  {
           *    media: {
           *      remote: {
           *        audio: <DOM element>,
           *        video: <DOM element>
           *      },
           *      local: {
           *        video: <DOM element>
           *      }
           *    },
           *    ua: {
           *       <UA Configuration Options>
           *    }
           *  }
           */if(options.media.remote.video){this.video=true;}else {this.video=false;}if(options.media.remote.audio){this.audio=true;}else {this.audio=false;}if(!this.audio&&!this.video){// Need to do at least audio or video
  // Error
  throw new Error('At least one remote audio or video element is required for Simple.');}this.options=options;// https://stackoverflow.com/questions/7944460/detect-safari-browser
  var browserUa=global.navigator.userAgent.toLowerCase();var isSafari=false;var isFirefox=false;if(browserUa.indexOf('safari')>-1&&browserUa.indexOf('chrome')<0){isSafari=true;}else if(browserUa.indexOf('firefox')>-1&&browserUa.indexOf('chrome')<0){isFirefox=true;}var sessionDescriptionHandlerFactoryOptions={};if(isSafari){sessionDescriptionHandlerFactoryOptions.modifiers=[SIP.Web.Modifiers.stripG722];}if(isFirefox){sessionDescriptionHandlerFactoryOptions.alwaysAcquireMediaFirst=true;}if(!this.options.ua.uri){this.anonymous=true;}this.ua=new SIP.UA({// User Configurable Options
  uri:this.options.ua.uri,authorizationUser:this.options.ua.authorizationUser,password:this.options.ua.password,displayName:this.options.ua.displayName,// Undocumented "Advanced" Options
  userAgentString:this.options.ua.userAgentString,// Fixed Options
  register:true,sessionDescriptionHandlerFactoryOptions:sessionDescriptionHandlerFactoryOptions,transportOptions:{traceSip:this.options.ua.traceSip,wsServers:this.options.ua.wsServers}});this.state=C.STATUS_NULL;this.logger=this.ua.getLogger('sip.simple');this.ua.on('registered',function(){this.emit('registered',this.ua);}.bind(this));this.ua.on('unregistered',function(){this.emit('unregistered',this.ua);}.bind(this));this.ua.on('failed',function(){this.emit('unregistered',this.ua);}.bind(this));this.ua.on('invite',function(session){// If there is already an active session reject the incoming session
  if(this.state!==C.STATUS_NULL&&this.state!==C.STATUS_COMPLETED){this.logger.warn('Rejecting incoming call. Simple only supports 1 call at a time');session.reject();return;}this.session=session;this.setupSession();this.emit('ringing',this.session);}.bind(this));this.ua.on('message',function(message){this.emit('message',message);}.bind(this));return this;};Simple.prototype=Object.create(SIP.EventEmitter.prototype);Simple.C=C;// Public
  Simple.prototype.call=function(destination){if(!this.ua||!this.checkRegistration()){this.logger.warn('A registered UA is required for calling');return;}if(this.state!==C.STATUS_NULL&&this.state!==C.STATUS_COMPLETED){this.logger.warn('Cannot make more than a single call with Simple');return;}// Safari hack, because you cannot call .play() from a non user action
  if(this.options.media.remote.audio){this.options.media.remote.audio.autoplay=true;}if(this.options.media.remote.video){this.options.media.remote.video.autoplay=true;}if(this.options.media.local&&this.options.media.local.video){this.options.media.local.video.autoplay=true;this.options.media.local.video.volume=0;}this.session=this.ua.invite(destination,{sessionDescriptionHandlerOptions:{constraints:{audio:this.audio,video:this.video}}});this.setupSession();return this.session;};Simple.prototype.answer=function(){if(this.state!==C.STATUS_NEW&&this.state!==C.STATUS_CONNECTING){this.logger.warn('No call to answer');return;}// Safari hack, because you cannot call .play() from a non user action
  if(this.options.media.remote.audio){this.options.media.remote.audio.autoplay=true;}if(this.options.media.remote.video){this.options.media.remote.video.autoplay=true;}return this.session.accept({sessionDescriptionHandlerOptions:{constraints:{audio:this.audio,video:this.video}}});// emit call is active
  };Simple.prototype.reject=function(){if(this.state!==C.STATUS_NEW&&this.state!==C.STATUS_CONNECTING){this.logger.warn('Call is already answered');return;}return this.session.reject();};Simple.prototype.hangup=function(){if(this.state!==C.STATUS_CONNECTED&&this.state!==C.STATUS_CONNECTING&&this.state!==C.STATUS_NEW){this.logger.warn('No active call to hang up on');return;}if(this.state!==C.STATUS_CONNECTED){return this.session.cancel();}else {return this.session.bye();}};Simple.prototype.hold=function(){if(this.state!==C.STATUS_CONNECTED||this.session.local_hold){this.logger.warn('Cannot put call on hold');return;}this.mute();this.logger.log('Placing session on hold');return this.session.hold();};Simple.prototype.unhold=function(){if(this.state!==C.STATUS_CONNECTED||!this.session.local_hold){this.logger.warn('Cannot unhold a call that is not on hold');return;}this.unmute();this.logger.log('Placing call off hold');return this.session.unhold();};Simple.prototype.mute=function(){if(this.state!==C.STATUS_CONNECTED){this.logger.warn('An acitve call is required to mute audio');return;}this.logger.log('Muting Audio');this.toggleMute(true);this.emit('mute',this);};Simple.prototype.unmute=function(){if(this.state!==C.STATUS_CONNECTED){this.logger.warn('An active call is required to unmute audio');return;}this.logger.log('Unmuting Audio');this.toggleMute(false);this.emit('unmute',this);};Simple.prototype.sendDTMF=function(tone){if(this.state!==C.STATUS_CONNECTED){this.logger.warn('An active call is required to send a DTMF tone');return;}this.logger.log('Sending DTMF tone: '+tone);this.session.dtmf(tone);};Simple.prototype.message=function(destination,message){if(!this.ua||!this.checkRegistration()){this.logger.warn('A registered UA is required to send a message');return;}if(!destination||!message){this.logger.warn('A destination and message are required to send a message');return;}this.ua.message(destination,message);};// Private Helpers
  Simple.prototype.checkRegistration=function(){return this.anonymous||this.ua&&this.ua.isRegistered();};Simple.prototype.setupRemoteMedia=function(){// If there is a video track, it will attach the video and audio to the same element
  var pc=this.session.sessionDescriptionHandler.peerConnection;var remoteStream;if(pc.getReceivers){remoteStream=new global.window.MediaStream();pc.getReceivers().forEach(function(receiver){var track=receiver.track;if(track){remoteStream.addTrack(track);}});}else {remoteStream=pc.getRemoteStreams()[0];}if(this.video){this.options.media.remote.video.srcObject=remoteStream;this.options.media.remote.video.play()["catch"](function(){this.logger.log('play was rejected');}.bind(this));}else if(this.audio){this.options.media.remote.audio.srcObject=remoteStream;this.options.media.remote.audio.play()["catch"](function(){this.logger.log('play was rejected');}.bind(this));}};Simple.prototype.setupLocalMedia=function(){if(this.video&&this.options.media.local&&this.options.media.local.video){var pc=this.session.sessionDescriptionHandler.peerConnection;var localStream;if(pc.getSenders){localStream=new global.window.MediaStream();pc.getSenders().forEach(function(sender){var track=sender.track;if(track&&track.kind==='video'){localStream.addTrack(track);}});}else {localStream=pc.getLocalStreams()[0];}this.options.media.local.video.srcObject=localStream;this.options.media.local.video.volume=0;this.options.media.local.video.play();}};Simple.prototype.cleanupMedia=function(){if(this.video){this.options.media.remote.video.srcObject=null;this.options.media.remote.video.pause();if(this.options.media.local&&this.options.media.local.video){this.options.media.local.video.srcObject=null;this.options.media.local.video.pause();}}if(this.audio){this.options.media.remote.audio.srcObject=null;this.options.media.remote.audio.pause();}};Simple.prototype.setupSession=function(){this.state=C.STATUS_NEW;this.emit('new',this.session);this.session.on('progress',this.onProgress.bind(this));this.session.on('accepted',this.onAccepted.bind(this));this.session.on('rejected',this.onEnded.bind(this));this.session.on('failed',this.onFailed.bind(this));this.session.on('terminated',this.onEnded.bind(this));};Simple.prototype.destroyMedia=function(){this.session.sessionDescriptionHandler.close();};Simple.prototype.toggleMute=function(mute){var pc=this.session.sessionDescriptionHandler.peerConnection;if(pc.getSenders){pc.getSenders().forEach(function(sender){if(sender.track){sender.track.enabled=!mute;}});}else {pc.getLocalStreams().forEach(function(stream){stream.getAudioTracks().forEach(function(track){track.enabled=!mute;});stream.getVideoTracks().forEach(function(track){track.enabled=!mute;});});}};Simple.prototype.onAccepted=function(){this.state=C.STATUS_CONNECTED;this.emit('connected',this.session);this.setupLocalMedia();this.setupRemoteMedia();this.session.sessionDescriptionHandler.on('addTrack',function(){this.logger.log('A track has been added, triggering new remoteMedia setup');this.setupRemoteMedia();}.bind(this));this.session.sessionDescriptionHandler.on('addStream',function(){this.logger.log('A stream has been added, trigger new remoteMedia setup');this.setupRemoteMedia();}.bind(this));this.session.on('hold',function(){this.emit('hold',this.session);}.bind(this));this.session.on('unhold',function(){this.emit('unhold',this.session);}.bind(this));this.session.on('dtmf',function(tone){this.emit('dtmf',tone);}.bind(this));this.session.on('bye',this.onEnded.bind(this));};Simple.prototype.onProgress=function(){this.state=C.STATUS_CONNECTING;this.emit('connecting',this.session);};Simple.prototype.onFailed=function(){this.onEnded();};Simple.prototype.onEnded=function(){this.state=C.STATUS_COMPLETED;this.emit('ended',this.session);this.cleanupMedia();};return Simple;};/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(28));/***/},/* 40 */ /***/function(module,exports,__webpack_require__){/* WEBPACK VAR INJECTION */(function(global){var toplevel=global.window||global;function getPrefixedProperty(object,name){if(object==null){return;}var capitalizedName=name.charAt(0).toUpperCase()+name.slice(1);var prefixedNames=[name,'webkit'+capitalizedName,'moz'+capitalizedName];for(var i in prefixedNames){var property=object[prefixedNames[i]];if(property){return property.bind(object);}}}module.exports={WebSocket:toplevel.WebSocket,Transport:__webpack_require__(10),open:toplevel.open,Promise:toplevel.Promise,timers:toplevel,// Console is not defined in ECMAScript, so just in case...
  console:toplevel.console||{debug:function debug(){},log:function log(){},warn:function warn(){},error:function error(){}},addEventListener:getPrefixedProperty(toplevel,'addEventListener'),removeEventListener:getPrefixedProperty(toplevel,'removeEventListener')};/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(28));/***/}/******/]));});});var SIP = /*@__PURE__*/getDefaultExportFromCjs(sip);

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  /**
   * @property {Constant} C a constant data type uses for NULL,
   *  NEW, CONNECTING, CONNECTED, COMPLETED status
   *
   */

  var C = {
    STATUS_NULL: 0,
    STATUS_NEW: 1,
    STATUS_CONNECTING: 2,
    STATUS_CONNECTED: 3,
    STATUS_COMPLETED: 4
  };
  /**
   * @property {Class} CFSimpleSip it is use for interacting to sip.js
   * @param {Object} options
   */

  var CFSimpleSip = /*#__PURE__*/function (_SIP$EventEmitter) {
    _inherits(CFSimpleSip, _SIP$EventEmitter);

    var _super = _createSuper(CFSimpleSip);

    function CFSimpleSip(options) {
      var _this;

      _classCallCheck(this, CFSimpleSip);

      _this = _super.call(this);
      _this.options = options;

      _this.initSimpleSip(options);

      _this.C = C;
      return _this;
    }
    /**
     * @property {Method} initSimpleSip it is use for initialize the simple sip
     * @param {options}
     */


    _createClass(CFSimpleSip, [{
      key: "initSimpleSip",
      value: function initSimpleSip(options) {
        /*
         *  {
         *    media: {
         *      remote: {
         *        audio: <DOM element>,
         *        video: <DOM element>
         *      },
         *      local: {
         *        video: <DOM element>
         *      }
         *    },
         *    ua: {
         *       <UA Configuration Options>
         *    },
         *  }
         */
        if (options.media.remote.video) {
          this.video = true;
        } else {
          this.video = false;
        }

        if (options.media.remote.audio) {
          this.audio = true;
        } else {
          this.audio = false;
        }

        if (!this.audio && !this.video) {
          // Need to do at least audio or video
          // Error
          throw new Error('At least one remote audio or video element is required for CFSimpleSip.');
        }

        this.options = options; // https://stackoverflow.com/questions/7944460/detect-safari-browser

        var browserUa = window.navigator.userAgent.toLowerCase();
        var isSafari = false;
        var isFirefox = false;

        if (browserUa.indexOf('safari') > -1 && browserUa.indexOf('chrome') < 0) {
          isSafari = true;
        } else if (browserUa.indexOf('firefox') > -1 && browserUa.indexOf('chrome') < 0) {
          isFirefox = true;
        }

        var sessionDescriptionHandlerFactoryOptions = {
          peerConnectionOptions: {
            iceCheckingTimeout: 500,
            rtcConfiguration: {
              iceServers: [{
                urls: 'stun:stun1.eo1.engage.ringcentral.com:19302'
              }, {
                urls: 'stun:stun2.eo1.engage.ringcentral.com:19302'
              }, {
                urls: 'stun:stun3.eo1.engage.ringcentral.com:19302'
              }]
            }
          }
        };

        if (isSafari) {
          sessionDescriptionHandlerFactoryOptions.modifiers = [SIP.Web.Modifiers.stripG722];
        }

        if (isFirefox) {
          sessionDescriptionHandlerFactoryOptions.alwaysAcquireMediaFirst = true;
          sessionDescriptionHandlerFactoryOptions.modifiers = [SIP.Web.Modifiers.addMidLines];
        }

        if (!this.options.ua.uri) {
          this.anonymous = true;
        }

        var isIntegratedDialDest = this.options.ua.dialDest.indexOf('@RC_SOFTPHONE') >= 0;
        var configOptions = {
          // User Configurable Options
          uri: this.options.ua.uri,
          authorizationUser: this.options.ua.authorizationUser,
          password: this.options.ua.password,
          displayName: this.options.ua.displayName,
          // Undocumented "Advanced" Options
          userAgentString: SIP.C.USER_AGENT + ';' + browserUa,
          // Fixed Options
          register: !isIntegratedDialDest,
          registerExpires: this.options.ua.registerExpires || 600,
          sessionDescriptionHandlerFactoryOptions: sessionDescriptionHandlerFactoryOptions,
          transportOptions: {
            traceSip: this.options.ua.traceSip,
            wsServers: this.options.ua.wsServers,
            maxReconnectionAttempts: 2
          },
          dtmfType: SIP.C.dtmfType.RTP
        };

        if (isIntegratedDialDest) {
          this.ua = new SIP.UA(configOptions).register({
            extraHeaders: ['P-RC-Supported-Ept-Roles: rc-engage-agent-ept']
          });
        } else {
          this.ua = new SIP.UA(configOptions);
        }

        this.state = C.STATUS_NULL;
        this.logger = this.ua.getLogger('sip.simple');
        this.ua.on('registered', function () {
          this.emit('registered', this.ua);
        }.bind(this));
        this.ua.on('unregistered', function () {
          this.emit('unregistered', this.ua);
        }.bind(this));
        this.ua.on('failed', function () {
          this.emit('unregistered', this.ua);
        }.bind(this));
        this.ua.on('invite', function (session) {
          // If there is already an active session reject the incoming session
          if (this.state !== C.STATUS_NULL && this.state !== C.STATUS_COMPLETED) {
            this.logger.warn('Rejecting incoming call. CFSimpleSip only supports 1 call at a time');
            session.reject();
            return;
          }

          this.session = session;
          this.setupSession();
          this.emit('ringing', this.session);
        }.bind(this));
        this.ua.on('message', function (message) {
          this.emit('message', message);
        }.bind(this));
        return this;
      }
      /**
       * @property {Method} call
       * @param {destination}
       */

    }, {
      key: "call",
      value: function call(destination) {
        if (!this.ua || !this.checkRegistration()) {
          this.logger.warn('A registered UA is required for calling');
          return;
        }

        if (this.state !== C.STATUS_NULL && this.state !== C.STATUS_COMPLETED) {
          this.logger.warn('Cannot make more than a single call with CFSimpleSip');
          return;
        } // Safari hack, because you cannot call .play() from a non user action


        if (this.options.media.remote.audio) {
          this.options.media.remote.audio.autoplay = true;
        }

        if (this.options.media.remote.video) {
          this.options.media.remote.video.autoplay = true;
        }

        if (this.options.media.local && this.options.media.local.video) {
          this.options.media.local.video.autoplay = true;
          this.options.media.local.video.volume = 0;
        }

        this.session = this.ua.invite(destination, {
          sessionDescriptionHandlerOptions: {
            constraints: {
              audio: this.audio,
              video: this.video
            }
          }
        });
        this.setupSession();
        return this.session;
      }
      /**
       * @property {Method} answer
       */

    }, {
      key: "answer",
      value: function answer() {
        if (this.state !== C.STATUS_NEW && this.state !== C.STATUS_CONNECTING) {
          this.logger.warn('No call to answer');
          return;
        } // Safari hack, because you cannot call .play() from a non user action


        if (this.options.media.remote.audio) {
          this.options.media.remote.audio.autoplay = true;
        }

        if (this.options.media.remote.video) {
          this.options.media.remote.video.autoplay = true;
        }

        return this.session.accept({
          sessionDescriptionHandlerOptions: {
            constraints: {
              audio: this.audio,
              video: this.video
            }
          }
        }); // emit call is active
      }
      /**
       * @property {Method} reject
       */

    }, {
      key: "reject",
      value: function reject() {
        if (this.state !== C.STATUS_NEW && this.state !== C.STATUS_CONNECTING) {
          this.logger.warn('Call is already answered');
          return;
        }

        return this.session.reject();
      }
      /**
       * @property {Method} hangup
       */

    }, {
      key: "hangup",
      value: function hangup() {
        if (this.state !== C.STATUS_CONNECTED && this.state !== C.STATUS_CONNECTING && this.state !== C.STATUS_NEW) {
          this.logger.warn('No active call to hang up on');
          return;
        }

        if (this.state !== C.STATUS_CONNECTED) {
          return this.session.cancel();
        } else {
          return this.session.bye();
        }
      }
      /**
       * @property {Method} hold
       */

    }, {
      key: "hold",
      value: function hold() {
        if (this.state !== C.STATUS_CONNECTED || this.session.local_hold) {
          this.logger.warn('Cannot put call on hold');
          return;
        }

        this.mute();
        this.logger.log('Placing session on hold');
        return this.session.hold();
      }
      /**
       * @property {Method} unhold
       */

    }, {
      key: "unhold",
      value: function unhold() {
        if (this.state !== C.STATUS_CONNECTED || !this.session.local_hold) {
          this.logger.warn('Cannot unhold a call that is not on hold');
          return;
        }

        this.unmute();
        this.logger.log('Placing call off hold');
        return this.session.unhold();
      }
      /**
       * @property {Method} mute
       */

    }, {
      key: "mute",
      value: function mute() {
        if (this.state !== C.STATUS_CONNECTED) {
          this.logger.warn('An acitve call is required to mute audio');
          return;
        }

        this.logger.log('Muting Audio');
        this.toggleMute(true);
        this.emit('mute', this);
      }
      /**
       * @property {Method} unmute
       */

    }, {
      key: "unmute",
      value: function unmute() {
        if (this.state !== C.STATUS_CONNECTED) {
          this.logger.warn('An active call is required to unmute audio');
          return;
        }

        this.logger.log('Unmuting Audio');
        this.toggleMute(false);
        this.emit('unmute', this);
      }
      /**
       * @property {Method} message
       * @param {tone}
       */

    }, {
      key: "sendDTMF",
      value: function sendDTMF(tone) {
        if (this.state !== C.STATUS_CONNECTED) {
          this.logger.warn('An active call is required to send a DTMF tone');
          return;
        }

        this.logger.log('Sending DTMF tone: ' + tone);
        this.session.dtmf(tone);
      }
      /**
       * @property {Method} message
       * @param {destination}
       * @param {message}
       */

    }, {
      key: "message",
      value: function message(destination, _message) {
        if (!this.ua || !this.checkRegistration()) {
          this.logger.warn('A registered UA is required to send a message');
          return;
        }

        if (!destination || !_message) {
          this.logger.warn('A destination and message are required to send a message');
          return;
        }

        this.ua.message(destination, _message);
      } // Private Helpers

      /**
       * @property {Method} checkRegistration
       */

    }, {
      key: "checkRegistration",
      value: function checkRegistration() {
        return this.anonymous || this.ua && this.ua.isRegistered();
      }
      /**
       * @property {Method} setupRemoteMedia
       */

    }, {
      key: "setupRemoteMedia",
      value: function setupRemoteMedia() {
        // If there is a video track, it will attach the video and audio to the same element
        var pc = this.session.sessionDescriptionHandler.peerConnection;
        var remoteStream;

        if (pc.getReceivers) {
          remoteStream = new window.window.MediaStream();
          pc.getReceivers().forEach(function (receiver) {
            var track = receiver.track;

            if (track) {
              remoteStream.addTrack(track);
            }
          });
        } else {
          remoteStream = pc.getRemoteStreams()[0];
        }

        if (this.video) {
          this.options.media.remote.video.srcObject = remoteStream;
          this.options.media.remote.video.play()["catch"](function () {
            this.logger.log('play was rejected');
          }.bind(this));
        } else if (this.audio) {
          this.options.media.remote.audio.srcObject = remoteStream;
          this.options.media.remote.audio.play()["catch"](function () {
            this.logger.log('play was rejected');
          }.bind(this));
        }
      }
      /**
       * @property {Method} setupLocalMedia
       */

    }, {
      key: "setupLocalMedia",
      value: function setupLocalMedia() {
        if (this.video && this.options.media.local && this.options.media.local.video) {
          var pc = this.session.sessionDescriptionHandler.peerConnection;
          var localStream;

          if (pc.getSenders) {
            localStream = new window.window.MediaStream();
            pc.getSenders().forEach(function (sender) {
              var track = sender.track;

              if (track && track.kind === 'video') {
                localStream.addTrack(track);
              }
            });
          } else {
            localStream = pc.getLocalStreams()[0];
          }

          this.options.media.local.video.srcObject = localStream;
          this.options.media.local.video.volume = 0;
          this.options.media.local.video.play();
        }
      }
      /**
       * @property {Method} cleanupMedia
       */

    }, {
      key: "cleanupMedia",
      value: function cleanupMedia() {
        if (this.video) {
          this.options.media.remote.video.srcObject = null;
          this.options.media.remote.video.pause();

          if (this.options.media.local && this.options.media.local.video) {
            this.options.media.local.video.srcObject = null;
            this.options.media.local.video.pause();
          }
        }

        if (this.audio) {
          this.options.media.remote.audio.srcObject = null;
          this.options.media.remote.audio.pause();
        }
      }
      /**
       * @property {Method} setupSession
       */

    }, {
      key: "setupSession",
      value: function setupSession() {
        this.state = C.STATUS_NEW;
        this.emit('new', this.session);
        this.session.on('progress', this.onProgress.bind(this));
        this.session.on('accepted', this.onAccepted.bind(this));
        this.session.on('rejected', this.onEnded.bind(this));
        this.session.on('failed', this.onFailed.bind(this));
        this.session.on('terminated', this.onEnded.bind(this));
      }
      /**
       * @property {Method} destroyMedia
       * @param {mute}
       */

    }, {
      key: "destroyMedia",
      value: function destroyMedia() {
        this.session.sessionDescriptionHandler.close();
      }
      /**
       * @property {Method} toggleMute
       * @param {mute}
       */

    }, {
      key: "toggleMute",
      value: function toggleMute(mute) {
        var pc = this.session.sessionDescriptionHandler.peerConnection;

        if (pc.getSenders) {
          pc.getSenders().forEach(function (sender) {
            if (sender.track) {
              sender.track.enabled = !mute;
            }
          });
        } else {
          pc.getLocalStreams().forEach(function (stream) {
            stream.getAudioTracks().forEach(function (track) {
              track.enabled = !mute;
            });
            stream.getVideoTracks().forEach(function (track) {
              track.enabled = !mute;
            });
          });
        }
      }
      /**
       * @property {Method} onAccepted
       */

    }, {
      key: "onAccepted",
      value: function onAccepted() {
        this.state = C.STATUS_CONNECTED;
        this.emit('connected', this.session);
        this.setupLocalMedia();
        this.setupRemoteMedia();
        this.session.sessionDescriptionHandler.on('addTrack', function () {
          this.logger.log('A track has been added, triggering new remoteMedia setup');
          this.setupRemoteMedia();
        }.bind(this));
        this.session.sessionDescriptionHandler.on('addStream', function () {
          this.logger.log('A stream has been added, trigger new remoteMedia setup');
          this.setupRemoteMedia();
        }.bind(this));
        this.session.on('hold', function () {
          this.emit('hold', this.session);
        }.bind(this));
        this.session.on('unhold', function () {
          this.emit('unhold', this.session);
        }.bind(this));
        this.session.on('dtmf', function (tone) {
          this.emit('dtmf', tone);
        }.bind(this));
        this.session.on('bye', this.onEnded.bind(this));
      }
      /**
       * @property {Method} onProgress
       */

    }, {
      key: "onProgress",
      value: function onProgress() {
        this.state = C.STATUS_CONNECTING;
        this.emit('connecting', this.session);
      }
      /**
       * @property {Method} onFailed
       */

    }, {
      key: "onFailed",
      value: function onFailed() {
        this.onEnded();
      }
      /**
       * @property {Method} onEnded
       */

    }, {
      key: "onEnded",
      value: function onEnded() {
        this.state = C.STATUS_COMPLETED;
        this.emit('ended', this.session);
        this.cleanupMedia();
      }
    }]);

    return CFSimpleSip;
  }(SIP.EventEmitter);

  /**
   * @property {Object} LOG_LEVELS This is used for logging purpose
   */
  var LOG_LEVELS = Object.freeze({
      DEBUG: 'debug',
      STATS: 'stats',
      INFO: 'info',
      WARN: 'warn',
      ERROR: 'error',
  });
  /**
   * @property {Object} AUTHENTICATE_TYPES This is used for login purpose
   */
  var AUTHENTICATE_TYPES = Object.freeze({
      USERNAME_PASSWORD: 'USERNAME_PASSWORD',
      RC_TOKEN: 'RC_TOKEN',
      ENGAGE_TOKEN: 'ENGAGE_TOKEN',
  });
  /**
   * @property {Object} CALLBACK_TYPES This is used for binding callbacks
   */
  var CALLBACK_TYPES = Object.freeze({
      AUTHENTICATE: 'authenticateResponse',
      OFFHOOK_TERM: 'offhookTermNotification',
      WEBRTC_INFO: 'webRtcInfoResponse',
      UPDATE_DIAL_DEST: 'updateDialDestination',
      REFRESH_TOKEN: 'getRefreshedToken',
      // SOFTPHONE Callbacks
      SIP_CONNECTED: 'sipConnectedNotification',
      SIP_DIAL_DEST_CHANGED: 'sipDialDestChangedNotification',
      SIP_ENDED: 'sipEndedNotification',
      SIP_MUTE: 'sipMuteResponse',
      SIP_REGISTERED: 'sipRegisteredNotification',
      SIP_REGISTRATION_FAILED: 'sipRegistrationFailedNotification',
      SIP_RINGING: 'sipRingingNotification',
      SIP_SWITCH_REGISTRAR: 'sipSwitchRegistrarNotification',
      SIP_UNMUTE: 'sipUnmuteResponse',
      SIP_UNREGISTERED: 'sipUnregisteredNotification',
      ROTATE_WEBRTC_SERVER: 'rotateWebRtcServer',
  });
  /**
   * @property {string} AGENT_SOFTPHONE_COMPONENT_NAME Default name of component which makes requests
   */
  var AGENT_SOFTPHONE_COMPONENT_NAME = 'SDK';

  /**
   * @property {Object} SoftphoneModel constructor function instance
   * this model stores information about the agent settings, softphone settings and authentication
   * While initializing the instance of SoftphoneServices we need to pass agentId, engageAccessToken.
   */
  var SoftphoneModel = /** @class */ (function () {
      function SoftphoneModel(overrides) {
          this.model = {
              agentSettings: {
                  agentId: 0,
                  dialDest: '',
              },
              callbacks: {},
              softphoneSettings: {
                  webRtc: null,
                  isRegistered: false,
                  muteActive: false,
                  registerPending: null,
                  maintainOH: false,
                  autoStartOH: false,
                  wsServers: [],
                  sipInfo: [],
                  uri: '',
                  displayName: '',
                  authorizationUser: '',
                  sipPassword: '',
                  sipDialDest: '',
                  attemptingSoftphoneReconnect: false,
                  //manualSoftphoneReconnect: false,  // set to true when agent triggered registrar rotation
                  lastSipFetchTime: 0,
                  instanceId: '',
              },
              authHost: window.location.origin,
              socketProtocol: 'wss://',
              baseApiUri: '/api/v1/',
              authenticateRequest: {
                  refreshToken: null,
                  engageAccessToken: null,
                  ssoLogin: false,
              },
              authenticatePacket: null,
              webRTCRequest: null,
          };
          if (!SoftphoneModel.instance) {
              if (overrides) {
                  this.model = _assign(_assign({}, this.model), overrides);
              }
              SoftphoneModel.instance = this;
          }
          // Initialize object
          return SoftphoneModel.instance;
      }
      SoftphoneModel.prototype.setCallback = function (type, callback) {
          if (!!type && isCallback(callback)) {
              this.model.callbacks[type] = callback;
          }
      };
      SoftphoneModel.prototype.getCallback = function (type) {
          return this.model.callbacks[type];
      };
      SoftphoneModel.prototype.hasCallback = function (type) {
          return isCallback(this.getCallback(type));
      };
      SoftphoneModel.prototype.removeCallback = function (type) {
          if (this.hasCallback(type)) {
              return delete this.model.callbacks[type];
          }
          return false;
      };
      SoftphoneModel.prototype.fireCallback = function (type) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          var callback = this.getCallback(type);
          if (!isCallback(callback)) {
              return;
          }
          return callback.call.apply(callback, __spreadArrays([this.model], args));
      };
      // Maybe better to rename it to a more clear name (e.g. getModel())
      SoftphoneModel.prototype.getInstance = function () {
          return this.model;
      };
      SoftphoneModel.prototype.resetInstance = function () {
          SoftphoneModel.instance = null;
      };
      SoftphoneModel.instance = null;
      return SoftphoneModel;
  }());
  function isCallback(callback) {
      return typeof callback === 'function';
  }
  var instance = new SoftphoneModel();
  Object.freeze(instance);

  /**
   * @property {Class} utils this class is uses for log the console messages
   * and setup the callbacks
   */
  var utils = /** @class */ (function () {
      function utils() {
      }
      utils.logMessage = function (logLevel, message, data) {
          var record = {
              logLevel: logLevel,
              message: message,
              dts: new Date(),
              data: data,
          };
          console.log(JSON.stringify(record));
      };
      utils.escapeSoftphoneUsername = function (str) {
          return str && str.replace(/[@]/g, '_at_');
      };
      utils.generateUUID = function () {
          var s4 = function () {
              return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
          };
          return (s4() +
              s4() +
              '-' +
              s4() +
              '-' +
              s4() +
              '-' +
              s4() +
              '-' +
              s4() +
              s4() +
              s4());
      };
      return utils;
  }());

  var ENGAGE_CLIENT_REQUEST_ID_HEADER_NAME = 'x-engage-client-request-id';

  var __componentName__ = AGENT_SOFTPHONE_COMPONENT_NAME;
  var setComponentName = function (newComponentName) {
      __componentName__ = newComponentName;
  };
  var getLoggingHeaders = function () {
      var _a;
      var clientRequestId = __componentName__ + ":" + utils.generateUUID();
      return _a = {}, _a[ENGAGE_CLIENT_REQUEST_ID_HEADER_NAME] = clientRequestId, _a;
  };

  var RequestLoggingService = { setComponentName: setComponentName, getLoggingHeaders: getLoggingHeaders };

  var encodeURIComponent$1 = window.encodeURIComponent;
  /**
   *
   * Adds headers to XMLHttpRequest based on configuration object.
   *
   * @param {Object} config - Config object passed to HttpService methods.
   * @param {XMLHttpRequest} req - Instance of XMLHttpRequest that needs to be configured.
   */
  function addHeaders(config, req) {
      if (!isObject(config)) {
          return;
      }
      var headers = config.headers;
      if (!isObject(headers)) {
          return;
      }
      var keys = Object.getOwnPropertyNames(headers);
      keys.map(function (key) { return req.setRequestHeader(key, headers[key]); });
  }
  /**
   * Adds request logging headers to XMLHttpRequest.
   *
   * @param {XMLHttpRequest} req - Instance of XMLHttpRequest that needs to be configured.
   */
  function addLoggingHeader(req) {
      var requestLoggingHeaders = RequestLoggingService.getLoggingHeaders();
      Object.keys(requestLoggingHeaders).forEach(function (key) {
          req.setRequestHeader(key, requestLoggingHeaders[key]);
      });
  }
  /**
   * Configures an XMLHttpRequest object to properly resolve/reject a promise, depending on the outcome of the request.
   *
   * @param {Function} resolve - Resolve callback function from a promise. Invoked if the request completed successfully.
   * @param {Function} reject - Reject callback function from a promise. Invoked if the request failed.
   * @param {XMLHttpRequest} req - Instance of XMLHttpRequest that will be configured.
   */
  function addCompletionListeners(resolve, reject, req) {
      req.addEventListener('error', function (e) { return reject(e); });
      req.addEventListener('timeout', function () { return reject(new Error('request timeout')); });
      req.addEventListener('load', function () {
          if (this.status !== 200) {
              reject({
                  status: this.status,
                  response: this.responseText,
              });
          }
          else {
              resolve({
                  status: this.status,
                  response: this.responseText,
              });
          }
      });
  }
  /**
   * @ignore
   *
   * Takes a config object and serializes/URI encodes the contents of the body property. If the "Content-Type" header is set
   * to "application/json", it encodes the payload as JSON. Otherwise, we assume that the payload should be x-www-form-urlencoded.
   */
  function getUriEncodedBody(config) {
      var contentType = config && config.headers && config.headers['Content-type'];
      var body = (config && config.body) || '';
      if (contentType === 'application/json') {
          body = JSON.stringify(body);
      }
      else {
          if (this.isObject(body)) {
              var bodyObj_1 = Object.assign({}, body);
              body = '';
              Object.getOwnPropertyNames(bodyObj_1).forEach(function (key, index, keys) {
                  body += encodeURIComponent$1(key) + "=" + encodeURIComponent$1(bodyObj_1[key]);
                  if (index < keys.length - 1) {
                      body += '&';
                  }
              });
          }
      }
      return body;
  }
  function getUriEncodedParams(params) {
      if (!isObject(params)) {
          return;
      }
      return Object.keys(params)
          .map(function (key) {
          return encodeURIComponent$1(key) + "=" + encodeURIComponent$1(params[key]);
      })
          .join('&');
  }
  function isObject(val) {
      return typeof val === 'object' && val !== null;
  }
  var HttpService = /** @class */ (function () {
      function HttpService() {
      }
      /**
       * @param {string} requestUrl -  complete apiUrl.
       * @param {Object} config - Object describing different properties of the request.
       * @returns {Promise} Promise that represents status of the request. Resolves if server responds with 200 status code, and is rejected otherwise.
       */
      HttpService.httpGet = function (requestUrl, config) {
          return new Promise(function (resolve, reject) {
              var req = new XMLHttpRequest();
              var queryParams = '';
              if (config.queryParams) {
                  queryParams = "?" + getUriEncodedParams(config.queryParams);
              }
              req.open('GET', "" + requestUrl + queryParams);
              addHeaders(config, req);
              addLoggingHeader(req);
              addCompletionListeners(resolve, reject, req);
              req.send();
          });
      };
      /**
       * Makes a GET request to Engage Auth.
       *
       * @param {string} requestUrl - complete apiUrl.
       * @param {Object} config - Object describing different properties of the request.
       * @returns {Promise} Promise that represents status of the request. Resolves if server responds with 200 status code, and is rejected otherwise.
       */
      HttpService.httpPost = function (requestUrl, config) {
          return new Promise(function (resolve, reject) {
              var req = new this.XMLHttpRequest();
              var queryParams = '';
              if (config.queryParams) {
                  queryParams = "?" + getUriEncodedParams(config.queryParams);
              }
              req.open('POST', "" + requestUrl + queryParams);
              addHeaders(config, req);
              addLoggingHeader(req);
              addCompletionListeners(resolve, reject, req);
              req.send(getUriEncodedBody(config));
          });
      };
      HttpService.isObject = function (val) {
          return typeof val === 'object' && val !== null;
      };
      return HttpService;
  }());

  /*
   * legacy response
   * {
   *   "sipInfo": [
   *       {
   *           "transport": "wss",
   *           "username": "yadvendra_agent",
   *           "password": "oct@2018",
   *           "domain": "d03-reg1.vacd.biz",
   *           "outboundProxy": "d03-reg1.vacd.biz:8089/freeswitch"
   *       }
   *   ]
   * }
   *
   * RC SSO response
   * {
   *   "sipInfo": [
   *       {
   *           "transport": "WSS",
   *           "username": "18662032059*101",
   *           "password": "B77O85vO",
   *           "authorizationId": "400017513008",
   *           "domain": "sip-cfintams.lab.nordigy.ru",
   *           "outboundProxy": "webphone-sip-cfintams.lab.nordigy.ru:8083"
   *       }
   *   ]
   * }
   * */
  /**
   * @property {Class} WebRtcInfoRequest responsible to get the information about the
   * sip/sipRegistrationInfo
   */
  var WebRtcInfoRequest = /** @class */ (function () {
      function WebRtcInfoRequest() {
      }
      /**
       * @property {Function} getSipRegistrationInfo
       * This function is used for fetching sipRegistrationInfo
       * @param {SoftphoneModel} UIModel
       */
      WebRtcInfoRequest.prototype.getSipRegistrationInfo = function (UIModel) {
          return __awaiter(this, void 0, void 0, function () {
              var model, endPoint, requestUrl, engageAccessToken, params, errorMsg;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          model = UIModel.getInstance();
                          endPoint = 'sip/sipRegistrationInfo';
                          requestUrl = "" + model.authHost + model.baseApiUri + endPoint;
                          engageAccessToken = "Bearer " + model.authenticateRequest.engageAccessToken;
                          params = {
                              headers: {
                                  'Content-type': 'application/json',
                                  Authorization: engageAccessToken,
                              },
                              queryParams: {
                                  agentId: model.agentSettings.agentId,
                                  ssoLogin: model.authenticateRequest.ssoLogin,
                              },
                          };
                          errorMsg = "Error on request get to sip registration info. URL: " + requestUrl;
                          return [4 /*yield*/, HttpService.httpGet(requestUrl, params).then(function (respObj) {
                                  try {
                                      var response = JSON.parse(respObj.response);
                                      model.softphoneSettings.sipInfo = response.sipInfo;
                                      model.softphoneSettings.lastSipFetchTime = Date.now();
                                      UIModel.fireCallback(CALLBACK_TYPES.WEBRTC_INFO, model.softphoneSettings.sipInfo);
                                  }
                                  catch (err) {
                                      utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                                  }
                              }, function (err) {
                                  if (err.status && err.status == 403) {
                                      this.refreshAccessToken(engageAccessToken, UIModel);
                                  }
                                  else {
                                      var errResponse = {
                                          type: 'Error retrieving sip registration information',
                                          message: errorMsg,
                                      };
                                      utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                                      // still fire callback on error response
                                      UIModel.fireCallback(CALLBACK_TYPES.WEBRTC_INFO, errResponse);
                                  }
                              })];
                      case 1:
                          _a.sent();
                          return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * @property {Function} refreshAccessToken this function is used for refresh the token
       * @param engageAccessToken
       * @param UIModel
       */
      WebRtcInfoRequest.prototype.refreshAccessToken = function (engageAccessToken, UIModel) {
          return __awaiter(this, void 0, void 0, function () {
              var errorMsg, refreshTokenResponse;
              var _this = this;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          errorMsg = "Error on request to get refresh token callback function : " + CALLBACK_TYPES.REFRESH_TOKEN;
                          return [4 /*yield*/, UIModel.fireCallback(CALLBACK_TYPES.REFRESH_TOKEN, engageAccessToken)];
                      case 1:
                          refreshTokenResponse = _a.sent();
                          refreshTokenResponse.then(function (respObj) {
                              try {
                                  if (respObj.status === 200 && respObj.response) {
                                      var model = UIModel.getInstance();
                                      var response = JSON.parse(respObj.response);
                                      model.authenticateRequest.engageAccessToken =
                                          response.engageAccessToken; // Is it requred to update token here ??
                                      _this.getSipRegistrationInfo(UIModel);
                                  }
                              }
                              catch (err) {
                                  utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                              }
                          }, function (err) {
                              var errResponse = {
                                  type: 'Error retrieving refresh token',
                                  message: errorMsg,
                              };
                              utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                              // still fire callback on error response
                              UIModel.fireCallback(CALLBACK_TYPES.REFRESH_TOKEN, errResponse);
                          });
                          return [2 /*return*/];
                  }
              });
          });
      };
      return WebRtcInfoRequest;
  }());

  /**
   * @property {Class} SoftphoneService
   * @param {Object} config has the keys authToken, agentId, dialDest and ssoLogin
   *  dialDest and ssoLogin are optional
   */
  var SoftphoneService = /** @class */ (function () {
      function SoftphoneService(config) {
          this.init(config);
      }
      /**
       * @property {Method} getUIModel
       * @returns UIModel
       */
      SoftphoneService.prototype.getUIModel = function () {
          return this.UIModel;
      };
      /**
       * @property {Method} getSoftphoneSettings
       * @returns softphoneSettings
       */
      SoftphoneService.prototype.getSoftphoneSettings = function () {
          return this.UIModel.getInstance().softphoneSettings;
      };
      /**
       * @property {Method} sipInitAndRegister Method uses for initializing the
       * softphone service and calling sipInit and sipRegister Method.
       * @param config
       */
      SoftphoneService.prototype.sipInitAndRegister = function (config) {
          return __awaiter(this, void 0, void 0, function () {
              var _this = this;
              return __generator(this, function (_a) {
                  this.init(config);
                  return [2 /*return*/, new Promise(function (resolve, reject) {
                          _this.getWebRtcInfo()
                              .then(function () {
                              _this.sipInit();
                              _this.sipRegister();
                              resolve(true);
                          })
                              .catch(function () {
                              reject(false);
                              throw 'Unable to fetch sipInfo details.';
                          });
                      })];
              });
          });
      };
      /**
       * @property {Method} switchSoftphoneRegistrar This function is used
       * for Triggering softphone registrar swap and updating offhook flags based on conditions
       * @param {boolean} maintainOffhook
       * @param {boolean} autoStartOffhook
       */
      SoftphoneService.prototype.switchSoftphoneRegistrar = function (maintainOffhook, autoStartOffhook) {
          var model = this.UIModel.getInstance();
          if (typeof autoStartOffhook === 'undefined') {
              autoStartOffhook = true;
          }
          if (model.softphoneSettings.attemptingSoftphoneReconnect &&
              autoStartOffhook) {
              this._updateOHFlags(maintainOffhook, autoStartOffhook);
              this.UIModel.fireCallback(CALLBACK_TYPES.SIP_SWITCH_REGISTRAR, {
                  message: 'Updating offhook flags, set status message',
                  status: 'UPDATE',
              });
          }
          else {
              this.resetSoftphoneSession({
                  maintainOH: maintainOffhook,
                  autoStartOH: autoStartOffhook,
              });
              this.UIModel.fireCallback(CALLBACK_TYPES.SIP_SWITCH_REGISTRAR, {
                  message: 'Triggering softphone registrar swap',
                  status: 'RESET',
              });
          }
      };
      /**
       * @property {Method} resetSoftphoneSession This function would be used for
       * reseting the softphone session and rotate the webrtc servers
       * @param {boolean} offhookParams
       */
      SoftphoneService.prototype.resetSoftphoneSession = function (offhookParams) {
          var model = this.UIModel.getInstance();
          var softphoneSettings = model.softphoneSettings;
          var serviceReference = this;
          if (softphoneSettings.isRegistered &&
              !softphoneSettings.attemptingSoftphoneReconnect) {
              this.sipTerminate(); // clear current SIP.js object
              this._rotateWebRtcServer(function () {
                  serviceReference.setupWebRtcServer();
                  if (offhookParams) {
                      if (offhookParams.maintainOH === 'null') {
                          offhookParams.maintainOH = softphoneSettings.maintainOH; // default to model setting
                      }
                      serviceReference._updateOHFlags(offhookParams.maintainOH, offhookParams.autoStartOH);
                  }
                  serviceReference.sipInit();
                  serviceReference.sipRegister();
              });
          }
      };
      /**
       * @property {Method} sipInit Initializes the SIP library, sets up callback functions
       */
      SoftphoneService.prototype.sipInit = function () {
          var _a;
          var model = this.UIModel.getInstance();
          var softphoneSettings = model.softphoneSettings;
          try {
              if (softphoneSettings.uri === '' ||
                  softphoneSettings.wsServers.length === 0 ||
                  softphoneSettings.displayName === '' ||
                  softphoneSettings.authorizationUser === '') {
                  this.setupWebRtcServer();
              }
              // prettier-ignore
              if (softphoneSettings.wsServers.length > 0) {
                  var webRtc = new CFSimpleSip(this._getSipConfig());
                  // callbacks
                  webRtc.on('connected', this._connected.bind(this));
                  webRtc.on('ended', this._ended.bind(this));
                  webRtc.on('registered', this._registered.bind(this));
                  webRtc.on('unregistered', this._unregistered.bind(this));
                  webRtc.on('registrationFailed', this._registrationFailed.bind(this));
                  webRtc.on('ringing', this._ringing.bind(this));
                  webRtc.on('mute', this._mute.bind(this));
                  webRtc.on('unmute', this._unmute.bind(this));
                  // after 15 sec of no registration response, rotate the registrar
                  softphoneSettings.registerPending = setTimeout(this._handleNoRegisterResponse.bind(this), 15 * 1000);
                  softphoneSettings.instanceId = (_a = webRtc.ua.configuration) === null || _a === void 0 ? void 0 : _a.instanceId; // set optional field instanceId
                  softphoneSettings.webRtc = webRtc; // set back on the UIModel instance
              }
              else {
                  throw 'Unable to setup WebRtc server';
              }
          }
          catch (err) {
              return err;
          }
      };
      /**
       * @property {boolean} sipTerminate clear webRtc settings, hangup, unregister
       * @returns boolean - success state
       */
      SoftphoneService.prototype.sipTerminate = function () {
          var model = this.UIModel.getInstance();
          var webRtc = model.softphoneSettings.webRtc;
          if (webRtc && webRtc.ua) {
              var opts = {
                  all: true,
              };
              // let hosting app know the offhook has been terminated
              this.UIModel.fireCallback(CALLBACK_TYPES.OFFHOOK_TERM, {
                  message: 'Offhook terminated',
              });
              webRtc.hangup();
              webRtc.ua.unregister(opts);
              webRtc.removeAllListeners('connected');
              webRtc.removeAllListeners('ended');
              webRtc.removeAllListeners('registered');
              webRtc.removeAllListeners('unregistered');
              webRtc.removeAllListeners('registrationFailed');
              webRtc.removeAllListeners('ringing');
              webRtc.removeAllListeners('mute');
              webRtc.removeAllListeners('unmute');
              webRtc.ua.stop();
              webRtc = null;
              model.softphoneSettings.webRtc = webRtc; // set back on model
              model.softphoneSettings.isRegistered = false;
              model.softphoneSettings.attemptingSoftphoneReconnect = false;
              model.softphoneSettings.muteActive = false;
              model.softphoneSettings.registerPending = null;
              model.softphoneSettings.uri = '';
              return true;
          }
          console.warn('sipTerminate: sip rtc settings or ua missing', webRtc);
          return false;
      };
      /**
       * @property {Method} sipAnswer Sends a session.accept response to a SIP invite event.
       */
      SoftphoneService.prototype.sipAnswer = function () {
          var webRtc = this.UIModel.getInstance().softphoneSettings.webRtc;
          if (webRtc) {
              webRtc.answer();
          }
      };
      /**
       * @property {Method} sipReject Sends a session.reject response to a SIP invite event.
       */
      SoftphoneService.prototype.sipReject = function () {
          var webRtc = this.UIModel.getInstance().softphoneSettings.webRtc;
          if (webRtc && webRtc.reject) {
              webRtc.reject();
          }
      };
      /**
       * @property {Method} sipRegister Request microphone access, if already registered, call hangup
       */
      SoftphoneService.prototype.sipRegister = function () {
          var model = this.UIModel.getInstance();
          var webRtc = model.softphoneSettings.webRtc;
          try {
              // enable microphone access notification if not already done
              if (window.webkitNotifications &&
                  window.webkitNotifications.checkPermission() !== 0) {
                  window.webkitNotifications.requestPermission();
              }
              if (!webRtc) {
                  return;
              }
              // if already registered, hangup
              if (model.softphoneSettings.isRegistered) {
                  this.sipHangUp();
              }
          }
          catch (e) {
              console.error('sip reg error:' + e);
          }
      };
      /**
       * @property {Method} sipHangUp Sends session.cancel if connected, or session.bye if not connected to a call
       */
      SoftphoneService.prototype.sipHangUp = function () {
          var webRtc = this.UIModel.getInstance().softphoneSettings.webRtc;
          if (webRtc && webRtc.hangup) {
              webRtc.hangup();
          }
      };
      /**
       * @property {Method} sipSendDTMF Sends session.dtmf for the tone specified
       * @param {string} dtmf The dtmf tone to send
       */
      SoftphoneService.prototype.sipSendDTMF = function (dtmf) {
          var webRtc = this.UIModel.getInstance().softphoneSettings.webRtc;
          if (webRtc) {
              webRtc.sendDTMF(dtmf);
          }
      };
      /**
       * @property {Method} sipToggleMute Toggles call audio on/off
       * @param {boolean} state Boolean for whether the call audio is on or off
       */
      SoftphoneService.prototype.sipToggleMute = function (state) {
          var model = this.UIModel.getInstance();
          var softphoneSettings = model.softphoneSettings;
          var webRtc = softphoneSettings.webRtc;
          var muteActive = softphoneSettings.muteActive;
          if (webRtc) {
              if (muteActive || state === false) {
                  webRtc.unmute();
                  this.UIModel.fireCallback(CALLBACK_TYPES.SIP_UNMUTE, {
                      message: 'Call unmuted',
                  });
              }
              else {
                  webRtc.mute();
                  this.UIModel.fireCallback(CALLBACK_TYPES.SIP_MUTE, {
                      message: 'Call muted',
                  });
              }
          }
      };
      /* These functions are globally available to the AgentSoftphoneSDK app */
      /**
       * @property {Method} setupWebRtcServer This function would be used for setting-up webRtcServer
       *
       */
      SoftphoneService.prototype.setupWebRtcServer = function () {
          var model = this.UIModel.getInstance();
          var softphoneSettings = model.softphoneSettings;
          var sipInfo = this._getCurrentWebRtcServerInfo();
          if (sipInfo !== null) {
              var username = sipInfo.username.toLowerCase();
              var webRtcServer = sipInfo.transport.toLowerCase() + '://' + sipInfo.outboundProxy; // e.g. "wss://aws87-f06-ccw01.vacd.biz:8089/freeswitch";
              softphoneSettings.uri =
                  utils.escapeSoftphoneUsername(username) + '@' + sipInfo.domain;
              softphoneSettings.wsServers = [webRtcServer];
              softphoneSettings.displayName = username;
              softphoneSettings.authorizationUser = sipInfo.authorizationId;
              softphoneSettings.sipPassword = sipInfo.password;
              softphoneSettings.sipDialDest = 'sip:' + softphoneSettings.uri;
              return {
                  webRtcServer: webRtcServer,
                  username: username,
                  password: softphoneSettings.sipPassword,
                  domain: sipInfo.domain || null,
                  dialDest: softphoneSettings.sipDialDest || null,
                  uri: softphoneSettings.uri || null,
                  wsServers: softphoneSettings.wsServers || [],
              };
          }
          return null;
      };
      SoftphoneService.prototype.setCallbacks = function (callbacks) {
          var _this = this;
          if (callbacks) {
              Object.keys(callbacks).forEach(function (type) {
                  var callbackType = type;
                  var callbackValue = callbacks[callbackType];
                  _this.setCallback(callbackType, callbackValue);
              });
          }
      };
      SoftphoneService.prototype.setCallback = function (type, callback) {
          this.UIModel.setCallback(type, callback);
      };
      SoftphoneService.prototype.getCallback = function (type) {
          return this.UIModel.getCallback(type);
      };
      SoftphoneService.prototype.hasCallback = function (type) {
          return this.UIModel.hasCallback(type);
      };
      /* These functions are just used within this SoftphoneService.ts file */
      /**
       *  @property {Method} _getSipConfig This function is used for setting up SipConfig
       */
      SoftphoneService.prototype._getSipConfig = function () {
          var remoteAudioElement = document.getElementById('remoteAudio'), // audio node on index.html
          model = this.UIModel.getInstance(), softphoneSettings = model.softphoneSettings;
          return {
              media: {
                  remote: {
                      audio: remoteAudioElement,
                  },
              },
              ua: {
                  displayName: utils.escapeSoftphoneUsername(softphoneSettings.displayName),
                  authorizationUser: utils.escapeSoftphoneUsername(softphoneSettings.authorizationUser),
                  password: softphoneSettings.sipPassword,
                  uri: softphoneSettings.uri,
                  wsServers: softphoneSettings.wsServers,
                  traceSip: true,
                  registerExpires: 60,
                  userAgentString: navigator.userAgent,
                  dialDest: model.agentSettings.dialDest,
              },
          };
      };
      /**
       * @param {Object} config has the keys authToken, agentId, callbacks, UIModel, dialDest, componentName, ssoLogin and authHost
       *  callbacks, UIModel, dialDest, componentName, ssoLogin and authHost are optional
       */
      SoftphoneService.prototype.init = function (config) {
          try {
              instance.resetInstance();
              this.UIModel = new SoftphoneModel(config.UIModel || {});
              var model = this.UIModel.getInstance();
              model.authenticateRequest.engageAccessToken = config.authToken;
              model.agentSettings.agentId = config.agentId;
              model.agentSettings.dialDest = config.dialDest;
              model.authenticateRequest.ssoLogin = config.ssoLogin;
              if (typeof config.authHost !== 'undefined') {
                  model.authHost = config.authHost;
              }
              if (config.componentName) {
                  RequestLoggingService.setComponentName(config.componentName);
              }
              this.setCallbacks((config && config.callbacks) || {});
          }
          catch (err) {
              console.error('sip init error:' + err);
          }
      };
      /**
       * @property {Method} _handleNoRegisterResponse This function would be called when
       * registration timeout reached, rotate registrar
       * and we want to force a registrar refresh
       */
      SoftphoneService.prototype._handleNoRegisterResponse = function () {
          // registration timeout reached, rotate registrar
          var model = this.UIModel.getInstance();
          var softphoneSettings = model.softphoneSettings;
          // we want to force a registrar refresh
          softphoneSettings.isRegistered = true;
          softphoneSettings.attemptingSoftphoneReconnect = false;
          this.switchSoftphoneRegistrar(softphoneSettings.maintainOH, softphoneSettings.autoStartOH);
      };
      /**
       * @property {Method} _registerHasResponse clear registration timeout
       */
      SoftphoneService.prototype._registerHasResponse = function () {
          clearTimeout(this.UIModel.getInstance().softphoneSettings.registerPending);
      };
      /**
       * @property {Method} _rotateWebRtcServer clear registration timeout
       * and rotate the webrtcServer and compare with last fetched .
       * @param {callback} callback
       */
      SoftphoneService.prototype._rotateWebRtcServer = function (callback) {
          var model = this.UIModel.getInstance();
          var softphoneSettings = model.softphoneSettings;
          this.UIModel.setCallback(CALLBACK_TYPES.ROTATE_WEBRTC_SERVER, callback);
          var sipInfo = softphoneSettings.sipInfo;
          var timeSinceLastFetch = Date.now() - softphoneSettings.lastSipFetchTime;
          console.log('## Checking to rotate webRtc Server.SipInfo array length is ' +
              sipInfo.length +
              '. Time since last fetch of webRtcInfo is ' +
              timeSinceLastFetch / 60000 +
              ' mins.');
          if (sipInfo.length > 1 && timeSinceLastFetch < 5 * 60000) {
              sipInfo.shift();
              console.log('## rotated sip server.Will now attempt to new server: ' +
                  sipInfo[0].domain);
              softphoneSettings.attemptingSoftphoneReconnect = true;
              this.UIModel.fireCallback(CALLBACK_TYPES.ROTATE_WEBRTC_SERVER, callback);
          }
          else {
              console.log('## fetching webRtcInfo.');
              // fetch Sip Registration info again if array is consumed to rotate registrar
              this.getWebRtcInfo(callback);
          }
      };
      /**
       * @property {Method} _updateOHFlags This function would be used to update offhook flags.
       * @param {boolean} maintainOffhook
       * @param {boolean} autoStartOffhook
       */
      SoftphoneService.prototype._updateOHFlags = function (maintainOffhook, autoStartOffhook) {
          var softphoneSettings = this.UIModel.getInstance().softphoneSettings;
          softphoneSettings.maintainOH = maintainOffhook;
          softphoneSettings.autoStartOH = autoStartOffhook;
      };
      /**
       * @property {Method} _getCurrentWebRtcServerInfo This function is used to get current webRtc
       * server info/details
       */
      SoftphoneService.prototype._getCurrentWebRtcServerInfo = function () {
          var softphoneSettings = this.UIModel.getInstance().softphoneSettings;
          return softphoneSettings.sipInfo != null &&
              softphoneSettings.sipInfo.length > 0
              ? softphoneSettings.sipInfo[0]
              : null;
      };
      ///////////////////////////////
      // SIP JS CALLBACK FUNCTIONS //
      ///////////////////////////////
      /* These functions bubble up SIP callbacks to the UI */
      /**
       * @property {Method} _connected send response to agent-js
       */
      SoftphoneService.prototype._connected = function () {
          // send response to agent-js
          this.UIModel.fireCallback(CALLBACK_TYPES.SIP_CONNECTED, {
              message: 'SIP connected',
          });
      };
      /**
       * @property {Method} _ended This is used for ended Sip
       */
      SoftphoneService.prototype._ended = function () {
          this.UIModel.fireCallback(CALLBACK_TYPES.SIP_ENDED, {
              message: 'SIP ended',
          });
      };
      /**
       * @property {Method} _registered This is used for registration of sip
       */
      SoftphoneService.prototype._registered = function () {
          var model = this.UIModel.getInstance();
          this._registerHasResponse();
          model.softphoneSettings.isRegistered = true;
          if (!(model.agentSettings && model.agentSettings.dialDest)) {
              return false;
          }
          // check if dial destination has changed to a new registrar,
          // but not just with the IQ replacement of @RC_SOFTPHONE
          if (model.agentSettings.dialDest !==
              model.softphoneSettings.sipDialDest &&
              model.agentSettings.dialDest.indexOf('@RC_SOFTPHONE') === -1) {
              // update agent dial dest on instance
              model.agentSettings.dialDest = JSON.parse(JSON.stringify(model.softphoneSettings.sipDialDest));
              // notify agent of change
              var responseObj = {
                  message: 'SIP dial destination changed',
                  dialDest: model.agentSettings.dialDest,
                  maintainOH: model.softphoneSettings.maintainOH,
                  autoStartOH: model.softphoneSettings.autoStartOH,
              };
              if (!model.softphoneSettings.autoStartOH) {
                  model.softphoneSettings.attemptingSoftphoneReconnect = false; // done with reconnect steps for now
              }
              this.UIModel.fireCallback(CALLBACK_TYPES.SIP_DIAL_DEST_CHANGED, responseObj);
              // update dial destination on agent login record, send request to IQ
              this.UIModel.fireCallback(CALLBACK_TYPES.UPDATE_DIAL_DEST, model.agentSettings.dialDest, true);
          }
          this.UIModel.fireCallback(CALLBACK_TYPES.SIP_REGISTERED, {
              message: 'SIP registered',
          });
      };
      /**
       * @property {Method} _unregistered This is used to unregister with the sip registrar
       */
      SoftphoneService.prototype._unregistered = function () {
          var model = this.UIModel.getInstance();
          this._registerHasResponse();
          model.softphoneSettings.isRegistered = false;
          this.sipTerminate();
          this.sipInit();
      };
      /**
       * @property {Method} _registrationFailed This is called when registration has been failed.
       */
      SoftphoneService.prototype._registrationFailed = function () {
          var model = this.UIModel.getInstance();
          this._registerHasResponse();
          model.softphoneSettings.isRegistered = false;
          this.sipTerminate();
      };
      /**
       * @property {Method} _ringing This is called when ring is initiated
       * do not notify the app of ringing if Rc Call Source is not 'partner-contact-center'
       * @param notif
       */
      SoftphoneService.prototype._ringing = function (notif) {
          // do not notify the app of ringing if Rc Call Source is not 'partner-contact-center'
          var rcHeader = notif.transaction &&
              notif.transaction.request &&
              notif.transaction.request.headers['P-Rc-Destination'];
          // if we don't have the 'p-rc-destination' header,
          // OR if the header exists but we don't have the value 'ev-agent',
          // then don't fire ringing callback and just return
          if (!rcHeader ||
              (rcHeader &&
                  rcHeader.length === 1 &&
                  rcHeader[0].raw !== 'ev-agent')) {
              return;
          }
          this.UIModel.fireCallback(CALLBACK_TYPES.SIP_RINGING, {
              message: 'SIP ringing',
              data: notif,
          });
      };
      /**
       * @property {Method} _mute This is used to mute
       */
      SoftphoneService.prototype._mute = function () {
          this.UIModel.getInstance().softphoneSettings.muteActive = true;
          return this.UIModel.getInstance().softphoneSettings.muteActive;
      };
      /**
       * @property {Method} _unmute This is used for unmute.
       */
      SoftphoneService.prototype._unmute = function () {
          this.UIModel.getInstance().softphoneSettings.muteActive = false;
          return this.UIModel.getInstance().softphoneSettings.muteActive;
      };
      /**
       * @property {Method} [callback=null] Callback function when web rtc info response received
       */
      SoftphoneService.prototype.getWebRtcInfo = function (callback) {
          return __awaiter(this, void 0, void 0, function () {
              var sipInfo, model, webRTCRequest;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          sipInfo = this._getCurrentWebRtcServerInfo();
                          model = this.UIModel.getInstance();
                          this.UIModel.fireCallback(CALLBACK_TYPES.WEBRTC_INFO, callback);
                          if (!(!sipInfo &&
                              model.authenticateRequest.engageAccessToken &&
                              model.agentSettings.agentId)) return [3 /*break*/, 2];
                          webRTCRequest = new WebRtcInfoRequest();
                          return [4 /*yield*/, webRTCRequest.getSipRegistrationInfo(this.UIModel)];
                      case 1:
                          _a.sent();
                          return [3 /*break*/, 3];
                      case 2:
                          this.UIModel.fireCallback(CALLBACK_TYPES.WEBRTC_INFO, model.softphoneSettings.sipInfo);
                          _a.label = 3;
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      return SoftphoneService;
  }());

  return SoftphoneService;

})));

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./index').polyfill();

},{"./index":2}],2:[function(require,module,exports){
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

'use strict';

function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};

},{}]},{},[1]);

/**
 * @fileOverview Exposed functionality for Contact Center AgentUI.
 * @namespace AgentLibrary
 */

;(function (global) {

var AddSessionNotification = function () {};

/*
 * This class is responsible for handling "ADD-SESSION" packets from IntelliQueue.  This is used by
 * the CallControlForm. Then it will increment the total_calls count.
 *
 * {
 *   "ui_notification": {
 *       "@message_id": "IQ982008082918151403727",
 *       "@response_to": "",
 *       "@type": "ADD-SESSION",
 *       "session_id": { "#text": "2" },
 *       "uii": { "#text": "200808291814560000000900016558" },
 *       "phone": { "#text": "200808291814370000000900016555" },
 *       "session_type": { "#text": "AGENT" },
 *       "session_label": { "#text": "Primary Agents Call Session" },
 *       "allow_control": { "#text": "TRUE" },
 *       "monitoring": { "#text": "FALSE" },
 *       "agent_id": { "#text": "1856" },
 *       "segment_id": { "#text": "550e8400-e29b-41d4-a716-446655440000" },
 *       "summary": { "#text": "FALSE" }
 *   }
 *  }
 */
AddSessionNotification.prototype.processResponse = function (notification) {
    var model = UIModel.getInstance();
    var notif = notification.ui_notification;
    var sessionAgentId = utils.getText(notif, 'agent_id');

    if (utils.getText(notif, 'session_type') === 'AGENT') {
        model.incrementTotalCalls();
    }

    if (sessionAgentId === model.agentSettings.agentId) {
        // add the session_id of this leg to the current call packet -
        // this way we can use it for hangups later.
        model.currentCall.sessionId = utils.getText(notif, 'session_id');
    } else if (sessionAgentId != '') {
        // this is a monitoring session, lets save the monitored agent id for barge-ins
        model.currentCall.monitorAgentId = sessionAgentId;
    }

    // Check to see if we have a transfer leg here, if so, register it
    var sessionType = utils.getText(notif, 'session_type'),
        allowControl = utils.getText(notif, 'allow_control'),
        sessionId = utils.getText(notif, 'session_id'),
        uii = utils.getText(notif, 'uii'),
        isMonitoring = model.currentCall.isMonitoring,
        monitoringType = model.currentCall.monitoringType;

    var isBargeInMonitor = isMonitoring && monitoringType === 'FULL',
        notCurrentAgent = sessionAgentId !== model.agentSettings.agentId,
        notSessionOne = sessionId !== '1',
        shouldTrackSession = false;

    if (notSessionOne && notCurrentAgent) {
        if (isBargeInMonitor) {
            shouldTrackSession = true;
        } else if (allowControl) {
            if (sessionType === 'OUTBOUND' || sessionType === 'AGENT') {
                shouldTrackSession = true;
            }
        }
    }

    if (shouldTrackSession) {
        var destination = utils.getText(notif, 'phone');

        if (sessionType === 'AGENT' || sessionAgentId !== '') {
            destination = utils.getText(notif, 'agent_name');
        }

        model.transferSessions[sessionId] = {
            sessionId: sessionId,
            destination: destination,
            uii: uii,
        };
    }

    // if agent session, set on call status
    if (notif.session_id === '2') {
        model.agentSettings.onCall = true;
    }

    model.currentCall.segmentId = utils.getText(notif, 'segment_id');
    model.currentCall.enableConversationSummary = utils.getText(
        notif,
        'summary'
    );

    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.status = 'OK';
    formattedResponse.message = 'Received ADD-SESSION notification';
    formattedResponse.sessionId = utils.getText(notif, 'session_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.phone = utils.getText(notif, 'phone');
    formattedResponse.sessionType = utils.getText(notif, 'session_type');
    formattedResponse.sessionLabel = utils.getText(notif, 'session_label');
    formattedResponse.allowControl = utils.getText(notif, 'allow_control');
    formattedResponse.monitoring = utils.getText(notif, 'monitoring');
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.recordingUrl = utils.getText(notif, 'recording_url');
    formattedResponse.transferSessions = model.transferSessions;
    formattedResponse.segmentId = utils.getText(notif, 'segment_id');
    formattedResponse.summary = utils.getText(notif, 'summary');

    return formattedResponse;
};

var AdminDebugEmailNotification = function () {};

/*
 * This class is responsible for handling "AGENT-DEBUG-EMAIL" packets from IntelliQueue
 *
 * {
 *   "ui_notification":{
 *      "@message_id":"IQD01DEV2018071616521500004",
 *      "@response_to":"",
 *      "@type":"AGENT-DEBUG-EMAIL",
 *      "email_to": {
 *          "#text":"rmyers@connectfirst.com"
 *      }
 *      "requested_by": {
 *          "#text":"Ross Myers"
 *      }
 *   }
 * }
 */
AdminDebugEmailNotification.prototype.processResponse = function (
    notification
) {
    var formattedResponse = utils.buildDefaultResponse(notification);
    var notif = notification.ui_notification;

    formattedResponse.status = 'OK';
    formattedResponse.message = 'Received AGENT-DEBUG-EMAIL notification';
    formattedResponse.emailTo = utils.getText(notif, 'email_to');
    formattedResponse.requestedBy = utils.getText(notif, 'requested_by');

    return formattedResponse;
};

var DialGroupChangeNotification = function () {};

/*
 * This class is responsible for handling a DIAL_GROUP_CHANGE notification.
 * This event is sent from IQ when an agent's dial group is changed in through the AdminUI.
 *
 *   {
 *       "ui_notification": {
 *           "@message_id": "IQ10012016080413085500263",
 *           "@type": "DIAL_GROUP_CHANGE",
 *           "agent_id": { "#text": "1180958" },
 *           "dial_group_id": { "#text": "50354" },
 *           "dialGroupName": { "#text": "Preview Dial Mode" },
 *           "dial_group_desc": {}
 *       }
 *   }
 */
DialGroupChangeNotification.prototype.processResponse = function (
    notification
) {
    //Modify loginRequest with new DialGroupId
    var model = UIModel.getInstance();
    var notif = notification.ui_notification;
    var origLoginType = model.loginRequest.loginType;
    var newDgId = utils.getText(notif, 'dial_group_id');

    model.dialGroupChangeNotification = notification;

    // Calculate type of login - called from AdminUI when assigning agent to new dial group.
    // Only options should be BLENDED or OUTBOUND here.
    if (
        newDgId &&
        newDgId !== '' &&
        (origLoginType === 'INBOUND' || origLoginType === 'BLENDED')
    ) {
        model.loginRequest.loginType = 'BLENDED';
    } else if (newDgId && newDgId !== '') {
        model.loginRequest.loginType = 'OUTBOUND';
    } else if (origLoginType === 'INBOUND') {
        model.loginRequest.loginType = 'INBOUND';
    } else {
        model.loginRequest.loginType = 'NO-SELECTION';
    }

    UIModel.getInstance().loginRequest.dialGroupId = newDgId;

    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.message = 'Dial Group Updated Successfully.';
    formattedResponse.detail = 'Dial Group changed to [' + newDgId + '].';
    formattedResponse.dialGroupId = utils.getText(notif, 'dial_group_id');
    formattedResponse.dialGroupName = utils.getText(notif, 'dialGroupName'); // camel case from server for some reason :/
    formattedResponse.dialGroupDesc = utils.getText(notif, 'dial_group_desc');
    formattedResponse.agentId = utils.getText(notif, 'agent_id');

    return formattedResponse;
};

var DialGroupChangePendingNotification = function () {};

/*
 * This class is responsible for handling a DIAL_GROUP_CHANGE_PENDING notification.
 * This event is sent from IQ when an agent's dial group is changed and the agent is on a call.
 *
 * {
 *     "ui_notification": {
 *         "@message_id": "IQ10012016080515294800318",
 *         "@type": "DIAL_GROUP_CHANGE_PENDING",
 *         "agent_id": { "#text": "1180958" },
 *         "dial_group_id": { "#text": "50354" },
 *         "update_from_adminui": { "#text": "TRUE" }
 *     }
 * }
 */
DialGroupChangePendingNotification.prototype.processResponse = function (
    notification
) {
    var model = UIModel.getInstance();
    var notif = notification.ui_notification;
    model.agentSettings.pendingDialGroupChange = parseInt(
        utils.getText(notif, 'dial_group_id'),
        10
    );

    // check if request originated with AdminUI
    if (notif.update_from_adminui) {
        model.agentSettings.updateDGFromAdminUI =
            utils.getText(notif, 'update_from_adminui') === true;
    } else {
        model.agentSettings.updateDGFromAdminUI = false;
    }

    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.message =
        'Dial Group Change Pending notification received.';
    formattedResponse.detail =
        'DialGroup switch for existing session pending until active call ends.';
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.dialGroupId = utils.getText(notif, 'dial_group_id');
    formattedResponse.updateFromAdminUI = utils.getText(
        notif,
        'update_from_adminui'
    );

    return formattedResponse;
};

var DirectAgentTransferNotification = function () {};

/*
 * This class is responsible for handling a DIRECT-AGENT-ROUTE notification.
 * This event is sent from IQ when an agent is presented a direct transfer, in the case they are not in an
 * available state to automatically be presented the call.
 *
 * {
 *     "ui_notification": {
 *         "@message_id": "IQ10012016080515294800318",
 *         "@type": "DIRECT-AGENT-ROUTE",
 *         "response_to": { "#text": "" },
 *         "agent_id": { "#text": "" },
 *         "uii": { "#text": "" },
 *         "status": { "#text": "" },
 *         "ani": { "#text": "" },
 *         "dnis": { "#text": "" }
 *         "source_type": { "#text": "" },
 *         "source_id": { "#text": "" },
 *         "source_name": { "#text": "" }
 *         "voicemail_url": { "#text": "" }
 *     }
 * }
 */
DirectAgentTransferNotification.prototype.processResponse = function (
    notification
) {
    var formattedResponse = utils.buildDefaultResponse(notification);
    var notif = notification.ui_notification;

    formattedResponse.message = 'Received DIRECT-AGENT-ROUTE notification';
    formattedResponse.status = utils.getText(notif, 'status');
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.ani = utils.getText(notif, 'ani');
    formattedResponse.dnis = utils.getText(notif, 'dnis');
    formattedResponse.sourceType = utils.getText(notif, 'source_type');
    formattedResponse.sourceId = utils.getText(notif, 'source_id');
    formattedResponse.sourceName = utils.getText(notif, 'source_name');
    formattedResponse.voicemailUrl = utils.getText(notif, 'voicemail_url');

    return formattedResponse;
};

var DropSessionNotification = function () {};

/*
 * This class handles the DROP-SESSION packet from IQ. It doesn't really do anything
 * besides format a response for the callback notification since there isn't any action needed.
 *
 *  {
 *      "ui_notification": {
 *          "@message_id":"IQ10012016081613222800341",
 *          "@response_to":"",
 *          "@type":"DROP-SESSION",
 *          "session_id":{"#text":"3"},
 *          "uii":{"#text":"201608161322180139000000000124"}
 *      }
 *  }
 */
DropSessionNotification.prototype.processResponse = function (notification) {
    var formattedResponse = utils.buildDefaultResponse(notification);
    var notif = notification.ui_notification;

    var sessionId = utils.getText(notif, 'session_id');
    var sessionUII = utils.getText(notif, 'uii');
    var transfer = UIModel.getInstance().transferSessions[sessionId];

    // Check to see if we just disconnected a transfer session
    // If so, we need to remove the session from our map
    if (transfer) {
        console.log(
            sessionUII + ' TRANSFER TO ' + transfer.destination + ' TERMINATED'
        );
        utils.logMessage(
            LOG_LEVELS.DEBUG,
            'Transfer to ' + transfer.destination + ' has terminated',
            ''
        );
        delete UIModel.getInstance().transferSessions[sessionId];
        formattedResponse.transferEnd = transfer;
    }

    console.log(sessionUII + ' END SESSION ' + sessionId);
    formattedResponse.message = 'Received DROP-SESSION Notification';
    formattedResponse.status = 'OK';
    formattedResponse.sessionId = utils.getText(notif, 'session_id');
    formattedResponse.uii = utils.getText(notif, 'uii');

    return formattedResponse;
};

var EarlyUiiNotification = function () {};

/*
 * This class is responsible for handling "EARLY_UII" packets from IntelliQueue.
 * For manual outdials, this gives the uii to cancel a ringing line.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"EARLY_UII",
 *          "agent_id":{"#text":"1180958"},
 *          "uii":{"#text":"201608161200240139000000000120"}
 *      }
 *  }
 */
EarlyUiiNotification.prototype.processResponse = function (notification) {
    var formattedResponse = utils.buildDefaultResponse(notification);
    var notif = notification.ui_notification;

    formattedResponse.message = 'Received EARLY_UII notification';
    formattedResponse.status = 'OK';
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.uii = utils.getText(notif, 'uii');

    return formattedResponse;
};

var EndCallNotification = function (libInstance) {
    this.libInstance = libInstance;
};

/*
 * This class is responsible for handling an END-CALL notification.
 * Save the packet in the UIModel by appending it to the currentCall packet.
 * Update the CallState field in the UIModel to "CALL-ENDED"
 *
 * {
 *  "ui_notification":{
 *      "@message_id":"IQ982008082910362203349",
 *      "@response_to":"",
 *      "@type":"END-CALL",
 *      "agent_id":{"#text":"1856"},
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "session_id":{"#text":"2"},
 *      "call_dts":{"#text":"2008-08-29 10:36:04"},
 *      "call_duration":{"#text":"16"},
 *      "term_party":{"#text":"CALLER"},
 *      "term_reason":{},
 *      "recording_url":{},
 *      "disposition_timeout:{"#text":"60"}
 *  }
 * }
 */
EndCallNotification.prototype.processResponse = function (notification) {
    var model = UIModel.getInstance();
    var notif = notification.ui_notification;
    model.endCallNotification = notification;

    // add callDuration, termParty, and termReason to the current call packet
    model.currentCall.duration = utils.getText(notif, 'call_duration');
    model.currentCall.termParty = utils.getText(notif, 'term_party');
    model.currentCall.termReason = utils.getText(notif, 'term_reason');

    // set call state to "CALL-ENDED"
    model.agentSettings.callState = 'CALL-ENDED';
    model.agentSettings.onCall = false;
    model.agentSettings.onManualOutdial = false;

    // Clear out any transfer sessions from the previous call
    model.transferSessions = {};

    // Check if there is a pending dial group change
    if (
        model.agentSettings.pendingDialGroupChange > 0 ||
        model.agentSettings.pendingDialGroupChange == -1
    ) {
        // update dial group id
        model.loginRequest.dialGroupId =
            model.agentSettings.pendingDialGroupChange;

        // send login update request
        this.libInstance.loginAgent(
            model.loginRequest.queueIds,
            model.configRequest.chatIds,
            model.configRequest.skillProfileId,
            model.configRequest.dialGroupId,
            model.configRequest.dialDest,
            model.agentSettings.updateDGFromAdminUI
        );

        // reset pending dial group variables
        model.agentSettings.pendingDialGroupChange = 0;
        model.agentSettings.updateDGFromAdminUI = false;
    }

    // start ping call interval timer, sends message every 30 seconds
    // if this is not a manual outdial and we are not suppressing disposition pop
    if (
        model.currentCall.outdialDispositions &&
        model.currentCall.outdialDispositions.dispositions &&
        model.currentCall.outdialDispositions.dispositions.length > 0 &&
        model.currentCall.surveyPopType !== 'SUPPRESS' &&
        !model.currentCall.isMonitoring
    ) {
        clearInterval(model.pingIntervalId);
        model.pingIntervalId = setInterval(utils.sendPingCallMessage, 30000);
    }

    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.message = 'End Call Notification Received.';
    formattedResponse.detail = '';
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.sessionId = utils.getText(notif, 'session_id');
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.callDts = utils.getText(notif, 'call_dts');
    formattedResponse.duration = model.currentCall.duration;
    formattedResponse.termParty = model.currentCall.termParty;
    formattedResponse.termReason = model.currentCall.termReason;
    formattedResponse.recordingUrl = utils.getText(notif, 'recording_url');
    formattedResponse.dispositionTimeout = utils.getText(
        notif,
        'disposition_timeout'
    );
    console.log(formattedResponse.uii + ' END CALL');
    return formattedResponse;
};

var GatesChangeNotification = function () {};

/*
 * This class is responsible for handling a gates change notification
 *
 * {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016080817344100936",
 *          "@type":"GATES_CHANGE",
 *          "agent_id":{"#text":"1180958"},
 *          "gate_ids":{"#text":"11117,3"}
 *      }
 * }
 */
GatesChangeNotification.prototype.processResponse = function (notification) {
    var model = UIModel.getInstance();
    var notif = notification.ui_notification;
    var newAssignedGates = [];
    var availableQueues = model.inboundSettings.availableQueues;
    var assignedGateIds = utils.getText(notif, 'gate_ids');
    if (assignedGateIds !== '') {
        assignedGateIds = assignedGateIds.split(',');
    }

    for (var a = 0; a < assignedGateIds.length; a++) {
        // find gate in avail list
        var id = assignedGateIds[a];
        var foundGate = utils.findObjById(availableQueues, id, 'gateId');
        if (foundGate) {
            newAssignedGates.push(foundGate);
        } else {
            // gate not in assigned list, add stub
            var gate = {
                gateId: id,
                gateName: '',
                gateDesc: '',
                defaultDestOverride: '',
                isAgentSelectable: false,
            };
            newAssignedGates.push(gate);
        }
    }

    model.inboundSettings.queues = JSON.parse(JSON.stringify(newAssignedGates));

    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.message = 'Gates Change notification received.';
    formattedResponse.queues = newAssignedGates;

    return formattedResponse;
};

var GenericNotification = function () {};

/*
 * This class is responsible for handling a generic notification
 *
 * {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016080317400400011",
 *          "@response_to":"1c2fe39f-a31e-aff8-8d23-92a61c88270f",
 *          "@type":"GENERIC",
 *          "message_code":{"#text":"0"},
 *          "message":{"#text":"OK"},
 *          "detail":{"#text":"Pending Callback Successfully Cancelled."}
 *      }
 * }
 */
GenericNotification.prototype.processResponse = function (notification) {
    var formattedResponse = utils.buildDefaultResponse(notification);

    // add message and detail if present
    formattedResponse.messageCode = utils.getText(
        notification.ui_notification,
        'message_code'
    );

    return formattedResponse;
};

var NewCallNotification = function () {};

/*
 * This class processes a "NEW-CALL" packet received from Intelliqueue. It will determine
 * if the call is a regular or monitoring call:
 * 		@Monitoring==true:  set state to ACTIVE-MONITORING, send NewMonitoringCall event
 * 		@Monitoring==false: set state to ACTIVE, send newcall packet and increment total calls
 *
 *  {"ui_notification":{
 *      "@message_id":"IQ982010020911335300027",
 *      "@response_to":"",
 *      "@type":"NEW-CALL",
 *      "uii":{"#text":"201002091133350139990000000010"},
 *      "ani":{"#text":"9548298548"},
 *      "dnis":{},
 *      "dial_dest":{"#text":"sip:+16789050673@sip.connectfirst.com"},
 *      "call_type":{"#text":"OUTBOUND"},
 *      "queue_dts":{"#text":"2010-02-09 11:33:53"},
 *      "queue_time":{"#text":"-1"},
 *      "agent_id":{"#text":"657"},
 *      "app_url":{},
 *      "is_monitoring":{"#text":"FALSE"},
 *      "script_id":{},
 *      "script_version":{},
 *      "survey_id":{},
 *      "survey_pop_type":{"#text":"SUPPRESS"},
 *      "message":{},
 *      "agent_recording":{"@default":"ON","@pause":"10","#text":"TRUE"},
 *      "hangup_on_disposition":{"#text":"FALSE"},
 *      "gate":{
 *          "@number":"17038",
 *          "name":{"#text":"AM Campaign"},
 *          "description":{}
 *      },
 *      "outdial_dispositions":{
 *          "@type":"CAMPAIGN|GATE",
 *          "disposition":[
 *              { "@contact_forwarding":"FALSE", "@disposition_id":"20556", "@is_complete":"1", "@is_default"="0", "@require_note"="0", "@save_survey"="1", "@xfer"="0", "#text":"Not Available"},
 *              { "@contact_forwarding":"FALSE", "@disposition_id":"20559", "@is_complete":"1", "@is_default"="1", "@require_note"="1", "@save_survey"="1", "@xfer"="0", #text":"Transfer Not Available"}
 *          ]
 *      },
 *      "requeue_shortcuts":{
 *          "requeue_shortcut":[
 *              { "@gate_id":"2", "@name":"test queue" "@skill_id":""}
 *          ]
 *      },
 *      "baggage":{
 *          "@allow_updates":"TRUE",
 *          "@show_lead_passes":"TRUE",
 *          "@show_list_name":"TRUE",
 *          "aux_phone":{},
 *          "aux_greeting":{},
 *          "aux_external_url":{},
 *          "aux_data1":{"#text":"BMAK"},
 *          "aux_data2":{"#text":"BMAK-041653-934"},
 *          "aux_data3":{"#text":"Call Ctr 1"},
 *          "aux_data4":{},
 *          "aux_data5":{},
 *          "extern_id":{"#text":"9548298548"},
 *          "lead_id":{"#text":"64306"},
 *          "lead_passes":{"#text":"1"},
 *          "first_name":{"#text":"Ryant"},
 *          "last_name":{"#text":"Taylor"},
 *          "mid_name":{},
 *          "address1":{"#text":"8010 Maryland Ave"},
 *          "address2":{},
 *          "city":{"#text":"Cleveland"},
 *          "state":{"#text":"OH"},
 *          "zip":{"#text":"44105"},
 *          "custom_labels":{
 *              "aux_1_label":{},
 *              "aux_2_label":{},
 *              "aux_3_label":{},
 *              "aux_4_label":{},
 *              "aux_5_label":{}
 *          }
 *      },
 *      "survey_response":{
 *          "@response_id":"24",
 *          "@survey_id":"1775",
 *          "details":{
 *              "detail":[
 *                  {"@element_id":"9001","@option_id":"0","#text":"Box 1"},
 *                  {"@element_id":"9002","@option_id":"0","#text":"Area 1"},
 *                  {"@element_id":"9003","@option_id":"6439"},
 *                  {"@element_id":"9004","@option_id":"6443"},
 *                  {"@element_id":"9004","@option_id":"6444"},
 *                  {"@element_id":"9005","@option_id":"6447"},
 *                  {"@element_id":"9006","@option_id":"0","#text":"11/20/2013"},
 *                  {"@element_id":"9015","@option_id":"0","#text":"Box 2"},
 *                  {"@element_id":"9016","@option_id":"0","#text":"Area 2"},
 *                  {"@element_id":"9017","@option_id":"6466"},
 *                  {"@element_id":"9018","@option_id":"6471"},
 *                  {"@element_id":"9018","@option_id":"6472"},
 *                  {"@element_id":"9019","@option_id":"6477"},
 *                  {"@element_id":"9020","@option_id":"0","#text":"11/21/2013"}
 *             ]
 *          }
 *      }
 *    }
 *  }
 */
NewCallNotification.prototype.processResponse = function (notification) {
    var model = UIModel.getInstance();
    var notif = notification.ui_notification;

    var newCall = utils.buildDefaultResponse(notification);
    newCall.message = 'Received NEW-CALL notification';
    newCall.status = 'OK';
    newCall.uii = utils.getText(notif, 'uii');
    newCall.agentId = utils.getText(notif, 'agent_id');
    newCall.dialDest = utils.getText(notif, 'dial_dest');
    newCall.queueDts = utils.getText(notif, 'queue_dts');
    newCall.queueTime = utils.getText(notif, 'queue_time');
    newCall.ani = utils.getText(notif, 'ani');
    newCall.dnis = utils.getText(notif, 'dnis');
    newCall.dnisE164 = utils.getText(notif, 'dnis_e164');
    newCall.callType = utils.getText(notif, 'call_type');
    newCall.appUrl = utils.getText(notif, 'app_url');
    newCall.isMonitoring = utils.getText(notif, 'is_monitoring');
    newCall.allowHold = utils.getText(notif, 'allow_hold');
    newCall.allowTransfer = utils.getText(notif, 'allow_transfer');
    newCall.allowManualInternationalTransfer = utils.getText(
        notif,
        'allow_manual_international_transfer'
    );
    newCall.allowDirectAgentTransfer = utils.getText(
        notif,
        'allow_direct_agent_transfer'
    );
    newCall.allowHangup = utils.getText(notif, 'allow_hangup');
    newCall.allowRequeue = utils.getText(notif, 'allow_requeue');
    newCall.allowEndCallForEveryone = utils.getText(
        notif,
        'allow_endcallforeveryone'
    );
    newCall.scriptId = utils.getText(notif, 'script_id');
    newCall.scriptVersion = utils.getText(notif, 'script_version');
    newCall.surveyId = utils.getText(notif, 'survey_id');
    newCall.surveyPopType = utils.getText(notif, 'survey_pop_type');
    newCall.requeueType = utils.getText(notif, 'requeue_type');
    newCall.hangupOnDisposition = utils.getText(notif, 'hangup_on_disposition');
    newCall.callerName = utils.getText(notif, 'caller_name');

    if (newCall.isMonitoring) {
        newCall.monitoringType = utils.getText(notif, 'monitoring_type'); // FULL, COACHING, MONITOR
    }

    // set collection values
    newCall.queue = utils.processResponseCollection(
        notification,
        'ui_notification',
        'gate'
    )[0];
    newCall.agentRecording = utils.processResponseCollection(
        notification,
        'ui_notification',
        'agent_recording',
        'agentRecording'
    )[0];
    newCall.outdialDispositions = utils.processResponseCollection(
        notification,
        'ui_notification',
        'outdial_dispositions',
        'disposition'
    )[0];
    newCall.requeueShortcuts =
        utils.processResponseCollection(
            notification,
            'ui_notification',
            'requeue_shortcuts',
            'requeueShortcut'
        )[0] || [];
    newCall.baggage = utils.processResponseCollection(
        notification,
        'ui_notification',
        'baggage'
    )[0];
    newCall.surveyResponse = utils.processResponseCollection(
        notification,
        'ui_notification',
        'survey_response',
        'detail'
    )[0];
    newCall.scriptResponse = {};
    newCall.transferPhoneBook = utils.processResponseCollection(
        notification,
        'ui_notification',
        'transfer_phone_book'
    )[0];
    newCall.lead = utils.processResponseCollection(
        notification,
        'ui_notification',
        'lead'
    )[0];

    // parse extra data correctly
    try {
        if (notif.lead && notif.lead.extra_data) {
            delete newCall.lead.extraDatas;
            newCall.lead.extraData = {};
            for (var key in notif.lead.extra_data) {
                newCall.lead.extraData[key] =
                    notif.lead.extra_data[key]['#text'];
            }
        }
    } catch (e) {
        console.warn('error parsing new call lead extra data: ' + e);
    }

    if (newCall.baggage) {
        // process custom labels correctly
        newCall.baggage.customLabels = {};
        var notifLabels = notif.baggage['custom_labels'];

        for (var lbl in notifLabels) {
            var result = '';
            if (notifLabels && notifLabels[lbl] && notifLabels[lbl]['#text']) {
                result = notifLabels[lbl]['#text'];
            }
            newCall.baggage.customLabels[lbl] = result;
        }
    }

    // set saved script response if present
    try {
        var savedModel = JSON.parse(notif.script_result['#text']).model;
        var results = {};
        var keys = Object.keys(savedModel);
        for (var idx = 0; idx < keys.length; idx++) {
            var value = savedModel[keys[idx]].value;
            results[key] = value;
        }
        newCall.scriptResponse = results;
    } catch (err) {
        // do nothing with err
    }

    // fix phonebook format
    if (newCall.transferPhoneBook && newCall.transferPhoneBook.entrys) {
        newCall.transferPhoneBook = newCall.transferPhoneBook.entrys;
    }

    // fix requeue shortcuts
    if (newCall.requeueShortcuts && newCall.requeueShortcuts.requeueShortcuts) {
        newCall.requeueShortcuts = newCall.requeueShortcuts.requeueShortcuts;
    }

    // if only one disposition, convert to array
    if (
        newCall.outdialDispositions &&
        newCall.outdialDispositions.disposition
    ) {
        newCall.outdialDispositions.dispositions = [
            newCall.outdialDispositions,
        ];
    }

    // convert numbers to boolean where applicable
    newCall.queue.isCampaign = newCall.queue.isCampaign === '1';
    if (
        newCall.outdialDispositions &&
        newCall.outdialDispositions.dispositions
    ) {
        for (
            var d = 0;
            d < newCall.outdialDispositions.dispositions.length;
            d++
        ) {
            var disp = newCall.outdialDispositions.dispositions[d];
            disp.isComplete = disp.isComplete === '1';
            disp.requireNote = disp.requireNote === '1';
            disp.saveSurvey = disp.saveSurvey === '1';
            disp.xfer = disp.xfer === '1';
            disp.isDefault = disp.isDefault === '1';
        }
    }

    // Build token map
    model.callTokens = buildCallTokenMap(notif, newCall);
    newCall.baggage = model.callTokens; // add all tokens to baggage

    // Is Monitoring Call?
    if (newCall.isMonitoring) {
        model.agentSettings.callState = 'ACTIVE-MONITORING';
    } else {
        model.agentSettings.callState = 'ACTIVE';

        // check for preloaded transfer number
        if (newCall.baggage && newCall.baggage.auxPhone != '') {
            model.transferNumber = newCall.baggage.auxPhone;
        }
    }

    // Reset the current call counter for Agent Daily Stats
    model.agentDailyStats.currCallTime = 0;

    // todo handle scripting??
    model.currentCall = newCall;
    model.callHistory[newCall.uii] = newCall;

    return newCall;
};

function buildCallTokenMap(notif, newCall) {
    var model = UIModel.getInstance();
    var tokens = newCall.baggage || {}; // seed with baggage values
    if (notif.baggage && notif.baggage.generic_key_value_pairs) {
        var keyValuePairs = [];
        var keyValuePairsStr = utils.getText(
            notif.baggage,
            'generic_key_value_pairs'
        );
        if (keyValuePairsStr.length > 0) {
            keyValuePairs = utils.parseKeyValuePairsFromString(
                keyValuePairsStr,
                '|',
                '::'
            );
        }

        for (var keyValue in keyValuePairs) {
            tokens[keyValue] = keyValuePairs[keyValue];
        }
    }

    tokens['ani'] = newCall.ani;
    tokens['dnis'] = newCall.dnis;
    tokens['dnisE164'] = newCall.dnis;
    tokens['uii'] = newCall.uii;

    try {
        if (newCall.queue.number) {
            tokens['sourceId'] = newCall.queue.number || '';
            tokens['sourceName'] = newCall.queue.name || '';
            tokens['sourceDesc'] = newCall.queue.description || '';

            if (
                newCall.queue.isCampaign === '1' ||
                newCall.queue.isCampaign === true
            ) {
                tokens['sourceType'] = 'OUTBOUND';
            } else {
                tokens['sourceType'] = 'INBOUND';
            }
        } else {
            tokens['sourceId'] = '0';
            tokens['sourceType'] = 'MANUAL';
            tokens['sourceName'] = '';
            tokens['sourceDesc'] = '';
        }
    } catch (any) {
        console.error(
            'There was an error processing source tokenization',
            +any
        );
    }

    try {
        tokens['agentFirstName'] = model.agentSettings.firstName;
        tokens['agentLastName'] = model.agentSettings.lastName;
        tokens['agentExternalId'] = model.agentSettings.externalAgentId;
        tokens['agentType'] = model.agentSettings.agentType;
        tokens['agentEmail'] = model.agentSettings.email;
        tokens['agentUserName'] = model.agentSettings.username;
    } catch (any) {
        console.error(
            'There was an error parsing tokens for agent info. ',
            any
        );
    }

    return tokens;
}

function isCampaign(gate) {
    if (gate && gate.isCampaign) {
        return gate.isCampaign === '1' || gate.isCampaign === true;
    }
    return false;
}

var PendingChatDispNotification = function () {};

/*
 * This class is responsible for handling a pending chat disposition notification
 *
 *  {
 *       "ui_notification":{
 *           "@message_id":"IQD01DEV2018062912352800014",
 *           "@type":"PENDING_CHAT_DISP",
 *           "agent_id":{ "#text":"1182160" },
 *           "uii":{ "#text":"201806291234550147950000000000" },
 *           "status":{ "#text":"false" }
 *       }
 *   }
 */
PendingChatDispNotification.prototype.processResponse = function (
    notification
) {
    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.message = 'Received PENDING-CHAT-DISP notification';
    formattedResponse.status = 'OK';
    formattedResponse.agentId = utils.getText(
        notification.ui_notification,
        'agent_id'
    );
    formattedResponse.uii = utils.getText(notification.ui_notification, 'uii');
    formattedResponse.status =
        utils.getText(notification.ui_notification, 'status') === 'true';

    return formattedResponse;
};

var PendingDispNotification = function () {};

/*
 * This class is responsible for handling a generic notification
 *
 * {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016080317400400011",
 *          "@type":"PENDING_DISP",
 *          "agent_id":{"#text":"3"},
 *          "status":{"#text":"false"}
 *      }
 * }
 */
PendingDispNotification.prototype.processResponse = function (notification) {
    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.message = 'Received PENDING-DISP notification';
    formattedResponse.status = 'OK';
    formattedResponse.agentId = utils.getText(
        notification.ui_notification,
        'agent_id'
    );
    formattedResponse.status = utils.getText(
        notification.ui_notification,
        'status'
    );

    return formattedResponse;
};

var PreviewLeadStateNotification = function () {};

/*
 * This class is responsible for processing the lead state packet
 * received from intelliqueue. It will decide what type of leads are
 * being processed, and depending on if the callback is true or false, it will
 * call the appropriate form to update the lead state.
 *
 * {
 *      "ui_notification":{
 *          "@type":"PREVIEW-LEAD-STATE",
 *          "@call_type":"MANUAL|PREVIEW",
 *          "@message_id":"IQ10012016092715393600184",
 *          "request_id":{"#text":"IQ10012016092715390900179"},
 *          "lead_state":{"#text":"ANSWER"},
 *          "callback":{"#text":"FALSE"}
 *      }
 *   }
 * }
 */
PreviewLeadStateNotification.prototype.processResponse = function (
    notification
) {
    var notif = notification.ui_notification;

    UIModel.getInstance().agentSettings.onManualOutdial = true;

    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.callType = notif['@call_type'];
    formattedResponse.messageId = notif['@message_id'];
    formattedResponse.requestId = utils.getText(notif, 'request_id');
    formattedResponse.leadState = utils.getText(notif, 'lead_state');
    formattedResponse.callback = utils.getText(notif, 'callback');

    return formattedResponse;
};

var ReverseMatchNotification = function () {};

/*
 * This class is responsible for processing a REVERSE_MATCH packet from IQ. It
 * will log the packet was rec'd, save the packet to the UIModel for use by
 * components like the WhosCallingForm
 * {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016080317400400011",
 *          "@response_to":"1c2fe39f-a31e-aff8-8d23-92a61c88270f",
 *          "@type":"REVERSE_MATCH",
 *          "first_name":{"#text":""},
 *          "mid_name":{"#text":""},
 *          "last_name":{"#text":""},
 *          "address1":{"#text":""},
 *          "address2":{"#text":""},
 *          "city":{"#text":""},
 *          "state":{"#text":""},
 *          "zip":{"#text":""},
 *          "business_name":{"#text":""}
 *      }
 * }
 */
ReverseMatchNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var model = UIModel.getInstance();

    model.tokens['first_name'] = utils.getText(notif, 'first_name');
    model.tokens['mid_name'] = utils.getText(notif, 'mid_name');
    model.tokens['last_name'] = utils.getText(notif, 'last_name');
    model.tokens['address1'] = utils.getText(notif, 'address1');
    model.tokens['address2'] = utils.getText(notif, 'address2');
    model.tokens['suffix'] = utils.getText(notif, 'suffix');
    model.tokens['title'] = utils.getText(notif, 'title');
    model.tokens['city'] = utils.getText(notif, 'city');
    model.tokens['state'] = utils.getText(notif, 'state');
    model.tokens['zip'] = utils.getText(notif, 'zip');
    model.tokens['business_name'] = utils.getText(notif, 'business_name');

    return model.tokens;
};

var TcpaSafeLeadStateNotification = function () {};

/*
 * This class is responsible for processing the lead state packet
 * received from intelliqueue. It will decide what type of leads are
 * being processed, and depending on if the callback is true or false, it will
 * call the appropriate form to update the lead state.
 *
 * {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016080317400400011",
 *          "@type":"TCPA-SAFE-LEAD-STATE",
 *          "@call_type":"MANUAL|TCPA-SAFE",
 *          "request_id":{"#text":""},
 *          "lead_state":{"#text":"CALLING"},
 *          "callback":{"#text":"false"}
 *      }
 * }
 */
TcpaSafeLeadStateNotification.prototype.processResponse = function (
    notification
) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification);
    formattedResponse.callType = notif['@call_type'];
    formattedResponse.messageId = notif['@message_id'];
    formattedResponse.requestId = utils.getText(notif, 'request_id');
    formattedResponse.leadState = utils.getText(notif, 'lead_state');
    formattedResponse.callback = utils.getText(notif, 'callback');

    return formattedResponse;
};

var AckRequest = function (audioType, agentId, uii, monitorAgentId) {
    this.audioType = audioType || 'FULL';
    this.agentId = agentId;
    this.uii = uii;
    this.monitorAgentId = monitorAgentId;
};

/*
 * This class processes ACK packets rec'd from IQ.
 * This is a callback triggered by certain actions like
 * sending dispositions or script results.
 * NOTE: uii is added in utils message processing.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008090317393001252",
 *      "@response_to":"1112222",
 *      "@type":"ACK",
 *      "type":{"#text":"CHAT-DISPOSITION|INBOUND-DISPOSITION|OUTDIAL-DISPOSITION|SCRIPT-RESULT"},
 *      "status":{"#text":"OK|FAILURE"},
 *      "message":{"#text":""},
 *      "detail":{}
 *    }
 * }
 */
AckRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.type = utils.getText(resp, 'type');

    if (formattedResponse.status === 'OK') {
        utils.logMessage(LOG_LEVELS.DEBUG, formattedResponse.message, response);
    } else {
        utils.logMessage(
            LOG_LEVELS.WARN,
            formattedResponse.message + ': ' + formattedResponse.detail,
            response
        );
    }

    return formattedResponse;
};

var AgentStateRequest = function (agentState, agentAuxState) {
    if (
        agentState.toUpperCase() === 'ON-BREAK' &&
        UIModel.getInstance().agentSettings.onCall === true
    ) {
        this.agentState = 'BREAK-AFTER-CALL';
        this.agentAuxState = '';
    } else {
        this.agentState = agentState.toUpperCase() || '';
        this.agentAuxState = agentAuxState || '';
    }
};

AgentStateRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.AGENT_STATE,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            state: {
                '#text': this.agentState,
            },
            agent_aux_state: {
                '#text': this.agentAuxState,
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes AGENT-STATE packets rec'd from IQ. It will check the state of the
 * packet and then set the state on the model. It will also check for deferred surveys,
 * if one is found it will load it at this point.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082817165103294",
 *      "@type":"AGENT-STATE",
 *      "status":{"#text":"OK"},
 *      "message":{},
 *      "detail":{},
 *      "agent_id":{"#text":"1856"},
 *      "prev_state":{"#text":"ENGAGED"},
 *      "current_state":{"#text":"WORKING"},
 *      "agent_aux_state":{"#text":"Offhook Work"},
 *      "prev_aux_state":{}
 *   }
 * }
 */
AgentStateRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var status = utils.getText(resp, 'status');
    var prevState = utils.getText(resp, 'prev_state');
    var currState = utils.getText(resp, 'current_state');
    var prevAuxState = utils.getText(resp, 'prev_aux_state');
    var currAuxState = utils.getText(resp, 'agent_aux_state');
    var model = UIModel.getInstance();

    // add message and detail if present
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.agentId = response.ui_response.agent_id['#text'] || '';
    formattedResponse.previousState = prevState;
    formattedResponse.currentState = currState;
    formattedResponse.previousAuxState = prevAuxState;
    formattedResponse.currentAuxState = currAuxState;

    if (status == 'OK') {
        var prevStateStr = prevState;
        var currStateStr = currState;

        if (prevAuxState.length > 0) {
            prevStateStr = prevAuxState;
        }

        if (currAuxState.length > 0) {
            currStateStr = currAuxState;
        }

        // Update the state in the UIModel
        model.agentSettings.currentState = currState;
        model.agentSettings.currentStateLabel = currAuxState;
        model.agentStatePacket = response;
    } else {
        if (formattedResponse.message === '') {
            formattedResponse.message = 'Unable to change agent state';
        }

        // log message response
        var message =
            'Unable to change agent state. ' + formattedResponse.detail;
        utils.logMessage(LOG_LEVELS.WARN, message, response);
    }

    return formattedResponse;
};

var AuthenticateRequest = function (config) {
    this.username = config.username;
    this.password = config.password;
    this.platformId = config.platformId;
    this.rcAccessToken = config.rcAccessToken;
    this.tokenType = config.tokenType;
    this.engageAccessToken = config.engageAccessToken;
    this.authType = config.authType;
};

AuthenticateRequest.prototype.sendHttpRequest = function () {
    UIModel.getInstance().authenticateRequest = this;
    switch (this.authType) {
        case AUTHENTICATE_TYPES.USERNAME_PASSWORD:
            _buildHttpRequest(this.authType, 'login/agent', {
                username: this.username,
                password: this.password,
                platformId: this.platformId,
            });
            break;
        case AUTHENTICATE_TYPES.RC_TOKEN:
            _buildHttpRequest(this.authType, 'login/rc/accesstoken', {
                rcAccessToken: this.rcAccessToken,
                rcTokenType: this.tokenType,
            });
            break;
        case AUTHENTICATE_TYPES.ENGAGE_TOKEN:
            _buildHttpRequest(this.authType, 'login', {});
            break;
    }
};

/*
 * response:
 * {
 *   "refreshToken": "223867e6-ad0f-4af1-bbe7-5090d8259065",
 *   "accessToken": "",
 *   "tokenType": "Bearer",
 *   "platformId": "local",
 *   "iqUrl": "d01-dev.vacd.biz",
 *   "port": 8080,
 *   "agentDetails": [
 *       {
 *           "agentId": 1,
 *           "firstName": "D",
 *           "lastName": "LB",
 *           "email": "dlb@somewhere.com",
 *           "username": "dlbooks"
 *       }
 *   ],
 *   "adminId": null,
 *   "mainAccountId": "99990000"
 * }
 */
AuthenticateRequest.prototype.processResponse = function (response) {
    var model = UIModel.getInstance();
    model.authenticatePacket = response; // raw response packet
    model.authenticateRequest.accessToken = response.accessToken; // TODO - dlb - store in local storage
    model.authenticateRequest.refreshToken = response.refreshToken;
    model.authenticateRequest.tokenType = response.tokenType;
    model.authenticateRequest.socketUrl = response.iqUrl;
    model.authenticateRequest.socketPort = response.port;
    model.authenticateRequest.agents = response.agentDetails;
    model.authenticateRequest.platformId = response.platformId;
    model.authenticateRequest.mainAccountId = response.mainAccountId;

    return model.authenticateRequest;
};

function _buildHttpRequest(authType, path, queryParams) {
    var model = UIModel.getInstance();
    var baseUrl = model.authHost + model.baseAuthUri;
    var params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    switch (authType) {
        case AUTHENTICATE_TYPES.USERNAME_PASSWORD:
        case AUTHENTICATE_TYPES.RC_TOKEN:
            params['queryParams'] = queryParams;
            var errorMsg =
                'Error on agent authenticate POST to engage-auth. URL: ' +
                baseUrl +
                path;
            new HttpService(baseUrl).httpPost(path, params).then(
                function (response) {
                    try {
                        response = JSON.parse(response.response);
                        var authenticateResponse =
                            UIModel.getInstance().authenticateRequest.processResponse(
                                response
                            );
                        utils.fireCallback(
                            UIModel.getInstance().libraryInstance,
                            CALLBACK_TYPES.AUTHENTICATE,
                            authenticateResponse
                        );
                    } catch (err) {
                        utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                    }
                },
                function (err) {
                    var errResponse = {
                        type: 'Authenticate Error',
                        message: errorMsg,
                        err: err,
                    };
                    utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                    utils.fireCallback(
                        UIModel.getInstance().libraryInstance,
                        CALLBACK_TYPES.AUTHENTICATE,
                        errResponse
                    );
                }
            );
            break;
        case AUTHENTICATE_TYPES.ENGAGE_TOKEN:
            var errMsg =
                'Error on agent authenticate GET to engage-auth. URL: ' +
                baseUrl +
                path;
            params.headers['Authorization'] =
                'Bearer ' +
                utils.toString(
                    UIModel.getInstance().authenticateRequest.engageAccessToken
                );
            new HttpService(baseUrl).httpGet(path, params).then(
                function (response) {
                    try {
                        response = JSON.parse(response.response);
                        var authenticateResponse =
                            UIModel.getInstance().authenticateRequest.processResponse(
                                response
                            );

                        // Initializing ETRs ( source, language, category )
                        UIModel.getInstance().etrRequest.initEtrAPI();

                        utils.fireCallback(
                            UIModel.getInstance().libraryInstance,
                            CALLBACK_TYPES.AUTHENTICATE,
                            authenticateResponse
                        );
                    } catch (err) {
                        utils.logMessage(LOG_LEVELS.WARN, errMsg, err);
                    }
                },
                function (err) {
                    utils.logMessage(LOG_LEVELS.WARN, errMsg, err);
                    utils.fireCallback(
                        UIModel.getInstance().libraryInstance,
                        CALLBACK_TYPES.AUTHENTICATE,
                        err
                    );
                }
            );
            break;
    }
}

var BargeInRequest = function (audioType, agentId, uii, monitorAgentId) {
    this.audioType = audioType || 'FULL';
    this.agentId = agentId;
    this.uii = uii;
    this.monitorAgentId = monitorAgentId;
};

/*
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UIV22008931055822",
 *      "@response_to":"",
 *      "@type":"BARGE-IN",
 *      "agent_id":{"#text":"94"},
 *      "uii":{"#text":"200809031054510000000900020961"},
 *      "audio_state":{"#text":"FULL"},
 *      "monitor_agent_id":{"#text":"1856"}
 *    }
 * }
 */
BargeInRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.BARGE_IN,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            uii: {
                '#text': utils.toString(this.uii),
            },
            audio_state: {
                '#text': utils.toString(this.audioType),
            },
            monitor_agent_id: {
                '#text': utils.toString(this.monitorAgentId),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes BARGE-IN packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008090317393001252",
 *      "@response_to":"",
 *      "@type":"BARGE-IN",
 *      "agent_id":{"#text":"94"},
 *      "uii":{},
 *      "status":{"#text":"OK"},
 *      "message":{"#text":"Barge-In processed successfully!"},
 *      "detail":{}
 *    }
 * }
 */
BargeInRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.agentId = utils.getText(resp, 'agent_id');
    formattedResponse.uii = utils.getText(resp, 'uii');

    if (formattedResponse.status === 'OK') {
        utils.logMessage(LOG_LEVELS.DEBUG, formattedResponse.message, response);
    } else {
        utils.logMessage(
            LOG_LEVELS.WARN,
            'There was an error processing the Barge-In request. ' +
                formattedResponse.detail,
            response
        );
    }

    return formattedResponse;
};

var CallNotesRequest = function (notes) {
    this.notes = notes;
};

/*
 * This event is responsible for allowing an agent to tag a call with notes
 */
CallNotesRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@message_id': utils.getMessageId(),
            response_to: '',
            '@type': MESSAGE_TYPES.CALL_NOTES,
            agent_id: {
                '#text': utils.toString(model.agentSettings.agentId),
            },
            uii: {
                '#text': utils.toString(model.currentCall.uii),
            },
            notes: {
                '#text': utils.toString(this.notes),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class process CALL-NOTES packets rec'd from IntelliQueue.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082817165103294",
 *      "@type":"CALL-NOTES",
 *      "status":{"#text":"OK"},
 *      "message":{},
 *      "detail":{}
 *   }
 * }
 */
CallNotesRequest.prototype.processResponse = function (response) {
    var formattedResponse = utils.buildDefaultResponse(response);

    if (formattedResponse.status === 'OK') {
        formattedResponse.message = 'Call notes have been updated.';
        formattedResponse.type = 'INFO_EVENT';
    } else {
        formattedResponse.type = 'ERROR_EVENT';
        formattedResponse.message = 'Unable to update notes.';
    }

    return formattedResponse;
};

var CallbackCancelRequest = function (leadId, agentId) {
    this.agentId = agentId || UIModel.getInstance().agentSettings.agentId;
    this.leadId = leadId;
};

CallbackCancelRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CALLBACK_CANCEL,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': this.agentId,
            },
            lead_id: {
                '#text': this.leadId,
            },
        },
    };

    return JSON.stringify(msg);
};

// NOTE: cancel callback response sent as a generic notification message

var CallbacksPendingRequest = function (agentId) {
    this.agentId = agentId || UIModel.getInstance().agentSettings.agentId;
};

CallbacksPendingRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CALLBACK_PENDING,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': this.agentId,
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling an PENDING-CALLBACKS response packet from IntelliQueue.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008091512353000875",
 *      "@response_to":"UIV220089151235539",
 *      "@type":"PENDING-CALLBACKS",
 *      "lead":{
 *          "@aux_data1":"",
 *          "@aux_data2":"",
 *          "@aux_data3":"",
 *          "@aux_data4":"",
 *          "@aux_data5":"",
 *          "@destination":"5555555555",
 *          "@dial_group_id":"",
 *          "@dial_group_name":"",
 *          "@dial_time":"2016-08-03 10:00",
 *          "@extern_id":"",
 *          "@lead_id":"",
 *          "lead_id":{},
 *          "extern_id":{},
 *          "extern_id":{},
 *          "first_name":{},
 *          "mid_name":{},
 *          "last_name":{},
 *          "suffix":{},
 *          "title":{},
 *          "address1":{},
 *          "address2":{},
 *          "city":{},
 *          "state":{},
 *          "zip":{},
 *          "gate_keeper":{}
 *      }
 *   }
 * }
 */
CallbacksPendingRequest.prototype.processResponse = function (response) {
    var leadsRaw = response.ui_response.lead;
    var leads = [];
    if (!Array.isArray(leadsRaw)) {
        leadsRaw = [leadsRaw];
    }

    for (var l = 0; l < leadsRaw.length; l++) {
        var leadRaw = leadsRaw[l];
        if (leadRaw == null) {
            continue;
        }

        leads.push(parseLead(leadRaw));
    }

    UIModel.getInstance().agentSettings.pendingCallbacks = JSON.parse(
        JSON.stringify(leads)
    );

    return UIModel.getInstance().agentSettings.pendingCallbacks;
};

function parseLead(leadRaw) {
    var lead = {
        auxData1: leadRaw['@aux_data1'],
        auxData2: leadRaw['@aux_data2'],
        auxData3: leadRaw['@aux_data3'],
        auxData4: leadRaw['@aux_data4'],
        auxData5: leadRaw['@aux_data5'],
        destination: leadRaw['@destination'],
        dialGroupId: leadRaw['@dial_group_id'],
        dialGroupName: leadRaw['@dial_group_name'],
        dialTime: leadRaw['@dial_time'],
        externId: leadRaw['@extern_id'],
        leadId: leadRaw['@lead_id'],
        firstName: utils.getText(leadRaw, 'first_name'),
        midName: utils.getText(leadRaw, 'mid_name'),
        lastName: utils.getText(leadRaw, 'last_name'),
        sufix: utils.getText(leadRaw, 'suffix'),
        title: utils.getText(leadRaw, 'title'),
        address1: utils.getText(leadRaw, 'address1'),
        address2: utils.getText(leadRaw, 'address2'),
        city: utils.getText(leadRaw, 'city'),
        state: utils.getText(leadRaw, 'state'),
        zip: utils.getText(leadRaw, 'zip'),
        gateKeeper: utils.getText(leadRaw, 'gate_keeper'),
    };

    return lead;
}

/*
 * This request is used to get the list of dispositions for a given campaign
 * E.g. in the lead search form for manual passes
 *
 */
var CampaignDispositionsRequest = function (campaignId) {
    this.agentId = UIModel.getInstance().agentSettings.agentId;
    this.campaignId = campaignId;
};

CampaignDispositionsRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CAMPAIGN_DISPOSITIONS,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            campaign_id: {
                '#text': utils.toString(this.campaignId),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling CAMPAIGN-DISPOSITIONS packets received
 * from IntelliQueue. It will save a copy of it in the UIModel.
 *
 * {"ui_response":{
 *      "@campaign_id":"60403",
 *      "@message_id":"IQ10012016081813480400006",
 *      "@response_to":"0b61c3ca-c4fc-9942-c139-da4978053c9d",
 *      "@type":"CAMPAIGN-DISPOSITIONS",
 *      "outdial_dispositions":{
 *          "disposition":[
 *              {"@disposition_id":"1","#text":"requeue"},
 *              {"@disposition_id":"2","#text":"complete"}
 *          ]
 *       }
 *    }
 * }
 */
CampaignDispositionsRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var model = UIModel.getInstance();
    var dispositions = utils.processResponseCollection(
        resp,
        'outdial_dispositions',
        'disposition',
        'disposition'
    );

    model.outboundSettings.campaignDispositions = dispositions;
    return dispositions;
};

var ChatStateRequest = function (chatState) {
    this.chatState = (chatState && chatState.toUpperCase()) || '';
};

ChatStateRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_STATE,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            state: {
                '#text': this.chatState,
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes CHAT-STATE packets rec'd from IQ. It will check the state of the
 * packet and then set the state on the model.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082817165103294",
 *      "@type":"AGENT-STATE",
 *      "status":{"#text":"OK"},
 *      "message":{},
 *      "detail":{},
 *      "agent_id":{"#text":"1856"},
 *      "prev_state":{"#text":"CHAT-PRESENTED"},
 *      "current_state":{"#text":"CHAT-ENGAGED"}
 *   }
 * }
 */
ChatStateRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var status = utils.getText(resp, 'status');
    var prevState = utils.getText(resp, 'prev_state');
    var currState = utils.getText(resp, 'current_state');
    var model = UIModel.getInstance();

    // add message and detail if present
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.agentId = response.ui_response.agent_id['#text'] || '';
    formattedResponse.previousState = prevState;
    formattedResponse.currentState = currState;

    if (status == 'OK') {
        // Update the state in the UIModel
        model.agentSettings.currentChatState = currState;
        model.chatStatePacket = response;
    } else {
        if (formattedResponse.message === '') {
            formattedResponse.message = 'Unable to change chat state';
        }

        // log message response
        var message =
            'Unable to change chat state. ' + formattedResponse.detail;
        utils.logMessage(LOG_LEVELS.WARN, message, response);
    }

    return formattedResponse;
};

var XferColdRequest = function (dialDest, callerId, sipHeaders, countryId) {
    this.dialDest = dialDest;
    this.callerId = callerId || '';
    this.sipHeaders = sipHeaders || [];
    this.countryId = countryId || '';
};

XferColdRequest.prototype.formatJSON = function () {
    var fields = [];
    for (var i = 0; i < this.sipHeaders.length; i++) {
        var fieldObj = this.sipHeaders[i];
        fields.push({
            '@name': utils.toString(fieldObj.name),
            '@value': utils.toString(fieldObj.value),
        });
    }

    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.XFER_COLD,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            uii: {
                '#text': UIModel.getInstance().currentCall.uii,
            },
            dial_dest: {
                '#text': utils.toString(this.dialDest),
            },
            caller_id: {
                '#text': utils.toString(this.callerId),
            },
            country_id: {
                '#text': utils.toString(this.countryId),
            },
            xfer_header: fields,
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes COLD-XFER packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ10012016082314475000219",
 *      "@response_to":"",
 *      "@type":"COLD-XFER",
 *      "agent_id":{"#text":"1"},
 *      "uii":{"#text":"201608231447590139000000000200"},
 *      "session_id":{"#text":"3"},
 *      "status":{"#text":"OK"},
 *      "dial_dest":{"#text":"3038593775"},
 *      "message":{"#text":"OK"},
 *      "detail":{}
 *   }
 * }
 */
XferColdRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.agentId = utils.getText(resp, 'agent_id');
    formattedResponse.uii = utils.getText(resp, 'uii');
    formattedResponse.sessionId = utils.getText(resp, 'session_id');
    formattedResponse.dialDest = utils.getText(resp, 'dial_dest');

    if (formattedResponse.status !== 'OK') {
        // log message response
        var message =
            'There was an error processing the Cold Xfer request. ' +
            formattedResponse.message +
            ' : ' +
            formattedResponse.detail;
        utils.logMessage(LOG_LEVELS.WARN, message, response);
    }

    return formattedResponse;
};

var DirectAgentTransfer = function (targetAgentId, transferType, uii) {
    this.targetAgentId = targetAgentId;
    this.transferType = transferType;
    this.uii = uii || UIModel.getInstance().currentCall.uii;
};

DirectAgentTransfer.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.DIRECT_AGENT_TRANSFER,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(model.agentSettings.agentId),
            },
            uii: {
                '#text': utils.toString(this.uii),
            },
            target_agent_id: {
                '#text': utils.toString(this.targetAgentId),
            },
            transfer_type: {
                '#text': utils.toString(this.transferType),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes DIRECT-AGENT-TRANSFER packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ10012016082314475000219",
 *      "@response_to":"",
 *      "@type":"DIRECT-AGENT-TRANSFER",
 *      "status":{"#text":"OK"},
 *      "message":{"#text":"OK"},
 *      "type":{"#text":"WARM|COLD|CANCEL"}
 *   }
 * }
 */
DirectAgentTransfer.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);
    formattedResponse.type = utils.getText(resp, 'type');

    if (formattedResponse.status !== 'OK') {
        // log message response
        var message =
            'There was an error processing the Direct Agent Transfer request. ' +
            formattedResponse.message +
            ' : ' +
            formattedResponse.detail;
        utils.logMessage(LOG_LEVELS.WARN, message, response);
    }

    return formattedResponse;
};

var DirectAgentTransferList = function () {};

DirectAgentTransferList.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.DIRECT_AGENT_TRANSFER_LIST,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes DIRECT-AGENT-TRANSFER-LIST packets rec'd from IQ.
 *
 *  {
 *      "ui_response":{
 *          "@message_id":"IQD01DEV2018052917202600038",
 *          "@response_to":"f0b2e8a3-87fe-13ee-4d00-9d145bfe2be8",
 *          "@type":"DIRECT-AGENT-TRANSFER-LIST",
 *          "status":{
 *              "#text":"true"
 *          },
 *          "message":{
 *              "#text":"OK"
 *          },
 *          "agents": [
 *             {
 *                 "@agent_aux_state":"AVAILABLE",
 *                 "@agent_id":"1184160",
 *                 "@agent_state":"AVAILABLE",
 *                 "@available":"true",
 *                 "@first_name":"ross",
 *                 "@last_name":"m",
 *                 "@pending_disp":"false",
 *                 "@state_duration":"379",
 *                 "@username":"rm1"
 *             },
 *             {
 *                 "@agent_aux_state":"AVAILABLE",
 *                 "@agent_id":"1184161",
 *                 "@agent_state":"AVAILABLE",
 *                 "@available":"true",
 *                 "@first_name":"ross",
 *                 "@last_name":"m",
 *                 "@pending_disp":"false",
 *                 "@state_duration":"84",
 *                 "@username":"rm2"
 *             }
 *         ]
 *      }
 *  }
 */
DirectAgentTransferList.prototype.processResponse = function (response) {
    var formattedResponse = utils.buildDefaultResponse(response);
    formattedResponse.agents = utils.processResponseCollection(
        response,
        'ui_response',
        'agents'
    );

    if (formattedResponse.status !== 'OK') {
        // log message response
        var message =
            'There was an error processing the Direct Agent Transfer List request. ' +
            formattedResponse.message +
            ' : ' +
            formattedResponse.detail;
        utils.logMessage(LOG_LEVELS.WARN, message, response);
    }

    return formattedResponse;
};

var DispositionRequest = function (
    uii,
    dispId,
    notes,
    callback,
    callbackDTS,
    contactForwardNumber,
    survey,
    externId,
    leadId,
    requestId
) {
    this.uii = uii;
    this.dispId = dispId;
    this.notes = notes;
    this.callback = callback;
    this.callbackDTS = callbackDTS || '';
    this.contactForwardNumber = contactForwardNumber || null;
    this.externId = externId || null; // outbound-disposition only
    this.leadId = leadId || null; // outbound-disposition only
    this.requestId = requestId || null; // outbound-disposition only (pipe leads)

    /*
     * survey = {
     *      first_name: {
     *          leadField: "first_name"
     *          value: "Geoff"
     *      },
     *      last_name: {
     *          leadField: "last_name"
     *          value: "Mina"
     *      }
     *      ...
     * }
     */
    this.survey = survey || null;
};

/*
 * This class is responsible for creating an inbound or outbound disposition packet to
 * send to intelliqueue. It will grab uii and agent_id directly from packets saved
 * in the UIModel. Then, using the information passed in, it will
 * create the remainder of the packet. This class is called from the ExtendedCallForm
 *
 * {"ui_request":{
 *      "@message_id":"IQ20160817145840132",
 *      "@response_to":"",
 *      "@type":"OUTDIAL-DISPOSITION|INBOUND-DISPOSITION",
 *      "session_id":{"#text":"2"},  <-- ONLY WHEN AVAILABLE otherwise the node is left blank. this is the AGENT session_id
 *      "uii":{"#text":"201608171658440139000000000165"},
 *      "agent_id":{"#text":"1180958"},
 *      "lead_id":{"#text":"1800"},                 <-- OUTDIAL-DISPOSITION ONLY
 *      "outbound_externid":{"#text":"3038593775"}, <-- OUTDIAL-DISPOSITION ONLY
 *      "pending_request_id":{"#text":""},          <-- OUTDIAL-DISPOSITION ONLY
 *      "disposition_id":{"#text":"5950"},
 *      "notes":{"#text":"note here"},
 *      "call_back":{"#text":"FALSE"},
 *      "call_back_DTS":{},
 *      "contact_forwarding":{},
 *      "survey":{
 *          "response":[
 *              {"@extern_id":"text_box","@lead_update_column":"","#text":"hello"},
 *              {"@extern_id":"check_box","@lead_update_column":"","#text":"20"},
 *              {"@extern_id":"radio_save","@lead_update_column":"","#text":"23"}
 *          ]
 *      }
 *   }
 * }
 */
DispositionRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            '@type': MESSAGE_TYPES.OUTDIAL_DISPOSITION,
            agent_id: {
                '#text': utils.toString(model.agentSettings.agentId),
            },
            session_id: {
                '#text': '',
            },
            uii: {
                '#text': utils.toString(this.uii),
            },
            disposition_id: {
                '#text': utils.toString(this.dispId),
            },
            notes: {
                '#text': utils.toString(this.notes),
            },
            call_back: {
                '#text': this.callback === true ? 'TRUE' : 'FALSE',
            },
            call_back_DTS: {
                '#text': utils.toString(this.callbackDTS),
            },
            contact_forwarding: {
                '#text': utils.toString(this.contactForwardNumber),
            },
            outbound_externid: {
                '#text': utils.toString(this.externId),
            },
            lead_id: {
                '#text': utils.toString(this.leadId),
            },
            pending_request_id: {
                '#text': utils.toString(this.requestId),
            },
        },
    };

    if (
        model.currentCall.outdialDispositions &&
        model.currentCall.outdialDispositions.type === 'GATE'
    ) {
        msg.ui_request['@type'] = MESSAGE_TYPES.INBOUND_DISPOSITION;
    }

    if (model.currentCall.sessionId) {
        msg.ui_request.session_id = { '#text': model.currentCall.sessionId };
    }

    /*
     * converts survey to this response
     * survey : {
     *      response: [
     *          { "@extern_id":"", "@lead_update_column":"", "#text":"" }
     *      ]
     * }
     */
    if (this.survey !== null) {
        var response = [];
        var keys = Object.keys(this.survey);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var obj = {
                '@extern_id': key,
                '@lead_update_column': utils.toString(
                    this.survey[key].leadField
                ),
                '#text': utils.toString(this.survey[key].value),
            };
            response.push(obj);
        }
        msg.ui_request.survey = { response: response };
    }

    return JSON.stringify(msg);
};

var DispositionManualPassRequest = function (
    dispId,
    notes,
    callback,
    callbackDTS,
    leadId,
    requestId,
    externId
) {
    this.dispId = dispId;
    this.notes = notes;
    this.callback = callback;
    this.callbackDTS = callbackDTS || '';
    this.leadId = leadId || null;
    this.requestId = requestId || null;
    this.externId = externId || null;
};

/*
 * Sends an OUTDIAL-DISPOSITION request, just a separate class
 * specifically for dispositions on manual pass.
 *
 * {"ui_request":{
 *      "@message_id":"UIV220089241119416",
 *      "@response_to":"",
 *      "@type":"OUTDIAL-DISPOSITION",
 *      "manual_disp":{"#text":"TRUE"},
 *      "request_key":{"#text":"IQ10012016081719070100875"},
 *      "session_id":{},
 *      "uii":{},
 *      "agent_id":{"#text":"1810"},
 *      "lead_id":{"#text":"213215"},
 *      "outbound_externid":{"#text":"909809"},
 *      "disposition_id":{"#text":"126"},
 *      "notes":{"#text":"here are my notes :)"},
 *      "call_back":{"#text":"TRUE | FALSE"},
 *      "call_back_DTS":{"#text":"2008-09-30 22:30:00 | null"},
 *      "contact_forwarding":{"#text":"null"}
 *    }
 * }
 */
DispositionManualPassRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            '@type': MESSAGE_TYPES.OUTDIAL_DISPOSITION,
            manual_disp: {
                '#text': 'TRUE',
            },
            agent_id: {
                '#text': utils.toString(model.agentSettings.agentId),
            },
            request_key: {
                '#text': utils.toString(this.requestId),
            },
            disposition_id: {
                '#text': utils.toString(this.dispId),
            },
            notes: {
                '#text': utils.toString(this.notes),
            },
            call_back: {
                '#text': this.callback === true ? 'TRUE' : 'FALSE',
            },
            call_back_DTS: {
                '#text': utils.toString(this.callbackDTS),
            },
            lead_id: {
                '#text': utils.toString(this.leadId),
            },
            extern_id: {
                '#text': utils.toString(this.externId),
            },
            contact_forwarding: {
                '#text': 'null',
            },
            session_id: {},
            uii: {},
        },
    };

    return JSON.stringify(msg);
};

var ETRRequest = function () {};

ETRRequest.prototype.initEtrAPI = function () {
    // Since this method is called directly after the authenticate response is received
    // we can assume the accessToken is valid. We don't have all the necessary values
    // at this point to refresh the token since the agent is not fully logged in yet.
    // Just directly make the request for ETR data.
    _fetchDigitalDataFromETR(UIModel.getInstance());
};

/*
 * Makes REST calls to fetch Engage Digital data from ETR ( source, language, category ).
 * */
function _fetchDigitalDataFromETR(model) {
    var mainAccountId = model.authenticateRequest.mainAccountId;
    var promises = _buildEtrPromises(
        model,
        model.authenticateRequest.engageAccessToken,
        'digital-api-proxy/evMainAccount/' + mainAccountId
    );

    // processing etr iteratively ( source, language, category )
    for (var i = 0; i < promises.length; i++) {
        _processResponse(
            promises[i].request,
            promises[i].uiModel,
            promises[i].error,
            mainAccountId
        );
    }
}

function _buildEtrPromises(model, authToken, edProxyPath) {
    var sourceErrorMsg = 'Error retrieving ED source name from ETR.';
    var languageErrorMsg = 'Error retrieving ED language name from ETR.';
    var categoriesErrorMsg = 'Error retrieving ED categories from ETR.';

    // etr promise array
    var promises = [];
    promises.push({
        request: _buildEtrHttpRequest(edProxyPath + '/sources', authToken),
        uiModel: model.applicationSettings.edSources,
        error: sourceErrorMsg,
    });
    promises.push({
        request: _buildEtrHttpRequest(edProxyPath + '/languages', authToken),
        uiModel: model.applicationSettings.edLanguages,
        error: languageErrorMsg,
    });
    promises.push({
        request: _buildEtrHttpRequest(edProxyPath + '/categories', authToken),
        uiModel: model.applicationSettings.edCategories,
        error: categoriesErrorMsg,
    });

    return promises;
}
/*
 * Process etr promise and set the response value into the Ui Model object reference array
 * passed as parameter with the main accountId as index.
 * */
function _processResponse(promise, uiModel, errorMessage, mainAccountId) {
    if (promise) {
        promise.then(
            function (engageDigitalResponse) {
                try {
                    uiModel[mainAccountId] = JSON.parse(
                        engageDigitalResponse.response
                    ); // store returned values in memory for later use
                } catch (err) {
                    utils.logMessage(LOG_LEVELS.WARN, errorMessage, err);
                }
            },
            function (err) {
                utils.logMessage(LOG_LEVELS.WARN, errorMessage, err);
            }
        );
    }
}
function _buildEtrHttpRequest(path, authorizationToken) {
    var model = UIModel.getInstance();
    var baseUrl = model.authHost + model.baseEtrUri;
    var params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authorizationToken,
        },
    };

    return new HttpService(baseUrl).httpGet(path, params);
}

var ExtensionPresenceRequest = function () {};

ExtensionPresenceRequest.prototype.getExtensionPresenceInfo = function (
    extensionIds
) {
    UIModel.getInstance().ExtensionPresenceRequest = this;
    _getExtensionPresenceInfo('rcdirectory/getExtensionPresenceStatus', {
        extensionIds: extensionIds,
    });
};

ExtensionPresenceRequest.prototype.processResponse = function (response) {
    UIModel.getInstance().extensionPresenceResponse = response;
    return UIModel.getInstance().extensionPresenceResponse;
};

function _getExtensionPresenceInfo(path, queryParams) {
    var model = UIModel.getInstance();
    var baseUrl = model.authHost + model.baseApiUri;
    var engageAccessToken =
        'Bearer ' +
        utils.toString(
            UIModel.getInstance().authenticateRequest.engageAccessToken
        );
    var params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    params.headers['Authorization'] = engageAccessToken;
    params['queryParams'] = queryParams;
    var errorMsg =
        'Error while fetching extension presence response. URL: ' +
        baseUrl +
        path;

    new HttpService(baseUrl).httpGet(path, params).then(
        function (response) {
            try {
                response = JSON.parse(response.response);
                var extensionPresenceResponse =
                    UIModel.getInstance().extensionPresenceRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    UIModel.getInstance().libraryInstance,
                    CALLBACK_TYPES.EXTENSION_PRESENCE,
                    extensionPresenceResponse
                );
            } catch (err) {
                utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
            }
        },
        function (err) {
            var errResponse = {
                type: 'Error while fetching extension presence response.',
                message: errorMsg,
            };
            utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);

            // still fire callback on error response
            utils.fireCallback(
                UIModel.getInstance().libraryInstance,
                CALLBACK_TYPES.EXTENSION_PRESENCE,
                errResponse
            );
        }
    );
}

var HangupRequest = function (sessionId, resetPendingDisp) {
    this.sessionId = sessionId || null;
    this.resetPendingDisp = resetPendingDisp || false;
};

HangupRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.HANGUP,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            uii: {
                '#text': utils.toString(UIModel.getInstance().currentCall.uii),
            },
            session_id: {
                '#text': utils.toString(
                    this.sessionId === null
                        ? UIModel.getInstance().currentCall.sessionId
                        : this.sessionId
                ),
            },
            cancel_pending_disp: {
                '#text': this.resetPendingDisp === true ? 'TRUE' : 'FALSE',
            },
        },
    };

    return JSON.stringify(msg);
};

var HoldRequest = function (holdState, sessionId) {
    this.holdState = holdState;
    this.sessionId = sessionId || '1';
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"HOLD",
 *      "agent_id":{"#text":"1856"},
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "session_id":{"#text":"1"},
 *      "hold_state":{"#text":"ON"}
 *    }
 * }
 */
HoldRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.HOLD,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(model.currentCall.agentId),
            },
            uii: {
                '#text': utils.toString(model.currentCall.uii),
            },
            session_id: {
                '#text': utils.toString(this.sessionId),
            },
            hold_state: {
                '#text':
                    this.holdState === true || this.holdState === 'true'
                        ? 'ON'
                        : 'OFF',
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes HOLD packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082910361503344",
 *      "@response_to":"",
 *      "@type":"HOLD",
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "session_id":{"#text":"1"},
 *      "status":{"#text":"OK"},
 *      "message":{},
 *      "detail":{},
 *      "hold_state":{"#text":"ON"}
 *    }
 * }
 */
HoldRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);
    var currUII = '';
    if (UIModel.getInstance().currentCall.uii) {
        currUII = UIModel.getInstance().currentCall.uii;
    }

    formattedResponse.holdState = utils.getText(resp, 'hold_state') === 'ON';
    formattedResponse.sessionId = utils.getText(resp, 'session_id');
    formattedResponse.uii = utils.getText(resp, 'uii');

    if (formattedResponse.status === 'OK') {
        // make sure we are talking about the same call
        if (formattedResponse.uii === currUII) {
            if (formattedResponse.message === '') {
                formattedResponse.message =
                    'Broadcasting new hold state of ' +
                    formattedResponse.holdState;
            }
            utils.logMessage(
                LOG_LEVELS.DEBUG,
                'Broadcasting new hold state of ' + formattedResponse.holdState,
                response
            );
        } else {
            utils.logMessage(
                LOG_LEVELS.DEBUG,
                'Hold Response is for a different call...discarding',
                response
            );
        }
    } else {
        if (formattedResponse.message === '') {
            formattedResponse.message =
                'Error processing HOLD request. ' +
                +formattedResponse.message +
                '\n' +
                formattedResponse.detail;
        }
        utils.logMessage(
            LOG_LEVELS.WARN,
            'Error processing HOLD request. ' + formattedResponse.detail,
            response
        );
    }

    var model = UIModel.getInstance();
    if (
        formattedResponse.sessionId !== '1' &&
        model.transferSessions[formattedResponse.sessionId]
    ) {
        // we have a hold for a transfer session
        model.transferSessions[formattedResponse.sessionId].onHold =
            formattedResponse.holdState;
    }

    return formattedResponse;
};

var LeadHistoryRequest = function (leadId) {
    this.leadId = leadId;
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"LEAD-HISTORY",
 *      "agent_id":{"#text":"1"},
 *      "lead_id":{"#text":"12"},
 *    }
 * }
 */
LeadHistoryRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LEAD_HISTORY,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(model.agentSettings.agentId),
            },
            lead_id: {
                '#text': utils.toString(this.leadId),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes LEAD-HISTORY packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@lead_id":"2653",
 *      "@message_id":"IQ982008091512353000875",
 *      "@response_to":"UIV220089151235539",
 *      "@type":"LEAD-HISTORY",
 *      "previous_dial":{
 *          "@agent_name":"mandy pants (mandy)",
 *          "@duration":"",
 *          "@pass_disposition":"",
 *          "@pass_dts":"2008-09-15 12:35:27",
 *          "@pass_number":"",
 *          "@pass_uii":"200809151234140000000900021288",
 *          "agent_notes":{"#text":"This person was incredibly nice and agreed to buy donuts. "},
 *          "agent_disposition":{"#text":"Incomplete"}
 *      }
 *   }
 * }
 *
 * OR
 *
 * {"ui_response":{
 *      "@lead_id":"2653",
 *      "@message_id":"IQ982008091512353000875",
 *      "@response_to":"UIV220089151235539",
 *      "@type":"LEAD-HISTORY",
 *      "previous_dial":[
 *        {
 *          "@agent_name":"mandy pants (mandy)",
 *          "@duration":"",
 *          "@pass_disposition":"",
 *          "@pass_dts":"2008-09-15 12:35:27",
 *          "@pass_number":"",
 *          "@pass_uii":"200809151234140000000900021288",
 *          "agent_notes":{"#text":"This person was incredibly nice and agreed to buy donuts. "},
 *          "agent_disposition":{"#text":"Incomplete"}
 *        },
 *        {
 *          "@agent_name":"mandy pants (mandy)",
 *          "@duration":"",
 *          "@pass_disposition":"",
 *          "@pass_dts":"2008-09-15 12:35:27",
 *          "@pass_number":"",
 *          "@pass_uii":"200809151234140000000900021288",
 *          "agent_notes":{"#text":"This person was incredibly nice and agreed to buy donuts. "},
 *          "agent_disposition":{"#text":"Incomplete"}
 *        }
 *      ]
 *   }
 * }
 */
LeadHistoryRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var histResponse = {
        leadId: resp['@lead_id'],
    };

    var history = utils.processResponseCollection(
        response,
        'ui_response',
        'previous_dial'
    );

    // always return array, even if only one item
    if (!Array.isArray(history)) {
        history = [history];
    }
    histResponse.leadHistory = history;

    return histResponse;
};

var LeadInsertRequest = function (dataObj) {
    // handle boolean value conversion
    if (dataObj.agent_reserved && dataObj.agent_reserved === true) {
        dataObj.agent_reserved = '1';
    } else {
        dataObj.agent_reserved = '0';
    }

    if (dataObj.dialable && dataObj.dialable === true) {
        dataObj.dialable = '1';
    } else {
        dataObj.dialable = '0';
    }

    this.dataObj = dataObj;
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"LEAD-INSERT",
 *      "agent_id":{"#text":"1"},
 *      "campaign_id":{"#text":""},
 *      "lead_phone":{"#text":""},
 *      "dialable":{"#text":""},
 *      "agent_reserved":{"#text":""},
 *      "callback_dts":{"#text":""},
 *      "first_name":{"#text":""},
 *      "mid_name":{"#text":""},
 *      "last_name":{"#text":""},
 *      "suffix":{"#text":""},
 *      "title":{"#text":""},
 *      "address1":{"#text":""},
 *      "address2":{"#text":""},
 *      "city":{"#text":""},
 *      "state":{"#text":""},
 *      "zip":{"#text":""},
 *      "email":{"#text":""},
 *      "gateKeeper":{"#text":""},
 *      "aux_data1":{"#text":""},
 *      "aux_data2":{"#text":""},
 *      "aux_data3":{"#text":""},
 *      "aux_data4":{"#text":""},
 *      "aux_data5":{"#text":""},
 *    }
 * }
 */
LeadInsertRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LEAD_INSERT,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(this.dataObj.agent_id),
            },
            campaign_id: {
                '#text': utils.toString(this.dataObj.campaign_id),
            },
            lead_phone: {
                '#text': utils.toString(this.dataObj.lead_phone),
            },
            dialable: {
                '#text': utils.toString(this.dataObj.dialable),
            },
            agent_reserved: {
                '#text': utils.toString(this.dataObj.agent_reserved),
            },
            call_back_dts: {
                '#text': utils.toString(this.dataObj.callback_dts),
            },
            first_name: {
                '#text': utils.toString(this.dataObj.first_name),
            },
            mid_name: {
                '#text': utils.toString(this.dataObj.mid_name),
            },
            last_name: {
                '#text': utils.toString(this.dataObj.last_name),
            },
            suffix: {
                '#text': utils.toString(this.dataObj.suffix),
            },
            title: {
                '#text': utils.toString(this.dataObj.title),
            },
            address1: {
                '#text': utils.toString(this.dataObj.address1),
            },
            address2: {
                '#text': utils.toString(this.dataObj.address2),
            },
            city: {
                '#text': utils.toString(this.dataObj.city),
            },
            state: {
                '#text': utils.toString(this.dataObj.state),
            },
            zip: {
                '#text': utils.toString(this.dataObj.zip),
            },
            email: {
                '#text': utils.toString(this.dataObj.email),
            },
            gate_keeper: {
                '#text': utils.toString(this.dataObj.gate_keeper),
            },
            aux_data1: {
                '#text': utils.toString(this.dataObj.aux_data1),
            },
            aux_data2: {
                '#text': utils.toString(this.dataObj.aux_data2),
            },
            aux_data3: {
                '#text': utils.toString(this.dataObj.aux_data3),
            },
            aux_data4: {
                '#text': utils.toString(this.dataObj.aux_data4),
            },
            aux_data5: {
                '#text': utils.toString(this.dataObj.aux_data5),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes LEAD-INSERT packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008091512353000875",
 *      "@response_to":"UIV220089151235539",
 *      "@type":"LEAD-INSERT",
 *      "status":{"#text":"TRUE|FALSE"},
 *      "msg":{"#text":""},
 *      "detail":{"#text":""},
 *   }
 * }
 */
LeadInsertRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.message = resp.msg['#text'];

    return formattedResponse;
};

var LeadUpdateRequest = function (leadId, leadPhone, baggage) {
    this.leadId = leadId;
    this.leadPhone = leadPhone;
    this.baggage = baggage;
    this.agentId = utils.toString(UIModel.getInstance().agentSettings.agentId);
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"LEAD-UPDATE",
 *      "agent_id":{"#text":"1"},
 *      "lead_id":{"#text":"12"},
 *      "lead_phone":{"#text":"12"},
 *       "baggage":{
 *          "lead_id":{"#text":"64306"},
 *          "extern_id":{"#text":"9548298548"},
 *          "first_name":{"#text":"Ryant"},
 *          "mid_name":{},
 *          "last_name":{"#text":"Taylor"},
 *          "state":{"#text":"OH"},
 *          "aux_data1":{"#text":"BMAK"},
 *          "aux_data2":{"#text":"BMAK-041653-934"},
 *          "aux_data3":{"#text":"Call Ctr 1"},
 *          "aux_data4":{},
 *          "aux_data5":{},
 *          "address1":{"#text":"8010 Maryland Ave"},
 *          "address2":{},
 *          "city":{"#text":"Cleveland"},
 *          "zip":{"#text":"44105"},
 *          "aux_external_url":{},
 *          "aux_greeting":{},
 *          "aux_phone":{}
 *      },
 *    }
 * }
 */
LeadUpdateRequest.prototype.formatJSON = function () {
    // make sure required baggage fields are present
    this.baggage = _formatBaggage(this.baggage);
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LEAD_UPDATE,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': this.agentId,
            },
            lead_id: {
                '#text': utils.toString(this.leadId),
            },
            lead_phone: {
                '#text': utils.toString(this.leadPhone),
            },
            baggage: this.baggage,
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes LEAD-UPDATE packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008091512353000875",
 *      "@response_to":"UIV220089151235539",
 *      "@type":"LEAD-UPDATE",
 *      "status":{"#text":"TRUE|FALSE"},
 *      "msg":{"#text":"64306"},
 *      "detail":{"#text":"64306"},
 *   }
 * }
 */
LeadUpdateRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.message = resp.msg['#text'];

    return formattedResponse;
};

_formatBaggage = function (baggage) {
    var bag = {};
    bag.first_name = { '#text': baggage.first_name || '' };
    bag.mid_name = { '#text': baggage.mid_name || '' };
    bag.last_name = { '#text': baggage.last_name || '' };
    bag.suffix = { '#text': baggage.suffix || '' };
    bag.title = { '#text': baggage.title || '' };
    bag.address1 = { '#text': baggage.address1 || '' };
    bag.address2 = { '#text': baggage.address2 || '' };
    bag.city = { '#text': baggage.city || '' };
    bag.state = { '#text': baggage.state || '' };
    bag.zip = { '#text': baggage.zip || '' };
    bag.email = { '#text': baggage.email || '' };
    bag.gate_keeper = { '#text': baggage.gate_keeper || '' };
    bag.extern_id = { '#text': baggage.extern_id || '' };
    bag.aux_data1 = { '#text': baggage.aux_data1 || '' };
    bag.aux_data2 = { '#text': baggage.aux_data2 || '' };
    bag.aux_data3 = { '#text': baggage.aux_data3 || '' };
    bag.aux_data4 = { '#text': baggage.aux_data4 || '' };
    bag.aux_data5 = { '#text': baggage.aux_data5 || '' };

    return bag;
};

var LoginRequest = function (
    dialDest,
    queueIds,
    chatIds,
    skillProfileId,
    dialGroupId,
    updateFromAdminUI,
    isForce
) {
    this.queueIds = queueIds || [];
    this.chatIds = chatIds || [];
    this.skillProfileId = skillProfileId || '';
    this.dialGroupId = dialGroupId || '';
    this.dialDest = dialDest || '';
    this.updateFromAdminUI = updateFromAdminUI || false;
    this.loginType = 'NO-SELECTION';
    this.updateLogin = false;
    this.isForce = isForce;

    // Remove any ids agent doesn't have access to
    var model = UIModel.getInstance();
    this.queueIds = utils.checkExistingIds(
        model.inboundSettings.availableQueues,
        this.queueIds,
        'gateId'
    );
    this.chatIds = utils.checkExistingIds(
        model.chatSettings.availableChatQueues,
        this.chatIds,
        'chatQueueId'
    );
    this.skillProfileId =
        utils.checkExistingIds(
            model.inboundSettings.availableSkillProfiles,
            [this.skillProfileId],
            'profileId'
        )[0] || '';
    this.dialGroupId =
        utils.checkExistingIds(
            model.outboundSettings.availableOutdialGroups,
            [this.dialGroupId],
            'dialGroupId'
        )[0] || '';

    // Set loginType value
    if (this.queueIds.length > 0 && this.dialGroupId !== '') {
        this.loginType = 'BLENDED';
    } else if (this.queueIds.length > 0) {
        this.loginType = 'INBOUND';
    } else if (this.dialGroupId !== '') {
        this.loginType = 'OUTBOUND';
    } else if (this.chatIds.length > 0) {
        this.loginType = 'CHAT';
    } else {
        this.loginType = 'NO-SELECTION';
    }

    // set updateLogin value
    if (model.agentSettings.isLoggedIn) {
        this.updateLogin = true;
        this.dialDest = UIModel.getInstance().agentSettings.dialDest;
    }

    // validate dialDest is sip or 10-digit num
    if (!utils.validateDest(this.dialDest)) {
        utils.logMessage(
            LOG_LEVELS.WARN,
            'dialDest [' +
                this.dialDest +
                '] must be a valid sip or 10-digit DID',
            ''
        );
    }
};

LoginRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LOGIN,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            access_token: {
                '#text': UIModel.getInstance().authenticateRequest.accessToken,
            },
            hash_code: {
                '#text': UIModel.getInstance().connectionSettings.hashCode,
            },
            allow_multisocket: {
                '#text': utils.toString(
                    UIModel.getInstance().applicationSettings.allowMultiSocket
                ),
            },
            dial_dest: {
                '#text': utils.toString(this.dialDest),
            },
            login_type: {
                '#text': this.loginType,
            },
            update_login: {
                '#text': utils.toString(this.updateLogin),
            },
            outdial_group_id: {
                '#text': utils.toString(this.dialGroupId),
            },
            skill_profile_id: {
                '#text': utils.toString(this.skillProfileId),
            },
            update_from_adminui: {
                '#text': utils.toString(this.updateFromAdminUI),
            },
            agent_platform_id: {
                '#text': utils.toString(2), // Hard-coded platformId for agent-js repo
            },
            is_force: {
                '#text': utils.toString(this.isForce),
            },
        },
    };

    // add arrays
    var queueIds = [];
    for (var i = 0; i < this.queueIds.length; i++) {
        if (this.queueIds[i] !== '') {
            queueIds.push({ '#text': utils.toString(this.queueIds[i]) });
        }
    }
    if (queueIds.length > 0) {
        msg.ui_request.gates = { gate_id: queueIds };
    } else {
        msg.ui_request.gates = {};
    }

    var chatIds = [];
    for (var t = 0; t < this.chatIds.length; t++) {
        if (this.chatIds[t] !== '') {
            chatIds.push({ '#text': utils.toString(this.chatIds[t]) });
        }
    }
    if (chatIds.length > 0) {
        msg.ui_request.chat_queues = { chat_queue_id: chatIds };
    } else {
        msg.ui_request.chat_queues = {};
    }

    return JSON.stringify(msg);
};

/*
 * This function is responsible for handling the response to Login from IntelliQueue.
 *
 * {"ui_response":{
 *      "@message_id":"IQ10012016082513212000447",
 *      "@response_to":"IQ201608251121200",
 *      "@type":"LOGIN",
 *      "agent_id":{"#text":"1"},
 *      "status":{"#text":"SUCCESS"},
 *      "message":{"#text":"Hello Geoffrey Mina!"},
 *      "detail":{"#text":"Logon request processed successfully!"},
 *      "hash_code":{"#text":"404946966"},
 *      "login_type":{"#text":"BLENDED"},
 *      "outdial_group_id":{"#text":"50692"},
 *      "skill_profile_id":{"#text":"1513"},
 *      "gates":{
 *          "gate_id":[
 *              {"#text":"11116"},
 *              {"#text":"11117"}
 *          ]
 *      },
 *      "chat_queues":{
 *          "chat_queue_id":{"#text":"30"}
 *      }
 *    }
 * }
 */
LoginRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var status = utils.getText(resp, 'status');
    var detail = utils.getText(resp, 'detail');
    var model = UIModel.getInstance();
    var message = '';
    var formattedResponse = utils.buildDefaultResponse(response);
    var Lib = UIModel.getInstance().libraryInstance;
    var isReconnect = false;

    if (detail === 'Logon Session Configuration Updated!') {
        // this is an update login packet
        model.agentSettings.updateLoginMode = true;

        message = 'Logon Session Configuration Updated!';
        utils.logMessage(LOG_LEVELS.INFO, message, response);
    }

    if (status === 'SUCCESS') {
        if (!model.agentSettings.isLoggedIn) {
            // fresh login, set UI Model properties
            model.loginPacket = response;
            model.agentSettings.isLoggedIn = true;
            model.agentSettings.loginDTS = new Date();
            model.connectionSettings.reconnect = true;
            model.agentPermissions.allowLeadSearch = false;
            model.agentSettings.dialDest = utils.getText(resp, 'dial_dest');
            model.agentSettings.loginType = utils.getText(resp, 'login_type');
            model.agentSettings.accountId = utils.getText(resp, 'account_id');
            model.agentSettings.corporateDirectory = utils.getText(
                resp,
                'corporate_dir'
            );
            model.agentSettings.consultCall = utils.getText(
                resp,
                'is_consultcall'
            );

            model.connectionSettings.isMultiSocket =
                utils.getText(resp, 'is_multisocket') === 'true';

            // If we allow multisocket, lets setup a listener for other tabs to request data
            if (
                model.applicationSettings.allowMultiSocket === true ||
                model.connectionSettings.isMultiSocket === true
            ) {
                broadcastChannelHelper.init();
            }

            // Set collection values
            setDialGroupSettings(response);
            setGateSettings(response);
            setChatQueueSettings(response);
            setSkillProfileSettings(response);
        } else {
            if (model.agentSettings.updateLoginMode) {
                model.agentSettings.dialDest = utils.getText(resp, 'dial_dest');
                model.agentSettings.loginType = utils.getText(
                    resp,
                    'login_type'
                );
                model.agentSettings.accountId = utils.getText(
                    resp,
                    'account_id'
                );

                // This was an update login request
                model.agentSettings.updateLoginMode = false;

                // reset to false before updating dial group settings
                model.agentPermissions.allowLeadSearch = false;
                model.agentPermissions.requireFetchedLeadsCalled = false;
                model.agentPermissions.allowPreviewLeadFilters = false;

                // Set collection values
                setDialGroupSettings(response);
                setGateSettings(response);
                setChatQueueSettings(response);
                setSkillProfileSettings(response);
            } else {
                // this was a reconnect
                isReconnect = true;
                message = 'Processed a Layer 2 Reconnect Successfully';

                model.agentSettings.onCall = utils.getText(resp, 'is_on_call');
                model.connectionSettings.activeCallUii = utils.getText(
                    resp,
                    'active_call_uii'
                );
                model.connectionSettings.isPendingDisp = utils.getText(
                    resp,
                    'is_pending_disp'
                );

                if (model.agentSettings.onCall === false) {
                    if (model.currentCall.uii) {
                        var mockEndCallPacket = {
                            ui_notification: {
                                '@message_id': '',
                                '@type': 'END-CALL',
                                uii: { '#text': model.currentCall.uii },
                                term_reason: { '#text': 'SOCKET-DISCONNECT' },
                            },
                        };

                        utils.processNotification(Lib, mockEndCallPacket);
                    }

                    if (model.agentSettings.isOffhook) {
                        var offHookTermPacket = {
                            ui_notification: {
                                agent_id: {
                                    '#text':
                                        UIModel.getInstance().agentSettings
                                            .agentId,
                                },
                                '@type': 'OFF-HOOK-TERM',
                                '@message_id': '',
                            },
                        };

                        var agentProcessOffhookCallback =
                            utils.processNotification(Lib, offHookTermPacket);
                        Lib.offhookTerm(agentProcessOffhookCallback);
                    }
                } else if (
                    model.agentSettings.onCall &&
                    (model.currentCall.uii !==
                        model.connectionSettings.activeCallUii ||
                        Lib.waitingForAddSession === true)
                ) {
                    //if the agent does not know it is on a call, but IQ thinks it is on a call
                    //normally in the case of disconnect during transition

                    model.currentCall.uii =
                        model.connectionSettings.activeCallUii;
                    model.currentCall.pendingDisp = false;
                    Lib.hangup(1, true);
                } else {
                    //agent still is on call and there are transferSessions, verify no transferSession were drop
                    var activeAgentUiSessions = Lib.getTransferSessions();
                    var activeAgentSessions =
                        response.ui_response.active_call_sessions.call_session_id.map(
                            function (sessionObj) {
                                return sessionObj['#text'];
                            }
                        );

                    for (var transferSession in activeAgentUiSessions) {
                        if (
                            activeAgentSessions.indexOf(transferSession) === -1
                        ) {
                            //if the active ui session is no longer active, we need to tell the ui
                            delete UIModel.getInstance().transferSessions[
                                transferSession
                            ];
                        }
                    }
                }

                utils.logMessage(LOG_LEVELS.INFO, message, response);
            }
        }

        // always update guid and agent login hashcode if found
        model.connectionSettings.hashCode =
            utils.getText(resp, 'hash_code') ||
            model.connectionSettings.hashCode;
        model.agentSettings.guid =
            utils.getText(resp, 'guid') || model.agentSettings.guid;
        model.dataStore.save('agent_id', utils.getText(resp, 'agent_id'));
        model.dataStore.save('hash_code', utils.getText(resp, 'hash_code'));

        formattedResponse.agentSettings = model.agentSettings;
        formattedResponse.agentPermissions = model.agentPermissions;
        formattedResponse.applicationSettings = model.applicationSettings;
        formattedResponse.chatSettings = model.chatSettings;
        formattedResponse.connectionSettings = model.connectionSettings;
        formattedResponse.inboundSettings = model.inboundSettings;
        formattedResponse.outboundSettings = model.outboundSettings;
        formattedResponse.scriptSettings = model.scriptSettings;
        formattedResponse.isReconnect = isReconnect;
    } else {
        // Login failed
        if (formattedResponse.message === '') {
            formattedResponse.message =
                'Agent configuration attempt failed (2nd layer login)';
        }
        utils.logMessage(LOG_LEVELS.WARN, formattedResponse.message, response);
    }

    return formattedResponse;
};

function setDialGroupSettings(response) {
    var model = UIModel.getInstance();
    var outdialGroups = model.outboundSettings.availableOutdialGroups;
    model.outboundSettings.outdialGroup = {}; // reset
    for (var g = 0; g < outdialGroups.length; g++) {
        var group = outdialGroups[g];
        if (
            group.dialGroupId === response.ui_response.outdial_group_id['#text']
        ) {
            model.agentPermissions.allowLeadSearch = group.allowLeadSearch;
            model.agentPermissions.allowPreviewLeadFilters =
                group.allowPreviewLeadFilters;
            model.agentPermissions.progressiveEnabled =
                group.progressiveEnabled;
            model.outboundSettings.outdialGroup = JSON.parse(
                JSON.stringify(group)
            ); // copy object

            // Only used for Preview or TCPA Safe accounts.
            // If set to true, only allow fetching new leads when current leads are called or expired
            model.agentPermissions.requireFetchedLeadsCalled =
                group.requireFetchedLeadsCalled;
        }
    }
}

function setSkillProfileSettings(response) {
    var model = UIModel.getInstance();
    model.inboundSettings.skillProfile = {};
    var skillProfiles = model.inboundSettings.availableSkillProfiles;
    for (var s = 0; s < skillProfiles.length; s++) {
        var profile = skillProfiles[s];
        var responseId = utils.getText(
            response.ui_response,
            'skill_profile_id'
        );
        if (profile.profileId === responseId) {
            model.inboundSettings.skillProfile = JSON.parse(
                JSON.stringify(profile)
            ); // copy object
        }
    }
}

function setGateSettings(response) {
    var model = UIModel.getInstance();
    var gates = model.inboundSettings.availableQueues;
    var selectedGateIds = [];
    var selectedGates = [];
    var gateIds = response.ui_response.gates.gate_id || [];

    if (!Array.isArray(gateIds)) {
        gateIds = [gateIds];
    }

    for (var s = 0; s < gateIds.length; s++) {
        var obj = gateIds[s];
        selectedGateIds.push(obj['#text']);
    }

    for (var gIdx = 0; gIdx < gates.length; gIdx++) {
        var gate = gates[gIdx];
        if (selectedGateIds.indexOf(gate.gateId) > -1) {
            selectedGates.push(gate);
        }
    }

    model.inboundSettings.queues = JSON.parse(JSON.stringify(selectedGates)); // copy array
}

function setChatQueueSettings(response) {
    var model = UIModel.getInstance();
    var chatQueues = model.chatSettings.availableChatQueues;
    var selectedChatQueueIds = [];
    var selectedChatQueues = [];
    var cQueues = response.ui_response.chat_queues || {};
    var chatQueueIds = cQueues.chat_queue_id || [];

    if (!Array.isArray(chatQueueIds)) {
        chatQueueIds = [chatQueueIds];
    }

    for (var c = 0; c < chatQueueIds.length; c++) {
        var obj = chatQueueIds[c];
        selectedChatQueueIds.push(obj['#text']);
    }

    for (var cIdx = 0; cIdx < chatQueues.length; cIdx++) {
        var chatQueue = chatQueues[cIdx];
        if (selectedChatQueueIds.indexOf(chatQueue.chatQueueId) > -1) {
            selectedChatQueues.push(chatQueue);
        }
    }

    model.chatSettings.chatQueues = JSON.parse(
        JSON.stringify(selectedChatQueues)
    ); // copy array
}

var LoginPhase1Request = function () {};

LoginPhase1Request.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LOGIN_PHASE_1,
            '@message_id': utils.getMessageId(),
            response_to: '',
            reconnect: {
                '#text': utils.toString(
                    UIModel.getInstance().connectionSettings.reconnect
                ),
            },
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            access_token: {
                '#text': utils.toString(
                    UIModel.getInstance().authenticateRequest.accessToken
                ),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This function is responsible for handling the login packet received from IntelliServices. It will save
 * a copy of it in the UIModel as loginPacket, as well as set the isLoggedInIS variable to
 * true (for reconnect purposes) and the loginDTS with the current date/time.
 *
 * {"ui_response":{
 *      "@type":"login",
 *      "status":{"#text":"OK"},
 *      "is_sso:{"#text":"TRUE"|"FALSE"},
 *      "agent_id":{"#text":"1810"},
 *      "agent_pwd":{"#text":"bound25"},
 *      "first_name":{"#text":"mandy"},
 *      "last_name":{"#text":"pants"},
 *      "email":{"#text":"mandypants@aol.coim"},
 *      "agent_type":{"#text":"AGENT"},
 *      "external_agent_id":{"#text":"blahblah"},
 *      "default_login_dest":{"#text":"9548298548|123"},
 *      "alt_default_login_dest":{"#text":"9548298548|123"},
 *      "iq_url":{"#text":"dev.connectfirst.com"},
 *      "iq_port":{"#text":"1313"},
 *      "iq_ssl_port":{"#text":"1213"},
 *      "iq_secret_key":{"#text":"F-OFF"},
 *      "enable_call_contact_history":{"#text":"TRUE"|"FALSE"},
 *      "allow_inbound":{"#text":"1"},
 *      "allow_outbound":{"#text":"1"},
 *      "allow_chat":{"#text":"1"},
 *      "allow_blended":{"#text":"0"},
 *      "allow_off_hook":{"#text":"1"},
 *      "allow_call_control":{"#text":"1"},
 *      "allow_login_control":{"#text":"1"},
 *      "allow_login_updates":{"#text":"1"},
 *      "allow_lead_inserts":{"#text":"1"},
 *      "show_lead_history":{"#text":"1"},
 *      "allow_cross_gate_requeue":{"#text":"1"},
 *      "phone_login_dial_group":{"#text":"44"},
 *      "phone_login_pin":{"#text":"1234"},
 *      "allow_manual_calls":{"#text":"1"},
 *      "allow_manual_intl_calls":{"#text":"0"},
 *      "init_login_state":{"#text":"ON-BREAK"},
 *      "init_login_state_label":{"#text":"Morning Break"},
 *      "outbound_prepay":{"#text":"0"},
 *      "max_break_time":{"#text":"-1"},
 *      "max_lunch_time":{"#text":"-1"},
 *      "allow_lead_search":{"#text":"YES_ALL"},
 *      "tcpa_safe_mode":{"#text":"1|0"},
 *      "pci_enabled":{"#text":"1|0"},
 *      "agent_states":{
 *          agent_state": [
 *              {@agent_aux_state: "Available", @agent_state: "AVAILABLE", @rank: "1"}
 *              {@agent_aux_state: "Away", @agent_state: "AWAY", @rank: "2"}
 *              {@agent_aux_state: "Lunch", @agent_state: "LUNCH", @rank: "3"}
 *          ]
 *       },
 *      "agent_states_all":{
 *          agent_state": [
 *              {@agent_aux_state: "Available", @agent_state: "AVAILABLE", @rank: "1"}
 *              {@agent_aux_state: "Away", @agent_state: "AWAY", @rank: "2"}
 *              {@agent_aux_state: "Lunch", @agent_state: "LUNCH", @rank: "3"}
 *          ]
 *       },
 *      "login_gates":{
 *          "gate":[
 *              {"@default_dest_override":"","@gate_desc":"","@gate_id":"37","@gate_name":"test"},
 *              {"@default_dest_override":"","@gate_desc":"","@gate_id":"42","@gate_name":"test gate two"},
 *              {"@default_dest_override":"","@gate_desc":"","@gate_id":"43","@gate_name":"test gate three"},
 *              {"@default_dest_override":"","@gate_desc":"Amandas Other Gate","@gate_id":"46","@gate_name":"You know it!"}
 *          ]
 *      },
 *      "login_chat_queues":{
 *          "chat_queue":[
 *              {"@chat_queue_description":"","@chat_queue_id":"","@chat_queue_name":""},
 *              {"@chat_queue_description":"","@chat_queue_id":"","@chat_queue_name":""}
 *          ]
 *      },
 *      "outdial_groups":{
 *          "group":[
 *              {"@billing_key":"","@dial_group_desc":"","@dial_group_id":"44","@dial_group_name":"Geoff Dial Test","@dial_mode":"PREDICTIVE"},
 *              {"@billing_key":"2","@dial_group_desc":"AutoDial Configured Dial Group","@dial_group_id":"46","@dial_group_name":"Phone Only test5","@dial_mode":"PREDICTIVE"},
 *              {"@billing_key":"","@dial_group_desc":"Test","@dial_group_id":"200000","@dial_group_name":"Test","@dial_mode":"PREDICTIVE"},
 *              {"@billing_key":"","@dial_group_desc":"Test","@dial_group_id":"200010","@dial_group_name":"Carissa's Test Group","@dial_mode":"PREDICTIVE"}
 *          ]
 *      },"skill_profiles":{
 *          "profile":[
 *              {"@profile_desc":"","@profile_id":"571","@profile_name":"skill1"},
 *              {"@profile_desc":"","@profile_id":"572","@profile_name":"skill2"}
 *          ]
 *      },
 *      "requeue_gates":{
 *          "gate_group":[
 *              {
 *                  "@gate_group_id":"18",
 *                  "@group_name":"new gate group",
 *                  "gates":{
 *                      "gate":[
 *                          {"@gate_desc":"","@gate_id":"37","@gate_name":"test"},
 *                          {"@gate_desc":"","@gate_id":"43","@gate_name":"test gate three"},
 *                          {"@gate_desc":"","@gate_id":"42","@gate_name":"test gate two"}
 *                      ]
 *                  },
 *                  "skills":{
 *                      "skill":[
 *                          {"@skill_desc":"","@skill_id":"58","@skill_name":"one"},
 *                          {"@skill_desc":"","@skill_id":"59","@skill_name":"two"},
 *                      ]
 *                  }
 *              }
 *          ]
 *      },
 *      "chat_rooms":{},
 *      "scripts": {
 *           "script": {
 *               "@script_id": "15",
 *               "@script_name": "Don't Read This Script"
 *           }
 *      },
 *      "campaigns": {
 *          "campaign": {
 *              "@allow_lead_updates": "",
 *              "@campaign_id": "",
 *              "@campaign_name": "",
 *              "@survey_id": "",
 *              "@survey_name": "",
 *              "custom_labels": {
 *                  "@aux_1_label": "",
 *                  "@aux_2_label": "",
 *                  "@aux_3_label": "",
 *                  "@aux_4_label": "",
 *                  "@aux_5_label": ""
 *              },
 *              "generic_key_value_pairs": {}
 *          }
 *      },
 *      "account_countries":{
 *          "country":[
 *              {"@country_id":"BRA"},{"@country_id":"FRA"},{"@country_id":"GER"}
 *          ]
 *      }
 *   }
 * }
 */
LoginPhase1Request.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var status = utils.getText(resp, 'status');
    var model = UIModel.getInstance();
    var formattedResponse = utils.buildDefaultResponse(response);

    if (status === 'OK') {
        if (!model.applicationSettings.isLoggedInIS) {
            // save login packet properties to UIModel
            model.loginPhase1Packet = response;
            model.applicationSettings.isEmbeddedLogin =
                utils.parseJwt(model.authenticateRequest.engageAccessToken)
                    .embd || false;
            model.applicationSettings.isLoggedInIS = true;
            model.applicationSettings.isSso = utils.getText(resp, 'is_sso');
            model.applicationSettings.isFlr = utils.getText(resp, 'is_flr');
            model.applicationSettings.isTcpaSafeMode =
                utils.getText(resp, 'tcpa_safe_mode') === '1';
            model.applicationSettings.pciEnabled =
                utils.getText(resp, 'pci_enabled') === '1';
            model.applicationSettings.enableCallContactHistory = utils.getText(
                resp,
                'enable_call_contact_history'
            );
            model.agentSettings.enableCallQuality = utils.getText(
                resp,
                'enable_call_quality'
            );

            model.chatSettings.alias =
                utils.getText(resp, 'first_name') +
                ' ' +
                utils.getText(resp, 'last_name');

            model.agentSettings.loginDTS = new Date();
            model.agentSettings.maxBreakTime = utils.getText(
                resp,
                'max_break_time'
            );
            model.agentSettings.maxLunchTime = utils.getText(
                resp,
                'max_lunch_time'
            );
            model.agentSettings.firstName = utils.getTextString(
                resp,
                'first_name'
            );
            model.agentSettings.lastName = utils.getTextString(
                resp,
                'last_name'
            );
            model.agentSettings.email = utils.getText(resp, 'email');
            model.agentSettings.agentId = utils.getText(resp, 'agent_id');
            model.agentSettings.externalAgentId = utils.getText(
                resp,
                'external_agent_id'
            );
            model.agentSettings.agentType = utils.getText(resp, 'agent_type');
            model.agentSettings.realAgentType = utils.getText(
                resp,
                'real_agent_type'
            );
            model.agentSettings.defaultLoginDest = utils.getText(
                resp,
                'default_login_dest'
            );
            model.agentSettings.altDefaultLoginDest = utils.getText(
                resp,
                'alt_default_login_dest'
            );
            model.agentSettings.initLoginState = utils.getText(
                resp,
                'init_login_state'
            );
            model.agentSettings.initLoginStateLabel = utils.getText(
                resp,
                'init_login_state_label'
            );
            model.agentSettings.outboundManualDefaultRingtime = utils.getText(
                resp,
                'outbound_manual_default_ringtime'
            );
            model.agentSettings.isOutboundPrepay =
                utils.getText(resp, 'outbound_prepay') === '1';
            model.agentSettings.phoneLoginPin = utils.getText(
                resp,
                'phone_login_pin'
            );
            model.agentSettings.username = utils.getTextString(
                resp,
                'username'
            );
            model.agentSettings.agentPassword = utils.getText(
                resp,
                'agent_pwd'
            );

            model.agentPermissions.allowCallControl =
                utils.getText(resp, 'allow_call_control') === '1';
            model.agentPermissions.allowChat =
                utils.getText(resp, 'allow_chat') === '1'; //Agent permission
            model.agentPermissions.enableChat =
                utils.getText(resp, 'enable_chat') === '1'; //Account permission
            model.agentPermissions.showLeadHistory =
                utils.getText(resp, 'show_lead_history') === '1';
            model.agentPermissions.allowManualOutboundGates =
                utils.getText(resp, 'allow_manual_outbound_gates') === '1';
            model.agentPermissions.allowOffHook =
                utils.getText(resp, 'allow_off_hook') === '1';
            model.agentPermissions.allowManualCalls =
                utils.getText(resp, 'allow_manual_calls') === '1';
            model.agentPermissions.allowManualPass =
                utils.getText(resp, 'allow_manual_pass') === '1';
            model.agentPermissions.allowManualIntlCalls =
                utils.getText(resp, 'allow_manual_intl_calls') === '1';
            model.agentPermissions.allowLoginUpdates =
                utils.getText(resp, 'allow_login_updates') === '1';
            model.agentPermissions.allowInbound =
                utils.getText(resp, 'allow_inbound') === '1';
            model.agentPermissions.allowOutbound =
                utils.getText(resp, 'allow_outbound') === '1';
            model.agentPermissions.allowBlended =
                utils.getText(resp, 'allow_blended') === '1';
            model.agentPermissions.allowLoginControl =
                utils.getText(resp, 'allow_login_control') === '1';
            model.agentPermissions.allowCrossQueueRequeue =
                utils.getText(resp, 'allow_cross_gate_requeue') === '1';
            model.agentPermissions.disableSupervisorMonitoring =
                utils.getText(resp, 'disable_supervisor_monitoring') === '1';
            model.agentPermissions.allowAutoAnswer =
                utils.getText(resp, 'allow_auto_answer') === '1';
            model.agentPermissions.defaultAutoAnswerOn =
                utils.getText(resp, 'default_auto_answer_on') === '1';
            model.agentPermissions.allowHistoricalDialing =
                utils.getText(resp, 'allow_historical_dialing') === '1';
            model.agentPermissions.allowAgentStats =
                utils.getText(resp, 'allow_agent_stats') === '1';
            model.agentPermissions.allowCampaignStats =
                utils.getText(resp, 'allow_camp_stats') === '1';
            model.agentPermissions.allowGateStats =
                utils.getText(resp, 'allow_gate_stats') === '1';
            model.agentPermissions.allowChatStats =
                utils.getText(resp, 'allow_chat_stats') === '1';
            model.agentPermissions.enableFolderMode =
                utils.getText(resp, 'enable_folder_mode') === '1';
            model.agentPermissions.enableTaskMode =
                utils.getText(resp, 'enable_task_mode') === '1';

            model.outboundSettings.defaultDialGroup = utils.getText(
                resp,
                'phone_login_dial_group'
            );

            if (
                response.ui_response.allow_lead_inserts &&
                typeof resp.insert_campaigns !== 'undefined' &&
                response.ui_response.insert_campaigns.campaign
            ) {
                model.agentPermissions.allowLeadInserts =
                    utils.getText(resp, 'allow_lead_inserts') === '1';
            }

            // Set collection values
            model.outboundSettings.availableCampaigns =
                _processCampaigns(response);
            model.chatSettings.availableChatQueues =
                utils.processResponseCollection(
                    response.ui_response,
                    'login_chat_queues',
                    'chat_queue'
                );
            _processChatQueueDnis(model.chatSettings, response);
            model.chatSettings.availableChatRequeueQueues =
                utils.processResponseCollection(
                    response.ui_response,
                    'chat_requeue_queues',
                    'chat_group'
                );
            model.inboundSettings.availableQueues =
                utils.processResponseCollection(
                    response.ui_response,
                    'login_gates',
                    'gate'
                );
            model.inboundSettings.availableSkillProfiles =
                utils.processResponseCollection(
                    response.ui_response,
                    'skill_profiles',
                    'profile'
                );
            model.inboundSettings.availableRequeueQueues =
                utils.processResponseCollection(
                    response.ui_response,
                    'requeue_gates',
                    'gate_group'
                );
            model.chatSettings.availableChatRooms =
                utils.processResponseCollection(
                    response.ui_response,
                    'chat_rooms',
                    'room'
                );
            model.scriptSettings.availableScripts =
                utils.processResponseCollection(
                    response.ui_response,
                    'scripts',
                    'script'
                );
            model.agentSettings.callerIds = utils.processResponseCollection(
                response.ui_response,
                'caller_ids',
                'caller_id'
            );
            model.agentSettings.availableAgentStates =
                utils.processResponseCollection(
                    response.ui_response,
                    'agent_states',
                    'agent_state'
                );
            model.agentSettings.allAgentStates =
                utils.processResponseCollection(
                    response.ui_response,
                    'agent_states_all',
                    'agent_state'
                );
            model.applicationSettings.availableCountries =
                utils.processResponseCollection(
                    response.ui_response,
                    'account_countries',
                    'country'
                );
            model.agentSettings.reportCallQualityIssueTypes =
                utils.processResponseCollection(
                    response.ui_response,
                    'call_quality_issues',
                    'call_issues'
                );
            model.outboundSettings.insertCampaigns =
                utils.processResponseCollection(
                    response.ui_response,
                    'insert_campaigns',
                    'campaign'
                );

            var dialGroups = utils.processResponseCollection(
                response.ui_response,
                'outdial_groups',
                'group'
            );
            // set boolean values
            for (var dg = 0; dg < dialGroups.length; dg++) {
                var group = dialGroups[dg];
                group.allowLeadSearch = group.allowLeadSearch === 'YES';
                group.allowPreviewLeadFilters =
                    group.allowPreviewLeadFilters === '1';
                group.progressiveEnabled = group.progressiveEnabled === '1';
                group.requireFetchedLeadsCalled =
                    group.requireFetchedLeadsCalled === '1';
                group.hciType = parseInt(group.hciEnabled) || 0;
                group.hciEnabled =
                    group.hciEnabled === '1' || group.hciEnabled === '2';
                group.hciClicker = group.hciClicker === '1';
            }
            model.outboundSettings.availableOutdialGroups = dialGroups;
        }
    }

    formattedResponse.agentSettings = model.agentSettings;
    formattedResponse.agentPermissions = model.agentPermissions;
    formattedResponse.applicationSettings = model.applicationSettings;
    formattedResponse.chatSettings = model.chatSettings;
    formattedResponse.connectionSettings = model.connectionSettings;
    formattedResponse.inboundSettings = model.inboundSettings;
    formattedResponse.outboundSettings = model.outboundSettings;
    formattedResponse.scriptSettings = model.scriptSettings;

    return formattedResponse;
};

function _processCampaigns(response) {
    var campaigns = [];
    var campaignsRaw = null;

    if (typeof response.ui_response.campaigns.campaign !== 'undefined') {
        campaignsRaw = response.ui_response.campaigns.campaign;
    }

    if (campaignsRaw) {
        if (!Array.isArray(campaignsRaw)) {
            campaignsRaw = [campaignsRaw];
        }

        for (var c = 0; c < campaignsRaw.length; c++) {
            campaigns.push(_processCampaign(campaignsRaw[c]));
        }
    }

    return campaigns;
}

function _processCampaign(campaignRaw) {
    // single campaign object
    var campaignId = campaignRaw['@campaign_id'];
    var allowLeadUpdates = campaignRaw['@allow_lead_updates']; // 0 = no update, 1 = allow phone update, 2 = don't allow phone update
    UIModel.getInstance().agentPermissions.allowLeadUpdatesByCampaign[
        campaignId
    ] = allowLeadUpdates;

    var customLabels = campaignRaw['custom_labels'];
    var labelArray = [];

    for (var p in customLabels) {
        var label = p.replace(/@/, ''); // remove leading '@'
        var obj = {};
        obj[label] = customLabels[p];

        labelArray.push(obj);
    }

    return {
        campaignId: campaignId,
        campaignName: campaignRaw['@campaign_name'],
        surveyId: campaignRaw['@survey_id'],
        surveyName: campaignRaw['@survey_name'],
        customLabels: labelArray,
        allowLeadUpdates: allowLeadUpdates,
    };
}

/**
 * example packet
 *  {
 *      "chat_queue":[
 *          {
 *              "@chat_queue_desc":"",
 *              "@chat_queue_id":"74",
 *              "@chat_queue_name":"Please don't delete"
 *          },
 *          {
 *              "@chat_queue_desc":"blah",
 *              "@chat_queue_id":"131",
 *              "@chat_queue_name":"cris chat queue",
 *              "dnis":[
 *                  {"#text":"5555551215"},
 *                  {"#text":"5555554444"},
 *                  {"#text":"8885551212"},
 *                  {"#text":"97687"}
 *              ]
 *          }
 *      ]
 *   }
 *
 *
 *      This function will format the dnis list and put them back on chatSettings.availableChatQueues
 **/
function _processChatQueueDnis(chatSettings, response) {
    var queues = chatSettings.availableChatQueues;
    var rawQueues = response.ui_response.login_chat_queues.chat_queue;

    if (!Array.isArray(rawQueues)) {
        rawQueues = [rawQueues];
    }

    for (var i = 0; i < queues.length; i++) {
        var queue = queues[i];

        var rawQueue = {};
        for (var j = 0; j < rawQueues.length; j++) {
            var rq = rawQueues[j];
            if (rq['@chat_queue_id'] === queue.chatQueueId) {
                rawQueue = rq;
                break;
            }
        }

        if (rawQueue.dnis) {
            if (!Array.isArray(rawQueue.dnis)) {
                rawQueue.dnis = [rawQueue.dnis];
            }

            // update the dnis array to just be a list
            queue.dnis = rawQueue.dnis.map(function (d) {
                return d['#text'];
            });
        }
    }
}

var LogoutRequest = function (agentId, message) {
    this.agentId = agentId;
    this.message = message || '';
};

LogoutRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LOGOUT,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': this.agentId,
            },
            message: {
                '#text': this.message,
            },
        },
    };

    return JSON.stringify(msg);
};

LogoutRequest.prototype.processResponse = function (notification) {
    var formattedResponse = utils.buildDefaultResponse(notification);

    return formattedResponse;
};

var MultiSocketRequest = function () {};

MultiSocketRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LOGIN_MULTISOCKET,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': JSON.parse(model.dataStore.get('agent_id')), //fetch agent_id and hash_code from browser's local storage
            },
            hash_code: {
                '#text': JSON.parse(model.dataStore.get('hash_code')),
            },
        },
    };
    UIModel.getInstance().loginRequest = new LoginRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null
    );
    return JSON.stringify(msg);
};

var OffhookInitRequest = function () {};

OffhookInitRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.OFFHOOK_INIT,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            dial_dest: {
                '#text': UIModel.getInstance().agentSettings.dialDest,
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling an off-hook-init response packet from IntelliQueue.
 * If the offhookinit is successful, it will go into the UIModel and set the isOffhook variable
 * to true.
 *
 * {"ui_response":{
 *      "@message_id":"UI2005",
 *      "@response_to":"",
 *      "@type":"OFF-HOOK-INIT",
 *      "status":{"#text":"OK|FAILURE"},
 *      "monitoring":{"#text:"TRUE|FALSE"},
 *      "message":{},
 *      "detail":{}
 *    }
 * }
 */
OffhookInitRequest.prototype.processResponse = function (response) {
    var status = response.ui_response.status['#text'];
    var formattedResponse = utils.buildDefaultResponse(response);

    if (status === 'OK') {
        var isMonitoring = utils.getText(response.ui_response, 'monitoring');
        UIModel.getInstance().offhookInitPacket = response;
        UIModel.getInstance().agentSettings.isOffhook = true;
        UIModel.getInstance().agentSettings.isMonitoring = isMonitoring;
        formattedResponse.monitoring = isMonitoring;

        // make sure to reset softphone reconnect bool
        UIModel.getInstance().softphoneSettings.attemptingSoftphoneReconnect = false;
    } else {
        if (formattedResponse.message === '') {
            formattedResponse.message = 'Unable to process offhook request';
        }
        utils.logMessage(
            LOG_LEVELS.WARN,
            formattedResponse.message + ' ' + formattedResponse.detail,
            response
        );
    }

    return formattedResponse;
};

var OffhookTermRequest = function () {};

OffhookTermRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.OFFHOOK_TERM,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * Process an OFF-HOOK-TERM packet and update various variables in the UI
 *
 * {"ui_notification":{
 *      "@message_id":"IQ10012016080217135001344",
 *      "@response_to":"",
 *      "@type":"OFF-HOOK-TERM",
 *      "agent_id":{"#text":"1"},
 *      "start_dts":{"#text":"2016-08-02 17:11:38"},
 *      "end_dts":{"#text":"2016-08-02 17:14:07"},
 *      "monitoring":{"#text":"0"}
 *    }
 * }
 */
OffhookTermRequest.prototype.processResponse = function (data) {
    var notif = data.ui_notification;
    var monitoring = utils.getText(notif, 'monitoring') === '1';
    var model = UIModel.getInstance();

    model.agentSettings.wasMonitoring = monitoring;
    model.offhookTermPacket = data;
    model.agentSettings.isOffhook = false;
    model.agentSettings.isMonitoring = false;

    var formattedResponse = {
        status: 'OK',
        agentId: utils.getText(notif, 'agent_id'),
        startDts: utils.getText(notif, 'start_dts'),
        endDts: utils.getText(notif, 'end_dts'),
        monitoring: monitoring,
    };

    return formattedResponse;
};

var OneToOneOutdialRequest = function (
    destination,
    callerId,
    ringTime,
    countryId,
    gateId
) {
    this.destination = destination;
    this.callerId = callerId;
    this.ringTime = ringTime || '60';
    this.countryId = countryId || 'USA';
    this.gateId = gateId || '';
};

OneToOneOutdialRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.ONE_TO_ONE_OUTDIAL,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            destination: {
                '#text': utils.toString(this.destination),
            },
            ring_time: {
                '#text': utils.toString(this.ringTime),
            },
            caller_id: {
                '#text': utils.toString(this.callerId),
            },
            country_id: {
                '#text': utils.toString(this.countryId),
            },
            gate_id: {
                '#text': utils.toString(this.gateId),
            },
        },
    };

    return JSON.stringify(msg);
};

var OneToOneOutdialCancelRequest = function (uii) {
    this.uii = uii;
};

/*
 * This class is responsible for creating a new packet to cancel
 * an in-progress outbound call.
 */
OneToOneOutdialCancelRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.ONE_TO_ONE_OUTDIAL_CANCEL,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            uii: {
                '#text': utils.toString(this.uii),
            },
        },
    };

    return JSON.stringify(msg);
};

var PauseRecordRequest = function (record) {
    this.record = record;
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"PAUSE-RECORD",
 *      "agent_id":{"#text":"1856"},
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "record":{"#text":"TRUE | FALSE"},
 *      "pause":{"#text":"10"}
 *    }
 * }
 */
PauseRecordRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var pauseTime = '10';
    if (
        model.currentCall.agentRecording &&
        model.currentCall.agentRecording.pause
    ) {
        pauseTime = model.currentCall.agentRecording.pause;
    }
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.PAUSE_RECORD,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(model.currentCall.agentId),
            },
            uii: {
                '#text': utils.toString(model.currentCall.uii),
            },
            record: {
                '#text': utils.toString(
                    this.record === true ? 'TRUE' : 'FALSE'
                ),
            },
            pause: {
                '#text': utils.toString(pauseTime),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes PAUSE-RECORD packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082910361503344",
 *      "@response_to":"",
 *      "@type":"PAUSE-RECORD",
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "status":{"#text":"OK | FAILURE"},
 *      "message":{},
 *      "detail":{},
 *      "state":{"#text":"RECORDING | PAUSED"},
 *      "pause":{"#text":"10"}
 *    }
 * }
 */
PauseRecordRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);
    var currUII = '';
    if (UIModel.getInstance().currentCall.uii) {
        currUII = UIModel.getInstance().currentCall.uii;
    }

    formattedResponse.uii = utils.getText(resp, 'uii');
    formattedResponse.state = utils.getText(resp, 'state');
    formattedResponse.pause = utils.getText(resp, 'pause');

    if (formattedResponse.status === 'OK') {
        // make sure we are talking about the same call
        if (formattedResponse.uii === currUII) {
            if (formattedResponse.message === '') {
                formattedResponse.message =
                    'Broadcasting new record state of ' +
                    formattedResponse.state;
            }
            utils.logMessage(
                LOG_LEVELS.DEBUG,
                'Broadcasting new record state of ' + formattedResponse.state,
                response
            );
        } else {
            utils.logMessage(
                LOG_LEVELS.DEBUG,
                'Pause Record Response is for a different call...discarding',
                response
            );
        }
    } else {
        if (formattedResponse.message === '') {
            formattedResponse.message =
                'Error processing PAUSE-RECORD request.' +
                formattedResponse.message +
                '\n' +
                formattedResponse.detail;
        }
        utils.logMessage(LOG_LEVELS.WARN, formattedResponse.message, response);
    }

    return formattedResponse;
};

var PingCallRequest = function () {};

PingCallRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.PING_CALL,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().currentCall.agentId,
            },
            uii: {
                '#text': UIModel.getInstance().currentCall.uii,
            },
        },
    };

    return JSON.stringify(msg);
};

var PreviewDialRequest = function (action, searchFields, requestId, leadPhone) {
    this.agentId = UIModel.getInstance().agentSettings.agentId;
    this.searchFields = searchFields || [];
    this.requestId = requestId || '';
    this.action = action || '';
    this.leadPhone = leadPhone || ''; // pipe leads only
};

/*
 * searchFields = [
 *  {key: "name", value: "Danielle"},
 *  {key: "number", value: "5555555555"
 * ];
 */
PreviewDialRequest.prototype.formatJSON = function () {
    var fields = {};
    for (var i = 0; i < this.searchFields.length; i++) {
        var fieldObj = this.searchFields[i];
        fields[fieldObj.key] = { '#text': utils.toString(fieldObj.value) };
    }

    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.PREVIEW_DIAL,
            '@message_id': utils.getMessageId(),
            '@action': this.action,
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            pending_request_id: {
                '#text': utils.toString(this.requestId),
            },
            lead_phone: {
                '#text': utils.toString(this.leadPhone),
            },
            search_fields: fields,
            // { "name": {"#text": "Danielle" } }
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling PREVIEW-DIAL packets received
 * from the dialer. It will save a copy of it in the UIModel.
 *
 * {"dialer_request":{
 *      "@action":"", // <-- empty for Preview fetch, otherwise "SEARCH"
 *      "@callbacks":"TRUE|FALSE"
 *      ,"@message_id":"ID2008091513163400220",
 *      "@response_to":"",
 *      "@type":"PREVIEW_DIAL",
 *      "dial_group_id":{"#text":"200018"},
 *      "account_id":{"#text":"99999999"},
 *      "agent_id":{"#text":"1810"},
 *      "is_insert":{"#text":"TRUE|FALSE"}, <--- TRUE if search triggered by insert
 *      "destinations":{
 *          "lead":[
 *              {
 *                  "@aux_data1":"","@aux_data2":"","@aux_data3":"","@aux_data4":"","@aux_data5":"",
 *                  "@aux_phone":"","@campaign_id":"51","@destination":"9548298548","@dnis":"1112223333",
 *                  "@extern_id":"amanda","@lead_id":"2646","@lead_state":"PENDING","@live_answer_msg":"",
 *                  "@mach_answer_msg":"","@machine_detect":"FALSE","@request_key":"IQ982008091516241101125",
 *                  "@valid_until":"2008-09-15 17:24:11","extern_id":{"#text":"9548298548"},
 *                  "first_name":{"#text":"Amanda"},"mid_name":{"#text":"Amanda"},"last_name":{"#text":"Machutta2"},
 *                  "address1":{},"address2":{},"city":{},"state":{},"zip":{},"aux_greeting":{},
 *                  "aux_external_url":{}, "app_url":{}
 *              },
 *          ]
 *      }
 *    }
 * }
 */
PreviewDialRequest.prototype.processResponse = function (notification) {
    var notif = notification.dialer_request;
    var model = UIModel.getInstance();
    var leads = utils.processResponseCollection(notif, 'destinations', 'lead');

    // send over requestId (as well as requestKey for backwards compatibility)
    // to match previewLeadState.notification property
    for (var l = 0; l < leads.length; l++) {
        var lead = leads[l];
        lead.requestId = lead.requestKey;
        lead.ani = lead.destination; // add ani prop since used in new call packet & update lead

        // In case of a single lead returned, the XML converter to JSON will add lead as an object and not an array
        //
        if (!Array.isArray(notif.destinations.lead)) {
            notif.destinations.lead = [notif.destinations.lead];
        }

        // parse extra data correctly
        try {
            var notifLead = notif.destinations.lead[l];

            if (notifLead.extra_data) {
                // if this lead doesn't match the current lead, find it from the notification
                if (notifLead['@lead_id'] !== lead.leadId) {
                    notifLead = notif.destinations.lead.filter(function (
                        destLead
                    ) {
                        return destLead['@lead_id'] === lead.leadId;
                    });
                }

                delete lead.extraDatas;
                lead.extraData = {};
                for (var key in notifLead.extra_data) {
                    lead.extraData[key] = notifLead.extra_data[key]['#text'];
                }
            }
        } catch (e) {
            console.warn('error parsing lead extra data: ' + e);
        }
    }

    var formattedResponse = {
        action: notif['@action'],
        callbacks: notif['@callbacks'] === 'TRUE',
        dialGroupId: utils.getText(notif, 'dial_group_id'),
        accountId: utils.getText(notif, 'account_id'),
        agentId: utils.getText(notif, 'agent_id'),
        isInsert: utils.getText(notif, 'is_insert'),
        leads: leads,
    };

    if (notif['@callbacks'] === 'TRUE') {
        utils.logMessage(
            LOG_LEVELS.INFO,
            "New CALLBACK packet request rec'd from dialer",
            notification
        );
        // clear callbacks??
        //model.callbacks = [];
        leads.forEach(function (lead) {
            model.callbacks.push(lead);
        });
    } else {
        model.outboundSettings.previewDialLeads = leads;
    }

    return formattedResponse;
};

var RecordRequest = function (record) {
    this.record = record;
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"RECORD",
 *      "agent_id":{"#text":"1856"},
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "record":{"#text":"TRUE | FALSE"}
 *    }
 * }
 */
RecordRequest.prototype.formatJSON = function () {
    var model = UIModel.getInstance();
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.RECORD,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(model.currentCall.agentId),
            },
            uii: {
                '#text': utils.toString(model.currentCall.uii),
            },
            record: {
                '#text': this.record === true ? 'TRUE' : 'FALSE',
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes RECORD packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082910361503344",
 *      "@response_to":"",
 *      "@type":"RECORD",
 *      "uii":{"#text":"200808291035510000000900029412"},
 *      "status":{"#text":"OK"},
 *      "message":{},
 *      "detail":{},
 *      "state":{"#text":"RECORDING | STOPPED"}
 *    }
 * }
 */
RecordRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);
    var currUII = '';
    if (UIModel.getInstance().currentCall.uii) {
        currUII = UIModel.getInstance().currentCall.uii;
    }

    formattedResponse.uii = utils.getText(resp, 'uii');
    formattedResponse.state = utils.getText(resp, 'state');

    if (formattedResponse.status === 'OK') {
        // make sure we are talking about the same call
        if (formattedResponse.uii === currUII) {
            if (formattedResponse.message === '') {
                formattedResponse.message =
                    'Broadcasting new record state of ' +
                    formattedResponse.state;
            }
            utils.logMessage(
                LOG_LEVELS.DEBUG,
                formattedResponse.message,
                response
            );
        } else {
            utils.logMessage(
                LOG_LEVELS.DEBUG,
                'Record Response is for a different call...discarding',
                response
            );
        }
    } else {
        if (formattedResponse.message === '') {
            formattedResponse.message =
                'Error processing RECORD request.' +
                formattedResponse.message +
                '\n' +
                formattedResponse.detail;
        }
        utils.logMessage(LOG_LEVELS.WARN, formattedResponse.message, response);
    }

    return formattedResponse;
};

var RequeueRequest = function (queueId, skillId, maintain) {
    this.queueId = queueId;
    this.skillId = skillId;
    this.maintain = maintain;
};

RequeueRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.REQUEUE,
            '@message_id': utils.getMessageId(),
            response_to: '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            uii: {
                '#text': UIModel.getInstance().currentCall.uii,
            },
            gate_number: {
                '#text': utils.toString(this.queueId),
            },
            skill_id: {
                '#text': utils.toString(this.skillId),
            },
            maintain_agent: {
                '#text': this.maintain === true ? 'TRUE' : 'FALSE',
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes RE-QUEUE packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082817165103291",
 *      "@response_to":"UIV220088281716486",
 *      "@type":"RE-QUEUE",
 *      "status":"OK",
 *      "message":"Success.",
 *      "detail":"The re-queue request was successfully processed.",
 *      "agent_id":{"#text":"1856"},
 *      "uii":{"#text":"200808281716090000000900028070"},
 *      "gate_number":{"#text":"19"},
 *      "maintain_agent":{"#text":"FALSE"}
 *    }
 * }
 */
RequeueRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.agentId = utils.getText(resp, 'agent_id');
    formattedResponse.uii = utils.getText(resp, 'uii');
    formattedResponse.queueId = utils.getText(resp, 'gate_number');

    if (formattedResponse.status !== 'OK') {
        var message =
            'There was an error processing the requeue request. ' +
            formattedResponse.detail;
        utils.logMessage(LOG_LEVELS.WARN, message, response);
    }

    return formattedResponse;
};

var ScriptConfigRequest = function (scriptId, version) {
    this.scriptId = scriptId;
    this.version = version || null;
};

/*
 * This event is responsible for requesting a script object
 */
ScriptConfigRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@message_id': utils.getMessageId(),
            response_to: '',
            '@type': MESSAGE_TYPES.SCRIPT_CONFIG,
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            script_id: {
                '#text': utils.toString(this.scriptId),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class process SCRIPT-CONFIG packets received from IntelliQueue.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082817165103294",
 *      "@response_to":"",
 *      "@type":"SCRIPT-CONFIG",
 *      "status":{"#text":"OK"},
 *      "message":{},
 *      "script_id":{"#text":"123"},
 *      "version":{"#text":"1"},
 *      "json":{},
 *   }
 * }
 */
ScriptConfigRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    if (formattedResponse.status === 'true') {
        formattedResponse.status = true;
        formattedResponse.scriptId = utils.getText(resp, 'script_id');
        formattedResponse.version = utils.getText(resp, 'version');
        formattedResponse.json = utils.getText(resp, 'json');

        // store script on model
        UIModel.getInstance().scriptSettings.loadedScripts[
            formattedResponse.scriptId
        ] = formattedResponse;
    } else {
        formattedResponse.status = false;
    }

    return formattedResponse;
};

var ScriptResultRequest = function (uii, scriptId, jsonResult) {
    this.uii = uii;
    this.scriptId = scriptId;
    this.jsonResult = jsonResult;
};

/*
 * This event is responsible for sending the script result object
 */
ScriptResultRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@message_id': utils.getMessageId(),
            response_to: '',
            '@type': MESSAGE_TYPES.SCRIPT_RESULT,
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            uii: {
                '#text': utils.toString(this.uii),
            },
            script_id: {
                '#text': utils.toString(this.scriptId),
            },
            json_result: {
                '#text': JSON.stringify(this.jsonResult),
            },
        },
    };

    return JSON.stringify(msg);
};

var SearchDirectoryRequest = function () {};

SearchDirectoryRequest.prototype.searchDirectory = function (searchString) {
    UIModel.getInstance().searchDirectoryRequest = this;
    _searchDirectory('rcdirectory/getRcCorporateDirectory', searchString);
};

SearchDirectoryRequest.prototype.processResponse = function (response) {
    UIModel.getInstance().filteredDirectory = response;
    return UIModel.getInstance().filteredDirectory;
};

function _searchDirectory(path, searchString) {
    var model = UIModel.getInstance();
    var accountId = model.agentSettings.accountId; //subAccountId
    var baseUrl = model.authHost + model.baseApiUri;
    var engageAccessToken =
        'Bearer ' +
        utils.toString(
            UIModel.getInstance().authenticateRequest.engageAccessToken
        );
    var params = {
        headers: {
            'Content-Type': 'application/json',
        },
        queryParams: {},
    };
    params.headers['Authorization'] = engageAccessToken;
    params.queryParams['searchString'] = searchString;
    params.queryParams['accountId'] = accountId;
    var errorMsg = 'Error on request to search Directory: ' + baseUrl + path;
    new HttpService(baseUrl).httpGet(path, params).then(
        function (response) {
            try {
                response = JSON.parse(response.response);
                var searchDirResponse =
                    UIModel.getInstance().searchDirectoryRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    UIModel.getInstance().libraryInstance,
                    CALLBACK_TYPES.SEARCH_DIR,
                    searchDirResponse
                );
            } catch (err) {
                utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
            }
        },
        function (err) {
            var errResponse = {
                type: 'Error retrieving directory list',
                message: errorMsg,
            };
            utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);

            // still fire callback on error response
            utils.fireCallback(
                UIModel.getInstance().libraryInstance,
                CALLBACK_TYPES.SEARCH_DIR,
                errResponse
            );
        }
    );
}

var StatsRequest = function () {};

/*
 * { "ui_request": {
 *      "@response_to":"",
 *      "@message_id":"IS20160901142437535",
 *      "@type":"STATS"
 *    }
 * }
 */
StatsRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IS',
            '@type': MESSAGE_TYPES.STATS,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            include_supervisor_stats: {
                '#text':
                    UIModel.getInstance().agentSettings
                        .includeSupervisorStats === true
                        ? 'TRUE'
                        : 'FALSE',
            },
            last_roundtrip_duration_ms: {
                '#text': utils.toString(
                    UIModel.getInstance().applicationSettings
                        .statsRoundtripDurationMs
                ),
            },
        },
    };

    return JSON.stringify(msg);
};

var SummaryRequest = function (uii, sessionId, segmentId) {
    this.uii = uii;
    this.sessionId = sessionId;
    this.segmentId = segmentId;
};

SummaryRequest.prototype.formatJSON = function () {
    var message = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.REQUEST_SUMMARY,
            '@message_id': utils.getMessageId(),
            '@response_to': '',

            uii: {
                '#text': utils.toString(this.uii),
            },
            session_id: {
                '#text': utils.toString(this.sessionId),
            },
            segment_id: {
                '#text': utils.toString(this.segmentId),
            },
        },
    };

    return JSON.stringify(message);
};

var TcpaSafeRequest = function (action, searchFields, requestId, leadPhone) {
    this.agentId = UIModel.getInstance().agentSettings.agentId;
    this.searchFields = searchFields || [];
    this.requestId = requestId || '';
    this.action = action || '';
    this.leadPhone = leadPhone || ''; // pipe leads only
};

/*
 * searchFields = [
 *  {key: "name", value: "Danielle"},
 *  {key: "number", value: "5555555555"
 * ];
 */
TcpaSafeRequest.prototype.formatJSON = function () {
    var fields = {};
    for (var i = 0; i < this.searchFields.length; i++) {
        var fieldObj = this.searchFields[i];
        fields[fieldObj.key] = { '#text': utils.toString(fieldObj.value) };
    }

    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.TCPA_SAFE,
            '@message_id': utils.getMessageId(),
            '@action': this.action,
            response_to: '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            pending_request_id: {
                '#text': utils.toString(this.requestId),
            },
            lead_phone: {
                '#text': utils.toString(this.leadPhone),
            },
            search_fields: fields,
            // { "name": {"#text": "Danielle"} }
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling TCPA-SAFE packets received
 * from the dialer. It will save a copy of it in the UIModel.
 *
 * {"dialer_request":{
 *      "@action":"",
 *      "@callbacks":"TRUE|FALSE"
 *      ,"@message_id":"ID2008091513163400220",
 *      "@response_to":"",
 *      "@type":"TCPA_SAFE",
 *      "dial_group_id":{"#text":"200018"},
 *      "account_id":{"#text":"99999999"},
 *      "agent_id":{"#text":"1810"},
 *      "is_insert":{"#text":"TRUE|FALSE"}, <--- TRUE if search triggered by insert
 *      "destinations":{
 *          "lead":[
 *              {
 *                  "@aux_data1":"","@aux_data2":"","@aux_data3":"","@aux_data4":"","@aux_data5":"",
 *                  "@aux_phone":"","@campaign_id":"51","@destination":"9548298548","@dnis":"1112223333",
 *                  "@extern_id":"amanda","@lead_id":"2646","@lead_state":"PENDING","@live_answer_msg":"",
 *                  "@mach_answer_msg":"","@machine_detect":"FALSE","@request_key":"IQ982008091516241101125",
 *                  "@valid_until":"2008-09-15 17:24:11","extern_id":{"#text":"9548298548"},
 *                  "first_name":{"#text":"Amanda"},"mid_name":{"#text":"Amanda"},"last_name":{"#text":"Machutta2"},
 *                  "address1":{},"address2":{},"city":{},"state":{},"zip":{},"aux_greeting":{},
 *                  "aux_external_url":{}, "app_url":{}
 *              },
 *          ]
 *      }
 *    }
 * }
 *
 */
TcpaSafeRequest.prototype.processResponse = function (notification) {
    var notif = notification.dialer_request;
    var model = UIModel.getInstance();
    var leads = utils.processResponseCollection(notif, 'destinations', 'lead');

    // send over requestId (as well as requestKey for backwards compatibility)
    // to match tcpaSafeLeadState.notification property
    for (var l = 0; l < leads.length; l++) {
        var lead = leads[l];
        lead.requestId = lead.requestKey;
        lead.ani = lead.destination; // add ani prop since used in new call packet & update lead

        // In case of a single lead returned, the XML converter to JSON will add lead as an object and not an array
        //
        if (!Array.isArray(notif.destinations.lead)) {
            notif.destinations.lead = [notif.destinations.lead];
        }

        // parse extra data correctly
        try {
            var notifLead = notif.destinations.lead[l];

            if (notifLead.extra_data) {
                // if this lead doesn't match the current lead, find it from the notification
                if (notifLead['@lead_id'] !== lead.leadId) {
                    notifLead = notif.destinations.lead.filter(function (
                        destLead
                    ) {
                        return destLead['@lead_id'] === lead.leadId;
                    });
                }

                delete lead.extraDatas;
                lead.extraData = {};
                for (var key in notifLead.extra_data) {
                    lead.extraData[key] = notifLead.extra_data[key]['#text'];
                }
            }
        } catch (e) {
            console.warn('error parsing lead extra data: ' + e);
        }
    }

    var formattedResponse = {
        action: notif['@action'],
        callbacks: notif['@callbacks'] === 'TRUE',
        dialGroupId: utils.getText(notif, 'dial_group_id'),
        accountId: utils.getText(notif, 'account_id'),
        agentId: utils.getText(notif, 'agent_id'),
        isInsert: utils.getText(notif, 'is_insert'),
        leads: leads,
    };

    if (notif['@callbacks'] === 'TRUE') {
        var message = "New CALLBACK packet request rec'd from dialer";
        utils.logMessage(LOG_LEVELS.INFO, message, notification);
        // clear callbacks??
        //model.callbacks = [];
        leads.forEach(function (callbackLead) {
            model.callbacks.push(callbackLead);
        });
    } else {
        model.outboundSettings.tcpaSafeLeads = leads;
    }

    return formattedResponse;
};

var UpdateDialDestinationRequest = function (dialDest, isSoftphoneError) {
    this.dialDest = dialDest;
    this.isSoftphoneError = isSoftphoneError || false;
};

/*
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":MESSAGE_TYPES.UPDATE_DIAL_DESTINATION,
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "agent_id":"1",
 *      "dial_dest":{"#text":"blah@something.com"},
 *      "log_softphone_error": {"#text":"TRUE|FALSE"},
 *    }
 * }
 */
UpdateDialDestinationRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.UPDATE_DIAL_DESTINATION,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
            dial_dest: {
                '#text': utils.toString(this.dialDest),
            },
            log_softphone_error: {
                '#text': utils.toString(
                    this.isSoftphoneError === true ? 'TRUE' : 'FALSE'
                ),
            },
        },
    };

    return JSON.stringify(msg);
};

var XferWarmRequest = function (dialDest, callerId, sipHeaders, countryId) {
    this.dialDest = dialDest;
    this.callerId = callerId || '';
    this.sipHeaders = sipHeaders || [];
    this.countryId = countryId;
};

XferWarmRequest.prototype.formatJSON = function () {
    var fields = [];
    for (var i = 0; i < this.sipHeaders.length; i++) {
        var fieldObj = this.sipHeaders[i];
        fields.push({
            '@name': utils.toString(fieldObj.name),
            '@value': utils.toString(fieldObj.value),
        });
    }

    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.XFER_WARM,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            uii: {
                '#text': UIModel.getInstance().currentCall.uii,
            },
            dial_dest: {
                '#text': utils.toString(this.dialDest),
            },
            caller_id: {
                '#text': utils.toString(this.callerId),
            },
            country_id: {
                '#text': utils.toString(this.countryId),
            },
            xfer_header: fields,
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class processes WARM-XFER packets rec'd from IQ.
 *
 * {"ui_response":{
 *      "@message_id":"IQ10012016082314475000219",
 *      "@response_to":"",
 *      "@type":"WARM-XFER",
 *      "agent_id":{"#text":"1"},
 *      "uii":{"#text":"201608231447590139000000000200"},
 *      "session_id":{"#text":"3"},
 *      "status":{"#text":"OK"},
 *      "dial_dest":{"#text":"3038593775"},
 *      "message":{"#text":"OK"},"detail":{}
 *    }
 * }
 *  Response on CANCEL:
 *  {"ui_response":{
 *      "@message_id":"IQ10012016082315005000264",
 *      "@response_to":"",
 *      "@type":"WARM-XFER",
 *      "agent_id":{"#text":"1"},
 *      "uii":{"#text":"201608231501090139000000000204"},
 *      "session_id":{},
 *      "status":{"#text":"FAILURE"},
 *      "dial_dest":{"#text":"3038593775"},
 *      "message":{"#text":"Transfer CANCELED"},
 *      "detail":{"#text":"NOANSWER after 3 seconds."}
 *    }
 * }
 */
XferWarmRequest.prototype.processResponse = function (response) {
    var resp = response.ui_response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.agentId = utils.getText(resp, 'agent_id');
    formattedResponse.uii = utils.getText(resp, 'uii');
    formattedResponse.sessionId = utils.getText(resp, 'session_id');
    formattedResponse.dialDest = utils.getText(resp, 'dial_dest');

    if (formattedResponse.status === 'OK') {
        utils.logMessage(
            LOG_LEVELS.DEBUG,
            'Warm Xfer to ' +
                formattedResponse.dialDest +
                ' processed successfully.',
            response
        );
    } else {
        utils.logMessage(
            LOG_LEVELS.WARN,
            'There was an error processing the Warm Xfer request. ' +
                formattedResponse.message +
                '\n' +
                formattedResponse.detail,
            response
        );
    }

    return formattedResponse;
};

var XferWarmCancelRequest = function (dialDest) {
    this.dialDest = dialDest;
};

XferWarmCancelRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.XFER_WARM_CANCEL,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            uii: {
                '#text': UIModel.getInstance().currentCall.uii,
            },
            dial_dest: {
                '#text': utils.toString(this.dialDest),
            },
        },
    };

    return JSON.stringify(msg);
};

var WebRTCRequest = function () {};

WebRTCRequest.prototype.getSipRegistrationInfo = function () {
    UIModel.getInstance().WebRTCRequest = this;
    _getSipRegistrationInfo('sip/sipRegistrationInfo', {
        agentId: UIModel.getInstance().agentSettings.agentId,
        ssoLogin: UIModel.getInstance().applicationSettings.isSso,
    });
};

/*
 * legacy response
 * {
 *   "sipInfo": [
 *       {
 *           "transport": "wss",
 *           "username": "yadvendra_agent",
 *           "password": "oct@2018",
 *           "domain": "d03-reg1.vacd.biz",
 *           "outboundProxy": "d03-reg1.vacd.biz:8089/freeswitch"
 *       }
 *   ]
 * }
 *
 * RC SSO response
 * {
 *   "sipInfo": [
 *       {
 *           "transport": "WSS",
 *           "username": "18662032059*101",
 *           "password": "B77O85vO",
 *           "authorizationId": "400017513008",
 *           "domain": "sip-cfintams.lab.nordigy.ru",
 *           "outboundProxy": "webphone-sip-cfintams.lab.nordigy.ru:8083"
 *       }
 *   ]
 * }
 * */
WebRTCRequest.prototype.processResponse = function (response) {
    var softphoneSettings = UIModel.getInstance().softphoneSettings;
    softphoneSettings.sipInfo = response.sipInfo;

    return softphoneSettings.sipInfo;
};

function _getSipRegistrationInfo(path, queryParams) {
    var model = UIModel.getInstance();
    var baseUrl = model.authHost + model.baseApiUri;
    var engageAccessToken =
        'Bearer ' +
        utils.toString(
            UIModel.getInstance().authenticateRequest.engageAccessToken
        );
    var params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    params.headers['Authorization'] = engageAccessToken;
    params['queryParams'] = queryParams;
    var errorMsg =
        'Error on request get to sip registration info. URL: ' + baseUrl + path;

    new HttpService(baseUrl).httpGet(path, params).then(
        function (response) {
            try {
                response = JSON.parse(response.response);
                var webRTCResponse =
                    UIModel.getInstance().WebRTCRequest.processResponse(
                        response
                    );
                model.softphoneSettings.lastSipFetchTime = Date.now();
                utils.fireCallback(
                    UIModel.getInstance().libraryInstance,
                    CALLBACK_TYPES.WEBRTC_INFO,
                    webRTCResponse
                );
            } catch (err) {
                utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
            }
        },
        function (err) {
            var errResponse = {
                type: 'Error retrieving sip registration information',
                message: errorMsg,
            };
            utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);

            // still fire callback on error response
            utils.fireCallback(
                UIModel.getInstance().libraryInstance,
                CALLBACK_TYPES.WEBRTC_INFO,
                errResponse
            );
        }
    );
}

var ChatAgentEndRequest = function (agentId, uii) {
    this.uii = uii;
    this.agentId = agentId;
};

/*

External Chat :
when agent submits a chat end request, send "CHAT-AGENT-END" request to IntelliQueue

{
    "ui_request" : {
        "@destination" : "IQ",
        "@type" : MESSAGE_TYPES.CHAT_AGENT_END,
        "uii":{
            "#text":utils.toString(this.uii)
        },
        "agent_id":{
            "#text":utils.toString(this.agentId)
        }
    }
}

*/

ChatAgentEndRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_AGENT_END,
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            operation_id: {
                '#text': utils.generateOpId(),
            },
        },
    };

    return JSON.stringify(msg);
};

/** Deprecated */
var ChatAliasRequest = function (alias) {
    this.alias = alias;
};

/*
 * This class is responsible for creating the request to change chat alias
 * packet and sending it to intelliservices.
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"CHAT-ALIAS",
 *      "alias":{"#text":""}
 *    }
 * }
 */
ChatAliasRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IS',
            '@type': MESSAGE_TYPES.CHAT_ALIAS,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            alias: {
                '#text': utils.toString(this.alias),
            },
        },
    };

    return JSON.stringify(msg);
};

var ChatDispositionRequest = function (
    uii,
    agentId,
    dispositionId,
    notes,
    sendAcknowlegement,
    survey,
    sessionId
) {
    this.uii = uii;
    this.agentId = agentId;
    this.dispositionId = dispositionId;
    this.notes = notes || '';
    this.sendAcknowlegement = sendAcknowlegement || false;
    this.sessionId = sessionId;

    /*
     * survey = {
     *      first_name: {
     *          leadField: "first_name"
     *          value: "Geoff"
     *      },
     *      last_name: {
     *          leadField: "last_name"
     *          value: "Mina"
     *      }
     *      ...
     * }
     */
    this.survey = survey || null;
};

/*
 * External Chat:
 * When agent dispositions a chat, send "CHAT-DISPOSITION" request to IntelliQueue
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-DISPOSITION",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "uii":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "session_id" : {"#text" : ""},
 *      "disposition_id":{"#text":""},
 *      "notes":{"#text":"hello"},
 *      "do_ack":{"#text":"true"},
 *      "survey":{
 *          "response":[
 *              {"@extern_id":"text_box","#text":"hello"},
 *              {"@extern_id":"check_box","#text":"20"},
 *              {"@extern_id":"radio_save","#text":"23"}
 *          ]
 *      }
 *    }
 * }
 */
ChatDispositionRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_DISPOSITION,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            session_id: {
                '#text': utils.toString(this.sessionId),
            },
            disposition_id: {
                '#text': utils.toString(this.dispositionId),
            },
            notes: {
                '#text': utils.toString(this.notes),
            },
            do_ack: {
                '#text': this.sendAcknowlegement === true ? 'TRUE' : 'FALSE',
            },
        },
    };

    /*
     * converts survey to this response
     * survey : {
     *      response: [
     *          { "@extern_id":"", "@lead_update_column":"", "#text":"" }
     *      ]
     * }
     */
    if (this.survey !== null) {
        var response = [];
        var keys = Object.keys(this.survey);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var obj = {
                '@extern_id': key,
                '#text': utils.toString(this.survey[key].value),
            };
            response.push(obj);
        }
        msg.ui_request.survey = { response: response };
    }

    return JSON.stringify(msg);
};

var ChatListRequest = function (agentId, monitorAgentId) {
    this.agentId = agentId;
    this.monitorAgentId = monitorAgentId;
};

/*
 * External Chat:
 * Requests a list of all chats by monitor agent id
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-LIST",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "agent_id":{"#text":""},
 *      "monitor_agent_id":{"#text":""}
 *    }
 * }
 */

ChatListRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_LIST,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            monitor_agent_id: {
                '#text': utils.toString(this.monitorAgentId),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * External Chat:
 * This class is responsible for handling "CHAT-LIST" packets from IntelliQueue.
 *
 *  {
 *      "ui_response":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-LIST",
 *          "@response_to":"",
 *          "agent_id":{"#text":"17"},
 *          "monitor_agent_id":{"#text":"18"},
 *          "chat_list": {}
 *      }
 *  }
 */

ChatListRequest.prototype.processResponse = function (response) {
    var notif = response.ui_response;
    var model = UIModel.getInstance();
    model.chatListResponse = response;
    var formattedResponse = utils.buildDefaultResponse(response);

    formattedResponse.message = 'Received CHAT-LIST response';
    formattedResponse.status = 'OK';
    formattedResponse.messageId = notif['@message_id'];
    formattedResponse.agentId = utils.getText(notif, 'agent_id');
    formattedResponse.monitorAgentId = utils.getText(notif, 'monitor_agent_id');
    formattedResponse.chatList = utils.processResponseCollection(
        notif,
        'chat_list',
        'active_chat'
    );

    return formattedResponse;
};

var ChatMessageRequest = function (uii, agentId, message, whisper) {
    this.uii = uii;
    this.agentId = agentId;
    this.message = message;
    this.whisper = whisper;
};

/*
 * External Chat:
 * When agent submits a chat message, send "CHAT-MESSAGE" request to IntelliQueue
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-MESSAGE",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "uii":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "message":{"#text":"hello"},
 *      "whisper":{"#text":"true|false"}
 *    }
 * }
 */
ChatMessageRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_MESSAGE,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            message: {
                '#text': utils.toString(this.message),
            },
            whisper: {
                '#text': utils.toString(this.whisper),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling external CHAT-MESSAGE packets received from
 * IntelliQueue.
 *
 * {"ui_notification":{
 *      "@message_id":"",
 *      "@response_to":"",
 *      "@type":"CHAT-MESSAGE",
 *      "uii":{"#text":""},
 *      "account_id":{"#text":""},
 *      "from":{"#text":""},
 *      "message":{"#text":"hello"},
 *      "dts":{"#text":"2017-05-10 12:40:28"},
 *      "dequeue_agent_id":{"#text":"123"},
 *      "whisper":{"#text":'TRUE'|'FALSE'"}
 *    }
 * }
 */

ChatMessageRequest.prototype.processResponse = function (response) {
    var resp = response.ui_notification;
    var dts = utils.getText(resp, 'dts').trim();
    var dtsDate = new Date(dts.replace(' ', 'T'));

    var formattedResponse = utils.buildDefaultResponse(response);
    formattedResponse.status = 'OK';
    formattedResponse.uii = utils.getText(resp, 'uii');
    formattedResponse.accountId = utils.getText(resp, 'account_id');
    formattedResponse.from = utils.getText(resp, 'from');
    formattedResponse.type = utils.getText(resp, 'type');
    formattedResponse.message = utils.getText(resp, 'message');
    formattedResponse.whisper = utils.getText(resp, 'whisper');
    formattedResponse.dequeueAgentId = utils.getText(resp, 'dequeue_agent_id');
    formattedResponse.dts = dtsDate;
    formattedResponse.mediaLinks = utils.processResponseCollection(
        resp,
        'media_links',
        'link'
    );

    utils.logMessage(
        LOG_LEVELS.DEBUG,
        'New CHAT-MESSAGE packet received from IntelliQueue',
        response
    );

    return formattedResponse;
};

var ChatPresentedResponseRequest = function (
    uii,
    messageId,
    response,
    responseReason
) {
    this.uii = uii;
    this.messageId = messageId;
    this.response = response;
    this.responseReason = responseReason || '';
};

/*
 * External Chat:
 * When Agent receives a CHAT-PRESENTED notification, respond with
 * either ACCEPT or REJECT for presented chat.
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-PRESENTED-RESPONSE",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "uii":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "response":{"#text":"ACCEPT|REJECT"},
 *      "response_reason":{"#text":""}
 *      "operation_id":{"#text":""}
 *    }
 * }
 */
ChatPresentedResponseRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_PRESENTED_RESPONSE,
            '@message_id': utils.getMessageId(),
            '@response_to': this.messageId,
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            response: {
                '#text': utils.toString(this.response),
            },
            response_reason: {
                '#text': utils.toString(this.responseReason),
            },
            operation_id: {
                '#text': utils.generateOpId(),
            },
        },
    };

    return JSON.stringify(msg);
};

var ChatRequeueRequest = function (
    uii,
    agentId,
    chatQueueId,
    skillId,
    maintainAgent
) {
    this.uii = uii;
    this.agentId = agentId;
    this.chatQueueId = chatQueueId;
    this.skillId = skillId || '';
    this.maintainAgent = maintainAgent || false;
};

/*
 * External Chat:
 * When agent submits a chat message, send "CHAT-REQUEUE" request to IntelliQueue
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-REQUEUE",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "operation_id":{"#text":"1234567890asdfghjklzxcvb"}, // 24 character hex string, only set for Engage Digital Tasks
 *      "uii":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "chat_queue_id":{"#text":""},
 *      "skill_id":{"#text":""},
 *      "maintain_agent":{"#text":"true|false"}
 *    }
 * }
 */
ChatRequeueRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_REQUEUE,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            operation_id: {
                '#text': utils.generateOpId(),
            },
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            chat_queue_id: {
                '#text': utils.toString(this.chatQueueId),
            },
            skill_id: {
                '#text': utils.toString(this.skillId),
            },
            maintain_agent: {
                '#text': utils.toString(this.maintainAgent),
            },
        },
    };

    return JSON.stringify(msg);
};

/** Deprecated */
var ChatRoomRequest = function (action, roomType, roomId, agentOne, agentTwo) {
    this.action = action;
    this.roomType = roomType;
    this.roomId = roomId;
    this.agentOne = agentOne || '';
    this.agentTwo = agentTwo || '';
};

/*
 * This class is responsible for sending the packet requesting to either enter
 * a chatroom, or to exit a chatroom to IS. It also handles private chats. There are
 * two possible ways these packets could look:
 *
 * //PUBLIC
 * {"ui_request":{
 *      "@destination":"IS",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "@type":"CHAT-ROOM",
 *      "@room_type":"PUBLIC",
 *      "room_id":{"#text":""},
 *      "action":{"#text":"EXIT|ENTER"}
 *    }
 * }
 * -OR-
 * // PRIVATE
 * {"ui_request":{
 *      "@destination":"IS",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "@type":"CHAT-ROOM",
 *      "@room_type":"PRIVATE",
 *      "agent_one":{"#text":""},
 *      "agent_two":{"#text":""},
 *      "action":{"#text":"ENTER|EXIT"}
 *    }
 * }
 *
 */
ChatRoomRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IS',
            '@type': MESSAGE_TYPES.CHAT_ROOM,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            action: {
                '#text': utils.toString(this.action),
            },
        },
    };

    if (this.action !== 'EXIT') {
        msg.ui_request['@room_type'] = this.roomType;
    }

    if (this.roomType === 'PRIVATE' && this.action === 'ENTER') {
        msg.ui_request.agent_one = { '#text': utils.toString(this.agentOne) };
        msg.ui_request.agent_two = { '#text': utils.toString(this.agentTwo) };
    } else {
        msg.ui_request.room_id = { '#text': utils.toString(this.roomId) };
    }
    return JSON.stringify(msg);
};

/** Deprecated */
var ChatRoomStateRequest = function () {};

/*
 * This class is responsible for processing CHAT-ROOM-STATE packets received
 * from IntelliServices.
 *
 * {"ui_request":{
 *      "@message_id":"",
 *      "@response_to":"",
 *      "@type":"CHAT-ROOM-STATE",
 *      "room_id":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "chat_alias":{"#text":""},
 *      "state":{"#text":""}
 *    }
 * }
 */
ChatRoomStateRequest.prototype.processResponse = function (response) {
    var resp = response.ui_request;
    var formattedResponse = {
        roomId: utils.getText(resp, 'room_id'),
        agentId: utils.getText(resp, 'agent_id'),
        chatAlias: utils.getText(resp, 'chat_alias'),
        state: utils.getText(resp, 'state'),
    };

    utils.logMessage(
        LOG_LEVELS.DEBUG,
        'Chat-Room-State update packet received for room #' +
            formattedResponse.roomId,
        response
    );
    return formattedResponse;
};

/** Deprecated */
var ChatSendRequest = function (roomId, message) {
    this.roomId = roomId;
    this.message = message;
};

/*
 * This class is responsible for creating the CHAT message packet and sending
 * it to IntelliServices.
 *
 * {"ui_request":{
 *      "@destination":"IS",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"CHAT",
 *      "room_id":{"#text":""}
 *      "message":{"#text":""}
 *    }
 * }
 */
ChatSendRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IS',
            '@type': MESSAGE_TYPES.CHAT_SEND,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            room_id: {
                '#text': utils.toString(this.roomId),
            },
            message: {
                '#text': utils.toString(this.message),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling CHAT packets received from
 * IntelliServices.
 *
 * //PUBLIC
 * {"ui_request":{
 *      "@message_id":"",
 *      "@response_to":"",
 *      "@type":"CHAT",
 *      "room_type":"GROUP",
 *      "room_id":{"#text":""},
 *      "message":{"#text":""},
 *      "sender":{"#text":""},
 *      "sender_id":{"#text":""},
 *      "room_name":{"#text":""}
 *    }
 * }
 * -OR-
 * // PRIVATE
 * {"ui_request":{
 *      "@dynamic_create":"TRUE",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "@type":"CHAT",
 *      "room_type":"PRIVATE",
 *      "room_id":{"#text":""},
 *      "message":{"#text":""},
 *      "sender":{"#text":""},
 *      "room_name":{"#text":""}
 *    }
 * }
 */

ChatSendRequest.prototype.processResponse = function (response) {
    var resp = response.ui_request;
    var formattedResponse = {
        roomType: utils.getText(resp, 'room_type'),
        roomId: utils.getText(resp, 'room_id'),
        message: utils.getText(resp, 'message'),
        sender: utils.getText(resp, 'sender'),
        senderId: utils.getText(resp, 'sender_id'),
        roomName: utils.getText(resp, 'room_name'),
        dynamicCreate: utils.getText(resp, 'dynamic_create') === 'TRUE',
    };

    utils.logMessage(
        LOG_LEVELS.DEBUG,
        'New CHAT packet received from IntelliServices',
        response
    );

    return formattedResponse;
};

var ChatTypingRequest = function (uii, message) {
    this.uii = uii;
    this.message = message;
};

/*
 * External Chat:
 * Agent sends typing message to notify client widgets,
 * but the agent's pending message is not sent going this direction.
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-TYPING",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "uii":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "message":{"#text":""}
 *    }
 * }
 */
ChatTypingRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_TYPING,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            message: {
                '#text': utils.toString(this.message),
            },
        },
    };

    return JSON.stringify(msg);
};

var LeaveChatRequest = function (uii, agentId, sessionId) {
    this.uii = uii;
    this.agentId = agentId;
    this.sessionId = sessionId;
};

/*
 * External Chat:
 * Requests to terminate a chat session on an existing chat uii
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-DROP-SESSION",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "uii":{"#text":""},
 *      "agent_id":{"#text":""},
 *      "session_id":{"#text":""}
 *    }
 * }
 */
LeaveChatRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.LEAVE_CHAT,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            uii: {
                '#text': utils.toString(this.uii),
            },
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            session_id: {
                '#text': utils.toString(this.sessionId),
            },
        },
    };

    return JSON.stringify(msg);
};

var ChatManualSmsRequest = function (agentId, chatQueueId, ani, dnis, message) {
    this.agentId = agentId;
    this.chatQueueId = chatQueueId;
    this.ani = ani;
    this.dnis = dnis;
    this.message = message;
};

/*
 * External Chat:
 * When agent submits a manual sms message, send "MANUAL-SMS" request to IntelliQueue
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"MANUAL-SMS",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "agent_id":{"#text":"1995"},
 *      "chatQueueId":{"#text":"44"},
 *      "ani":{"#text":"1231231234"},
 *      "dnis":{"#text":"5435435432"},
 *      "message":{"#text":"hello"}
 *    }
 * }
 */
ChatManualSmsRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.CHAT_MANUAL_SMS,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(this.agentId),
            },
            chat_queue_id: {
                '#text': utils.toString(this.chatQueueId),
            },
            ani: {
                '#text': utils.toString(this.ani),
            },
            dnis: {
                '#text': utils.toString(this.dnis),
            },
            message: {
                '#text': utils.toString(this.message),
            },
        },
    };

    return JSON.stringify(msg);
};

var MonitorChatRequest = function (monitorAgentId) {
    this.monitorAgentId = monitorAgentId;
};

/*
 * External Chat:
 * Requests a new session on an existing chat uii
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-MONITOR",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "agent_id":{"#text":""},
 *      "monitor_agent_id":{"#text":""}
 *    }
 * }
 */
MonitorChatRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.MONITOR_CHAT,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            monitor_agent_id: {
                '#text': utils.toString(this.monitorAgentId),
            },
        },
    };

    return JSON.stringify(msg);
};

var StopMonitorChatRequest = function (monitorAgentId) {
    this.monitorAgentId = monitorAgentId || '';
};

/*
 * External Chat:
 * Requests a termination of a chat monitor session for an agent
 *
 * {"ui_request":{
 *      "@destination":"IQ",
 *      "@type":"CHAT-DROP-MONITORING-SESSION",
 *      "@message_id":"",
 *      "@response_to":"",
 *      "agent_id":{"#text":""},
 *      "monitor_agent_id":{"#text":""}
 *    }
 * }
 */
StopMonitorChatRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IQ',
            '@type': MESSAGE_TYPES.STOP_MONITOR_CHAT,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': UIModel.getInstance().agentSettings.agentId,
            },
            monitor_agent_id: {
                '#text': utils.toString(this.monitorAgentId),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * Process a CHAT-DROP-MONITORING-SESSION notification. Used to notify supervisor monitors that agent has logged out.
 *
 * {"ui_notification":{
 *      "@message_id":"IQ10012016080217135001344",
 *      "@response_to":"",
 *      "@type":"CHAT-DROP-MONITORING-SESSION",
 *      "monitored_agent_id":{"#text":"1"}
 *    }
 * }
 */
StopMonitorChatRequest.prototype.processResponse = function (data) {
    var notif = data.ui_notification;

    return { monitoredAgentId: utils.getText(notif, 'monitored_agent_id') };
};

/** Deprecated */
var SupervisorListRequest = function () {};

/*
 * This class is responsible for creating a packet to request a list of
 * supervisors from IntelliServices. This is used by the chat function so an
 * agent can grab a list of supervisors and then select one for a private chat.
 *
 * {"ui_request":{
 *      "@destination":"IS",
 *      "@message_id":"UI200809291036128",
 *      "@response_to":"",
 *      "@type":"SUPERVISOR-LIST",
 *      "agent_id":{"#text":""}
 *    }
 * }
 */
SupervisorListRequest.prototype.formatJSON = function () {
    var msg = {
        ui_request: {
            '@destination': 'IS',
            '@type': MESSAGE_TYPES.SUPERVISOR_LIST,
            '@message_id': utils.getMessageId(),
            '@response_to': '',
            agent_id: {
                '#text': utils.toString(
                    UIModel.getInstance().agentSettings.agentId
                ),
            },
        },
    };

    return JSON.stringify(msg);
};

/*
 * This class is responsible for handling the SUPERVISOR-LIST packet
 * rec'd from intelliservices. It will save a copy of this list in the
 * UIModel under a variable called "supervisors". Whenever a new list
 * is rec'd it is overwritten.
 *
 * {"ui_response":{
 *      "@message_id":"IQ982008082910361503344",
 *      "@response_to":"",
 *      "supervisor":[
 *          {"id":{"#text":""}, "fname":{"#text":""}, "lname":{"#text":""}, "uname":{"#text":""} }
 *          {"id":{"#text":""}, "fname":{"#text":""}, "lname":{"#text":""}, "uname":{"#text":""} }
 *      ]
 *    }
 * }
 */

SupervisorListRequest.prototype.processResponse = function (response) {
    var model = UIModel.getInstance();
    var tempList = utils.processResponseCollection(
        response,
        'ui_response',
        'supervisor'
    );
    var supervisors = [];

    for (var i = 0; i < tempList.length; i++) {
        var sup = tempList[i];
        supervisors.push({
            agentId: sup.id,
            firstName: sup.fname,
            lastName: sup.lname,
            username: sup.uname,
        });
    }

    utils.logMessage(
        LOG_LEVELS.DEBUG,
        'New supervisor list received ',
        supervisors
    );
    model.supervisors = supervisors;

    return model.supervisors;
};

var ChatClientReconnectNotification = function () {};

/*
 * External Chat:
 * This class is responsible for handling "CHAT-CLIENT-RECONNECT" packets from IntelliQueue.
 * This is sent when a chat connect message is sent to a non-archieved chat.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-CLIENT-RECONNECT",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "account_id":{"#text":"99999999"},
 *          "uii":{"#text":"201608161200240139000000000120"}
 *          "agent_id":{"#text":"1"}
 *      }
 *  }
 */

ChatClientReconnectNotification.prototype.processResponse = function (
    notification
) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification);

    formattedResponse.message = 'Received CHAT-CLIENT-RECONNECT notification';
    formattedResponse.status = 'OK';
    formattedResponse.accountId = utils.getText(notif, 'account_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.agentId = utils.getText(notif, 'agent_id');

    return formattedResponse;
};

var ChatActiveNotification = function () {};

/*
 * External Chat:
 * This class is responsible for handling "CHAT-ACTIVE" packets from IntelliQueue.
 * This is sent in response to an agent's CHAT-PRESENTED-RESPONSE accept request.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-ACTIVE",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "account_id":{"#text":"99999999"},
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "is_monitoring":{"#text":"TRUE"|"FALSE"},
 *          "chat_type":{"#text":"LEGACY"|"ENGAGE_DIGITAL"},
 * // the following properties only applicable for Engage Digital tasks
 *          "task_id":{"#text":"123"}, // only applicable for Engage Digital tasks
 *          "ed_thread_title" : {"#text":"Hello there!"},
 *          "ed_source_id":{"#text":"5ec6d788f3b1490008773a10"},
 *          "ed_source_type":{"#text":"email"},
 *          "ed_category_ids":{"#text": "5ec6b48ff3b14900087739eb,5ec6b4c2f3b14900087739f1,5f11dff7fcd72e0007c53b3e"},
 *          "ed_language_id":{"#text":"en"},
 *          "ed_author_screen_name":{"#text":"Joe Smith"},
 *          "ed_created_at":{"#text":"2022-10-28 02:34:23.827"},
 *          "session_id": { "#text": "2" },
 *          "segment_id": { "#text": "550e8400-e29b-41d4-a716-446655440000" },
 *          "summary": {"#text":"TRUE""},
 *      }
 *  }
 */
ChatActiveNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification, true);

    formattedResponse.message = 'Received CHAT-ACTIVE notification';
    formattedResponse.status = 'OK';
    formattedResponse.accountId = utils.getText(notif, 'account_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.isMonitoring = utils.getText(notif, 'is_monitoring');
    formattedResponse.sessionId = utils.getText(notif, 'session_id');
    formattedResponse.segmentId = utils.getText(notif, 'segment_id');
    formattedResponse.summary = utils.getText(notif, 'summary');

    return formattedResponse;
};

var ChatAgentAssignFailureNotification = function () {};

/*
 * This class is responsible for handling "CHAT-AGENT-ASSIGN-FAILURE" packets from IntelliQueue.
 * This is sent to the agent when the last session is disconnected from a chat.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-AGENT-ASSIGN-FAILURE",
 *          "@destination":"IQ",
 *          "operation_id":{"#text":"1234567890asdfghjklzxcvb"}, // 24 character hex string, only set for Engage Digital Tasks
 *          "account_id":{"#text":"99999999"},
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "task_id": {"#text":""}
 *      }
 *  }
 */

ChatAgentAssignFailureNotification.prototype.processResponse = function (
    notification
) {
    var notif = notification.ui_notification;

    var agentAssignFailure = utils.buildDefaultResponse(notification, true);
    agentAssignFailure.message =
        'Received CHAT-AGENT-ASSIGN-FAILURE notification';
    agentAssignFailure.status = 'OK';
    agentAssignFailure.uii = utils.getText(notif, 'uii');
    agentAssignFailure.taskId = utils.getText(notif, 'task_id');
    agentAssignFailure.accountId = utils.getText(notif, 'account_id');

    return agentAssignFailure;
};

var ChatCancelledNotification = function () {};

/*
 * External Chat:
 * This class is responsible for processing "CHAT-CANCELLED" packets from IntelliQueue.
 * If an agent is presented a chat and doesn't respond before the timeout, the CHAT-CANCELLED
 * message is sent from IQ.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-CANCELLED",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "account_id":{"#text":"99999999"},
 *          "operation_id":{"#text":"1234567890asdfghjklzxcvb"},
 *          "uii":{"#text":"201608161200240139000000000120"}
 *      }
 *  }
 */
ChatCancelledNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification, true);

    formattedResponse.message = 'Received CHAT-CANCELLED notification';
    formattedResponse.status = 'OK';
    formattedResponse.messageId = notif['@message_id'];
    formattedResponse.accountId = utils.getText(notif, 'account_id');
    formattedResponse.uii = utils.getText(notif, 'uii');

    return formattedResponse;
};

var ChatInactiveNotification = function () {};

/*
 * External Chat:
 * This class is responsible for handling "CHAT-INACTIVE" packets from IntelliQueue.
 * This is sent to the agent when the last session is disconnected from a chat.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-INACTIVE",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "operation_id":{"#text":"1234567890asdfghjklzxcvb"}, // 24 character hex string, only set for Engage Digital Tasks
 *          "account_id":{"#text":"99999999"},
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "disposition_timeout":{"#text":"30"},
 *          "dequeue_agent_id":{"#text":"123"},
 *          "chat_type":{"#text":"LEGACY"|"ENGAGE_DIGITAL"},
 * * // the following properties only applicable for Engage Digital tasks
 *          "task_id":{"#text":"123"}, // only applicable for Engage Digital tasks
 *          "ed_thread_title" : {"#text":"Hello there!"},
 *          "ed_source_id":{"#text":"5ec6d788f3b1490008773a10"},
 *          "ed_source_type":{"#text":"email"},
 *          "ed_category_ids":{"#text": "5ec6b48ff3b14900087739eb,5ec6b4c2f3b14900087739f1,5f11dff7fcd72e0007c53b3e"},
 *          "ed_language_id":{"#text":"en"},
 *          "ed_author_screen_name":{"#text":"Joe Smith"},
 *          "ed_created_at":{"#text":"2022-10-28 02:34:23.827"},
 *      }
 *  }
 */
ChatInactiveNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification, true);

    formattedResponse.message = 'Received CHAT-INACTIVE notification';
    formattedResponse.status = 'OK';
    formattedResponse.accountId = utils.getText(notif, 'account_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.dispositionTimeout = utils.getText(
        notif,
        'disposition_timeout'
    );
    formattedResponse.dequeueAgentId = utils.getText(notif, 'dequeue_agent_id');

    return formattedResponse;
};

var ChatPresentedNotification = function () {};

/*
 * External Chat:
 * This class is responsible for handling "CHAT-PRESENTED" packets from IntelliQueue.
 * When this notification is received, the Agent can either Accept or Decline which will
 * be sent back to IntelliQueue as a CHAT-PRESENTED-RESPONSE.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-PRESENTED",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "operation_id:{"#text":"1234567890asdfghjklzxcvb"} // 24 character hex string, only set for Engage Digital Tasks
 *          "chat_queue_id":{"#text":"3"},
 *          "chat_queue_name":{"#text":"Support Chat"},
 *          "account_id":{"#text":"99999999"},
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "channel_type":{"#text":"email"},
 *          "chat_type":{"#text":"email"},
 *          "allow_accept":{"#text":"TRUE|FALSE"},
 *          "is_reconnect":{"#text":"TRUE|FALSE"},
 * * // the following properties only applicable for Engage Digital tasks
 *          "task_id":{"#text":"123"},
 *          "ed_thread_title" : {"#text":"Hello there!"},
 *          "ed_source_id":{"#text":"5ec6d788f3b1490008773a10"},
 *          "ed_source_type":{"#text":"email"},
 *          "ed_category_ids":{"#text": "5ec6b48ff3b14900087739eb,5ec6b4c2f3b14900087739f1,5f11dff7fcd72e0007c53b3e"},
 *          "ed_language_id":{"#text":"en"},
 *          "ed_author_screen_name":{"#text":"Joe Smith"},
 *          "ed_created_at":{"#text":"2022-10-28 02:34:23.827"},
 *      }
 *  }
 */
ChatPresentedNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var edSourceId = utils.getText(notif, 'ed_source_id');
    var edLanguageId = utils.getText(notif, 'ed_language_id');
    var edCategoryIds = utils.getText(notif, 'ed_category_ids').split(',');
    var taskId = utils.getText(notif, 'task_id');
    var model = UIModel.getInstance();
    var edSourceName = '';
    var edSourceColor = 0;
    var edLanguage = '';
    var edCategories = [];
    var processedResponse;
    var instance = model.libraryInstance;

    if (taskId) {
        /*
         * look in cached values to see if we have ED info already loaded
         * if not then chat will be presented with blank values (edSourceName,edSourceColor,edLanguage,edCategories)
         * */

        var mainAccountId = model.authenticateRequest.mainAccountId;
        var sourceList = model.applicationSettings.edSources[mainAccountId];
        var languageList = model.applicationSettings.edLanguages[mainAccountId];
        var categoryList =
            model.applicationSettings.edCategories[mainAccountId];

        var sourceCache = utils.getEdValue(sourceList, edSourceId);
        var languageCache = utils.getEdValue(languageList, edLanguageId);
        var categoryCache = utils.getMultiEdValues(categoryList, edCategoryIds);
        // all values cached
        edSourceName = sourceCache.name;
        edSourceColor = sourceCache.color;
        edLanguage = languageCache.name;
        edCategories = categoryCache.names;

        processedResponse = _buildPresentedResponse(
            notification,
            edSourceName,
            edSourceColor,
            edLanguage,
            edCategories
        );
        utils.fireCallback(
            instance,
            CALLBACK_TYPES.CHAT_PRESENTED,
            processedResponse
        );
        return processedResponse; // for testing
    } else {
        // not task
        processedResponse = _buildPresentedResponse(
            notification,
            edSourceName,
            edSourceColor,
            edLanguage,
            edCategories
        );
        utils.fireCallback(
            instance,
            CALLBACK_TYPES.CHAT_PRESENTED,
            processedResponse
        );
        return processedResponse; // for testing
    }
};

function _buildPresentedResponse(
    notification,
    edSourceName,
    edSourceColor,
    edLanguage,
    edCategories
) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification, true);

    formattedResponse.message = 'Received CHAT-PRESENTED notification';
    formattedResponse.status = 'OK';
    formattedResponse.messageId = notif['@message_id'];
    formattedResponse.accountId = utils.getText(notif, 'account_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.channelType = utils.getText(notif, 'channel_type');
    formattedResponse.taskId = utils.getText(notif, 'task_id');
    formattedResponse.chatQueueId = utils.getText(notif, 'chat_queue_id');
    formattedResponse.chatQueueName = utils.getText(notif, 'chat_queue_name');
    formattedResponse.allowAccept = utils.getText(notif, 'allow_accept');
    formattedResponse.isReconnect = utils.getText(notif, 'is_reconnect');
    formattedResponse.edAuthorScreenName = utils.getText(
        notif,
        'ed_author_screen_name'
    );
    formattedResponse.edCreatedAt = utils.getText(notif, 'ed_created_at');
    formattedResponse.edSourceName = edSourceName;
    formattedResponse.sourceColor = edSourceColor;
    formattedResponse.edLanguage = edLanguage;
    formattedResponse.edCategories = edCategories;

    if (utils.getText(notif, 'chat_type') !== '') {
        formattedResponse.chatType = utils.getText(notif, 'chat_type');
    } else {
        formattedResponse.chatType = 'LEGACY';
    }
    return formattedResponse;
}

var ChatTypingNotification = function () {};

/*
 * External Chat:
 * This class is responsible for handling "CHAT-TYPING" packets from IntelliQueue.
 * When this notification is received, the AgentUI will show the pending message
 * so far from the client chat widget and typing notification.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"CHAT-TYPING",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "account_id":{"#text":"99999999"},
 *          "from":{"#text":""},
 *          "message":{"#text":"this is the message before actual send"}
 *          "dequeue_agent_id":{"#text":"123"}
 *      }
 *  }
 */
ChatTypingNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var formattedResponse = utils.buildDefaultResponse(notification);

    formattedResponse.message = 'Received CHAT-TYPING notification';
    formattedResponse.status = 'OK';
    formattedResponse.accountId = utils.getText(notif, 'account_id');
    formattedResponse.uii = utils.getText(notif, 'uii');
    formattedResponse.from = utils.getText(notif, 'from');
    formattedResponse.type = utils.getText(notif, 'type');
    formattedResponse.pendingMessage = utils.getText(notif, 'message');
    formattedResponse.dequeueAgentId = utils.getText(notif, 'dequeue_agent_id');

    return formattedResponse;
};

var LoadMediaNotification = function () {};

/*
 * Engage Digital Chat:
 * This class is responsible for handling "LOAD-MEDIA" packets from IntelliQueue.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"LOAD-MEDIA",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "task_id":{"#text":""}
 *          "operation_id":{"#text":""}
 *          "account_id":{"#text":"99999999"},
 *          "session_id":{"#text":"2"},
 *          "agent_id":{"#text":"1180958"},
 *          "queue_dts":{"#text":""},
 *          "queue_time":{"#text":""},
 *          "chat_queue_id":{"#text":""},
 *          "chat_queue_name":{"#text":""},
 *          "chat_requeue_type" : {"#text":""}
 *          "channel_type":{"#text":"ENGAGE-DIGITAL"},
 *          "idle_timeout":{"#text":""},
 *          "chat_dispositions":{
 *              "disposition":[
 *                  { "@disposition_id":"2", "@is_success":"true", "@is_complete":"false", "@is_default"="0", "@email_template_id":"1", "#text":"Complete"},
 *                  { "@disposition_id":"3", "@is_success":"true", "@is_complete":"false", "@is_default"="0", "#text":"Requeue"}
 *              ]
 *          },
 *          "chat_requeue_shortcuts" :{
 *              shortcut : [
 *                {@chat_requeue_shortcut_id:"3", @name:"test", @rank:"1",@requeue_chat_queue_id:"74",@skill_id:""}
 *              ]
 *          }
 *      }
 *  }
 */
LoadMediaNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;

    var dts = utils.getText(notif, 'queue_dts');
    dts = new Date(dts.replace(' ', 'T'));

    var newTask = utils.buildDefaultResponse(notification, true);

    newTask.message = 'Received LOAD-MEDIA notification';
    newTask.status = 'OK';
    newTask.uii = utils.getText(notif, 'uii');
    newTask.taskId = utils.getText(notif, 'task_id');
    newTask.accountId = utils.getText(notif, 'account_id');
    newTask.sessionId = utils.getText(notif, 'session_id');
    newTask.agentId = utils.getText(notif, 'agent_id');
    newTask.queueDts = dts;
    newTask.queueTime = utils.getText(notif, 'queue_time');
    newTask.chatQueueId = utils.getText(notif, 'chat_queue_id');
    newTask.chatQueueName = utils.getText(notif, 'chat_queue_name');
    newTask.chatRequeueType = utils.getText(notif, 'chat_requeue_type');
    newTask.channelType = utils.getText(notif, 'channel_type');
    newTask.idleTimeout = utils.getText(notif, 'idle_timeout');

    newTask.requeueShortcuts = utils.processResponseCollection(
        notification,
        'ui_notification',
        'chat_requeue_shortcuts',
        'shortcut'
    )[0];
    newTask.chatDispositions = utils.processResponseCollection(
        notification,
        'ui_notification',
        'chat_dispositions',
        'disposition'
    )[0];

    if (newTask.chatDispositions && newTask.chatDispositions.disposition) {
        newTask.chatDispositions.dispositions = [newTask.chatDispositions];
    } else {
        newTask.chatDispositions = newTask.chatDispositions.dispositions;
    }

    // convert numbers to boolean
    if (newTask.chatDispositions) {
        for (var d = 0; d < newTask.chatDispositions.length; d++) {
            var disp = newTask.chatDispositions[d];
            disp.isComplete = disp.isComplete === '1';
            disp.isSuccess = disp.isSuccess === '1';
            disp.isDefault = disp.isDefault === '1';
        }
    }

    // Build token map
    newTask.baggage = buildTaskTokenMap(newTask);

    return newTask;
};

function buildTaskTokenMap(newTask) {
    var tokens = {};
    var model = UIModel.getInstance();

    try {
        tokens['chatQueueId'] = newTask.chatQueueId;
        tokens['chatQueueName'] = newTask.chatQueueName;
        tokens['uii'] = newTask.uii;
    } catch (any) {
        console.error(
            'There was an error parsing chat tokens for basic chat info. ',
            any
        );
    }

    try {
        tokens['agentFirstName'] = model.agentSettings.firstName;
        tokens['agentLastName'] = model.agentSettings.lastName;
        tokens['agentExternalId'] = model.agentSettings.externalAgentId;
        tokens['agentType'] = model.agentSettings.agentType;
        tokens['agentEmail'] = model.agentSettings.email;
        tokens['agentUserName'] = model.agentSettings.username;
    } catch (any) {
        console.error(
            'There was an error parsing chat tokens for agent info. ',
            any
        );
    }

    return tokens;
}

var NewChatNotification = function () {};

/*
 * External Chat:
 * This class is responsible for handling "NEW-CHAT" packets from IntelliQueue.
 *
 *  {
 *      "ui_notification":{
 *          "@message_id":"IQ10012016081611595000289",
 *          "@type":"NEW-CHAT",
 *          "@destination":"IQ",
 *          "@response_to":"",
 *          "uii":{"#text":"201608161200240139000000000120"},
 *          "account_id":{"#text":"99999999"},
 *          "session_id":{"#text":"2"},
 *          "agent_id":{"#text":"1180958"},
 *          "queue_dts":{"#text":""},
 *          "queue_time":{"#text":""},
 *          "chat_queue_id":{"#text":""},
 *          "chat_queue_name":{"#text":""},
 *          "chat_requeue_type" : {"#text":""}
 *          "app_url":{"#text":""},
 *          "channel_type":{"#text":""},
 *          "ani":{"#text":""},
 *          "dnis":{"#text":""},
 *          "survey_pop_type":{"#text":""},
 *          "script_id":{"#text":""},
 *          "script_version":{"#text":""},
 *          "idle_timeout":{"#text":""},
 *          "is_monitoring":{#text":"TRUE"|"FALSE"},
 *          "monitored_agent_id":{"#text":"123"| ""} <-- only populated if is_monitoring == TRUE
 *          "chat_type": {#text: "LEGACY"|"ENGAGE_DIGITAL"},
 *          "chat_dispositions":{
 *              "disposition":[
 *                  { "@disposition_id":"2", "@is_success":"true", "@is_complete":"false", "@is_default"="0", "@email_template_id":"1", "#text":"Complete"},
 *                  { "@disposition_id":"3", "@is_success":"true", "@is_complete":"false", "@is_default"="0", "#text":"Requeue"}
 *              ]
 *          },
 *          "chat_requeue_shortcuts" :{
 *              shortcut : [
 *                {@chat_requeue_shortcut_id:"3", @name:"test", @rank:"1",@requeue_chat_queue_id:"74",@skill_id:""}
 *              ]
 *          }
 *          "transcript":{
 *              "message":[
 *                  { "@from":"system", "@type":"SYSTEM", "@whisper":"FALSE", "@dts":"yyyy-MM-dd HH:mm:ss", "#text":"User1 connected"},
 *                  { "@from":"dlbooks", "@type":"AGENT", "@whisper":"FALSE", "@dts":"yyyy-MM-dd HH:mm:ss", "#text":"Hello"},
 *                  { "@from":"user1", "@type":"CLIENT", "@whisper":"FALSE", "@dts":"yyyy-MM-dd HH:mm:ss", "#text":"Hi"}
 *              ]
 *          },
 *          "json_baggage":{"#text":"json_string_form_data"}, <--- pre-form chat data
 * // the following properties only applicable for Engage Digital tasks
 *          "task_id":{#text":"123456"} <-- only present if not empty value
 *          "ed_thread_title" : {"#text":"Hello there!"},
 *          "ed_source_id" : {"#text":"1234"},
 *          "ed_source_type":{"#text":"email"},
 *          "ed_category_ids":{"#text": "5ec6b48ff3b14900087739eb,5ec6b4c2f3b14900087739f1,5f11dff7fcd72e0007c53b3e"},
 *          "ed_language_id" : {"#text":"2345"},
 *          "ed_author_screen_name" : {"#text":""},
 *          "ed_created_at" : {"#text":"2022-10-28 02:34:23.827"}
 *      }
 *  }
 */
NewChatNotification.prototype.processResponse = function (notification) {
    var notif = notification.ui_notification;
    var model = UIModel.getInstance();
    var dts = utils.getText(notif, 'queue_dts');
    dts = new Date(dts.replace(' ', 'T'));
    var edSourceId = utils.getText(notif, 'ed_source_id');
    var edLanguageId = utils.getText(notif, 'ed_language_id');
    var edCategoryIds = utils.getText(notif, 'ed_category_ids').split(',');

    var newChat = utils.buildDefaultResponse(notification);
    newChat.message = 'Received NEW-CHAT notification';
    newChat.status = 'OK';
    newChat.uii = utils.getText(notif, 'uii');
    newChat.accountId = utils.getText(notif, 'account_id');
    newChat.sessionId = utils.getText(notif, 'session_id');
    newChat.agentId = utils.getText(notif, 'agent_id');
    newChat.queueDts = dts;
    newChat.queueTime = utils.getText(notif, 'queue_time');
    newChat.chatQueueId = utils.getText(notif, 'chat_queue_id');
    newChat.chatQueueName = utils.getText(notif, 'chat_queue_name');
    newChat.chatRequeueType = utils.getText(notif, 'chat_requeue_type');
    newChat.appUrl = utils.getText(notif, 'app_url');
    newChat.channelType = utils.getText(notif, 'channel_type');
    newChat.ani = utils.getText(notif, 'ani');
    newChat.dnis = utils.getText(notif, 'dnis');
    newChat.surveyPopType = utils.getText(notif, 'survey_pop_type');
    newChat.scriptId = utils.getText(notif, 'script_id');
    newChat.scriptVersion = utils.getText(notif, 'script_version');
    newChat.idleTimeout = utils.getText(notif, 'idle_timeout');
    newChat.isMonitoring = utils.getText(notif, 'is_monitoring');
    newChat.monitoredAgentId = utils.getText(notif, 'monitored_agent_id');
    newChat.preChatData = utils.getText(notif, 'json_baggage');
    newChat.taskId = utils.getText(notif, 'task_id');
    newChat.chatType = utils.getText(notif, 'chat_type');
    newChat.edThreadTitle = utils.getText(notif, 'ed_thread_title');
    newChat.edAuthorScreenName = utils.getText(notif, 'ed_author_screen_name');
    newChat.edCreatedAt = utils.getText(notif, 'ed_created_at');
    newChat.edSourceName = '';
    newChat.sourceColor = 0;
    newChat.edLanguage = '';
    newChat.edCategories = [];

    newChat.requeueShortcuts = utils.processResponseCollection(
        notification,
        'ui_notification',
        'chat_requeue_shortcuts',
        'shortcut'
    )[0];
    newChat.chatDispositions = utils.processResponseCollection(
        notification,
        'ui_notification',
        'chat_dispositions',
        'disposition'
    )[0];
    newChat.transcript = utils.processResponseCollection(
        notification,
        'ui_notification',
        'transcript',
        'message'
    )[0];
    newChat.baggage = utils.processResponseCollection(
        notification,
        'ui_notification',
        'json_baggage'
    )[0];

    if (newChat.chatDispositions && newChat.chatDispositions.disposition) {
        newChat.chatDispositions.dispositions = [newChat.chatDispositions];
    } else {
        newChat.chatDispositions = newChat.chatDispositions.dispositions;
    }

    if (newChat.transcript && newChat.transcript.message) {
        newChat.transcript = [newChat.transcript];
    } else {
        newChat.transcript = newChat.transcript.messages;
    }

    if (newChat.preChatData) {
        try {
            newChat.preChatData = JSON.parse(newChat.preChatData);
        } catch (err) {
            utils.logMessage(
                LOG_LEVELS.ERROR,
                'Error parsing the pre-form chat data.',
                notif
            );
        }
    }

    // convert numbers to boolean
    if (newChat.chatDispositions) {
        for (var d = 0; d < newChat.chatDispositions.length; d++) {
            var disp = newChat.chatDispositions[d];
            disp.isComplete = disp.isComplete === '1';
            disp.isSuccess = disp.isSuccess === '1';
            disp.isDefault = disp.isDefault === '1';
        }
    }

    // convert dates
    if (newChat.transcript) {
        for (var t = 0; t < newChat.transcript.length; t++) {
            var msg = newChat.transcript[t];
            if (msg.dts) {
                msg.dts = new Date(msg.dts.replace(' ', 'T'));
            }
        }
    }

    // Build token map
    newChat.baggage = buildChatTokenMap(notif, newChat);

    if (newChat.chatType === CHAT_TYPE.ENGAGE_DIGITAL) {
        /*
         * look in cached values to see if we have ED info already loaded
         * if not then chat will be presented with blank values (edSourceName,edSourceColor,edLanguage,edCategories)
         * */

        var mainAccountId = model.authenticateRequest.mainAccountId;
        var sourceList = model.applicationSettings.edSources[mainAccountId];
        var languageList = model.applicationSettings.edLanguages[mainAccountId];
        var categoryList =
            model.applicationSettings.edCategories[mainAccountId];

        var sourceCache = utils.getEdValue(sourceList, edSourceId);
        var languageCache = utils.getEdValue(languageList, edLanguageId);
        var categoryCache = utils.getMultiEdValues(categoryList, edCategoryIds);

        newChat.edSourceName = sourceCache.isCached
            ? sourceCache.name
            : newChat.edSourceName;
        newChat.sourceColor = sourceCache.isCached
            ? sourceCache.color
            : newChat.sourceColor;
        newChat.edLanguage = languageCache.isCached
            ? languageCache.name
            : newChat.edLanguage;
        newChat.edCategories = categoryCache.isCached
            ? categoryCache.names
            : newChat.edCategories;
    }

    return newChat;
};

function buildChatTokenMap(notif, newChat) {
    var tokens = {};
    var model = UIModel.getInstance();

    if (newChat.preChatData) {
        for (var prop in newChat.preChatData) {
            if (newChat.preChatData.hasOwnProperty(prop)) {
                tokens[prop] = newChat.preChatData[prop];
            }
        }
    }

    try {
        tokens['chatQueueId'] = newChat.chatQueueId;
        tokens['chatQueueName'] = newChat.chatQueueName;
        tokens['ani'] = newChat.ani;
        tokens['dnis'] = newChat.dnis;
        tokens['uii'] = newChat.uii;
    } catch (any) {
        console.error(
            'There was an error parsing chat tokens for basic chat info. ',
            any
        );
    }

    try {
        tokens['agentFirstName'] = model.agentSettings.firstName;
        tokens['agentLastName'] = model.agentSettings.lastName;
        tokens['agentExternalId'] = model.agentSettings.externalAgentId;
        tokens['agentType'] = model.agentSettings.agentType;
        tokens['agentEmail'] = model.agentSettings.email;
        tokens['agentUserName'] = model.agentSettings.username;
    } catch (any) {
        console.error(
            'There was an error parsing chat tokens for agent info. ',
            any
        );
    }

    return tokens;
}

var AgentStats = function () {};

/*
 * This class is responsible for handling an Agent Stats packet rec'd from IntelliServices.
 * It will save a copy of it in the UIModel. Could be a single agent or array of agents.
 *
  {"ui_stats":{
       "@type":"AGENT",
       "agent":{
           "@alt":"INBOUND",
           "@atype":"AGENT",
           "@avgtt":"00.0",
           "@calls":"0",
           "@da":"0",
           "@droute":"6789050673",
           "@f":"John",
           "@gdesc":"",
           "@gname":"",
           "@id":"1856",
           "@l":"Doe",
           "@ldur":"6",
           "@ltype":"INBOUND",
           "@oh":"0",
           "@pd":"0",
           "@pdt":"0",
           "@pres":"0",
           "@rna":"0",
           "@sdur":"6",
           "@sp":"",
           "@state":"AVAILABLE",
           "@ttt":"0",
           "@u":"jdoe",
           "@uii":"",
           "@util":"0.00",
           "@call_duration":"0",
           "@chat_state":"CHAT-ENGAGED",
           "@current_chats_count":"0",
           "@chats_handled":"0",
           "@total_chats_time":"100", // seconds
       }
     }
  }
 */
AgentStats.prototype.processResponse = function (stats) {
    var resp = stats.ui_stats.agent;
    var agentStats = [];

    if (!Array.isArray(resp)) {
        resp = [resp];
    }

    try {
        for (var i = 0; i < resp.length; i++) {
            agentStats.push({
                agentLoginType: resp[i]['@alt'],
                agentType: resp[i]['@atype'],
                avgTalkTime: resp[i]['@avgtt'],
                calls: resp[i]['@calls'],
                isDequeueAgent: resp[i]['@da'],
                defaultRoute: resp[i]['@droute'],
                firstName: resp[i]['@f'],
                queueDesc: resp[i]['@gdesc'],
                queueName: resp[i]['@gname'],
                agentId: resp[i]['@id'],
                lastName: resp[i]['@l'],
                loginDuration: resp[i]['@ldur'],
                loginType: resp[i]['@ltype'],
                offHook: resp[i]['@oh'],
                pendingDisp: resp[i]['@pd'],
                pendingDispTime: resp[i]['@pdt'],
                presented: resp[i]['@pres'],
                rna: resp[i]['@rna'],
                stateDuration: resp[i]['@sdur'],
                skillProfileName: resp[i]['@sp'],
                agentState: resp[i]['@state'],
                totalTalkTime: resp[i]['@ttt'],
                username: resp[i]['@u'],
                uii: resp[i]['@uii'],
                utilization: resp[i]['@util'],
                callDuration: resp[i]['@call_duration'],
                chatState: resp[i]['@chat_state'],
                currentChatCount: resp[i]['@current_chats_count'],
                chatsHandled: resp[i]['@chats_handled'],
                totalChatTime: resp[i]['@total_chats_time'],
            });
        }
    } catch (e) {
        // do nothing with err
    }

    UIModel.getInstance().agentStats = agentStats;
    return agentStats;
};

var AgentDailyStats = function () {};

/*
 * This class is responsible for handling an Agent Daily Stats packet rec'd from IntelliServices.
 * It will save a copy of it in the UIModel.
 *
 * {"ui_stats":{
 *      "@type":"AGENTDAILY",
 *      "agent_id":{"#text":"1180723"},
 *      "total_login_sessions":{"#text":"1"},
 *      "total_calls_handled":{"#text":"0"},
 *      "total_preview_dials":{"#text":"0"},
 *      "total_manual_dials":{"#text":"0"},
 *      "total_rna":{"#text":"0"},
 *      "total_talk_time":{"#text":"0"},
 *      "total_offhook_time":{"#text":"0"},
 *      "total_login_time":{"#text":"7808"},
 *      "total_success_dispositions":{"#text":"0"}
 *    }
 * }
 */
AgentDailyStats.prototype.processResponse = function (stats) {
    var model = UIModel.getInstance().agentDailyStats;
    var resp = stats.ui_stats;

    model.agentId = utils.getText(resp, 'agent_id');
    model.totalLoginSessions = utils.getText(resp, 'total_login_sessions');
    model.totalChatsHandled = utils.getText(resp, 'total_chats_handled');
    model.totalCallsHandled = utils.getText(resp, 'total_calls_handled');
    model.totalPreviewDials = utils.getText(resp, 'total_preview_dials');
    model.totalManualDials = utils.getText(resp, 'total_manual_dials');
    model.totalRna = utils.getText(resp, 'total_rna');
    model.totalSuccessDispositions = utils.getText(
        resp,
        'total_success_dispositions'
    );
    model.totalLoginTime = utils.getText(resp, 'total_login_time');
    model.totalTalkTime = utils.getText(resp, 'total_talk_time');

    if (!model.currCallTime) {
        // init daily stats to first stats packet if they don't exist
        model.totalOffhookTime = utils.getText(resp, 'total_offhook_time');
        model.currCallTime = '0';
    }

    return model;
};

var CampaignStats = function () {};

/*
 * This class is responsible for handling a Campaign Stats packet rec'd from IntelliServices.
 * It will save a copy of it in the UIModel.
 *
 * {"ui_stats":{
 *      "@type":"CAMPAIGN",
 *      "campaign":[
 *          {
 *              "@a":"0","@aba":"0","@an":"0","@av":"0","@b":"0","@c":"1","@e":"0","@f":"0",
 *              "@id":"60275","@int":"0","@m":"0","@na":"0","@name":"Test Campaign",
 *              "@p":"0","@r":"1","@s":"0","@tc":"0","@ttt":"0"
 *          },
 *          {
 *              "@a":"0","@aba":"0","@an":"0","@av":"0","@b":"0","@c":"0","@e":"0","@f":"0",
 *              "@id":"60293","@int":"0","@m":"0","@na":"0","@name":"Test Campaign w\\ Search",
 *              "@p":"0","@r":"19","@s":"0","@tc":"0","@ttt":"0"
 *          }
 *     ],
 *     "totals":{
 *          "noanswer":{"#text":"0"},
 *          "totalConnects":{"#text":"0"},
 *          "pending":{"#text":"0"},
 *          "active":{"#text":"0"},
 *          "error":{"#text":"0"},
 *          "totalTalkTime":{"#text":"0"},
 *          "answer":{"#text":"0"},
 *          "abandon":{"#text":"0"},
 *          "ready":{"#text":"20"},
 *          "machine":{"#text":"0"},
 *          "intercept":{"#text":"0"},
 *          "busy":{"#text":"0"},
 *          "complete":{"#text":"1"},
 *          "fax":{"#text":"0"}
 *     }
 *   }
 * }
 */
CampaignStats.prototype.processResponse = function (stats) {
    var resp = stats.ui_stats;
    var totals = utils.processResponseCollection(
        stats,
        'ui_stats',
        'totals'
    )[0];
    var campaigns = [];
    var campRaw = null;

    if (!Array.isArray(resp.campaign)) {
        resp.campaign = [resp.campaign];
    }

    for (var c = 0; c < resp.campaign.length; c++) {
        campRaw = resp.campaign[c];

        if (campRaw == null) {
            continue;
        }

        campaigns.push({
            active: campRaw['@a'],
            abandon: campRaw['@aba'],
            answer: campRaw['@an'],
            available: campRaw['@av'],
            busy: campRaw['@b'],
            complete: campRaw['@c'],
            error: campRaw['@e'],
            fax: campRaw['@f'],
            campaignId: campRaw['@id'],
            intercept: campRaw['@int'],
            machine: campRaw['@m'],
            noanswer: campRaw['@na'],
            campaignName: campRaw['@name'],
            pending: campRaw['@p'],
            ready: campRaw['@r'],
            staffed: campRaw['@s'],
            totalConnects: campRaw['@tc'],
            totalTalkTime: campRaw['@ttt'],
        });
    }

    var campaignStats = {
        type: resp['@type'],
        campaigns: campaigns,
        totals: totals,
    };

    UIModel.getInstance().campaignStats = campaignStats;

    return campaignStats;
};

var ChatQueueStats = function () {};

/*
 * This class is responsible for handling an Chat Stats packet rec'd from IntelliServices.
 * It will save a copy of it in the UIModel.
 *
 *{
 *  "ui_stats": {
 *  "@type": "CHAT",
 *  "chatQueue": [
 *      {
 *          "@active": "1",
 *          "@available": "0",
 *          "@avgAbandon": "00.0",
 *          "@avgChatTime": "00.0",
 *          "@avgQueueTime": "00.0",
 *          "@chatQueueId": "1",
 *          "@chatQueueName": "testing chat quuee",
 *          "@deflected": "0",
 *          "@inQueue": "0",
 *          "@longestInQueue": "0",
 *          "@presented": "0",
 *          "@routing": "0",
 *          "@staffed": "0",
 *          "@totalAbandonTime": "0",
 *          "@totalAnswerTime": "0",
 *          "@totalChatTime": "0",
 *          "@totalQueueTime": "0",
 *          "@utilization": "00.0"
 *      },
 *      {
 *          "@active": "0",
 *          "@available": "0",
 *          "@avgAbandon": "00.0",
 *          "@avgChatTime": "00.0",
 *          "@avgQueueTime": "00.0",
 *          "@chatQueueId": "3",
 *          "@chatQueueName": "testing test",
 *          "@deflected": "0",
 *          "@inQueue": "0",
 *          "@longestInQueue": "0",
 *          "@presented": "0",
 *          "@routing": "0",
 *          "@staffed": "0",
 *          "@totalAbandonTime": "0",
 *          "@totalAnswerTime": "0",
 *          "@totalChatTime": "0",
 *          "@totalQueueTime": "0",
 *          "@utilization": "00.0"
 *      }
 *  ],
 *  "totals": {
 *      "routing": {"#text": "0"},
 *      "ttotalAnswerTime": {"#text": "0"},
 *      "inQueue": { "#text": "0"},
 *      "ttotalChatTime": {"#text": "0"},
 *      "ttotalAbandonTime": {"#text": "0"},
 *      "presented": {"#text": "0},
 *      "accepted": {"#text": "0"},
 *      "deflected": {"#text": "0"},
 *      "active": {"#text": "1"},
 *      "abandoned": {"#text": "0"},
 *      "ttotalQueueTime": {"#text": "0"}
 *   }
 *  }
 *}
 */
ChatQueueStats.prototype.processResponse = function (stats) {
    var resp = stats.ui_stats;
    var totals = utils.processResponseCollection(
        stats,
        'ui_stats',
        'totals'
    )[0];
    var chatQueues = utils.processResponseCollection(
        stats,
        'ui_stats',
        'chatQueue'
    );

    var chatQueueStats = {
        type: resp['@type'],
        chatQueues: chatQueues,
        totals: totals,
    };

    UIModel.getInstance().chatQueueStats = chatQueueStats;

    return chatQueueStats;
};

var QueueStats = function () {};

/*
 * This class is responsible for handling an Queue Stats packet rec'd from IntelliServices.
 * It will save a copy of it in the UIModel.
 *
 * {
 *   "ui_stats":{
 *       "@type":"GATE",
 *       "gate":{
 *           "@aba":"0","@active":"0","@ans":"0","@asa":"00.0","@avail":"2",
 *           "@avga":"00.0","@avgq":"00.0","@avgt":"00.0","@def":"0","@id":"12126",
 *           "@inq":"0","@long_c":"0","@longq":"0","@name":"Cris inbound",
 *           "@pres":"0","@route":"0","@short_aba":"0","@short_c":"0","@sla":"100.0",
 *           "@sla_f":"0","@sla_p":"0","@staff":"2","@t_aba":"0","@t_q":"0","@t_soa":"0","@util":"00.0"
 *       },
 *       "totals":{
 *           "inQueue":{"#text":"0"},
 *           "answered":{"#text":"0"},
 *           "totalABATime":{"#text":"0"},
 *           "active":{"#text":"0"},
 *           "longCall":{"#text":"0"},
 *           "shortCall":{"#text":"0"},
 *           "slaPass":{"#text":"0"},
 *           "totalQueueTime":{"#text":"0"},
 *           "routing":{"#text":"0"},
 *           "totalTalkTime":{"#text":"0"},
 *           "shortAbandon":{"#text":"0"},
 *           "presented":{"#text":"0"},
 *           "totalSOA":{"#text":"0"},
 *           "slaFail":{"#text":"0"},
 *           "deflected":{"#text":"0"},
 *           "abandoned":{"#text":"0"}
 *      }
 *   }
 * }
 */
QueueStats.prototype.processResponse = function (stats) {
    var resp = stats.ui_stats;
    var totals = utils.processResponseCollection(
        stats,
        'ui_stats',
        'totals'
    )[0];
    var queues = [];
    var gateRaw = {};

    if (!Array.isArray(resp.gate)) {
        resp.gate = [resp.gate];
    }

    for (var c = 0; c < resp.gate.length; c++) {
        gateRaw = resp.gate[c];
        if (gateRaw == null) {
            continue;
        }

        queues.push({
            abandon: gateRaw['@aba'],
            active: gateRaw['@active'],
            answer: gateRaw['@ans'],
            asa: gateRaw['@asa'],
            available: gateRaw['@avail'],
            avgAbandon: gateRaw['@avga'],
            avgQueue: gateRaw['@avgq'],
            avgTalk: gateRaw['@avgt'],
            deflected: gateRaw['@def'],
            queueId: gateRaw['@id'],
            inQueue: gateRaw['@inq'],
            longCall: gateRaw['@long_c'],
            longestInQueue: gateRaw['@longq'],
            queueName: gateRaw['@name'],
            presented: gateRaw['@pres'],
            routing: gateRaw['@route'],
            shortAbandon: gateRaw['@short_aba'],
            shortCall: gateRaw['@short_c'],
            sla: gateRaw['@sla'],
            slaPass: gateRaw['@sla_p'],
            slaFail: gateRaw['@sla_f'],
            staffed: gateRaw['@staff'],
            tAbandonTime: gateRaw['@t_aba'],
            tQueueTime: gateRaw['@t_q'],
            tSpeedOfAnswer: gateRaw['@t_soa'],
            utilization: gateRaw['@util'],
        });
    }

    var queueStats = {
        type: resp['@type'],
        queues: queues,
        totals: totals,
    };

    UIModel.getInstance().queueStats = queueStats;

    return queueStats;
};

var SupervisorStats = function () {};

/* test
 * This class is responsible for handling a Supervisor Stats packet rec'd from IntelliServices.
 * It will save a copy of it in the UIModel. Will contain stats for agents supervised by logged in agent.
 * Could be a single agent or array of agents.
 *
 {
    "ui_stats":{
        "@type": "SUPERVISOR",
        "agents": [
          {
            "@agentLoginType":"INBOUND|OUTBOUND|BLENDED", // indication whether agent is logged in into "blended mode"
            "@agentType":"SUPERVISOR",
            "@isDequeueAgent":"true|false", // used do determine if a session is a monitoring session or not (monitor session is not dequeued agent)
            "@defaultRoute":"18772054729*103@RC_SOFTPHONE",
            "@firstName":"Danielle",
            "@evAgentId":"3",
            "@rcUserId": "23234",
            "@lastName":"Books",
            "@loginDurationMs":"114234",
            "@isOffHook":"true|false",
            "@engagementVoicePendingDispositionMs":"0",
            "@agentVoiceRnaState24hRollupMs":"0", // voice only
            "@agentDigitalRnaState24hRollupMs":"0", // digital+legacy
            "@currentAgentStateDurationMs":"1143453",
            "@currentAgentStateLabel":"On Lunch",
            "@currentAgentBaseState":"LUNCH",
            "@skillProfileName": "A skill profile",
            "@username":"danielle.books+aws92-l11+99999999_7112@ringcentral.com",
            "@agentUtilization":"0",
            "@activeEngagementsCount": "0", // total number of active engagements for agent

            "@longestEngagementId": "20221129135400000003" // find engagement with longest duration from array of engagements active for this agent
            "@longestEngagementSourceType": "voice|legacy_sms|sms|chat|email|...",
            "@longestEngagementSourceId": "Source Id for voice|sms|email|...", // same as engagementSourceId for longest active engagement for agent
            "@longestEngagementDurationMs": "0", // same as agentDurationMs in engagement object for longest active engagement for agent

            "@focusedEngagementId": "20221129135400000003" // id of focused engagement for agent
            "@focusedEngagementSourceId": "Source Id for voice|sms|email|...", // same as engagementSourceId for focused engagement for agent
            "@focusedEngagementDurationMs": "0", // same as agentDurationMs in engagement object

            "@engagement24hRollupCount" : "0", // all engagements for 24h period for agent - combined calls + digital + legacy
            "@engagementFocusTime24hRollupMs" : 0, // handle time for 24h period for agent, for voice/digital/legacy
            "@avgEngagementFocusTime24hRollupMs" : 0, // engagementFocusTime24hRollup / engagement24hCountRollup

            "@engagementVoice24hRollupCount" : "0", // all engagements for 24h period for agent - combined calls
            "@engagementVoiceFocusTime24hRollupMs" : 0, // handle time for 24h period for agent, for voice
            "@avgEngagementVoiceFocusTime24hRollupMs" : 0, // engagementVoiceFocusTime24hRollup / engagementVoice24hCountRollup

            "@engagementDigital24hRollupCount" : "0", // all engagements for 24h period for agent - combined digital+legacy
            "@engagementDigitalFocusTime24hRollupMs" : 0, // handle time for 24h period for agent, for digital+legacy
            "@avgEngagementDigitalFocusTime24hRollupMs" : 0, // engagementDigitalFocusTime24hRollup / engagementDigital24hCountRollup

            "engagements": {
                "engagement":[
                    {
                        "@active": "true", // true if engagement is live and accepted by agent
                        "@engagementId": "20221129135400000003", // currently will be UII
                        "@initialEngagementSourceType": "voice|legacy_sms|sms|chat|legacy_webchat|email|...",
                        "@initialEngagementSourceId": "", // only valid for digital tasks - edSourceId, used to lookup Source name and color values
                        "@isLegacyChat": "true/false" // legacy = legacy webchat or sms, current chat_type prop in NEW_CHAT msg
                        "@contactIdentity": "" // voice: phone number + CNAM (if available), digital: ed_author_screen_name|'Anonymous', legacy: 'Anonymous'
                        "@threadTitle": "" // engage_digital: first message, legacy: last message, voice: empty??
                        "@focusedConnectionId": "", // same as connectionId for last element in connections array (UII or taskId)
                        "@focusedConnectionSourceType": // same as sourceType for last element in connections array (voice|sms|email|...)
                        "@productId": "", // queue/campaign id
                        "@productName": "",
                        "@agentDuratioMs": "" // duration in milliseconds that this connection has been assigned to given agent
                        "@focusDurationMs": "" // time agent is focused on this connection
                        "@previewDurationMs":""
                        "@pendingDispositionMs":""
                        "connections": {
                            "connection" : [
                                {
                                    "@connectionId": ""  // voice: UII, digital: taskId, legacy: UII
                                    "@connectionSourceType": "voice|sms|email|...", // current sources for digital tasks/legacy webchat/sms or 'voice'
                                    "@connectionSourceId": "", // only valid for digital tasks - edSourceId, used to lookup Source name and color value
                                }
                            ]
                        }
                    }
                ]
            }
          },
          {
           second agent stats
            ...
            "engagements":{}
          }
        ]
    }
 }
 */
SupervisorStats.prototype.processResponse = function (stats) {
    var resp = stats.ui_stats.agents;
    var supervisorStats = [];
    var model = UIModel.getInstance();
    var mainAccountId = model.authenticateRequest.mainAccountId;
    var sourceList = model.applicationSettings.edSources[mainAccountId];

    if (!Array.isArray(resp)) {
        resp = [resp];
    }

    try {
        // loop over each agent in supervisor packet
        resp.forEach(function (agent) {
            var engagements = [];
            var sourceIdLongestEngagement = utils.getValue(
                agent,
                '@longestEngagementSourceId'
            );
            var cachedSourceLongestEngagement = utils.getEdValue(
                sourceList,
                sourceIdLongestEngagement
            );
            var sourceNameLongestEngagement =
                cachedSourceLongestEngagement.isCached
                    ? cachedSourceLongestEngagement.name
                    : '';
            var sourceColorLongestEngagement =
                cachedSourceLongestEngagement.isCached
                    ? cachedSourceLongestEngagement.color
                    : '';

            try {
                var rawEngagements = utils.getValue(agent, 'engagements');
                // only parse engagements if there are values here
                if (rawEngagements !== '') {
                    if (!Array.isArray(rawEngagements)) {
                        rawEngagements = [rawEngagements];
                    }

                    // for given agent, loop over all engagements they are handling
                    rawEngagements.forEach(function (engagement) {
                        var sourceIdForEngagement = utils.getValue(
                            engagement,
                            '@initialEngagementSourceId'
                        );
                        var cachedSourceForEngagement = utils.getEdValue(
                            sourceList,
                            sourceIdForEngagement
                        );
                        var sourceNameForEngagement =
                            cachedSourceForEngagement.isCached
                                ? cachedSourceForEngagement.name
                                : '';
                        var sourceColorForEngagement =
                            cachedSourceForEngagement.isCached
                                ? cachedSourceForEngagement.color
                                : '';

                        engagements.push({
                            engagementId: utils.getValue(
                                engagement,
                                '@engagementId'
                            ),
                            isActive:
                                utils
                                    .getValue(engagement, '@active')
                                    .toUpperCase() === 'TRUE',
                            isLegacyChat:
                                utils
                                    .getValue(engagement, '@isLegacyChat')
                                    .toUpperCase() === 'TRUE',
                            contactIdentity: utils.getValue(
                                engagement,
                                '@contactIdentity'
                            ),
                            threadTitle: utils.getValue(
                                engagement,
                                '@threadTitle'
                            ),
                            focusedConnectionId: utils.getValue(
                                engagement,
                                '@focusedConnectionId'
                            ),
                            productId: utils.getValue(engagement, '@productId'),
                            productName: utils.getValue(
                                engagement,
                                '@productName'
                            ),
                            agentDurationMs: utils.getValue(
                                engagement,
                                '@agentDurationMs'
                            ),
                            pendingDispositionMs: utils.getValue(
                                engagement,
                                '@pendingDispositionMs'
                            ),
                            engagementSource: {
                                initialEngagementSourceId:
                                    sourceIdForEngagement,
                                initialEngagementSourceType: utils.getValue(
                                    engagement,
                                    '@initialEngagementSourceType'
                                ),
                                initialEngagementSourceName:
                                    sourceNameForEngagement,
                                initialEngagementSourceColor:
                                    sourceColorForEngagement,
                                connections: utils.getValue(
                                    engagement,
                                    'connections'
                                ),
                            },
                        });
                    });
                }
            } catch (err) {
                console.error(err);
            }

            supervisorStats.push({
                activeEngagementsCount: utils.getValue(
                    agent,
                    '@activeEngagementsCount'
                ),
                agentLoginType: utils.getValue(agent, '@agentLoginType'),
                agentType: utils.getValue(agent, '@agentType'),
                agentUtilization: utils.getValue(agent, '@agentUtilization'),
                currentAgentStateDurationMs: utils.getValue(
                    agent,
                    '@currentAgentStateDurationMs'
                ),
                currentAgentStateLabel: utils.getValue(
                    agent,
                    '@currentAgentStateLabel'
                ),
                currentAgentBaseState: utils.getValue(
                    agent,
                    '@currentAgentBaseState'
                ),
                defaultRoute: utils.getValue(agent, '@defaultRoute'),
                isDequeueAgent:
                    utils.getValue(agent, '@isDequeueAgent').toUpperCase() ===
                    'TRUE',
                isOffHook:
                    utils.getValue(agent, '@isOffHook').toUpperCase() ===
                    'TRUE',
                firstName: utils.getValue(agent, '@firstName'),
                evAgentId: utils.getValue(agent, '@evAgentId'),
                rcUserId: utils.getValue(agent, '@rcUserId'),
                lastName: utils.getValue(agent, '@lastName'),
                loginDurationMs: utils.getValue(agent, '@loginDurationMs'),
                skillProfileName: utils.getValue(agent, '@skillProfileName'),
                username: utils.getValue(agent, '@username'),
                voicePendingDispositionMs: utils.getValue(
                    agent,
                    '@engagementVoicePendingDispositionMs'
                ),
                engagement24hRollupCount: utils.getValue(
                    agent,
                    '@engagement24hRollupCount'
                ), // 'Interactions rollup'
                avgTimePerEngagement24hRollupMs: utils.getValue(
                    agent,
                    '@avgEngagementFocusTime24hRollupMs'
                ), // 'Avg time per interaction
                engagementVoice24hRollupCount: utils.getValue(
                    agent,
                    '@engagementVoice24hRollupCount'
                ), // '# Calls'
                timePerVoiceEngagement24hRollupMs: utils.getValue(
                    agent,
                    '@engagementVoiceFocusTime24hRollupMs'
                ), // 'Talk time'
                avgTimePerVoiceEngagement24hRollupMs: utils.getValue(
                    agent,
                    '@avgEngagementVoiceFocusTime24hRollupMs'
                ), // 'Avg time per call'
                longestEngagement: {
                    engagementId: utils.getValue(agent, '@longestEngagementId'), //UII
                    sourceId: sourceIdLongestEngagement,
                    sourceType: utils.getValue(
                        agent,
                        '@longestEngagementSourceType'
                    ),
                    sourceName: sourceNameLongestEngagement,
                    sourceColor: sourceColorLongestEngagement,
                    agentDurationMs: utils.getValue(
                        agent,
                        '@longestEngagementDurationMs'
                    ),
                },
                engagements: engagements,
            });
        });
    } catch (e) {
        console.log('Error processing SUPERVISOR stat message');
    }

    UIModel.getInstance().supervisorStats = supervisorStats;
    return supervisorStats;
};

var UIModel = (function () {
    var instance;

    function init() {
        const baseApiUri = '/api/v1/';

        return {
            currentCall: {}, // save the NEW-CALL notification in parsed form
            pendingNewCallSessions: {}, // save any pending call sessions, in case the new call packet hasn't arrived
            callTokens: {}, // Stores a map of all tokens for a call
            callbacks: [],
            libraryInstance: null, // Initialized to the library instance on startup
            pingIntervalId: null, // The id of the timer used to send ping-call messages
            statsIntervalId: null, // The id of the timer used to send stats request messages
            pingStatIntervalId: null, // The id of the timer used to send ping-call beat messages
            agentDailyIntervalId: null, // The id of the timer used to update agent daily stats currCallTime and totalOffhookTime
            reconnectIntervalId: null, // The id of the timer used to try reconnecting the socket
            waitingForAddSession: null,
            authHost: window.location.origin, // default to protocol + hostname + port
            socketProtocol: 'wss://', // default to secure socket unless local test flag passed in on initialization
            baseAuthUri: '/api/auth/', // the path to engage-auth e.g.: http://localhost:81/api/auth/ or window.location.origin + "/api/auth/",
            baseApiUri: baseApiUri, // the path to engage-api
            baseEtrUri: '/platform/api/ed-task-routing/v1/', // the path to ETR task routing endpoints
            baseVoiceUri: '/voice' + baseApiUri, // the path to Voice URI, spring api
            // internal chat requests
            chatAliasRequest: null,
            chatRoomRequest: null,
            chatSendRequest: null,
            supervisorListRequest: null,
            chatRoomStateRequest: new ChatRoomStateRequest(),

            //multi-socket
            multiSocketRequest: new MultiSocketRequest(),
            dataStore: new LocalStorageService('agentSDK'),

            // external chat requests/notifications
            chatCancelledNotification: new ChatCancelledNotification(),
            chatActiveNotification: new ChatActiveNotification(),
            chatInactiveNotification: new ChatInactiveNotification(),
            chatDispositionRequest: null,
            chatMessageRequest: new ChatMessageRequest(),
            chatPresentedNotification: new ChatPresentedNotification(),
            chatPresentedRequest: null,
            chatRequeueRequest: null,
            chatTypingNotification: new ChatTypingNotification(),
            chatTypingRequest: null,
            newChatNotification: new NewChatNotification(),
            loadMediaNotification: new LoadMediaNotification(),
            chatAgentAssignFailureNotification:
                new ChatAgentAssignFailureNotification(),
            chatClientReconnectNotification:
                new ChatClientReconnectNotification(),
            chatSummaryRequest: null,

            // request instances
            agentStateRequest: null,
            chatStateRequest: null,
            ackRequest: new AckRequest(),
            bargeInRequest: null,
            callNotesRequest: null,
            callbacksPendingRequest: null,
            campaignDispositionsRequest: null,
            loginRequest: null,
            coldXferRequest: null,
            dispositionRequest: null,
            dispositionManualPassRequest: null,
            hangupRequest: null,
            holdRequest: null,
            leadHistoryRequest: null,
            leadInsertRequest: null,
            leadUpdateRequest: null,
            logoutRequest: null,
            authenticateRequest: null, // get RC access token
            loginPhase1Request: null,
            offhookInitRequest: null,
            offhookTermRequest: null,
            oneToOneOutdialRequest: null,
            oneToOneOutdialCancelRequest: null,
            pauseRecordRequest: null,
            pingCallRequest: null,
            previewDialRequest: null,
            reconnectRequest: null,
            recordRequest: null,
            requeueRequest: null,
            statsRequest: new StatsRequest(),
            tcpaSafeRequest: null,
            warmXferRequest: null,
            warmXferCancelRequest: null,
            chatListRequest: null,
            directAgentTransferListRequest: null,
            directAgentTransferRequest: null,
            webRTCRequest: null,
            searchDirectoryRequest: null,
            extensionPresenceRequest: null,
            etrRequest: new ETRRequest(),
            callSummaryRequest: null,

            // response packets
            agentStatePacket: null,
            chatStatePacket: null,
            loginPacket: null,
            currentCallPacket: null,
            authenticatePacket: null,
            loginPhase1Packet: null,
            offhookInitPacket: null,
            offhookTermPacket: null,
            transferSessions: {},
            chatListResponse: null,

            // notification packets
            addSessionNotification: new AddSessionNotification(),
            dialGroupChangeNotification: new DialGroupChangeNotification(),
            dialGroupChangePendingNotification:
                new DialGroupChangePendingNotification(),
            dropSessionNotification: new DropSessionNotification(),
            earlyUiiNotification: new EarlyUiiNotification(),
            endCallNotification: new EndCallNotification(),
            gatesChangeNotification: new GatesChangeNotification(),
            genericNotification: new GenericNotification(),
            newCallNotification: new NewCallNotification(),

            // stats packets
            agentStatsPacket: new AgentStats(),
            agentDailyStatsPacket: new AgentDailyStats(),
            queueStatsPacket: new QueueStats(),
            campaignStatsPacket: new CampaignStats(),
            chatQueueStatsPacket: new ChatQueueStats(),
            supervisorStatsPacket: new SupervisorStats(),

            // application state
            applicationSettings: {
                allowMultiSocket: false, // Determines whether agent can open a new socket under the same login
                availableCountries: [],
                dialDestType: '', // What type of phone are we setting up: e.g. "RC_SOFTPHONE", "LEGACY_SOFTPHONE", "RC_PHONE" (for RC office ext)// Comes in at the account-level - will get set to true if this interface should be in tcpa-safe-mode only.
                edSources: {}, // Cache for ED sources, loaded when first task received. Object indexed by mainAccountId, then array of all sources
                edLanguages: {}, // Cache for ED language, loaded when first task received. Object indexed by mainAccountId, then array of all languages
                edCategories: {}, // Cache for ED categories, loaded when first task received. Object indexed by mainAccountId, then array of all categories
                enableCallContactHistory: false, // Display contact history pane in Agent UI when true
                isEmbeddedLogin: false, // true if agent app is launched from RC MVP app
                isFlr: false, // Check of Force legacy registration for dialing destination type
                isLoggedInIS: false, // a check for whether or not user is logged in with IntelliServices
                isSso: false, // Passed in on phase 1 login response, if agent signed in through RC single sign-on path set to true
                isTcpaSafeMode: false, // Comes in at the account-level - will get set to true if this interface should be in tcpa-safe-mode only.
                statsRoundtripDurationMs: 0, // Tracks time from when STATS request sent to when response is received
                statsMsgRequestedTime: 0, // Time when STATS request sent
                socketConnected: false,
                socketDest: '',
            },

            // stat objects
            agentStats: [],
            agentDailyStats: {},
            campaignStats: {},
            queueStats: {},
            chatQueueStats: {},
            supervisorStats: [],

            // current agent settings
            agentSettings: {
                accountId: null, // account agent belongs to
                agentId: 0,
                agentPassword: '', //agent Password
                agentType: 'AGENT', // AGENT | SUPERVISOR
                altDefaultLoginDest: '',
                availableAgentStates: [],
                allAgentStates: [], // Full List of All Agent States
                callerIds: [],
                callState: null, // display the current state of the call
                corporateDirectory: false,
                consultCall: false, //consult call allow
                currentState: 'OFFLINE', // Agent system/base state
                currentStateLabel: '', // Agent aux state label
                defaultLoginDest: '',
                dialDest: '', // Destination agent is logged in with for offhook session, set on configure response, if multi values in format "xxxx|,,xxxx"
                email: '',
                externalAgentId: '',
                firstName: '',
                guid: '', // unique key generated on login, used for accessing spring endpoints
                isLoggedIn: false, // agent is logged in to the platform
                isOffhook: false, // track whether or not the agent has an active offhook session
                isMonitoring: false, // track whether or not the offhook session is for monitoring
                includeSupervisorStats: false, // set to true in Agent-JS app when user is on any supervisor views, when true, respond to STATS request with SUPERVISOR stat message
                initLoginState: 'AVAILABLE', // state agent is placed in on successful login
                initLoginStateLabel: 'Available', // state label for agent on successful login
                isOutboundPrepay: false, // determines if agent is a prepay agent
                lastName: '',
                loginDTS: null, // date and time of the final login phase (IQ)
                loginType: 'NO-SELECTION', // Could be INBOUND | OUTBOUND | BLENDED | NO-SELECTION, set on login response
                maxBreakTime: -1,
                maxLunchTime: -1,
                onCall: false, // true if agent is on an active call
                onManualOutdial: false, // true if agent is on a manual outdial call
                outboundManualDefaultRingtime: '30',
                pendingCallbacks: [],
                pendingDialGroupChange: 0, // Set to Dial Group Id if we are waiting to change dial groups until agent ends call
                phoneLoginPin: '',
                realAgentType: 'AGENT',
                supervisors: [], // Used for agent chat
                totalCalls: 0, // Call counter that is incremented every time a new session is received
                transferNumber: '', // May be pre-populated by an external interface, if so, the transfer functionality uses it
                updateDGFromAdminUI: false, // if pending Dial Group change came from AdminUI, set to true (only used if request is pending)
                updateLoginMode: false, // gets set to true when doing an update login (for events control)
                username: '', // Agent's username
                wasMonitoring: false, // used to track if the last call was a monitoring call
                enableCallQuality: false, // Enable/Disable of Report Call Quality Issue
                reportCallQualityIssueTypes: [],
            },

            // current agent permissions
            agentPermissions: {
                allowBlended: true, // Controls whether or not the agent can log into both inbound queues and an outbound dialgroup
                allowCallControl: true, // Set from the the login response packet
                allowChat: false, // Controls whether or not the agent has the option to open the Chat Queue Manager
                enableChat: false, // Controls whether or not the agent has legacy chat and SMS access on the account level
                allowCrossQueueRequeue: false, // Controls whether or not the agent can requeue to a different queue group
                allowInbound: true, // Controls whether or not the agent can log into an inbound queue
                allowLeadInserts: false, // Controls whether or not the agents can insert leads
                allowLeadSearch: false, // Controlled by the dial-group allow_lead_search setting. Enables or disables the lead search
                allowLoginControl: true, // Controls whether or not the agent can log in
                allowLoginUpdates: true, // Controls whether or not the agent can update their login
                allowManualCalls: true, // Controls whether or not the agents have the option to make a manual outbound call
                allowManualPass: true, // Controls whether or not the agent has the option to make a manual pass on a lead
                allowManualIntlCalls: false, // Controls whether or not the agent has the option to make international manual outbound calls
                allowManualOutboundGates: false, // Controls whether or not the agent has the option to select queues to convert manual outbound calls to
                allowOffHook: true, // Controls whether or not the agents can go offhook
                allowOutbound: true, // Controls whether or not the agent can log into an outdial group
                allowPreviewLeadFilters: false, // Controlled by the dial-group allow_preview_lead_filters setting. Enables or disables the filters on the preview style forms
                allowLeadUpdatesByCampaign: {}, // For each campaign ID, store whether leads can be updated
                disableSupervisorMonitoring: true, // Controls whether or not a supervisor can view agent stats
                progressiveEnabled: false, // Preview dial feature that enables auto-calls from the preview window.
                requireFetchedLeadsCalled: false, // Controlled by the dial-group require_fetched_leads_called setting. Enables or disables the requirement to only fetch new leads when current leads are called or expired. ONly for Preview or TCPA-SAFE.
                showLeadHistory: true, // Controls whether or not the agents can view lead history
                enableTaskMode: false, // Controls whether or not the agent has access to Digital task mode
                enableFolderMode: false, // Controls whether or not the agent has access to Digital folder mode
            },

            // chat
            chatSettings: {
                availableChatQueues: [], // List of all chat queues agent has access to, set on login
                availableChatRooms: [], // List of all chat rooms agent has access to, set on login
                chatQueues: [], // Array of chat queues agent is signed into
                alias: '', // Chat alias, on-login this is the UID, but is changed if the user changes it
            },

            // connection objects
            connectionSettings: {
                hashCode: '', // used specifically for reconnects
                reconnect: false, // variable tracks the type of login, on init it's false...once connected it's set to true
                isMultiSocket: false,
            },

            // inbound settings
            inboundSettings: {
                availableQueues: [], // array of queues agent has access to, set on login
                availableSkillProfiles: [], // array of skill profiles agent has access to, set on login
                queues: [], // array of queues agent is signed into, set on config response
                skillProfile: {}, // The skill profile the agent is signed into, set on config response
            },

            // outbound settings
            outboundSettings: {
                availableCampaigns: [], // array of campaigns agent has access to, set on login
                availableOutdialGroups: [], // array of dial groups agent has access to, set on login
                insertCampaigns: [],
                defaultDialGroup: 0,
                outdialGroup: {}, // dial group agent is signed into
                previewDialLeads: [], // list of leads returned from preview dial request
                tcpaSafeLeads: [], // list of leads returned from tcpa safe request
                campaignDispositions: [], // list of campaign dispositions for specific campaign
            },

            scriptSettings: {
                availableScripts: [], // array of all scripts associated with any campaigns or queues agent is logged into
                loadedScripts: {}, // stores script data by script id e.g. {1:{}, 32:{}}
            },

            softphoneSettings: {
                isRegistered: false, // whether or not the softphone is currently registered
                maintainOH: false, // based on the configurable agent setting to keep offhook session after ending call
                autoStartOH: false, // determines whether or not to start an offhook session automatically after softphone registrar reconnect
                wsServers: [], // current sip server domain + user credentials, set as array for SIP.js ua object
                sipInfo: [], // array of sip server domains + user credentials for softphone registration, retrieved from engage-auth
                uri: '', // username + @ + domain
                displayName: '', // username - Used to register softphone with freeswitch (legacy)
                authorizationUser: '', // username - Used to register softphone with freeswitch (legacy)
                sipPassword: '', // password for sip softphone registration
                sipDialDest: '', // dialDest used for softphone connection
                attemptingSoftphoneReconnect: false, // set to true when attempting to rotate softphone registrar and reconnect
                //manualSoftphoneReconnect: false,     // set to true when agent triggered registrar rotation
                lastSipFetchTime: 0, //set current time when sip registration info fetched.
            },

            // Filtered Directory
            filteredDirectory: {
                rcAccountId: '',
                records: [],
            },

            extensionPresenceResponse: [],

            callHistory: {},

            // Public methods
            incrementTotalCalls: function () {
                this.agentSettings.totalCalls =
                    this.agentSettings.totalCalls + 1;
            },
        };
    }

    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        },

        resetInstance: function () {
            instance = null;
        },
    };
})();

var LocalStorageService = function (name) {
    if (!window.localStorage) {
        console.log('Browser does not support HTML5 Web Storage');
    }
    this.prefix = name + ':';
};
LocalStorageService.prototype.save = function (key, value) {
    if (!key || !value) {
        console.log('Missing parameters key or value on add');
        return false;
    }
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
};
LocalStorageService.prototype.get = function (key) {
    if (!key || !localStorage.getItem(this.prefix + key)) {
        console.log('Missing parameter key on retrieve');
        return false;
    }
    return localStorage.getItem(this.prefix + key);
};

LocalStorageService.prototype.remove = function (key) {
    if (!key || !localStorage.getItem(this.prefix + key)) {
        console.log('Missing parameter key on remove');
        return false;
    }
    localStorage.removeItem(this.prefix + key);
};

// --------------------------
// BroadcastChannelHelper.js
// --------------------------
var broadcastChannelHelper = {
    // Generate handlers to request / response BroadcastChannels
    //
    requestChannel: null,
    responseChannel: null,
    currentCallMessageId: null,
    currentCallRequestCallback: null,

    // Registers the request / response channels
    //
    init: function () {
        if (this.requestChannel != null) {
            return;
        }

        var self = this;
        this.requestChannel = new BroadcastChannel('ev-multisocket-request');
        this.responseChannel = new BroadcastChannel('ev-multisocket-response');

        // Listen for requests coming from the requestChannel
        //
        this.requestChannel.onmessage = function (e) {
            var type = e.data.type;
            var messageId = e.data.messageId;

            switch (type) {
                case 'currentCall':
                    self._sendCurrentCall(messageId);
                    break;
            }
        };

        // Listen for requests coming from the responseChannel
        //
        this.responseChannel.onmessage = function (e) {
            var type = e.data.type;

            switch (type) {
                case 'currentCall':
                    self._processCurrentCallResponse(
                        e.data.data,
                        e.data.messageId
                    );
            }
        };
    },

    destroy: function () {
        if (this.requestChannel == null) {
            return;
        }

        this.requestChannel.onmessage = null;
        this.responseChannel.onmessage = null;

        this.requestChannel.close();
        this.responseChannel.close();

        this.requestChannel = null;
        this.responseChannel = null;
    },

    // ----------------------------------------------------
    // Current Call, Request & Response
    // ----------------------------------------------------

    // When a new tab opens and needs to get the current call, it can do so with this method.  Passing
    // a callback function to response with (could be a Promise if we are using them in SDK). Once
    // a response is retrieved, it will be handled in the "processCurrentCall" method, and returned
    // back to the original callback function
    //
    requestCurrentCall: function (fn) {
        this.currentCallMessageId = Math.random();
        this.currentCallRequestCallback = fn;

        this.requestChannel.postMessage({
            type: 'currentCall',
            messageId: this.currentCallMessageId,
        });
    },

    // Any instance that has knowledge of the current call can respond to the request
    //
    _sendCurrentCall: function (messageId) {
        if (UIModel.getInstance().currentCall != null) {
            var obj = {
                type: 'currentCall',
                messageId: messageId,
                data: UIModel.getInstance().currentCall,
            };

            this.responseChannel.postMessage(obj);
        }
    },

    // When a current call response is received, every tab will try to process it.  Only the original
    // requestor will be able to process it successfully.
    //
    _processCurrentCallResponse: function (data, messageId) {
        if (this.currentCallMessageId === messageId) {
            // Set the current call model
            UIModel.getInstance().currentCall = data;

            // Alert the original method that our data is now available.
            if (this.currentCallRequestCallback != null) {
                this.currentCallRequestCallback(data);
            }

            // Null out properties - this ensure subsequent responses from other tabs will be ignored.
            this.currentCallMessageId = null;
            this.currentCallRequestCallback = null;
        }
    },
};

function HttpService(apiBase) {
    this.XMLHttpRequest = window.XMLHttpRequest;
    this.encodeURIComponent = window.encodeURIComponent;
    this.apiBase = apiBase || 'http://localhost:81';

    var that = this;

    /**
     * Makes a GET request to Engage Auth.
     *
     * @param {string} path - Relative path to append to apiUrl.
     * @param {Object} config - Object describing different properties of the request.
     * @returns {Promise} Promise that represents status of the request. Resolves if server responds with 200 status code, and is rejected otherwise.
     */
    this.httpGet = function (path, config) {
        return new Promise(function (resolve, reject) {
            var req = new that.XMLHttpRequest();
            var queryParams = '';
            if (config.queryParams) {
                queryParams = '?' + _getUriEncodedParams(config.queryParams);
            }
            req.open('GET', that.apiBase + path + queryParams);
            _addHeaders(config, req);
            _addLoggingHeaders(req);
            _addCompletionListeners(resolve, reject, req);
            req.send();
        });
    };

    /**
     * Makes a GET request to Engage Auth.
     *
     * @param {string} path - Relative path to append to apiUrl.
     * @param {Object} config - Object describing different properties of the request.
     * @returns {Promise} Promise that represents status of the request. Resolves if server responds with 200 status code, and is rejected otherwise.
     */
    this.httpPost = function (path, config) {
        return new Promise(function (resolve, reject) {
            var req = new that.XMLHttpRequest();
            var queryParams = '';
            if (config.queryParams) {
                queryParams = '?' + _getUriEncodedParams(config.queryParams);
            }
            req.open('POST', that.apiBase + path + queryParams);
            _addHeaders(config, req);
            _addLoggingHeaders(req);
            _addCompletionListeners(resolve, reject, req);
            req.send(_getUriEncodedBody(config));
        });
    };

    /**
     * Utility method used to check if an argument is actually an object.
     *
     * @param {*} obj
     */
    function _isObj(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    /**
     * Adds headers to XMLHttpRequest based on configuration object.
     *
     * @param {Object} config - Config object passed to HttpService methods.
     * @param {XMLHttpRequest} req - Instance of XMLHttpRequest that needs to be configured.
     */
    function _addHeaders(config, req) {
        if (!_isObj(config)) {
            return;
        }

        var headers = config.headers;

        if (!_isObj(headers)) {
            return;
        }

        for (var key in headers) {
            req.setRequestHeader(key, headers[key]);
        }
    }

    /**
     * Adds request logging headers to XMLHttpRequest.
     *
     * @param {XMLHttpRequest} req - Instance of XMLHttpRequest that needs to be configured.
     */
    function _addLoggingHeaders(req) {
        const requestLoggingHeaders = RequestLoggingService.getLoggingHeaders();

        Object.keys(requestLoggingHeaders).forEach(function (key) {
            req.setRequestHeader(key, requestLoggingHeaders[key]);
        });
    }

    /**
     * Configures an XMLHttpRequest object to properly resolve/reject a promise, depending on the outcome of the request.
     *
     * @param {Function} resolve - Resolve callback function from a promise. Invoked if the request completed successfully.
     * @param {Function} reject - Reject callback function from a promise. Invoked if the request failed.
     * @param {XMLHttpRequest} req - Instance of XMLHttpRequest that will be configured.
     */
    function _addCompletionListeners(resolve, reject, req) {
        req.addEventListener('error', function (e) {
            reject(e);
        });
        req.addEventListener('timeout', function () {
            reject(new Error('request timeout'));
        });
        req.addEventListener('load', function () {
            if (this.status !== 200) {
                reject({
                    status: this.status,
                    response: this.responseText,
                });
            } else {
                resolve({
                    status: this.status,
                    response: this.responseText,
                });
            }
        });
    }

    /**
     * Takes a config object and serializes/URI encodes the contents of the body property. If the "Content-Type" header is set
     * to "application/json", it encodes the payload as JSON. Otherwise, we assume that the payload should be x-www-form-urlencoded.
     */
    function _getUriEncodedBody(config) {
        var contentType =
            config && config.headers && config.headers['Content-Type'];
        var body = (config && config.body) || '';

        if (contentType === 'application/json') {
            body = JSON.stringify(body);
        } else {
            if (_isObj(body)) {
                body = _getUriEncodedParams(body);
            }
        }

        return body;
    }

    function _getUriEncodedParams(params) {
        if (!_isObj(params)) {
            return;
        }

        return Object.keys(params)
            .map(function (key) {
                return (
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(params[key])
                );
            })
            .join('&');
    }
}

function NewCallUtils(instance, data) {
    this.instance = instance;
    this.data = data;

    var that = this;

    this.setupAddSessionCallback = function () {
        var sessionUii = utils.getText(data.ui_notification, 'uii'),
            sessionId = utils.getText(data.ui_notification, 'session_id'),
            call = UIModel.getInstance().currentCall;

        console.log(sessionUii + ' ADD SESSION ' + sessionId);

        if (call.uii === sessionUii) {
            // we already have a new call packet for this session
            _delayedAddSessionCallback(that.instance, that.data);
        } else {
            // uii mismatch, but call has been dispositioned
            UIModel.getInstance().pendingNewCallSessions[sessionUii] =
                UIModel.getInstance().pendingNewCallSessions[sessionUii] || {};
            UIModel.getInstance().pendingNewCallSessions[sessionUii][
                sessionId
            ] = that;
        }
    };

    this.processSessionsForCall = function () {
        var uii = UIModel.getInstance().currentCall.uii,
            delayedSessions = UIModel.getInstance().pendingNewCallSessions[uii];

        console.log(uii + ' NEW CALL');

        if (delayedSessions && Object.keys(delayedSessions).length > 0) {
            // we have delayed sessions to process
            for (var sessionId in delayedSessions) {
                if (delayedSessions.hasOwnProperty(sessionId)) {
                    var session = delayedSessions[sessionId];
                    _delayedAddSessionCallback(session.instance, session.data);
                } else {
                    console.error(
                        'error processing sessions for uii: ' +
                            uii +
                            ' session: ' +
                            sessionId
                    );
                }
            }

            delete UIModel.getInstance().pendingNewCallSessions[uii];
        }
    };

    function _delayedAddSessionCallback(instance, data) {
        var addSessionNotif = new AddSessionNotification();
        var addResponse = addSessionNotif.processResponse(data);
        utils.fireCallback(instance, CALLBACK_TYPES.ADD_SESSION, addResponse);
    }
}

var utils = {
    logMessage: function (logLevel, message, data) {
        var instance = UIModel.getInstance().libraryInstance;
        if (instance._db) {
            try {
                var transaction = instance._db.transaction(
                    ['logger'],
                    'readwrite'
                );
                var store = transaction.objectStore('logger');

                var record = {
                    logLevel: logLevel,
                    message: message,
                    dts: new Date(),
                    data: data,
                };

                store.add(record);
            } catch (err) {
                console.error('Error adding log message: ' + err);
            }
        }
    },

    sendMessage: function (instance, msg) {
        var msgObj = JSON.parse(msg);
        var msgType = msgObj.ui_request['@type'];

        if (instance.socket && instance.socket.readyState === 1) {
            // add message id to request map, then send message
            var destination = msgObj.ui_request['@destination'];
            var message =
                'Sending ' + msgType + ' request message to ' + destination;
            instance._requests.push({
                id: msgObj.ui_request['@message_id'],
                type: msgObj.ui_request['@type'],
                msg: msgObj.ui_request,
            });

            // keep rolling window of latest 1000 requests
            if (instance._requests.length > 1000) {
                instance._requests.shift();
            }

            instance.socket.send(msg);

            if (msgType === 'STATS') {
                utils.logMessage(LOG_LEVELS.STATS, message, msgObj);
            } else {
                utils.logMessage(LOG_LEVELS.INFO, message, msgObj);
            }
        } else {
            if (!utils._isStatOrBeatMessage(msgType, msgObj.ui_request)) {
                //keep latest 100 messages in the queue
                if (
                    instance._queuedMsgs.length + 1 >
                    MAX_OFFLINE_MESSAGES_TO_PROCESS
                ) {
                    instance._queuedMsgs.shift();
                }
                // add message to queue if socket is not open.
                instance._queuedMsgs.push({ dts: new Date(), msg: msg });
            }
        }
    },

    processResponse: function (instance, response) {
        var type = response.ui_response['@type'];
        var messageId = response.ui_response['@message_id'];
        var dest =
            messageId === '' || !messageId ? 'IS' : messageId.slice(0, 2);
        var message =
            'Received ' + type.toUpperCase() + ' response message from ' + dest;
        var responseTo;
        var request;

        // log message response
        utils.logMessage(LOG_LEVELS.INFO, message, response);

        // Send generic on message response
        utils.fireCallback(instance, CALLBACK_TYPES.ON_MESSAGE, response);

        // Fire callback function
        switch (type.toUpperCase()) {
            case MESSAGE_TYPES.AGENT_STATE:
                if (UIModel.getInstance().agentStateRequest === null) {
                    UIModel.getInstance().agentStateRequest =
                        new AgentStateRequest(
                            response.ui_response.current_state['#text'],
                            response.ui_response.agent_aux_state['#text']
                        );
                }
                var stateChangeResponse =
                    UIModel.getInstance().agentStateRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.AGENT_STATE,
                    stateChangeResponse
                );
                break;
            case MESSAGE_TYPES.BARGE_IN:
                var resp =
                    UIModel.getInstance().bargeInRequest.processResponse(
                        response
                    );
                responseTo = response.ui_response['@response_to'];
                request = utils.findRequestById(instance, responseTo);
                if (request) {
                    // found corresponding request, fire registered callback for type
                    var audioState = request.msg.audio_state['#text'];
                    if (audioState === 'MUTE') {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.SILENT_MONITOR,
                            resp
                        );
                    } else if (audioState === 'COACHING') {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.COACH_CALL,
                            resp
                        );
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.BARGE_IN,
                            resp
                        );
                    }
                } else {
                    // no corresponding request, just fire FULL audio type BARGE-IN callback
                    utils.fireCallback(instance, CALLBACK_TYPES.BARGE_IN, resp);
                }
                break;
            case MESSAGE_TYPES.CAMPAIGN_DISPOSITIONS:
                var campaignDispsResposne =
                    UIModel.getInstance().campaignDispositionsRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CAMPAIGN_DISPOSITIONS,
                    campaignDispsResposne
                );
                break;
            case MESSAGE_TYPES.CALL_NOTES:
                var callNotes =
                    UIModel.getInstance().callNotesRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CALL_NOTES,
                    callNotes
                );
                break;
            case MESSAGE_TYPES.CALLBACK_PENDING:
                var pendingCallbacks =
                    UIModel.getInstance().callbacksPendingRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CALLBACK_PENDING,
                    pendingCallbacks
                );
                break;
            case MESSAGE_TYPES.HOLD:
                var holdRequest;
                if (UIModel.getInstance().holdRequest === null) {
                    holdRequest = new HoldRequest();
                } else {
                    holdRequest = UIModel.getInstance().holdRequest;
                }
                var hold = holdRequest.processResponse(response);
                utils.fireCallback(instance, CALLBACK_TYPES.HOLD, hold);
                break;
            case MESSAGE_TYPES.LEAD_HISTORY:
                var history =
                    UIModel.getInstance().leadHistoryRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LEAD_HISTORY,
                    history
                );
                break;
            case MESSAGE_TYPES.LEAD_INSERT:
                var insert =
                    UIModel.getInstance().leadInsertRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LEAD_INSERT,
                    insert
                );
                break;
            case MESSAGE_TYPES.LEAD_UPDATE:
                var update =
                    UIModel.getInstance().leadUpdateRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LEAD_UPDATE,
                    update
                );
                break;
            case MESSAGE_TYPES.LOGIN_PHASE_1:
                var loginPhase1Response =
                    UIModel.getInstance().loginPhase1Request.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LOGIN_PHASE_1,
                    loginPhase1Response
                );
                break;
            case MESSAGE_TYPES.LOGIN:
                var loginResponse =
                    UIModel.getInstance().loginRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LOGIN,
                    loginResponse
                );
                break;
            case MESSAGE_TYPES.OFFHOOK_INIT:
                var offhook = new OffhookInitRequest();
                var initResponse = offhook.processResponse(response);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.OFFHOOK_INIT,
                    initResponse
                );
                break;
            case MESSAGE_TYPES.PAUSE_RECORD:
                var pauseRequest;
                if (UIModel.getInstance().pauseRecordRequest === null) {
                    pauseRequest = new PauseRecordRequest();
                } else {
                    pauseRequest = UIModel.getInstance().pauseRecordRequest;
                }
                var pauseRec = pauseRequest.processResponse(response);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.PAUSE_RECORD,
                    pauseRec
                );
                break;
            case MESSAGE_TYPES.RECORD:
                var record =
                    UIModel.getInstance().recordRequest.processResponse(
                        response
                    );
                utils.fireCallback(instance, CALLBACK_TYPES.RECORD, record);
                break;
            case MESSAGE_TYPES.REQUEUE:
                var requeue =
                    UIModel.getInstance().requeueRequest.processResponse(
                        response
                    );
                utils.fireCallback(instance, CALLBACK_TYPES.REQUEUE, requeue);
                break;
            case MESSAGE_TYPES.SUPERVISOR_LIST:
                var supervisorList =
                    UIModel.getInstance().supervisorListRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.SUPERVISOR_LIST,
                    supervisorList
                );
                break;
            case MESSAGE_TYPES.SCRIPT_CONFIG:
                var script =
                    UIModel.getInstance().scriptConfigRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.SCRIPT_CONFIG,
                    script
                );
                break;
            case MESSAGE_TYPES.XFER_COLD:
                var coldXfer =
                    UIModel.getInstance().coldXferRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.XFER_COLD,
                    coldXfer
                );
                break;
            case MESSAGE_TYPES.XFER_WARM:
                var warmXfer =
                    UIModel.getInstance().warmXferRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.XFER_WARM,
                    warmXfer
                );
                break;
            case MESSAGE_TYPES.XFER_WARM_CANCEL:
                var warmXferCancel =
                    UIModel.getInstance().warmXferCancelRequest.processResponse(
                        response
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.XFER_WARM_CANCEL,
                    warmXferCancel
                );
                break;
            case MESSAGE_TYPES.ACK:
                var ack =
                    UIModel.getInstance().ackRequest.processResponse(response);
                responseTo = response.ui_response['@response_to'];
                request = utils.findRequestById(instance, responseTo);
                ack.uii = request.msg.uii && request.msg.uii['#text'];
                utils.fireCallback(instance, CALLBACK_TYPES.ACK, ack);
                break;
            case MESSAGE_TYPES.CHAT_LIST:
                var chatList = new ChatListRequest();
                var chatListResponse = chatList.processResponse(response);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_LIST,
                    chatListResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_STATE:
                var chatState = new ChatStateRequest();
                var chatStateResponse = chatState.processResponse(response);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_STATE,
                    chatStateResponse
                );
                break;
            case MESSAGE_TYPES.DIRECT_AGENT_TRANSFER_LIST:
                var agentList = new DirectAgentTransferList();
                var agentListResponse = agentList.processResponse(response);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.DIRECT_AGENT_TRANSFER_LIST,
                    agentListResponse
                );
                break;
            case MESSAGE_TYPES.DIRECT_AGENT_TRANSFER:
                var agentXfer = new DirectAgentTransfer();
                var agentXferResponse = agentXfer.processResponse(response);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.DIRECT_AGENT_TRANSFER,
                    agentXferResponse
                );
                break;
        }
    },

    processNotification: function (instance, data) {
        var type = data.ui_notification['@type'];
        var messageId = data.ui_notification['@message_id'];
        var dest = messageId === '' ? 'IS' : messageId.slice(0, 2);
        var message =
            'Received ' +
            type.toUpperCase() +
            ' notification message from ' +
            dest;

        // log message response
        utils.logMessage(LOG_LEVELS.INFO, message, data);

        switch (type.toUpperCase()) {
            case MESSAGE_TYPES.ADD_SESSION:
                new NewCallUtils(instance, data).setupAddSessionCallback();
                break;
            case MESSAGE_TYPES.DIAL_GROUP_CHANGE:
                var dgChangeNotif = new DialGroupChangeNotification();
                var changeResponse = dgChangeNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.DIAL_GROUP_CHANGE,
                    changeResponse
                );
                break;
            case MESSAGE_TYPES.DIAL_GROUP_CHANGE_PENDING:
                var dgChangePendNotif =
                    new DialGroupChangePendingNotification();
                var pendResponse = dgChangePendNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.DIAL_GROUP_CHANGE_PENDING,
                    pendResponse
                );
                break;
            case MESSAGE_TYPES.DROP_SESSION:
                var dropSesNotif = new DropSessionNotification(instance);
                var dropSesResponse = dropSesNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.DROP_SESSION,
                    dropSesResponse
                );
                break;
            case MESSAGE_TYPES.EARLY_UII:
                var earlyUiiNotif = new EarlyUiiNotification(instance);
                var earlyUiiResponse = earlyUiiNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.EARLY_UII,
                    earlyUiiResponse
                );
                break;
            case MESSAGE_TYPES.END_CALL:
                var endCallNotif = new EndCallNotification(instance);
                var endCallResponse = endCallNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.END_CALL,
                    endCallResponse
                );
                break;
            case MESSAGE_TYPES.GATES_CHANGE:
                var gateChangeNotif = new GatesChangeNotification();
                var gateChangeResponse = gateChangeNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.GATES_CHANGE,
                    gateChangeResponse
                );
                break;
            case MESSAGE_TYPES.GENERIC:
                var genericNotif = new GenericNotification();
                var generic = genericNotif.processResponse(data);
                var responseTo = data.ui_notification['@response_to'];
                var request = utils.findRequestById(instance, responseTo);
                if (request) {
                    // found corresponding request, fire registered callback for type
                    var reqType = request.type;
                    var callbackFnName =
                        utils.findCallbackBasedOnMessageType(reqType);

                    if (callbackFnName) {
                        if (reqType === MESSAGE_TYPES.CALLBACK_CANCEL) {
                            generic.leadId = request.msg.lead_id['#text'];
                        }
                        utils.fireCallback(instance, callbackFnName, generic);
                    } else {
                        // no registered callback, fallback to generic notification
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.GENERIC_NOTIFICATION,
                            generic
                        );
                    }
                } else {
                    if (generic.messageCode === '001') {
                        // caller hangup, stop pinging call
                        if (UIModel.getInstance().pingIntervalId) {
                            clearInterval(UIModel.getInstance().pingIntervalId);
                        }
                    }

                    // no corresponding request, just fire generic notification callback
                    utils.fireCallback(
                        instance,
                        CALLBACK_TYPES.GENERIC_NOTIFICATION,
                        generic
                    );
                }
                break;
            case MESSAGE_TYPES.NEW_CALL:
                var newCallNotif = new NewCallNotification();
                var newCallResponse = newCallNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.NEW_CALL,
                    newCallResponse
                );
                new NewCallUtils(instance, data).processSessionsForCall();

                break;
            case MESSAGE_TYPES.OFFHOOK_TERM:
                if (UIModel.getInstance().offhookTermRequest === null) {
                    // offhook term initiated by IQ
                    UIModel.getInstance().offhookTermRequest =
                        new OffhookTermRequest();
                }
                var termResponse =
                    UIModel.getInstance().offhookTermRequest.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.OFFHOOK_TERM,
                    termResponse
                );
                break;
            case MESSAGE_TYPES.PREVIEW_LEAD_STATE:
                var leadStateNotif = new PreviewLeadStateNotification();
                var leadStateResponse = leadStateNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.PREVIEW_LEAD_STATE,
                    leadStateResponse
                );
                break;
            case MESSAGE_TYPES.PENDING_DISP:
                var pendingDispNotif = new PendingDispNotification();
                var pendingDispResponse =
                    pendingDispNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.PENDING_DISP,
                    pendingDispResponse
                );
                break;
            case MESSAGE_TYPES.PENDING_CHAT_DISP:
                var pendingChatDispNotif = new PendingChatDispNotification();
                var pendingChatDispResponse =
                    pendingChatDispNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.PENDING_CHAT_DISP,
                    pendingChatDispResponse
                );
                break;
            case MESSAGE_TYPES.REVERSE_MATCH:
                var reverseMatchNotif = new ReverseMatchNotification();
                var reverseMatchResponse =
                    reverseMatchNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.REVERSE_MATCH,
                    reverseMatchResponse
                );
                break;
            case MESSAGE_TYPES.TCPA_SAFE_LEAD_STATE:
                var leadStateTcpaNotif = new TcpaSafeLeadStateNotification();
                var leadStateTcpaResponse =
                    leadStateTcpaNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.TCPA_SAFE_LEAD_STATE,
                    leadStateTcpaResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_ACTIVE:
                var activeNotif = new ChatActiveNotification();
                var activeResponse = activeNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_ACTIVE,
                    activeResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_INACTIVE:
                var inactiveNotif = new ChatInactiveNotification();
                var inactiveResponse = inactiveNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_INACTIVE,
                    inactiveResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_CLIENT_RECONNECT:
                var reconnectNotif = new ChatClientReconnectNotification();
                var reconnectResponse = reconnectNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_CLIENT_RECONNECT,
                    reconnectResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_PRESENTED:
                var presentedNotif = new ChatPresentedNotification();
                presentedNotif.processResponse(data);
                break;
            case MESSAGE_TYPES.CHAT_TYPING:
                var typingNotif = new ChatTypingNotification();
                var typingResponse = typingNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_TYPING,
                    typingResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_NEW:
                var newChatNotif = new NewChatNotification();
                var newChatResponse = newChatNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_NEW,
                    newChatResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_MESSAGE:
                var chatMessage = new ChatMessageRequest();
                var chatMessageResponse = chatMessage.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_MESSAGE,
                    chatMessageResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_CANCELLED:
                var chatCancelled = new ChatCancelledNotification();
                var chatCancelledResponse = chatCancelled.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_CANCELLED,
                    chatCancelledResponse
                );
                break;
            case MESSAGE_TYPES.STOP_MONITOR_CHAT:
                var stopChatMonitor = new StopMonitorChatRequest();
                var stopChatMonitorResponse =
                    stopChatMonitor.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_STOP_MONITOR,
                    stopChatMonitorResponse
                );
                break;
            case MESSAGE_TYPES.DIRECT_AGENT_ROUTE:
                var directAgentTransfer = new DirectAgentTransferNotification();
                var directAgentTransferResponse =
                    directAgentTransfer.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.DIRECT_AGENT_TRANSFER_NOTIF,
                    directAgentTransferResponse
                );
                break;
            case MESSAGE_TYPES.AGENT_DEBUG_EMAIL:
                var emailNotif = new AdminDebugEmailNotification();
                var emailNotifResp = emailNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.AGENT_DEBUG_EMAIL_NOTIF,
                    emailNotifResp
                );
                break;
            case MESSAGE_TYPES.CHAT_LOAD_MEDIA:
                var loadMediaNotif = new LoadMediaNotification();
                var loadMediaResp = loadMediaNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_LOAD_MEDIA,
                    loadMediaResp
                );
                break;
            case MESSAGE_TYPES.CHAT_AGENT_ASSIGN_FAILURE:
                var chatAgentAssignFailureNotif =
                    new ChatAgentAssignFailureNotification();
                var chatAgentAssignFailureResp =
                    chatAgentAssignFailureNotif.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_AGENT_ASSIGN_FAILURE,
                    chatAgentAssignFailureResp
                );
                break;
            case MESSAGE_TYPES.LOGOUT:
                var logoutNotification = new LogoutRequest();
                var logoutNotifResponse =
                    logoutNotification.processResponse(data);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LOGOUT,
                    logoutNotifResponse
                );
                var model = UIModel.getInstance();

                //remove agent_id and hash_code from local storage
                model.dataStore.remove('agent_id');
                model.dataStore.remove('hash_code');

                // set login flag here in case notification initiated externally
                // and not in response to agent logout request
                model.agentSettings.isLoggedIn = false;

                instance.closeSocket();
                break;
            case MESSAGE_TYPES.MONITOR_CHAT:
                //TODO: do this

                break;
            case MESSAGE_TYPES.LEAVE_CHAT:
                //TODO: do this

                break;
        }
    },

    processDialerResponse: function (instance, response) {
        var type = response.dialer_request['@type'];
        var messageId = response.dialer_request['@message_id'];
        var dest = messageId === '' ? 'IS' : messageId.slice(0, 2);
        var message =
            'Received ' +
            type.toUpperCase() +
            ' dialer response message from ' +
            dest;

        // log message response
        utils.logMessage(LOG_LEVELS.INFO, message, response);

        // Send generic on message response
        utils.fireCallback(instance, CALLBACK_TYPES.ON_MESSAGE, response);

        // Fire callback function
        switch (type.toUpperCase()) {
            case MESSAGE_TYPES.PREVIEW_DIAL_ID:
                var pdRequest = new PreviewDialRequest();
                var dialResponse = pdRequest.processResponse(response);
                if (dialResponse.action.toUpperCase() === 'SEARCH') {
                    utils.fireCallback(
                        instance,
                        CALLBACK_TYPES.LEAD_SEARCH,
                        dialResponse
                    );
                } else {
                    utils.fireCallback(
                        instance,
                        CALLBACK_TYPES.PREVIEW_FETCH,
                        dialResponse
                    );
                }
                break;
            case MESSAGE_TYPES.TCPA_SAFE_ID:
                var tcpaRequest = new TcpaSafeRequest();
                var tcpaResponse = tcpaRequest.processResponse(response);
                if (tcpaResponse.action.toUpperCase() === 'SEARCH') {
                    utils.fireCallback(
                        instance,
                        CALLBACK_TYPES.SAFE_MODE_SEARCH,
                        tcpaResponse
                    );
                } else {
                    utils.fireCallback(
                        instance,
                        CALLBACK_TYPES.SAFE_MODE_FETCH,
                        tcpaResponse
                    );
                }
                break;
        }
    },

    processRequest: function (instance, message) {
        var type = message.ui_request['@type'];

        // Fire callback function
        switch (type.toUpperCase()) {
            case MESSAGE_TYPES.CHAT_SEND:
                var chatSendRequest = new ChatSendRequest();
                var chatSendResponse = chatSendRequest.processResponse(message);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT,
                    chatSendResponse
                );
                break;
            case MESSAGE_TYPES.CHAT_ROOM_STATE:
                var chatRoomStateRequest = new ChatRoomStateRequest();
                var chatRoomStateResponse =
                    chatRoomStateRequest.processResponse(message);
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.CHAT_ROOM_STATE,
                    chatRoomStateResponse
                );
                break;
        }
    },

    processStats: function (instance, data) {
        var type = data.ui_stats['@type'];
        var message =
            'Received ' + type.toUpperCase() + ' response message from IS';

        // store round trip time since last stats request in milliseconds
        var applicationSettings = UIModel.getInstance().applicationSettings;
        if (applicationSettings.statsMsgRequestedTime > 0) {
            applicationSettings.statsRoundtripDurationMs =
                Date.now() - applicationSettings.statsMsgRequestedTime;
            applicationSettings.statsMsgRequestedTime = 0;
        }

        // Fire callback function
        switch (type.toUpperCase()) {
            case MESSAGE_TYPES.STATS_AGENT:
                var agentStats =
                    UIModel.getInstance().agentStatsPacket.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.STATS_AGENT,
                    agentStats
                );
                break;
            case MESSAGE_TYPES.STATS_SUPERVISOR:
                var supervisorStats =
                    UIModel.getInstance().supervisorStatsPacket.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.STATS_SUPERVISOR,
                    supervisorStats
                );
                break;
            case MESSAGE_TYPES.STATS_AGENT_DAILY:
                var agentDailyStats =
                    UIModel.getInstance().agentDailyStatsPacket.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.STATS_AGENT_DAILY,
                    agentDailyStats
                );

                // start currCall and totalOffhookTime interval timer, request update every second
                if (UIModel.getInstance().agentDailyIntervalId === null) {
                    UIModel.getInstance().agentDailyIntervalId = setInterval(
                        utils.onAgentDailyStats,
                        1000
                    );
                }
                break;
            case MESSAGE_TYPES.STATS_CAMPAIGN:
                var campaignStats =
                    UIModel.getInstance().campaignStatsPacket.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.STATS_CAMPAIGN,
                    campaignStats
                );
                break;
            case MESSAGE_TYPES.STATS_QUEUE:
                var queueStats =
                    UIModel.getInstance().queueStatsPacket.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.STATS_QUEUE,
                    queueStats
                );
                break;
            case MESSAGE_TYPES.STATS_CHAT:
                var chatStats =
                    UIModel.getInstance().chatQueueStatsPacket.processResponse(
                        data
                    );
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.STATS_CHAT_QUEUE,
                    chatStats
                );
                break;
        }
    },

    /*
     * Take the xml marked JSON, group and item property names and reformat to
     * simple javascript object without the xml markers.
     * Will work recursively down the tree on nested objects and arrays.
     *
     * example of acceptable response tree (groupProp = requeue_gates, itemProp = gate_group):
     *   "requeue_gates": {
     *       "gate_group": [
     *           {
     *               "@gate_group_id": "4",
     *               "@group_name": "Test Gate Group",
     *               "gates": {
     *                   "gate": [
     *                       {
     *                           "@gate_desc": "",
     *                           "@gate_id": "10951",
     *                           "@gate_name": "CD ACD Queue"
     *                       },
     *                       {
     *                           "@gate_desc": "",
     *                           "@gate_id": "11036",
     *                           "@gate_name": "Xerox Test Gate"
     *                       }
     *                   ]
     *               },
     *               "skills": {
     *                   "skill": [
     *                       {
     *                           "@skill_desc": "",
     *                           "@skill_id": "322",
     *                           "@skill_name": "English"
     *                       },
     *                       {
     *                           "@skill_desc": "",
     *                           "@skill_id": "323",
     *                           "@skill_name": "Spanish"
     *                       }
     *                   ]
     *               }
     *           },
     *           {
     *               "@gate_group_id": "14292",
     *               "@group_name": "New Test Group",
     *               "gates": {
     *                   "gate": {
     *                       "@gate_desc": "",
     *                       "@gate_id": "15535",
     *                       "@gate_name": "New Test Gate"
     *                   }
     *               },
     *               "skills": {
     *                   "skill": {
     *                       "@skill_desc": "",
     *                       "@skill_id": "1658",
     *                       "@skill_name": "new skill"
     *                   }
     *               }
     *           }
     *       ]
     *   }
     *
     *   OR
     *
     *   "outdial_dispositions": {
     *       "@type": "GATE",
     *       "disposition": [
     *          {
     *           "@contact_forwarding": "false",
     *           "@disposition_id": "926",
     *           "@is_complete": "1",
     *           "@require_note": "0",
     *           "@save_survey": "1",
     *           "@xfer": "0",
     *           "#text": "One B"
     *          },
     *          {
     *           "@contact_forwarding": "false",
     *           "@disposition_id": "926",
     *           "@is_complete": "1",
     *           "@require_note": "0",
     *           "@save_survey": "1",
     *           "@xfer": "0",
     *           "#text": "One B"
     *          }
     *      ]
     *   }
     *
     *   OR
     *
     *   "outdial_dispositions": {
     *       "@type": "GATE",
     *       "disposition": {
     *          {
     *           "@contact_forwarding": "false",
     *           "@disposition_id": "926",
     *           "@is_complete": "1",
     *           "@require_note": "0",
     *           "@save_survey": "1",
     *           "@xfer": "0",
     *           "#text": "One B"
     *          }
     *      }
     *   }
     */

    processResponseCollection: function (
        response,
        groupProp,
        itemProp,
        textName
    ) {
        textName = textName || 'text';

        if (
            response[groupProp] &&
            typeof response[groupProp][itemProp] !== 'undefined'
        ) {
            var itemsRaw = response[groupProp][itemProp];
            return this._processItems(itemsRaw, textName);
        } else {
            return [];
        }
    },

    escapeSoftphoneUsername: function (str) {
        return str && str.replace(/[@]/g, '_at_');
    },

    _processItems: function (itemsRaw, textName) {
        var result = [];
        if (typeof itemsRaw === 'undefined' || itemsRaw === null) {
            return result;
        }

        if (!Array.isArray(itemsRaw)) {
            itemsRaw = [itemsRaw];
        }

        for (var i = 0; i < itemsRaw.length; i++) {
            result.push(this._processItem(itemsRaw[i], textName));
        }

        return result;
    },

    _processItem: function (itemRaw, textName) {
        /*
         * Be sure that the item we are processing is not a #text node only, where the "texName" is also "text". If this
         * is the case, it means there's a default value that needs to get converted and isn't going to be mapped to a custom
         * field.  Therefore, we treat it as just a single value, not an object.
         */
        if (
            textName === 'text' &&
            Object.keys(itemRaw).length === 1 &&
            itemRaw['#text'] != null
        ) {
            return this._tryConvertValueToBoolean(itemRaw['#text']);
        }

        // Convert the raw item to a new item, with keys and values processed below
        //
        var item = {};
        for (var key in itemRaw) {
            var formattedKey = this._convertToFormattedKey(key, textName);

            var value = itemRaw[key];

            // If we aren't an object, set the value and continue to next key
            if (typeof value !== 'object') {
                item[formattedKey] = this._tryConvertValueToBoolean(value);
                continue;
            }

            if (
                (Array.isArray(value) && value.length === 0) ||
                Object.keys(value).length === 0
            ) {
                // Empty property
                item[formattedKey] = '';
            } else if (Array.isArray(value) || Object.keys(value).length > 1) {
                // Array or object with more than one key
                formattedKey = this._convertKeyForCollection(formattedKey);
                item[formattedKey] = this._processItems(value, textName);
            } else if (
                Object.keys(value).length === 1 &&
                value['#text'] != null
            ) {
                // One property of type "#text"
                item[formattedKey] = value['#text'];
            } else {
                // One property not with key "#text"
                item[formattedKey] = this._processItems(
                    value[Object.keys(value)[0]],
                    'text'
                );
            }
        }

        return item;
    },

    _convertToFormattedKey: function (key, textName) {
        var formattedKey;
        if (key.match(/^#/)) {
            // dealing with text property
            formattedKey = textName;
        } else {
            // dealing with attribute
            formattedKey = key.replace(/@/, ''); // remove leading '@'
            formattedKey = formattedKey.replace(/_([a-z])/g, function (g) {
                return g[1].toUpperCase();
            }); // convert to camelCase
        }

        return formattedKey;
    },

    _convertKeyForCollection: function (formattedKey) {
        if (formattedKey.substr(formattedKey.length - 1) !== 's') {
            return formattedKey + 's';
        }

        return formattedKey;
    },

    _tryConvertValueToBoolean: function (value) {
        if (value === null) {
            return null;
        }

        // can't convert 0 | 1 to boolean since some are counters
        if (value.toUpperCase() === 'TRUE') {
            return true;
        } else if (value.toUpperCase() === 'FALSE') {
            return false;
        } else {
            return value;
        }
    },

    fireCallback: function (instance, type, response) {
        response = response || '';
        if (
            typeof type !== 'undefined' &&
            typeof instance.callbacks[type] === 'function'
        ) {
            instance.callbacks[type].call(instance, response);
        }
    },

    setCallback: function (instance, type, callback) {
        if (typeof type !== 'undefined' && typeof callback !== 'undefined') {
            instance.callbacks[type] = callback;
        }
    },

    getMessageId: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return (
            s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4()
        );
    },

    // check whether the given array of ids exist in the given array of objects
    // if not available, remove the id
    // returns the clean list of acceptable ids
    checkExistingIds: function (objArray, idArray, idProperty) {
        var availIds = [];
        var removeIds = [];

        // get list of available ids
        for (var o = 0; o < objArray.length; o++) {
            availIds.push(parseInt(objArray[o][idProperty], 10));
        }

        // go through selected ids and mark unfound ones for removal
        for (var i = 0; i < idArray.length; i++) {
            if (availIds.indexOf(parseInt(idArray[i], 10)) === -1) {
                // selected id not found in available list, mark for removal
                removeIds.push(parseInt(idArray[i], 10));
            }
        }

        // remove marked ids
        for (var r = idArray.length - 1; r >= 0; r--) {
            if (removeIds.indexOf(parseInt(idArray[r], 10)) > -1) {
                // remove
                idArray.splice(r, 1);
            }
        }

        return idArray;
    },

    // find an object by given id in an array of objects
    findObjById: function (objArray, id, propName) {
        for (var o = 0; o < objArray.length; o++) {
            var obj = objArray[o];
            if (obj[propName] === id) {
                return obj;
            }
        }

        return null;
    },

    // check whether agent dialDest is either a 10-digit number or valid sip
    validateDest: function (dialDest) {
        var isValid = false;
        var isNum = /^\d+$/.test(dialDest);
        if (isNum && dialDest.length === 10) {
            // is a 10-digit number
            isValid = true;
        } else if (
            dialDest.slice(0, 4).toLowerCase() === 'sip:' &&
            dialDest.indexOf('@') !== -1
        ) {
            // has sip prefix and '@'
            isValid = true;
        }

        return isValid;
    },

    // pass in MESSAGE_TYPE string (e.g. "CANCEL-CALLBACK"),
    // return corresponding CALLBACK_TYPE function name string (e.g. "callbackCancelResponse")
    findCallbackBasedOnMessageType: function (messageType) {
        var callbackFnName = '';
        for (var key in MESSAGE_TYPES) {
            if (MESSAGE_TYPES[key] === messageType) {
                callbackFnName = CALLBACK_TYPES[key];
            }
        }
        return callbackFnName;
    },

    // add message, detail, and status values to the formattedResponse
    // returned from each request processResponse method
    buildDefaultResponse: function (response, includeOpId) {
        includeOpId = includeOpId || false; // default to false, the ES5 way
        var message = '';
        var detail = '';
        var status = '';
        var operationId = '';

        var msg = '';
        var det = '';
        var stat = '';
        var opId = '';

        // add properties if present
        if (response.ui_response) {
            msg = response.ui_response.message;
            det = response.ui_response.detail;
            stat = response.ui_response.status;
            opId = response.ui_response.operation_id;
        } else if (response.ui_notification) {
            msg = response.ui_notification.message;
            det = response.ui_notification.detail;
            stat = response.ui_notification.status;
            opId = response.ui_notification.operation_id;
        }

        if (msg) {
            message = msg['#text'] || '';
        }
        if (det) {
            detail = det['#text'] || '';
        }
        if (stat) {
            status = stat['#text'] || '';
        }
        if (opId) {
            operationId = opId['#text'] || '';
        }

        var returnMsg = {
            message: message,
            detail: detail,
            status: status,
        };

        if (includeOpId) {
            returnMsg.operationId = operationId;
        }

        return returnMsg;
    },

    toString: function (val) {
        if (val) {
            return val.toString();
        } else {
            return '';
        }
    },

    // safely check for value from given property
    // return empty string instead of undefined if it doesn't exist
    getValue: function (obj, prop) {
        var o = obj[prop];
        if (o) {
            return o || '';
        } else {
            return '';
        }
    },

    // safely check if property exists and return empty string
    // instead of undefined if it doesn't exist
    // convert "TRUE" | "FALSE" to boolean
    getText: function (obj, prop) {
        var o = obj[prop];
        if (o && o['#text']) {
            if (o['#text'].toUpperCase() === 'TRUE') {
                return true;
            } else if (o['#text'].toUpperCase() === 'FALSE') {
                return false;
            } else {
                return o['#text'] || '';
            }
        } else {
            return '';
        }
    },

    // safely check if property exists and return empty string
    // instead of undefined if it doesn't exist
    getTextString: function (obj, prop) {
        var o = obj[prop];
        if (o && o['#text']) {
            return o['#text'] || '';
        } else {
            return '';
        }
    },

    // safely check if property exists and return empty string
    // instead of undefined if it doesn't exist
    // convert "TRUE" | "FALSE" to boolean
    getAttribute: function (obj, prop) {
        var o = obj[prop];
        if (o && o[prop]) {
            if (o[prop].toUpperCase() === 'TRUE') {
                return true;
            } else if (o[prop].toUpperCase() === 'FALSE') {
                return false;
            } else {
                return o[prop] || '';
            }
        } else {
            return '';
        }
    },

    getEdValue: function (list, id) {
        var idx;
        var isCached = false;
        var name = '';
        var color; // only present for source objects

        if (list) {
            for (idx = 0; idx < list.length; idx++) {
                if (list[idx].id === id) {
                    name = list[idx].name;
                    isCached = true;
                    if (list[idx].color) {
                        color = list[idx].color;
                    }
                }
            }
        }

        var returnObj = { isCached: isCached, name: name };
        if (color) {
            returnObj.color = color;
        }

        return returnObj;
    },

    getMultiEdValues: function (searchList, ids) {
        var idIndex;
        var edValue;
        var isCached = false;
        var names = [];

        if (searchList) {
            for (idIndex = 0; idIndex < ids.length; idIndex++) {
                edValue = utils.getEdValue(searchList, ids[idIndex]);
                names.push(edValue.name);
                if (edValue.isCached) {
                    isCached = true;
                }
            }
        }
        return { isCached: isCached, names: names };
    },

    // Parses a string of key value pairs and returns an Array of KeyValue objects.
    // @param str The string of keyvalue pairs to parse
    // @param outerDelimiter The delimiter that separates each keyValue pair
    // @param innerDelimiter The delimiter that separates each key from its value
    parseKeyValuePairsFromString: function (
        str,
        outerDelimiter,
        innerDelimiter
    ) {
        if (!str) {
            return [];
        }

        var arr = str.split(outerDelimiter).reduce(function (dict, pair) {
            var keyValue = pair.split(innerDelimiter);
            dict[keyValue[0]] = keyValue[1];
            return dict;
        }, {});

        return arr;
    },

    // Finds a request by responseTo id
    findRequestById: function (instance, id) {
        var request = null;
        for (var i = 0; i < instance._requests.length; i++) {
            if (instance._requests[i].id === id) {
                request = instance._requests[i];
                break;
            }
        }
        return request;
    },

    // called every 30 seconds letting intelliQueue know
    // not to archive the call so dispositions and other call
    // clean up actions can happen
    sendPingCallMessage: function () {
        UIModel.getInstance().pingCallRequest = new PingCallRequest();
        var msg = UIModel.getInstance().pingCallRequest.formatJSON();
        var msgObj = JSON.parse(msg);
        var agentId = utils.getText(msgObj.ui_request, 'agent_id');
        var uii = utils.getText(msgObj.ui_request, 'uii');
        if (agentId === '' || uii === '') {
            utils.logMessage(
                LOG_LEVELS.WARN,
                'PING-CALL message failed, agentId or UII is empty',
                msgObj
            );
        } else {
            utils.sendMessage(UIModel.getInstance().libraryInstance, msg);
        }
    },

    // called every 5 seconds to request stats from IntelliServices
    sendStatsRequestMessage: function () {
        var model = UIModel.getInstance();
        var msg = model.statsRequest.formatJSON();
        if (model.applicationSettings.statsMsgRequestedTime === 0) {
            model.applicationSettings.statsMsgRequestedTime = Date.now();
        }

        utils.sendMessage(model.libraryInstance, msg);
        return msg;
    },

    // called every 20 seconds to ping IntelliSocket whent stats are disabled
    sendPingRequestMessage: function () {
        var msg = 'BEAT';
        var instance = UIModel.getInstance().libraryInstance;
        if (instance.socket && instance.socket.readyState === 1) {
            instance.socket.send('BEAT');
        }
    },

    // called every second if we have received agent daily stats start incrementing currCallTime and totalOffhookTime
    onAgentDailyStats: function () {
        if (Object.keys(UIModel.getInstance().agentDailyStats).length !== 0) {
            var agentSettings = UIModel.getInstance().agentSettings,
                stats = UIModel.getInstance().agentDailyStats;

            if (agentSettings.isOffhook) {
                var curOffhookTime = stats.totalOffhookTime;
                stats.totalOffhookTime = Number(curOffhookTime) + 1;
            }

            if (agentSettings.currentState === 'ENGAGED') {
                var currCallTime = stats.currCallTime;
                stats.currCallTime = Number(currCallTime) + 1;
            }
        }
    },

    // called in loginAgent if 'integrated' dial destination passed in
    getDialDestination: function () {
        var model = UIModel.getInstance();
        var softphoneSettings = model.softphoneSettings;
        var dialDestType = model.applicationSettings.dialDestType;

        var dialDest = '';

        // default to the first server in the array
        if (softphoneSettings.sipInfo.length > 0) {
            var currentServer = softphoneSettings.sipInfo[0];
            if (dialDestType === 'LEGACY_SOFTPHONE') {
                dialDest =
                    'sip:' +
                    utils.escapeSoftphoneUsername(currentServer.username) +
                    '@' +
                    currentServer.domain;
            } else if (dialDestType === 'RC_SOFTPHONE') {
                dialDest =
                    utils.escapeSoftphoneUsername(currentServer.username) +
                    '@RC_SOFTPHONE';
            }
        }

        return dialDest;
    },

    // get valid access token based on agentId and login hash code
    refreshAccessToken: function () {
        var model = UIModel.getInstance();
        var baseUrl = model.authHost + model.baseAuthUri;
        var errorMsg = 'Error in refreshing access token';
        var params = {
            queryParams: {
                loginHashcode: model.connectionSettings.hashCode,
                agentId: model.agentSettings.agentId,
                platformId: model.authenticateRequest.platformId,
                isSso: model.applicationSettings.isSso,
            },
        };

        return new HttpService(baseUrl)
            .httpPost('login/agent/hashcode', params)
            .then(
                function (response) {
                    try {
                        response = JSON.parse(response.response);
                        UIModel.getInstance().authenticateRequest.engageAccessToken =
                            response.accessToken;
                    } catch (err) {
                        utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                    }
                },
                function (err) {
                    var errResponse = {
                        type: 'refreshAccessToken Error',
                        message: errorMsg,
                    };
                    utils.logMessage(LOG_LEVELS.WARN, errResponse, err);
                }
            );
    },

    // return random string of length given
    generateOpId: function (length) {
        length = length || 24;
        var CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyz';

        var result = '';
        for (var i = length; i > 0; --i) {
            result +=
                CHARACTERS[Math.round(Math.random() * (CHARACTERS.length - 1))];
        }
        return result;
    },

    parseJwt: function (token) {
        try {
            return JSON.parse(window.atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    },

    /**
     * utils.getConsoleLogData Console Log data for Report call quality,
     * @return promise
     */

    getConsoleLogData: function () {
        return new Promise(function (resolve, reject) {
            try {
                UIModel.getInstance().libraryInstance.getConsoleLogRecords(
                    null,
                    function (response) {
                        resolve(
                            JSON.stringify(
                                utils.handleConsoleLogMessages(response)
                            )
                        );
                    }
                );
            } catch (error) {
                reject(JSON.stringify(error));
            }
        });
    },

    /**
     * helper function to parse multiple console log messages into a readable string
     * @param {array of console log messages} msgArray
     * @returns
     */
    handleConsoleLogMessages: function (msgArray) {
        return msgArray
            .map(function (r) {
                return r.message;
            })
            .reverse()
            .join(' ');
    },

    /**
     * utils.getDebugLogData Debug Log data for Report call quality,
     * @return promise
     */

    getDebugLogData: function () {
        return new Promise(function (resolve, reject) {
            try {
                var startDate = new Date(
                    new Date().setHours(new Date().getHours() - 4)
                );
                var endDate = new Date();

                UIModel.getInstance().libraryInstance.getLogRecords(
                    'all',
                    startDate,
                    endDate,
                    undefined,
                    function (res) {
                        resolve(JSON.stringify(res));
                    }
                );
            } catch (error) {
                reject(JSON.stringify(error));
            }
        });
    },

    _isStatOrBeatMessage: function (msgType, msg) {
        return msgType === 'STAT' || msg === 'BEAT';
    },
};

const AGENT_LIBRARY_COMPONENT_NAME = 'SDK';
const ENGAGE_CLIENT_REQUEST_ID_HEADER_NAME = 'x-engage-client-request-id';

var RequestLoggingService = (function () {
    var __componentName__ = AGENT_LIBRARY_COMPONENT_NAME;

    function _generateClientRequestId() {
        return __componentName__ + ':' + utils.getMessageId();
    }

    return {
        setComponentName: function (componentName) {
            __componentName__ = componentName;
        },
        getLoggingHeaders: function () {
            var loggingHeaders = {};

            loggingHeaders[ENGAGE_CLIENT_REQUEST_ID_HEADER_NAME] =
                _generateClientRequestId();

            return loggingHeaders;
        },
        getLoggingQueryParameters: function () {
            var queryParameters = '';

            queryParameters +=
                '&' +
                ENGAGE_CLIENT_REQUEST_ID_HEADER_NAME +
                '=' +
                _generateClientRequestId();

            return queryParameters;
        },
    };
})();

// CONSTANTS

/*jshint esnext: true */
const LOG_LEVELS = {
    DEBUG: 'debug',
    STATS: 'stats',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
};

const AUTHENTICATE_TYPES = {
    USERNAME_PASSWORD: 'USERNAME_PASSWORD',
    RC_TOKEN: 'RC_TOKEN',
    ENGAGE_TOKEN: 'ENGAGE_TOKEN',
};
const MAX_OFFLINE_MESSAGES_TO_PROCESS = 100;
// sent on chatPresented, newChat, chatActive, and chatInactive notifications
const CHAT_TYPE = {
    LEGACY: 'LEGACY',
    ENGAGE_DIGITAL: 'ENGAGE_DIGITAL',
};

const COMMON_CALLBACK_TYPES = Object.freeze({
    AUTHENTICATE: 'authenticateResponse',
    OFFHOOK_TERM: 'offhookTermNotification',
    WEBRTC_INFO: 'webRtcInfoResponse',
});

const AGENT_CALLBACK_TYPES = Object.freeze(
    Object.assign({}, COMMON_CALLBACK_TYPES, {
        ACK: 'acknowledgeResponse',
        ADD_SESSION: 'addSessionNotification',
        AGENT_DEBUG_EMAIL_NOTIF: 'agentDebugEmailNotification',
        AGENT_STATE: 'agentStateResponse',
        BARGE_IN: 'bargeInResponse',
        CALLBACK_CANCEL: 'callbackCancelResponse',
        CALLBACK_PENDING: 'callbacksPendingResponse',
        CALL_NOTES: 'callNotesResponse',
        CAMPAIGN_DISPOSITIONS: 'campaignDispositionsResponse',
        CHAT: 'chatResponse', // internal chat
        CHAT_ACTIVE: 'chatActiveNotification', // external chat
        CHAT_CANCELLED: 'chatCancelledNotification', // external chat
        CHAT_CLIENT_RECONNECT: 'chatClientReconnectNotification',
        CHAT_INACTIVE: 'chatInactiveNotification', // external chat
        CHAT_LIST: 'chatListResponse', // external chat
        CHAT_LOAD_MEDIA: 'chatLoadMediaResponse', // engage digital task
        CHAT_AGENT_ASSIGN_FAILURE: 'chatAgentAssignFailureResponse', // engage digital task
        CHAT_MESSAGE: 'chatMessageNotification', // external chat
        CHAT_NEW: 'chatNewNotification', // external chat
        CHAT_PRESENTED: 'chatPresentedNotification', // external chat
        CHAT_ROOM_STATE: 'chatRoomStateResponse',
        CHAT_STATE: 'chatStateResponse', // external chat
        CHAT_STOP_MONITOR: 'stopAgentChatMonitorNotification', // external chat
        CHAT_TYPING: 'chatTypingNotification', // external chat
        CLOSE_SOCKET: 'closeResponse',
        COACH_CALL: 'coachResponse',
        CONFIG: 'configureResponse',
        DIAL_GROUP_CHANGE: 'dialGroupChangeNotification',
        DIAL_GROUP_CHANGE_PENDING: 'dialGroupChangePendingNotification',
        DIRECT_AGENT_TRANSFER: 'directAgentTransferResponse',
        DIRECT_AGENT_TRANSFER_LIST: 'directAgentTransferListResponse',
        DIRECT_AGENT_TRANSFER_NOTIF: 'directAgentTransferNotification',
        DROP_SESSION: 'dropSessionNotification',
        EARLY_UII: 'earlyUiiNotification',
        END_CALL: 'endCallNotification',
        GATES_CHANGE: 'gatesChangeNotification',
        GENERIC_NOTIFICATION: 'genericNotification',
        GENERIC_RESPONSE: 'genericResponse',
        HOLD: 'holdResponse',
        LEAD_HISTORY: 'leadHistoryResponse',
        LEAD_INSERT: 'leadInsertResponse',
        LEAD_SEARCH: 'leadSearchResponse',
        LEAD_UPDATE: 'leadUpdateResponse',
        LOGIN: 'loginResponse',
        LOGIN_PHASE_1: 'loginPhase1Response',
        LOGIN_MULTISOCKET: 'multiSocketResponse',
        LOGOUT: 'logoutResponse',
        LOG_CONSOLE_RESULTS: 'logConsoleResultsResponse',
        LOG_RESULTS: 'logResultsResponse',
        NEW_CALL: 'newCallNotification',
        OFFHOOK_INIT: 'offhookInitResponse',
        OPEN_SOCKET: 'openResponse',
        PAUSE_RECORD: 'pauseRecordResponse',
        PENDING_CHAT_DISP: 'pendingChatDispNotification',
        PENDING_DISP: 'pendingDispNotification',
        PREVIEW_FETCH: 'previewFetchResponse',
        PREVIEW_LEAD_STATE: 'previewLeadStateNotification',
        RECORD: 'recordResponse',
        REQUEUE: 'requeueResponse',
        REQUEST_SUMMARY: 'summaryRequest',
        REVERSE_MATCH: 'reverseMatchNotification',
        SAFE_MODE_FETCH: 'safeModeFetchResponse',
        SAFE_MODE_SEARCH: 'safeModeSearchResponse',
        SCRIPT_CONFIG: 'scriptConfigResponse',
        SILENT_MONITOR: 'monitorResponse',
        STATS_AGENT: 'agentStats',
        STATS_SUPERVISOR: 'supervisorStats',
        STATS_AGENT_DAILY: 'agentDailyStats',
        STATS_CAMPAIGN: 'campaignStats',
        STATS_CHAT_QUEUE: 'chatQueueStats',
        STATS_QUEUE: 'queueStats',
        SUPERVISOR_LIST: 'supervisorListResponse',
        TCPA_SAFE_LEAD_STATE: 'tcpaSafeLeadStateNotification',
        XFER_COLD: 'coldXferResponse',
        XFER_WARM: 'warmXferResponse',
        SEARCH_DIR: 'searchDirectoryResponse',
        EXTENSION_PRESENCE: 'extensionPresenceInfo',
    })
);

const SOFTPHONE_CALLBACK_TYPES = Object.freeze(
    Object.assign({}, COMMON_CALLBACK_TYPES, {
        UPDATE_DIAL_DEST: 'updateDialDestination',
        REFRESH_TOKEN: 'getRefreshedToken',

        SIP_CONNECTED: 'sipConnectedNotification',
        SIP_DIAL_DEST_CHANGED: 'sipDialDestChangedNotification',
        SIP_ENDED: 'sipEndedNotification',
        SIP_MUTE: 'sipMuteResponse',
        SIP_REGISTERED: 'sipRegisteredNotification',
        SIP_REGISTRATION_FAILED: 'sipRegistrationFailedNotification',
        SIP_RINGING: 'sipRingingNotification',
        SIP_SWITCH_REGISTRAR: 'sipSwitchRegistrarNotification',
        SIP_UNMUTE: 'sipUnmuteResponse',
        SIP_UNREGISTERED: 'sipUnregisteredNotification',
    })
);

// add all callback types to setCallback method description
const CALLBACK_TYPES = Object.freeze(
    Object.assign({}, AGENT_CALLBACK_TYPES, SOFTPHONE_CALLBACK_TYPES)
);

const MESSAGE_TYPES = {
    ACK: 'ACK',
    ADD_SESSION: 'ADD-SESSION',
    AGENT_DEBUG_EMAIL: 'AGENT-DEBUG-EMAIL',
    AGENT_STATE: 'AGENT-STATE',
    BARGE_IN: 'BARGE-IN',
    CALLBACK_CANCEL: 'CANCEL-CALLBACK',
    CALLBACK_PENDING: 'PENDING-CALLBACKS',
    CALL_NOTES: 'CALL-NOTES',
    CAMPAIGN_DISPOSITIONS: 'CAMPAIGN-DISPOSITIONS',
    CHAT_ACTIVE: 'CHAT-ACTIVE', // external chat
    CHAT_AGENT_END: 'CHAT-END', // external chat
    CHAT_ALIAS: 'CHAT-ALIAS', // internal chat
    CHAT_CANCELLED: 'CHAT-CANCELLED', // external chat
    CHAT_CLIENT_RECONNECT: 'CHAT-CLIENT-RECONNECT', // external chat
    CHAT_DISPOSITION: 'CHAT-DISPOSITION', // external chat
    CHAT_INACTIVE: 'CHAT-INACTIVE', // external chat
    CHAT_LIST: 'CHAT-LIST', // external chat
    CHAT_MANUAL_SMS: 'MANUAL-SMS', // external chat
    CHAT_MESSAGE: 'CHAT-MESSAGE', // external chat
    CHAT_NEW: 'NEW-CHAT', // external chat
    CHAT_PRESENTED: 'CHAT-PRESENTED', // external chat
    CHAT_PRESENTED_RESPONSE: 'CHAT-PRESENTED-RESPONSE', // external chat
    CHAT_REQUEUE: 'CHAT-REQUEUE', // external chat
    CHAT_ROOM: 'CHAT-ROOM', // internal chat
    CHAT_ROOM_STATE: 'CHAT-ROOM-STATE', // internal chat
    CHAT_SEND: 'CHAT', // internal chat
    CHAT_STATE: 'CHAT-STATE', // external chat
    CHAT_TYPING: 'CHAT-TYPING', // external chat
    CHAT_LOAD_MEDIA: 'LOAD-MEDIA', // engage digital task
    CHAT_AGENT_ASSIGN_FAILURE: 'CHAT-AGENT-ASSIGN-FAILURE', // engage digital task
    DIAL_GROUP_CHANGE: 'DIAL_GROUP_CHANGE',
    DIAL_GROUP_CHANGE_PENDING: 'DIAL_GROUP_CHANGE_PENDING',
    DIRECT_AGENT_ROUTE: 'DIRECT-AGENT-ROUTE',
    DIRECT_AGENT_TRANSFER: 'DIRECT-AGENT-TRANSFER',
    DIRECT_AGENT_TRANSFER_LIST: 'DIRECT-AGENT-TRANSFER-LIST',
    DROP_SESSION: 'DROP-SESSION',
    EARLY_UII: 'EARLY_UII',
    END_CALL: 'END-CALL',
    GATES_CHANGE: 'GATES_CHANGE',
    GENERIC: 'GENERIC',
    HANGUP: 'HANGUP',
    HOLD: 'HOLD',
    INBOUND_DISPOSITION: 'INBOUND-DISPOSITION',
    LEAD_HISTORY: 'LEAD-HISTORY',
    LEAD_INSERT: 'LEAD-INSERT',
    LEAD_UPDATE: 'LEAD-UPDATE',
    LEAVE_CHAT: 'CHAT-DROP-SESSION', // external chat
    LOGIN: 'LOGIN',
    LOGIN_PHASE_1: 'LOGIN-PHASE-1',
    LOGIN_MULTISOCKET: 'MULTISOCKET',
    LOGOUT: 'LOGOUT',
    MONITOR_CHAT: 'CHAT-MONITOR', // external chat
    NEW_CALL: 'NEW-CALL',
    OFFHOOK_INIT: 'OFF-HOOK-INIT',
    OFFHOOK_TERM: 'OFF-HOOK-TERM',
    ONE_TO_ONE_OUTDIAL: 'ONE-TO-ONE-OUTDIAL',
    ONE_TO_ONE_OUTDIAL_CANCEL: 'ONE-TO-ONE-OUTDIAL-CANCEL',
    ON_MESSAGE: 'ON-MESSAGE',
    OUTDIAL_DISPOSITION: 'OUTDIAL-DISPOSITION',
    PAUSE_RECORD: 'PAUSE-RECORD',
    PENDING_CHAT_DISP: 'PENDING-CHAT-DISP', // external chat
    PENDING_DISP: 'PENDING_DISP',
    PING_CALL: 'PING-CALL',
    PREVIEW_DIAL: 'PREVIEW-DIAL',
    PREVIEW_DIAL_ID: 'PREVIEW_DIAL',
    PREVIEW_LEAD_STATE: 'PREVIEW-LEAD-STATE',
    RECORD: 'RECORD',
    REQUEUE: 'RE-QUEUE',
    REQUEST_SUMMARY: 'REQUEST-SUMMARY',
    REVERSE_MATCH: 'REVERSE_MATCH',
    SCRIPT_CONFIG: 'SCRIPT-CONFIG',
    SCRIPT_RESULT: 'SCRIPT-RESULT',
    STATS: 'STATS',
    STATS_AGENT: 'AGENT',
    STATS_SUPERVISOR: 'SUPERVISOR',
    STATS_AGENT_DAILY: 'AGENTDAILY',
    STATS_CAMPAIGN: 'CAMPAIGN',
    STATS_CHAT: 'CHAT',
    STATS_QUEUE: 'GATE',
    STOP_MONITOR_CHAT: 'CHAT-DROP-MONITORING-SESSION', // external chat
    SUPERVISOR_LIST: 'SUPERVISOR-LIST', // internal chat
    TCPA_SAFE: 'TCPA-SAFE',
    TCPA_SAFE_ID: 'TCPA_SAFE',
    TCPA_SAFE_LEAD_STATE: 'TCPA-SAFE-LEAD-STATE',
    UPDATE_DIAL_DESTINATION: 'UPDATE_DIAL_DESTINATION',
    XFER_COLD: 'COLD-XFER',
    XFER_WARM: 'WARM-XFER',
    XFER_WARM_CANCEL: 'WARM-XFER-CANCEL',
    // SOFTPHONE message types
    SETUP_WEB_RTC_SERVER: 'SETUP_WEB_RTC_SERVER',
    SIP_INIT: 'SIP_INIT',
    SIP_ANSWER: 'SIP_ANSWER',
    SIP_REJECT: 'SIP_REJECT',
    SIP_REGISTER: 'SIP_REGISTER',
    SIP_HANGUP: 'SIP_HANGUP',
    SIP_SEND_DTMF: 'SIP_SEND_DTMF',
    SIP_TOGGLE_MUTE: 'SIP_TOGGLE_MUTE',
    SOFTPHONE_RESET_SESSION: 'SOFTPHONE_RESET_SESSION',
    SWITCH_SOFTPHONE_REGISTRAR: 'SWITCH_SOFTPHONE_REGISTRAR',
};

/**
 * Returns that type is softphone callback type or not
 * @param {string} type - Callback type to check
 * @returns boolean
 */
const isSoftphoneCallbackType = (function () {
    const softphoneCallbackTypes = new Set(
        Object.values(SOFTPHONE_CALLBACK_TYPES)
    );

    return function (type) {
        return softphoneCallbackTypes.has(type);
    };
})();

/**
 * Returns that type is agent callback type or not
 * @param {string} type - Callback type to check
 * @returns boolean
 */
const isAgentCallbackType = (function () {
    const agentCallbackTypes = new Set(Object.values(AGENT_CALLBACK_TYPES));

    return function (type) {
        return agentCallbackTypes.has(type);
    };
})();

/**
 * Returns that type is agent and softphone callback type or not
 * @param {string} type - Callback type to check
 * @returns boolean
 */
const isCommonCallbackType = function (type) {
    return isSoftphoneCallbackType(type) && isAgentCallbackType(type);
};

/*
 * Init wrapper for the core module.
 * @param {Object} The Object that the library gets attached to in
 * library.init.js.  If the library was not loaded with an AMD loader such as
 * require.js, this is the global Object.
 */
function initAgentLibraryCore(context) {
    'use strict';

    /**
     * This is the constructor for the Library Object. Note that the constructor is also being
     * attached to the context that the library was loaded in.
     * @param {Object} [config={}] Set authHost, if the WebSocket should be secure or not with the testingLocal boolean, and callback functions.
     * @constructor
     * @namespace Core
     * @memberof AgentLibrary
     * @property {object} callbacks Internal map of registered callback functions
     * @property {string} componentName Name of application which uses SDK
     * @property {array} _requests Internal map of requests by message id, private property.
     * @property {array} _queuedMsgs Array of pending messages to be sent when socket reconnected
     * @property {boolean} _isReconnect Whether or not we are doing a reconnect for the socket
     * @example
      var Lib = new AgentLibrary({
           authHost:'d01-test.cf.dev:8080', // window.location.origin
           testingLocal: true,
           allowMultiSocket: true,
           componentName: 'EAG',
           callbacks: {
               closeResponse: onCloseFunction,
               openResponse: onOpenFunction
           }
      });
     */
    var AgentLibrary = (context.AgentLibrary = function (config) {
        config = config || {};

        // define properties
        this.callbacks = {};
        this.softphoneCallbacks = {};
        this.componentName = AGENT_LIBRARY_COMPONENT_NAME;

        this._requests = [];
        this._queuedMsgs = [];
        this._isReconnect = false;

        // start with new model instance
        UIModel.resetInstance();

        // set instance on model object
        UIModel.getInstance().libraryInstance = this;

        // initialize indexedDB for logging
        this.openLogger();
        this.openConsoleLogger();

        // set default values
        if (typeof config.callbacks !== 'undefined') {
            this.callbacks = config.callbacks;
        }

        if (typeof config.authHost !== 'undefined') {
            UIModel.getInstance().authHost = config.authHost;
        }

        if (config.isSecureSocket !== 'undefined') {
            if (typeof config.isSecureSocket === 'string') {
                config.isSecureSocket =
                    config.isSecureSocket.toLowerCase() === 'true';
            }

            if (config.isSecureSocket) {
                UIModel.getInstance().socketProtocol = 'wss://';
            } else {
                UIModel.getInstance().socketProtocol = 'ws://';
            }
        }

        if (typeof config.componentName === 'string') {
            this.componentName = config.componentName;
            RequestLoggingService.setComponentName(this.componentName);
        }

        UIModel.getInstance().applicationSettings.allowMultiSocket =
            config.allowMultiSocket === true;

        return this;
    });

    /**
     * Set multiple callback functions based on type
     * @memberof AgentLibrary.Core
     * @param {Object} callbackMap Contains map of callback types to their respective functions:<br />
     * <tt>callbackMap = {<br />
     *      closeResponse: onCloseFunction,<br />
     *      openResponse: onOpenFunction<br />
     * }
     * </tt>
     *<br />
     * Possible callback types:
     * <li>"addSessionNotification"</li>
     * <li>"agentStateResponse"</li>
     * <li>"acknowledgeResponse"</li>
     * <li>"bargeInResponse"</li>
     * <li>"closeResponse"</li>
     * <li>"coachResponse"</li>
     * <li>"configureResponse"</li>
     * <li>"callNotesResponse"</li>
     * <li>"callbacksPendingResponse"</li>
     * <li>"callbackCancelResponse"</li>
     * <li>"campaignDispositionsResponse"</li>
     * <li>"chatResponse"</li>
     * <li>"dialGroupChangeNotification"</li>
     * <li>"dialGroupChangePendingNotification"</li>
     * <li>"dropSessionNotification"</li>
     * <li>"earlyUiiNotification"</li>
     * <li>"endCallNotification"</li>
     * <li>"gatesChangeNotification"</li>
     * <li>"genericNotification"</li>
     * <li>"genericResponse"</li>
     * <li>"holdResponse"</li>
     * <li>"leadSearchResponse"</li>
     * <li>"loginResponse"</li>
     * <li>"logoutResponse"</li>
     * <li>"monitorResponse"</li>
     * <li>"newCallNotification"</li>
     * <li>"offhookInitResponse"</li>
     * <li>"offhookTermNotification"</li>
     * <li>"openResponse"</li>
     * <li>"pauseRecordResponse"</li>
     * <li>"pendingDispNotification"</li>
     * <li>"previewFetchResponse"</li>
     * <li>"previewLeadStateNotification"</li>
     * <li>"recordResponse"</li>
     * <li>"requeueResponse"</li>
     * <li>"reverseMatchNotification"</li>
     * <li>"safeModeFetchResponse"</li>
     * <li>"safeModeSearchResponse"</li>
     * <li>"scriptConfigResponse"</li>
     * <li>"supervisorListResponse"</li>
     * <li>"coldXferResponse"</li>
     * <li>"warmXferResponse"</li>
     * <li>"agentStats"</li>
     * <li>"agentDailyStats"</li>
     * <li>"campaignStats"</li>
     * <li>"queueStats"</li>
     * <li>"chatQueueStats"</li>
     * <li>"supervisorStats"</li>
     * @type {object}
     */
    AgentLibrary.prototype.setCallbacks = function (callbackMap) {
        for (var type in callbackMap) {
            this.setCallback(type, callbackMap[type]);
        }
    };

    /**
     * Set an individual callback function for the given type
     * @memberof AgentLibrary.Core
     * @param {string} type The name of the event that fires the callback function
     * @param {function} callback The function to call for the given type
     */
    AgentLibrary.prototype.setCallback = function (type, callback) {
        if (typeof type !== 'string') {
            window.console.warn(
                'type is not defined or has invalid type',
                type
            );
            return;
        }

        if (typeof callback !== 'function') {
            window.console.warn(
                'callback is not defined or has invalid type',
                callback
            );
            return;
        }

        switch (true) {
            case isCommonCallbackType(type): {
                this.callbacks[type] = callback;
                this.softphoneCallbacks[type] = callback;
                this._SoftphoneService.setCallback(type, callback);
                break;
            }

            case isAgentCallbackType(type): {
                this.callbacks[type] = callback;
                break;
            }

            case isSoftphoneCallbackType(type): {
                this.softphoneCallbacks[type] = callback;
                this._SoftphoneService.setCallback(type, callback);
                break;
            }

            default:
                window.console.warn(
                    'Try to set Unsupported callback type:',
                    type
                );
        }
    };

    /**
     * Get the map of all registered callbacks
     * @memberof AgentLibrary.Core
     * @returns {array}
     */
    AgentLibrary.prototype.getCallbacks = function () {
        return Object.assign({}, this.callbacks, this.softphoneCallbacks);
    };

    /**
     * Get a given registered callback by type
     * @memberof AgentLibrary.Core
     * @returns {object}
     */
    AgentLibrary.prototype.getCallback = function (type) {
        return this.callbacks[type] || this.softphoneCallbacks[type];
    };

    /**
     * Get the socket connection to IntelliSocket
     * @memberof AgentLibrary.Core
     * @returns {object}
     */
    AgentLibrary.prototype.getSocket = function (type) {
        return this.socket;
    };

    /**
     * @namespace Requests
     * @memberof AgentLibrary.Core
     */

    ////////////////////////////
    // requests and responses //
    ////////////////////////////
    /**
     * Get outgoing Authenticate Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAuthenticateRequest = function () {
        return UIModel.getInstance().authenticateRequest;
    };
    /**
     * Get outgoing Login Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getLoginRequest = function () {
        return UIModel.getInstance().loginRequest;
    };
    /**
     * Get the MultiSocket Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getMultiSocketRequest = function () {
        return UIModel.getInstance().multiSocketRequest;
    };
    /**
     * Get outgoing Login Phase 1 Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentConfigRequest = function () {
        return UIModel.getInstance().loginPhase1Request;
    };
    /**
     * Get outgoing Logout Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getLogoutRequest = function () {
        return UIModel.getInstance().logoutRequest;
    };
    /**
     * Get latest Call Tokens object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getCallTokens = function () {
        return UIModel.getInstance().callTokens;
    };
    /**
     * Get latest outgoing Agent State Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentStateRequest = function () {
        return UIModel.getInstance().agentStateRequest;
    };
    /**
     * Get latest outgoing offhook init Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getOffhookInitRequest = function () {
        return UIModel.getInstance().offhookInitRequest;
    };
    /**
     * Get latest outgoing offhook termination Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getOffhookTermRequest = function () {
        return UIModel.getInstance().offhookTermRequest;
    };
    /**
     * Get latest outgoing Hangup Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getHangupRequest = function () {
        return UIModel.getInstance().hangupRequest;
    };
    /**
     * Get latest outgoing Preview Dial Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getPreviewDialRequest = function () {
        return UIModel.getInstance().previewDialRequest;
    };
    /**
     * Get latest TCPA Safe Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getTcpaSafeRequest = function () {
        return UIModel.getInstance().tcpaSafeRequest;
    };
    /**
     * Get latest Manual Outdial Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getManualOutdialRequest = function () {
        return UIModel.getInstance().oneToOneOutdialRequest;
    };
    /**
     * Get latest Manual Outdial Cancel Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getManualOutdialCancelRequest = function () {
        return UIModel.getInstance().oneToOneOutdialCancelRequest;
    };
    /**
     * Get latest Call Notes Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getCallNotesRequest = function () {
        return UIModel.getInstance().callNotesRequest;
    };
    /**
     * Get latest Campaign Dispositions Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getCampaignDispositionsRequest = function () {
        return UIModel.getInstance().campaignDispositionsRequest;
    };
    /**
     * Get latest Disposition Call Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getDispositionRequest = function () {
        return UIModel.getInstance().dispositionRequest;
    };
    /**
     * Get latest Disposition Manual Pass Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getDispositionManualPassRequest = function () {
        return UIModel.getInstance().dispositionManualPassRequest;
    };
    /**
     * Get latest Warm Transfer Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getWarmTransferRequest = function () {
        return UIModel.getInstance().warmXferRequest;
    };
    /**
     * Get latest Cold Transfer Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getColdTransferRequest = function () {
        return UIModel.getInstance().coldXferRequest;
    };
    /**
     * Get latest Warm Transfer Cancel Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getWarmTransferCancelRequest = function () {
        return UIModel.getInstance().warmXferCancelRequest;
    };
    /**
     * Get latest Requeue Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getRequeueRequest = function () {
        return UIModel.getInstance().requeueRequest;
    };
    /**
     * Get latest Call Summary Request
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getCallSummaryRequest = function () {
        return UIModel.getInstance().callSummaryRequest;
    };
    /**
     * Get latest Barge-In Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getBargeInRequest = function () {
        return UIModel.getInstance().bargeInRequest;
    };
    /**
     * Get latest Hold Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getHoldRequest = function () {
        return UIModel.getInstance().holdRequest;
    };
    /**
     * Get latest Pause Record Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getPauseRecordRequest = function () {
        return UIModel.getInstance().pauseRecordRequest;
    };
    /**
     * Get latest Record Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getRecordRequest = function () {
        return UIModel.getInstance().recordRequest;
    };
    /**
     * Get latest Chat Presented Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatPresentedRequest = function () {
        return UIModel.getInstance().chatPresentedRequest;
    };
    /**
     * Get latest Chat Disposition Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatDispositionRequest = function () {
        return UIModel.getInstance().chatDispositionRequest;
    };
    /**
     * Get latest Chat Message Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatMessageRequest = function () {
        return UIModel.getInstance().chatMessageRequest;
    };
    /**
     * Get latest Chat Requeue Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatRequeueRequest = function () {
        return UIModel.getInstance().chatRequeueRequest;
    };
    /**
     * Get latest Chat Summary Requeue
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatSummaryRequest = function () {
        return UIModel.getInstance().chatSummaryRequest;
    };
    /**
     * Get latest Chat Typing Request object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatTypingRequest = function () {
        return UIModel.getInstance().chatTypingRequest;
    };
    /**
     * Get latest Agent Stats object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentStatsPacket = function () {
        return UIModel.getInstance().agentStatsPacket;
    };
    /**
     * Get latest Agent Daily Stats object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentDailyStatsPacket = function () {
        return UIModel.getInstance().agentDailyStatsPacket;
    };
    /**
     * Get latest Queue Stats object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getQueueStatsPacket = function () {
        return UIModel.getInstance().queueStatsPacket;
    };
    /**
     * Get latest Chat Queue Stats object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getChatQueueStatsPacket = function () {
        return UIModel.getInstance().chatQueueStatsPacket;
    };
    /**
     * Get latest Campaign Stats object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getCampaignStatsPacket = function () {
        return UIModel.getInstance().campaignStatsPacket;
    };
    /**
     * Get latest Supervisor Stats object
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getSupervisorStatsPacket = function () {
        return UIModel.getInstance().supervisorStatsPacket;
    };
    /**
     * Get packet received on successful Phase 1 login
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentConfigPacket = function () {
        return UIModel.getInstance().loginPhase1Packet;
    };
    /**
     * Get packet received on successful Login (2nd layer login)
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getLoginPacket = function () {
        return UIModel.getInstance().loginPacket;
    };
    /**
     * Get latest received packet for Agent State
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentStatePacket = function () {
        return UIModel.getInstance().agentStatePacket;
    };
    /**
     * Get latest received packet for the Current Call
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getCurrentCallPacket = function () {
        return UIModel.getInstance().currentCallPacket;
    };
    /**
     * Get latest received packet for initiating an offhook session
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getOffhookInitPacket = function () {
        return UIModel.getInstance().offhookInitPacket;
    };
    /**
     * Get latest received packet for terminating an offhook session
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getOffhookTermPacket = function () {
        return UIModel.getInstance().offhookTermPacket;
    };

    /**
     * Get chat agent end request class
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */

    AgentLibrary.prototype.getChatAgentEnd = function () {
        return UIModel.getInstance().chatAgentEnd;
    };

    /**
     * Get WebRTC request class
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */

    AgentLibrary.prototype.getWebRTCRequest = function () {
        return UIModel.getInstance().webRTCRequest;
    };

    AgentLibrary.prototype.getChatListRequest = function () {
        return UIModel.getInstance().chatListRequest;
    };

    /**
     * Get SearchDirectoryRequest class
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */

    AgentLibrary.prototype.getSearchDirectoryRequest = function () {
        return UIModel.getInstance().searchDirectoryRequest;
    };

    /**
     * @namespace Notifications
     * @memberof AgentLibrary.Core
     */
    ///////////////////
    // notifications //
    ///////////////////
    /**
     * Get Dial Group Change notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getDialGroupChangeNotification = function () {
        return UIModel.getInstance().dialGroupChangeNotification;
    };
    /**
     * Get Dial Group Change Pending notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getDialGroupChangePendingNotification = function () {
        return UIModel.getInstance().dialGroupChangePendingNotification;
    };
    /**
     * Get End Call notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getEndCallNotification = function () {
        return UIModel.getInstance().endCallNotification;
    };
    /**
     * Get Gates Change notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getGatesChangeNotification = function () {
        return UIModel.getInstance().gatesChangeNotification;
    };
    /**
     * Get Generic notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getGenericNotification = function () {
        return UIModel.getInstance().genericNotification;
    };
    /**
     * Get New Call notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getNewCallNotification = function () {
        return UIModel.getInstance().newCallNotification;
    };
    /**
     * Get current call object
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getCurrentCall = function () {
        return UIModel.getInstance().currentCall;
    };
    /**
     * Get Add Session notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getAddSessionNotification = function () {
        return UIModel.getInstance().addSessionNotification;
    };
    /**
     * Get Drop Session notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getDropSessionNotification = function () {
        return UIModel.getInstance().dropSessionNotification;
    };
    /**
     * Get Early UII notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getEarlyUiiNotification = function () {
        return UIModel.getInstance().earlyUiiNotification;
    };
    /**
     * Get Chat Active notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatActiveNotification = function () {
        return UIModel.getInstance().chatActiveNotification;
    };
    /**
     * Get Chat Inactive notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatInactiveNotification = function () {
        return UIModel.getInstance().chatInactiveNotification;
    };
    /**
     * Get Chat Inactive notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatClientReconnectNotification = function () {
        return UIModel.getInstance().chatClientReconnectNotification;
    };
    /**
     * Get Chat Presented notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatPresentedNotification = function () {
        return UIModel.getInstance().chatPresentedNotification;
    };
    /**
     * Get Chat Typing notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatTypingNotification = function () {
        return UIModel.getInstance().chatTypingNotification;
    };
    /**
     * Get New Chat notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getNewChatNotification = function () {
        return UIModel.getInstance().newChatNotification;
    };
    /**
     * Get Load Media notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getLoadMediaNotification = function () {
        return UIModel.getInstance().loadMediaNotification;
    };
    /**
     * Get Load Media notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatAgentAssignFailureNotification = function () {
        return UIModel.getInstance().chatAgentAssignFailureNotification;
    };
    /**
     * Get Chat Typing notification class
     * @memberof AgentLibrary.Core.Notifications
     * @returns {object}
     */
    AgentLibrary.prototype.getChatCancelledNotification = function () {
        return UIModel.getInstance().chatCancelledNotification;
    };

    /**
     * @namespace Settings
     * @memberof AgentLibrary.Core
     */
    //////////////////////
    // settings objects //
    //////////////////////
    /**
     * Get Application Settings object containing the current state of application related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getApplicationSettings = function () {
        return UIModel.getInstance().applicationSettings;
    };
    /**
     * Get Softphone Settings object containing the current state of SIP related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getSoftphoneSettings = function () {
        return UIModel.getInstance().softphoneSettings;
    };
    /**
     * Get Chat Settings object containing the current state of chat related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getChatSettings = function () {
        return UIModel.getInstance().chatSettings;
    };
    /**
     * Get Connection Settings object containing the current state of connection related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getConnectionSettings = function () {
        return UIModel.getInstance().connectionSettings;
    };
    /**
     * Get Inbound Settings object containing the current state of inbound related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getInboundSettings = function () {
        return UIModel.getInstance().inboundSettings;
    };
    /**
     * Get Outbound Settings object containing the current state of outbound related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getOutboundSettings = function () {
        return UIModel.getInstance().outboundSettings;
    };
    /**
     * Get Agent Settings object containing the current state of agent related data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentSettings = function () {
        return UIModel.getInstance().agentSettings;
    };
    /**
     * Get Transfer Sessions
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getTransferSessions = function () {
        return UIModel.getInstance().transferSessions;
    };

    AgentLibrary.prototype.getPendingSessions = function () {
        return UIModel.getInstance().pendingNewCallSessions;
    };
    /**
     * Get the Agent Permissions object containing the current state of agent permissions
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentPermissions = function () {
        return UIModel.getInstance().agentPermissions;
    };

    /**
     * @namespace Stats
     * @memberof AgentLibrary.Core
     */
    ///////////////////
    // stats objects //
    ///////////////////

    /**
     * Get the Superivsor stats object containing the current state of supervised agent stats
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getSupervisorStats = function () {
        return UIModel.getInstance().supervisorStats;
    };
    /**
     * Get the Agent stats object containing the current state of agent stats
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentStats = function () {
        return UIModel.getInstance().agentStats;
    };
    /**
     * Get the Agent Daily stats object containing the current state of agent daily stats
     * @memberof AgentLibrary.Core.Stats
     * @returns {object}
     */
    AgentLibrary.prototype.getAgentDailyStats = function () {
        return UIModel.getInstance().agentDailyStats;
    };
    /**
     * Get the Queue stats object containing the current state of queue stats
     * @memberof AgentLibrary.Core.Stats
     * @returns {object}
     */
    AgentLibrary.prototype.getQueueStats = function () {
        return UIModel.getInstance().queueStats;
    };
    /**
     * Get the Chat Queue stats object containing the current state of chat queue stats
     * @memberof AgentLibrary.Core.Stats
     * @returns {object}
     */
    AgentLibrary.prototype.getChatQueueStats = function () {
        return UIModel.getInstance().chatQueueStats;
    };
    /**
     * Get the Campaign stats object containing the current state of campaign stats
     * @memberof AgentLibrary.Core.Stats
     * @returns {object}
     */
    AgentLibrary.prototype.getCampaignStats = function () {
        return UIModel.getInstance().campaignStats;
    };

    /**
     * Get filteredDirectory object containing the filtered directory data
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getFilteredDirectory = function () {
        return UIModel.getInstance().filteredDirectory;
    };

    /**
     * Get extensionPresenceResponse object containing the presenceInfo of extensionIds
     * @memberof AgentLibrary.Core.Settings
     * @returns {object}
     */
    AgentLibrary.prototype.getExtensionPresenceResponse = function () {
        return UIModel.getInstance().extensionPresenceResponse;
    };

    /**
     * Get ExtensionPresenceRequest class
     * @memberof AgentLibrary.Core.Requests
     * @returns {object}
     */
    AgentLibrary.prototype.getExtensionPresenceRequest = function () {
        return UIModel.getInstance().extensionPresenceRequest;
    };
    /**
     * Get Etr Request class
     * @memberof AgentLibrary.Core.Request
     * @returns {object}
     */
    AgentLibrary.prototype.getETRRequest = function () {
        return UIModel.getInstance().etrRequest;
    };

    /**********************
     *  PRIVATE FUNCTIONS *
     **********************/

    AgentLibrary.prototype._utils = utils;

    AgentLibrary.prototype._NewCallUtils = NewCallUtils;

    AgentLibrary.prototype._HttpService = HttpService;

    AgentLibrary.prototype._getUIModel = function () {
        return UIModel;
    };
}

function initAgentLibrarySocket(context) {
    'use strict';
    var AgentLibrary = context.AgentLibrary;

    AgentLibrary.prototype.openSocket = function (agentId, callback) {
        var instance = this;
        utils.setCallback(instance, CALLBACK_TYPES.OPEN_SOCKET, callback);
        if ('WebSocket' in context) {
            if (!instance.socket) {
                var model = UIModel.getInstance();

                model.agentSettings.agentId = agentId; // set agentId here since id is in scope

                if (instance._isReconnect) {
                    // update access_token on reconnect
                    _getNewAccessToken(instance);
                } else {
                    _buildSocketDest();
                    _initSocket(instance);
                }
            }
        } else {
            console.error('WebSocket NOT supported by your Browser');
            utils.logMessage(
                LOG_LEVELS.WARN,
                'WebSocket NOT supported by your Browser',
                ''
            );
        }
    };

    AgentLibrary.prototype.closeSocket = function () {
        this.socket.close();
    };

    // when socket is successfully opened, check to see if there are any queued messaged
    // and if so, send them.
    AgentLibrary.prototype.socketOpened = function () {
        var instance = this;
        var currDts = new Date();
        var expirationInMilliseconds = 3 * 60 * 1000; // milliseconds

        // get agent configuration information - "phase 1 login"
        UIModel.getInstance().loginPhase1Request = new LoginPhase1Request();
        var msg = UIModel.getInstance().loginPhase1Request.formatJSON();
        utils.sendMessage(this, msg);

        // if this is a reconnect, we need to re-authenticate with IntelliServices & IntelliQueue
        if (instance._isReconnect) {
            instance._isReconnect = false;
            // Add IntelliQueue reconnect
            var loginRequest = JSON.parse(
                UIModel.getInstance().loginRequest.formatJSON()
            );
            var hashCode = UIModel.getInstance().connectionSettings.hashCode;
            loginRequest.ui_request.hash_code = {
                '#text': hashCode,
            };
            loginRequest.ui_request.update_login = {
                '#text': 'FALSE',
            };
            loginRequest.ui_request.reconnect = {
                '#text': 'TRUE',
            };
            instance._queuedMsgs.unshift({
                dts: new Date(),
                msg: JSON.stringify(loginRequest),
            });
        }
        _processOfflineMessages(instance, currDts, expirationInMilliseconds);
        // reset queued messages
        instance._queuedMsgs = [];
    };

    // build WebSocket destination based on current agentId and access token
    function _buildSocketDest() {
        var model = UIModel.getInstance();
        var socketDest = model.applicationSettings.socketDest;
        socketDest = model.socketProtocol + model.authenticateRequest.socketUrl;
        socketDest += ':' + model.authenticateRequest.socketPort;
        socketDest += '?access_token=' + model.authenticateRequest.accessToken;
        socketDest += '&agent_id=' + model.agentSettings.agentId;
        socketDest += RequestLoggingService.getLoggingQueryParameters();

        model.applicationSettings.socketDest = socketDest; // seems redundant, but needed to update value on model
        return socketDest;
    }

    // connect socket, setup socket event listeners
    function _initSocket(instance) {
        var socketDest = UIModel.getInstance().applicationSettings.socketDest;
        utils.logMessage(
            LOG_LEVELS.DEBUG,
            'Attempting to open socket connection to ' + socketDest,
            ''
        );

        instance.socket = new WebSocket(socketDest);

        instance.socket.onopen = function () {
            // stop reconnect timer
            clearInterval(UIModel.getInstance().reconnectIntervalId);
            UIModel.getInstance().reconnectIntervalId = null;

            UIModel.getInstance().applicationSettings.socketConnected = true;
            utils.fireCallback(instance, CALLBACK_TYPES.OPEN_SOCKET, {
                reconnect: instance._isReconnect,
            });
            instance.socketOpened();
        };

        instance.socket.onerror = function (err) {
            utils.fireCallback(instance, CALLBACK_TYPES.OPEN_SOCKET, {
                error: err,
            });
        };

        instance.socket.onmessage = function (evt) {
            if (evt.data !== 'BOP') {
                var data = JSON.parse(evt.data);
                if (data.ui_response) {
                    utils.processResponse(instance, data);
                } else if (data.ui_notification) {
                    utils.processNotification(instance, data);
                } else if (data.dialer_request) {
                    utils.processDialerResponse(instance, data);
                } else if (data.ui_stats) {
                    utils.processStats(instance, data);
                } else if (data.ui_request) {
                    utils.processRequest(instance, data);
                }
            }
        };

        instance.socket.onclose = function () {
            utils.fireCallback(instance, CALLBACK_TYPES.CLOSE_SOCKET, '');
            UIModel.getInstance().applicationSettings.socketConnected = false;
            instance.socket = null;

            // cancel current call and offhook timer
            clearInterval(UIModel.getInstance().agentDailyIntervalId);
            UIModel.getInstance().agentDailyIntervalId = null;

            // cancel stats timer
            clearInterval(UIModel.getInstance().statsIntervalId);
            UIModel.getInstance().statsIntervalId = null;

            // cancel BEAT timer
            clearInterval(UIModel.getInstance().pingStatIntervalId);
            UIModel.getInstance().pingStatIntervalId = null;

            // if we are still logged in, set reconnect flag and try to reconnect
            if (UIModel.getInstance().agentSettings.isLoggedIn) {
                instance._isReconnect = true;
                console.warn(
                    'AgentLibrary: WebSocket is not connected, attempting to reconnect.'
                );

                // try reconnect every 5 seconds
                UIModel.getInstance().reconnectIntervalId = setInterval(
                    function () {
                        instance.openSocket(
                            UIModel.getInstance().agentSettings.agentId
                        );
                    },
                    5000
                );
            }
        };
    }

    // get valid access token based on agentId and login hash code
    function _getNewAccessToken(instance) {
        var model = UIModel.getInstance();
        var baseUrl = model.authHost + model.baseAuthUri;
        var errorMsg = 'Error in opening WebSocket on retrieving access token';
        var params = {
            queryParams: {
                loginHashcode: model.connectionSettings.hashCode,
                agentId: model.agentSettings.agentId,
                platformId: model.authenticateRequest.platformId,
                isSso: model.applicationSettings.isSso,
            },
        };

        new HttpService(baseUrl).httpPost('login/agent/hashcode', params).then(
            function (response) {
                try {
                    response = JSON.parse(response.response);
                    UIModel.getInstance().authenticateRequest.accessToken =
                        response.accessToken;
                    _buildSocketDest();
                    _initSocket(instance);
                } catch (err) {
                    utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
                }
            },
            function (err) {
                var errResponse = {
                    type: 'WebSocket Error',
                    message: errorMsg,
                };
                utils.logMessage(LOG_LEVELS.WARN, errorMsg, err);
            }
        );
    }

    /*
     * function to process most recent n messages where
     * n = MAX_OFFLINE_MESSAGES_TO_PROCESS
     * */
    function _processOfflineMessages(
        instance,
        currDts,
        expirationInMilliseconds
    ) {
        instance._queuedMsgs.forEach(function (queuedMsg) {
            if (
                currDts.getTime() - queuedMsg.dts.getTime() <
                expirationInMilliseconds
            ) {
                utils.logMessage(
                    LOG_LEVELS.DEBUG,
                    'Sending queued message to IntelliSocket.',
                    queuedMsg.msg
                );
                utils.sendMessage(instance, queuedMsg.msg);
            } else {
                // message expired, don't send
                utils.logMessage(
                    LOG_LEVELS.DEBUG,
                    'Queued message expired, discarding.',
                    queuedMsg.msg
                );
            }
        });
    }
}

function initAgentLibraryAgent(context) {
    /**
     * @namespace Agent
     * @memberof AgentLibrary
     */

    'use strict';

    var AgentLibrary = context.AgentLibrary;

    /**
     * Sends authenticate request to Engage Auth. Can either pass in 3 params of username, password, and platformId or
     * two params of jwt and tokenType. In each case a callback function may optionally be specified.
     * @memberof AgentLibrary.Agent
     * @param {string} username Agent's username
     * @param {string} password Agent's password
     * @param {string} platformId Designate the platform where the agent is set up
     * @param {function} [callback=null] Callback function when loginAgent response received
     */
    AgentLibrary.prototype.authenticateAgentWithUsernamePassword = function (
        username,
        password,
        platformId,
        callback
    ) {
        UIModel.getInstance().authenticateRequest = new AuthenticateRequest({
            username: username,
            password: password,
            platformId: platformId,
            authType: AUTHENTICATE_TYPES.USERNAME_PASSWORD,
        });
        UIModel.getInstance().authenticateRequest.sendHttpRequest();

        utils.setCallback(this, CALLBACK_TYPES.AUTHENTICATE, callback);
    };

    /**
     * Sends authenticate request to Engage Auth. Returns an array of agents to continue login process.
     * @memberof AgentLibrary.Agent
     * @param {string} rcAccessToken JSON Web Token received from RingCentral Single Sign-on API
     * @param {string} tokenType string type received from RingCentral Single Sign-on API
     * @param {function} [callback=null] Callback function when loginAgent response received
     */
    AgentLibrary.prototype.authenticateAgentWithRcAccessToken = function (
        rcAccessToken,
        tokenType,
        callback
    ) {
        UIModel.getInstance().authenticateRequest = new AuthenticateRequest({
            rcAccessToken: rcAccessToken,
            tokenType: tokenType,
            authType: AUTHENTICATE_TYPES.RC_TOKEN,
        });
        UIModel.getInstance().authenticateRequest.sendHttpRequest();

        utils.setCallback(this, CALLBACK_TYPES.AUTHENTICATE, callback);
    };

    /**
     * Sends authenticate request to Engage Auth. Returns an array of agents to continue login process.
     * @memberof AgentLibrary.Agent
     * @param {string} engageAccessToken JSON Web Token received from RingCentral Single Sign-on API
     * @param {function} [callback=null] Callback function when loginAgent response received
     */
    AgentLibrary.prototype.authenticateAgentWithEngageAccessToken = function (
        engageAccessToken,
        callback
    ) {
        UIModel.getInstance().authenticateRequest = new AuthenticateRequest({
            engageAccessToken: engageAccessToken,
            authType: AUTHENTICATE_TYPES.ENGAGE_TOKEN,
        });
        UIModel.getInstance().authenticateRequest.sendHttpRequest();

        utils.setCallback(this, CALLBACK_TYPES.AUTHENTICATE, callback);
    };

    /**
     * Sends request to IntelliQueue to get the agent's available products for login
     * @memberof AgentLibrary.Agent
     * @param {function} [callback=null] Callback function when loginPhase1 response received
     */
    AgentLibrary.prototype.getAgentConfig = function (callback) {
        UIModel.getInstance().loginPhase1Request = new LoginPhase1Request();
        var msg = UIModel.getInstance().loginPhase1Request.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.LOGIN_PHASE_1, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Sends request to the WebRTC Endpoint URL and process the response.
     * @memberof AgentLibrary.Agent
     *
     * @param {function} [callback=null] Callback function when web rtc info response received
     */
    AgentLibrary.prototype.getWebRtcInfo = function (callback) {
        var model = UIModel.getInstance();
        model.webRTCRequest = new WebRTCRequest();
        model.webRTCRequest.getSipRegistrationInfo();

        utils.setCallback(this, CALLBACK_TYPES.WEBRTC_INFO, callback);
    };

    /**
     * Sends agent configure message (2nd layer login) to IntelliQueue
     * @memberof AgentLibrary.Agent
     * @param {string} dialDest The agent's number, sip | DID.
     * @param {string[]} [queueIds=null] The queue ids the agent will be logged into.
     * @param {string[]} [chatIds=null] The chat ids the agent will be logged into.
     * @param {string} [skillProfileId=null] The skill profile the agent will be logged into.
     * @param {string} [dialGroupId=null] The outbound dial group id the agent will be logged into.
     * @param {string} [updateFromAdminUI=false] Whether the request is generated from the AdminUI or not.
     * @param {boolean} isForce Whether the agent login is forcing an existing agentlogin out.
     * @param {function} [callback=null] Callback function when configureAgent response received.
     */
    AgentLibrary.prototype.loginAgent = function (
        dialDest,
        queueIds,
        chatIds,
        skillProfileId,
        dialGroupId,
        updateFromAdminUI,
        isForce,
        callback
    ) {
        var model = UIModel.getInstance();
        var config = {
            dialDest: dialDest,
            queueIds: queueIds,
            chatIds: chatIds,
            skillProfileId: skillProfileId,
            dialGroupId: dialGroupId,
            updateFromAdminUI: updateFromAdminUI,
            isForce: isForce,
        };
        var instance = this;

        // if dialDest is set to `integrated`, we are doing an integrated softphone
        // and need to get SIP credentials
        if (config.dialDest === 'integrated') {
            // set up some global variables to track dial dest type for later offhook init
            if (
                model.applicationSettings.isFlr ||
                !model.applicationSettings.isSso
            ) {
                model.applicationSettings.dialDestType = 'LEGACY_SOFTPHONE';
            } else {
                model.applicationSettings.dialDestType = 'RC_SOFTPHONE';
            }

            if (model.softphoneSettings.sipInfo.length === 0) {
                // call engage-auth api to get webRtc info
                model.libraryInstance.getWebRtcInfo(function () {
                    config.dialDest = utils.getDialDestination();
                    _setUpAndSendLogin(config, callback, instance);
                });
            } else {
                // set webRtc info from model, could be an update login
                config.dialDest = utils.getDialDestination();
                _setUpAndSendLogin(config, callback, instance);
            }
        } else {
            // set up some global variables to track dial dest type for later offhook init
            if (config.dialDest === 'RC_PHONE') {
                model.applicationSettings.dialDestType = 'RC_PHONE';
            }

            _setUpAndSendLogin(config, callback, instance);
        }
    };

    function _setUpAndSendLogin(config, callback, instance) {
        UIModel.getInstance().loginRequest = new LoginRequest(
            config.dialDest,
            config.queueIds,
            config.chatIds,
            config.skillProfileId,
            config.dialGroupId,
            config.updateFromAdminUI,
            config.isForce
        );
        var msg = UIModel.getInstance().loginRequest.formatJSON();

        utils.setCallback(instance, CALLBACK_TYPES.LOGIN, callback);
        utils.sendMessage(instance, msg);
    }
    /**
     * Sends multisocket message to IntelliQueue
     * @memberof AgentLibrary.Agent
     * @param {function} [callback=null] Callback function when multisocket response received.
     */
    AgentLibrary.prototype.multiLoginRequest = function (callback) {
        var model = UIModel.getInstance();
        model.multiSocketRequest = new MultiSocketRequest();
        var msg = model.multiSocketRequest.formatJSON();
        if (
            model.dataStore.get('agent_id') &&
            model.dataStore.get('hash_code')
        ) {
            utils.setCallback(this, CALLBACK_TYPES.LOGIN_MULTISOCKET, callback);
            utils.sendMessage(this, msg);
        } else {
            this.getAgentConfig(callback);
        }
    };

    /**
     * Sends agent logout message to IntelliQueue
     * @memberof AgentLibrary.Agent
     * @param {number} agentId Id of the agent that will be logged out.
     * @param {function} [callback=null] Callback function when logoutAgent response received.
     */
    AgentLibrary.prototype.logoutAgent = function (agentId, callback) {
        var model = UIModel.getInstance();
        if (model.agentSettings.isLoggedIn) {
            model.agentSettings.isLoggedIn = false;
            model.logoutRequest = new LogoutRequest(agentId);
            var msg = model.logoutRequest.formatJSON();

            // socket closed in callback function
            utils.setCallback(this, CALLBACK_TYPES.LOGOUT, callback);
            utils.sendMessage(this, msg);
        }
    };

    /**
     * Sends agent logout for the given agent to logout message to IntelliQueue
     * @memberof AgentLibrary.Agent
     * @param {number} agentToLogout Id of the agent that will be logged out.
     * @param {number} [requestMessage=""] Message to send for the logout request.
     * @param {function} [callback=null] Callback function when logoutAgent response received.
     */
    AgentLibrary.prototype.requestLogoutAgent = function (
        agentToLogout,
        requestMessage,
        callback
    ) {
        var isSupervisor =
            UIModel.getInstance().agentSettings.agentType === 'SUPERVISOR';
        if (isSupervisor) {
            //This is a supervisor request to log an agent out. Create the
            //logout packet and then send the packet to IntelliQueue.
            UIModel.getInstance().logoutRequest = new LogoutRequest(
                agentToLogout,
                requestMessage
            );
            utils.setCallback(this, CALLBACK_TYPES.LOGOUT, callback);
            var msg = UIModel.getInstance().logoutRequest.formatJSON();
            utils.sendMessage(this, msg);
        }
    };

    /**
     * Sends agent state change message to IntelliQueue
     * @memberof AgentLibrary.Agent
     * @param {string} agentState The system/base state to transition to <br />
     * AVAILABLE | TRANSITION | ENGAGED | ON-BREAK | WORKING | AWAY | LUNCH | AUX-UNAVAIL-NO-OFFHOOK | AUX-UNAVAIL-OFFHOOK
     * @param {string} [agentAuxState=""] The aux state display label
     * @param {function} [callback=null] Callback function when agentState response received
     */
    AgentLibrary.prototype.setAgentState = function (
        agentState,
        agentAuxState,
        callback
    ) {
        UIModel.getInstance().agentStateRequest = new AgentStateRequest(
            agentState,
            agentAuxState
        );
        var msg = UIModel.getInstance().agentStateRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.AGENT_STATE, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Initiates an agent offhook session
     * @memberof AgentLibrary.Agent
     * @param {function} [callback=null] Callback function when offhookInit response received
     */
    AgentLibrary.prototype.offhookInit = function (callback) {
        UIModel.getInstance().offhookInitRequest = new OffhookInitRequest();
        var msg = UIModel.getInstance().offhookInitRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.OFFHOOK_INIT, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Terminates agent's offhook session
     * @memberof AgentLibrary.Agent
     * @param {function} [callback=null] Callback function when pending callbacks response received
     */
    AgentLibrary.prototype.offhookTerm = function (callback) {
        UIModel.getInstance().offhookTermRequest = new OffhookTermRequest();
        var msg = UIModel.getInstance().offhookTermRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.OFFHOOK_TERM, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Returns scheduled callbacks for the given agent
     * @memberof AgentLibrary.Agent
     * @param {number} [agentId=logged in agent id] Id of agent to get callbacks for
     * @param {function} [callback=null] Callback function when pending callbacks response received
     */
    AgentLibrary.prototype.getPendingCallbacks = function (agentId, callback) {
        UIModel.getInstance().callbacksPendingRequest =
            new CallbacksPendingRequest(agentId);
        var msg = UIModel.getInstance().callbacksPendingRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CALLBACK_PENDING, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Cancel a scheduled callback for the given agent based on lead id
     * @memberof AgentLibrary.Agent
     * @param {number} leadId Id of lead callback to cancel
     * @param {number} [agentId=logged in agent id] Id of agent to cancel specified lead callback for
     * @param {function} [callback=null] Callback function when callback is canceled
     */
    AgentLibrary.prototype.cancelCallback = function (
        leadId,
        agentId,
        callback
    ) {
        UIModel.getInstance().callbackCancelRequest = new CallbackCancelRequest(
            leadId,
            agentId
        );
        var msg = UIModel.getInstance().callbackCancelRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CALLBACK_CANCEL, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Request stats messages to be sent every 5 seconds. The stats responses will be sent as
     * four possible callback types: agentStats, agentDailyStats, campaignStats, or queueStats
     * @memberof AgentLibrary.Agent
     */
    AgentLibrary.prototype.requestStats = function () {
        // start stats interval timer, request stats every 5 seconds
        if (UIModel.getInstance().statsIntervalId === null) {
            UIModel.getInstance().statsIntervalId = setInterval(
                utils.sendStatsRequestMessage,
                5000
            );
            _terminatePing();
        }
    };

    /**
     * Terminate stats messages sent to the agent every 5 seconds.
     * @memberof AgentLibrary.Agent
     */
    AgentLibrary.prototype.terminateStats = function () {
        clearInterval(UIModel.getInstance().statsIntervalId);
        UIModel.getInstance().statsIntervalId = null;
        _requestPing();
    };

    function _requestPing() {
        // start ping interval timer, request BEAT every 20 seconds
        if (UIModel.getInstance().pingStatIntervalId === null) {
            UIModel.getInstance().pingStatIntervalId = setInterval(
                utils.sendPingRequestMessage,
                20000
            );
        }
    }

    function _terminatePing() {
        clearInterval(UIModel.getInstance().pingStatIntervalId);
        UIModel.getInstance().pingStatIntervalId = null;
    }

    /**
     * Set flag to determine if Supervisor stats messages should be sent to the agent.
     * @memberof AgentLibrary.Agent
     * @param {boolean} bool True if we want to receive Supervisor type stats messages
     */
    AgentLibrary.prototype.setIncludeSupervisorStatsFlag = function (bool) {
        UIModel.getInstance().agentSettings.includeSupervisorStats = bool;
    };

    /**
     * Set the agent dial destination
     * @memberof AgentLibrary.Agent
     * @param {string} dialDest The dial destination used for softphone registration
     * @param {boolean} isSoftphoneError True - if we want to log this dial destination update as a softphone error
     */
    AgentLibrary.prototype.updateDialDestination = function (
        dialDest,
        isSoftphoneError
    ) {
        UIModel.getInstance().updateDialDestinationRequest =
            new UpdateDialDestinationRequest(dialDest, isSoftphoneError);
        var msg =
            UIModel.getInstance().updateDialDestinationRequest.formatJSON();

        utils.sendMessage(this, msg);
    };

    /**
     * Search Directory for the searchString passed to function.
     * @memberof AgentLibrary.Agent
     * @param {string} searchString The search filter for PBX directory
     */
    AgentLibrary.prototype.searchDirectory = function (searchString, callback) {
        var model = UIModel.getInstance();

        model.searchDirectoryRequest = new SearchDirectoryRequest(searchString);
        model.searchDirectoryRequest.searchDirectory(searchString);
        utils.setCallback(this, CALLBACK_TYPES.SEARCH_DIR, callback);
    };

    /**
     * Refresh Token method
     * @memberof AgentLibrary.Agent
     */
    AgentLibrary.prototype.getRefreshedToken = function () {
        utils.refreshAccessToken();
    };

    /**
     * get Extension Presence  Info for the extension Ids passed to function.
     * @memberof AgentLibrary.Agent
     * @param {string} extensionIds The extension Ids of RC
     */
    AgentLibrary.prototype.getExtensionPresenceInfo = function (
        extensionIds,
        callback
    ) {
        var model = UIModel.getInstance();
        model.extensionPresenceRequest = new ExtensionPresenceRequest(
            extensionIds
        );
        model.extensionPresenceRequest.getExtensionPresenceInfo(extensionIds);
        utils.setCallback(this, CALLBACK_TYPES.EXTENSION_PRESENCE, callback);
    };
}

function initAgentLibraryCall(context) {
    /**
     * @namespace Call
     * @memberof AgentLibrary
     */

    'use strict';

    var AgentLibrary = context.AgentLibrary;

    /**
     * Barge in on a call, can hear all parties and be heard by all
     * @memberof AgentLibrary.Call
     * @param {number} agentId Agent Id of the current logged in agent
     * @param {string} uii UII of the active call you wish to monitor
     * @param {number} monitorAgentId UII Agent Id of the agent you wish to monitor
     * @param {function} [callback=null] Callback function when barge in response received
     */
    AgentLibrary.prototype.bargeIn = function (
        agentId,
        uii,
        monitorAgentId,
        callback
    ) {
        UIModel.getInstance().bargeInRequest = new BargeInRequest(
            'FULL',
            agentId,
            uii,
            monitorAgentId
        );
        var msg = UIModel.getInstance().bargeInRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.BARGE_IN, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Add a coaching session to the call, can hear all parties but only able to speak on agent channel
     * @memberof AgentLibrary.Call
     * @param {number} agentId Agent Id of the current logged in agent
     * @param {string} uii UII of the active call you wish to monitor
     * @param {number} monitorAgentId UII Agent Id of the agent you wish to monitor
     * @param {function} [callback=null] Callback function when coaching session response received
     */
    AgentLibrary.prototype.coach = function (
        agentId,
        uii,
        monitorAgentId,
        callback
    ) {
        UIModel.getInstance().bargeInRequest = new BargeInRequest(
            'COACHING',
            agentId,
            uii,
            monitorAgentId
        );
        var msg = UIModel.getInstance().bargeInRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.COACH_CALL, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer to another number and end the call for the original agent (cold transfer).
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number to transfer to
     * @param {number} [callerId=""] Caller Id for caller (DNIS)
     * @param {number} [sipHeaders=[]] Name/Value header pairs
     * @param {function} [callback=null] Callback function when cold transfer response received
     */
    AgentLibrary.prototype.coldXfer = function (
        dialDest,
        callerId,
        sipHeaders,
        callback
    ) {
        UIModel.getInstance().coldXferRequest = new XferColdRequest(
            dialDest,
            callerId,
            sipHeaders
        );
        var msg = UIModel.getInstance().coldXferRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.XFER_COLD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer to another number and end the call for the original agent (cold transfer).
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number to transfer to
     * @param {number} [callerId=""] Caller Id for caller (DNIS)
     * @param {number} [sipHeaders=[]] Name/Value header pairs
     * @param {number} [countryId=""] Country Id for the dialDest
     * @param {function} [callback=null] Callback function when warm transfer response received
     */
    AgentLibrary.prototype.internationalColdXfer = function (
        dialDest,
        callerId,
        sipHeaders,
        countryId,
        callback
    ) {
        UIModel.getInstance().coldXferRequest = new XferColdRequest(
            dialDest,
            callerId,
            sipHeaders,
            countryId
        );
        var msg = UIModel.getInstance().coldXferRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.XFER_COLD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Send a reportCall issue for an inbound or outbound call
     * @memberof AgentLibrary.Call
     * @param {string} uii Unique UII for call
     * @param {string} type The Report Call Issue type
     * @param {string} notes Agent notes for call
     * @param {string} origin the origin of the reported call
     * @param {boolean} doRetryReport boolean that prevents recursive infinite loop in the event of a 401-403 error
     */
    AgentLibrary.prototype.reportCall = function (
        uii,
        type,
        notes,
        origin,
        doRetryReport
    ) {
        var model = UIModel.getInstance();
        var call = model.callHistory[uii];
        var baseUrl = model.authHost + model.baseVoiceUri;
        var engageAccessToken =
            'Bearer ' +
            utils.toString(model.authenticateRequest.engageAccessToken);
        var debugLogs = '',
            agentConsoleLog = '',
            outboundCallerId,
            productId,
            productName;
        if (!call) {
            call = {
                baggage: {
                    agentFirstName: '',
                    agentLastName: '',
                    sourceType: '',
                },
                dialDest: '',
                sessionId: '',
                ani: '',
                dnis: '',
                queue: {
                    number: '',
                    name: '',
                },
            };
            console.warn(
                'No call object found, make sure to call setCallHistory before reporting this call'
            );
        }

        // Promise.allSettled is used to ensure callQualityReport api is called,
        // regardless of getDebugLogData and getConsoleLogData returns data or error
        return Promise.allSettled([
            utils.getDebugLogData(),
            utils.getConsoleLogData(),
        ]).then(function (result) {
            debugLogs = result[0].value;
            agentConsoleLog = result[1].value;
            outboundCallerId =
                call.baggage.sourceType !== 'INBOUND' ? call.dnis : '';
            productId =
                call.queue && call.queue.number ? call.queue.number : '';
            productName = call.queue && call.queue.name ? call.queue.name : '';

            var params = {
                body: {
                    platformId: utils.parseJwt(
                        model.authenticateRequest.engageAccessToken
                    ).plat,
                    accountId: model.agentSettings.accountId,
                    agentId: model.agentSettings.agentId,
                    time: new Date().getTime().toString(),
                    name:
                        call.baggage.agentFirstName +
                        ' ' +
                        call.baggage.agentLastName,
                    dialDestination: call.dialDest,
                    callUII: uii,
                    sessionId: call.sessionId,
                    ani: call.ani,
                    dnis: call.dnis,
                    callType: call.baggage.sourceType,
                    outboundCallerId: outboundCallerId,
                    productId: productId,
                    productName: productName,
                    issueType: type,
                    agentNote: notes,
                    agentConsole: agentConsoleLog ? agentConsoleLog : '',
                    debugLogs: debugLogs ? debugLogs : '',
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: engageAccessToken,
                },
            };
            return new HttpService(baseUrl)
                .httpPost('agent/callQualityReport?origin=' + origin, params)
                .then(function (respObj) {
                    var response = JSON.parse(respObj.response);
                    return new Promise(function (resolve) {
                        resolve(response);
                    });
                })
                .catch(function (err) {
                    if (err.status && err.status > 400 && err.status < 404) {
                        if (!doRetryReport) {
                            doRetryReport = true;
                            utils.refreshAccessToken().then(function () {
                                model.libraryInstance.reportCall(
                                    uii,
                                    type,
                                    notes,
                                    origin,
                                    doRetryReport
                                );
                            });
                        }
                    }
                });
        });
    };

    /**
     * Send a disposition for an inbound or outbound call
     * @memberof AgentLibrary.Call
     * @param {string} uii UII (unique id) for call
     * @param {string} dispId The disposition id
     * @param {string} notes Agent notes for call
     * @param {boolean} callback Boolean for whether or not this call is a callback
     * @param {string} [callbackDTS=""] date time stamp if callback
     * @param {string} [contactForwardNumber=null] Number for contact forwarding
     * @param {string} [survey=null] The survey response values for the call.
     * Format: survey = [ { label: "", externId: "", leadUpdateColumn: ""} ]
     * @param {string} [externId=null] The external id associated with the lead for this call (only for Outbound Dispositions).
     * @param {string} [leadId=null] The lead id associated with this call (only for Outbound Dispositions).
     * @param {string} [requestId=null] The request id associated with a preview fetched lead (only for Outbound Dispositions).
     */
    AgentLibrary.prototype.dispositionCall = function (
        uii,
        dispId,
        notes,
        callback,
        callbackDTS,
        contactForwardNumber,
        survey,
        externId,
        leadId,
        requestId
    ) {
        var model = UIModel.getInstance();
        model.dispositionRequest = new DispositionRequest(
            uii,
            dispId,
            notes,
            callback,
            callbackDTS,
            contactForwardNumber,
            survey,
            externId,
            leadId,
            requestId
        );
        var msg = model.dispositionRequest.formatJSON();
        utils.sendMessage(this, msg);

        // cancel ping call timer
        if (model.pingIntervalId) {
            clearInterval(model.pingIntervalId);
            model.pingIntervalId = null;
        }
    };

    /**
     * Send a disposition for a manual pass on a lead
     * @memberof AgentLibrary.Call
     * @param {string} dispId The disposition id
     * @param {string} notes Agent notes for call
     * @param {boolean} callback Boolean for whether or not this call is a callback
     * @param {string} [callbackDTS=""] date time stamp if callback
     * @param {string} [leadId=null] The lead id
     * @param {string} [requestId=null] The request key for the lead
     * @param {string} [externId=null] The external id of the lead
     */
    AgentLibrary.prototype.dispositionManualPass = function (
        dispId,
        notes,
        callback,
        callbackDTS,
        leadId,
        requestId,
        externId
    ) {
        UIModel.getInstance().dispositionManualPassRequest =
            new DispositionManualPassRequest(
                dispId,
                notes,
                callback,
                callbackDTS,
                leadId,
                requestId,
                externId
            );
        var msg =
            UIModel.getInstance().dispositionManualPassRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Get a list of all campaign dispositions for given campaign id
     * @memberof AgentLibrary.Call
     * @param {string} campaignId Id for campaign to get dispositions for
     * @param {function} [callback=null] Callback function when campaign dispositions response received
     */
    AgentLibrary.prototype.getCampaignDispositions = function (
        campaignId,
        callback
    ) {
        UIModel.getInstance().campaignDispositionsRequest =
            new CampaignDispositionsRequest(campaignId);
        var msg =
            UIModel.getInstance().campaignDispositionsRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CAMPAIGN_DISPOSITIONS, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Sends a hangup request message
     * @memberof AgentLibrary.Call
     * @param {string} [sessionId=""] Session to hangup, defaults to current call session id
     * @param {boolean} resetPendingDisp, reset pendingDisp to false, in case of bad reconnect
     */
    AgentLibrary.prototype.hangup = function (sessionId, resetPendingDisp) {
        UIModel.getInstance().hangupRequest = new HangupRequest(
            sessionId,
            resetPendingDisp
        );
        var msg = UIModel.getInstance().hangupRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Place a call on hold
     * @memberof AgentLibrary.Call
     * @param {boolean} holdState Whether we are putting call on hold or taking off hold - values true | false
     * @param {function} [callback=null] Callback function when hold response received
     */
    AgentLibrary.prototype.hold = function (holdState, callback) {
        UIModel.getInstance().holdRequest = new HoldRequest(holdState);
        var msg = UIModel.getInstance().holdRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.HOLD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Place a specified session of a call on hold
     * @memberof AgentLibrary.Call
     * @param {boolean} holdState Whether we are putting call on hold or taking off hold - values true | false
     * @param {integer|string} sessionId session id of the call to place on hold
     * @param {function} [callback=null] Callback function when hold response received
     */
    AgentLibrary.prototype.holdSession = function (
        holdState,
        sessionId,
        callback
    ) {
        UIModel.getInstance().holdRequest = new HoldRequest(
            holdState,
            sessionId
        );
        var msg = UIModel.getInstance().holdRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.HOLD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Sends a manual outdial request message
     * @memberof AgentLibrary.Call
     * @param {string} destination Number to call - ANI
     * @param {number} callerId Number displayed to callee, DNIS
     * @param {number} [ringTime=60] Time in seconds to ring call
     * @param {string} [countryId='USA'] Country for the destination number
     * @param {number} [queueId=''] Queue id to tie manual call to
     */
    AgentLibrary.prototype.manualOutdial = function (
        destination,
        callerId,
        ringTime,
        countryId,
        queueId
    ) {
        UIModel.getInstance().oneToOneOutdialRequest =
            new OneToOneOutdialRequest(
                destination,
                callerId,
                ringTime,
                countryId,
                queueId
            );
        var msg = UIModel.getInstance().oneToOneOutdialRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Cancels a manual outdial request by UII.
     * @memberof AgentLibrary.Call
     * @param {string} uii UII of manual call request, the UII is returned in the EARLY_UII notification.
     */
    AgentLibrary.prototype.manualOutdialCancel = function (uii) {
        UIModel.getInstance().oneToOneOutdialCancelRequest =
            new OneToOneOutdialCancelRequest(uii);
        var msg =
            UIModel.getInstance().oneToOneOutdialCancelRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Pause call recording
     * @memberof AgentLibrary.Call
     * @param {boolean} record Whether we are recording or not
     * @param {function} [callback=null] Callback function when pause record response received
     */
    AgentLibrary.prototype.pauseRecord = function (record, callback) {
        UIModel.getInstance().pauseRecordRequest = new PauseRecordRequest(
            record
        );
        var msg = UIModel.getInstance().pauseRecordRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.PAUSE_RECORD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Sends a preview dial request to call lead based on request id and (optional) lead phone.
     * Call previewFetch method first to get request id.
     * @memberof AgentLibrary.Call
     * @param {number} requestId Pending request id sent back with lead, required to dial lead.
     * @param {number} [leadPhone=""] Lead phone number. Only needed if there are multiple numbers loaded for given lead.
     */
    AgentLibrary.prototype.previewDial = function (requestId, leadPhone) {
        UIModel.getInstance().previewDialRequest = new PreviewDialRequest(
            '',
            [],
            requestId,
            leadPhone
        );
        var msg = UIModel.getInstance().previewDialRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Sends a message to fetch preview dialable leads
     * @memberof AgentLibrary.Call
     * @param {array} [searchFields=[]] Array of objects with key/value pairs for search parameters
     * e.g. [ {key: "name", value: "Geoff"} ]
     * @param {function} [callback=null] Callback function when preview fetch completed, returns matched leads
     */
    AgentLibrary.prototype.previewFetch = function (searchFields, callback) {
        UIModel.getInstance().previewDialRequest = new PreviewDialRequest(
            '',
            searchFields,
            ''
        );
        var msg = UIModel.getInstance().previewDialRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.PREVIEW_FETCH, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Pull back leads that match search criteria
     * @memberof AgentLibrary.Call
     * @param {array} [searchFields=[]] Array of objects with key/value pairs for search parameters
     * e.g. [ {key: "name", value: "Geoff"} ]
     * @param {function} [callback=null] Callback function when lead search completed, returns matched leads
     */
    AgentLibrary.prototype.searchLeads = function (searchFields, callback) {
        UIModel.getInstance().previewDialRequest = new PreviewDialRequest(
            'search',
            searchFields,
            ''
        );
        var msg = UIModel.getInstance().previewDialRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.LEAD_SEARCH, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Set agent notes for a call
     * @memberof AgentLibrary.Call
     * @param {string} notes Agent notes to add to call
     * @param {function} [callback=null] Callback function when call notes response received
     */
    AgentLibrary.prototype.setCallNotes = function (notes, callback) {
        UIModel.getInstance().callNotesRequest = new CallNotesRequest(notes);
        var msg = UIModel.getInstance().callNotesRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CALL_NOTES, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Add a silent monitor session to a call, can hear all channels but can't be heard by any party
     * @memberof AgentLibrary.Call
     * @param {number} agentId Agent Id of the current logged in agent
     * @param {string} uii UII of the active call you wish to monitor
     * @param {number} monitorAgentId UII Agent Id of the agent you wish to monitor
     * @param {function} [callback=null] Callback function when silent monitor response received
     */
    AgentLibrary.prototype.monitor = function (
        agentId,
        uii,
        monitorAgentId,
        callback
    ) {
        UIModel.getInstance().bargeInRequest = new BargeInRequest(
            'MUTE',
            agentId,
            uii,
            monitorAgentId
        );
        var msg = UIModel.getInstance().bargeInRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.SILENT_MONITOR, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Toggle call recording based on passed in boolean true | false
     * @memberof AgentLibrary.Call
     * @param {boolean} record Whether we are recording or not
     * @param {function} [callback=null] Callback function when record response received
     */
    AgentLibrary.prototype.record = function (record, callback) {
        UIModel.getInstance().recordRequest = new RecordRequest(record);
        var msg = UIModel.getInstance().recordRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.RECORD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Requeue a call
     * @memberof AgentLibrary.Call
     * @param {number} queueId Queue Id to send the call to
     * @param {number} skillId Skill Id for the requeued call
     * @param {boolean} maintain Whether or not to maintain the current agent
     * @param {function} [callback=null] Callback function when requeue response received
     */
    AgentLibrary.prototype.requeueCall = function (
        queueId,
        skillId,
        maintain,
        callback
    ) {
        UIModel.getInstance().requeueRequest = new RequeueRequest(
            queueId,
            skillId,
            maintain
        );
        var msg = UIModel.getInstance().requeueRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.REQUEUE, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Request summary of a call
     * @memberof AgentLibrary.Call
     * @param {string} uii The UII of the call the script results belong to
     * @param {string} sessionId session id of the call
     * @param {string} segmentId is secure grade UUID
     */
    AgentLibrary.prototype.requestCallSummary = function (
        uii,
        sessionId,
        segmentId
    ) {
        UIModel.getInstance().callSummaryRequest = new SummaryRequest(
            uii,
            sessionId,
            segmentId
        );

        const message = UIModel.getInstance().callSummaryRequest.formatJSON();
        utils.sendMessage(this, message);
    };

    /**
     * Sends a TCPA Safe call request to call lead based on request id and (optional) lead phone.
     * Call safeModeFetch method first to get request id.
     * @memberof AgentLibrary.Call
     * @param {number} requestId Pending request id sent back with lead, required to dial lead.
     * @param {number} [leadPhone=""] Lead phone number. Only needed if there are multiple numbers loaded for given lead.
     */
    AgentLibrary.prototype.safeModeCall = function (requestId, leadPhone) {
        UIModel.getInstance().tcpaSafeRequest = new TcpaSafeRequest(
            '',
            [],
            requestId,
            leadPhone
        );
        var msg = UIModel.getInstance().tcpaSafeRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Sends a message to fetch safe mode dialable leads
     * @memberof AgentLibrary.Call
     * @param {array} [searchFields=[]] Array of objects with key/value pairs for search parameters
     * e.g. [ {key: "name", value: "Geoff"} ]
     * @param {function} [callback=null] Callback function when safe mode fetch completed, returns matched leads
     */
    AgentLibrary.prototype.safeModeFetch = function (searchFields, callback) {
        UIModel.getInstance().tcpaSafeRequest = new TcpaSafeRequest(
            '',
            searchFields,
            ''
        );
        var msg = UIModel.getInstance().tcpaSafeRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.SAFE_MODE_FETCH, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Pull back Safe Mode leads that match search criteria
     * @memberof AgentLibrary.Call
     * @param {array} [searchFields=[]] Array of objects with key/value pairs for search parameters
     * e.g. [ {key: "name", value: "Geoff"} ]
     * @param {function} [callback=null] Callback function when safe mode fetch completed, returns matched leads
     */
    AgentLibrary.prototype.safeSearchLeads = function (searchFields, callback) {
        UIModel.getInstance().tcpaSafeRequest = new TcpaSafeRequest(
            'search',
            searchFields,
            ''
        );
        var msg = UIModel.getInstance().tcpaSafeRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.SAFE_MODE_SEARCH, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer to another number while keeping the original agent on the line (warm transfer).
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number to transfer to
     * @param {number} [callerId=""] Caller Id for caller (DNIS)
     * @param {number} [sipHeaders=[]] Name/Value header pairs
     * @param {number} [countryId=""] Country Id for the dialDest
     * @param {function} [callback=null] Callback function when warm transfer response received
     */
    AgentLibrary.prototype.internationalWarmXfer = function (
        dialDest,
        callerId,
        sipHeaders,
        countryId,
        callback
    ) {
        UIModel.getInstance().warmXferRequest = new XferWarmRequest(
            dialDest,
            callerId,
            sipHeaders,
            countryId
        );
        var msg = UIModel.getInstance().warmXferRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.XFER_WARM, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer to another number while keeping the original agent on the line (warm transfer).
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number to transfer to
     * @param {number} [callerId=""] Caller Id for caller (DNIS)
     * @param {number} [sipHeaders=[]] Name/Value header pairs
     * @param {function} [callback=null] Callback function when warm transfer response received
     */
    AgentLibrary.prototype.warmXfer = function (
        dialDest,
        callerId,
        sipHeaders,
        callback
    ) {
        UIModel.getInstance().warmXferRequest = new XferWarmRequest(
            dialDest,
            callerId,
            sipHeaders
        );
        var msg = UIModel.getInstance().warmXferRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.XFER_WARM, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Cancel a warm transfer
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number that was transfered to
     */
    AgentLibrary.prototype.warmXferCancel = function (dialDest) {
        UIModel.getInstance().warmXferCancelRequest = new XferWarmCancelRequest(
            dialDest
        );
        var msg = UIModel.getInstance().warmXferCancelRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer to another number while keeping the original agent on the line (warm transfer).
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number to transfer to
     * @param {number} [callerId=""] Caller Id for caller (DNIS)
     * @param {number} [sipHeaders=[]] Name/Value header pairs
     * @param {number} [countryId=""] Country Id for the dialDest
     * @param {function} [callback=null] Callback function when warm transfer response received
     */
    AgentLibrary.prototype.corporateDirWarmXfer = function (
        dialDest,
        callerId,
        sipHeaders,
        countryId,
        callback
    ) {
        UIModel.getInstance().warmXferRequest = new XferWarmRequest(
            dialDest,
            callerId,
            sipHeaders,
            countryId
        );
        var msg = UIModel.getInstance().warmXferRequest.formatJSON();
        utils.setCallback(this, CALLBACK_TYPES.XFER_WARM, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer to another number and end the call for the original agent (cold transfer).
     * @memberof AgentLibrary.Call
     * @param {number} dialDest Number to transfer to
     * @param {number} [callerId=""] Caller Id for caller (DNIS)
     * @param {number} [sipHeaders=[]] Name/Value header pairs
     * @param {number} [countryId=""] Country Id for the dialDest
     * @param {function} [callback=null] Callback function when cold transfer response received
     */
    AgentLibrary.prototype.corporateDirColdXfer = function (
        dialDest,
        callerId,
        sipHeaders,
        countryId,
        callback
    ) {
        UIModel.getInstance().coldXferRequest = new XferColdRequest(
            dialDest,
            callerId,
            sipHeaders,
            countryId
        );
        var msg = UIModel.getInstance().coldXferRequest.formatJSON();
        utils.setCallback(this, CALLBACK_TYPES.XFER_COLD, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Requests a script object based on given id
     * @memberof AgentLibrary.Call
     * @param {number} scriptId Id of script
     * @param {number} version The version number of the script, if the current loaded script version matches,
     *                 just return current script. Otherwise, fetch new version of script.
     * @param {function} [callback=null] Callback function when warm transfer response received
     */
    AgentLibrary.prototype.getScript = function (scriptId, version, callback) {
        var model = UIModel.getInstance();
        var script = model.scriptSettings.loadedScripts[scriptId];
        utils.setCallback(this, CALLBACK_TYPES.SCRIPT_CONFIG, callback);

        if (script && script.version === version) {
            // return from memory
            var savedScript =
                UIModel.getInstance().scriptSettings.loadedScripts[scriptId];
            callback(savedScript);
        } else {
            // load script
            model.scriptConfigRequest = new ScriptConfigRequest(scriptId);
            var msg = UIModel.getInstance().scriptConfigRequest.formatJSON();
            utils.sendMessage(this, msg);
        }
    };

    /**
     * Saves the results from a script
     * @memberof AgentLibrary.Call
     * @param {string} uii The UII of the call the script results belong to
     * @param {number} scriptId Id of script
     * @param {object} jsonResult JSON object of script results, name/value pairs
     */
    AgentLibrary.prototype.saveScriptResult = function (
        uii,
        scriptId,
        jsonResult
    ) {
        UIModel.getInstance().scriptResultRequest = new ScriptResultRequest(
            uii,
            scriptId,
            jsonResult
        );
        var msg = UIModel.getInstance().scriptResultRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Get available list of agents available for Direct Transfer
     * @memberof AgentLibrary.Call
     */
    AgentLibrary.prototype.directAgentXferList = function (callback) {
        UIModel.getInstance().directAgentTransferListRequest =
            new DirectAgentTransferList();
        var msg =
            UIModel.getInstance().directAgentTransferListRequest.formatJSON();

        utils.setCallback(
            this,
            CALLBACK_TYPES.DIRECT_AGENT_TRANSFER_LIST,
            callback
        );
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer directly to an available agent from the directAgentXferList result and stay on the call
     * @memberof AgentLibrary.Call
     * @param {number} targetAgentId Agent id to transfer the call to
     */
    AgentLibrary.prototype.warmDirectAgentXfer = function (targetAgentId) {
        UIModel.getInstance().directAgentTransferRequest =
            new DirectAgentTransfer(targetAgentId, 'WARM');
        var msg = UIModel.getInstance().directAgentTransferRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Transfer directly to an available agent from the directAgentXferList result
     * and terminate the current agents call session
     * @memberof AgentLibrary.Call
     * @param {number} targetAgentId Agent id to transfer the call to
     */
    AgentLibrary.prototype.coldDirectAgentXfer = function (targetAgentId) {
        UIModel.getInstance().directAgentTransferRequest =
            new DirectAgentTransfer(targetAgentId, 'COLD');
        var msg = UIModel.getInstance().directAgentTransferRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Cancel the request to transfer directly to an agent
     * @memberof AgentLibrary.Call
     * @param {number} targetAgentId Agent id to transfer the call to
     */
    AgentLibrary.prototype.cancelDirectAgentXfer = function (targetAgentId) {
        UIModel.getInstance().directAgentTransferRequest =
            new DirectAgentTransfer(targetAgentId, 'CANCEL');
        var msg = UIModel.getInstance().directAgentTransferRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Send the direct agent transfer straight to voicemail, avoid any attempts to connect to the target agent
     * @memberof AgentLibrary.Call
     * @param {number} targetAgentId Agent id to receive the voicemail
     */
    AgentLibrary.prototype.voicemailDirectAgentXfer = function (targetAgentId) {
        UIModel.getInstance().directAgentTransferRequest =
            new DirectAgentTransfer(targetAgentId, 'VOICEMAIL');
        var msg = UIModel.getInstance().directAgentTransferRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Reject a presented direct agent transfer, if WARM requesting agent will be notified to try again,
     * if COLD a voicemail will be left for the target agent
     * @memberof AgentLibrary.Call
     * @param {number} targetAgentId Agent id to receive the voicemail
     */
    AgentLibrary.prototype.rejectDirectAgentXfer = function (uii) {
        UIModel.getInstance().directAgentTransferRequest =
            new DirectAgentTransfer('0', 'REJECT', uii);
        var msg = UIModel.getInstance().directAgentTransferRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Storing call history in callHistory model
     * @memberof AgentLibrary.Call
     * @param {Object} callHistory all calls history object
     */
    AgentLibrary.prototype.setCallHistory = function (callHistory) {
        var model = UIModel.getInstance();
        model.callHistory = Object.assign(model.callHistory, callHistory);
    };
}

function initAgentLibraryLead(context) {
    /**
     * @namespace Lead
     * @memberof AgentLibrary
     */

    'use strict';

    var AgentLibrary = context.AgentLibrary;

    /**
     * Get the history for a given lead
     * @memberof AgentLibrary.Lead
     * @param {number} leadId The lead id to retrieve history for
     * @param {function} [callback=null] Callback function when lead history response received
     */
    AgentLibrary.prototype.leadHistory = function (leadId, callback) {
        UIModel.getInstance().leadHistoryRequest = new LeadHistoryRequest(
            leadId
        );
        var msg = UIModel.getInstance().leadHistoryRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.LEAD_HISTORY, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Insert a lead to the given campaign
     * @memberof AgentLibrary.Lead
     * @param {object} dataObj agentId, campaignId, and lead info
     * @param {function} [callback=null] Callback function when lead history response received
     */
    AgentLibrary.prototype.leadInsert = function (dataObj, callback) {
        UIModel.getInstance().leadInsertRequest = new LeadInsertRequest(
            dataObj
        );
        var msg = UIModel.getInstance().leadInsertRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.LEAD_INSERT, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Update lead information
     * @memberof AgentLibrary.Lead
     * @param {string} leadId Id for lead to update
     * @param {string} leadPhone Lead phone number
     * @param {object} baggage Object containing lead information
     * @param {function} [callback=null] Callback function when lead history response received
     */
    AgentLibrary.prototype.leadUpdate = function (
        leadId,
        leadPhone,
        baggage,
        callback
    ) {
        UIModel.getInstance().leadUpdateRequest = new LeadUpdateRequest(
            leadId,
            leadPhone,
            baggage
        );
        var msg = UIModel.getInstance().leadUpdateRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.LEAD_UPDATE, callback);
        utils.sendMessage(this, msg);
    };
}

function initAgentLibraryChat(context) {
    /**
     * @namespace Chat
     * @memberof AgentLibrary
     */

    'use strict';

    var AgentLibrary = context.AgentLibrary;

    /**
     * Set the agent chat alias
     * @memberof AgentLibrary.Chat
     * @param {string} alias The alias string to be used for agent chat messages
     * @deprecated
     */
    AgentLibrary.prototype.setChatAlias = function (alias) {
        UIModel.getInstance().chatAliasRequest = new ChatAliasRequest(alias);
        var msg = UIModel.getInstance().chatAliasRequest.formatJSON();

        utils.sendMessage(this, msg);
    };

    /**
     * Request to enter/exit a public chat room
     * @memberof AgentLibrary.Chat
     * @param {string} action "ENTER" | "EXIT"
     * @param {number} roomId Chat room id
     * @deprecated
     */
    AgentLibrary.prototype.publicChatRoom = function (action, roomId) {
        UIModel.getInstance().chatRoomRequest = new ChatRoomRequest(
            action,
            'PUBLIC',
            roomId
        );
        var msg = UIModel.getInstance().chatRoomRequest.formatJSON();

        utils.sendMessage(this, msg);
    };

    /**
     * Request to enter/exit a private chat room
     * @memberof AgentLibrary.Chat
     * @param {string} action "ENTER" | "EXIT"
     * @param {number} roomId Chat room id
     * @param {number} agentOne Id for the logged in agent
     * @param {number} agentTwo Id for the agent or supervisor the logged in agent is chatting with
     * @deprecated
     */
    AgentLibrary.prototype.privateChatRoom = function (
        action,
        roomId,
        agentOne,
        agentTwo
    ) {
        UIModel.getInstance().chatRoomRequest = new ChatRoomRequest(
            action,
            'PRIVATE',
            roomId,
            agentOne,
            agentTwo
        );
        var msg = UIModel.getInstance().chatRoomRequest.formatJSON();

        utils.sendMessage(this, msg);
    };

    /**
     * Send a chat message to the given room
     * @memberof AgentLibrary.Chat
     * @param {number} roomId Id for chat room
     * @param {string} message The message to be sent
     * @param {function} [callback=null] Callback function when chat message received
     * @deprecated
     */
    AgentLibrary.prototype.sendChat = function (roomId, message, callback) {
        UIModel.getInstance().chatSendRequest = new ChatSendRequest(
            roomId,
            message
        );
        var msg = UIModel.getInstance().chatSendRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CHAT, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Get list of supervisors for logged in agent
     * @memberof AgentLibrary.Chat
     * @param {function} [callback=null] Callback function when chat message received
     * @deprecated
     */
    AgentLibrary.prototype.getSupervisors = function (callback) {
        UIModel.getInstance().supervisorListRequest =
            new SupervisorListRequest();
        var msg = UIModel.getInstance().supervisorListRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.SUPERVISOR_LIST, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * Send accept/decline response when a chat is presented to an agent
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {string} messageId Id tied to chat presented notification which this response is connected to.
     * @param {string} response ACCEPT|REJECT response
     * @param {string} responseReason Agent reason for Reject
     */
    AgentLibrary.prototype.chatPresentedResponse = function (
        uii,
        messageId,
        response,
        responseReason
    ) {
        UIModel.getInstance().chatPresentedRequest =
            new ChatPresentedResponseRequest(
                uii,
                messageId,
                response,
                responseReason
            );
        var msg = UIModel.getInstance().chatPresentedRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Send an external chat message
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {string} agentId The agent associated with the chat
     * @param {string} message The message sent by the agent
     */
    AgentLibrary.prototype.chatMessage = function (uii, agentId, message) {
        UIModel.getInstance().chatMessageRequest = new ChatMessageRequest(
            uii,
            agentId,
            message,
            false
        );
        var msg = UIModel.getInstance().chatMessageRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Send an whisper type chat message
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {string} agentId The agent associated with the chat
     * @param {string} message The message sent by the agent
     */
    AgentLibrary.prototype.chatWhisper = function (uii, agentId, message) {
        UIModel.getInstance().chatMessageRequest = new ChatMessageRequest(
            uii,
            agentId,
            message,
            true
        );
        var msg = UIModel.getInstance().chatMessageRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Send a disposition to end a chat session
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {number} agentId The agent's id
     * @param {number} dispositionId Id of the selected disposition
     * @param {string} [notes=""] Agent notes
     * @param {boolean} sendAcknowlegement Whether or not to fire callback
     * @param {object} [script=null] Script data associated with the chat session
     * @param {number} sessionId Id for chat session
     */
    AgentLibrary.prototype.chatDisposition = function (
        uii,
        agentId,
        dispositionId,
        notes,
        sendAcknowlegement,
        script,
        sessionId
    ) {
        UIModel.getInstance().chatDispositionRequest =
            new ChatDispositionRequest(
                uii,
                agentId,
                dispositionId,
                notes,
                sendAcknowlegement,
                script,
                sessionId
            );
        var msg = UIModel.getInstance().chatDispositionRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Send the chat to a different Chat Queue
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {number} agentId The agent's id
     * @param {number} chatQueueId Id of the Chat Queue to requeue to
     * @param {number} skillId Skill id associated with the Chat Queue
     * @param {boolean} [maintainAgent=false] Whether or not to keep the current agent connected to the chat on requeue
     */
    AgentLibrary.prototype.chatRequeue = function (
        uii,
        agentId,
        chatQueueId,
        skillId,
        maintainAgent
    ) {
        UIModel.getInstance().chatRequeueRequest = new ChatRequeueRequest(
            uii,
            agentId,
            chatQueueId,
            skillId,
            maintainAgent
        );
        var msg = UIModel.getInstance().chatRequeueRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Request summary of a chat
     * @memberof AgentLibrary.Chat
     * @param {string} uii The UII of the call the script results belong to
     * @param {string} sessionId session id of a chat
     * @param {string} segmentId is secure grade UUID
     */
    AgentLibrary.prototype.requestChatSummary = function (
        uii,
        sessionId,
        segmentId
    ) {
        UIModel.getInstance().chatSummaryRequest = new SummaryRequest(
            uii,
            sessionId,
            segmentId
        );

        const message = UIModel.getInstance().chatSummaryRequest.formatJSON();
        utils.sendMessage(this, message);
    };

    /**
     * Sent when agent starts/stops typing
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {string} message Pending Agent message - sent to any monitoring Supervisors
     */
    AgentLibrary.prototype.chatTyping = function (uii, message) {
        UIModel.getInstance().chatTypingRequest = new ChatTypingRequest(
            uii,
            message
        );
        var msg = UIModel.getInstance().chatTypingRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Request to add a session on an existing chat
     * @memberof AgentLibrary.Chat
     * @param {string} monitorAgentId Agent id handling this chat, the agent being monitored
     */
    AgentLibrary.prototype.monitorAgentChats = function (monitorAgentId) {
        UIModel.getInstance().monitorChatRequest = new MonitorChatRequest(
            monitorAgentId
        );
        var msg = UIModel.getInstance().monitorChatRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Request to stop a chat monitoring session for a specific agent
     * @memberof AgentLibrary.Chat
     * @param {string} monitorAgentId Agent id of agent being monitored
     */
    AgentLibrary.prototype.stopMonitoringChatsByAgent = function (
        monitorAgentId
    ) {
        UIModel.getInstance().stopMonitorChatRequest =
            new StopMonitorChatRequest(monitorAgentId);
        var msg = UIModel.getInstance().stopMonitorChatRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Request to drop all chat monitoring sessions for the logged in agent
     * @memberof AgentLibrary.Chat
     */
    AgentLibrary.prototype.stopMonitoringAllAgentChats = function () {
        UIModel.getInstance().stopMonitorChatRequest =
            new StopMonitorChatRequest();
        var msg = UIModel.getInstance().stopMonitorChatRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Request to terminate an active chat session
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {string} agentId Current logged in agent id
     * @param {string} sessionId Chat session id
     */
    AgentLibrary.prototype.leaveChat = function (uii, agentId, sessionId) {
        UIModel.getInstance().leaveChatRequest = new LeaveChatRequest(
            uii,
            agentId,
            sessionId
        );
        var msg = UIModel.getInstance().leaveChatRequest.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Request a list of active chats by agent id
     * @memberof AgentLibrary.Chat
     * @param {string} agentId Current logged in agent id
     * @param {string} monitorAgentId Agent id handling chats
     * @param {function} [callback=null] Callback function when chat-list request received
     */
    AgentLibrary.prototype.chatList = function (
        agentId,
        monitorAgentId,
        callback
    ) {
        UIModel.getInstance().chatListRequest = new ChatListRequest(
            agentId,
            monitorAgentId
        );
        var msg = UIModel.getInstance().chatListRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CHAT_LIST, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * set chat in state of agent-chat-end
     * @memberof AgentLibrary.Chat
     * @param {string} uii Unique identifier for the chat session
     * @param {string} agentId Current logged in agent id
     */

    AgentLibrary.prototype.chatAgentEnd = function (agentId, uii) {
        UIModel.getInstance().chatAgentEnd = new ChatAgentEndRequest(
            agentId,
            uii
        );
        var msg = UIModel.getInstance().chatAgentEnd.formatJSON();
        utils.sendMessage(this, msg);
    };

    /**
     * Sends chat state change message to IntelliQueue
     * @memberof AgentLibrary.Agent
     * @param {string} chatState The base chat state <br />
     * CHAT-AVAILABLE | CHAT-PRESENTED | CHAT-ENGAGED | CHAT-RNA
     * @param {function} [callback=null] Callback function when chatState response received
     */
    AgentLibrary.prototype.setChatState = function (chatState, callback) {
        UIModel.getInstance().chatStateRequest = new ChatStateRequest(
            chatState
        );
        var msg = UIModel.getInstance().chatStateRequest.formatJSON();

        utils.setCallback(this, CALLBACK_TYPES.CHAT_STATE, callback);
        utils.sendMessage(this, msg);
    };

    /**
     * initialize a chat session by sending a manual outbound sms
     * @memberof AgentLibrary.Chat
     * @param {string} agentId Current logged in agent id
     * @param {number} chatQueueId Id of the Chat Queue to send this sms through
     * @param {number} ani to receive the sms
     * @param {number} dnis to be used for the sms
     * @param {string} message content
     */

    AgentLibrary.prototype.sendManualOutboundSms = function (
        agentId,
        chatQueueId,
        ani,
        dnis,
        message
    ) {
        UIModel.getInstance().chatManualSms = new ChatManualSmsRequest(
            agentId,
            chatQueueId,
            ani,
            dnis,
            message
        );
        var msg = UIModel.getInstance().chatManualSms.formatJSON();
        utils.sendMessage(this, msg);
    };
}

function initAgentLibraryLogger(context) {
    'use strict';

    var AgentLibrary = context.AgentLibrary;
    var AGENT_LIBRARY_LOGGER_VERSION = 6;

    AgentLibrary.prototype.openLogger = function () {
        var instance = this;

        if ('indexedDB' in context) {
            // Open database
            var dbRequest = indexedDB.open(
                'AgentLibraryLogging',
                AGENT_LIBRARY_LOGGER_VERSION
            );

            dbRequest.onerror = function (event) {
                // Generic error handler for all errors targeted at this database requests
                console.error(
                    'AgentLibrary: AgentLibraryLogging Database error - ' +
                        event.target.errorCode
                );
            };

            dbRequest.onsuccess = function (event) {
                instance._db = event.target.result;

                //prune items older than 2 days
                instance.purgeLog(instance._db, 'logger');
                console.log(
                    'AgentLibrary: AgentLibraryLogging Successful logging of record'
                );
            };

            // This event is only implemented in recent browsers
            dbRequest.onupgradeneeded = function (event) {
                console.log('AgentLibrary: Upgrading AgentLibraryLogging');
                instance._db = event.target.result;

                // Create an objectStore to hold log information. Key path should be unique
                if (!instance._db.objectStoreNames.contains('logger')) {
                    var objectStore = instance._db.createObjectStore('logger', {
                        autoIncrement: true,
                    });

                    // simple indicies: index name, index column path
                    objectStore.createIndex('logLevel', 'logLevel', {
                        unique: false,
                    });
                    objectStore.createIndex('dts', 'dts', { unique: false });

                    // index for logLevel and date range
                    var name = 'levelAndDate';
                    var keyPath = ['logLevel', 'dts'];
                    objectStore.createIndex(name, keyPath, { unique: false });
                }
            };
        } else {
            console.warn(
                'AgentLibrary: indexedDB NOT supported by your Browser.'
            );
        }
    };

    /**
     * Purge records older than 2 days from the AgentLibrary log
     * @memberof AgentLibrary
     */
    AgentLibrary.prototype.purgeLog = function (db, store) {
        if (db) {
            try {
                var transaction = db.transaction([store], 'readwrite');
                var objectStore = transaction.objectStore(store);
                var dateIndex = objectStore.index('dts');
                var endDate = new Date();
                endDate.setDate(endDate.getDate() - 2); // two days ago

                var range = IDBKeyRange.upperBound(endDate);
                dateIndex.openCursor(range).onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        objectStore.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
            } catch (err) {
                // no op
            }
        }
    };

    /**
     * Clear the AgentLibrary log by emptying the IndexedDB object store
     * @memberof AgentLibrary
     */
    AgentLibrary.prototype.clearLog = function (db) {
        var transaction = db.transaction(['logger'], 'readwrite');
        var objectStore = transaction.objectStore('logger');

        var objectStoreRequest = objectStore.clear();

        objectStoreRequest.onsuccess = function (event) {
            console.log('AgentLibrary: logger database cleared');
        };
    };

    AgentLibrary.prototype.deleteDB = function (dbName) {
        dbName = dbName || 'AgentLibraryLogging';
        var DBDeleteRequest = indexedDB.deleteDatabase(dbName);

        DBDeleteRequest.onerror = function (event) {
            console.log('Error deleting database.', dbName);
        };

        DBDeleteRequest.onsuccess = function (event) {
            console.log('Database', dbName, 'deleted successfully');
        };
    };

    AgentLibrary.prototype.getLogRecords = function (
        logLevel,
        startDate,
        endDate,
        maxRows,
        callback
    ) {
        logLevel = logLevel || '';
        var instance = this;
        var transaction = instance._db.transaction(['logger'], 'readonly');
        var objStore = transaction.objectStore('logger');
        var index = null,
            cursor = null,
            range = null,
            limit = maxRows || 100;
        utils.setCallback(instance, CALLBACK_TYPES.LOG_RESULTS, callback);

        if (
            logLevel !== '' &&
            logLevel.toUpperCase() !== 'ALL' &&
            logLevel.toUpperCase() !== 'NO-STATS'
        ) {
            // looking for specific log level type
            if (startDate && endDate) {
                var lowerBound = [logLevel.toLowerCase(), startDate];
                var upperBound = [logLevel.toLowerCase(), endDate];
                range = IDBKeyRange.bound(lowerBound, upperBound);
            } else if (startDate) {
                range = IDBKeyRange.lowerBound([
                    logLevel.toLowerCase(),
                    startDate,
                ]);
            } else if (endDate) {
                range = IDBKeyRange.upperBound([
                    logLevel.toLowerCase(),
                    endDate,
                ]);
            }

            if (range !== null) {
                // with the provided date range
                var levelAndDateReturn = [];
                var idxLevelAndDate = 0;
                index = objStore.index('levelAndDate');
                index.openCursor(range, 'prev').onsuccess = function (event) {
                    cursor = event.target.result;
                    if (cursor && idxLevelAndDate < limit) {
                        levelAndDateReturn.push(cursor.value);
                        idxLevelAndDate = idxLevelAndDate + 1;
                        cursor.continue();
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.LOG_RESULTS,
                            levelAndDateReturn
                        );
                    }
                };
            } else {
                // no date range specified, return all within log level
                var logLevelReturn = [];
                var idxLogLevel = 0;
                index = objStore.index('logLevel');
                index.openCursor(logLevel, 'prev').onsuccess = function (
                    event
                ) {
                    cursor = event.target.result;
                    if (cursor && idxLogLevel < limit) {
                        logLevelReturn.push(cursor.value);
                        idxLogLevel = idxLogLevel + 1;
                        cursor.continue();
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.LOG_RESULTS,
                            logLevelReturn
                        );
                    }
                };
            }
        } else if (logLevel.toUpperCase() === 'NO-STATS') {
            // give us all types except stats
            if (startDate && endDate) {
                range = IDBKeyRange.bound(startDate, endDate);
            } else if (startDate) {
                range = IDBKeyRange.lowerBound(startDate);
            } else if (endDate) {
                range = IDBKeyRange.upperBound(endDate);
            }

            if (range !== null) {
                // with the provided date range
                var dtsNoStatsReturn = [];
                var idxDTSNoStats = 0;
                index = objStore.index('dts');

                index.openCursor(range, 'prev').onsuccess = function (event) {
                    cursor = event.target.result;
                    if (cursor && idxDTSNoStats < limit) {
                        if (cursor.value.logLevel !== 'stats') {
                            dtsNoStatsReturn.push(cursor.value);
                            idxDTSNoStats = idxDTSNoStats + 1;
                        }
                        cursor.continue();
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.LOG_RESULTS,
                            dtsNoStatsReturn
                        );
                    }
                };
            } else {
                // no date range specified, return all records
                var noStatsReturn = [];
                var idxNoStats = 0;
                objStore.openCursor().onsuccess = function (event) {
                    cursor = event.target.result;
                    if (cursor && idxNoStats < limit) {
                        if (cursor.value.logLevel !== 'stats') {
                            noStatsReturn.push(cursor.value);
                            idxNoStats = idxNoStats + 1;
                        }
                        cursor.continue();
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.LOG_RESULTS,
                            noStatsReturn
                        );
                    }
                };
            }
        } else {
            // give us all log level types
            if (startDate && endDate) {
                range = IDBKeyRange.bound(startDate, endDate);
            } else if (startDate) {
                range = IDBKeyRange.lowerBound(startDate);
            } else if (endDate) {
                range = IDBKeyRange.upperBound(endDate);
            }

            if (range !== null) {
                // with the provided date range
                var dtsReturn = [];
                var idxDTS = 0;
                index = objStore.index('dts');

                index.openCursor(range, 'prev').onsuccess = function (event) {
                    cursor = event.target.result;
                    if (cursor && idxDTS < limit) {
                        dtsReturn.push(cursor.value);
                        idxDTS = idxDTS + 1;
                        cursor.continue();
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.LOG_RESULTS,
                            dtsReturn
                        );
                    }
                };
            } else {
                // no date range specified, return all records
                var allValsReturn = [];
                var idxAll = 0;
                objStore.openCursor().onsuccess = function (event) {
                    cursor = event.target.result;
                    if (cursor && idxAll < limit) {
                        allValsReturn.push(cursor.value);
                        idxAll = idxAll + 1;
                        cursor.continue();
                    } else {
                        utils.fireCallback(
                            instance,
                            CALLBACK_TYPES.LOG_RESULTS,
                            allValsReturn
                        );
                    }
                };
            }
        }

        return null;
    };
}

function initAgentLibraryMultisocket(context) {
    /**
     * @namespace Multisocket
     * @memberof AgentLibrary
     */

    'use strict';

    var AgentLibrary = context.AgentLibrary;

    /**
     * Method to request call details from other tabs using the broadcast channel, for multisocket
     */
    AgentLibrary.prototype.loadCurrentCall = function (callback) {
        broadcastChannelHelper.requestCurrentCall(callback);
    };
}

function initAgentLibraryConsoleLogger(context) {
    'use strict';

    var AgentLibrary = context.AgentLibrary;
    var AGENT_LIBRARY_CONSOLE_LOGGER_VERSION = 1;

    AgentLibrary.prototype.openConsoleLogger = function () {
        var instance = this;
        if ('indexedDB' in context) {
            var dbRequest = indexedDB.open(
                'AgentLibraryConsoleLogging',
                AGENT_LIBRARY_CONSOLE_LOGGER_VERSION
            );

            dbRequest.onerror = function (event) {
                // Generic error handler for all errors targeted at this database requests
                console.error(
                    'AgentLibrary: AgentLibraryConsoleLogging Database error - ' +
                        event.target.errorCode
                );
            };

            dbRequest.onsuccess = function (event) {
                instance._consoleDb = event.target.result;

                //prune items older than 2 days
                instance.purgeLog(instance._consoleDb, 'consoleLogger');
                console.log(
                    'AgentLibrary: AgentLibraryConsoleLogging Successful logging of record'
                );

                _overrideConsole();
            };

            // This event is only implemented in recent browsers
            dbRequest.onupgradeneeded = function (event) {
                console.log(
                    'AgentLibrary: Upgrading AgentLibraryConsoleLogging'
                );

                instance._consoleDb = event.target.result;

                // Create an objectStore to hold log information. Key path should be unique
                if (
                    !instance._consoleDb.objectStoreNames.contains(
                        'consoleLogger'
                    )
                ) {
                    var objectStore = instance._consoleDb.createObjectStore(
                        'consoleLogger',
                        { autoIncrement: true }
                    );

                    // simple indicies: index name, index column path
                    objectStore.createIndex('type', 'type', { unique: false });
                    objectStore.createIndex('dts', 'dts', { unique: false });
                    objectStore.createIndex('agentId', 'agentId', {
                        unique: false,
                    });

                    // index for type and agent id
                    var name = 'typeAndAgent';
                    var keyPath = ['type', 'agentId'];
                    objectStore.createIndex(name, keyPath, { unique: false });
                }
            };
        } else {
            console.warn(
                'AgentLibrary: indexedDB NOT supported by your Browser.'
            );
        }
    };

    AgentLibrary.prototype.getConsoleLogRecords = function (type, callback) {
        var agentId = UIModel.getInstance().agentSettings.agentId; // only return records for this agent id
        var instance = this;
        var transaction = instance._consoleDb.transaction(
            ['consoleLogger'],
            'readonly'
        );
        var objStore = transaction.objectStore('consoleLogger');
        var index = null,
            cursor = null,
            range = null,
            limit = 5000;

        utils.setCallback(
            instance,
            CALLBACK_TYPES.LOG_CONSOLE_RESULTS,
            callback
        );

        var result = [];
        if (type) {
            // everything with this type
            index = objStore.index('typeAndAgent');
            range = IDBKeyRange.only([type.toUpperCase(), agentId]);
        } else {
            index = objStore.index('agentId');
            range = IDBKeyRange.only(agentId);
        }

        var count = 0;
        index.openCursor(range, 'prev').onsuccess = function (event) {
            cursor = event.target.result;
            if (cursor && count < limit) {
                result.push(cursor.value);
                count++;
                cursor.continue();
            } else {
                utils.fireCallback(
                    instance,
                    CALLBACK_TYPES.LOG_CONSOLE_RESULTS,
                    result
                );
            }
        };
    };

    function _overrideConsole() {
        // override the window.console functions, process as normal then save to the local db
        var browserConsole = Object.assign({}, window.console);
        (function (defaultConsole) {
            var instance;
            if (
                UIModel &&
                UIModel.getInstance() &&
                UIModel.getInstance().libraryInstance
            ) {
                instance = UIModel.getInstance().libraryInstance;
            } else {
                // fallback
                instance = new AgentLibrary();
            }

            var agentSettings = UIModel.getInstance().agentSettings;

            function _getRecord(type, args) {
                var result = [];
                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    if (typeof arg === 'function') {
                        result.push(arg.toString());
                    } else if (typeof arg === 'object') {
                        try {
                            result.push(JSON.stringify(arg));
                        } catch (e) {
                            // do nothing with err
                        }
                    } else {
                        result.push(arg);
                    }
                }

                return {
                    type: type,
                    message: result.join(' '),
                    dts: new Date(),
                    agentId: agentSettings.agentId,
                    agentName:
                        agentSettings.firstName + ' ' + agentSettings.lastName,
                };
            }

            function _saveRecord(type, args) {
                if (instance._consoleDb) {
                    try {
                        var transaction = instance._consoleDb.transaction(
                            ['consoleLogger'],
                            'readwrite'
                        );
                        var store = transaction.objectStore('consoleLogger');

                        store.add(_getRecord(type, args));
                    } catch (err) {
                        defaultConsole.error.apply(
                            this,
                            'AgentLibrary: AgentLibraryConsoleLogging Error adding console log message: ' +
                                err
                        );
                    }
                }
            }

            window.console.log = function () {
                defaultConsole.log.apply(this, arguments);
                _saveRecord('LOG', arguments);
            };
            window.console.info = function () {
                defaultConsole.info.apply(this, arguments);
                _saveRecord('INFO', arguments);
            };
            window.console.warn = function () {
                defaultConsole.warn.apply(this, arguments);
                _saveRecord('WARN', arguments);
            };
            window.console.error = function () {
                defaultConsole.error.apply(this, arguments);
                _saveRecord('ERROR', arguments);
            };
        })(browserConsole);
    }
}

function initAgentLibrarySoftphoneService(context) {
    /**
     * @namespace Softphone
     * @memberof AgentLibrary
     */

    'use strict';

    var AgentLibrary = context.AgentLibrary;
    var agentAuthRequest = UIModel.getInstance().authenticateRequest;
    // Auth token ,agentId,dialDest will be passed in init() function when sipInit is initialized in AgentJs.
    var serviceInstance = new SoftphoneService({
        authToken: agentAuthRequest && agentAuthRequest.engageAccessToken,
        agentId: UIModel.getInstance().agentSettings.agentId,
        componentName: AgentLibrary.componentName,
    });

    // set the softphone instance on the Lib
    AgentLibrary.prototype._SoftphoneService = serviceInstance;

    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    /* These functions are available externally to agent-js or other parent apps */

    /**
     * Initializes the SIP library, sets up callback functions
     * @memberof AgentLibrary.Softphone
     */
    AgentLibrary.prototype.sipInit =
        serviceInstance.sipInit.bind(serviceInstance);

    /**
     * clear webRtc settings, hangup, unregister
     * @memberof SoftphoneLibrary
     * @returns boolean - success state
     */
    AgentLibrary.prototype.sipTerminate =
        serviceInstance.sipTerminate.bind(serviceInstance);
    /**
     * Sends a session.accept response to a SIP invite event.
     * @memberof AgentLibrary.Softphone
     */
    AgentLibrary.prototype.sipAnswer =
        serviceInstance.sipAnswer.bind(serviceInstance);

    /**
     * Sends a session.reject response to a SIP invite event.
     * @memberof AgentLibrary.Softphone
     */
    AgentLibrary.prototype.sipReject =
        serviceInstance.sipReject.bind(serviceInstance);

    /**
     * Request microphone access, if already registered, call hangup
     * @memberof AgentLibrary.Softphone
     */
    AgentLibrary.prototype.sipRegister =
        serviceInstance.sipRegister.bind(serviceInstance);

    /**
     * Sends session.cancel if connected, or session.bye if not connected to a call
     * @memberof AgentLibrary.Softphone
     */
    AgentLibrary.prototype.sipHangUp =
        serviceInstance.sipHangUp.bind(serviceInstance);

    /**
     * Sends session.dtmf for the tone specified
     * @memberof AgentLibrary.Softphone
     * @param {string} dtmf The dtmf tone to send
     */
    AgentLibrary.prototype.sipSendDTMF =
        serviceInstance.sipSendDTMF.bind(serviceInstance);

    /**
     * Toggles call audio on/off
     * @memberof AgentLibrary.Softphone
     * @param {boolean} boolean for whether the call audio is on or off
     */
    AgentLibrary.prototype.sipToggleMute =
        serviceInstance.sipToggleMute.bind(serviceInstance);

    AgentLibrary.prototype.switchSoftphoneRegistrar =
        serviceInstance.switchSoftphoneRegistrar.bind(serviceInstance);

    AgentLibrary.prototype.resetSoftphoneSession =
        serviceInstance.resetSoftphoneSession.bind(serviceInstance);

    /**
     * Initializes the SIP library, sets up callback functions
     * Request microphone access, if already registered, call hangup
     * @memberof AgentLibrary.Softphone
     */
    AgentLibrary.prototype.sipInitAndRegister =
        serviceInstance.sipInitAndRegister.bind(serviceInstance);
}

var initAgentLibrary = function (context) {
    initAgentLibraryCore(context);
    initAgentLibrarySocket(context);
    initAgentLibraryAgent(context);
    initAgentLibraryCall(context);
    initAgentLibraryLead(context);
    initAgentLibraryChat(context);
    initAgentLibraryLogger(context);
    initAgentLibraryConsoleLogger(context);
    initAgentLibrarySoftphoneService(context);
    initAgentLibraryMultisocket(context);

    return context.AgentLibrary;
};

if (typeof define === 'function' && define.amd) {
    // Expose Library as an AMD module if it's loaded with RequireJS or
    // similar.
    //console.log("AgentLibrary: using AMD");
    define(function () {
        return initAgentLibrary({});
    });
} else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    //console.log("AgentLibrary: Using Node");
    module.exports = initAgentLibrary(this);
} else {
    // Load Library normally (creating a Library global) if not using an AMD
    // loader.
    //console.log("AgentLibrary: Not using AMD");
    initAgentLibrary(this);
}

} (this));
