#!/usr/bin/env python
import os

os.chdir('../')
filetype = ".js"

classes = [
        "base",
        "Form",
        "Element",
        "Field_Group",
        "Validator",
        "Form_Widget"
        ]

try:
    os.system('rm dev/tl_forms.js')
    os.system('touch dev/tl_forms.js')
except:
    os.system('mkdir dev')
    os.system('touch dev/tl_forms.js')

for f in classes:
    name = f+filetype
    command = "cat src/%s >> dev/tl_forms.js" % (name)
    os.system(command)

