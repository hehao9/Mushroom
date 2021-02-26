$(document).ready(function() {
    var timer = 0;
    var song_progress_step = 0.01;
    var fq = song_progress_step * 1000;
    $('#s_song_name').focus();
    var audio = document.getElementById('audio');
    audio.volume = 0.5;
    var song_progress = $('#song-progress-input').slider({
        step: song_progress_step,
        min: 0,
        max: 0,
        value: 0,
        tooltip: 'hide'
    });
    var change_progress = function() {
        var total_millis = parseInt(audio.duration);
        song_progress.slider('setAttribute', 'max', total_millis);
        var millis = parseInt(audio.currentTime);
        song_progress.slider('setValue', audio.currentTime);
        var seconds = millis % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        var minutes = parseInt(millis / 60);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        $('#song-currentTime').text(minutes + ':' + seconds);
        if (audio.ended) {
            $('#play-pause').attr('class', 'song-play');
            clearInterval(timer);
            $('#song-currentTime').text('00:00');
            song_progress.slider('setValue', 0);
        };
    };
    song_progress.slider('on', 'slide', function(result) {
        if (audio.currentSrc) {
            var millis = parseInt(result);
            var seconds = millis % 60;
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            var minutes = parseInt(millis / 60)
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            $('#song-currentTime').text(minutes + ':' + seconds);
        }
    });
    song_progress.slider('on', 'slideStart', function(result) {
        if (audio.currentSrc) {
            clearInterval(timer);
        }
    });
    song_progress.slider('on', 'slideStop', function(result) {
        if (audio.currentSrc) {
            audio.currentTime = result;
            if (audio.paused) {
                $('#play-pause').attr('class', 'song-pause');
                audio.play();
            }
            timer = setInterval(change_progress, fq);
        }
    });
    $('#s_song_name').keyup(function(event) {
        if (event.keyCode == 13) {
            if ($(this).val()) {
                $.get('/music/search/' + $(this).val(), function(song_results) {
                    $('#s_song_results').html(song_results);
                    $('#s_song_results i.fa').click(function() {
                        $('#s_song_results i.fa').css("color", "");
                        $(this).css("color", "#c20c0c");
                        var album_pic = $(this).attr('album-pic');
                        var song_name = $(this).attr('song-name');
                        var song_singer = $(this).attr('song-singer');
                        var song_duration = $(this).attr('song-duration');
                        $.get('/music/url/' + $(this).attr('song-id'),
                        function(song_url) {
                            clearInterval(timer);
                            $('#audio').attr('src', song_url);
                            $('#album-pic').attr('src', album_pic);
                            $('#song-name').text(song_name);
                            $('#song-singer').text(song_singer);
                            $('#song-duration').text(song_duration);
                            $('#play-pause').attr('class', 'song-pause');
                            audio.play();
                            timer = setInterval(change_progress, fq);
                        });
                    });
                });
            };
        };
    });
    $('#play-pause').click(function() {
        if (audio.currentSrc) {
            if (audio.paused) {
                $(this).attr('class', 'song-pause');
                audio.play();
                timer = setInterval(change_progress, fq);
            } else {
                $(this).attr('class', 'song-play');
                audio.pause();
                clearInterval(timer);
            }
        }
    });
    var volume_progress = $('#volume-progress-input').slider({
        step: 1,
        min: 0,
        max: 100,
        value: 50,
        tooltip: 'show'
    });
    volume_progress.slider('on', 'slide', function(result) {
        audio.volume = result / 100;
    });
});