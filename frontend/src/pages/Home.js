import React, { useEffect, useState } from 'react';
import styles from '../css/Home.module.css';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import leaflet from 'leaflet';

import 'leaflet/dist/leaflet.css';

function Home() {

  
  const[dataFetch, setDataFetch] = useState(undefined);

  const center = [44.9388, 26.0247];
  const ploiestiBounds = [
    [44.8835, 25.9742],
    [44.9937, 26.0671]
  ];

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch('http://172.20.10.4:3003/devices',{
          method: 'GET',
        });
        const jsonData = await response.json();
        setDataFetch(jsonData);
      } catch (error) {
        console.error('Eroare:', error);
      }
    };

    fetchDevice();
  }, []);
  
  const customIcon = new leaflet.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2540/2540201.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <>
      <MapContainer
        id = "details"
        className={styles.map}
        center={center}
        zoom={14}
        maxBounds={ploiestiBounds}
        minZoom={13}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {
          dataFetch && dataFetch.map((object, key ) =>(
            <Marker key={key} position={[object.lat, object.longi]} icon={customIcon}>
              <Popup>
                <b>Nume: </b> {object.name}
                <br />
                <b>Uuid: </b>{object.uuid}
                <br />
                <b>Lat: </b>{object.lat} <b>Long: </b>{object.longi}
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>

      <div className={styles.sensors}>
        <h1>Senzori</h1>
        <div className={styles.contain}>
          <div className={styles.cards}>
            <div className={styles.row}>
              <h1>UUID: 321-312-312-312</h1>
            </div>
            <div className={styles.row}>
              <h2>Nume: Gigel</h2>
            </div>
            <div className={styles.row}>
              <a href='#details'>Detalii</a>
              <button>Vezi senzor</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
