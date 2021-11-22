(function(){"use strict";var e={636:function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};const a=i(r(622));const s=r(570);let n=45e6;function checkActivation(e){if(!e._compiler){throw new Error("You must use this plugin only after creating webpack instance!")}}function getModulePath(e,t){return a.default.isAbsolute(e)?e:a.default.join(t.context,e)}function createWebpackData(e){return t=>{if(t._data){const r=t._currentLevel;const i=t._levels[r];return{result:e,level:i}}return[null,e]}}function getData(e,t){if(e._data instanceof Map){return e._data.get(t)}else if(e._data){return e.data[t]}else if(e.data instanceof Map){return e.data.get(t)}else{return e.data[t]}}function setData(e,t,r){const i=r(e);if(e._data instanceof Map){e._data.set(t,i)}else if(e._data){e.data[t]=i}else if(e.data instanceof Map){e.data.set(t,i)}else{e.data[t]=i}}function getStatStorage(e){if(e._statStorage){return e._statStorage}else if(e._statBackend){return e._statBackend}else{throw new Error("Couldn't find a stat storage")}}function getFileStorage(e){if(e._readFileStorage){return e._readFileStorage}else if(e._readFileBackend){return e._readFileBackend}else{throw new Error("Couldn't find a readFileStorage")}}function getReadDirBackend(e){if(e._readdirBackend){return e._readdirBackend}else if(e._readdirStorage){return e._readdirStorage}else{throw new Error("Couldn't find a readDirStorage from Webpack Internals")}}class VirtualModulesPlugin{constructor(e){this._compiler=null;this._watcher=null;this._staticModules=e||null}writeModule(e,t){if(!this._compiler){throw new Error(`Plugin has not been initialized`)}checkActivation(this);const r=t?t.length:0;const i=Date.now();const a=new Date(i);const o=new s.VirtualStats({dev:8675309,nlink:0,uid:1e3,gid:1e3,rdev:0,blksize:4096,ino:n++,mode:33188,size:r,blocks:Math.floor(r/4096),atime:a,mtime:a,ctime:a,birthtime:a});const l=getModulePath(e,this._compiler);if(process.env.WVM_DEBUG)console.log(this._compiler.name,"Write virtual module:",l,t);let c=this._watcher&&this._watcher.watchFileSystem;while(c&&c.wfs){c=c.wfs}let u=this._compiler.inputFileSystem;while(u&&u._inputFileSystem){u=u._inputFileSystem}u._writeVirtualFile(l,o,t);if(c&&(c.watcher.fileWatchers.size||c.watcher.fileWatchers.length)){const t=c.watcher.fileWatchers instanceof Map?Array.from(c.watcher.fileWatchers.values()):c.watcher.fileWatchers;for(const r of t){if(r.path===l){if(process.env.DEBUG)console.log(this._compiler.name,"Emit file change:",l,i);delete r.directoryWatcher._cachedTimeInfoEntries;r.directoryWatcher.setFileTime(e,i,false,false,null);r.emit("change",i,null)}}}}apply(e){this._compiler=e;const afterEnvironmentHook=()=>{let t=e.inputFileSystem;while(t&&t._inputFileSystem){t=t._inputFileSystem}if(!t._writeVirtualFile){const e=t.purge;t.purge=()=>{e.apply(t,[]);if(t._virtualFiles){Object.keys(t._virtualFiles).forEach((e=>{const r=t._virtualFiles[e];t._writeVirtualFile(e,r.stats,r.contents)}))}};t._writeVirtualFile=(e,r,i)=>{const o=getStatStorage(t);const l=getFileStorage(t);const c=getReadDirBackend(t);t._virtualFiles=t._virtualFiles||{};t._virtualFiles[e]={stats:r,contents:i};setData(o,e,createWebpackData(r));setData(l,e,createWebpackData(i));const u=e.split(/[\\/]/);let d=u.length-1;const _=u[0]?1:0;while(d>_){const e=u.slice(0,d).join(a.default.sep)||a.default.sep;try{t.readdirSync(e)}catch(t){const i=Date.now();const a=new s.VirtualStats({dev:8675309,nlink:0,uid:1e3,gid:1e3,rdev:0,blksize:4096,ino:n++,mode:16877,size:r.size,blocks:Math.floor(r.size/4096),atime:i,mtime:i,ctime:i,birthtime:i});setData(c,e,createWebpackData([]));setData(o,e,createWebpackData(a))}let i=getData(getReadDirBackend(t),e);i=i[1]||i.result;const l=u[d];if(i.indexOf(l)<0){const r=i.concat([l]).sort();setData(getReadDirBackend(t),e,createWebpackData(r))}else{break}d--}}}};const afterResolversHook=()=>{if(this._staticModules){for(const[e,t]of Object.entries(this._staticModules)){this.writeModule(e,t)}this._staticModules=null}};const watchRunHook=(t,r)=>{this._watcher=t.compiler||t;const i=e.inputFileSystem._virtualFiles;const a=e.fileTimestamps;if(i&&a&&typeof a.set==="function"){Object.keys(i).forEach((e=>{a.set(e,+i[e].stats.mtime)}))}r()};if(e.hooks){e.hooks.afterEnvironment.tap("VirtualModulesPlugin",afterEnvironmentHook);e.hooks.afterResolvers.tap("VirtualModulesPlugin",afterResolversHook);e.hooks.watchRun.tapAsync("VirtualModulesPlugin",watchRunHook)}else{e.plugin("after-environment",afterEnvironmentHook);e.plugin("after-resolvers",afterResolversHook);e.plugin("watch-run",watchRunHook)}}}e.exports=VirtualModulesPlugin},570:function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:true});t.VirtualStats=void 0;const a=i(r(619));class VirtualStats{constructor(e){for(const t in e){if(!Object.prototype.hasOwnProperty.call(e,t)){continue}this[t]=e[t]}}_checkModeProperty(e){return(this.mode&a.default.S_IFMT)===e}isDirectory(){return this._checkModeProperty(a.default.S_IFDIR)}isFile(){return this._checkModeProperty(a.default.S_IFREG)}isBlockDevice(){return this._checkModeProperty(a.default.S_IFBLK)}isCharacterDevice(){return this._checkModeProperty(a.default.S_IFCHR)}isSymbolicLink(){return this._checkModeProperty(a.default.S_IFLNK)}isFIFO(){return this._checkModeProperty(a.default.S_IFIFO)}isSocket(){return this._checkModeProperty(a.default.S_IFSOCK)}}t.VirtualStats=VirtualStats},619:function(e){e.exports=require("constants")},622:function(e){e.exports=require("path")}};var t={};function __nccwpck_require__(r){var i=t[r];if(i!==undefined){return i.exports}var a=t[r]={exports:{}};var s=true;try{e[r].call(a.exports,a,a.exports,__nccwpck_require__);s=false}finally{if(s)delete t[r]}return a.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r=__nccwpck_require__(636);module.exports=r})();