import os

def export_project_code(project_path, output_file):
    excluded_folders = {'node_modules', '.next', '.vscode'}
    excluded_paths = {'components/ui', 'components\\ui'}  # Include both forward and backslash versions
    excluded_files = {'.env', '.gitignore', '.prettierrc', '.todo', 'components.json', 'Dockerfile',
                      'next-env.d.ts', 'next.config.mjs', 'package.json', 'pnpm-lock.yaml',
                      'postcss.config.mjs', 'README.md', 'tailwind.config.ts', 'tsconfig.json',
                      'tsconfig.tsbuildinfo'}
    allowed_extensions = {'.js', '.jsx', '.ts', '.tsx'}

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(project_path):
            # Remove excluded folders
            dirs[:] = [d for d in dirs if d not in excluded_folders]
            
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, project_path)
                normalized_path = relative_path.replace(os.sep, '/')  # Normalize path separators
                file_extension = os.path.splitext(file)[1].lower()
                
                # Skip excluded files, files with non-allowed extensions, and files in excluded paths
                if (os.path.basename(file_path) in excluded_files or
                    file_extension not in allowed_extensions or
                    any(normalized_path.startswith(excluded_path) for excluded_path in excluded_paths)):
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                        outfile.write(f"File: {relative_path}\n")
                        outfile.write("-" * 80 + "\n")
                        outfile.write(content)
                        outfile.write("\n\n" + "=" * 80 + "\n\n")
                except Exception as e:
                    outfile.write(f"Error reading file {relative_path}: {str(e)}\n\n")

# Usage
project_path = r'D:\met-clone\next-meta'  # Using a raw string
output_file = 'project_code_export.txt'
export_project_code(project_path, output_file)