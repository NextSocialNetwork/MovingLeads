import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Clock, User, Mail, Phone, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { MovingLead } from '../types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToPurchase?: MovingLead | null;
  selectedLeads?: MovingLead[];
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  leadToPurchase = null,
  selectedLeads = [],
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitted(true);
    // Open Cash App payment page in a new window/tab
    window.open('https://Cash.App/$Movers312', '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  // Derive active lead selection
  const activeLeads: MovingLead[] = selectedLeads && selectedLeads.length > 0
    ? selectedLeads
    : leadToPurchase
    ? [leadToPurchase]
    : [];

  const count = activeLeads.length;
  const isMultiple = count > 1;
  const isSingle = count === 1;
  const isFullDataset = count === 0;

  // Calculate total price: $75 per selected lead, or $75 for full dataset
  const totalPrice = isFullDataset ? 75 : count * 75;

  let categoryBadge = 'Full Dataset Package';
  let itemTitle = 'Complete USA Moving Leads Dataset (150 Verified Leads in All 50 States)';

  if (isSingle) {
    categoryBadge = 'Single Lead Purchase';
    itemTitle = `Verified Moving Lead: ${activeLeads[0].id} (${activeLeads[0].city}, ${activeLeads[0].state})`;
  } else if (isMultiple) {
    categoryBadge = `${count} Selected Leads Package (${count} × $75)`;
    itemTitle = `Custom Package: ${count} Verified Selected USA Moving Leads`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D632] text-white font-mono font-black text-xl flex items-center justify-center shadow-md border border-[#00C22B]">
              $
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Cash App Lead Purchase (${totalPrice})
              </h3>
              <p className="text-xs text-emerald-400 font-mono font-semibold">
                Cash App Cashtag: $Movers312
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Order Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  {categoryBadge}
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1.5">{itemTitle}</p>

                {isSingle && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeLeads[0].residenceType} • {activeLeads[0].sqFt} sq ft • Move Date: {activeLeads[0].moveDate}
                  </p>
                )}

                {isMultiple && (
                  <div className="mt-2 space-y-1 bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                    <p className="font-semibold text-slate-700 mb-1">Selected Leads ({count} items):</p>
                    {activeLeads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex justify-between text-slate-600 font-mono">
                        <span>• {lead.city}, {lead.state} ({lead.sqFt} sq ft)</span>
                        <span className="text-emerald-700 font-bold">$75</span>
                      </div>
                    ))}
                    {count > 3 && (
                      <p className="text-slate-400 italic text-[10px] font-mono">
                        + {count - 3} additional selected leads ($75 each)
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 font-medium block">Total Price</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">${totalPrice}.00</span>
                {isMultiple && (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    ({count} × $75.00)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Timeframe Notice */}
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950 block">Important Delivery Notice:</strong>
              <p className="text-amber-800 leading-snug mt-0.5">
                All purchased leads will be emailed to you within 24 to 48 hours after payment completion.
              </p>
            </div>
          </div>

          {!isSubmitted ? (
            /* Purchase Information Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Buyer Information</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Please provide your contact details so we can deliver your unmasked lead data promptly.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className={`w-full p-2.5 border rounded-lg bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                      errors.firstName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-[10px] text-rose-600 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={`w-full p-2.5 border rounded-lg bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                      errors.lastName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-[10px] text-rose-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Email Address (Delivery Destination) <span className="text-rose-500">*</span></span>
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className={`w-full p-2.5 border rounded-lg bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">Your purchased lead file will be emailed to this address.</p>
                {errors.email && <p className="text-[10px] text-rose-600 mt-0.5">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Phone Number <span className="text-rose-500">*</span></span>
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 234-5678"
                  className={`w-full p-2.5 border rounded-lg bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">Used for payment verification & order updates.</p>
                {errors.phone && <p className="text-[10px] text-rose-600 mt-0.5">{errors.phone}</p>}
              </div>

              {/* Submit & Cash App Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#00D632] hover:bg-[#00B82B] active:bg-[#009E25] text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer border border-[#00C22B] flex items-center justify-center gap-2 text-sm"
                >
                  <span className="font-mono text-lg font-black">$</span>
                  <span>Submit Info & Pay ${totalPrice} via Cash App ($Movers312)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure redirect to official Cash App ($Movers312)</span>
                </p>
              </div>
            </form>
          ) : (
            /* Post-Submit Confirmation View */
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">Information Submitted!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Thank you, <strong className="text-slate-900">{firstName} {lastName}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Destination Email:</span>
                  <strong className="text-slate-900 font-mono">{email}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Contact Phone:</span>
                  <strong className="text-slate-900 font-mono">{phone}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Amount Due:</span>
                  <strong className="text-emerald-700 font-mono font-bold">${totalPrice}.00 via Cash App</strong>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-left">
                <p className="font-bold">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 mt-1 text-amber-800">
                  <li>Complete your <strong>${totalPrice} payment</strong> to <strong>$Movers312</strong> on Cash App.</li>
                  <li>Your lead file will be emailed to <strong>{email}</strong> within <strong>24 to 48 hours</strong>.</li>
                </ol>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="https://Cash.App/$Movers312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#00D632] hover:bg-[#00B82B] text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer border border-[#00C22B] inline-flex items-center justify-center gap-2 text-sm"
                >
                  <span className="font-mono text-lg font-black">$</span>
                  <span>Pay ${totalPrice} on Cash App ($Movers312)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={handleReset}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
