/** @license


 SoundManager 2: JavaScript Sound for the Web
 ----------------------------------------------
 http://schillmania.com/projects/soundmanager2/

 Copyright (c) 2007, Scott Schiller. All rights reserved.
 Code provided under the BSD License:
 http://schillmania.com/projects/soundmanager2/license.txt

 V2.97a.20111220
 */
(function (G) {
    function W(W, la) {
        function l(b) {
            return function (a) {
                var d = this._t;
                return !d || !d._a ? (d && d.sID ? c._wD(k + "ignoring " + a.type + ": " + d.sID) : c._wD(k + "ignoring " + a.type), null) : b.call(this, a)
            }
        }

        this.flashVersion = 8;
        this.debugMode = !0;
        this.debugFlash = !1;
        this.consoleOnly = this.useConsole = !0;
        this.waitForWindowLoad = !1;
        this.bgColor = "#ffffff";
        this.useHighPerformance = !1;
        this.html5PollingInterval = this.flashPollingInterval = null;
        this.flashLoadTimeout = 1E3;
        this.wmode = null;
        this.allowScriptAccess = "always";
        this.useFlashBlock = !1;
        this.useHTML5Audio = !0;
        this.html5Test = /^(probably|maybe)$/i;
        this.preferFlash = !0;
        this.noSWFCache = !1;
        this.audioFormats = {
            mp3: {
                type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                required: !0
            },
            mp4: {
                related: ["aac", "m4a"],
                type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                required: !1
            },
            ogg: {type: ["audio/ogg; codecs=vorbis"], required: !1},
            wav: {type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"], required: !1}
        };
        this.defaultOptions = {
            autoLoad: !1,
            autoPlay: !1,
            from: null,
            loops: 1,
            onid3: null,
            onload: null,
            whileloading: null,
            onplay: null,
            onpause: null,
            onresume: null,
            whileplaying: null,
            onposition: null,
            onstop: null,
            onfailure: null,
            onfinish: null,
            multiShot: !0,
            multiShotEvents: !1,
            position: null,
            pan: 0,
            stream: !0,
            to: null,
            type: null,
            usePolicyFile: !1,
            volume: 100
        };
        this.flash9Options = {
            isMovieStar: null,
            usePeakData: !1,
            useWaveformData: !1,
            useEQData: !1,
            onbufferchange: null,
            ondataerror: null
        };
        this.movieStarOptions = {
            bufferTime: 3, serverURL: null, onconnect: null,
            duration: null
        };
        this.movieID = "sm2-container";
        this.id = la || "sm2movie";
        this.debugID = "soundmanager-debug";
        this.debugURLParam = /([#?&])debug=1/i;
        this.versionNumber = "V2.97a.20111220";
        this.movieURL = this.version = null;
        this.url = W || null;
        this.altURL = null;
        this.enabled = this.swfLoaded = !1;
        this.oMC = null;
        this.sounds = {};
        this.soundIDs = [];
        this.didFlashBlock = this.muted = !1;
        this.filePattern = null;
        this.filePatterns = {flash8: /\.mp3(\?.*)?$/i, flash9: /\.mp3(\?.*)?$/i};
        this.features = {
            buffering: !1, peakData: !1, waveformData: !1, eqData: !1,
            movieStar: !1
        };
        this.sandbox = {
            type: null,
            types: {
                remote: "remote (domain-based) rules",
                localWithFile: "local with file access (no internet access)",
                localWithNetwork: "local with network (internet access only, no local access)",
                localTrusted: "local, trusted (local+internet access)"
            },
            description: null,
            noRemote: null,
            noLocal: null
        };
        var ma;
        try {
            ma = "undefined" !== typeof Audio && "undefined" !== typeof(new Audio).canPlayType
        } catch (fb) {
            ma = !1
        }
        this.hasHTML5 = ma;
        this.html5 = {usingFlash: null};
        this.flash = {};
        this.ignoreFlash = this.html5Only = !1;
        var Ea, c = this, i = null, k = "HTML5::", u, p = navigator.userAgent, j = G, O = j.location.href.toString(), h = document, na, X, m, B = [], oa = !0, w, P = !1, Q = !1, n = !1, y = !1, Y = !1, o, Za = 0, R, v, pa, H, I, Z, Fa, qa, E, $, aa, J, ra, sa, ba, ca, K, Ga, ta, $a = ["log", "info", "warn", "error"], Ha, da, Ia, S = null, ua = null, q, va, L, Ja, ea, fa, wa, s, ga = !1, xa = !1, Ka, La, Ma, ha = 0, T = null, ia, z = null, Na, ja, U, C, ya, za, Oa, r, Pa = Array.prototype.slice, F = !1, t, ka, Qa, A, Ra, Aa = p.match(/(ipad|iphone|ipod)/i), ab = p.match(/firefox/i), bb = p.match(/droid/i), D = p.match(/msie/i), cb = p.match(/webkit/i),
            V = p.match(/safari/i) && !p.match(/chrome/i), db = p.match(/opera/i), Ba = p.match(/(mobile|pre\/|xoom)/i) || Aa, Ca = !O.match(/usehtml5audio/i) && !O.match(/sm2\-ignorebadua/i) && V && !p.match(/silk/i) && p.match(/OS X 10_6_([3-7])/i), Sa = "undefined" !== typeof console && "undefined" !== typeof console.log, Da = "undefined" !== typeof h.hasFocus ? h.hasFocus() : null, M = V && "undefined" === typeof h.hasFocus, Ta = !M, Ua = /(mp3|mp4|mpa)/i, N = h.location ? h.location.protocol.match(/http/i) : null, Va = !N ? "http://" : "", Wa = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|mp4v|3gp|3g2)\s*(?:$|;)/i,
            Xa = "mpeg4,aac,flv,mov,mp4,m4v,f4v,m4a,mp4v,3gp,3g2".split(","), eb = RegExp("\\.(" + Xa.join("|") + ")(\\?.*)?$", "i");
        this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.useAltURL = !N;
        this._global_a = null;
        if (Ba && (c.useHTML5Audio = !0, c.preferFlash = !1, Aa))F = c.ignoreFlash = !0;
        this.supported = this.ok = function () {
            return z ? n && !y : c.useHTML5Audio && c.hasHTML5
        };
        this.getMovie = function (c) {
            return u(c) || h[c] || j[c]
        };
        this.createSound = function (b) {
            function a() {
                f = ea(f);
                c.sounds[e.id] = new Ea(e);
                c.soundIDs.push(e.id);
                return c.sounds[e.id]
            }

            var d, f = null, e = d = null;
            d = "soundManager.createSound(): " + q(!n ? "notReady" : "notOK");
            if (!n || !c.ok())return wa(d), !1;
            2 === arguments.length && (b = {id: arguments[0], url: arguments[1]});
            f = v(b);
            f.url = ia(f.url);
            e = f;
            e.id.toString().charAt(0).match(/^[0-9]$/) && c._wD("soundManager.createSound(): " + q("badID", e.id), 2);
            c._wD("soundManager.createSound(): " + e.id + " (" + e.url + ")", 1);
            if (s(e.id, !0))return c._wD("soundManager.createSound(): " + e.id + " exists", 1), c.sounds[e.id];
            if (ja(e))d = a(), c._wD("Loading sound " +
            e.id + " via HTML5"), d._setup_html5(e); else {
                if (8 < m) {
                    if (null === e.isMovieStar)e.isMovieStar = e.serverURL || (e.type ? e.type.match(Wa) : !1) || e.url.match(eb);
                    e.isMovieStar && c._wD("soundManager.createSound(): using MovieStar handling");
                    if (e.isMovieStar) {
                        if (e.usePeakData)o("noPeak"), e.usePeakData = !1;
                        1 < e.loops && o("noNSLoop")
                    }
                }
                e = fa(e, "soundManager.createSound(): ");
                d = a();
                if (8 === m)i._createSound(e.id, e.loops || 1, e.usePolicyFile); else if (i._createSound(e.id, e.url, e.usePeakData, e.useWaveformData, e.useEQData, e.isMovieStar,
                        e.isMovieStar ? e.bufferTime : !1, e.loops || 1, e.serverURL, e.duration || null, e.autoPlay, !0, e.autoLoad, e.usePolicyFile), !e.serverURL)d.connected = !0, e.onconnect && e.onconnect.apply(d);
                !e.serverURL && (e.autoLoad || e.autoPlay) && d.load(e)
            }
            !e.serverURL && e.autoPlay && d.play();
            return d
        };
        this.destroySound = function (b, a) {
            if (!s(b))return !1;
            var d = c.sounds[b], f;
            d._iO = {};
            d.stop();
            d.unload();
            for (f = 0; f < c.soundIDs.length; f++)if (c.soundIDs[f] === b) {
                c.soundIDs.splice(f, 1);
                break
            }
            a || d.destruct(!0);
            delete c.sounds[b];
            return !0
        };
        this.load =
            function (b, a) {
                return !s(b) ? !1 : c.sounds[b].load(a)
            };
        this.unload = function (b) {
            return !s(b) ? !1 : c.sounds[b].unload()
        };
        this.onposition = this.onPosition = function (b, a, d, f) {
            return !s(b) ? !1 : c.sounds[b].onposition(a, d, f)
        };
        this.clearOnPosition = function (b, a, d) {
            return !s(b) ? !1 : c.sounds[b].clearOnPosition(a, d)
        };
        this.start = this.play = function (b, a) {
            if (!n || !c.ok())return wa("soundManager.play(): " + q(!n ? "notReady" : "notOK")), !1;
            if (!s(b)) {
                a instanceof Object || (a = {url: a});
                return a && a.url ? (c._wD('soundManager.play(): attempting to create "' +
                b + '"', 1), a.id = b, c.createSound(a).play()) : !1
            }
            return c.sounds[b].play(a)
        };
        this.setPosition = function (b, a) {
            return !s(b) ? !1 : c.sounds[b].setPosition(a)
        };
        this.stop = function (b) {
            if (!s(b))return !1;
            c._wD("soundManager.stop(" + b + ")", 1);
            return c.sounds[b].stop()
        };
        this.stopAll = function () {
            var b;
            c._wD("soundManager.stopAll()", 1);
            for (b in c.sounds)c.sounds.hasOwnProperty(b) && c.sounds[b].stop()
        };
        this.pause = function (b) {
            return !s(b) ? !1 : c.sounds[b].pause()
        };
        this.pauseAll = function () {
            var b;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].pause()
        };
        this.resume = function (b) {
            return !s(b) ? !1 : c.sounds[b].resume()
        };
        this.resumeAll = function () {
            var b;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].resume()
        };
        this.togglePause = function (b) {
            return !s(b) ? !1 : c.sounds[b].togglePause()
        };
        this.setPan = function (b, a) {
            return !s(b) ? !1 : c.sounds[b].setPan(a)
        };
        this.setVolume = function (b, a) {
            return !s(b) ? !1 : c.sounds[b].setVolume(a)
        };
        this.mute = function (b) {
            var a = 0;
            "string" !== typeof b && (b = null);
            if (b) {
                if (!s(b))return !1;
                c._wD('soundManager.mute(): Muting "' + b + '"');
                return c.sounds[b].mute()
            }
            c._wD("soundManager.mute(): Muting all sounds");
            for (a = c.soundIDs.length; a--;)c.sounds[c.soundIDs[a]].mute();
            return c.muted = !0
        };
        this.muteAll = function () {
            c.mute()
        };
        this.unmute = function (b) {
            "string" !== typeof b && (b = null);
            if (b) {
                if (!s(b))return !1;
                c._wD('soundManager.unmute(): Unmuting "' + b + '"');
                return c.sounds[b].unmute()
            }
            c._wD("soundManager.unmute(): Unmuting all sounds");
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].unmute();
            c.muted = !1;
            return !0
        };
        this.unmuteAll = function () {
            c.unmute()
        };
        this.toggleMute = function (b) {
            return !s(b) ? !1 : c.sounds[b].toggleMute()
        };
        this.getMemoryUse = function () {
            var c = 0;
            i && 8 !== m && (c = parseInt(i._getMemoryUse(), 10));
            return c
        };
        this.disable = function (b) {
            var a;
            "undefined" === typeof b && (b = !1);
            if (y)return !1;
            y = !0;
            o("shutdown", 1);
            for (a = c.soundIDs.length; a--;)Ha(c.sounds[c.soundIDs[a]]);
            R(b);
            r.remove(j, "load", I);
            return !0
        };
        this.canPlayMIME = function (b) {
            var a;
            c.hasHTML5 && (a = U({type: b}));
            return !z || a ? a : b ? !!(8 < m && b.match(Wa) || b.match(c.mimePattern)) : null
        };
        this.canPlayURL = function (b) {
            var a;
            c.hasHTML5 && (a = U({url: b}));
            return !z || a ? a : b ? !!b.match(c.filePattern) :
                null
        };
        this.canPlayLink = function (b) {
            return "undefined" !== typeof b.type && b.type && c.canPlayMIME(b.type) ? !0 : c.canPlayURL(b.href)
        };
        this.getSoundById = function (b, a) {
            if (!b)throw Error("soundManager.getSoundById(): sID is null/undefined");
            var d = c.sounds[b];
            !d && !a && c._wD('"' + b + '" is an invalid sound ID.', 2);
            return d
        };
        this.onready = function (b, a) {
            if (b && b instanceof Function)return n && c._wD(q("queue", "onready")), a || (a = j), pa("onready", b, a), H(), !0;
            throw q("needFunction", "onready");
        };
        this.ontimeout = function (b, a) {
            if (b &&
                b instanceof Function)return n && c._wD(q("queue", "ontimeout")), a || (a = j), pa("ontimeout", b, a), H({type: "ontimeout"}), !0;
            throw q("needFunction", "ontimeout");
        };
        this._wD = this._writeDebug = function (b, a, d) {
            var f, e;
            if (!c.debugMode)return !1;
            "undefined" !== typeof d && d && (b = b + " | " + (new Date).getTime());
            if (Sa && c.useConsole) {
                d = $a[a];
                if ("undefined" !== typeof console[d])console[d](b); else console.log(b);
                if (c.consoleOnly)return !0
            }
            try {
                f = u("soundmanager-debug");
                if (!f)return !1;
                e = h.createElement("div");
                if (0 === ++Za % 2)e.className =
                    "sm2-alt";
                a = "undefined" === typeof a ? 0 : parseInt(a, 10);
                e.appendChild(h.createTextNode(b));
                if (a) {
                    if (2 <= a)e.style.fontWeight = "bold";
                    if (3 === a)e.style.color = "#ff3333"
                }
                f.insertBefore(e, f.firstChild)
            } catch (i) {
            }
            return !0
        };
        this._debug = function () {
            var b, a;
            o("currentObj", 1);
            for (b = 0, a = c.soundIDs.length; b < a; b++)c.sounds[c.soundIDs[b]]._debug()
        };
        this.reboot = function () {
            c._wD("soundManager.reboot()");
            c.soundIDs.length && c._wD("Destroying " + c.soundIDs.length + " SMSound objects...");
            var b, a;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].destruct();
            try {
                if (D)ua = i.innerHTML;
                S = i.parentNode.removeChild(i);
                c._wD("Flash movie removed.")
            } catch (d) {
                o("badRemove", 2)
            }
            ua = S = z = null;
            c.enabled = sa = n = ga = xa = P = Q = y = c.swfLoaded = !1;
            c.soundIDs = c.sounds = [];
            i = null;
            for (b in B)if (B.hasOwnProperty(b))for (a = B[b].length; a--;)B[b][a].fired = !1;
            c._wD("soundManager: Rebooting...");
            j.setTimeout(c.beginDelayedInit, 20)
        };
        this.getMoviePercent = function () {
            return i && "undefined" !== typeof i.PercentLoaded ? i.PercentLoaded() : null
        };
        this.beginDelayedInit = function () {
            Y = !0;
            J();
            setTimeout(function () {
                if (xa)return !1;
                ca();
                aa();
                return xa = !0
            }, 20);
            Z()
        };
        this.destruct = function () {
            c._wD("soundManager.destruct()");
            c.disable(!0)
        };
        Ea = function (b) {
            var a = this, d, f, e, h, g, Ya, j = !1, x = [], l = 0, n, r, p = null, t = null, u = null;
            this.sID = b.id;
            this.url = b.url;
            this._iO = this.instanceOptions = this.options = v(b);
            this.pan = this.options.pan;
            this.volume = this.options.volume;
            this.isHTML5 = !1;
            this._a = null;
            this.id3 = {};
            this._debug = function () {
                if (c.debugMode) {
                    var b = null, e = [], d, f;
                    for (b in a.options)null !== a.options[b] && (a.options[b]instanceof Function ? (d = a.options[b].toString(),
                        d = d.replace(/\s\s+/g, " "), f = d.indexOf("{"), e.push(" " + b + ": {" + d.substr(f + 1, Math.min(Math.max(d.indexOf("\n") - 1, 64), 64)).replace(/\n/g, "") + "... }")) : e.push(" " + b + ": " + a.options[b]));
                    c._wD("SMSound() merged options: {\n" + e.join(", \n") + "\n}")
                }
            };
            this._debug();
            this.load = function (b) {
                var d = null;
                if ("undefined" !== typeof b)a._iO = v(b, a.options), a.instanceOptions = a._iO; else if (b = a.options, a._iO = b, a.instanceOptions = a._iO, p && p !== a.url)o("manURL"), a._iO.url = a.url, a.url = null;
                if (!a._iO.url)a._iO.url = a.url;
                a._iO.url =
                    ia(a._iO.url);
                c._wD("SMSound.load(): " + a._iO.url, 1);
                if (a._iO.url === a.url && 0 !== a.readyState && 2 !== a.readyState)return o("onURL", 1), 3 === a.readyState && a._iO.onload && a._iO.onload.apply(a, [!!a.duration]), a;
                b = a._iO;
                p = a.url;
                a.loaded = !1;
                a.readyState = 1;
                a.playState = 0;
                if (ja(b))d = a._setup_html5(b), d._called_load ? c._wD(k + "ignoring request to load again: " + a.sID) : (c._wD(k + "load: " + a.sID), a._html5_canplay = !1, a._a.autobuffer = "auto", a._a.preload = "auto", d.load(), d._called_load = !0, b.autoPlay && a.play()); else try {
                    a.isHTML5 = !1, a._iO = fa(ea(b)), b = a._iO, 8 === m ? i._load(a.sID, b.url, b.stream, b.autoPlay, b.whileloading ? 1 : 0, b.loops || 1, b.usePolicyFile) : i._load(a.sID, b.url, !!b.stream, !!b.autoPlay, b.loops || 1, !!b.autoLoad, b.usePolicyFile)
                } catch (e) {
                    o("smError", 2), w("onload", !1), K({type: "SMSOUND_LOAD_JS_EXCEPTION", fatal: !0})
                }
                return a
            };
            this.unload = function () {
                0 !== a.readyState && (c._wD('SMSound.unload(): "' + a.sID + '"'), a.isHTML5 ? (h(), a._a && (a._a.pause(), ya(a._a))) : 8 === m ? i._unload(a.sID, "about:blank") : i._unload(a.sID), d());
                return a
            };
            this.destruct =
                function (b) {
                    c._wD('SMSound.destruct(): "' + a.sID + '"');
                    if (a.isHTML5) {
                        if (h(), a._a)a._a.pause(), ya(a._a), F || e(), a._a._t = null, a._a = null
                    } else a._iO.onfailure = null, i._destroySound(a.sID);
                    b || c.destroySound(a.sID, !0)
                };
            this.start = this.play = function (b, d) {
                var e, d = void 0 === d ? !0 : d;
                b || (b = {});
                a._iO = v(b, a._iO);
                a._iO = v(a._iO, a.options);
                a._iO.url = ia(a._iO.url);
                a.instanceOptions = a._iO;
                if (a._iO.serverURL && !a.connected)return a.getAutoPlay() || (c._wD("SMSound.play():  Netstream not connected yet - setting autoPlay"), a.setAutoPlay(!0)),
                    a;
                ja(a._iO) && (a._setup_html5(a._iO), g());
                if (1 === a.playState && !a.paused)if (e = a._iO.multiShot)c._wD('SMSound.play(): "' + a.sID + '" already playing (multi-shot)', 1); else return c._wD('SMSound.play(): "' + a.sID + '" already playing (one-shot)', 1), a;
                if (a.loaded)c._wD('SMSound.play(): "' + a.sID + '"'); else if (0 === a.readyState) {
                    c._wD('SMSound.play(): Attempting to load "' + a.sID + '"', 1);
                    if (!a.isHTML5)a._iO.autoPlay = !0;
                    a.load(a._iO)
                } else {
                    if (2 === a.readyState)return c._wD('SMSound.play(): Could not load "' + a.sID + '" - exiting',
                        2), a;
                    c._wD('SMSound.play(): "' + a.sID + '" is loading - attempting to play..', 1)
                }
                if (!a.isHTML5 && 9 === m && 0 < a.position && a.position === a.duration)c._wD('SMSound.play(): "' + a.sID + '": Sound at end, resetting to position:0'), b.position = 0;
                if (a.paused && a.position && 0 < a.position)c._wD('SMSound.play(): "' + a.sID + '" is resuming from paused state', 1), a.resume(); else {
                    a._iO = v(b, a._iO);
                    if (null !== a._iO.from && null !== a._iO.to && 0 === a.instanceCount && 0 === a.playState && !a._iO.serverURL) {
                        e = function () {
                            a._iO = v(b, a._iO);
                            a.play(a._iO)
                        };
                        if (a.isHTML5 && !a._html5_canplay)return c._wD('SMSound.play(): Beginning load of "' + a.sID + '" for from/to case'), a.load({_oncanplay: e}), !1;
                        if (!a.isHTML5 && !a.loaded && (!a.readyState || 2 !== a.readyState))return c._wD('SMSound.play(): Preloading "' + a.sID + '" for from/to case'), a.load({onload: e}), !1;
                        a._iO = r()
                    }
                    c._wD('SMSound.play(): "' + a.sID + '" is starting to play');
                    (!a.instanceCount || a._iO.multiShotEvents || !a.isHTML5 && 8 < m && !a.getAutoPlay()) && a.instanceCount++;
                    0 === a.playState && a._iO.onposition && Ya(a);
                    a.playState =
                        1;
                    a.paused = !1;
                    a.position = "undefined" !== typeof a._iO.position && !isNaN(a._iO.position) ? a._iO.position : 0;
                    if (!a.isHTML5)a._iO = fa(ea(a._iO));
                    a._iO.onplay && d && (a._iO.onplay.apply(a), j = !0);
                    a.setVolume(a._iO.volume, !0);
                    a.setPan(a._iO.pan, !0);
                    a.isHTML5 ? (g(), e = a._setup_html5(), a.setPosition(a._iO.position), e.play()) : i._start(a.sID, a._iO.loops || 1, 9 === m ? a._iO.position : a._iO.position / 1E3)
                }
                return a
            };
            this.stop = function (c) {
                var b = a._iO;
                if (1 === a.playState) {
                    a._onbufferchange(0);
                    a._resetOnPosition(0);
                    a.paused = !1;
                    if (!a.isHTML5)a.playState =
                        0;
                    n();
                    b.to && a.clearOnPosition(b.to);
                    if (a.isHTML5) {
                        if (a._a)c = a.position, a.setPosition(0), a.position = c, a._a.pause(), a.playState = 0, a._onTimer(), h()
                    } else i._stop(a.sID, c), b.serverURL && a.unload();
                    a.instanceCount = 0;
                    a._iO = {};
                    b.onstop && b.onstop.apply(a)
                }
                return a
            };
            this.setAutoPlay = function (b) {
                c._wD("sound " + a.sID + " turned autoplay " + (b ? "on" : "off"));
                a._iO.autoPlay = b;
                a.isHTML5 || (i._setAutoPlay(a.sID, b), b && !a.instanceCount && 1 === a.readyState && (a.instanceCount++, c._wD("sound " + a.sID + " incremented instance count to " +
                a.instanceCount)))
            };
            this.getAutoPlay = function () {
                return a._iO.autoPlay
            };
            this.setPosition = function (b) {
                void 0 === b && (b = 0);
                var d = a.isHTML5 ? Math.max(b, 0) : Math.min(a.duration || a._iO.duration, Math.max(b, 0));
                a.position = d;
                b = a.position / 1E3;
                a._resetOnPosition(a.position);
                a._iO.position = d;
                if (a.isHTML5) {
                    if (a._a)if (a._html5_canplay) {
                        if (a._a.currentTime !== b) {
                            c._wD("setPosition(" + b + "): setting position");
                            try {
                                a._a.currentTime = b, (0 === a.playState || a.paused) && a._a.pause()
                            } catch (e) {
                                c._wD("setPosition(" + b + "): setting position failed: " +
                                e.message, 2)
                            }
                        }
                    } else c._wD("setPosition(" + b + "): delaying, sound not ready")
                } else b = 9 === m ? a.position : b, a.readyState && 2 !== a.readyState && i._setPosition(a.sID, b, a.paused || !a.playState);
                a.isHTML5 && a.paused && a._onTimer(!0);
                return a
            };
            this.pause = function (b) {
                if (a.paused || 0 === a.playState && 1 !== a.readyState)return a;
                c._wD("SMSound.pause()");
                a.paused = !0;
                a.isHTML5 ? (a._setup_html5().pause(), h()) : (b || void 0 === b) && i._pause(a.sID);
                a._iO.onpause && a._iO.onpause.apply(a);
                return a
            };
            this.resume = function () {
                var b = a._iO;
                if (!a.paused)return a;
                c._wD("SMSound.resume()");
                a.paused = !1;
                a.playState = 1;
                a.isHTML5 ? (a._setup_html5().play(), g()) : (b.isMovieStar && !b.serverURL && a.setPosition(a.position), i._pause(a.sID));
                j && b.onplay ? (b.onplay.apply(a), j = !0) : b.onresume && b.onresume.apply(a);
                return a
            };
            this.togglePause = function () {
                c._wD("SMSound.togglePause()");
                if (0 === a.playState)return a.play({position: 9 === m && !a.isHTML5 ? a.position : a.position / 1E3}), a;
                a.paused ? a.resume() : a.pause();
                return a
            };
            this.setPan = function (b, c) {
                "undefined" === typeof b && (b = 0);
                "undefined" === typeof c && (c = !1);
                a.isHTML5 || i._setPan(a.sID, b);
                a._iO.pan = b;
                if (!c)a.pan = b, a.options.pan = b;
                return a
            };
            this.setVolume = function (b, d) {
                "undefined" === typeof b && (b = 100);
                "undefined" === typeof d && (d = !1);
                if (a.isHTML5) {
                    if (a._a)a._a.volume = Math.max(0, Math.min(1, b / 100))
                } else i._setVolume(a.sID, c.muted && !a.muted || a.muted ? 0 : b);
                a._iO.volume = b;
                if (!d)a.volume = b, a.options.volume = b;
                return a
            };
            this.mute = function () {
                a.muted = !0;
                if (a.isHTML5) {
                    if (a._a)a._a.muted = !0
                } else i._setVolume(a.sID, 0);
                return a
            };
            this.unmute = function () {
                a.muted = !1;
                var b = "undefined" !== typeof a._iO.volume;
                if (a.isHTML5) {
                    if (a._a)a._a.muted = !1
                } else i._setVolume(a.sID, b ? a._iO.volume : a.options.volume);
                return a
            };
            this.toggleMute = function () {
                return a.muted ? a.unmute() : a.mute()
            };
            this.onposition = this.onPosition = function (b, c, d) {
                x.push({position: b, method: c, scope: "undefined" !== typeof d ? d : a, fired: !1});
                return a
            };
            this.clearOnPosition = function (a, b) {
                var c, a = parseInt(a, 10);
                if (isNaN(a))return !1;
                for (c = 0; c < x.length; c++)if (a === x[c].position && (!b || b === x[c].method))x[c].fired && l--,
                    x.splice(c, 1)
            };
            this._processOnPosition = function () {
                var b, c;
                b = x.length;
                if (!b || !a.playState || l >= b)return !1;
                for (; b--;)if (c = x[b], !c.fired && a.position >= c.position)c.fired = !0, l++, c.method.apply(c.scope, [c.position]);
                return !0
            };
            this._resetOnPosition = function (a) {
                var b, c;
                b = x.length;
                if (!b)return !1;
                for (; b--;)if (c = x[b], c.fired && a <= c.position)c.fired = !1, l--;
                return !0
            };
            r = function () {
                var b = a._iO, d = b.from, e = b.to, f, g;
                g = function () {
                    c._wD(a.sID + ': "to" time of ' + e + " reached.");
                    a.clearOnPosition(e, g);
                    a.stop()
                };
                f = function () {
                    c._wD(a.sID +
                    ': playing "from" ' + d);
                    if (null !== e && !isNaN(e))a.onPosition(e, g)
                };
                if (null !== d && !isNaN(d))b.position = d, b.multiShot = !1, f();
                return b
            };
            Ya = function () {
                var b = a._iO.onposition;
                if (b)for (var c in b)if (b.hasOwnProperty(c))a.onPosition(parseInt(c, 10), b[c])
            };
            n = function () {
                var b = a._iO.onposition;
                if (b)for (var c in b)b.hasOwnProperty(c) && a.clearOnPosition(parseInt(c, 10))
            };
            g = function () {
                a.isHTML5 && Ka(a)
            };
            h = function () {
                a.isHTML5 && La(a)
            };
            d = function () {
                x = [];
                l = 0;
                j = !1;
                a._hasTimer = null;
                a._a = null;
                a._html5_canplay = !1;
                a.bytesLoaded =
                    null;
                a.bytesTotal = null;
                a.duration = a._iO && a._iO.duration ? a._iO.duration : null;
                a.durationEstimate = null;
                a.eqData = [];
                a.eqData.left = [];
                a.eqData.right = [];
                a.failures = 0;
                a.isBuffering = !1;
                a.instanceOptions = {};
                a.instanceCount = 0;
                a.loaded = !1;
                a.metadata = {};
                a.readyState = 0;
                a.muted = !1;
                a.paused = !1;
                a.peakData = {left: 0, right: 0};
                a.waveformData = {left: [], right: []};
                a.playState = 0;
                a.position = null
            };
            d();
            this._onTimer = function (b) {
                var c, d = !1, e = {};
                if (a._hasTimer || b) {
                    if (a._a && (b || (0 < a.playState || 1 === a.readyState) && !a.paused)) {
                        c = a._get_html5_duration();
                        if (c !== t)t = c, a.duration = c, d = !0;
                        a.durationEstimate = a.duration;
                        c = 1E3 * a._a.currentTime || 0;
                        c !== u && (u = c, d = !0);
                        (d || b) && a._whileplaying(c, e, e, e, e);
                        return d
                    }
                    return !1
                }
            };
            this._get_html5_duration = function () {
                var b = a._iO, c = a._a ? 1E3 * a._a.duration : b ? b.duration : void 0;
                return c && !isNaN(c) && Infinity !== c ? c : b ? b.duration : null
            };
            this._setup_html5 = function (b) {
                var b = v(a._iO, b), e = decodeURI, g = F ? c._global_a : a._a, h = e(b.url), i = g && g._t ? g._t.instanceOptions : null;
                if (g) {
                    if (g._t && (!F && h === e(p) || F && i.url === b.url && (!p || p === i.url)))return g;
                    c._wD("setting new URL on existing object: " + h + (p ? ", old URL: " + p : ""));
                    F && g._t && g._t.playState && b.url !== i.url && g._t.stop();
                    d();
                    g.src = b.url;
                    p = a.url = b.url;
                    g._called_load = !1
                } else {
                    c._wD("creating HTML5 Audio() element with URL: " + h);
                    g = new Audio(b.url);
                    g._called_load = !1;
                    if (bb)g._called_load = !0;
                    if (F)c._global_a = g
                }
                a.isHTML5 = !0;
                a._a = g;
                g._t = a;
                f();
                g.loop = 1 < b.loops ? "loop" : "";
                b.autoLoad || b.autoPlay ? a.load() : (g.autobuffer = !1, g.preload = "none");
                g.loop = 1 < b.loops ? "loop" : "";
                return g
            };
            f = function () {
                if (a._a._added_events)return !1;
                var b;
                c._wD(k + "adding event listeners: " + a.sID);
                a._a._added_events = !0;
                for (b in A)A.hasOwnProperty(b) && a._a && a._a.addEventListener(b, A[b], !1);
                return !0
            };
            e = function () {
                var b;
                c._wD(k + "removing event listeners: " + a.sID);
                a._a._added_events = !1;
                for (b in A)A.hasOwnProperty(b) && a._a && a._a.removeEventListener(b, A[b], !1)
            };
            this._onload = function (b) {
                var d, b = !!b;
                c._wD(d + '"' + a.sID + '"' + (b ? " loaded." : " failed to load? - " + a.url), b ? 1 : 2);
                d = "SMSound._onload(): ";
                !b && !a.isHTML5 && (!0 === c.sandbox.noRemote && c._wD(d + q("noNet"),
                    1), !0 === c.sandbox.noLocal && c._wD(d + q("noLocal"), 1));
                a.loaded = b;
                a.readyState = b ? 3 : 2;
                a._onbufferchange(0);
                a._iO.onload && a._iO.onload.apply(a, [b]);
                return !0
            };
            this._onbufferchange = function (b) {
                if (0 === a.playState || b && a.isBuffering || !b && !a.isBuffering)return !1;
                a.isBuffering = 1 === b;
                a._iO.onbufferchange && (c._wD("SMSound._onbufferchange(): " + b), a._iO.onbufferchange.apply(a));
                return !0
            };
            this._onsuspend = function () {
                a._iO.onsuspend && (c._wD("SMSound._onsuspend()"), a._iO.onsuspend.apply(a));
                return !0
            };
            this._onfailure =
                function (b, d, e) {
                    a.failures++;
                    c._wD('SMSound._onfailure(): "' + a.sID + '" count ' + a.failures);
                    if (a._iO.onfailure && 1 === a.failures)a._iO.onfailure(a, b, d, e); else c._wD("SMSound._onfailure(): ignoring")
                };
            this._onfinish = function () {
                var b = a._iO.onfinish;
                a._onbufferchange(0);
                a._resetOnPosition(0);
                if (a.instanceCount) {
                    a.instanceCount--;
                    if (!a.instanceCount)n(), a.playState = 0, a.paused = !1, a.instanceCount = 0, a.instanceOptions = {}, a._iO = {}, h();
                    if ((!a.instanceCount || a._iO.multiShotEvents) && b)c._wD('SMSound._onfinish(): "' +
                    a.sID + '"'), b.apply(a)
                }
            };
            this._whileloading = function (b, c, d, e) {
                var f = a._iO;
                a.bytesLoaded = b;
                a.bytesTotal = c;
                a.duration = Math.floor(d);
                a.bufferLength = e;
                if (f.isMovieStar)a.durationEstimate = a.duration; else if (a.durationEstimate = f.duration ? a.duration > f.duration ? a.duration : f.duration : parseInt(a.bytesTotal / a.bytesLoaded * a.duration, 10), void 0 === a.durationEstimate)a.durationEstimate = a.duration;
                3 !== a.readyState && f.whileloading && f.whileloading.apply(a)
            };
            this._whileplaying = function (b, c, d, e, f) {
                var g = a._iO;
                if (isNaN(b) ||
                    null === b)return !1;
                a.position = b;
                a._processOnPosition();
                if (!a.isHTML5 && 8 < m) {
                    if (g.usePeakData && "undefined" !== typeof c && c)a.peakData = {
                        left: c.leftPeak,
                        right: c.rightPeak
                    };
                    if (g.useWaveformData && "undefined" !== typeof d && d)a.waveformData = {
                        left: d.split(","),
                        right: e.split(",")
                    };
                    if (g.useEQData && "undefined" !== typeof f && f && f.leftEQ && (b = f.leftEQ.split(","), a.eqData = b, a.eqData.left = b, "undefined" !== typeof f.rightEQ && f.rightEQ))a.eqData.right = f.rightEQ.split(",")
                }
                1 === a.playState && (!a.isHTML5 && 8 === m && !a.position && a.isBuffering &&
                a._onbufferchange(0), g.whileplaying && g.whileplaying.apply(a));
                return !0
            };
            this._onmetadata = function (b, d) {
                c._wD('SMSound._onmetadata(): "' + this.sID + '" metadata received.');
                var e = {}, f, g;
                for (f = 0, g = b.length; f < g; f++)e[b[f]] = d[f];
                a.metadata = e;
                a._iO.onmetadata && a._iO.onmetadata.apply(a)
            };
            this._onid3 = function (b, d) {
                c._wD('SMSound._onid3(): "' + this.sID + '" ID3 data received.');
                var e = [], f, g;
                for (f = 0, g = b.length; f < g; f++)e[b[f]] = d[f];
                a.id3 = v(a.id3, e);
                a._iO.onid3 && a._iO.onid3.apply(a)
            };
            this._onconnect = function (b) {
                b =
                    1 === b;
                c._wD('SMSound._onconnect(): "' + a.sID + '"' + (b ? " connected." : " failed to connect? - " + a.url), b ? 1 : 2);
                if (a.connected = b)a.failures = 0, s(a.sID) && (a.getAutoPlay() ? a.play(void 0, a.getAutoPlay()) : a._iO.autoLoad && a.load()), a._iO.onconnect && a._iO.onconnect.apply(a, [b])
            };
            this._ondataerror = function (b) {
                0 < a.playState && (c._wD("SMSound._ondataerror(): " + b), a._iO.ondataerror && a._iO.ondataerror.apply(a))
            }
        };
        ba = function () {
            return h.body || h._docElement || h.getElementsByTagName("div")[0]
        };
        u = function (b) {
            return h.getElementById(b)
        };
        v = function (b, a) {
            var d = {}, f, e;
            for (f in b)b.hasOwnProperty(f) && (d[f] = b[f]);
            f = "undefined" === typeof a ? c.defaultOptions : a;
            for (e in f)f.hasOwnProperty(e) && "undefined" === typeof d[e] && (d[e] = f[e]);
            return d
        };
        r = function () {
            function b(a) {
                var a = Pa.call(a), b = a.length;
                c ? (a[1] = "on" + a[1], 3 < b && a.pop()) : 3 === b && a.push(!1);
                return a
            }

            function a(a, b) {
                var g = a.shift(), h = [f[b]];
                if (c)g[h](a[0], a[1]); else g[h].apply(g, a)
            }

            var c = j.attachEvent, f = {
                add: c ? "attachEvent" : "addEventListener",
                remove: c ? "detachEvent" : "removeEventListener"
            };
            return {
                add: function () {
                    a(b(arguments), "add")
                }, remove: function () {
                    a(b(arguments), "remove")
                }
            }
        }();
        A = {
            abort: l(function () {
                c._wD(k + "abort: " + this._t.sID)
            }), canplay: l(function () {
                var b = this._t;
                if (b._html5_canplay)return !0;
                b._html5_canplay = !0;
                c._wD(k + "canplay: " + b.sID + ", " + b.url);
                b._onbufferchange(0);
                var a = !isNaN(b.position) ? b.position / 1E3 : null;
                if (b.position && this.currentTime !== a) {
                    c._wD(k + "canplay: setting position to " + a);
                    try {
                        this.currentTime = a
                    } catch (d) {
                        c._wD(k + "setting position failed: " + d.message, 2)
                    }
                }
                b._iO._oncanplay &&
                b._iO._oncanplay()
            }), load: l(function () {
                var b = this._t;
                b.loaded || (b._onbufferchange(0), b._whileloading(b.bytesTotal, b.bytesTotal, b._get_html5_duration()), b._onload(!0))
            }), emptied: l(function () {
                c._wD(k + "emptied: " + this._t.sID)
            }), ended: l(function () {
                var b = this._t;
                c._wD(k + "ended: " + b.sID);
                b._onfinish()
            }), error: l(function () {
                c._wD(k + "error: " + this.error.code);
                this._t._onload(!1)
            }), loadeddata: l(function () {
                var b = this._t, a = b.bytesTotal || 1;
                c._wD(k + "loadeddata: " + this._t.sID);
                if (!b._loaded && !V)b.duration = b._get_html5_duration(),
                    b._whileloading(a, a, b._get_html5_duration()), b._onload(!0)
            }), loadedmetadata: l(function () {
                c._wD(k + "loadedmetadata: " + this._t.sID)
            }), loadstart: l(function () {
                c._wD(k + "loadstart: " + this._t.sID);
                this._t._onbufferchange(1)
            }), play: l(function () {
                c._wD(k + "play: " + this._t.sID + ", " + this._t.url);
                this._t._onbufferchange(0)
            }), playing: l(function () {
                c._wD(k + "playing: " + this._t.sID);
                this._t._onbufferchange(0)
            }), progress: l(function (b) {
                var a = this._t;
                if (a.loaded)return !1;
                var d, f, e;
                e = 0;
                var h = "progress" === b.type;
                f = b.target.buffered;
                var g = b.loaded || 0, i = b.total || 1;
                if (f && f.length) {
                    for (d = f.length; d--;)e = f.end(d) - f.start(d);
                    g = e / b.target.duration;
                    if (h && 1 < f.length) {
                        e = [];
                        f = f.length;
                        for (d = 0; d < f; d++)e.push(b.target.buffered.start(d) + "-" + b.target.buffered.end(d));
                        c._wD(k + "progress: timeRanges: " + e.join(", "))
                    }
                    h && !isNaN(g) && c._wD(k + "progress: " + a.sID + ": " + Math.floor(100 * g) + "% loaded")
                }
                isNaN(g) || (a._onbufferchange(0), a._whileloading(g, i, a._get_html5_duration()), g && i && g === i && A.load.call(this, b))
            }), ratechange: l(function () {
                c._wD(k + "ratechange: " +
                this._t.sID)
            }), suspend: l(function (b) {
                var a = this._t;
                c._wD(k + "suspend: " + a.sID);
                A.progress.call(this, b);
                a._onsuspend()
            }), stalled: l(function () {
                c._wD(k + "stalled: " + this._t.sID)
            }), timeupdate: l(function () {
                this._t._onTimer()
            }), waiting: l(function () {
                var b = this._t;
                c._wD(k + "waiting: " + b.sID);
                b._onbufferchange(1)
            })
        };
        ja = function (b) {
            return !b.serverURL && (b.type ? U({type: b.type}) : U({url: b.url}) || c.html5Only)
        };
        ya = function (b) {
            if (b)b.src = ab ? "" : "about:blank"
        };
        U = function (b) {
            function a(a) {
                return c.preferFlash && t && !c.ignoreFlash &&
                    "undefined" !== typeof c.flash[a] && c.flash[a]
            }

            if (!c.useHTML5Audio || !c.hasHTML5)return !1;
            var d = b.url || null, b = b.type || null, f = c.audioFormats, e;
            if (b && "undefined" !== c.html5[b])return c.html5[b] && !a(b);
            if (!C) {
                C = [];
                for (e in f)f.hasOwnProperty(e) && (C.push(e), f[e].related && (C = C.concat(f[e].related)));
                C = RegExp("\\.(" + C.join("|") + ")(\\?.*)?$", "i")
            }
            e = d ? d.toLowerCase().match(C) : null;
            if (!e || !e.length)if (b)d = b.indexOf(";"), e = (-1 !== d ? b.substr(0, d) : b).substr(6); else return !1; else e = e[1];
            if (e && "undefined" !== typeof c.html5[e])return c.html5[e] && !a(e);
            b = "audio/" + e;
            d = c.html5.canPlayType({type: b});
            return (c.html5[e] = d) && c.html5[b] && !a(b)
        };
        Oa = function () {
            function b(b) {
                var d, e, f = !1;
                if (!a || "function" !== typeof a.canPlayType)return !1;
                if (b instanceof Array) {
                    for (d = 0, e = b.length; d < e && !f; d++)if (c.html5[b[d]] || a.canPlayType(b[d]).match(c.html5Test))f = !0, c.html5[b[d]] = !0, c.flash[b[d]] = !(!c.preferFlash || !t || !b[d].match(Ua));
                    return f
                }
                b = a && "function" === typeof a.canPlayType ? a.canPlayType(b) : !1;
                return !(!b || !b.match(c.html5Test))
            }

            if (!c.useHTML5Audio || "undefined" === typeof Audio)return !1;
            var a = "undefined" !== typeof Audio ? db ? new Audio(null) : new Audio : null, d, f = {}, e, h;
            e = c.audioFormats;
            for (d in e)if (e.hasOwnProperty(d) && (f[d] = b(e[d].type), f["audio/" + d] = f[d], c.flash[d] = c.preferFlash && !c.ignoreFlash && d.match(Ua) ? !0 : !1, e[d] && e[d].related))for (h = e[d].related.length; h--;)f["audio/" + e[d].related[h]] = f[d], c.html5[e[d].related[h]] = f[d], c.flash[e[d].related[h]] = f[d];
            f.canPlayType = a ? b : null;
            c.html5 = v(c.html5, f);
            return !0
        };
        $ = {
            notReady: "Not loaded yet - wait for soundManager.onload()/onready()",
            notOK: "Audio support is not available.",
            domError: "soundManager::createMovie(): appendChild/innerHTML call failed. DOM not ready or other error.",
            spcWmode: "soundManager::createMovie(): Removing wmode, preventing known SWF loading issue(s)",
            swf404: "soundManager: Verify that %s is a valid path.",
            tryDebug: "Try soundManager.debugFlash = true for more security details (output goes to SWF.)",
            checkSWF: "See SWF output for more debug info.",
            localFail: "soundManager: Non-HTTP page (" + h.location.protocol + " URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",
            waitFocus: "soundManager: Special case: Waiting for focus-related event..",
            waitImpatient: "soundManager: Getting impatient, still waiting for Flash%s...",
            waitForever: "soundManager: Waiting indefinitely for Flash (will recover if unblocked)...",
            needFunction: "soundManager: Function object expected for %s",
            badID: 'Warning: Sound ID "%s" should be a string, starting with a non-numeric character',
            currentObj: "--- soundManager._debug(): Current sound objects ---",
            waitEI: "soundManager::initMovie(): Waiting for ExternalInterface call from Flash..",
            waitOnload: "soundManager: Waiting for window.onload()",
            docLoaded: "soundManager: Document already loaded",
            onload: "soundManager::initComplete(): calling soundManager.onload()",
            onloadOK: "soundManager.onload() complete",
            init: "soundManager::init()",
            didInit: "soundManager::init(): Already called?",
            flashJS: "soundManager: Attempting to call Flash from JS..",
            secNote: "Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",
            badRemove: "Warning: Failed to remove flash movie.",
            noPeak: "Warning: peakData features unsupported for movieStar formats",
            shutdown: "soundManager.disable(): Shutting down",
            queue: "soundManager: Queueing %s handler",
            smFail: "soundManager: Failed to initialise.",
            smError: "SMSound.load(): Exception: JS-Flash communication failed, or JS error.",
            fbTimeout: "No flash response, applying .swf_timedout CSS..",
            fbLoaded: "Flash loaded",
            fbHandler: "soundManager::flashBlockHandler()",
            manURL: "SMSound.load(): Using manually-assigned URL",
            onURL: "soundManager.load(): current URL already assigned.",
            badFV: 'soundManager.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',
            as2loop: "Note: Setting stream:false so looping can work (flash 8 limitation)",
            noNSLoop: "Note: Looping not implemented for MovieStar formats",
            needfl9: "Note: Switching to flash 9, required for MP4 formats.",
            mfTimeout: "Setting flashLoadTimeout = 0 (infinite) for off-screen, mobile flash case",
            mfOn: "mobileFlash::enabling on-screen flash repositioning",
            policy: "Enabling usePolicyFile for data access"
        };
        q = function () {
            var b = Pa.call(arguments), a = b.shift(), a = $ && $[a] ? $[a] : "", c, f;
            if (a && b && b.length)for (c = 0, f = b.length; c < f; c++)a = a.replace("%s", b[c]);
            return a
        };
        ea = function (b) {
            if (8 === m && 1 < b.loops && b.stream)o("as2loop"), b.stream = !1;
            return b
        };
        fa = function (b, a) {
            if (b && !b.usePolicyFile && (b.onid3 || b.usePeakData || b.useWaveformData || b.useEQData))c._wD((a || "") + q("policy")), b.usePolicyFile = !0;
            return b
        };
        wa = function (b) {
            "undefined" !== typeof console && "undefined" !== typeof console.warn ? console.warn(b) : c._wD(b)
        };
        na = function () {
            return !1
        };
        Ha = function (b) {
            for (var a in b)b.hasOwnProperty(a) && "function" === typeof b[a] && (b[a] = na)
        };
        da = function (b) {
            "undefined" === typeof b && (b = !1);
            if (y || b)o("smFail", 2), c.disable(b)
        };
        Ia = function (b) {
            var a = null;
            if (b)if (b.match(/\.swf(\?.*)?$/i)) {
                if (a = b.substr(b.toLowerCase().lastIndexOf(".swf?") + 4))return b
            } else b.lastIndexOf("/") !== b.length - 1 && (b += "/");
            b = (b && -1 !== b.lastIndexOf("/") ? b.substr(0, b.lastIndexOf("/") + 1) : "./") + c.movieURL;
            c.noSWFCache && (b += "?ts=" + (new Date).getTime());
            return b
        };
        qa = function () {
            m = parseInt(c.flashVersion,
                10);
            if (8 !== m && 9 !== m)c._wD(q("badFV", m, 8)), c.flashVersion = m = 8;
            var b = c.debugMode || c.debugFlash ? "_debug.swf" : ".swf";
            if (c.useHTML5Audio && !c.html5Only && c.audioFormats.mp4.required && 9 > m)c._wD(q("needfl9")), c.flashVersion = m = 9;
            c.version = c.versionNumber + (c.html5Only ? " (HTML5-only mode)" : 9 === m ? " (AS3/Flash 9)" : " (AS2/Flash 8)");
            8 < m ? (c.defaultOptions = v(c.defaultOptions, c.flash9Options), c.features.buffering = !0, c.defaultOptions = v(c.defaultOptions, c.movieStarOptions), c.filePatterns.flash9 = RegExp("\\.(mp3|" + Xa.join("|") +
            ")(\\?.*)?$", "i"), c.features.movieStar = !0) : c.features.movieStar = !1;
            c.filePattern = c.filePatterns[8 !== m ? "flash9" : "flash8"];
            c.movieURL = (8 === m ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", b);
            c.features.peakData = c.features.waveformData = c.features.eqData = 8 < m
        };
        Ga = function (b, a) {
            if (!i)return !1;
            i._setPolling(b, a)
        };
        ta = function () {
            if (c.debugURLParam.test(O))c.debugMode = !0;
            if (u(c.debugID))return !1;
            var b, a, d, f;
            if (c.debugMode && !u(c.debugID) && (!Sa || !c.useConsole || !c.consoleOnly)) {
                b = h.createElement("div");
                b.id = c.debugID + "-toggle";
                a = {
                    position: "fixed",
                    bottom: "0px",
                    right: "0px",
                    width: "1.2em",
                    height: "1.2em",
                    lineHeight: "1.2em",
                    margin: "2px",
                    textAlign: "center",
                    border: "1px solid #999",
                    cursor: "pointer",
                    background: "#fff",
                    color: "#333",
                    zIndex: 10001
                };
                b.appendChild(h.createTextNode("-"));
                b.onclick = Ja;
                b.title = "Toggle SM2 debug console";
                if (p.match(/msie 6/i))b.style.position = "absolute", b.style.cursor = "hand";
                for (f in a)a.hasOwnProperty(f) && (b.style[f] = a[f]);
                a = h.createElement("div");
                a.id = c.debugID;
                a.style.display = c.debugMode ?
                    "block" : "none";
                if (c.debugMode && !u(b.id)) {
                    try {
                        d = ba(), d.appendChild(b)
                    } catch (e) {
                        throw Error(q("domError") + " \n" + e.toString());
                    }
                    d.appendChild(a)
                }
            }
        };
        s = this.getSoundById;
        o = function (b, a) {
            return b ? c._wD(q(b), a) : ""
        };
        if (O.indexOf("sm2-debug=alert") + 1 && c.debugMode)c._wD = function (b) {
            G.alert(b)
        };
        Ja = function () {
            var b = u(c.debugID), a = u(c.debugID + "-toggle");
            if (!b)return !1;
            oa ? (a.innerHTML = "+", b.style.display = "none") : (a.innerHTML = "-", b.style.display = "block");
            oa = !oa
        };
        w = function (b, a, c) {
            if ("undefined" !== typeof sm2Debugger)try {
                sm2Debugger.handleEvent(b,
                    a, c)
            } catch (f) {
            }
            return !0
        };
        L = function () {
            var b = [];
            c.debugMode && b.push("sm2_debug");
            c.debugFlash && b.push("flash_debug");
            c.useHighPerformance && b.push("high_performance");
            return b.join(" ")
        };
        va = function () {
            var b = q("fbHandler"), a = c.getMoviePercent(), d = {type: "FLASHBLOCK"};
            if (c.html5Only)return !1;
            if (c.ok()) {
                if (c.didFlashBlock && c._wD(b + ": Unblocked"), c.oMC)c.oMC.className = [L(), "movieContainer", "swf_loaded" + (c.didFlashBlock ? " swf_unblocked" : "")].join(" ")
            } else {
                if (z)c.oMC.className = L() + " movieContainer " + (null ===
                a ? "swf_timedout" : "swf_error"), c._wD(b + ": " + q("fbTimeout") + (a ? " (" + q("fbLoaded") + ")" : ""));
                c.didFlashBlock = !0;
                H({type: "ontimeout", ignoreInit: !0, error: d});
                K(d)
            }
        };
        pa = function (b, a, c) {
            "undefined" === typeof B[b] && (B[b] = []);
            B[b].push({method: a, scope: c || null, fired: !1})
        };
        H = function (b) {
            b || (b = {type: "onready"});
            if (!n && b && !b.ignoreInit || "ontimeout" === b.type && c.ok())return !1;
            var a = {success: b && b.ignoreInit ? c.ok() : !y}, d = b && b.type ? B[b.type] || [] : [], f = [], e, h = [a], g = z && c.useFlashBlock && !c.ok();
            if (b.error)h[0].error = b.error;
            for (a = 0, e = d.length; a < e; a++)!0 !== d[a].fired && f.push(d[a]);
            if (f.length) {
                c._wD("soundManager: Firing " + f.length + " " + b.type + "() item" + (1 === f.length ? "" : "s"));
                for (a = 0, e = f.length; a < e; a++)if (f[a].scope ? f[a].method.apply(f[a].scope, h) : f[a].method.apply(this, h), !g)f[a].fired = !0
            }
            return !0
        };
        I = function () {
            j.setTimeout(function () {
                c.useFlashBlock && va();
                H();
                c.onload instanceof Function && (o("onload", 1), c.onload.apply(j), o("onloadOK", 1));
                c.waitForWindowLoad && r.add(j, "load", I)
            }, 1)
        };
        ka = function () {
            if (void 0 !== t)return t;
            var b = !1, a = navigator, c = a.plugins, f, e = j.ActiveXObject;
            if (c && c.length)(a = a.mimeTypes) && a["application/x-shockwave-flash"] && a["application/x-shockwave-flash"].enabledPlugin && a["application/x-shockwave-flash"].enabledPlugin.description && (b = !0); else if ("undefined" !== typeof e) {
                try {
                    f = new e("ShockwaveFlash.ShockwaveFlash")
                } catch (h) {
                }
                b = !!f
            }
            return t = b
        };
        Na = function () {
            var b, a;
            if (Aa && p.match(/os (1|2|3_0|3_1)/i)) {
                c.hasHTML5 = !1;
                c.html5Only = !0;
                if (c.oMC)c.oMC.style.display = "none";
                return !1
            }
            if (c.useHTML5Audio) {
                if (!c.html5 || !c.html5.canPlayType)return c._wD("SoundManager: No HTML5 Audio() support detected."), c.hasHTML5 = !1, !0;
                c.hasHTML5 = !0;
                if (Ca && (c._wD("soundManager::Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id=32159 - " + (!t ? " would use flash fallback for MP3/MP4, but none detected." : "will use flash fallback for MP3/MP4, if available"), 1), ka()))return !0
            } else return !0;
            for (a in c.audioFormats)if (c.audioFormats.hasOwnProperty(a) && (c.audioFormats[a].required && !c.html5.canPlayType(c.audioFormats[a].type) ||
                c.flash[a] || c.flash[c.audioFormats[a].type]))b = !0;
            c.ignoreFlash && (b = !1);
            c.html5Only = c.hasHTML5 && c.useHTML5Audio && !b;
            return !c.html5Only
        };
        ia = function (b) {
            var a, d, f = 0;
            if (b instanceof Array) {
                for (a = 0, d = b.length; a < d; a++)if (b[a]instanceof Object) {
                    if (c.canPlayMIME(b[a].type)) {
                        f = a;
                        break
                    }
                } else if (c.canPlayURL(b[a])) {
                    f = a;
                    break
                }
                if (b[f].url)b[f] = b[f].url;
                return b[f]
            }
            return b
        };
        Ka = function (b) {
            if (!b._hasTimer)b._hasTimer = !0, !Ba && c.html5PollingInterval && (null === T && 0 === ha && (T = G.setInterval(Ma, c.html5PollingInterval)),
                ha++)
        };
        La = function (b) {
            if (b._hasTimer)b._hasTimer = !1, !Ba && c.html5PollingInterval && ha--
        };
        Ma = function () {
            var b;
            if (null !== T && !ha)return G.clearInterval(T), T = null, !1;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].isHTML5 && c.sounds[c.soundIDs[b]]._hasTimer && c.sounds[c.soundIDs[b]]._onTimer()
        };
        K = function (b) {
            b = "undefined" !== typeof b ? b : {};
            c.onerror instanceof Function && c.onerror.apply(j, [{type: "undefined" !== typeof b.type ? b.type : null}]);
            "undefined" !== typeof b.fatal && b.fatal && c.disable()
        };
        Qa = function () {
            if (!Ca || !ka())return !1;
            var b = c.audioFormats, a, d;
            for (d in b)if (b.hasOwnProperty(d) && ("mp3" === d || "mp4" === d))if (c._wD("soundManager: Using flash fallback for " + d + " format"), c.html5[d] = !1, b[d] && b[d].related)for (a = b[d].related.length; a--;)c.html5[b[d].related[a]] = !1
        };
        this._setSandboxType = function (b) {
            var a = c.sandbox;
            a.type = b;
            a.description = a.types["undefined" !== typeof a.types[b] ? b : "unknown"];
            c._wD("Flash security sandbox type: " + a.type);
            if ("localWithFile" === a.type)a.noRemote = !0, a.noLocal = !1, o("secNote", 2); else if ("localWithNetwork" ===
                a.type)a.noRemote = !1, a.noLocal = !0; else if ("localTrusted" === a.type)a.noRemote = !1, a.noLocal = !1
        };
        this._externalInterfaceOK = function (b, a) {
            if (c.swfLoaded)return !1;
            var d, f = (new Date).getTime();
            c._wD("soundManager::externalInterfaceOK()" + (b ? " (~" + (f - b) + " ms)" : ""));
            w("swf", !0);
            w("flashtojs", !0);
            c.swfLoaded = !0;
            M = !1;
            Ca && Qa();
            if (!a || a.replace(/\+dev/i, "") !== c.versionNumber.replace(/\+dev/i, ""))return d = 'soundManager: Fatal: JavaScript file build "' + c.versionNumber + '" does not match Flash SWF build "' + a + '" at ' +
            c.url + ". Ensure both are up-to-date.", setTimeout(function () {
                throw Error(d);
            }, 0), !1;
            D ? setTimeout(X, 100) : X()
        };
        ca = function (b, a) {
            function d() {
                c._wD("-- SoundManager 2 " + c.version + (!c.html5Only && c.useHTML5Audio ? c.hasHTML5 ? " + HTML5 audio" : ", no HTML5 audio support" : "") + (!c.html5Only ? (c.useHighPerformance ? ", high performance mode, " : ", ") + ((c.flashPollingInterval ? "custom (" + c.flashPollingInterval + "ms)" : "normal") + " polling") + (c.wmode ? ", wmode: " + c.wmode : "") + (c.debugFlash ? ", flash debug mode" : "") + (c.useFlashBlock ?
                    ", flashBlock mode" : "") : "") + " --", 1)
            }

            function f(a, b) {
                return '<param name="' + a + '" value="' + b + '" />'
            }

            if (P && Q)return !1;
            if (c.html5Only)return qa(), d(), c.oMC = u(c.movieID), X(), Q = P = !0, !1;
            var e = a || c.url, i = c.altURL || e, g;
            g = ba();
            var j, m, k = L(), l, n = null, n = (n = h.getElementsByTagName("html")[0]) && n.dir && n.dir.match(/rtl/i), b = "undefined" === typeof b ? c.id : b;
            qa();
            c.url = Ia(N ? e : i);
            a = c.url;
            c.wmode = !c.wmode && c.useHighPerformance ? "transparent" : c.wmode;
            if (null !== c.wmode && (p.match(/msie 8/i) || !D && !c.useHighPerformance) && navigator.platform.match(/win32|win64/i))o("spcWmode"),
                c.wmode = null;
            g = {
                name: b,
                id: b,
                src: a,
                width: "auto",
                height: "auto",
                quality: "high",
                allowScriptAccess: c.allowScriptAccess,
                bgcolor: c.bgColor,
                pluginspage: Va + "www.macromedia.com/go/getflashplayer",
                title: "JS/Flash audio component (SoundManager 2)",
                type: "application/x-shockwave-flash",
                wmode: c.wmode,
                hasPriority: "true"
            };
            if (c.debugFlash)g.FlashVars = "debug=1";
            c.wmode || delete g.wmode;
            if (D)e = h.createElement("div"), m = ['<object id="' + b + '" data="' + a + '" type="' + g.type + '" title="' + g.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' +
            Va + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="' + g.width + '" height="' + g.height + '">', f("movie", a), f("AllowScriptAccess", c.allowScriptAccess), f("quality", g.quality), c.wmode ? f("wmode", c.wmode) : "", f("bgcolor", c.bgColor), f("hasPriority", "true"), c.debugFlash ? f("FlashVars", g.FlashVars) : "", "</object>"].join(""); else for (j in e = h.createElement("embed"), g)g.hasOwnProperty(j) && e.setAttribute(j, g[j]);
            ta();
            k = L();
            if (g = ba())if (c.oMC = u(c.movieID) || h.createElement("div"),
                    c.oMC.id) {
                l = c.oMC.className;
                c.oMC.className = (l ? l + " " : "movieContainer") + (k ? " " + k : "");
                c.oMC.appendChild(e);
                if (D)j = c.oMC.appendChild(h.createElement("div")), j.className = "sm2-object-box", j.innerHTML = m;
                Q = !0
            } else {
                c.oMC.id = c.movieID;
                c.oMC.className = "movieContainer " + k;
                j = k = null;
                if (!c.useFlashBlock)if (c.useHighPerformance)k = {
                    position: "fixed",
                    width: "8px",
                    height: "8px",
                    bottom: "0px",
                    left: "0px",
                    overflow: "hidden"
                }; else if (k = {
                        position: "absolute",
                        width: "6px",
                        height: "6px",
                        top: "-9999px",
                        left: "-9999px"
                    }, n)k.left = Math.abs(parseInt(k.left,
                    10)) + "px";
                if (cb)c.oMC.style.zIndex = 1E4;
                if (!c.debugFlash)for (l in k)k.hasOwnProperty(l) && (c.oMC.style[l] = k[l]);
                try {
                    D || c.oMC.appendChild(e);
                    g.appendChild(c.oMC);
                    if (D)j = c.oMC.appendChild(h.createElement("div")), j.className = "sm2-object-box", j.innerHTML = m;
                    Q = !0
                } catch (r) {
                    throw Error(q("domError") + " \n" + r.toString());
                }
            }
            P = !0;
            d();
            c._wD("soundManager::createMovie(): Trying to load " + a + (!N && c.altURL ? " (alternate URL)" : ""), 1);
            return !0
        };
        aa = function () {
            if (c.html5Only)return ca(), !1;
            if (i)return !1;
            i = c.getMovie(c.id);
            if (!i)S ? (D ? c.oMC.innerHTML = ua : c.oMC.appendChild(S), S = null, P = !0) : ca(c.id, c.url), i = c.getMovie(c.id);
            i && o("waitEI");
            c.oninitmovie instanceof Function && setTimeout(c.oninitmovie, 1);
            return !0
        };
        Z = function () {
            setTimeout(Fa, 1E3)
        };
        Fa = function () {
            if (ga)return !1;
            ga = !0;
            r.remove(j, "load", Z);
            if (M && !Da)return o("waitFocus"), !1;
            var b;
            n || (b = c.getMoviePercent(), c._wD(q("waitImpatient", 100 === b ? " (SWF loaded)" : 0 < b ? " (SWF " + b + "% loaded)" : "")));
            setTimeout(function () {
                b = c.getMoviePercent();
                n || (c._wD("soundManager: No Flash response within expected time.\nLikely causes: " +
                (0 === b ? "Loading " + c.movieURL + " may have failed (and/or Flash " + m + "+ not present?), " : "") + "Flash blocked or JS-Flash security error." + (c.debugFlash ? " " + q("checkSWF") : ""), 2), !N && b && (o("localFail", 2), c.debugFlash || o("tryDebug", 2)), 0 === b && c._wD(q("swf404", c.url)), w("flashtojs", !1, ": Timed out" + N ? " (Check flash security or flash blockers)" : " (No plugin/missing SWF?)"));
                !n && Ta && (null === b ? c.useFlashBlock || 0 === c.flashLoadTimeout ? (c.useFlashBlock && va(), o("waitForever")) : da(!0) : 0 === c.flashLoadTimeout ? o("waitForever") :
                    da(!0))
            }, c.flashLoadTimeout)
        };
        E = function () {
            function b() {
                r.remove(j, "focus", E);
                r.remove(j, "load", E)
            }

            if (Da || !M)return b(), !0;
            Da = Ta = !0;
            c._wD("soundManager::handleFocus()");
            V && M && r.remove(j, "mousemove", E);
            ga = !1;
            b();
            return !0
        };
        Ra = function () {
            var b, a = [];
            if (c.useHTML5Audio && c.hasHTML5) {
                for (b in c.audioFormats)c.audioFormats.hasOwnProperty(b) && a.push(b + ": " + c.html5[b] + (!c.html5[b] && t && c.flash[b] ? " (using flash)" : c.preferFlash && c.flash[b] && t ? " (preferring flash)" : !c.html5[b] ? " (" + (c.audioFormats[b].required ?
                    "required, " : "") + "and no flash support)" : ""));
                c._wD("-- SoundManager 2: HTML5 support tests (" + c.html5Test + "): " + a.join(", ") + " --", 1)
            }
        };
        R = function (b) {
            if (n)return !1;
            if (c.html5Only)return c._wD("-- SoundManager 2: loaded --"), n = !0, I(), w("onload", !0), !0;
            var a;
            if (!c.useFlashBlock || !c.flashLoadTimeout || c.getMoviePercent())n = !0, y && (a = {type: !t && z ? "NO_FLASH" : "INIT_TIMEOUT"});
            c._wD("-- SoundManager 2 " + (y ? "failed to load" : "loaded") + " (" + (y ? "security/load error" : "OK") + ") --", 1);
            if (y || b) {
                if (c.useFlashBlock &&
                    c.oMC)c.oMC.className = L() + " " + (null === c.getMoviePercent() ? "swf_timedout" : "swf_error");
                H({type: "ontimeout", error: a});
                w("onload", !1);
                K(a);
                return !1
            }
            w("onload", !0);
            if (c.waitForWindowLoad && !Y)return o("waitOnload"), r.add(j, "load", I), !1;
            c.waitForWindowLoad && Y && o("docLoaded");
            I();
            return !0
        };
        X = function () {
            o("init");
            if (n)return o("didInit"), !1;
            if (c.html5Only) {
                if (!n)r.remove(j, "load", c.beginDelayedInit), c.enabled = !0, R();
                return !0
            }
            aa();
            try {
                o("flashJS"), i._externalInterfaceTest(!1), Ga(!0, c.flashPollingInterval ||
                (c.useHighPerformance ? 10 : 50)), c.debugMode || i._disableDebug(), c.enabled = !0, w("jstoflash", !0), c.html5Only || r.add(j, "unload", na)
            } catch (b) {
                return c._wD("js/flash exception: " + b.toString()), w("jstoflash", !1), K({
                    type: "JS_TO_FLASH_EXCEPTION",
                    fatal: !0
                }), da(!0), R(), !1
            }
            R();
            r.remove(j, "load", c.beginDelayedInit);
            return !0
        };
        J = function () {
            if (sa)return !1;
            sa = !0;
            ta();
            var b = O.toLowerCase(), a = null, a = null, d = "undefined" !== typeof console && "undefined" !== typeof console.log;
            if (-1 !== b.indexOf("sm2-usehtml5audio="))a = "1" === b.charAt(b.indexOf("sm2-usehtml5audio=") +
            18), d && console.log((a ? "Enabling " : "Disabling ") + "useHTML5Audio via URL parameter"), c.useHTML5Audio = a;
            if (-1 !== b.indexOf("sm2-preferflash="))a = "1" === b.charAt(b.indexOf("sm2-preferflash=") + 16), d && console.log((a ? "Enabling " : "Disabling ") + "preferFlash via URL parameter"), c.preferFlash = a;
            if (!t && c.hasHTML5)c._wD("SoundManager: No Flash detected" + (!c.useHTML5Audio ? ", enabling HTML5." : ". Trying HTML5-only mode.")), c.useHTML5Audio = !0, c.preferFlash = !1;
            Oa();
            c.html5.usingFlash = Na();
            z = c.html5.usingFlash;
            Ra();
            if (!t &&
                z)c._wD("SoundManager: Fatal error: Flash is needed to play some required formats, but is not available."), c.flashLoadTimeout = 1;
            h.removeEventListener && h.removeEventListener("DOMContentLoaded", J, !1);
            aa();
            return !0
        };
        za = function () {
            "complete" === h.readyState && (J(), h.detachEvent("onreadystatechange", za));
            return !0
        };
        ra = function () {
            Y = !0;
            r.remove(j, "load", ra)
        };
        ka();
        r.add(j, "focus", E);
        r.add(j, "load", E);
        r.add(j, "load", Z);
        r.add(j, "load", ra);
        V && M && r.add(j, "mousemove", E);
        h.addEventListener ? h.addEventListener("DOMContentLoaded",
            J, !1) : h.attachEvent ? h.attachEvent("onreadystatechange", za) : (w("onload", !1), K({
            type: "NO_DOM2_EVENTS",
            fatal: !0
        }));
        "complete" === h.readyState && setTimeout(J, 100)
    }

    var la = null;
    if ("undefined" === typeof SM2_DEFER || !SM2_DEFER)la = new W;
    G.SoundManager = W;
    G.soundManager = la
})(window);