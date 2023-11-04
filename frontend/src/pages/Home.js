import React, { useEffect, useState, useRef  } from 'react';
import styles from '../css/Home.module.css';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import leaflet from 'leaflet';
import { Chart, Series } from 'devextreme-react/chart';

import 'leaflet/dist/leaflet.css';

function Home() {

  const mapRef = useRef(null);
  const[dataFetch, setDataFetch] = useState(undefined);
  const[data, setData] = useState(undefined);
  const[menuUUID, setMenuUUID] = useState(undefined);
  const[isActiveMenu, setIsActiveMenu] = useState(false);

  const[dataSourceChart1, setDataSourceChart1] = useState([]);

  const[lastPM10, setlastPM10] = useState(0);


  var IAQIs = [];
  var CAQI = "";

  const center = [44.9388, 26.0247];
  const ploiestiBounds = [
    [44.8835, 25.9742],
    [44.9937, 26.0671]
  ];



  const handleZoomToCoordinates = (coordinates, zoomLevel) => {
    mapRef.current.setView(coordinates, zoomLevel); 
  };

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
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.20.10.4:3003/values',{
          method: 'GET',
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Eroare:', error);
      }
    };

    fetchData();
    fetchDevice();
  }, []);
  
  const customIcon_yellow = new leaflet.Icon({
    iconUrl: "https://htmlcolorcodes.com/assets/images/colors/pastel-yellow-color-solid-background-1920x1080.png",
    iconSize: [20, 20],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const customIcon_orange = new leaflet.Icon({
    iconUrl: "https://t4.ftcdn.net/jpg/03/29/19/15/360_F_329191596_tRQiV7LZjTZtuPM09QyOS09HV1D9VimE.jpg",
    iconSize: [20, 20],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const customIcon_red = new leaflet.Icon({
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Red_Color.jpg/1536px-Red_Color.jpg",
    iconSize: [20, 20],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const customIcon_green = new leaflet.Icon({
    iconUrl: "https://htmlcolorcodes.com/assets/images/colors/light-green-color-solid-background-1920x1080.png",
    iconSize: [20, 20],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const customIcon_purple = new leaflet.Icon({
    iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYceTuCriHMbYRfZAUhMpyoGLxOmKQzmpOEzpTAQcdOFf0_bBejIWVrZ1W8ic3RLt1kMQ&usqp=CAU",
    iconSize: [20, 20],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  function calculateIAQI_PM10(concentration) {
    const breakpoints = [0, 25, 50, 90, 180, 300, 600];
    const IAQI_values = [0, 50, 100, 200, 300, 400, 500];
    
    let IAQI = 0;
    for (let i = 0; i < breakpoints.length - 1; i++) {
      if (concentration >= breakpoints[i] && concentration <= breakpoints[i + 1]) {
        IAQI = ((concentration - breakpoints[i]) / (breakpoints[i + 1] - breakpoints[i])) * (IAQI_values[i + 1] - IAQI_values[i]) + IAQI_values[i];
        break;
      }
    }
    return IAQI;
  }
  function calculateIAQI_PM25(concentration) {
    const breakpoints = [0, 15, 30, 55, 110, 250, 500];
    const IAQI_values = [0, 50, 100, 150, 200, 300, 400];
  
    let IAQI = 0;
    for (let i = 0; i < breakpoints.length - 1; i++) {
      if (concentration >= breakpoints[i] && concentration <= breakpoints[i + 1]) {
        IAQI = ((concentration - breakpoints[i]) / (breakpoints[i + 1] - breakpoints[i])) * (IAQI_values[i + 1] - IAQI_values[i]) + IAQI_values[i];
        break;
      }
    }
    return IAQI;
  }

  function calculateCAQI(IAQIs) {
    if (IAQIs.length === 0) {
      return null;
    }
    return Math.max(...IAQIs);
  }

  const handlePopupOpen = (uuid) => {
    setMenuUUID(uuid);
    setIsActiveMenu(true);
  };

  const handleCloseMenu = () => {
    setIsActiveMenu(false);
  }

  return (
    <>
      <MapContainer 
        ref={mapRef}
        id = "details"
        className={styles.map}
        center={center}
        zoom={14}
        maxBounds={ploiestiBounds}
        scrollWheelZoom={false}
        minZoom={13}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {
          dataFetch && dataFetch.map((object, key ) => {
            
            const IAQIs = [];
            
            data && data.map((object2, key2 ) =>{
              var date = new Date(object2.added_on);
              if(object2.uuid === object.uuid){
                if(date.getFullYear() === (new Date()).getFullYear() &&
                  date.getMonth() === (new Date()).getMonth() &&
                  date.getDate() === (new Date()).getDate() - 1)
                {
                  const IAQI_PM10 = calculateIAQI_PM10(parseInt(object2.pm1) / 1000);
                  const IAQI_PM25 = calculateIAQI_PM25(parseInt(object2.pm25)  / 1000);

                  IAQIs.push(IAQI_PM10, IAQI_PM25);
                }
              }
            });
            
            const CAQI = calculateCAQI(IAQIs);
            
            if(CAQI > 0 && CAQI != undefined){
              return (
                <Marker id = {object.uuid} key={key}  eventHandlers={{ click: (e) => { handlePopupOpen(object.uuid)}}} position={[object.lat, object.longi]} icon={CAQI <= 25 ? customIcon_green : CAQI <= 50 ? customIcon_yellow : CAQI <= 75 ? customIcon_orange: CAQI <= 100 ? customIcon_red : customIcon_purple}>
                </Marker>
              );
            }
            
          })
        }
      </MapContainer>
      
      {
        menuUUID && isActiveMenu === true && (
          <div className={styles.menu}>
            <button onClick={handleCloseMenu} className={styles.menuClose}>X</button>

            {  
              data && data.map((object2, key2 ) =>{
                var date = new Date(object2.added_on);
                
                if(object2.uuid === menuUUID){
                  if(date.getFullYear() === (new Date()).getFullYear() &&
                    date.getMonth() === (new Date()).getMonth() &&
                    date.getDate() === (new Date()).getDate() - 1)
                  {
                    const IAQI_PM10 = calculateIAQI_PM10(parseInt(object2.pm1) / 1000);
                    const IAQI_PM25 = calculateIAQI_PM25(parseInt(object2.pm25)  / 1000);

                    IAQIs.push(IAQI_PM10, IAQI_PM25);
                  }
                }
              })
            }

            {

              CAQI = calculateCAQI(IAQIs)
            }

            {
              lastPM10 && (
                <>
                  <div className={styles.top}>
                    <h1>Regina Maria Dorohoi Botosani</h1>
                    <div className={styles.info}>
                      <h2>15</h2>
                      <h3>Airly CAQI</h3>
                    </div>
                  </div>
                  <div className={styles.middle}>
                    <div className={styles.section}>
                      <p>• Ultimul rezultat la ora: {new Date().toLocaleString("ro-RO")}</p>
                    </div>
                    <div className={styles.section}>
                      <h3 className={styles.title}>Particule</h3>
                      <div className={styles.info}>
                        <p>PM10</p>
                        <p>{(lastPM10 / 50) * 100}% <span><h3>{lastPM10}</h3>  <p>µg/m³</p></span></p>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <div className={styles.info}>
                        <p>PM25</p>
                        <p>29% <span><h3>14</h3>  <p>µg/m³</p></span></p>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <div className={styles.info}>
                        <p>CO<sub>2</sub></p>
                        <p>29</p>
                      </div>
                    </div>
                    <div className={styles.sectionSpecial}>
                      <div className={styles.info}>
                        <p>Umid</p>
                        <p>29%</p>
                      </div>
                    </div>
                    <div className={styles.sectionSpecial}>
                      <div className={styles.info}>
                        <p>Temp</p>
                        <p>29°C</p>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial1}>Prognoza calitatii aerului</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart1}>
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="CAQI"
                          type="bar"
                          color="#818FB4" />
                      </Chart>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            
          </div>
        )
      }

    </>
  );
}

export default Home;
