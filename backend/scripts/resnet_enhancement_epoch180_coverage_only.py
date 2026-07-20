import cv2
import numpy as np
import os
import tensorflow as tf
from tensorflow.keras.applications.resnet import preprocess_input
import math
import pandas
import openpyxl
import time
import datetime
from pathlib import Path

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

filename = list()
image_address = list()
predictions = list()
prediction_time = list()

font = cv2.FONT_HERSHEY_COMPLEX


# ============================================================
# MODEL: RESNET101 U-NET EPOCH 180
# ============================================================

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "resnet101_uNET_e180_468_0.3.5_0_b40_.0001lr_rgb_256_class_3_full.h5"
)

m1 = tf.keras.models.load_model(
    str(MODEL_PATH),
    compile=False,
)

print("Model input shape :", m1.input_shape)
print("Model output shape:", m1.output_shape)


org = (50, 250)
color = (0, 0, 255)
font = cv2.FONT_HERSHEY_SIMPLEX


# ============================================================
# ORIGINAL CONFIGURATION VALUES
# ============================================================

THRESHOLD = 0.65

BILATERAL_DIAMETER = 7
BILATERAL_SIGMA_COLOR = 75
BILATERAL_SIGMA_SPACE = 75

GAMMA = 1.2

CLAHE_CLIP_LIMIT = 2.0
CLAHE_TILE_GRID_SIZE = (8, 8)

SHARPEN_KERNEL = np.array([
    [-1, -1, -1],
    [-1,  9, -1],
    [-1, -1, -1],
])

OVERLAY_COLOR = (230, 159, 22)


# ============================================================
# OLD-SCRIPT-STYLE MAIN PROCESSING FUNCTION
# ============================================================

