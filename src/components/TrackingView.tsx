
import React from 'react';
import type { Driver, DeliveryStatus } from '../types';

interface TrackingViewProps {
  driver: Driver;
  status: DeliveryStatus;
}

const statusConfig = {
    'Picking up': { text: 'Driver is picking up your order', progress: 25, color: 'bg-yellow-400' },
    'On the way': { text: 'Your order is on the way', progress: 75, color: 'bg-blue-500' },
    'Delivered': { text: 'Your order has been delivered', progress: 100, color: 'bg-green-500' },
    'Pending': {text: 'Waiting for driver...', progress: 0, color: 'bg-gray-300'}
}

const TrackingView: React.FC<TrackingViewProps> = ({ driver, status }) => {
  const currentStatus = statusConfig[status] || statusConfig['Pending'];
    
  return (
    <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Tracking Delivery</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        </div>
        <div>
          <p className="font-bold text-lg text-gray-900">{driver.name}</p>
          <p className="text-gray-600">{driver.vehicle.model} - {driver.vehicle.plate}</p>
          <div className="flex items-center text-yellow-500 mt-1">
            <span className="font-bold">{driver.rating.toFixed(1)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div>
        <p className="font-semibold text-gray-700 mb-2">{currentStatus.text}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${currentStatus.color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
            style={{ width: `${currentStatus.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
