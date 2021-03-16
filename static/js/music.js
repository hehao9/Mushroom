$(document).ready(function() {
    $('#s_song_name').focus();
    var audio = document.getElementById('audio');
    audio.volume = 0.5;
    var song_progress_on_slide = false;
    var song_progress = $('#song-progress-input').slider({
        step: 0.2,
        min: 0,
        max: 0,
        value: 0,
        tooltip: 'hide'
    });
    song_progress.slider('on', 'slide', function(result) {
        if (audio.currentSrc) {
            // 设置当前播放时间显示
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

            // 设置歌词进度
            var half_lrc_screen_height = parseInt($("#lyric_result").height() / 2);
            $("#lyric_result > div").each(function(i, e){
                if (result >= $(this).attr('t')) {
                    var left_scroll_lyric_height = ($("#lyric_result > div").length - i) * 30 + 15 - half_lrc_screen_height;
                    if (left_scroll_lyric_height > 0) {
                        var scroll_lyric_height = i * 30 + 15 - half_lrc_screen_height;
                        if (scroll_lyric_height > 0) {
                            if (left_scroll_lyric_height < 30) {
                                scroll_lyric_height = scroll_lyric_height - 30 + left_scroll_lyric_height;
                            }
                            if (scroll_lyric_height % 2 == 1) {
                                scroll_lyric_height = scroll_lyric_height - 1;
                            }
                            $("#lyric_result").getNiceScroll(0).doScrollTop(scroll_lyric_height);
                        }
                    }
                    $(this).css({'font-size': '15px', 'color': '#e8e8e8'});
                    $(this).siblings().attr('style', '');
                }
            });
        }
    });
    song_progress.slider('on', 'slideStart', function(result) {
        if (audio.currentSrc) {
            song_progress_on_slide = true;
        }
    });
    song_progress.slider('on', 'slideStop', function(result) {
        if (audio.currentSrc) {
            audio.currentTime = result;
            if ($('#play-pause').attr('class') == 'iconfont icon-pause'){
                audio.play();
            }
            song_progress_on_slide = false;
        }
    });
    $('#s_song_name').keyup(function(event) {
        if (event.keyCode == 13) {
            if ($(this).val()) {
                $.get('/music/search/' + $(this).val(), function(song_results) {
                    $('#s_song_results').html(song_results);
                    $('#s_song_results > div').niceScroll({
                        cursorcolor: "#444",
                        cursorwidth: 4,
                        cursorborder: 0,
                        cursorborderradius: 0,
                    });
                    $('.icon-play-cicle').click(function() {
                        $('.icon-play-cicle').css('color', '');
                        $(this).css('color', '#28a745');
                        $('#album-pic').attr('src', $(this).parent('td').attr('album-pic'));
                        $('.song-name').text($(this).parent('td').attr('song-name'));
                        $('.song-singer').text($(this).parent('td').attr('song-singer'));
                        $('#song-duration').text($(this).parent('td').attr('song-duration'));
                        $.get('/music/play/detail/' + $(this).parent('td').attr('song-id'), function(song_detail) {
                            var html = "";
                            $.each(song_detail['lyric'], function(i, v) {
                                html += '<div class="text-center" t=' + v.t + '>' + v.c + '</div>';
                            });
                            $('#lyric_result').html(html);
                            $('#lyric_result').niceScroll({
                                cursorcolor: "#444",
                                cursorwidth: 4,
                                cursorborder: 0,
                                cursorborderradius: 0,
                            });
                            $('#audio').attr('src', song_detail['url']);
                            $('#play-pause').attr('class', 'iconfont icon-pause');
                            audio.play();
                        });
                    });
                    $('.icon-add').click(function() {
                        var html = '<tr><td>' + $(this).parent('td').attr('song-name') + '</td><td>' +
                        $(this).parent('td').attr('song-singer') + '</td><td>' +
                        $(this).parent('td').attr('song-duration') +'</td></tr>';
                        $('.playlist-box > table > tbody').append(html);
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
            } else {
                $(this).attr('class', 'iconfont icon-play');
                audio.pause();
            }
        }
    });
    var volume_progress = $('#volume-progress-input').slider({
        step: 1,
        min: 0,
        max: 100,
        value: 50,
        tooltip: 'show',
        orientation: 'vertical',
        reversed: true,
        tooltip: 'hide'
    });
    volume_progress.slider('on', 'slide', function(result) {
        $('#vol-val').text(result);
        audio.volume = result / 100;
        if (audio.volume == 0) {
            $('#volume').attr('class', 'iconfont icon-volume-0');
        } else {
            $('#volume').attr('class', 'iconfont icon-volume-1');
        }
    });
    volume_progress.slider('on', 'slideStop', function(result) {
        $('#vol-val').text(result);
        audio.volume = result / 100;
        if (audio.volume == 0) {
            $('#volume').attr('class', 'iconfont icon-volume-0');
        } else {
            $('#volume').attr('class', 'iconfont icon-volume-1');
        }
    });
    $(document).click(function(){
        $(".volume-box, .playlist-box").hide();
    });
    $('.volume-box, .playlist-box').click(function(e){
        e.stopPropagation();
    });
    $('#volume').click(function(e) {
        e.stopPropagation();
        $(".playlist-box").hide();
        $('.volume-box').toggle();
    });
    $('#playlist').click(function(e) {
        e.stopPropagation();
        $(".volume-box").hide();
        $('.playlist-box').css('bottom', $('#bottom-bar').outerHeight() + 'px')
        $('.playlist-box').toggle();
    });
    $('#lyric').click(function() {
        if ($('#page-lyric').css('display') == 'none') {
            $('#cur_title_line').hide();
        }
        $('#search_list').slideToggle('fast');
        $('#page-lyric').slideToggle('fast', function() {
            if ($('#page-lyric').css('display') == 'block') {
                $('#lyric_result').getNiceScroll().resize();
                $('#lyric').css('color', '#28a745');
            } else {
                $('#lyric').css('color', '');
                $('#cur_title_line').show();
                $('#s_song_results > div').getNiceScroll().resize();
            }
        });
    });
    audio.ontimeupdate = function() {
        if (!song_progress_on_slide) {
            if (audio.ended) {
                $('#play-pause').attr('class', 'iconfont icon-play');
                audio.currentTime = 0;
                setTimeout(function() {
                    $('#play-pause').attr('class', 'iconfont icon-pause');
                    audio.play();
                }, 1000);
            };
            // 设置跟随播放进度条
            song_progress.slider('setAttribute', 'max', parseInt(audio.duration));
            song_progress.slider('setValue', audio.currentTime);

            // 设置当前播放时间显示
            var millis = parseInt(audio.currentTime);
            var seconds = millis % 60;
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            var minutes = parseInt(millis / 60)
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            $('#song-currentTime').text(minutes + ':' + seconds);

            // 设置歌词进度
            var half_lrc_screen_height = parseInt($("#lyric_result").height() / 2);
            $("#lyric_result > div").each(function(i, e){
                if (audio.currentTime >= $(this).attr('t')) {
                    var left_scroll_lyric_height = ($("#lyric_result > div").length - i) * 30 + 15 - half_lrc_screen_height;
                    if (left_scroll_lyric_height > 0) {
                        var scroll_lyric_height = i * 30 + 15 - half_lrc_screen_height;
                        if (scroll_lyric_height > 0) {
                            if (left_scroll_lyric_height < 30) {
                                scroll_lyric_height = scroll_lyric_height - 30 + left_scroll_lyric_height;
                            }
                            if (scroll_lyric_height % 2 == 1) {
                                scroll_lyric_height = scroll_lyric_height - 1;
                            }
                            $("#lyric_result").getNiceScroll(0).doScrollTop(scroll_lyric_height);
                        } else {
                            $("#lyric_result").getNiceScroll(0).doScrollTop(0);
                        }
                    }
                    $(this).css({'font-size': '15px', 'color': '#e8e8e8'});
                    $(this).siblings().attr('style', '');
                }
            });
        }
    };
    $('#play-rule').click(function() {
        if ($(this).attr('class') == 'iconfont icon-single-loop') {
            $(this).attr('class', 'iconfont icon-list-loop')
        } else if ($(this).attr('class') == 'iconfont icon-list-loop') {
            $(this).attr('class', 'iconfont icon-random-play')
        } else {
            $(this).attr('class', 'iconfont icon-single-loop')
        }
    });
});