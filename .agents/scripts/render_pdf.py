import fitz
import os

pdf_path = "attached_assets/2._TKA_BILANGAN_BULAT_1785513245823.pdf"
out_dir = ".agents/outputs/tka_bb"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Pages: {doc.page_count}")
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
    out = f"{out_dir}/page_{i+1:02d}.png"
    pix.save(out)
    print(f"Saved {out} ({page.rect.width:.0f}x{page.rect.height:.0f}pt)")
doc.close()
print("Done")
