import { useState, useCallback } from 'react';
import api from '../api/axiosConfig';

export const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (method, url, body = null) => {
    setLoading(true);
    setError('');
    try {
      const response = await api({
        method,
        url,
        data: body
      });
      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, request, setData, setError };
};

export default useApi;
