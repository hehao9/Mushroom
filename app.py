import requests
from flask import Flask, request
from flask import render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/music', methods=['POST', 'GET'])
def music():
    s_song = request.form['s_song'] if request.method == 'POST' else ''
    results = []
    url = 'https://music.163.com/weapi/cloudsearch/get/web?csrf_token='
    data = {
        'params': 'QCerCIlmXccsnXSHCR0Ml9ZdpCsc+oWUjNWJv4WYKL8wOaFaNiTU/R7m7DCtBpgJlkJwYI972z0YeDgTlm0JQak0BdobZEg1YaW1ckaSYSr0x+vkjGGMJphMvhe9VtNNamySdZlAaWEtEjI00bV9Hm2ZnxivXlzVASbTNmomR0Sn7+1Kp3Vkl4kR22rhy6VnPci1VtUTN8QfIKNAkDIg//u8/jETyvOsgksrbs7K5TUAMYJuVsO5po2A6S6NbFlz39tadgkvN1fY+qBeg3urpwyXkWIrZ7TtY4zW/MWehIc=',
        'encSecKey': 'd80cb687d8fe4444c871c3746d3bcb91f5d1f6fb4999b6d9022d0a0bc8618a4235ac93a3c2cbbfe32cfb9da9da7e5b8849a68904c0b22e68d7b52a5129f8663006b253c74c5bef6e49355fc30b7e323d168e2da710a954cbd0cec2e61c7a9405db900d5a845c83172a03cef69778afd46689f07d09a49e7de9a74005e9315c14',
    }
    response = requests.post(url, data=data)
    resp_json = response.json()
    song_list = []
    if resp_json.get('code') == 200:
        songs = resp_json.get('result').get('songs')
        for song in songs:
            millis = int(song.get('dt'))
            seconds = int((millis / 1000) % 60)
            seconds = f'0{seconds}' if seconds < 10 else seconds
            minutes = int(millis / (1000 * 60))
            minutes = f'0{minutes}' if minutes < 10 else minutes
            duration = f'{minutes}:{seconds}'
            song_list.append({
                'name': song.get('name'),
                'singer': song.get('ar')[0].get('name'),
                'album_pic': song.get('al').get('picUrl'),
                'duration': duration,
            })
    results.append({
        'platform': '网易云音乐',
        'song_list': song_list,
    })
    return render_template('music.html', results=results, s_song=s_song)


if __name__ == '__main__':
    app.run(debug=True)
