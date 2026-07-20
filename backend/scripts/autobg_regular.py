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
import logging


# import time
# tf.keras.utils.disable_interactive_logging()
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
logging.basicConfig(level=logging.WARNING)
filename = list()
image_address = list()
predictions = list()
prediction_time = []
font = cv2.FONT_HERSHEY_COMPLEX
preprocess_input = sm.get_preprocessing('vgg16')
m1 = tf.keras.models.load_model(
    'C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/models/vgg16_uNET_e100_2757_0.20_0_b45_.0001lr_rgb_96.h5', compile=False)
# m1 = tf.keras.models.load_model(
    # '/home/app/scripts/unet_model_666_resnet1000_continue.h5', compile=False)
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
          total = width*height
          #c = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
          c = cv2.resize(frame, (width,height))
          bg_final = output#cv2.bitwise_and(output, output, mask=blackblankimage)
          p_frame = cv2.cvtColor(bg_final, cv2.COLOR_BGR2RGB)
          
              # test_img = np.array(p_frame)
          p_frame = preprocess_input(p_frame)
          test_input = np.expand_dims(np.array(p_frame), axis=0)
          prediction = m1.predict(test_input,verbose = 0,use_multiprocessing=True)
          prediction = prediction.reshape((height,width))
          prediction = np.where(prediction >= 0.90, 1, 0)
                              
              # Convert binary image to colour image
          prediction = (prediction * 255).astype(np.uint8)
              # prediction = prediction.astype(np.uint8)
          # find contours
          contours, hierarchy = cv2.findContours(
              prediction, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
          img = bg_final.copy()
          per = 0
          
          for i in range(len(contours)):
              per = per + cv2.contourArea(contours[i])
        
          cv2.drawContours(img, contours, -1, (230, 159, 22), -1)
          p = cv2.resize(prediction,(test_img_org.shape[1],test_img_org.shape[0]))
          bg_final = cv2.resize(bg_final,(test_img_org.shape[1],test_img_org.shape[0]))
          final = cv2.bitwise_and(test_img_org,test_img_org,mask=p)
          contours, hierarchy = cv2.findContours(p, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
          img = bg_final.copy()
          cv2.drawContours(img, contours, -1, (230,159,22), -1)
          s1=cv2.addWeighted( img, 1.0, final, 1.0, 0.0)
          percentage = round((per/total)*100,2)
          
          s1 = cv2.putText(s1, 'Percentage : {:.2f}'.format(
              percentage), org, font, font_scale, color, thickness, cv2.LINE_AA)
          numpy_horizontal = np.hstack((test_img_org, s1))
          predictions.append(round(percentage, 2))

          # background removal
          cv2.imwrite(save_dir+'/bg_path/'+file, bg_final)
          cv2.imwrite(save_dir+'/calculated/analyzed_'+file, numpy_horizontal)  # corrosion detected
          cv2.imwrite(save_dir+'/original/'+file, test_img_org)  # original
          cv2.imwrite(save_dir+'/mask/'+file, prediction)
          cv2.imwrite(save_dir+'/mask/dilation_'+file, c)
          total_time = time.time()-start
          completed = completed + 1
          remaning = ((len(os.listdir(path)))-completed)
          total_time = time.time()-start
          remaning_time = round((remaning*total_time)/completed,2)
          print(datetime.timedelta(seconds=remaning_time))
          
start = time.time()
path = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/Images_To_Analyze/"

# path = "/home/app/Images_To_Analyze/"



save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/"
# save_dir = "/home/app/bg_images/"


# if __name__ == '__main__':
#     inputData = ""
#     data = sys.stdin
#     # print(data)
#     for line in data:

#         inputData += line

folder_process(path)

df = pandas.DataFrame([filename,image_address, predictions], index=[
                      "Image", "image_logo","Calculated_Percentage"])
df = df.T
plt.plot(df["Image"], df["Calculated_Percentage"])

plt.savefig(save_dir+'/datasheet/graph.png')
df.to_excel(save_dir+'/calculated/demo.xlsx', sheet_name='datapercentage')
df.to_excel(save_dir+'/datasheet/demo.xlsx', sheet_name='datapercentage')
