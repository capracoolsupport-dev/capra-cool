import cv2
import numpy as np

img = cv2.imread('assets/capra_crest_black.png', cv2.IMREAD_UNCHANGED)
alpha = img[:, :, 3]
h, w = alpha.shape

# Threshold cleanly
_, thresh = cv2.threshold(alpha, 120, 255, cv2.THRESH_BINARY)
# Smooth slightly to remove pixelation
blurred = cv2.GaussianBlur(thresh, (3, 3), 0.8)
_, clean_thresh = cv2.threshold(blurred, 128, 255, cv2.THRESH_BINARY)

contours, hierarchy = cv2.findContours(clean_thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

paths = []
if hierarchy is not None:
    for i, cnt in enumerate(contours):
        epsilon = 0.8
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        if len(approx) < 3 or cv2.contourArea(approx) < 10:
            continue
        pts = [f'{p[0][0]},{p[0][1]}' for p in approx]
        paths.append('M ' + ' L '.join(pts) + ' Z')

path_str = ' '.join(paths)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="currentColor">
  <path fill-rule="evenodd" clip-rule="evenodd" d="{path_str}" />
</svg>'''

with open('assets/capra_crest.svg', 'w') as f:
    f.write(svg)

with open('favicon.svg', 'w') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100%" height="100%" rx="20" fill="#11120f" />
  <g fill="#fbf9f5" transform="translate(10, 18) scale(0.95)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="{path_str}" />
  </g>
</svg>''')

print('Generated capra_crest.svg and favicon.svg successfully!')
