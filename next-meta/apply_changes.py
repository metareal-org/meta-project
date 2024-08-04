import sys
import re

def apply_changes(file_path, changes):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.readlines()

    changes_lines = changes.split('\\n')
    current_line = 0
    
    for line in changes_lines:
        if line.startswith('@@'):
            match = re.match(r'@@ -\d+,\d+ \+(\d+),', line)
            if match:
                current_line = int(match.group(1)) - 1
        elif line.startswith('+'):
            content.insert(current_line, line[1:] + '\n')
            current_line += 1
        elif line.startswith('-'):
            if content[current_line].strip() == line[1:].strip():
                content.pop(current_line)
            else:
                current_line += 1
        else:
            current_line += 1

    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(content)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python apply_changes.py <file_path> <changes>")
        sys.exit(1)

    file_path = sys.argv[1]
    changes = ' '.join(sys.argv[2:])

    apply_changes(file_path, changes)
    print(f"Changes applied to {file_path}")