import cv2
import numpy as np
import os
import tensorflow as tf
import segmentation_models as sm
# import time

prediction_time = []
font = cv2.FONT_HERSHEY_COMPLEX
preprocess_input = sm.get_preprocessing('resnet101')
m1 = tf.keras.models.load_model(
    '/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/scripts/unet_model_666_resnet1000_continue.h5', compile=False)


def folder_process(original_dir):

    save_dir = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/Images_After_Analyze/"

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
            width = round(img.shape[1]/32)*32
            height = round(img.shape[0]/32)*32
            if (width < 512) or (height < 512):
                width = 512
                height = 512
            if (width > 1056) or (height > 1056):
                width = 1056
                height = 1056
            frame = cv2.resize(img, (width, height))
            p_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            test_img = np.array(p_frame)

            test_input = np.expand_dims(test_img, axis=0)
            prediction3 = m1.predict(test_input)
            prediction = prediction3.reshape((height, width))

            prediction1 = np.where(prediction < 0.8, 0, 1)

            # Convert binary image to colour image
            prediction5 = prediction1 * 255
            prediction5 = prediction5.astype(np.uint8)
            final = cv2.bitwise_and(frame, frame, mask=prediction5)
            # find contours
            contours, hierarchy = cv2.findContours(
                prediction5, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            cv2.drawContours(frame, contours, -1, (230, 159, 22), -1)
            s1 = cv2.addWeighted(frame, 1.0, final, 1.0, 0.0)

            cv2.imwrite(save_dir+'processed '+file, s1)


path = "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/Images_To_Analyze/"
folder_process(path)
