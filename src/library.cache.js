

var MediaCache = {};

MediaCache.ImageLoad = function(urlArray, progress, __debugger__) {

    var map = new Map();

    var container = $('#MediaCacheImageContainer');
    if (container.length === 0) {
        container = $('<div id="MediaCacheImageContainer"/>').hide();
    }

    urlArray.forEach(function(url, idx) {
        map.set(url, false);
        var src = url;
        if (__debugger__ === true) {
            if (src.indexOf('?') === -1) {
                src += '?v=' + new Date().getTime();
            } else {
                src += '&v=' + new Date().getTime();
            }
        }
        var id = CreateID();
        var jQImage = $('<img/>')
            .attr('id', id)
            .attr('src', src)
            .attr('data-src', url)
        ;
        jQImage[0].onload = function() {
            var url = $(this).data('src');
            map.set(url, true);
            progress && progress(url, map);
        };
        container.append(jQImage);
    });

    $('body').append(container);

};

MediaCache.AudioLoad = function(urlArray, progress, __debugger__) {

    var map = new Map();

    var container = $('#MediaCacheAudioContainer');
    if (container.length === 0) {
        container = $('<div id="MediaCacheAudioContainer"/>').hide();
    }

    urlArray.forEach(function(url, idx) {
        map.set(url, false);
        var id = CreateID();
        var jQAudio = $('<audio preload="auto" muted/>')
            .attr('id', id)
            .attr('data-src', url)
        ;
        if (__debugger__ === true) {
            if (url.indexOf('?') === -1) {
                url += '?v=' + new Date().getTime();
            } else {
                url += '&v=' + new Date().getTime();
            }
        }
        var jQSource = $('<source src="" type="audio/mpeg"/>').attr('src', url);
        jQAudio.append(jQSource);
        var audio = jQAudio[0];
        audio.load();
        audio.addEventListener("canplaythrough",
            function() {
                var url = $(this).data('src');
                map.set(url, true);
                progress && progress(url, map);
            },
            false);
        container.append(jQAudio);
    });

    $('body').append(container);

};
