import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

// This hook handles syncing local storage with backend
const useDataSync = (apiFunction, storageKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get from backend
      const response = await apiFunction();
      setData(response);
      
      // Save to localStorage as backup 

    }})}