def folder_process(original_dir):
    BASE_DIR = Path(__file__).resolve().parent.parent

    save_dir = str(BASE_DIR / "bg_images") + os.sep

    os.makedirs(save_dir + "enhanced", exist_ok=True)
    os.makedirs(save_dir + "calculated", exist_ok=True)
    os.makedirs(save_dir + "original", exist_ok=True)
    os.makedirs(save_dir + "mask", exist_ok=True)
    os.makedirs(save_dir + "datasheet", exist_ok=True)

    supported_extensions = (
        '.png',
        '.jpg',
        '.jpeg',
        '.bmp',
        '.tif',
        '.tiff',
    )

    image_files = [
        file
        for file in os.listdir(original_dir)
        if file.lower().endswith(supported_extensions)
    ]

    completed = 0

    for file in image_files:
        input_path = os.path.join(original_dir, file)

        img = cv2.imread(
            input_path,
            cv2.IMREAD_COLOR,
        )

        if img is None:
            print(f"Could not read image: {file}")
            continue

        filename.append(file)
        image_address.append(
            "http://localhost:4000/folders/image/" + file
        )

        FONT_SCALE = 2e-3
        THICKNESS_SCALE = 1e-3

        original_height, original_width, _ = img.shape

        font_scale = max(
            0.6,
            min(original_width, original_height) * FONT_SCALE,
        )

        thickness = max(
            1,
            math.ceil(
                min(original_width, original_height)
                * THICKNESS_SCALE
            ),
        )

        test_img_org = img.copy()

        # Keep the original script's resize style.
        width = round(img.shape[1] / 32) * 32
        height = round(img.shape[0] / 32) * 32

        if width < 512:
            width = 640
        if width > 1536:
            width = 1024
        if height < 512:
            height = 352
        if height > 1536:
            height = 1024

        frame = cv2.resize(
            img,
            (width, height),
            interpolation=cv2.INTER_AREA,
        )

        # ====================================================
        # IMAGE ENHANCEMENT
        # No background removal is used.
        # ====================================================

        bg_final = frame.copy()
        
        # ====================================================
        # Automatic White Balance
        # ====================================================

        lab = cv2.cvtColor(bg_final, cv2.COLOR_BGR2LAB)

        l, a, b = cv2.split(lab)

        avgA = np.mean(a)
        avgB = np.mean(b)

        a = a.astype(np.float32)
        b = b.astype(np.float32)
        l_float = l.astype(np.float32)

        a = a - ((avgA - 128.0) * (l_float / 255.0) * 1.1)
        b = b - ((avgB - 128.0) * (l_float / 255.0) * 1.1)

        a = np.clip(a, 0, 255).astype(np.uint8)
        b = np.clip(b, 0, 255).astype(np.uint8)

        lab = cv2.merge((l, a, b))

        bg_final = cv2.cvtColor(
            lab,
            cv2.COLOR_LAB2BGR,
        )

        # 1. Bilateral image enhancement
    # 1. Edge-preserving denoising
        bg_final = cv2.fastNlMeansDenoisingColored(
        bg_final,
        None,
        5,
        5,
        7,
        21
    )


        # 2. Adaptive Gamma Enhancement

        gray = cv2.cvtColor(bg_final, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)

        if brightness < 70:
            gamma = 1.6
        elif brightness < 120:
            gamma = 1.3
        else:
            gamma = 1.0

        invGamma = 1.0 / gamma

        table = np.array([
            ((i / 255.0) ** invGamma) * 255
            for i in np.arange(256)
        ]).astype("uint8")

        bg_final = cv2.LUT(
            bg_final,
            table,
        )
        
        bg_final = cv2.normalize(
        bg_final,
        None,
        0,
        255,
        cv2.NORM_MINMAX
        )

        # 3. CLAHE local contrast enhancement
        lab = cv2.cvtColor(
            bg_final,
            cv2.COLOR_BGR2LAB,
        )

        l, a, b = cv2.split(lab)

        clahe = cv2.createCLAHE(
            clipLimit=CLAHE_CLIP_LIMIT,
            tileGridSize=CLAHE_TILE_GRID_SIZE,
        )

        l = clahe.apply(l)
        lab = cv2.merge((l, a, b))

        bg_final = cv2.cvtColor(
            lab,
            cv2.COLOR_LAB2BGR,
        )
        
        gray = cv2.cvtColor(
    bg_final,
    cv2.COLOR_BGR2GRAY
        )

        kernel = cv2.getStructuringElement(
            cv2.MORPH_ELLIPSE,
            (5,5)
        )

        topHat = cv2.morphologyEx(
            gray,
            cv2.MORPH_TOPHAT,
            kernel
        )

        bg_final[:,:,1] = cv2.add(
            bg_final[:,:,1],
            topHat
        )

        # ====================================================
        # Unsharp Mask
        # ====================================================

        blur = cv2.GaussianBlur(
            bg_final,
            (0, 0),
            3
        )

        bg_final = cv2.addWeighted(
            bg_final,
            1.7,
            blur,
            -0.7,
            0
        )

        # ====================================================
        # RESNET101 U-NET EPOCH 180 PREDICTION
        # ====================================================

        input_shape = m1.input_shape

        if isinstance(input_shape, list):
            input_shape = input_shape[0]

        model_height = input_shape[1]
        model_width = input_shape[2]

        # Handle a variable-size model input.
        if model_height is None or model_width is None:
            model_height = height
            model_width = width
        else:
            model_height = int(model_height)
            model_width = int(model_width)

        print(
            f"\nProcessing: {file}\n"
            f"Model processing size: "
            f"{model_width} x {model_height}"
        )

        model_image = cv2.resize(
            bg_final,
            (model_width, model_height),
            interpolation=cv2.INTER_AREA,
        )

        p_frame = cv2.cvtColor(
            model_image,
            cv2.COLOR_BGR2RGB,
        )

        p_frame = preprocess_input(
            p_frame.astype(np.float32)
        )

        test_input = np.expand_dims(
            p_frame,
            axis=0,
        )

        prediction_start = time.time()

        prediction3 = m1.predict(
            test_input,
            verbose=0,
        )

        current_prediction_time = (
            time.time() - prediction_start
        )

        prediction_time.append(
            current_prediction_time
        )

        print("Prediction shape:", prediction3.shape)

        prediction_output = prediction3[0]

        # Single-channel output
        if (
            prediction_output.ndim == 3
            and prediction_output.shape[-1] == 1
        ):
            probability_mask = prediction_output[:, :, 0]

            model_mask = (
                probability_mask >= THRESHOLD
            ).astype(np.uint8)
            


        # Multi-channel output
        elif (
            prediction_output.ndim == 3
            and prediction_output.shape[-1] > 1
        ):
            class_mask = np.argmax(
                prediction_output,
                axis=-1,
            )

            # Class 0 is treated as background.
            # All classes above 0 are combined.
            model_mask = (
                class_mask > 0
            ).astype(np.uint8)

        # Two-dimensional output
        elif prediction_output.ndim == 2:
            model_mask = (
                prediction_output >= THRESHOLD
            ).astype(np.uint8)

        else:
            raise ValueError(
                f"Unsupported prediction shape: "
                f"{prediction3.shape}"
            )

        prediction1 = cv2.resize(
            model_mask,
            (width, height),
            interpolation=cv2.INTER_NEAREST,
        )

        prediction5 = (
            prediction1 * 255
        ).astype(np.uint8)
        
        # ====================================================
        # Mask Cleanup
        # ====================================================

        kernel = cv2.getStructuringElement(
                cv2.MORPH_ELLIPSE,
                (3,3)
            )

        prediction5 = cv2.morphologyEx(
                prediction5,
                cv2.MORPH_OPEN,
                kernel,
            )

        prediction5 = cv2.morphologyEx(
                prediction5,
                cv2.MORPH_CLOSE,
                kernel,
            )
        
        prediction1 = (prediction5 > 0).astype(np.uint8)

        # ====================================================
        # COVERAGE PERCENTAGE
        # ====================================================

        detected_pixels = np.count_nonzero(
            prediction1
        )

        total_pixels = prediction1.size

        percentage = (
            detected_pixels / total_pixels
        ) * 100.0

        predictions.append(
            round(percentage, 2)
        )

        print(
            f"Coverage: {percentage:.2f}%"
        )


        # ====================================================
        # Improved Overlay
        # ====================================================

        overlay = bg_final.copy()

        overlay[prediction1 > 0] = OVERLAY_COLOR

        s1 = cv2.addWeighted(
            bg_final,
            0.70,
            overlay,
            0.30,
            0,
        )

        contours, _ = cv2.findContours(
            prediction5,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        cv2.drawContours(
            s1,
            contours,
            -1,
            (0,255,255),
            2,
        )

        text_x = max(
            20,
            int(width * 0.03),
        )

        text_y = max(
            45,
            int(height * 0.08),
        )

        s1 = cv2.putText(
            s1,
            'Coverage : {:.2f}%'.format(percentage),
            (text_x, text_y),
            font,
            font_scale,
            color,
            thickness,
            cv2.LINE_AA,
        )

        # Resize outputs back to the original photograph size.
        bg_final_original = cv2.resize(
            bg_final,
            (
                test_img_org.shape[1],
                test_img_org.shape[0],
            ),
            interpolation=cv2.INTER_AREA,
        )

        s1_original = cv2.resize(
            s1,
            (
                test_img_org.shape[1],
                test_img_org.shape[0],
            ),
            interpolation=cv2.INTER_AREA,
        )

        prediction_original = cv2.resize(
            prediction5,
            (
                test_img_org.shape[1],
                test_img_org.shape[0],
            ),
            interpolation=cv2.INTER_NEAREST,
        )

        numpy_horizontal = np.hstack((
            test_img_org,
            bg_final_original,
            s1_original,
        ))

        # ====================================================
        # SAVE RESULTS
        # ====================================================

        cv2.imwrite(
            save_dir + '/enhanced/' + file,
            bg_final_original,
        )

        cv2.imwrite(
            save_dir
            + '/calculated/enhanced_resnet_analyzed_'
            + file,
            numpy_horizontal,
        )

        cv2.imwrite(
            save_dir + '/original/' + file,
            test_img_org,
        )

        file_stem = Path(file).stem

        cv2.imwrite(
            save_dir
            + '/mask/'
            + file_stem
            + '.png',
            prediction_original,
        )

        completed = completed + 1

        total_time = time.time() - start
        remaining = len(image_files) - completed

        remaining_time = round(
            (remaining * total_time) / completed,
            2,
        )

        print(
            'Prediction time:',
            '{:.2f} seconds'.format(
                current_prediction_time
            ),
        )

        print(
            'Estimated remaining time:',
            datetime.timedelta(
                seconds=remaining_time
            ),
        )


# ============================================================
# LOCAL INPUT AND OUTPUT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

path = str(BASE_DIR / "Images_To_Analyze") + os.sep
save_dir = str(BASE_DIR / "bg_images") + os.sep

# ============================================================
# RUN PROCESSING
# ============================================================

start = time.time()
folder_process(path)


# ============================================================
# OLD-SCRIPT-STYLE DATA TABLE
# ============================================================

df = pandas.DataFrame(
    [
        filename,
        image_address,
        predictions,
        prediction_time,
    ],
    index=[
        "Image",
        "image_logo",
        "Calculated_Percentage",
        "Prediction_Time_Seconds",
    ],
)

df = df.T

os.makedirs(
    save_dir + '/datasheet/',
    exist_ok=True,
)

os.makedirs(
    save_dir + '/calculated/',
    exist_ok=True,
)

df.to_excel(
    save_dir + '/calculated/demo.xlsx',
    sheet_name='datapercentage',
    index=False,
)

df.to_excel(
    save_dir + '/datasheet/demo.xlsx',
    sheet_name='datapercentage',
    index=False,
)


print('\n' + '=' * 65)
print('PROCESSING COMPLETED')
print('=' * 65)
print('Images processed:', len(filename))

if predictions:
    print(
        'Average coverage: {:.2f}%'.format(
            np.mean(predictions)
        )
    )

if prediction_time:
    print(
        'Average prediction time: {:.2f} seconds'.format(
            np.mean(prediction_time)
        )
    )

print('Saved in:', save_dir)
print('=' * 65)
