import bpy
import os

scene = bpy.context.scene
# Set Output Path
base_file_path = os.getcwd() + "/test"
scene.render.filepath = base_file_path
scene.render.image_settings.file_format = 'JPEG'
# Set Resolution
res = (1920, 1080)
res = (720, 720)
res = (256, 256)
scene.render.resolution_x = res[0]
scene.render.resolution_y = res[1]
# Delete default cube
bpy.data.objects.remove(bpy.data.objects['Cube'], do_unlink=True)
# Configure camera
camera = bpy.data.cameras['Camera']
camera.lens = 70

def snapshot_stl(stl_name):
    # Import STL, rotate upright manually
    basis_vectors = [
        ['Y', 'Z'],
        ['Y', 'X'],
        ['X', 'Z'],
        ['-X', 'Y'],
        ['-Z', 'Y'],
        ['Z', 'X'],
    ]
    chosen_basis = basis_vectors[0]
    bpy.ops.import_mesh.stl(filepath=os.getcwd() + f'/stls/{stl_name}.stl', axis_forward=chosen_basis[0], axis_up=chosen_basis[1])
    stl_object = bpy.data.objects[stl_name]

    # Scale STL to fit in box
    dimensions = stl_object.dimensions
    target_box = [5, 5, 4]
    scale_factors = [
        target_box[0] / dimensions.x,
        target_box[1] / dimensions.y,
        target_box[2] / dimensions.z
    ]
    scale_factor = min(scale_factors)
    stl_object.scale = (scale_factor, scale_factor, scale_factor)
    # Move origin to center of geometry
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    # Object to center of scene
    stl_object.location = (0, 0, 0)
    # Update filepath to inlcude STL name
    scene.render.filepath = base_file_path + f'/{stl_name}'
    bpy.ops.render.render(write_still=True)
    # Cleanup, remove STL object
    bpy.data.objects.remove(stl_object, do_unlink=True)

for filename in os.listdir(os.getcwd() + '/stls'):
    if filename.endswith(".stl"):
        snapshot_stl(filename[:-4])
