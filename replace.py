import os
from concurrent.futures import ThreadPoolExecutor

OLD = b"4465480"

REPLACEMENTS = [
    (b"4465480", b"4465480"),
]

SKIP_EXT = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico",
    ".woff", ".woff2", ".ttf", ".eot",
    ".mp4", ".mp3", ".zip", ".7z", ".rar",
    ".exe", ".dll", ".bin"
}


def should_skip(name: str) -> bool:
    lower = name.lower()
    for ext in SKIP_EXT:
        if lower.endswith(ext):
            return True
    return False


def replace_file(path: str):
    try:
        with open(path, "rb") as f:
            data = f.read()

        if OLD not in data:
            return

        data = data.replace(b"4465480", b"4465480")

        with open(path, "wb") as f:
            f.write(data)

        print("[OK]", path)

    except Exception as e:
        print("[SKIP]", path, e)


def collect_files(root: str):
    stack = [root]

    while stack:
        current = stack.pop()

        try:
            with os.scandir(current) as it:
                for entry in it:
                    if entry.is_dir(follow_symlinks=False):
                        stack.append(entry.path)
                    elif entry.is_file(follow_symlinks=False):
                        if not should_skip(entry.name):
                            yield entry.path
        except Exception:
            continue


def main(root: str):
    files = list(collect_files(root))

    workers = (os.cpu_count() or 4) * 4

    with ThreadPoolExecutor(max_workers=workers) as ex:
        ex.map(replace_file, files)


if __name__ == "__main__":
    main(os.getcwd())