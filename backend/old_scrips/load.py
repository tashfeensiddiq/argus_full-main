import cv2
import os
import sys

org = (50, 50)
fontScale = 1
color = (255, 0, 0)
thickness = 1
font = cv2.FONT_HERSHEY_SIMPLEX


def video_process(original_dir):
    print(sys.argv[1])

    save_dir = original_dir
    for file in os.listdir(original_dir):
        if file.endswith('.mp4'):

            vid = cv2.VideoCapture(original_dir+file)
            frame_width = int(vid.get(3))
            frame_height = int(vid.get(4))
            fps = vid.get(cv2.CAP_PROP_FPS)
            out_vid = cv2.VideoWriter(save_dir+'processed '+file, cv2.VideoWriter_fourcc(
                'M', 'J', 'P', 'G'), fps, (frame_width, frame_height))
            if (vid.isOpened() == False):
                print("Error opening video file")

            while (vid.isOpened()):
                ret, frame = vid.read()
                if ret == True:
                    # Display the resulting frame
                    p_frame = cv2.putText(
                        frame, 'qualiTEAS', org, font, fontScale, color, thickness, cv2.LINE_AA)
                    out_vid.write(p_frame)

                else:
                    break

        if file.endswith('.png') or file.endswith('.jpg') or file.endswith('.jpeg'):
            img = cv2.imread(original_dir+file, cv2.IMREAD_COLOR)
            output = cv2.putText(img, 'qualiTEAS', org, font,
                                 fontScale, color, thickness, cv2.LINE_AA)
            cv2.imwrite(save_dir+'processed '+file, output)
