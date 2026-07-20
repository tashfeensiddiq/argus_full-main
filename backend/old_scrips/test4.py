import sys
import json
import time
import cv2
import numpy as np
import os
from PIL import Image
from numpy import asarray
import tensorflow as tf
from keras.models import load_model
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
import segmentation_models as sm
prediction_time = []

org = (50, 50)
fontScale = 1
color = (255, 0, 0)
thickness = 1
font = cv2.FONT_HERSHEY_SIMPLEX
preprocess_input = sm.get_preprocessing('resnet101')
m1 = tf.keras.models.load_model(
    '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/scripts/new_unet_model_e400.h5', compile=False)
font = cv2.FONT_HERSHEY_SIMPLEX


def folder_process(original_dir):

    save_dir = original_dir

    for file in os.listdir(original_dir):
        if file.endswith('.mp4'):
            video_f = 0
            i = 1
            vid = cv2.VideoCapture(original_dir+file)
            frame_width = 256
            frame_height = 256
            fps = vid.get(cv2.CAP_PROP_FPS)
            mask_shape = (256, 256)
            out_vid = cv2.VideoWriter(save_dir+'processed_1'+file, cv2.VideoWriter_fourcc(
                'M', 'J', 'P', 'G'), fps, (2*frame_width, frame_height))
            if (vid.isOpened() == False):
                print("Error opening video file")

            while (vid.isOpened()):
                ret, frame = vid.read()
                if ret == True:

                    # Display the resulting frame
                    frame = cv2.resize(frame, (256, 256))
                    p_frame = cv2.cvtColor(
                        frame, cv2.COLOR_BGR2RGB)
                    test_img = np.array(p_frame)

                    test_input = np.expand_dims(test_img, axis=0)
                    prediction3 = m1.predict(test_input)
                    prediction = prediction3.reshape(mask_shape)

                    prediction1 = np.where(
                        prediction < 0.8, 0, prediction)
                    prediction1 = np.where(
                        prediction >= 0.8, 1, prediction)

                    # Convert binary image to colour image
                    prediction5 = prediction1 * 255
                    prediction5 = prediction5.astype(np.uint8)
                    final = cv2.bitwise_and(
                        frame, frame, mask=prediction5)
                    # find contours
                    contours, hierarchy = cv2.findContours(
                        prediction5, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
                    cv2.drawContours(
                        frame, contours, -1, (0, 255, 0), 1)
                    numpy_horizontal = np.hstack((frame, final))
                    print(i)
                    i = i+1
                    video_f = video_f+1
                    out_vid.write(numpy_horizontal)

                else:
                    break

        if file.endswith('.png') or file.endswith('.jpg') or file.endswith('.jpeg'):
            img = cv2.imread(original_dir+file, cv2.IMREAD_COLOR)
            frame = cv2.resize(img, (256, 256))
            p_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            test_img = np.array(p_frame)

            test_input = np.expand_dims(test_img, axis=0)
            prediction3 = m1.predict(test_input)
            prediction = prediction3.reshape((256, 256))

            prediction1 = np.where(prediction < 0.9, 0, prediction)
            prediction1 = np.where(prediction >= 0.9, 1, prediction)

            # Convert binary image to colour image
            prediction5 = prediction1 * 255
            prediction5 = prediction5.astype(np.uint8)
            final = cv2.bitwise_and(frame, frame, mask=prediction5)
            # find contours
            contours, hierarchy = cv2.findContours(
                prediction5, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            cv2.drawContours(frame, contours, -1, (0, 255, 0), 1)
            numpy_horizontal = np.hstack((frame, final))
            cv2.imwrite(save_dir+'processed '+file, numpy_horizontal)


path = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/uploads/"
folder_process(path)
