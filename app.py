from flask import Flask, request
from flask import render_template
from util import search, get_song_url

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/music', methods=['POST', 'GET'])
def music():
    s_song = request.form['s_song'] if request.method == 'POST' else ''
    results = [{
        'platform': '网易云音乐',
        'song_list': search(s_song),
    }]
    return render_template('music.html', results=results, s_song=s_song)


@app.route('/music/<int:song_id>')
def music_url(song_id):
    return get_song_url(song_id)


if __name__ == '__main__':
    app.run(debug=True)
