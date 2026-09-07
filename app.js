import { APP_CONFIG } from "./config.js";
import { generateQuotationPDF } from "./pdf-generator.js";

const formatINR = (val) =>
  "₹ " +
  Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function populateDropdowns() {
  const panelSelect = document.getElementById("in-panel-brand");
  const inverterSelect = document.getElementById("in-inverter-brand");
  const wattageSelect = document.getElementById("in-panel-wattage");

  // Populate Brands
  APP_CONFIG.brands.forEach((brand) => {
    panelSelect.add(new Option(brand, brand));
    inverterSelect.add(new Option(`${brand} Inverter`, `${brand} Inverter`));
  });
  panelSelect.value = "ADANI";
  inverterSelect.value = "POWER ONE Inverter";

  // Populate Wattages with TOPCon indicator
  APP_CONFIG.panelWattages.forEach((p) => {
    const label = `${p.value} WP (${p.type})`;
    const rawVal = `${p.value} WP ${p.type}`;
    wattageSelect.add(new Option(label, rawVal));
  });
}

export function syncQuotation() {
  // Sync Header Info
  document.getElementById("out-quotation-no").innerText = document.getElementById("in-quotation-no").value;
  document.getElementById("out-date").innerText = document.getElementById("in-date").value;
  document.getElementById("out-client").innerText = document.getElementById("in-client").value;

  // Equipment Mapping
  const brand = document.getElementById("in-panel-brand").value;
  const wattageStr = document.getElementById("in-panel-wattage").value;
  const qty = document.getElementById("in-panel-qty").value;
  const inverter = document.getElementById("in-inverter-brand").value;

  document.getElementById("out-banner-module").innerText = `${brand} ${wattageStr} (${qty} nos)`;
  document.getElementById("out-banner-inverter").innerText = inverter;
  document.getElementById("out-row1-desc").innerText = `${brand} ${wattageStr} ${qty} nos`;

  // Cost Computations
  const r1_amt = parseFloat(document.getElementById("in-mod-amt").value) || 0;
  const r1_tot = r1_amt * (1 + APP_CONFIG.defaultRates.gstModules);

  const r2_amt = parseFloat(document.getElementById("in-str-amt").value) || 0;
  const r2_tot = r2_amt * (1 + APP_CONFIG.defaultRates.gstServices);

  const r3_amt = parseFloat(document.getElementById("in-inst-amt").value) || 0;
  const r3_tot = r3_amt * (1 + APP_CONFIG.defaultRates.gstServices);

  const r4_amt = parseFloat(document.getElementById("in-pm-amt").value) || 0;
  const r4_tot = r4_amt;

  const r5_amt = parseFloat(document.getElementById("in-m1-amt").value) || 0;
  const r5_tot = r5_amt;

  const r6_amt = parseFloat(document.getElementById("in-m3-amt").value) || 0;
  const r6_tot = r6_amt;

  const grandTotal = r1_tot + r2_tot + r3_tot + r4_tot + r5_tot + r6_tot;

  // Update DOM Output
  document.getElementById("out-row1-amt").innerText = formatINR(r1_amt);
  document.getElementById("out-row1-tot").innerText = formatINR(r1_tot);
  document.getElementById("out-row2-amt").innerText = formatINR(r2_amt);
  document.getElementById("out-row2-tot").innerText = formatINR(r2_tot);
  document.getElementById("out-row3-amt").innerText = formatINR(r3_amt);
  document.getElementById("out-row3-tot").innerText = formatINR(r3_tot);
  document.getElementById("out-row4-amt").innerText = formatINR(r4_amt);
  document.getElementById("out-row4-tot").innerText = formatINR(r4_tot);
  document.getElementById("out-row5-amt").innerText = formatINR(r5_amt);
  document.getElementById("out-row5-tot").innerText = formatINR(r5_tot);
  document.getElementById("out-row6-amt").innerText = formatINR(r6_amt);
  document.getElementById("out-row6-tot").innerText = formatINR(r6_tot);
  document.getElementById("out-final-amt").innerText = formatINR(grandTotal);
}

// Global initialization
window.addEventListener("DOMContentLoaded", () => {
  populateDropdowns();
  document.getElementById("in-date").valueAsDate = new Date();

  // Attach auto-sync to all inputs
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", syncQuotation);
    el.addEventListener("change", syncQuotation);
  });

  // Attach PDF export
  document.getElementById("btn-download-pdf").addEventListener("click", () => {
    const qNo = document.getElementById("in-quotation-no").value;
    generateQuotationPDF("quotation-preview", qNo);
  });

  syncQuotation();
});