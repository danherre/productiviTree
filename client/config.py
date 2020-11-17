import os
import json
from google.cloud import storage

# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = '/'

# Secret key for encrypting cookies
SECRET_KEY = (b'<\x91\xfd\xb1\xcc\xbf\xbc&\x99\xf5\xf2\xd6\xaag7\xdf}h\xb0\xe4'
              b'\xc32\xbex')
SESSION_COOKIE_NAME = 'login'