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
import sys
import json
# import time

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
    edge_detection = 0
    
    for file in os.listdir(original_dir):
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

          if(edge_detection == 1):  
              # Canny Edge Detection
                  edges = cv2.Canny(image=img_blur, threshold1=10, threshold2=150) # Canny Edge Detection
                  dilation = cv2.dilate(edges,kernel,iterations = 1)
                  # Display Canny Edge Detection Image
              
                  contours,hierarchy = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
      
                  #find the biggest area of the contour
                  c = max(contours, key = cv2.contourArea)
                  total = cv2.contourArea(c)
                  c=cv2.fillPoly(blackblankimage, pts =[c], color=(255,255,255))
          else:
              # if(edge_detection == 0):
                  total = width*height
                  #c = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                  c = cv2.resize(frame, (width,height))
              
          bg_final = cv2.bitwise_and(output, output, mask=blackblankimage)
          p_frame = cv2.cvtColor(bg_final, cv2.COLOR_RGB2BGR)
              
              # test_img = np.array(p_frame)
              # p_frame = preprocess_input(p_frame)
          test_input = np.expand_dims(np.array(p_frame), axis=0)
          prediction = m1.predict(test_input,verbose = 0,use_multiprocessing=True)
          prediction = prediction.reshape((height,width))                
          prediction = np.where(prediction >= 0.40, 1, 0)     
                              
              # Convert binary image to colour image
          prediction = (prediction * 255).astype(np.uint8)
              # prediction = prediction.astype(np.uint8)
          if (edge_detection == 1):
              prediction = cv2.bitwise_and(c,c, mask=prediction)
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
          # numpy_horizontal = np.hstack((test_img_org, bg_final, s1))
          predictions.append(round(percentage, 2))

          # background removal
          cv2.imwrite(save_dir+'/bg_path/'+file, bg_final)
          cv2.imwrite(save_dir+'/calculated/'+file, s1)  # corrosion detected
          cv2.imwrite(save_dir+'/original/'+file, test_img_org)  # original
          cv2.imwrite(save_dir+'/mask/'+file, prediction)
          cv2.imwrite(save_dir+'/mask/dilation_'+file, c)


path = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/Images_To_Analyze/"
save_dir = "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/"


# if __name__ == '__main__':
#     inputData = ""
#     data = sys.stdin
#     # print(data)
#     for line in data:

#         inputData += line

folder_process(path)



df = pandas.DataFrame([filename, predictions], index=[
                      "filename", "calculated percentage"])
df = df.T
plt.plot(df["filename"], df["calculated percentage"])
plt.savefig(save_dir+'/datasheet/graph.png')
df.to_excel(save_dir+'/datasheet/demo.xlsx', sheet_name='datapercentage')


