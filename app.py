from flask import Flask, jsonify, request
from flask import render_template
import netease_cloud_music
import kugou_music

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('home.html')


@app.route('/music')
def music():
    return render_template('music.html')


@app.route('/music/search/<song_name>')
def music_search(song_name):
    results = [{
        'platform': '网易云音乐',
        'alias': 'netease-cloud',
        'song_list': netease_cloud_music.get_music_search(song_name),
    }, {
        'platform': '酷狗音乐',
        'alias': 'kugou',
        'song_list': kugou_music.get_music_search(song_name),
    }]
    return render_template('song_list.html', results=results)


@app.route('/music/play/detail', methods=['post'])
def music_detail():
    song_platform = request.form['song_platform']
    if song_platform == 'netease-cloud':
        return jsonify(netease_cloud_music.get_music_detail(request.form['song_id']))
    if song_platform == 'kugou':
        return jsonify(kugou_music.get_music_detail(request.form['song_album_id'], request.form['song_hash']))


if __name__ == '__main__':
    app.run(debug=True)
