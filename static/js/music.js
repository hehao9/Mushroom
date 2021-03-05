$(document).ready(function() {
    var timer = 0;
    var song_progress_step = 0.01;
    var fq = song_progress_step * 1000;
    $('#s_song_name').focus();
    var current_song_id = 0;
    var current_song_lyric = '';
    var audio = document.getElementById('audio');
    auto_scroll_lyric = true;
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
            $('#play-pause').attr('class', 'iconfont icon-play');
            clearInterval(timer);
            $('#song-currentTime').text('00:00');
            song_progress.slider('setValue', 0);
            audio.currentTime = 0;
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

            $("#page-lyric").css('top', '59px');
            var page_lyric_visible_height = $("#page-lyric").height();
            $("#page-lyric > div").each(function(i, e){
                if (result >= $(this).attr('t')) {
                    var scroll_height = i * 32 + 16 - parseInt(page_lyric_visible_height / 2)
                    if (scroll_height > 0) {
                        $("#page-lyric").css('top', 59 - scroll_height + 'px');
                    }
                    $(this).css('color', '#e8e8e8');
                    $(this).siblings().css('color', '');
                }
            });
        }
    });
    song_progress.slider('on', 'slideStart', function(result) {
        if (audio.currentSrc) {
            if (!audio.paused) {
                clearInterval(timer);
            }
            auto_scroll_lyric = false;
        }
    });
    song_progress.slider('on', 'slideStop', function(result) {
        if (audio.currentSrc) {
            audio.currentTime = result;
            if (!audio.paused) {
                timer = setInterval(change_progress, fq);
            }
            auto_scroll_lyric = true;
        }
    });
    $('#s_song_name').keyup(function(event) {
        if (event.keyCode == 13) {
            if ($(this).val()) {
                $.get('/music/search/' + $(this).val(), function(song_results) {
                    $('#s_song_results').html(song_results);
                    $('.icon-play-cicle').click(function() {
                        $('.icon-play-cicle').css('color', '');
                        $(this).css('color', '#C20C0C');
                        $('#album-pic').attr('src', $(this).attr('album-pic'));
                        $('#song-name').text($(this).attr('song-name'));
                        $('#song-singer').text($(this).attr('song-singer'));
                        $('#song-duration').text($(this).attr('song-duration'));
                        current_song_id = $(this).attr('song-id');
                        current_song_lyric = '';
                        $.get('/music/url/' + current_song_id, function(song_url) {
                            clearInterval(timer);
                            $('#audio').attr('src', song_url);
                            $('#play-pause').attr('class', 'iconfont icon-pause');
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
                $(this).attr('class', 'iconfont icon-pause');
                audio.play();
                timer = setInterval(change_progress, fq);
            } else {
                $(this).attr('class', 'iconfont icon-play');
                audio.pause();
                clearInterval(timer);
            }
        }
    });
    var voice_mute_before = 0.5;
    var volume_progress = $('#volume-progress-input').slider({
        step: 1,
        min: 0,
        max: 100,
        value: voice_mute_before * 100,
        tooltip: 'show'
    });
    $('#volume').click(function() {
        if (audio.volume > 0) {
            audio.volume = 0;
            $(this).attr('class', 'iconfont icon-volume-0');
        } else {
            if (voice_mute_before > 0) {
                audio.volume = voice_mute_before;
                if (audio.volume == 0) {
                    $('#volume').attr('class', 'iconfont icon-volume-0');
                } else if (audio.volume <= 0.33) {
                    $('#volume').attr('class', 'iconfont icon-volume-1');
                } else if (audio.volume <= 0.66) {
                    $('#volume').attr('class', 'iconfont icon-volume-2');
                } else {
                    $('#volume').attr('class', 'iconfont icon-volume-3');
                }
            }
        }
    });
    volume_progress.slider('on', 'slide', function(result) {
        audio.volume = voice_mute_before = result / 100;
        if (audio.volume == 0) {
            $('#volume').attr('class', 'iconfont icon-volume-0');
        } else if (audio.volume <= 0.33) {
            $('#volume').attr('class', 'iconfont icon-volume-1');
        } else if (audio.volume <= 0.66) {
            $('#volume').attr('class', 'iconfont icon-volume-2');
        } else {
            $('#volume').attr('class', 'iconfont icon-volume-3');
        }
    });
    volume_progress.slider('on', 'slideStop', function(result) {
        audio.volume = voice_mute_before = result / 100;
        if (audio.volume == 0) {
            $('#volume').attr('class', 'iconfont icon-volume-0');
        } else if (audio.volume <= 0.33) {
            $('#volume').attr('class', 'iconfont icon-volume-1');
        } else if (audio.volume <= 0.66) {
            $('#volume').attr('class', 'iconfont icon-volume-2');
        } else {
            $('#volume').attr('class', 'iconfont icon-volume-3');
        }
    });
    $('#lyric').click(function() {
        if (current_song_id != 0) {
            if (current_song_lyric == '') {
                $.get('/music/lyric/' + current_song_id, function(song_lyric) {
                    var html = "";
                    $.each(song_lyric, function(i, v) {
                        html += '<div class="p-1 text-center" t=' + v.t + '>' + v.c + '</div>';
                    });
                    $('#page-lyric').html(html);
                    current_song_lyric = html;
                });
            }
            $('#s_song_results').slideToggle("slow");
            $('#page-lyric').slideToggle("slow");
        }
    });
    audio.ontimeupdate = function() {
        if (auto_scroll_lyric) {
            $("#page-lyric").css('top', '59px');
            var page_lyric_visible_height = $("#page-lyric").height();
            $("#page-lyric > div").each(function(i, e){
                if (audio.currentTime >= $(this).attr('t')) {
                    var scroll_lyric_height = i * 32 + 16 - parseInt(page_lyric_visible_height / 2)
                    if (scroll_lyric_height > 0) {
                        $("#page-lyric").css('top', 59 - scroll_lyric_height + 'px');
                    }
                    $(this).css('color', '#e8e8e8');
                    $(this).siblings().css('color', '');
                }
            });
        }
    };
});