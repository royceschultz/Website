from PIL import Image
from PIL.ExifTags import TAGS, GPS

image = Image.open('Images/TBP_01.jpg')

exifdata = image.getexif().items()

for tag_id, value in exifdata:
    tag = TAGS.get(tag_id, tag_id)
    # if isinstance(value, bytes):
    #     value = value.decode()
    print(f"{tag:25}: {value}")

gps_index = next(x for x in TAGS if TAGS[x] == 'GPSInfo')
gps_info = image.getexif().get_ifd(gps_index)
print(gps_info)
