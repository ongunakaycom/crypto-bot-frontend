import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Dropdown } from 'react-bootstrap';
import { AiOutlineUser, AiOutlineLogout, AiOutlineSetting } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import useTradeStore from '../../../store/tradeStore'; // ✅ Import store
import './DashboardHeader.css';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // ✅ Zustand store values
  const { preferredMarket, preferredCoin } = useTradeStore();

  // Redirect to home if user is not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      navigate('/');
    }
  };

  return (
    <header className="dashboard-header px-4">
      <div className="dashboard-title">
        <img
          src="./img/logo.jpg"
          alt="Logo"
          width="40"
          height="40"
          className="DashboardLogo"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="ms-3 me-auto text-white small d-none d-md-block">
        {/* ✅ User settings info */}
        <span>Your trading preferences: <strong>{preferredMarket}</strong> market, <strong>{preferredCoin.toUpperCase()}</strong> pair</span>
      </div>

      <div className="d-flex align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" className="dashboard-header-button">
            <AiOutlineUser size={30} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate('/dashboard')}>
              <BsChatLeft /> Chat with Robin Hood
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/account-settings')}>
              <AiOutlineSetting /> Account Settings
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              <AiOutlineLogout /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default DashboardHeader;
