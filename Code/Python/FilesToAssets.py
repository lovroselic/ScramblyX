# -*- coding: utf-8 -*-
"""
Created on Mon Sep 20 14:51:00 2021

@author: lovro
@version 0.3.0
"""
from os.path import join
from glob import glob

# Directory = 'C:/Users/lovro/OneDrive/Pictures/Games Screens/Done'
# Directory = 'C:/Users/lovro/OneDrive/Pictures/Games Screens/Done_decals'
# Directory = 'C:/Users/lovro/OneDrive/Pictures/Games Screens/Gates'

# Prefix = ''

Directory = 'C:/Users/lovro/OneDrive/Documents/JS/Scramblyx/Assets/Graphics/Sprites/Rotated'
# Directory = 'C:/Users/lovro/OneDrive/Documents/JS/Scramblyx/Assets/Graphics/Textures/Wall'
# Prefix = 'Items/'
# Prefix = 'Wall/'
Prefix = ''
files = []
ext = ['*.png', '*.jpg']
rotate = "rotate: { first: -30, last: 30, step: 1 } "
# template = '{ srcName: {}, name: {} },\n'

for e in ext:
    files.extend(glob(join(Directory, e)))

files = sorted([f.split('\\')[1] for f in files])
# assets = [f'{{ srcName: "{Prefix}{f}", name: "{f.split(".")[0]}"}},' for f in files]
assets = [f'{{ srcName: "{Prefix}{f}", name: "{f.split(".")[0]}", {rotate} }},' for f in files]
assetText = "\n".join(assets)
nameText = ",".join([f'"{f.split(".")[0]}"' for f in files])
