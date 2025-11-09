
import React from 'react';
import type { Driver } from '../types';

interface ResultsPanelProps {
  drivers: Driver[];
  onSelectDriver: (driver: Driver) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ drivers, onSelectDriver }) => {
  if (drivers.length === 0) {
    return <p className="text-center text-gray-500 py-4">No available drivers found.</p>;
  }

  return (
    <div className="max-h-80 overflow-y-auto pr-2">
      <h2 className="text-lg font-bold mb-2 text-gray-800">Available Drivers</h2>
      <ul className="space-y-2">
        {drivers.map(driver => (
          <li
            key={driver.id}
            onClick={() => onSelectDriver(driver)}
            className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900">{driver.name}</p>
              <p className="text-sm text-gray-600">{driver.vehicle.model} - {driver.vehicle.plate}</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="font-bold">{driver.rating.toFixed(1)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPanel;
