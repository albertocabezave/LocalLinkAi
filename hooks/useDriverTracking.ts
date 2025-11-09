
import { useState, useEffect, useRef } from 'react';
import type { Driver, LatLngPosition, DeliveryStatus } from '../types';

export const useDriverTracking = (
  driver: Driver | null,
  startPosition: LatLngPosition,
  endPosition: LatLngPosition,
  onComplete: () => void
) => {
  const [driverPosition, setDriverPosition] = useState<LatLngPosition | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('Pending');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!driver) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDriverPosition(null);
      setDeliveryStatus('Pending');
      return;
    }

    const totalDuration = 20000; // 20 seconds for the whole trip
    const pickupDuration = 5000; // 5 seconds to "pick up"
    const travelDuration = totalDuration - pickupDuration;
    const steps = travelDuration / 100; // update every 100ms

    let step = 0;
    let startTime = Date.now();
    setDriverPosition(startPosition);
    setDeliveryStatus('Picking up');

    const tick = () => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < pickupDuration) {
        // Still in pickup phase
        setDeliveryStatus('Picking up');
      } else {
        // Travel phase
        setDeliveryStatus('On the way');
        const travelElapsedTime = elapsedTime - pickupDuration;
        const progress = Math.min(travelElapsedTime / travelDuration, 1);
        
        const lat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
        const lng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;
        setDriverPosition({ lat, lng });

        if (progress >= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setDeliveryStatus('Delivered');
          onComplete();
        }
      }
    };
    
    intervalRef.current = window.setInterval(tick, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver, startPosition.lat, startPosition.lng, endPosition.lat, endPosition.lng, onComplete]);

  return { driverPosition, deliveryStatus };
};
