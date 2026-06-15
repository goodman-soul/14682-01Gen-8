import { useState } from 'react';
import type { ServiceType } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';

export function useServiceType() {
  const [serviceType, setServiceType] = useState<ServiceType>(
    loadFromStorage<ServiceType>(STORAGE_KEYS.SERVICE_TYPE, 'takeout')
  );

  const updateServiceType = (type: ServiceType) => {
    setServiceType(type);
    saveToStorage(STORAGE_KEYS.SERVICE_TYPE, type);
  };

  return {
    serviceType,
    setServiceType: updateServiceType,
  };
}
