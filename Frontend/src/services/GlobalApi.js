import axios from "axios"

const BASE_URL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place";
const API_KEY="AIzaSyAyz0KbO8Wr6hnOFl3BvnVamL12W-dZ64o"

const nearByPlace = async (lat, lng, type) => {
  console.log("Making API request with:", { lat, lng, type });
  try {
    const url = `${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=15000&type=${type}&keyword=temple,gaushala,cow&key=${API_KEY}`;
    console.log("Request URL:", url);
    return await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("GlobalApi Error:", error);
    throw error;
  }
};
      
export default {
    nearByPlace
}