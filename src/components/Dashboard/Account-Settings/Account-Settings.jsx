import React, { useState, useEffect } from 'react';
import {Row, Col, Card} from "react-bootstrap";
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import { getAuth, updatePassword, deleteUser, onAuthStateChanged } from 'firebase/auth';
//import { remove  } from 'firebase/database'; 
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where} from "firebase/firestore"; //addDoc, , onSnapshot
import { Link, useNavigate } from 'react-router-dom';
import './AccountSettings.css';
import Footer from '../../Footer/Footer';
//import { getAnalytics, logEvent} from 'firebase/analytics';
import Alert from '../../Alert/Alert'; // Import the Alert components here.


const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [userRef, setUserRef] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'; 
  const [profilePicture, setProfilePicture] = useState(defaultAvatar);
  const [changedPic, setChangedPic] = useState(null);
  const [changedUserName, setChangedUserName] = useState(null);
  const [cities, setCities] = useState([]); // List of cities from the API
  const [selectedCities, setSelectedCities] = useState([]); // Selected cities by the user
  const [changedCities, setChangedCities] = useState(false);
  const [venues, setVenues] = useState([]); // List of venues in selected cities
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [changedVenues, setChangedVenues] = useState(false);


  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = getAuth();
  const navigate = useNavigate();
 // const analytics = getAnalytics();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        const firestore = getFirestore();
        const ur = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(ur);
        setUserRef(ur);
        if (!userSnapshot.exists()) {
          setUsername(user.displayName.split(' ')[0] || "name");
          setProfilePicture(user.photoURL || defaultAvatar);
          setSelectedCities(["Online"])

          await setDoc(ur, {
            displayName: user.displayName.split(' ')[0] || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            datingLocations: ["World"],
            datingVenues: ["Wonline"],
            createdAt: new Date(),
          });

        } else {
          const userData = userSnapshot.data();
          setUsername(userData.displayName);
          setProfilePicture(userData.photoURL);
          setSelectedCities(userData.datingLocations);
          setSelectedVenues(userData.datingVenues);
        } 
      } 
    });
    return () => unsubscribe();
  }, [auth]);

    /* Fetch cities from the API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        //const response = await fetch("https://api.example.com/cities"); // Replace with your API URL
        const data = //await response.json();
        {
          "cities": ["Online", "Manchester", "Tallinn"]
        }
        setCities(data.cities); // Assume API returns { cities: ["City1", "City2", ...] }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []); */

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const firestore = getFirestore();
        const venuesRef = collection(firestore, "venues");
        const snapshot = await getDocs(venuesRef);
        const uniqueCities = [...new Set(snapshot.docs.map((doc) => doc.data().city))];
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {
      if (selectedCities.length === 0) {
        setVenues([]); 
        return;
      }

      try {
        const firestore = getFirestore();
        const venuesRef = collection(firestore, "venues");
        const q = query(venuesRef, where("city", "in", selectedCities));
        const snapshot = await getDocs(q);

        // Map venue documents to an array
        const venuesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVenues(venuesList);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, [selectedCities]);


  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteUser(user);
          setError(null);
          navigate('/');
        } else {
          setError('No user is currently signed in.');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setChangedPic(file);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (changedPic) {
      try {
        console.log("trying to save profile pic Anna")
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result
          await updateDoc(userRef, {
            photoURL: base64String,
            updatedAt: new Date(), 
          });
          setSuccess("Profile picture updated successfully.");
          setChangedPic(null);
        };

        reader.readAsDataURL(changedPic); // Convert the image to base64
      } catch (err) {
        console.error("Error during profile picture update:", err);
        setError(`Failed to update profile picture: ${err.message}`);
      }
    } 
  };

  const handleCityChange = (city) => {
    setSelectedCities((prevSelected) =>
      prevSelected.includes(city)
        ? prevSelected.filter((c) => c !== city) // Remove city if already selected
        : [...prevSelected, city] // Add city if not selected
    );
    setChangedCities(true);
  };

  const handleVenueSelection = (venueId) => {
    setSelectedVenues((prevSelected) =>
      prevSelected.includes(venueId)
        ? prevSelected.filter((id) => id !== venueId) // Remove venue if already selected
        : [...prevSelected, venueId] // Add venue if not selected
    );
    setChangedVenues(true);
  };

 
 /* const handleDeleteAllMessages = async () => {
    if (window.confirm("Are you sure you want to delete all your chat messages? This action cannot be undone.")) {
      try {
        const user = auth.currentUser;
        if (user) {
          const messagesRef = ref(database, `messages/${user.uid}`);
          await remove(messagesRef);
          setError(null);
          alert("All chat messages have been deleted successfully.");
        } else {
          setError('No user is currently signed in.');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };
*/
  
