from flask import Flask, request
from flask import render_template
from util import search, get_song_url

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/music')
def music():
    return render_template('music.html')


@app.route('/music/search/<song_name>')
def music_search(song_name):
    results = [{
        'platform': '网易云音乐',
        'song_list': search(song_name),
    }]
    return render_template('song_list.html', results=results)


@app.route('/music/url/<int:song_id>')
def music_url(song_id):
    return get_song_url(song_id)


if __name__ == '__main__':
    app.run(debug=True)
