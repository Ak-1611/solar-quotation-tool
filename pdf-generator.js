export function generateQuotationPDF(elementId, quotationNumber) {
  const element = document.getElementById(elementId);
  const cleanNumber = quotationNumber.replace(/[\/\\:]/g, "_");

  const options = {
    margin: 0,
    filename: `BPPL_Quotation_${cleanNumber}.pdf`,
    image: { type: "jpeg", quality: 1.0 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      logging: false,
      scrollY: 0,
      windowWidth: element.scrollWidth
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  return window.html2pdf().set(options).from(element).save();
}