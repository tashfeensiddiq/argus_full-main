import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import cv2
import json
import sys
import openpyxl
import os


# def get_flag(name):
#     path = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/original/{}.png".format(
#         name.title())

#     im = cv2.imread(path)
#     im = cv2.resize(im, (96, 96))

#     return im


# def offset_image(coord, name, ax):
#     img = get_flag(name)

#     im = OffsetImage(img, zoom=0.4)

#     im.image.axes = ax

#     ab = AnnotationBbox(im, (coord, 0),  xybox=(0., -24.), frameon=False,
#                         xycoords='data',  boxcoords="offset points", pad=0)
#     ax.add_artist(ab)
def addlabels(x, y, flag):
    for i in range(len(x)):
        if (y[i] >= 50):
            plt.text(i, y[i], y[i], ha='center',
                     Bbox=dict(facecolor='red', alpha=.7))
            if (flag == 0):
                plt.vlines(x[i], 1, y[i], linestyles='dashed',
                           colors='red', alpha=.2)
            plt.gca().get_xticklabels()[i].set_color("red")

        if (y[i] < 50):
            plt.text(i, y[i], y[i], ha='center',
                     Bbox=dict(facecolor='green', alpha=.7))
            if (flag == 0):
                plt.vlines(x[i], 1, y[i], linestyles='dashed',
                           colors='green', alpha=.2)
            plt.gca().get_xticklabels()[i].set_color("green")


def compare(lst):

    lis = lst["imagePaths"]
    flag = lst["flag"]
    val = []
    data = {}
    name = []
    for i in range(len(dataFrame["filename"])):
        data.update({dataFrame["filename"][i]: dataFrame["calculated percentage"][i]})

    for i in range(len(lis)):
        val.append(data.get(lis[i]))

    fig, ax = plt.subplots()

    if (flag == "0"):
        plt.plot(lis, val, marker='o')
    if (flag == "1"):
        plt.bar(lis, val, width=0.5, align="center")

    # for i in range(len(lis)):
    #     name.append(os.path.splitext(lis[i][0]))

    ax.set_xticks(range(len(lis)))
    ax.set_xticklabels(lis)
    ax.tick_params(axis='x', which='major', pad=40)

    plt.ylim(0, 100)
    plt.xticks(rotation=90)
    # for i in range(len(lis)):

    #     offset_image(i, lis[i], ax)
    for i in range(len(lis)):

        path = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/original/{}".format(
            lis[i].title())
        im = plt.imread(path, 0)
        im = cv2.resize(im, (96, 96))
        im = OffsetImage(im, zoom=0.4)
        im.image.axes = ax
        ab = AnnotationBbox(im, (i, 0), xybox=(0., -24.), frameon=False,
                            xycoords='data', boxcoords="offset points", pad=0)
        ax.add_artist(ab)
    addlabels(lis, val, flag)
    plt.tight_layout()
    plt.savefig(
        '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/datasheet/compare.png')

# plt.show()


dataFrame = pd.read_excel(
    '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/datasheet/demo.xlsx',
    engine='openpyxl')
# compare(['img1', 'img2', 'img7']);

if __name__ == '__main__':
    inputData = ""
    data = sys.stdin
    # print(data)
    for line in data:

        inputData += line

        # print(jsonData)
    compare(json.loads(line))
