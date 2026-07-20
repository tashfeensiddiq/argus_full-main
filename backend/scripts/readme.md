**Corrosion 2D Image Analysis - version 1.0**

Following is the order to be followed while calling the back-end functions from front-end:

When the user uploaded the image, first store the image in **"image"** folder and call the below three functions:

**1. make_dirs():** Creates all the required directories for the program execution

**2. type_conversion():** converts .jpg, .png, .tiff, .bmp  to .png for easily accessing the input images. 

**3. color_correction():** converts uploaded images to color corrected images. Basically, it removes the color shades and improve the luminance of the image which is a key component for analysis.

Once the color_correction() is called, the output of color corrected images will be stored in **outputCC** folder. In the crop window, read the images from the **outputCC** folder and crop it using the cropping tool. Once the image is cropped, save the cropped images into the **outputCC** folder. Once the cropped image of color corrected image is obtained, the following functions are executed and the output is stored in the output folder.

**6. image_segmentation():** function to segment out corrosion and calculates the percentage of corrosion

**7. remove_misc_files():** removes the folders and files after running the script(which is no longer in use) from the specified path. These folders are used to save required input while execution. This function deletes the images_png and output_cc.

Now, the analyzed image is present in the output folder. Use this folder for viewing the analyzed images in the front-end.



**Directory Structure:**

├───images
├───misc
│   ├───images_png
│   └───output_cc
├───output
├───src
│   └───__pycache__
└───utils
    └───ref

images - Contains all the input images uploaded by the user.

misc - This folder is used to store the images in respective folders and these folders are used to store the images needed for program execution.

images_png - The user can upload any type of image (.jpg, .png, .bmp). This folder stores the converted .png image.

masks - This folder stores the ground truth masks from the JSON file.

output_cc - First, this folder is used to contain the color corrected and histogram matched output of the source image. The               color corrected output is used for asset cropping. Once the asset cropping is done, the cropped image is saved in the same folder.

output - This folder is important and it stores all the analyzed images.

src - Contains the source code (back-end script)

utils - This folder contains the utility files needed for program execution.

json - This is where the JSON files get downloaded.

ref - This folder contains the reference image used for color correction and histogram matching.



 **Note: The front-end uses only two folders** 

1. **input - store all the images user uploaded**
2. **output - contains the analyzed image. This folder can be accessed by the front-end script to view the results to user.**



