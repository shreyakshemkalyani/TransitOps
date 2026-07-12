"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

const STATUS_OPTIONS = ['ACTIVE', 'IN_MAINTENANCE', 'INACTIVE'];

export default function VehicleForm({ vehicle = null, onSuccess }) {
  const [formData, setFormData] = useState({
    registrationNumber: vehicle?.registrationNumber || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || '',
    status: vehicle?.status || 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.registrationNumber.trim()) e.registrationNumber = 'Registration number is required';
    if (formData.year && (isNaN(formData.year) || formData.year < 1900 || formData.year > 2100))
      e.year = 'Enter a valid year';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year, 10) : null,
      };
      if (vehicle) {
        await axios.put(`/api/vehicles/${vehicle.id}`, payload);
      } else {
        await axios.post('/api/vehicles', payload);
      }
      onSuccess?.();
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to save vehicle';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h2>
      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Registration Number</label>
          <input
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className={`w-full rounded-md border p-2 ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.registrationNumber && <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Make</label>
          <input name="make" value={formData.make} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Model</label>
          <input name="model" value={formData.model} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
          <input name="year" type="number" value={formData.year} onChange={handleChange} className={`w-full rounded-md border p-2 ${errors.year ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={() => onSuccess?.()} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Saving…' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}
