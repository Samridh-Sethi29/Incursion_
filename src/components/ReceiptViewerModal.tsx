'use client';

import React from 'react';
import { X, Receipt, Download, Calendar, Tag, IndianRupee, ShieldCheck } from 'lucide-react';
import { ExpenseRecord } from '@/lib/types';
import { format } from 'date-fns';

interface ReceiptViewerModalProps {
  expense: ExpenseRecord | null;
  onClose: () => void;
}

export default function ReceiptViewerModal({ expense, onClose }: ReceiptViewerModalProps) {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E324B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{expense.title}</h3>
              <p className="text-xs text-slate-400">Digital Bill & Audit Trail Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Summary Details Badge Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#0B1522] rounded-xl border border-[#1E324B]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Amount</span>
              <p className="text-base font-bold text-emerald-400 flex items-center">
                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                {expense.amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Category</span>
              <p className="text-xs font-semibold text-slate-200">
                {expense.category.replace(/_/g, ' ')}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date</span>
              <p className="text-xs font-semibold text-slate-200">
                {format(new Date(expense.date), 'dd MMM yyyy')}
              </p>
            </div>
          </div>

          {/* Description & Event association */}
          <div className="space-y-2 text-xs">
            {expense.event && (
              <p className="text-slate-300">
                <strong className="text-slate-400">Associated Event:</strong>{' '}
                <span className="text-blue-400 font-medium">{expense.event.title}</span> ({expense.event.organizerClub})
              </p>
            )}
            {expense.description && (
              <p className="text-slate-300">
                <strong className="text-slate-400">Transaction Notes:</strong> {expense.description}
              </p>
            )}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified against ACM Core Semester Fund Allocation ({expense.semester})</span>
            </div>
          </div>

          {/* Receipt View Surface */}
          <div className="border border-[#1E324B] rounded-xl overflow-hidden bg-[#0B1522] p-4 text-center">
            {expense.receiptUrl ? (
              <div className="flex flex-col items-center justify-center">
                <div className="max-h-72 w-full overflow-auto rounded-lg flex items-center justify-center">
                  <img
                    src={expense.receiptUrl}
                    alt={expense.receiptName || 'Receipt'}
                    className="max-h-64 object-contain rounded border border-[#1E324B]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  {expense.receiptName || 'Attached_Receipt_File'}
                </p>
              </div>
            ) : (
              <div className="py-10 text-slate-500 text-xs">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Digital receipt recorded via verified direct treasury entry.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1E324B] bg-[#0E1927] flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">ID: {expense.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
