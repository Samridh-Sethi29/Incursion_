'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  X,
  Receipt,
  IndianRupee,
  Calendar,
  Tag,
  Upload,
  FileText,
  Sparkles,
} from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  events?: any[];
}

export default function ExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  events = [],
}: ExpenseModalProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('REFRESHMENTS_FOOD');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventId, setEventId] = useState('');
  const [description, setDescription] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          date: new Date(date).toISOString(),
          eventId: eventId || null,
          description,
          receiptUrl,
          receiptName,
          receiptType: receiptUrl?.startsWith('data:image') ? 'image' : 'document',
          loggedById: user.id,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to record expense');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E324B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Record Financial Transaction</h2>
              <p className="text-xs text-slate-400">Log expense & attach digital receipt for audit transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-400">
              {submitError}
            </div>
          )}

          {/* Expense Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Item / Expense Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Refreshments for Systems & Rust Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="4500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Budget Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="REFRESHMENTS_FOOD">Refreshments & Food</option>
                <option value="SWAG_PRIZES">Swag, Badges & Prizes</option>
                <option value="MARKETING_PRINTING">Marketing, Banners & Printing</option>
                <option value="LOGISTICS_EQUIPMENT">Logistics & AV Equipment</option>
                <option value="SPEAKER_HONORARIUM">Speaker Honorarium & Travel</option>
                <option value="VENUE_BOOKING">Venue Facility Fee</option>
                <option value="MISCELLANEOUS">Miscellaneous Operational</option>
              </select>
            </div>
          </div>

          {/* Date & Associated Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Date Incurred *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Associated Event (Optional)
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">General ACM Operational Fund</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.organizerClub})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Vendor Details
            </label>
            <input
              type="text"
              placeholder="e.g. Paid to Campus Canteen for 85 high-tea boxes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Digital Receipt Uploader */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Attach Digital Receipt / Bill</span>
              <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, PDF or SVG</span>
            </label>
            <div className="border-2 border-dashed border-[#1E324B] hover:border-blue-500 rounded-xl p-4 text-center bg-[#0B1522] transition-colors">
              {receiptUrl ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-200">{receiptName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptUrl(null);
                      setReceiptName(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs text-blue-400 font-medium hover:underline">Click to upload receipt</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Stored digitally directly with transaction</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E324B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSubmitting ? 'Recording...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
