import os
import sys

print("Fixing PropTypes issues")
dir_path = os.path.dirname(os.path.realpath(__file__))
rnw_filename = dir_path + "/./node_modules/react-native-web/dist/index.js"
rnw_text_filename = dir_path + "/./node_modules/react-native-web/dist/exports/Text/index.js"

def append_new_line(file_name, text_to_append):
    """Append given text as a new line at the end of file"""

    if text_to_append in open(file_name).read():
        print("Skipping...")
    else:
        with open(file_name, "a+") as file_object:
            file_object.write("\n")
            file_object.write(text_to_append)
            file_object.close()

def replace_line(file_name, line_num, text):
    lines = open(file_name, 'r').readlines()
    lines[line_num] = text
    out = open(file_name, 'w')
    out.writelines(lines)
    out.close()


# Fix
append_new_line(rnw_filename, "export const ViewPropTypes = { style: null };")
replace_line(rnw_text_filename, -1, "Text.propTypes = {style: null};")
append_new_line(rnw_text_filename, "export default Text;")