from __future__ import print_function
import numpy as np
import cv2
import sys
import json


# setting up flags


def removeBg_rect(data):

    image_path = data["imagepath"]
    img = cv2.imread(image_path)
    img2 = img.copy()                               # a copy of original image
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    rect = data["rect"]
    if rect == [0, 0, 0, 0]:
        rect = [1, 1, img.shape[1], img.shape[0]]
    print(rect)
    output = np.zeros(img.shape, np.uint8)           # output image to be shown
    bgdmodel = np.zeros((1, 65), np.float64)
    fgdmodel = np.zeros((1, 65), np.float64)
    cv2.grabCut(img2, mask, rect, bgdmodel, fgdmodel, 1, cv2.GC_INIT_WITH_RECT)
    mask2 = np.where((mask == 1) + (mask == 3), 255, 0).astype('uint8')
    output = cv2.bitwise_and(img2, img2, mask=mask2)
    # input and output windows
    # cv2.namedWindow('output', cv2.WINDOW_NORMAL)
    # cv2.namedWindow('input', cv2.WINDOW_NORMAL)
    # cv2.imshow('input', img)
    # cv2.imshow('output', output)
    # print(mask2.shape)
    # k = cv2.waitKey(0)
    cv2.imwrite(
        '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/uploads/temp.png', mask)
    cv2.imwrite(
        '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/uploads/output.png', output)
    return output

    # cv2.moveWindow('input', img.shape[1]+10, 90)
if __name__ == '__main__':
    inputData = ""
    data = sys.stdin
    # print(data)
    for line in data:

        inputData += line

        # print(jsonData)
    removeBg_rect(json.loads(line))
