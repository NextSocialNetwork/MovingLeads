import React, { useState } from 'react';
import { X, Plus, Building2, MapPin, Calendar, User, Phone, Mail } from 'lucide-react';
import { MovingLead, Priority, OutreachStatus } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (newLead: MovingLead) => void;
  existingCount: number;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  existingCount,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    currentAddress: '',
    city: '',
    state: 'CA',
    zipCode: '',
    destinationCity: '',
    destinationState: '',
    residenceType: '2 Bed Apt' as MovingLead['residenceType'],
    sqFt: 1200,
    bedrooms: 2,
    moveDate: '2026-07-28',
    urgency: 'High' as Priority,
    status: 'New' as OutreachStatus,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.zipCode) return;

    const finalCity = formData.city.trim();
    const finalState = formData.state.trim();

    const newLead: MovingLead = {
      id: `ML-${1001 + existingCount}`,
      ...formData,
      city: finalCity,
      state: finalState,
      destinationCity: formData.destinationCity.trim() || finalCity,
      destinationState: formData.destinationState.trim() || finalState,
      estimatedTruckSize: formData.sqFt > 2000 ? '24 ft Truck' : formData.sqFt > 1000 ? '16 ft Truck' : '12 ft Van',
      estimatedValue: Math.round(1000 + formData.sqFt * 1.1),
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold">Add New Future Moving Lead</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Sarah Connor"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
              <input
                required
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Move Date (Next Week) *</label>
              <input
                required
                type="date"
                value={formData.moveDate}
                onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Street Address</label>
              <input
                type="text"
                placeholder="123 Main St"
                value={formData.currentAddress}
                onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current City, State & ZIP Code *</label>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="p-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="ST"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="p-2 border border-slate-300 rounded-lg"
                />
                <input
                  required
                  type="text"
                  placeholder="ZIP"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Destination City & State</label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="text"
                  placeholder="Dest City"
                  value={formData.destinationCity}
                  onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                  className="p-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Dest State"
                  value={formData.destinationState}
                  onChange={(e) => setFormData({ ...formData, destinationState: e.target.value })}
                  className="p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Approx Square Footage</label>
              <input
                type="number"
                value={formData.sqFt}
                onChange={(e) => setFormData({ ...formData, sqFt: Number(e.target.value) })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Residence Type</label>
              <select
                value={formData.residenceType}
                onChange={(e) => setFormData({ ...formData, residenceType: e.target.value as any })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="Studio">Studio</option>
                <option value="1 Bed Apt">1 Bed Apt</option>
                <option value="2 Bed Apt">2 Bed Apt</option>
                <option value="3 Bed House">3 Bed House</option>
                <option value="4+ Bed House">4+ Bed House</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Condo">Condo</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority / Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Urgency</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              placeholder="e.g. Elevator reservation needed, moving large sofa..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
            >
              Add Lead to Spreadsheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
