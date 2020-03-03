#!/usr/bin/python3

import os

with open("next.config.js", "w") as file_obj:
    file_obj.write("module.exports = {{ env: {{ apiUrl: \'{}\', monthStartDay: {} }}}};".format(os.environ.get("API_URL"), os.environ.get("MONTH_START_DAY")))
