import fileinput
from typing import Tuple
from matplotlib.font_manager import json_dump
from skimage import exposure, img_as_ubyte
import os
import cv2
import sys
import io
import time
import glob
import shutil
import json
import base64
import numpy as np
from PIL import ImageFile
from PIL import Image
from io import BytesIO
from datetime import datetime
from collections import Counter
from sklearn.cluster import KMeans
import tensorflow as tf

ImageFile.LOAD_TRUNCATED_IMAGES = True

json_file = 'utils/json/test.json'
JSON_FOLDER = 'scripts/utils/json'
IMAGE_FOLDER = 'scripts/images'
OUTPUT_FOLDER = 'scripts/output'
REF_CC = 'scripts/utils/color_ref'
JSON_HISTORY = 'scripts/utils/json_history'
model = tf.keras.models.load_model(
    '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/scripts/unet_model_666_resnet1000_continue.h5', compile=False)
percentage = 0.90
imageFolder = IMAGE_FOLDER
outputFolder = OUTPUT_FOLDER


curr_dt = datetime.now().strftime("%m%d_%H%M")
sourceFile = imageFolder+"/argus_base.png"
save_dir = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/Images_After_Analyze/"


def _add_paddings(image: np.array) -> np.ndarray:
    img0 = image[:, :, 0]
    row = [0]*len(img0[0])
    for i in range(50):
        img0 = np.insert(img0, 0, values=row, axis=0)
        img0 = np.insert(img0, -1, values=row, axis=0)

    img1 = image[:, :, 1]
    for i in range(50):
        img1 = np.insert(img1, 0, values=row, axis=0)
        img1 = np.insert(img1, -1, values=row, axis=0)

    img2 = image[:, :, 2]
    for i in range(50):
        img2 = np.insert(img2, 0, values=row, axis=0)
        img2 = np.insert(img2, -1, values=row, axis=0)

    new_image = np.dstack((img0, img1, img2))
    return new_image


def text_properties(label: str, image: np.array, type: str) -> tuple:
    font = cv2.FONT_HERSHEY_SIMPLEX

    if image.shape[1] > 512:
        size = 1
        thickness = 1
    else:
        size = image.shape[1]/512
        thickness = 1

    image_height = image.shape[0]

    text_size = cv2.getTextSize(label, font, size, thickness)[0]

    if type == "corrosion":
        y = image_height - text_size[1]
        x = len(image[0])/2 - text_size[0]/2
    else:
        y = 10 + text_size[1]
        x = len(image[0])/2 - text_size[0]/2

    return (font, size, thickness, y, x)


def corrosion_analysis(data):
    base64_str = data['img']
    imgdata = base64.b64decode(str(base64_str))
    image = Image.open(BytesIO(imgdata))
    # image = cv2.resize(image, (256,256))
    if not os.path.exists(imageFolder):

        os.mkdir(imageFolder, 0o666)

    image.save(sourceFile)

    x_points = data["points"]

    all_points_x = []
    all_points_y = []
    all_points = []

    # Get x_points and y_points from json
    for i in range(len(x_points)):
        all_points_x.append(x_points[i].get('offsetX'))
        all_points_y.append(x_points[i].get('offsetY'))

    # Append x and y points into a list in (x, y) format
    for j, x in enumerate(all_points_x):
        all_points.append([x, all_points_y[j]])

    # convert the list which contains all points into an array
    arr = np.array(all_points)

    for imagePath in os.listdir(imageFolder):
        inputPath = os.path.join(imageFolder, imagePath)
        image = cv2.imread(inputPath)
        cv2.imwrite(save_dir+'image.png', image)

        original_image = cv2.imread(inputPath)
        h, w = image.shape[:2]
        width = round(w/32)*32
        height = round(h/32)*32
        image = cv2.resize(image, (width, height))
        original = image.copy()
        cv2.imwrite(save_dir+'original.png', original)

        original_image = cv2.resize(original_image, (width, height))
        mask = np.zeros((height, width))
        cv2.fillPoly(mask, [arr], color=(255))
        cv2.imwrite(save_dir+'mask.png', mask)

        # only keeping the cropped part and masking the rest of the image

        mask = 255 * mask
        # binary mask
        mask = mask.astype(np.uint8)

        crop = cv2.bitwise_and(original_image, original_image, mask=mask)
        cv2.imwrite(save_dir+'crop.png', crop)

        # getting total black pixels in the mask to further use it for percentage calculation

        getting_black_pixels = np.sum(mask == 0)

        curr_dt = datetime.now().strftime("%m%d_%H%M")
        outFile = "argus_.png"
        outputPath = os.path.join(outputFolder, outFile)

        # detecting total corrosion

        cropped_img = crop.copy()

        # converting the cropped image in BGR format


