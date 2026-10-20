import type { Bill } from '../types/bill';
import { products } from '../data/products';
import { LOGO_SVG } from '../assets/logo';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import { lineTotal } from '../utils/calculations';

const LOGO_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG)}`;

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

const GREEN = '#17582f'; // headings and lines
const PALE = '#e3f1e8'; // table header background
const td = 'padding:12px 8px;border-bottom:1px solid #dfe3dc;vertical-align:top;';
const th = 'padding:12px 8px;font-size:14px;font-weight:600;color:#1b241e;';

/** Deliberately NOT printed: bill number and customer phone number. */
function buildBillHtml(bill: Bill): string {
  const rows = bill.items
    .map((item, i) => {
      const mr = products.find((p) => p.id === item.productId)?.nameMr ?? '';
      return `<tr>
        <td style="${td}">${i + 1}</td>
        <td style="${td}">
          <div style="font-weight:600">${esc(item.name)}</div>
          ${mr ? `<div>${esc(mr)}</div>` : ''}
          <div style="font-size:12px;color:#6b776f">${esc(item.packaging)}</div>
        </td>
        <td style="${td}text-align:right">${item.quantity}</td>
        <td style="${td}text-align:right;white-space:nowrap">${formatCurrency(item.price)}</td>
        <td style="${td}text-align:right;white-space:nowrap">${formatCurrency(lineTotal(item))}</td>
      </tr>`;
    })
    .join('');

  return `<div style="font-family:'Noto Sans Devanagari',system-ui,sans-serif;color:#1b241e;font-size:14px;line-height:1.5;background:#fff;padding:44px 48px 36px">
    <div style="display:flex;align-items:center;gap:20px;padding-bottom:18px;border-bottom:3px solid ${GREEN}">
      <img id="sahyadri-logo" src="${LOGO_URI}" width="84" height="84" style="width:84px;height:84px;flex:none;display:block" alt="Sahyadri logo" />
      <div>
        <div style="font-size:30px;font-weight:600;color:${GREEN};line-height:1.2">Sahyadri Wholesale Fataka, Lonand</div>
        <div style="font-size:18px;color:${GREEN}">सह्याद्री होलसेल फटाका, लोणंद</div>
      </div>
    </div>

    <div style="margin:22px 0 22px">
      <div>Date / दिनांक: <b>${esc(formatDateTime(bill.createdAt))}</b></div>
      <div>Customer / ग्राहक: <b>${esc(bill.customer.name)}</b></div>
    </div>

    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:${PALE}">
        <th style="${th}text-align:left;width:34px">#</th>
        <th style="${th}text-align:left">Item / वस्तू</th>
        <th style="${th}text-align:right">Qty / नग</th>
        <th style="${th}text-align:right">Rate / दर</th>
        <th style="${th}text-align:right">Amount / रक्कम</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="display:flex;justify-content:flex-end;margin-top:20px">
      <div style="min-width:280px;border-top:3px solid ${GREEN};padding-top:10px;display:flex;justify-content:space-between;font-size:20px;font-weight:600;color:${GREEN}">
        <span>Total / एकूण</span><span>${formatCurrency(bill.total)}</span>
      </div>
    </div>

    <div style="margin-top:48px;padding-top:16px;border-top:1px solid #dfe3dc;text-align:center">
      <div style="font-size:16px;font-weight:600;color:${GREEN}">Thanks, Team Sahyadri Wholesale Fataka, Lonand</div>
      <div style="font-size:14px;color:#1b241e">धन्यवाद! टीम सह्याद्री होलसेल फटाका, लोणंद</div>
    </div>
  </div>`;
}

function fileName(bill: Bill): string {
  const stamp = new Date(bill.createdAt).toISOString().slice(0, 16).replace(/[-:T]/g, '');
  return `Sahyadri-Bill-${stamp}.pdf`;
}

export async function generateBillPdf(bill: Bill): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  await document.fonts.load('16px "Noto Sans Devanagari"', 'मराठी');
  await document.fonts.load('600 16px "Noto Sans Devanagari"', 'मराठी');

  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;';
  el.innerHTML = buildBillHtml(bill);
  document.body.appendChild(el);
  try {
    // The logo must be fully loaded before the page is captured, or it is left out.
    await Promise.all(
      Array.from(el.querySelectorAll('img')).map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
      ),
    );
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
    const pageW = 210; // mm; page grows to fit long bills
    const contentH = (canvas.height / canvas.width) * pageW;
    const pdf = new jsPDF({ unit: 'mm', format: [pageW, Math.max(297, contentH)] });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageW, contentH);
    return pdf.output('blob');
  } finally {
    document.body.removeChild(el);
  }
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function downloadBillPdf(bill: Bill): Promise<void> {
  downloadBlob(await generateBillPdf(bill), fileName(bill));
}

export type PdfShareResult = 'shared' | 'downloaded' | 'cancelled';

/** Opens the phone's share sheet with the PDF (HTTPS + supported phone); otherwise downloads it. */
export async function shareBillPdf(bill: Bill): Promise<PdfShareResult> {
  const blob = await generateBillPdf(bill);
  const file = new File([blob], fileName(bill), { type: 'application/pdf' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Sahyadri bill' });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }
  downloadBlob(blob, file.name);
  return 'downloaded';
}
