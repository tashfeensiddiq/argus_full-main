import cv2
import numpy as np
import os
import tensorflow as tf
import segmentation_models as sm
import math
import pandas
import matplotlib.pyplot as plt
import time
import datetime
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
filename = list()
predictions = list()

prediction_time = []
font = cv2.FONT_HERSHEY_COMPLEX
preprocess_input = sm.get_preprocessing('resnet101')
m1 = tf.keras.models.load_model(
    'C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/scripts/unet_model_666_resnet1000_continue.h5', compile=False)
org = (50, 250)

color = (0, 0, 255)

font = cv2.FONT_HERSHEY_SIMPLEX
alpha = 1.5  # Contrast control (1.0-3.0)
beta = 0  # Brightness control (0-100)
kernel = np.ones((5, 5), np.uint8)


def folder_process(original_dir):
    save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/"
    completed = 0
    for file in os.listdir(original_dir):
        if file.endswith('.mp4') or file.endswith('.avi'):

            i = 1
            vid = cv2.VideoCapture(original_dir+file)
            frame_width = round(vid.get(3)/32)*32
            frame_height = round(vid.get(4)/32)*32
            if (frame_width < 512) or (frame_height < 512):
                frame_width = 512
                frame_height = 512
            if (frame_width > 1056) or (frame_height > 1056):
                frame_width = 1056
                frame_height = 1056
            fps = vid.get(cv2.CAP_PROP_FPS)

            out_vid = cv2.VideoWriter(save_dir+'processed_1'+file, cv2.VideoWriter_fourcc(
                *'DIVX'), fps, (frame_width, frame_height))
            if (vid.isOpened() == False):
                print("Error opening video file")

            while (vid.isOpened()):
                ret, frame = vid.read()
                mask_shape = (frame_height, frame_width)
                if ret == True:

                    # Display the resulting frame
                    frame = cv2.resize(frame, (frame_width, frame_height))
                    p_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    test_img = np.array(p_frame)
                    # st = time.time()

                    test_input = np.expand_dims(test_img, axis=0)
                    prediction3 = m1.predict(test_input)
                    prediction = prediction3.reshape(mask_shape)

                    prediction1 = np.where(prediction < 0.8, 0, 1)

                    # Convert binary image to colour image
                    prediction5 = prediction1 * 255
                    prediction5 = prediction5.astype(np.uint8)
                    # et = time.time()
                    final = cv2.bitwise_and(frame, frame, mask=prediction5)
                    # find contours
                    contours, hierarchy = cv2.findContours(
                        prediction5, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
                    cv2.drawContours(frame, contours, -1, (230, 159, 22), -1)
                    s1 = cv2.addWeighted(frame, 1.0, final, 1.0, 0.0)
                    # print(i)
                    i = i+1
                    # cv2.putText(final, str(et-st), (100, 100),
                    #             font, 3, (255, 0, 0), 2, cv2.LINE_AA)
                    # cv2.imwrite(save_dir+'processed_'+str(i)+'.png', final)

                    out_vid.write(s1)

                else:
                    break

        if file.endswith('.png') or file.endswith('.jpg') or file.endswith('.jpeg'):
            img = cv2.imread(original_dir+file, cv2.IMREAD_COLOR)
            filename.append(file)
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
            if (width < 512) or (height < 512):
                width = 512
                height = 512
            if (width > 1056) or (height > 1056):
                width = 1056
                height = 1056
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
            img_blur = cv2.GaussianBlur(img_gray, (3, 3), 0)

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
            p_frame = cv2.cvtColor(bg_final, cv2.COLOR_RGB2BGR)

            test_img = np.array(p_frame)
            p_frame = preprocess_input(p_frame)
            test_input = np.expand_dims(test_img, axis=0)
            prediction3 = m1.predict(test_input)
            prediction = prediction3.reshape((height, width))

            prediction1 = np.where(prediction >= 0.70, 1, 0)
            # re_mask = cv2.resize(
            #     prediction1, (test_img_org.shape[1], test_img_org.shape[0]))
            # Convert binary image to colour image
            prediction5 = prediction1 * 255
            prediction5 = prediction5.astype(np.uint8)
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
            cv2.imwrite(save_dir+'/bg_path/'+file, bg_final)
            cv2.imwrite(save_dir+'/calculated/'+file, numpy_horizontal)  # corrosion detected
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
save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/"

start = time.time()
folder_process(path)
df = pandas.DataFrame([filename, predictions], index=[
                      "Image", "Calculated_Percentage"])
df = df.T
plt.plot(df["Image"], df["Calculated_Percentage"])
plt.savefig(save_dir+'/datasheet/graph.png')
df.to_excel(save_dir+'/calculated/demo.xlsx', sheet_name='datapercentage')
df.to_excel(save_dir+'/datasheet/demo.xlsx', sheet_name='datapercentage')

