import cv2
import numpy as np
import os
import tensorflow as tf
# import segmentation_models as sm
import sys
import json
import math
import pandas as pd
import matplotlib.pyplot as plt
import openpyxl


BACKBONE = 'resnet101'
# preprocess_input = sm.get_preprocessing(BACKBONE)
m1 = tf.keras.models.load_model(
    '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/scripts/unet_model_666_resnet1000_continue.h5', compile=False)

# original_dir #"C:/Users/patel/Desktop/p/test_images/orig/old_model/1000_0/"
# save_dir = "C:/Users/deepm/Desktop/bg/output/bg_removed/"
# bg_path = "bg_images/"
# calculated = "calculated/"
org = (50, 250)
fontScale = 2
color = (0, 0, 255)
thickness = 4
font = cv2.FONT_HERSHEY_SIMPLEX
alpha = 1.5  # Contrast control (1.0-3.0)
beta = 0  # Brightness control (0-100)
kernel = np.ones((5, 5), np.uint8)


def bg_image_process(data):
    save_dir = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/"

    image_path = data["imagePath"]
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)

    head, tail = os.path.split(image_path)

    FONT_SCALE = 2e-3  # Adjust for larger font size in all images
    THICKNESS_SCALE = 1e-3  # Adjust for larger thickness in all images
    height, width, _ = img.shape
    font_scale = min(width, height) * FONT_SCALE
    thickness = math.ceil(min(width, height) * THICKNESS_SCALE)

    test_img_org = img.copy()
    width = 1024  # round(img.shape[1]/32)*32
    height = 1024  # round(img.shape[0]/32)*32
    """if (width < 512) or (height < 512):
        width = 640
        height = 352
    if (width > 1536) or (height > 1536):
        width = 1536
        height = 1536"""
    frame = cv2.resize(img, (width, height))
    output = frame.copy()
    mask = cv2.imread(
        '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/mask/' + tail)
    mask = cv2.resize(mask, (width, height))
    mask = np.where((mask == 1) + (mask == 3), 255, 0).astype('uint8')
    mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    # Display Canny Edge Detection Image

    contours, hierarchy = cv2.findContours(
        mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    total = 0
    for i in range(len(contours)):
        total = total + cv2.contourArea(contours[i])

        # find the biggest area of the contour
        # c = max(contours, key=cv2.contourArea)
        # total = cv2.contourArea(c)
        # c = cv2.fillPoly(mask, pts=[c], color=(255, 255, 255))

    bg_final = cv2.bitwise_and(output, output, mask=mask)
    p_frame = cv2.cvtColor(bg_final, cv2.COLOR_RGB2BGR)

    test_img = np.array(p_frame)
    # p_frame = preprocess_input(p_frame)
    test_input = np.expand_dims(test_img, axis=0)
    prediction3 = m1.predict(test_input)
    prediction = prediction3.reshape((height, width))

    prediction1 = np.where(prediction >= 0.40, 1, 0)

    # Convert binary image to colour image
    prediction5 = prediction1 * 255
    prediction5 = prediction5.astype(np.uint8)
    prediction5 = cv2.bitwise_and(mask, mask, mask=prediction5)
    contours, hierarchy = cv2.findContours(
        prediction5, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    per = 0
    for i in range(len(contours)):
        per = per + cv2.contourArea(contours[i])

    p = cv2.resize(prediction5, (test_img_org.shape[1], test_img_org.shape[0]))
    bg_final = cv2.resize(
        bg_final, (test_img_org.shape[1], test_img_org.shape[0]))

    final = cv2.bitwise_and(test_img_org, test_img_org, mask=p)
    # find contours
    contours, hierarchy = cv2.findContours(
        p, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    img = bg_final.copy()
    cv2.drawContours(img, contours, -1, (230, 159, 22), -1)
    s1 = cv2.addWeighted(img, 1.0, final, 1.0, 0.0)
    if total == 0:
        percentage = 0
    else:
        percentage = (per/total)*100
    percentage = round(percentage, 2)
    s1 = cv2.putText(s1, 'Percentage : {:.2f}'.format(
        percentage), org, font, font_scale, color, thickness, cv2.LINE_AA)
    numpy_horizontal = np.hstack((test_img_org, bg_final, s1))
    # try:
    #     os.remove(
    #         '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/uploads/temp.png')

    # except:
    #     pass
    cv2.imwrite(save_dir+'/calculated/'+tail, s1)
    dataFrame = pd.read_excel(
        save_dir+'/datasheet/demo.xlsx', engine='openpyxl')


# dataFrame = pd.DataFrame([filename, predictions], index=[
#     "filename", "calculated percentage"])
    dataFrame.loc[dataFrame['filename'] == tail,
                  "calculated percentage"] = percentage

    # dataFrame = dataFrame.reset_index(drop=True, inplace=True)
    dataFrame.to_excel(save_dir+'/datasheet/demo.xlsx',
                       sheet_name='datapercentage', index=False)


if __name__ == '__main__':
    inputData = ""
    data = sys.stdin
    # print(data)
    for line in data:

        inputData += line

    bg_image_process(json.loads(line))
