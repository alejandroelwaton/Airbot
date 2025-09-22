import os
from collections import defaultdict, Counter

# ---------------- CONFIGURACIÓN ----------------
ROOT_DIR = "."  # Carpeta raíz del proyecto
EXTENSIONS = [".py", ".cpp", ".c", ".h", ".js", ".ts", ".tsx", ".ino"]  # Extensiones a contar
IGNORE_DIRS = {"venv", "node_modules", ".git", "dist", ".vscode"}  # Carpetas a ignorar
TOP_FILES = 10  # Mostrar los X archivos con más líneas
TOP_FOLDERS = 5  # Mostrar las X carpetas más grandes
# ----------------------------------------------

def count_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
            num_lines = len(lines)
            num_chars = sum(len(line) for line in lines)
            return num_lines, num_chars
    except Exception as e:
        print(f"No se pudo leer {file_path}: {e}")
        return 0, 0

def analyze_folder(folder_path):
    stats = defaultdict(lambda: {"lines": 0, "chars": 0, "files": 0})
    file_details = []
    folder_details = defaultdict(lambda: {"lines": 0, "chars": 0, "files": 0})

    total_lines = 0
    total_chars = 0

    for dirpath, dirnames, filenames in os.walk(folder_path):
        # Ignorar carpetas configuradas
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for filename in filenames:
            ext = os.path.splitext(filename)[1]
            if ext in EXTENSIONS:
                file_path = os.path.join(dirpath, filename)
                lines, chars = count_file(file_path)
                stats[ext]["lines"] += lines
                stats[ext]["chars"] += chars
                stats[ext]["files"] += 1

                folder_details[dirpath]["lines"] += lines
                folder_details[dirpath]["chars"] += chars
                folder_details[dirpath]["files"] += 1

                file_details.append((file_path, lines, chars))

                total_lines += lines
                total_chars += chars

    return stats, total_lines, total_chars, file_details, folder_details

def print_summary(title, stats, total_lines, total_chars):
    print(f"\nResumen: {title}")
    print(f"Total de líneas: {total_lines}, Total de caracteres: {total_chars}")
    print(f"{'Extensión':<10} {'Archivos':<8} {'Líneas':<10} {'Chars':<10} {'% Líneas':<10} {'% Chars':<10}")
    print("-" * 70)
    for ext, data in stats.items():
        pct_lines = (data["lines"] / total_lines * 100) if total_lines else 0
        pct_chars = (data["chars"] / total_chars * 100) if total_chars else 0
        print(f"{ext:<10} {data['files']:<8} {data['lines']:<10} {data['chars']:<10} {pct_lines:<10.2f} {pct_chars:<10.2f}")

def print_top_files(file_details):
    print(f"\nTop {TOP_FILES} archivos con más líneas:")
    sorted_files = sorted(file_details, key=lambda x: x[1], reverse=True)
    for f, lines, chars in sorted_files[:TOP_FILES]:
        print(f"{lines:<6} líneas, {chars:<6} chars -> {f}")

def print_top_folders(folder_details):
    print(f"\nTop {TOP_FOLDERS} carpetas más grandes (por líneas):")
    sorted_folders = sorted(folder_details.items(), key=lambda x: x[1]["lines"], reverse=True)
    for folder, data in sorted_folders[:TOP_FOLDERS]:
        print(f"{data['lines']:<6} líneas, {data['files']:<4} archivos -> {folder}")

def main():
    total_stats, total_lines, total_chars, file_details, folder_details = analyze_folder(ROOT_DIR)
    print_summary("Proyecto completo", total_stats, total_lines, total_chars)
    print_top_files(file_details)
    print_top_folders(folder_details)

    # Por carpeta de primer nivel
    for entry in os.scandir(ROOT_DIR):
        if entry.is_dir() and entry.name not in IGNORE_DIRS:
            folder_stats, folder_lines, folder_chars, folder_files, folder_subfolders = analyze_folder(entry.path)
            print_summary(f"Carpeta '{entry.name}'", folder_stats, folder_lines, folder_chars)
            print_top_files(folder_files)
            print_top_folders(folder_subfolders)

if __name__ == "__main__":
    main()

