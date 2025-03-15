//import { getDatabase, ref, onValue, push, query, orderByChild, equalTo, startAt, endAt } from "firebase/database";
import { getFirestore, collection, doc, documentId, addDoc, query, where, onSnapshot, getDoc, getDocs} from "firebase/firestore";

export const Date_Manager = (userId) => {
    const db = getFirestore();

    const createDate = async (args) => {
        const datesRef = collection(db, `dates`);
        const AyaDate = {
          location: args.locationId,
          time: args.time,
          users: [userId, args.matchUserId],
          confirmedUsers: []
        };
        console.log(AyaDate);
        await addDoc(datesRef, AyaDate);
        const functionResponse = {
          infoToUser: "Date created successfully at " + args.time + " at Y2 Cafe. Check Dates section for further details and to confirm."
        }
      return functionResponse;
      };

    const getLocations = async (userId2) => {
      try {
        const user1Ref = doc(db, "users", userId);
        const user2Ref = doc(db, "users", userId2);
    
        const [user1Doc, user2Doc] = await Promise.all([getDoc(user1Ref), getDoc(user2Ref)]);
    
        if (!user1Doc.exists() || !user2Doc.exists()) {
          throw new Error("One or both user documents do not exist.");
        }
    
        const user1Venues = user1Doc.data().datingVenues || [];
        const user2Venues = user2Doc.data().datingVenues || [];
        console.log(user1Venues, user2Venues);
        // Find overlapping venues
        const overlappingVenueIds = user1Venues.filter((venueId) => user2Venues.includes(venueId));
    
        if (overlappingVenueIds.length === 0) {
          return {CommonVenues: "No common venues found, please select other venues in Account settings for this match."}; // No overlapping venues
        }
        console.log(overlappingVenueIds);
    
        // Fetch details of overlapping venues
        const venuesRef = collection(db, "venues");
        const q = query(venuesRef, where(documentId(), "in", overlappingVenueIds));
    
        const snapshot = await getDocs(q);
    
        // Map the results to an array of venue documents
        const overlappingVenues = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(overlappingVenues);
    
        return {CommonVenues: overlappingVenues};
      } catch (error) {
        console.error("Error fetching overlapping venues:", error);
        throw error;
      }


      /*const functionResponse = {
        locationId: "loc1",
        openingHours: "Tue-Sun, 10-17",
        address: "220 Chapel St, Salford M3 5LE, United Kingdom"
      }
    return functionResponse;*/
    };

    const setLocations = async (locations) => {
    console.log("set new location array - TO BE IMPLEMENTED");
    };

    const confirmDate = async (locations) => {
        console.log("set new location array - TO BE IMPLEMENTED");
        };

    const getDates = (setDateList) => {
      const datesRef = collection(db, `dates`);
      const datesQuery = query(datesRef, where("users", "array-contains", userId));
      return onSnapshot(datesQuery, (snapshot) => {
        if (!snapshot.empty) {
          const dateList = snapshot.docs.map((doc) => ({
            id: doc.id, // Document ID
            ...doc.data(), // Spread the document fields
          }));
          for(let d of dateList){
            d.photo = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
            d.name = "Olga";
            if(d.id === "gU4JPLUuTbRCyqOEObKC") {
              d.confirmed = {};
              d.confirmed.me = true;
              d.confirmed.other = true;
            } else if (d.id === "ry80lLBEN8rFOfs110ep"){
              d.confirmed = {};
              d.confirmed.me = true;
              d.confirmed.other = false;
            } else {
              d.confirmed = {};
              d.confirmed.me = false;
              d.confirmed.other = false;
            }
            
          }
          setDateList(dateList); // Assuming setDateList is a state-setting function
        } else {
          console.log("No dates found");
        }
      });
    };

    const getDateConfirmedStatus = async (date) => {
        console.log("getDateConfirmedStatus - TO BE IMPLEMENTED");
        return true;
    };

    return {
        getLocations:getLocations,
        setLocations:setLocations,
        createDate:createDate,
        confirmDate:confirmDate,
        getDates:getDates,
        getDateConfirmedStatus:getDateConfirmedStatus
      };
}


