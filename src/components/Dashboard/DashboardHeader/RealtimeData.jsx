import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../firebase';

const RealtimeData = ({ onData }) => {
  useEffect(() => {
    const dataRef = ref(database, 'binance_data');

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const binanceData = snapshot.val();

        if (!binanceData) {
          console.error('❌ binance_data is null or empty.');
          return;
        }

        console.log('✅ Firebase realtimedata is fetched successfully.');
        onData(binanceData);
      },
      (error) => {
        console.error(
          `❌ Error fetching binance_data from Firebase: ${error?.message || error}`
        );
      }
    );

    return () => unsubscribe();
  }, [onData]);

  return null; // This component is headless — it does not render anything.
};

export default RealtimeData;