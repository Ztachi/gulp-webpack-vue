;
(function (Flex) {
    var win = window;
    var doc = win.document;
    var rootElem = doc.documentElement;
    var ua = win.navigator.userAgent;
    var isIPhone = ua.match(/iphone/i);
    var isYIXIN = ua.match(/yixin/i);
    var is2345 = ua.match(/Mb2345/i);
    var ishaosou = ua.match(/mso_app/i);
    var isSogou = ua.match(/sogoumobilebrowser/ig);
    var isLiebao = ua.match(/liebaofast/i);
    var isGnbr = ua.match(/GNBR/i);
    var tid;

    function refreshRem() {
        var sw = (screen.width > 0) ? (win.innerWidth >= screen.width || win.innerWidth == 0) ? screen.width : win.innerWidth : win.innerWidth;
        var sh = (screen.height > 0) ? (win.innerHeight >= screen.height || win.innerHeight == 0) ? screen.height : win.innerHeight : win.innerHeight;
        var dpr, rem;
        if (win.devicePixelRatio) {
            dpr = win.devicePixelRatio;
        } else {
            dpr = isIPhone ? sw > 818 ? 3 : sw > 480 ? 2 : 1 : 1;
        }
        if (isIPhone) {
            sw = screen.width;
            sh = screen.height;
        }
        if (sw > sh) {
            sw = sh;
        }
        rem = sw > 1080 ? 144 : sw / 7.5;
        rem = rem > 32 ? rem : 32;
        Flex.rem = rem;
        Flex.dpr = dpr;
        Flex.baseWidth = sw;
        if (isYIXIN || is2345 || ishaosou || isSogou || isLiebao || isGnbr) {
            setTimeout(function () {
                sw = (screen.width > 0) ? (win.innerWidth >= screen.width || win.innerWidth == 0) ? screen.width : win.innerWidth : win.innerWidth;
                sh = (screen.height > 0) ? (win.innerHeight >= screen.height || win.innerHeight == 0) ? screen.height : win.innerHeight : win.innerHeight;
                rem = sw > 1080 ? 144 : sw / 7.5;
                rem = rem > 32 ? rem : 32;
                Flex.rem = rem;
                Flex.dpr = dpr;
                Flex.baseWidth = sw;
                rootElem.setAttribute("data-dpr", dpr);
                rootElem.style.fontSize = rem + "px";
                doc.getElementById("fixed-guard").style.display = "none";
            }, 500);
        } else {
            rootElem.setAttribute("data-dpr", dpr);
            rootElem.style.fontSize = rem + "px";
            doc.getElementById("fixed-guard").style.display = "none";
        }
    }

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = 12 * Flex.dpr + "px"
    } else {
        doc.addEventListener("DOMContentLoaded", function (e) {
            doc.body.style.fontSize = 12 * Flex.dpr + "px"
        }, false)
    }
    Flex.rem2px = function (d) {
        var val = parseFloat(d) * Flex.rem;
        if (typeof d === "string" && d.match(/rem$/)) {
            val += "px";
        }
        return val;
    };
    Flex.px2rem = function (d) {
        var val = parseFloat(d) / Flex.rem;
        if (typeof d === "string" && d.match(/px$/)) {
            val += "rem";
        }
        return val;
    };

    refreshRem();
})(window.Flex = {});