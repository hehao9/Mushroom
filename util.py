import codecs
import math
import random
from Crypto.Cipher import AES
import base64


def to_16(key):
    while len(key) % 16 != 0:
        key += '\0'
    return str.encode(key)


def aes_encrypt(text, key, iv):  # text为密文，key为公钥，iv为偏移量
    bs = AES.block_size
    pad2 = lambda s: s + (bs - len(s) % bs) * chr(bs - len(s) % bs)
    encryptor = AES.new(to_16(key), AES.MODE_CBC, to_16(iv))
    encrypt_aes = encryptor.encrypt(str.encode(pad2(text)))
    encrypt_text = str(base64.encodebytes(encrypt_aes), encoding='utf-8')
    return encrypt_text


def rsa_encrypt(text, key, modulus):
    text = text[::-1]
    rs = int(codecs.encode(text.encode('utf-8'), 'hex_codec'), 16) ** int(key, 16) % int(modulus, 16)
    return format(rs, 'x').zfill(256)


def sign():
    word_text = {
        'csrf_token': '',
        'hlposttag': '</span>',
        'hlpretag': '<span class="s-fc7">',
        'limit': '30',
        'offset': '0',
        's': '童话',
        'total': 'true',
        'type': '1',
    }
    e = '010001'
    f = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
    key = '0CoJUm6Qyw8W8jud'
    iv = '0102030405060708'

    ss = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    i = ''.join([ss[math.floor(random.random() * len(ss))] for i in range(16)])
    enc_text = aes_encrypt(aes_encrypt(str(word_text), key, iv), i, iv)
    print(enc_text)

    enc_sec_key = rsa_encrypt(i, e, f)
    print(enc_sec_key)


sign()