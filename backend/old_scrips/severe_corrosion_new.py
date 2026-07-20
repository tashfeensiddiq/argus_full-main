import fileinput
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
ImageFile.LOAD_TRUNCATED_IMAGES = True

json_file = 'utils/json/test.json'
JSON_FOLDER = 'scripts/utils/json'
IMAGE_FOLDER = 'scripts/images'
OUTPUT_FOLDER = 'scripts/output'
REF_CC = 'scripts/utils/color_ref'
JSON_HISTORY = 'scripts/utils/json_history'


imageFolder = IMAGE_FOLDER
outputFolder = OUTPUT_FOLDER


#curr_dt = datetime.now().strftime("%m%d_%H%M")
#sourceFile = imageFolder+"/argus_base.png"
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

    # text_size = cv2.getTextSize(label, font, 1, 2)[0]
    text_size = cv2.getTextSize(label, font, size, thickness)[0]

    if type == "corrosion":
        y = image_height - text_size[1]
        x = len(image[0])/2 - text_size[0]/2
    else:
        y = 10 + text_size[1]
        x = len(image[0])/2 - text_size[0]/2

    return (font, size, thickness, y, x)


def corrosion_analysis(data):

    # with open("D:/QualiTEAS/Codes/test2_sever.json", "w+") as f:
    #     json.dump(data, f)
    base64_str = data['img']  # reads the output from new_method.py
    imgdata = base64.b64decode(str(base64_str))
    # im_arr is one-dim Numpy array
    im_arr = np.frombuffer(imgdata, dtype=np.uint8)
    # used opencv function

    img = cv2.imdecode(im_arr, flags=cv2.IMREAD_ANYCOLOR)
    # retriving the total pixels on the corrosion asset from the first new_method.py file
    # img = cv2.resize(img, (256,256))
    total_pixels = data['pixels']

    img2 = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # reading the edges;
    base64_str_edges = data['edges']  # reads the output from new_method.py
    imgdata_edges = base64.b64decode(str(base64_str_edges))
    # im_arr is one-dim Numpy array
    im_arr_edges = np.frombuffer(imgdata_edges, dtype=np.uint8)
    # used opencv function

    img_edges = cv2.imdecode(im_arr_edges, flags=cv2.IMREAD_ANYCOLOR)
    edge_img = cv2.cvtColor(img_edges, cv2.COLOR_RGB2BGR)

    # k means clustering for severe corrosion deteciton

    # converting image obtained from previous python file to HSV
    filtered_img = cv2.cvtColor(img2, cv2.COLOR_BGR2HSV)
    pixel_values = filtered_img.reshape((-1, 3))
    pixel_values = np.float32(pixel_values)

    start = time.time()

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    k = 6
    _, labels, (centers) = cv2.kmeans(pixel_values, k, None,
                                      criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centers = np.uint8(centers)
    labels = labels.flatten()

    # k = 200
    # iterations = 50
    # # np.random.seed(1234)
    # # print(filtered_img.shape)
    # kmeans = faiss.Kmeans(
    #     pixel_values.shape[1], k=k, niter=iterations, nredo=1)
    # kmeans.train(pixel_values)
    # d, labels = kmeans.index.search(pixel_values, 1)
    # centers = np.uint8(kmeans.centroids)

    end = time.time()

    run_time = str(end-start)

    segmented_image = centers[labels]
    segmented_image = segmented_image.reshape(filtered_img.shape)

    # making an array of ranges for severe corrosion detection

    lower_ranges = [[95, 40, 91], [95, 40, 61], [100, 70, 71], [95, 40, 61]]
    upper_ranges = [[220, 165, 107], [220, 165, 165],
                    [220, 165, 147], [220, 165, 147]]

    # taking the segmented output from k-means and then passing them to array of ranges to get severe corrosion mask
    mask_sev = 0
    for i in range(len(lower_ranges)):
        x = np.array(lower_ranges[i])
        y = np.array(upper_ranges[i])
        mask = cv2.inRange(segmented_image, x, y)
        mask_sev = mask_sev + mask
        # getting the output from original image

    output = cv2.bitwise_and(img2, img2, mask=mask_sev)
    #output_image = cv2.cvtColor(output, cv2.COLOR_BGR2RGB)

    # performing canny edge detection
    edge_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edge_image = cv2.GaussianBlur(edge_image, (3, 3), 1)
    edge_image = cv2.Canny(edge_image, 100, 300)
    # chaning the color space to BGR
    edge_image = cv2.cvtColor(edge_image, cv2.COLOR_GRAY2BGR)
    # getting final output
    seg1 = edge_img + output

    seg = cv2.cvtColor(seg1, cv2.COLOR_BGR2RGB)

    # calculating percentage, we use the mask_sev i.e. binary mask and take the severe pixels which are not zero

    severe_corrosion_pixels = np.sum(mask_sev != 0)

    # calculating percentage by using total_pixels retrived from previous file
    value = (severe_corrosion_pixels/total_pixels) * 100
    total_corr_sev_perc = round(value, 2)
    total_corr_per = data['totalCorrosion']

    # Adding Extra Padding to add text
    original_with_padding = _add_paddings(img)
    seg_with_padding = _add_paddings(seg)

    # defining font properies
    Corrosion_Label = "Total Corrosion %% : %s" % str(total_corr_per)
    font, size, thickness, y, x = text_properties(
        Corrosion_Label, original_with_padding, "corrosion")
    cv2.putText(original_with_padding, Corrosion_Label,
                (int(x), int(y)), font, size, (255, 255, 255), thickness)

    Corrosion_Label = "Severe Corrosion %% : %s" % str(
        total_corr_sev_perc)
    font, size, thickness, y, x = text_properties(
        Corrosion_Label, original_with_padding, "corrosion")
    cv2.putText(seg_with_padding, Corrosion_Label, (int(x), int(y)),
                font, size, (255, 255, 255), thickness)

    # Adding Labels to severe corrosion image
    Image_Name = "Total Corrosion"
    font, size, thickness, y, x = text_properties(
        Image_Name, original_with_padding, "Name")
    cv2.putText(original_with_padding, Image_Name, (int(x), int(y)),
                font, size, (255, 255, 255), thickness)

    Image_Name = "Severe Corrosion"
    # Image_Name = run_time
    font, size, thickness, y, x = text_properties(Image_Name, seg, "Name")
    cv2.putText(seg_with_padding, Image_Name, (int(x), int(y)),
                font, size, (255, 255, 255), thickness)

    display = np.hstack([original_with_padding, seg_with_padding])

    # making the image in json format
    im = Image.fromarray(display.astype("uint8"))
    R, G, B = im.split()
    im = Image.merge("RGB", (B, G, R))
    rawBytes = io.BytesIO()
    im.save(rawBytes, "PNG")
    rawBytes.seek(0)  # return to the start of the file
    img64 = base64.b64encode(rawBytes.read()).decode('utf8')

    # creating a dictonary to pass it to frontend
    result = {}
    result["img"] = img64
    result["corrsion"] = total_corr_sev_perc

    print(json.dumps(result))


'''def remove_misc_file():
    changed_name = JSON_FOLDER+"/argus_"+curr_dt+".json"
    os.rename(json_file, changed_name)
    shutil.move(changed_name, JSON_HISTORY)
    
    for filename in os.listdir(imageFolder):
        file_path = os.path.join(imageFolder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
                print('Failed to delete %s. Reason: %s' % (file_path, e))'''


if __name__ == '__main__':
    inputData = ""
    for line in sys.stdin:
        inputData += line
    corrosion_analysis(json.loads(line))
