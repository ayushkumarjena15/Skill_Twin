import base64
import sys

# This is a placeholder - the actual image data would need to be provided
# For now, let's create a simple script that can copy an image file

import shutil
import os

source = sys.argv[1] if len(sys.argv) > 1 else None
destination = r"c:\Users\ankit\OneDrive\Desktop\ayush\public\team\anshuman-nayak.jpg"

if source and os.path.exists(source):
    shutil.copy(source, destination)
    print(f"Image copied successfully to {destination}")
else:
    print("Please provide a valid source image path")
    print(f"Usage: python save_image.py <source_image_path>")
