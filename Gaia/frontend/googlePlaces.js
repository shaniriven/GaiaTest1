const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const getPlaces = async (query) => {
  try {
    const response = await client.places({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY,
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { getPlaces };