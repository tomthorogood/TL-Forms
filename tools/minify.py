#!/usr/bin/env python
import os

os.chdir("../")
infile = "dev/tl_forms.js"
outfile = "min/tl_forms.js"

command = "java -jar tools/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -o %s %s" % (outfile, infile)
os.system(command)
