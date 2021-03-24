import requests
from hashlib import md5
import urllib3
urllib3.disable_warnings()


def request_url(url, song_name):
    params = {
        'callback': '',
        'keyword': song_name,
        'page': 1,
        'pagesize': 30,
        'bitrate': 0,
        'isfuzzy': 0,
        'tag': 'em',
        'inputtype': 0,
        'platform': 'WebFilter',
        'userid': -1,
        'clientver': 2000,
        'iscorrection': 1,
        'privilege_filter': 0,
        'srcappid': 2919,
        'clienttime': 1616490162653,
        'mid': 1616490162653,
        'uuid': 1616490162653,
        'dfid': '-',
    }
    sign_lst = [
        'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt',
        f'bitrate={params["bitrate"]}',
        f'callback={params["callback"]}',
        f'clienttime={params["clienttime"]}',
        f'clientver={params["clientver"]}',
        f'dfid={params["dfid"]}',
        f'inputtype={params["inputtype"]}',
        f'iscorrection={params["iscorrection"]}',
        f'isfuzzy={params["isfuzzy"]}',
        f'keyword={params["keyword"]}',
        f'mid={params["mid"]}',
        f'page={params["page"]}',
        f'pagesize={params["pagesize"]}',
        f'platform={params["platform"]}',
        f'privilege_filter={params["privilege_filter"]}',
        f'srcappid={params["srcappid"]}',
        f'tag={params["tag"]}',
        f'userid={params["userid"]}',
        f'uuid={params["uuid"]}',
        'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt',
    ]
    params['signature'] = md5(''.join(sign_lst).encode('utf8')).hexdigest()
    response = requests.get(url, params=params, verify=False)
    return response.json()


def get_music_search(song_name):
    song_list = []
    if song_name.strip():
        url = 'https://complexsearch.kugou.com/v2/search/song'
        resp_json = request_url(url, song_name)
        if resp_json.get('status') == 1:
            songs = resp_json.get('data').get('lists')
            for song in songs:
                millis = int(song.get('Duration'))
                seconds = int(millis % 60)
                seconds = f'0{seconds}' if seconds < 10 else seconds
                minutes = int(millis / 60)
                minutes = f'0{minutes}' if minutes < 10 else minutes
                duration = f'{minutes}:{seconds}'
                song_list.append({
                    'id': song.get('ID'),
                    'name': song.get('SongName').replace('<em>', '').replace('</em>', ''),
                    'singer': song.get('SingerName'),
                    'album': song.get('AlbumName'),
                    'duration': duration,
                })
    return song_list


def get_music_detail(song_id):
    url = 'https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token='
    text = {"ids": [song_id], "level": "standard", "encodeType": "aac", "csrf_token": ""}
    resp_json = request_url(url, text)
    song_url = ''
    if resp_json.get('code') == 200:
        song_url = resp_json.get('data')[0].get('url')

    url = 'https://music.163.com/weapi/song/lyric?csrf_token='
    text = {"id": song_id, "lv": -1, "tv": -1, "csrf_token": ""}
    resp_json = request_url(url, text)
    song_lyric = []
    if resp_json.get('code') == 200:
        lyric = resp_json.get('lrc').get('lyric')
        line_lyrics = lyric.split('\n')
        for line_lyric in line_lyrics:
            if line_lyric != '' and line_lyric.split(']')[1] != '':
                time_str = line_lyric.split(']')[0].split('[')[1]
                song_lyric.append({
                    't': int(time_str.split(':')[0]) * 60 + float(time_str.split(':')[1]),
                    'c': line_lyric.split(']')[1],
                })
    return {'url': song_url, 'lyric': song_lyric}


if __name__ == '__main__':
    # print(get_music_search('寂寞沙洲冷'))
    print(get_music_detail(1822207727))
