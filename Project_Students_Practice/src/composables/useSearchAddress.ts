import axios from 'axios';

// Función para buscar la dirección en Nominatim
const searchAddress = async (address: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`;

  try {
    const response = await axios.get(url);
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error al buscar la dirección:', error);
    return null;
  }
};

export default searchAddress;