const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
 
    try {
      // Update profile picture
      await handleUpdateProfilePicture();
  
      // Update username
      if (changedUserName) {
        await updateDoc(userRef, {
          displayName: changedUserName,
          updatedAt: new Date(), 
        });
        setSuccess("Username updated successfully.");
      }

      // Update cities
      if (changedCities) {
        await updateDoc(userRef, {
          datingLocations: selectedCities,
          updatedAt: new Date(), 
        });
        setSuccess("City selection updated successfully.");
      }

      // Update venues
      if (changedVenues) {
        await updateDoc(userRef, {
          datingVenues: selectedVenues,
          updatedAt: new Date(), 
        });
        setSuccess("Venue selection updated successfully.");
      }

      // Update password
      if (password) {
        await updatePassword(auth.currentUser, password);
        setSuccess('Password updated successfully.');
      }

      if(!changedUserName && !changedPic && !password && !changedCities && !changedVenues) {
        setError('No changes made.');
      }

      setChangedUserName(null);
      setChangedCities(false);
      setChangedVenues(false);


    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="AyaFormPage">
    <DashboardHeader/>
    <main className="form-page-content">
      <div className="form-page-container">
        <h2>Update your account settings</h2>
        <div className="form-page-form">
          <form onSubmit={handleUpdateProfile}>
            <Row className="mx-0">
              <Col sm={4}>
                {/* Profile Picture Upload */}
                <div className="profile-picture-container">
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profilePictureInput" className="profile-picture-label">
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="profile-picture"
                    />
                    <div className="overlay">
                      <span className="pen-icon">✏️</span>
                    </div>
                  </label>
                </div>
              </Col>
              <Col sm={8}>
                {/* Username Field */}
                <label className="text-start">
                  Username: 
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value); setChangedUserName(e.target.value);}}
                  />
                  </label>
                  <label className="text-start">
                  Email: {email}  </label>                
              </Col>
            </Row>

            {/* City Checkboxes */}
            <div className="city-selection">
              <label className="text-start" > Places where you want to meet people:
                <Row className="mx-0">
                  {cities.map((city) => (
                    <Col key={city} xs={4} className='px-0'>
                          <input
                            className="city-checkbox"
                            type="checkbox"
                            value={city}
                            checked={selectedCities.includes(city)}
                            onChange={() => handleCityChange(city)}
                          />
                          {city} 
                    </Col>
                  ))}
                </Row>
              </label>
              {/* Display Venues */}
              <div className="row">
                {venues.map((venue) => (
                  <Col key={venue.id} xs={6}>
                    <Card className={`venues-card ${selectedVenues.includes(venue.id) ? "" : "venue-unselected"}`} >
                      <Card.Body>
                        <Card.Title>
                          <input
                            type="checkbox"
                            className="venues-checkbox"
                            checked={selectedVenues.includes(venue.id)}
                            onChange={() => handleVenueSelection(venue.id)}
                          />
                          {venue.name}
                        </Card.Title>
                        <Card.Text>
                          <strong>Address:</strong> {venue.address} <br />
                          <strong>Price:</strong> {venue.price} <br />
                          <strong>City:</strong> {venue.city} <br />
                          <strong>Open Hours:</strong> {venue.openhours}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </div>
              {/* <label className="text-start" > Select your dating venues:
                <Row className="mx-0">
                  {cities.map((venue) => (
                    <Col key={venue.key} xs={4} className='px-0'>
                          <input
                            className="city-checkbox"
                            type="checkbox"
                            value={venue}
                            checked={selectedCities.includes(venue)}
                            onChange={() => handleCityChange(venue)}
                          />
                          {venue.name} 
                    </Col>
                  ))}
                </Row>
              </label> */}
            </div>
            {/* Password Field */}
            <label className="text-start">
              Password:
              <input
                className="w-100"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {/* Submit and Other Action Buttons */}
            <button type="submit" className="submit-button mb-3 w-100">
              Save Changes
            </button>
            {/* <button type="button" onClick={handleDeleteAllMessages} className="delete-button mb-3">
              Delete All Chat
            </button>*/}
            <button type="button" onClick={handleDeleteAccount} className="delete-button mb-3">
              Delete Account
            </button>
          </form>
        </div>

        {/* Alert Messages */}
        <Alert message={error} type="error" />
        <Alert message={success} type="success" />

        {/* Back to Dashboard Link */}
        <Link to="/dashboard" className="back-to-dashboard mb-6">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default AccountSettings;
