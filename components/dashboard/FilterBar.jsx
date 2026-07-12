import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'In Maintenance', value: 'IN_MAINTENANCE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const statusIconMap = {
  ACTIVE: { text: '🟢', color: 'text-green-600' },
  IN_MAINTENANCE: { text: '🔧', color: 'text-yellow-600' },
  INACTIVE: { text: '⚫', color: 'text-slate-400' },
};

export default function FilterBar({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const params = new URLSearchParams(window.location.search);
    if (e.target.value.trim()) {
      params.set('search', e.target.value.trim());
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative min-w-[200px] flex-1">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Children content */}
      {children}
    </div>
  );
}
