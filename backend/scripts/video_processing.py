import cv2
import numpy as np
import os
import tensorflow as tf
import segmentation_models as sm
import time
import datetime

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
preprocess_input = sm.get_preprocessing('resnet101')
m1 = tf.keras.models.load_model(
    'C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/models/unet_model_666_resnet1000_continue.h5', compile=False)
org = (50, 250)
fontScale = 5
color = (0, 0, 255)
thickness = 4
font = cv2.FONT_HERSHEY_SIMPLEX
alpha = 1.5 # Contrast control (1.0-3.0)
beta = 0 # Brightness control (0-100)
kernel = np.ones((5,5),np.uint8)
name = []
value = []
data = {}
flag = 1
complete = 0
    
def folder_process(original_dir):
    
    save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/video_calculated/"
    completed = 0
    
    for file in os.listdir(original_dir):
        if file.endswith('.mp4') or file.endswith('.MOV'):
            video_f=0
            try:
                os.makedirs(original_dir+os.path.splitext(file)[0])
            except FileExistsError:
                # directory already exists
               pass
            i=1
            vid = cv2.VideoCapture(original_dir+file)
            frame_width = round(vid.get(3)/32)*32
            frame_height = round(vid.get(4)/32)*32
            if (frame_width < 512) or (frame_height < 512):
                frame_width = 512
                frame_height = 512
            if (frame_width > 2048) or (frame_height > 2048):
                frame_width = 2048
                frame_height = 2048
            fps = vid.get(cv2.CAP_PROP_FPS)
            length = int(vid.get(cv2.CAP_PROP_FRAME_COUNT))
            out_vid = cv2.VideoWriter(save_dir+'processed_1'+file,cv2.VideoWriter_fourcc('m','p','4','v'), fps, (frame_width,frame_height))
            if (vid.isOpened()== False):
                print("Error opening video file")
            
            while (vid.isOpened()):
                ret, frame = vid.read()
                mask_shape = (frame_height,frame_width)
                if ret == True:
                    # if (video_f<400):
                    # Display the resulting frame
                        frame = cv2.resize(frame, (frame_width,frame_height))
                        p_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        test_img = np.array(p_frame)
                        test_input = np.expand_dims(test_img, axis=0)
                        prediction = m1.predict(test_input,verbose = 0,use_multiprocessing=True)
                        prediction = prediction.reshape(mask_shape)
                        
                        prediction = np.where(prediction < 0.99995, 0, 1)
                        
                          # Convert binary image to colour image
                        prediction = prediction * 255
                        prediction = prediction.astype(np.uint8)
                        final = cv2.bitwise_and(frame, frame, mask=prediction)
                          #find contours
                        contours, hierarchy = cv2.findContours(prediction, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
                        cv2.drawContours(frame, contours, -1, (230,159,22), -1)
                        s1=cv2.addWeighted( frame, 1.0, final, 1.0, 0.0)
                        # numpy_horizontal = np.hstack((ori, s1))
                        
                        i = i+1
                        video_f = video_f+1
                        out_vid.write(s1)
                        total_time = time.time()-start
                        completed = completed + 1
                        remaning = (length-completed)
                        total_time = time.time()-start
                        remaning_time = round((remaning*total_time)/completed,2)
                        print(datetime.timedelta(seconds=remaning_time))
                    # else:
                        # break
            
                else:
                    break
        

start = time.time()           
path = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/Images_To_Analyze/"
folder_process(path)

