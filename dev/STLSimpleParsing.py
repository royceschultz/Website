from ast import literal_eval
import struct

with open('test.stl', 'rb') as f:
    header = f.read(80)
    print(header)
    n_triangles_bytes = f.read(4)
    n_triangles = int.from_bytes(n_triangles_bytes, byteorder='little')
    print(n_triangles)

    for i in range(n_triangles):
        normal = f.read(12)
        normal = struct.unpack('3f', normal)
        print('normal', normal)
        vertex1 = f.read(12)
        vertex1 = struct.unpack('3f', vertex1)
        print('v1', vertex1)
        vertex2 = f.read(12)
        vertex2 = struct.unpack('3f', vertex2)
        print('v2', vertex2)
        vertex3 = f.read(12)
        vertex3 = struct.unpack('3f', vertex3)
        print('v3', vertex3)
        attr_byte_count = f.read(2)
        print('attr', attr_byte_count)
        print()
