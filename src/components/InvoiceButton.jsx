import { useState } from 'react';
import { FileDown, X, Loader2 } from 'lucide-react';
import { downloadInvoice } from '../services/api';

export default function InvoiceButton({ orderId, fullWidth }) {
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchBlob = async () => {
    setError('');
    setLoading(true);
    try {
      const blob = await downloadInvoice(orderId);
      return URL.createObjectURL(blob);
    } catch (err) {
      setError(err.message || 'Could not generate invoice');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    const url = await fetchBlob();
    if (url) setPreviewUrl(url);
  };

  const handleDownload = async () => {
    const url = previewUrl || await fetchBlob();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    a.click();
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <>
      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          {error}
          <button onClick={() => setError('')}><X size={13} /></button>
        </div>
      )}

      {/* Preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closePreview}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8D5B0]">
              <span className="font-bold text-[#2C1A0E] text-sm">Invoice Preview</span>
              <div className="flex items-center gap-2">
                <button onClick={handleDownload}
                  className="flex items-center gap-1.5 bg-[#C0522B] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#9A3E1E] transition-colors">
                  <FileDown size={13} /> Download PDF
                </button>
                <button onClick={closePreview} className="text-[#7B5C3A] hover:text-[#C0522B]"><X size={18} /></button>
              </div>
            </div>
            <iframe src={previewUrl} className="flex-1 w-full" style={{ minHeight: '70vh' }} title="Invoice Preview" />
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={handlePreview}
        disabled={loading}
        className={`flex items-center justify-center gap-1.5 text-sm font-semibold border border-[#C0522B]/40 px-3 py-1.5 rounded-full hover:bg-[#C0522B] hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed text-[#C0522B] ${
          fullWidth ? 'w-full py-3.5' : 'text-xs px-3 py-1.5'
        }`}
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
        {loading ? 'Generating…' : 'Download Invoice'}
      </button>
    </>
  );
}
