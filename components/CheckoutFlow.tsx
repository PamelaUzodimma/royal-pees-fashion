'use client';

export function ConfirmOrderModal({
  open,
  message,
  sending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  message: string;
  sending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[500] flex items-end justify-center bg-black/60 transition-opacity ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="w-full rounded-t-2xl bg-white p-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <div className="mb-1 text-lg font-bold">Confirm Custom Request</div>
        <div className="mb-4 text-[13.5px] text-muted">
          This order details will open instantly on WhatsApp:
        </div>
        <pre className="mb-5 max-h-[180px] overflow-y-auto whitespace-pre-wrap rounded-lg bg-surface p-3.5 font-mono text-[12.5px] leading-relaxed">
          {message}
        </pre>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-surface py-3.5 text-sm font-semibold"
          >
            Modify Outfits
          </button>
          <button
            onClick={onConfirm}
            disabled={sending}
            className="flex-[2] rounded-lg bg-[#25D366] py-3.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send to WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmationScreen({
  open,
  orderId,
  whatsappUrl,
  onReopenWhatsApp,
  onContinue,
}: {
  open: boolean;
  orderId: string;
  whatsappUrl: string;
  onReopenWhatsApp: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[700] flex flex-col items-center justify-center bg-charcoal p-8 text-center transition-transform duration-300 ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl">
        ✅
      </div>
      <div className="mb-2 text-xl font-extrabold text-white">Request Received</div>
      <div className="mb-5 max-w-[300px] text-[13.5px] leading-relaxed text-white/60">
        Your booking has been logged. Complete it by sending the WhatsApp message so we can
        confirm fabric, sizing, and timeline with you directly.
      </div>
      <div className="mb-6 rounded-lg border border-charcoal-3 bg-charcoal-2 px-[18px] py-2.5 text-sm font-extrabold tracking-wide text-accent">
        Booking ID: {orderId}
      </div>
      <div className="flex w-full max-w-[280px] flex-col gap-2.5">
        <button
          onClick={onReopenWhatsApp}
          className="rounded-xl bg-[#25D366] py-4 text-[14.5px] font-bold text-white"
        >
          Reopen WhatsApp to Confirm
        </button>
        <button
          onClick={onContinue}
          className="rounded-xl border border-charcoal-3 py-4 text-sm font-semibold text-white/70"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}
