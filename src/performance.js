var PerformanceJS = {
    /*
        Navigation timing API: https://w3c.github.io/web-performance/specs/NavigationTiming/Overview.html
    */

    __timing_handler_api: function() {
        /*
            TODO: add how many resources where fetched

            Method used to collect data from timing API.
            ua_redirect_time    - time taken to redirect to another resource
            ua_cache_time       - time taken to lookup browser cache for cached resource
            net_dns_time        - time taken to resolve domain name to an ip
            net_tcp_time        - time taken in initialize tcp connection (3 way handshake)
            net_ttfb_time       - time taken to client sent request to server and get first response byte
            net_download_time   - time taken between receiving first and last bytes from server
            doc_load_time       - time taken to document (current web page) to be loaded and parsed; document.readyState is set to interactive
            doc_complete_time   - time taken to load and parse external resources like - images, css, frame ...; document.readyState is set to complete
            total_time          - time taken to fully load web page
            doc_name            - URL of current web page
        */

        console.log('__timing_handler_api');
        var sData = {};
        var tData = window.performance.timing;
        var navigationStart = tData['navigationStart'];
        var unloadEventStart = tData['unloadEventStart'];
        var unloadEventEnd = tData['unloadEventEnd'];
        var redirectStart = tData['redirectStart'];
        var redirectEnd = tData['redirectEnd'];
        var fetchStart = tData['fetchStart'];
        var domainLookupStart = tData['domainLookupStart'];
        var domainLookupEnd = tData['domainLookupEnd'];
        var connectStart = tData['connectStart'];
        var connectEnd = tData['connectEnd'];
        var secureConnectionStart = tData['secureConnectionStart'];
        var requestStart = tData['requestStart'];
        var responseStart = tData['responseStart'];
        var responseEnd = tData['responseEnd'];
        var domLoading = tData['domLoading'];
        var domInteractive = tData['domInteractive'];
        var domContentLoadedEventStart = tData['domContentLoadedEventStart'];
        var domContentLoadedEventEnd = tData['domContentLoadedEventEnd'];
        var domComplete = tData['domComplete'];
        var loadEventStart = tData['loadEventStart'];
        var loadEventEnd = tData['loadEventEnd'];

        sData['ua_redirect_time'] = redirectEnd - redirectStart;
        sData['ua_cache_time'] = domainLookupStart - fetchStart;
        sData['net_dns_time'] = domainLookupEnd - domainLookupStart;
        sData['net_tcp_time'] = connectEnd - connectStart;
        sData['net_ttfb_time'] = responseStart - requestStart;
        sData['net_download_time'] = responseEnd - responseStart;
        sData['doc_load_time'] = domInteractive - domLoading;
        sData['doc_complete_time'] = domComplete - domInteractive;
        sData['total_time'] = domComplete - navigationStart;
        sData['doc_name'] = window.location.href;
        return sData;
    },

    __timing_handler_fallback: function() {
        /*
            Method used to collect sData when timing API is unavailable
        */
        console.log('__timing_handler_fallback');
        var sData = {};
        return sData;
    },

    __collect: function() {
        /*
            Abstract data collector; decision point which method to use
        */
        console.log('__collect');
        var sData = {};
        if (window.hasOwnProperty('performance') && window.performance.timing) {
            sData = this.__timing_handler_api();
        } else {
            sData = this.__timing_handler_fallback();
        }
        return sData;
    },

    __update: function(sData) {
        /*
            Create a request and send data to server
        */
        console.log('__update');
        var sURL = 'http://localhost:8080/ajax';
        var sMethod = 'POST';
        var sResponse = null;
        var cRequest = null;
        console.log(sData);
        if (window.XMLHttpRequest) {
            cRequest = new window.XMLHttpRequest();
        } else if (window.ActiveXObject) {
            cRequest = new window.ActiveXObject('Microsoft.XMLHTTP');
        } else {
            throw 'ERROR: failed to create cRequest';
        }
        cRequest.onreadystatechange = function() {
            if (cRequest.readyState == 4 && cRequest.status == 200) {
                sResponse = cRequest.responseText;
            }
        }
        cRequest.open(sMethod, sURL);
        cRequest.setRequestHeader('Content-Type', 'application/json');
        cRequest.send('sData=' + encodeURIComponent(sData));
        return sResponse;
    },

    run: function() {
        /*
            External module interface; parameters will be passed here
        */
        var sData = this.__collect();
        var response = this.__update(sData);
        return response;
    }
};

document.onreadystatechange = function() {
    /* to accurately collect sData we have to wait till document will be fully loaded (include external resources) */
    if (document.readyState == 'complete') {
        PerformanceJS.run();
    }
}
