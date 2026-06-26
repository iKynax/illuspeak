"""Convert the non-raster sponsor logos to PNG so the WebP pipeline can use them.

LOGO/ ships three logos the browser can't display directly:
  - 2026-LAFAYETTE-LOGO.pdf
  - FC Logo Green(A&G).pdf
  - Bumi_logo Blue and White.psd

This renders them to PNG (alpha) next to the originals in /LOGO. Run once after
new logo drops:  python scripts/convert-logos.py
Requires: pip install pymupdf pillow
"""

import os
import fitz  # PyMuPDF
from PIL import Image

LOGO = os.path.join(os.path.dirname(__file__), "..", "LOGO")


def pdf_to_png(src, dst, zoom=4):
    doc = fitz.open(os.path.join(LOGO, src))
    pix = doc[0].get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=True)
    pix.save(os.path.join(LOGO, dst))
    print(f"PDF -> {dst} ({pix.width}x{pix.height})")


def psd_to_png(src, dst):
    im = Image.open(os.path.join(LOGO, src)).convert("RGBA")
    im.save(os.path.join(LOGO, dst))
    print(f"PSD -> {dst} {im.size}")


if __name__ == "__main__":
    jobs = [
        ("pdf", "2026-LAFAYETTE-LOGO.pdf", "Lafayette.png"),
        ("pdf", "FC Logo Green(A&G).pdf", "FC-AG.png"),
        ("psd", "Bumi_logo Blue and White.psd", "Bumi.png"),
    ]
    for kind, src, dst in jobs:
        try:
            (pdf_to_png if kind == "pdf" else psd_to_png)(src, dst)
        except Exception as e:  # noqa: BLE001
            print(f"FAILED {src}: {e}")