# chanage code from here
        """
        image = cv2.cvtColor(cropped_img, cv2.COLOR_RGB2BGR)
        # making an array of  corrosion ranges

        lower_ranges = [[50, 10, 1], [100, 20, 10],
                        [80, 20, 30], [149, 35, 70]]
        upper_ranges = [[170, 70, 50], [200, 100, 115],
                        [215, 90, 150], [255, 140, 150]]
        
        final_mask = 0
        masks = []
        for i in range(len(lower_ranges)):
            x = np.array(lower_ranges[i])
            y = np.array(upper_ranges[i])
            mask = cv2.inRange(image, x, y)
            masks.append(mask)
            final_mask = final_mask + mask

        # getting the corrosion on the asset using the final mask by performing bitwise_and operation
        output = cv2.bitwise_and(image, image, mask=final_mask)
        """
        image = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)
        test_img = np.array(image)

        test_input = np.expand_dims(test_img, axis=0)
        prediction3 = model.predict(test_input)
        prediction = prediction3.reshape((height, width))

        prediction1 = np.where(prediction >= 0.90, 1, 0)

        # Convert binary image to colour image
        prediction5 = prediction1 * 255
        prediction5 = prediction5.astype(np.uint8)
        final_mask = cv2.resize(prediction5, (width, height))
        final = cv2.bitwise_and(image, image, mask=final_mask)
        # find contours
        contours, hierarchy = cv2.findContours(
            final_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(image, contours, -1, (230, 159, 22), -1)
        s1 = cv2.addWeighted(image, 1.0, final, 1.0, 0.0)
        cv2.imwrite(save_dir+'s1.png', s1)
        s2 = cv2.cvtColor(s1, cv2.COLOR_RGB2BGR)
        cv2.imwrite(save_dir+'s2.png', s2)

        # looping through the array of ranges and creating a final mask of corrosion

        # edge detection using canny edge detecter

        edge_image = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2GRAY)
        edge_image = cv2.GaussianBlur(edge_image, (3, 3), 1)
        edge_images = cv2.Canny(edge_image, 100, 300)
        # changing the color space to BGR
        edge_image = cv2.cvtColor(edge_images, cv2.COLOR_GRAY2BGR)

        seg1 = edge_image + s2
        cv2.imwrite(save_dir+'seg1.png', seg1)

        seg = cv2.cvtColor(seg1, cv2.COLOR_BGR2RGB)
        cv2.imwrite(save_dir+'seg.png', seg)

        # calculating  percentage of corrosion on the asset area using the final_mask and the mask previously calculated
        # for getting the asset area

        corrosion_pixels = np.sum(final_mask != 0)
        black_pixels = np.sum(final_mask == 0)
        # getting total pixels on the asset
        total = (corrosion_pixels + black_pixels) - getting_black_pixels
        total_ = int(total)
        # taking ratio from above calculations for percentage
        value = (corrosion_pixels/total) * 100

        total_corr_perc = round(value, 2)

        # Adding Extra Padding to add text
        original_with_padding = _add_paddings(original)
        seg_with_padding = _add_paddings(seg)

        # defining font properies
        Corrosion_label = "Corrosion %% : %s" % str(total_corr_perc)

        font, size, thickness, y, x = text_properties(
            Corrosion_label, original_with_padding, "corrosion")

        cv2.putText(original_with_padding, Corrosion_label,
                    (int(x), int(y)), font, size, (0, 0, 0), thickness)
        cv2.putText(seg_with_padding, Corrosion_label,
                    (int(x), int(y)), font, size, (255, 255, 255), thickness)

        # Adding Labels to original image
        Image_Name = "Original Image"
        font, size, thickness, y, x = text_properties(
            Image_Name, original_with_padding, "Name")
        cv2.putText(original_with_padding, Image_Name,
                    (int(x), int(y)), font, size, (255, 255, 255), thickness)

        # Adding Labels to original image
        Image_Name = "Total Corrosion"
        font, size, thickness, y, x = text_properties(
            Image_Name, original_with_padding, "Name")
        cv2.putText(seg_with_padding, Image_Name, (int(x), int(y)),
                    font, size, (255, 255, 255), thickness)

        # merging the original and corrosion output

        display = np.hstack([original_with_padding, seg_with_padding])
        cv2.imwrite(save_dir+'display.png', display)

        # changing the data format

        im = Image.fromarray(display.astype("uint8"))
        R, G, B = im.split()
        im = Image.merge("RGB", (B, G, R))
        rawBytes = io.BytesIO()
        im.save(rawBytes, "PNG")

        rawBytes.seek(0)  # return to the start of the file

        img64 = base64.b64encode(rawBytes.read()).decode('utf8')

        # output to send to next python file

        result = {}
        # values going to be shown on frontend
        result["img"] = img64
        result["corrsion"] = total_corr_perc
        # values needs to be passed on for the severe corrosion

        print(json.dumps(result))

# this function deletes previously analyzed image


def remove_misc_file():
    changed_name = JSON_FOLDER+"/argus_"+curr_dt+".json"
    os.rename(json_file, changed_name)
    shutil.move(changed_name, JSON_HISTORY)

    for filename in os.listdir(imageFolder):
        file_path = os.path.join(imageFolder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)  # deletes the previous path
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


if __name__ == '__main__':
    inputData = ""
    data = sys.stdin
    # print(data)
    for line in data:

        inputData += line
    corrosion_analysis(json.loads(line))
