from __future__ import print_function
import numpy as np
import cv2
import sys
import json
import os


def removeBg_line(data):
    save_dir = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/"

    image_path = data["imagepath"]
    head, tail = os.path.split(image_path)
    # print(head)

    img = cv2.imread(image_path)
    img2 = img.copy()                               # a copy of original image
    # mask initialized to PR_BG
    mask = cv2.imread(
        '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/mask/' + tail)
    mask = cv2.resize(
        mask, (img.shape[1], img.shape[0]))
    rect = data["backGround"]
    rect1 = data["foreGround"]
    output = np.zeros(img.shape, np.uint8)           # output image to be shown
    bgdmodel = np.zeros((1, 65), np.float64)
    fgdmodel = np.zeros((1, 65), np.float64)

    mask2 = np.zeros(img.shape[:2], dtype=np.uint8)
    mask3 = np.zeros(img.shape[:2], dtype=np.uint8)

    if len(rect) >= 1:
        for point in rect:
            cv2.circle(mask2, tuple(point), 10, (255, 255, 255), -1)
        mask_1 = np.where((mask2 > 10), 1, 0).astype('uint8')
    else:
        mask_1 = np.zeros(img.shape[:2], dtype=np.uint8)
    if mask_1.ndim == 2:
        mask_1 = np.expand_dims(mask_1, axis=2)
    if len(rect1) >= 1:
        for point in rect1:
            cv2.circle(mask3, tuple(point), 10, (255, 255, 255), -1)
        mask3 = np.where((mask3 > 10), 1, 0).astype('uint8')

    if mask3.ndim == 2:
        mask3 = np.expand_dims(mask3, axis=2)

    final_mask = np.where((mask_1 == 1), 0, mask).astype('uint8')
    final_mask = np.where((mask3 == 1), 1, final_mask).astype('uint8')

    mask1 = np.array(final_mask[:, :, 2])
    cv2.grabCut(img2, mask1, None, bgdmodel,
                fgdmodel, 1, cv2.GC_INIT_WITH_MASK)
    mask4 = np.where((mask1 == 1) + (mask1 == 3), 255, 0).astype('uint8')
    output = cv2.bitwise_and(img2, img2, mask=mask4)
    cv2.imwrite(save_dir+'/bg_path/'+tail, output)
    cv2.imwrite(save_dir+'/mask/'+tail, mask1)  # corrosion detected
    # original    return output, mask2

    # cv2.moveWindow('input', img.shape[1]+10, 90)


if __name__ == '__main__':
    inputData = ""
    data = sys.stdin
    # print(data)
    for line in data:

        inputData += line

        # print(jsonData)
    removeBg_line(json.loads(line))
