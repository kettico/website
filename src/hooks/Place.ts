import { PlaceCell } from '@/types/PlaceCell';
import { useEffect } from 'react';

export function usePlacePolling(
  setGrid: React.Dispatch<React.SetStateAction<PlaceCell[][]>>,
  interval = 5000
) {
  useEffect(() => {
    const fetchGrid = () => {
      fetch('/api/place')
        .then(res => res.json())
        .then(data => setGrid(data))
        .catch(err => console.error('Polling error:', err));
    };

    fetchGrid(); // initial fetch
    const timer = setInterval(fetchGrid, interval);

    return () => clearInterval(timer); // cleanup
  }, [setGrid, interval]);
}
