import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { AiOutlineBell } from 'react-icons/ai';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../firebase.js';
import './HeaderAlert.css';
import { useTranslation } from 'react-i18next';
import useTradeStore from '../../../store/useTradeStore.js';
import RealtimeData from './RealtimeData';
import Alert from '../../Alert/Alert';
import { checkTradeProgress, createTradeSignal } from './tradeUtils';
import {
  extractIndicatorsFromNewSchema,
  analyzeMarketConditions,
  isPriceDataFrozen,
  shouldTriggerBuySignal
} from './indicatorUtils';


// === Component ===
const HeaderAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlerts, setShowAlerts] = useState(false);
  const { tradeState, setTradeState } = useTradeStore();

  const createAlert = useCallback((type, message, price, details) => {
    const newAlert = {
      id: Date.now(),
      type,
      timestamp: new Date().toISOString(),
      price,
      message,
      details,
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, read: true } : alert));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    setUnreadCount(0);
  };

  const resetTradeState = useCallback(() => {
    setTradeState({
      active: false,
      signalType: null,
      entryPrice: null,
      takeProfit: null,
      stopLoss: null
    });
  }, [setTradeState]);

  const checkForTradingSignals = useCallback((data) => {
    if (!data || typeof data !== 'object') {
      console.warn('⚠️ Invalid data format for trading signal analysis.');
      return;
    }

    const indicators = extractIndicatorsFromNewSchema(data);
    if (!indicators) {
      console.warn('⚠️ Could not extract indicators.');
      return;
    }

    if (isPriceDataFrozen(indicators.priceData)) {
      console.warn('⚠️ Price data is frozen. Skipping...');
      return;
    }

    const market = analyzeMarketConditions(indicators);

    if (tradeState.active) {
      checkTradeProgress(tradeState, indicators.price, createAlert, resetTradeState);
      return;
    }

    const isBuySignal = shouldTriggerBuySignal(indicators, market);

    if (isBuySignal) {
      createTradeSignal('BUY', indicators.price, indicators, setTradeState, createAlert);
    } else {
      console.log('⚠️ Conditions not met for trade execution.');
    }
  }, [tradeState, createAlert, resetTradeState, setTradeState]);




  useEffect(() => {
    const dataRef = ref(database, 'binance_data');

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const binanceData = snapshot.val();

        if (!binanceData) {
          console.error('❌ binance_data could not be fetched — snapshot is null or empty.');
          return;
        }

        console.log('✅ Firebase realtimedata is fetched successfully.');
        checkForTradingSignals(binanceData);
      },
      (error) => {
        console.error(
          `❌ Failed to fetch binance_data from Firebase Realtime Database: ${error?.message || error}`
        );
      }
    );

    return () => unsubscribe();
  }, [checkForTradingSignals]);



  const { t } = useTranslation();
  
  return (
    <>
      <RealtimeData onData={checkForTradingSignals} />

      <Dropdown show={showAlerts} onToggle={setShowAlerts} className="me-3">
        <Dropdown.Toggle variant="transparent" className="dashboard-header-button position-relative">
          <AiOutlineBell size={24} />
          {unreadCount > 0 && (
            <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
              {unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu align="end" className="p-3 alert-dropdown" style={{ width: 350 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 text-center flex-grow-1">{t('alerts.title')}</h6>
            {alerts.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-link text-danger ms-2"
                onClick={clearAllAlerts}
              >
                {t('alerts.clearAll')}
              </button>
            )}
          </div>

          <div className="alert-list">
            {alerts.length === 0 ? (
              <div className="text-center py-3 text-muted">{t('alerts.noAlerts')}</div>
            ) : (
              alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  type={alert.type}
                  message={alert.message}
                  details={alert.details}
                  timestamp={alert.timestamp}
                  read={alert.read}
                  onClick={() => markAsRead(alert.id)}
                />
              ))
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default HeaderAlert;