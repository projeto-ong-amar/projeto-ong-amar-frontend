
import { useState, useEffect } from 'react';
import { fetchReports } from '../services/reportsService.js';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [period,  setPeriod]  = useState('30dias');

  useEffect(() => {
    setLoading(true);
    fetchReports()
      .then(data => setReports(data))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  return { reports, loading, error, period, setPeriod };
}
