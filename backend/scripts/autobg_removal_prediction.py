import cv2
import numpy as np
import os
import tensorflow as tf
import segmentation_models as sm
import math
import glob
import pandas
import openpyxl
import matplotlib.pyplot as plt
import time
import datetime
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
filename = list()
image_address = list()

predictions = list()

prediction_time = []
font = cv2.FONT_HERSHEY_COMPLEX
preprocess_input = sm.get_preprocessing('vgg16')
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent / "models" / "vgg16_uNET_e100_2757_0.20_0_b45_.0001lr_rgb_96.h5"
m1 = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
# m1 = tf.keras.models.load_model(
#     '/home/app/scripts/unet_model_666_resnet1000_continue.h5', compile=False)

org = (50, 250)

color = (0, 0, 255)

font = cv2.FONT_HERSHEY_SIMPLEX
alpha = 1.5  # Contrast control (1.0-3.0)
beta = 0  # Brightness control (0-100)
kernel = np.ones((5, 5), np.uint8)


def folder_process(original_dir):
    save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/"

    # save_dir = "/home/app/bg_images/"

    
    completed = 0
    for file in os.listdir(original_dir):
        

        if file.endswith('.png') or file.endswith('.jpg') or file.endswith('.jpeg'):
            img = cv2.imread(original_dir+file, cv2.IMREAD_COLOR)
            filename.append(file)
            image_address.append("http://localhost:4000/folders/image/" + file)

            FONT_SCALE = 2e-3  # Adjust for larger font size in all images
            THICKNESS_SCALE = 1e-3  # Adjust for larger thickness in all images
            height, width, _ = img.shape
            font_scale = min(width, height) * FONT_SCALE
            thickness = math.ceil(min(width, height) * THICKNESS_SCALE)
            test_img_org = img.copy()
            # width = 256
            # height = 256
            width = round(img.shape[1]/32)*32
            height = round(img.shape[0]/32)*32
            if (width < 512):
                width = 640
            if (width > 1536):
                width = 1024
            if (height < 512):
                height = 352
            if (height > 1536):
                height = 1024
            frame = cv2.resize(img, (width, height))
            output = frame.copy()
            blackblankimage = np.zeros(
                shape=[frame.shape[0], frame.shape[1]], dtype=np.uint8)

            # Display original image
            #cv2.imshow('Original', frame)
            # cv2.waitKey(0)

            # Convert to graycsale
            img_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Blur the image for better edge detection
            img_blur = cv2.bilateralFilter(img_gray, 7, 75, 75)

            # Canny Edge Detection
            edges = cv2.Canny(image=img_blur, threshold1=10,
                              threshold2=80)  # Canny Edge Detection
            dilation = cv2.dilate(edges, kernel, iterations=1)
            # Display Canny Edge Detection Image

            contours, hierarchy = cv2.findContours(
                dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

            # find the biggest area of the contour
            c = max(contours, key=cv2.contourArea)
            total = cv2.contourArea(c)
            c = cv2.fillPoly(blackblankimage, pts=[c], color=(255, 255, 255))


            bg_final = cv2.bitwise_and(output, output, mask=blackblankimage)

            # Enhancement pipeline
            bg_final = cv2.bilateralFilter(bg_final, 7, 75, 75)

            gamma = 1.2
            invGamma = 1.0 / gamma
            table = np.array([((i / 255.0) ** invGamma) * 255 for i in np.arange(256)]).astype("uint8")
            bg_final = cv2.LUT(bg_final, table)

            lab = cv2.cvtColor(bg_final, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            l = clahe.apply(l)
            lab = cv2.merge((l, a, b))
            bg_final = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

            sharpen_kernel = np.array([[-1,-1,-1],[-1,9,-1],[-1,-1,-1]])
            bg_final = cv2.filter2D(bg_final, -1, sharpen_kernel)

            p_frame = cv2.cvtColor(bg_final, cv2.COLOR_BGR2RGB)


            #test_img = np.array(p_frame)
            p_frame = preprocess_input(p_frame)
            test_input = np.expand_dims(p_frame, axis=0)
            prediction3 = m1.predict(test_input, verbose=0)
            prediction = prediction3.reshape((height, width))

            THRESHOLD = 0.65
            prediction1 = np.where(prediction >= THRESHOLD, 1, 0)
            # re_mask = cv2.resize(
            #     prediction1, (test_img_org.shape[1], test_img_org.shape[0]))
            # Convert binary image to colour image
            prediction5 = prediction1 * 255
            prediction5 = prediction5.astype(np.uint8)

            morph_kernel = np.ones((3,3), np.uint8)
            prediction5 = cv2.morphologyEx(prediction5, cv2.MORPH_OPEN, morph_kernel)
            prediction5 = cv2.morphologyEx(prediction5, cv2.MORPH_CLOSE, morph_kernel)
            prediction5 = cv2.bitwise_and(c, c, mask=prediction5)
            contours, hierarchy = cv2.findContours(
                prediction5, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            per = 0

            for i in range(len(contours)):
                per = per + cv2.contourArea(contours[i])

            p = cv2.resize(
                prediction5, (test_img_org.shape[1], test_img_org.shape[0]))

            bg_final = cv2.resize(
                bg_final, (test_img_org.shape[1], test_img_org.shape[0]))

            final = cv2.bitwise_and(test_img_org, test_img_org, mask=p)
            # find contours
            contours, hierarchy = cv2.findContours(
                p, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            img = bg_final.copy()
            cv2.drawContours(img, contours, -1, (230, 159, 22), -1)
            s1 = cv2.addWeighted(img, 1.0, final, 1.0, 0.0)
            percentage = (per/total)*100
            s1 = cv2.putText(s1, 'Percentage : {:.2f}'.format(
                percentage), org, font, font_scale, color, thickness, cv2.LINE_AA)
            numpy_horizontal = np.hstack((test_img_org, bg_final, s1))
            predictions.append(round(percentage, 2))

            # background removal
            # print()
            cv2.imwrite(save_dir+'/bg_path/'+file, bg_final)
            cv2.imwrite(save_dir+'/calculated/with_background_analyzed_'+file, numpy_horizontal)  # corrosion detected
  # corrosion detected
            cv2.imwrite(save_dir+'/original/'+file, test_img_org)  # original
            cv2.imwrite(save_dir+'/mask/'+file, prediction1)
            cv2.imwrite(save_dir+'/mask/dilation_'+file, c)
            total_time = time.time()-start
            completed = completed + 1
            remaning = ((len(os.listdir(path)))-completed)
            total_time = time.time()-start
            remaning_time = round((remaning*total_time)/completed,2)
            print(datetime.timedelta(seconds=remaning_time))

path = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/Images_To_Analyze/"
# path = "/home/app/Images_To_Analyze/"


save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/"
# save_dir = "/home/app/bg_images/"


start = time.time()
folder_process(path)

df = pandas.DataFrame([filename,image_address, predictions], index=[
                      "Image", "image_logo","Calculated_Percentage"])

df = df.T
plt.plot(df["Image"], df["Calculated_Percentage"])
plt.savefig(save_dir+'/datasheet/graph.png')
df.to_excel(save_dir+'/calculated/demo.xlsx', sheet_name='datapercentage')
df.to_excel(save_dir+'/datasheet/demo.xlsx', sheet_name='datapercentage')

