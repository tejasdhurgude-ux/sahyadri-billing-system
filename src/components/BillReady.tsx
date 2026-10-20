import { useState } from 'react';
import type { Bill } from '../types/bill';
import { BillPreview } from './BillPreview';
import { buildGreeting, buildWhatsAppUrl } from '../services/whatsappService';
import { downloadBillPdf, shareBillPdf } from '../services/pdfService';

interface BillReadyProps {
  bill: Bill;
  onNewBill: () => void;
}

export function BillReady({ bill, onNewBill }: BillReadyProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const greetingUrl = buildWhatsAppUrl(bill.customer.phone, buildGreeting());

  async function run(action: () => Promise<string | null>) {
    setBusy(true);
    try {
      setNotice(await action());
    } catch {
      setNotice('Could not create the PDF. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const handleShare = () =>
    run(async () => {
      const result = await shareBillPdf(bill);
      if (result === 'shared') return 'Share sheet completed. Please confirm in WhatsApp that the PDF was sent.';
      if (result === 'downloaded') return 'PDF saved to this device. Open the customer’s WhatsApp chat and attach it with the paperclip.';
      return null;
    });

  const handleDownload = () =>
    run(async () => {
      await downloadBillPdf(bill);
      return 'PDF saved to this device.';
    });

  return (
    <section className="card checkout" aria-labelledby="ready-title">
      <div className="alert alert--success" role="status">
        <strong id="ready-title">Bill created.</strong> Send the greeting first, then the PDF.
      </div>
      <BillPreview createdAt={bill.createdAt} customerName={bill.customer.name} items={bill.items} subtotal={bill.subtotal} total={bill.total} />
      <div className="row row--wrap">
        <a className="btn btn--primary" href={greetingUrl} target="_blank" rel="noopener noreferrer">1. Send greeting on WhatsApp</a>
        <button type="button" className="btn btn--primary" onClick={handleShare} disabled={busy}>{busy ? 'Preparing PDF…' : '2. Share PDF'}</button>
        <button type="button" className="btn" onClick={handleDownload} disabled={busy}>Download PDF</button>
        <button type="button" className="btn btn--ghost" onClick={onNewBill}>Start new bill</button>
      </div>
      <p className="notice">Step 1 opens the customer’s chat with the greeting; press send in WhatsApp. Step 2: choose WhatsApp, then tap that customer’s chat. This app cannot tell whether a message was actually sent.</p>
      {notice && <p className="notice" role="status">{notice}</p>}
    </section>
  );
}
