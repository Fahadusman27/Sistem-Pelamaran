import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Men-generate PDF 4 halaman dari elemen DOM di latar belakang (tanpa print dialog).
 * @param pageElements Array of HTMLElement untuk halaman 1 sampai 4
 * @returns Promise<Blob> File PDF dalam bentuk Blob
 */
export async function generateApplicationPdfBlob(
  pageElements: HTMLElement[]
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const validElements = pageElements.filter((el): el is HTMLElement => el !== null && el !== undefined);

  if (validElements.length === 0) {
    throw new Error("Tidak ada elemen halaman yang ditemukan untuk di-generate");
  }

  for (let i = 0; i < validElements.length; i++) {
    const el = validElements[i];

    // Render DOM ke canvas dengan resolusi tajam (scale 2.5)
    const canvas = await html2canvas(el, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    if (i > 0) {
      pdf.addPage("a4", "portrait");
    }

    // Ukuran A4 standar dalam milimeter: 210 x 297
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  }

  return pdf.output("blob");
}
