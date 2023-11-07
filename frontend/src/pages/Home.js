import React, { useEffect, useState, useRef  } from 'react';
import styles from '../css/Home.module.css';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import leaflet from 'leaflet';
import { Chart, Series, ArgumentAxis, Label } from 'devextreme-react/chart';

import 'leaflet/dist/leaflet.css';

function Home() {

  const mapRef = useRef(null);
  const[dataFetch, setDataFetch] = useState(undefined);
  const[data, setData] = useState(undefined);
  const[menuUUID, setMenuUUID] = useState(0);
  const[isActiveMenu, setIsActiveMenu] = useState(false);

  const[dataSourceChart1, setDataSourceChart1] = useState([]);
  const[dataSourceChart2, setDataSourceChart2] = useState([]);
  const[dataSourceChart3, setDataSourceChart3] = useState([]);
  const[dataSourceChart4, setDataSourceChart4] = useState([]);
  const[dataSourceChart5, setDataSourceChart5] = useState([]);
  const[dataSourceChart6, setDataSourceChart6] = useState([]);

  const[lastPM10, setlastPM10] = useState(0);
  const[lastPM25, setlastPM25] = useState(0);
  const[CAQIFront, setCAQIFront] = useState(0);
  const[h2Front, setH2Front] = useState(0);
  const[tempFront, settempFront] = useState(0);
  const[humFront, sethumFront] = useState(0);
  const[streetFront, setstreetFront] = useState(undefined);
  const[latFront, setLatFront] = useState(undefined);
  const[longFront, setLongFront] = useState(undefined);
  

  

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
    load_menu_fetch(uuid);
    console.log(uuid);
  };

  const handleCloseMenu = () => {
    setIsActiveMenu(false);
  }

  function load_menu_fetch (uuid){
    var IAQIs = [];
    var hum = 0, counter = 0;
    var temp = 0;
    var h2 = 0;

    dataFetch && dataFetch.map((object, key ) => {
      if(object.uuid === uuid){
        setstreetFront(object.street);
        setLatFront(object.lat);
        setLongFront(object.longi);
      }
    });

    data && data.map((object2, key2 ) => {
      var date = new Date(object2.added_on);
      
      if(object2.uuid === uuid){
        if(date.getFullYear() === (new Date()).getFullYear() &&
          date.getMonth() === (new Date()).getMonth() &&
          date.getDate() === (new Date()).getDate() - 1)
        {
          const IAQI_PM10 = calculateIAQI_PM10(parseInt(object2.pm1) / 1000);
          const IAQI_PM25 = calculateIAQI_PM25(parseInt(object2.pm25)  / 1000);

          IAQIs.push(IAQI_PM10, IAQI_PM25);
          if(IAQI_PM10 > 0)
            setlastPM10(IAQI_PM10);
          if(IAQI_PM25 > 0)
            setlastPM25(IAQI_PM25);

          hum += parseInt(object2.humidity);
          temp += parseInt(object2.temperature);
          h2 += parseInt(object2.mqvalue);
          counter++;
        }
      }
    });

    

    for(let i = 0; i < 24; i++){
      let tempmed = 0, hummed = 0, h2med = 0, pm10 = 0, pm25 = 0, coutnerchart = 0;
      let IAQIschart = [];
      data && data.map((object2, key2 ) => {
        var date = new Date(object2.added_on);
        if(object2.uuid === uuid){
          //date.getFullYear() === (new Date()).getFullYear() &&
          //date.getMonth() === (new Date()).getMonth() &&
          //date.getDate() === (new Date()).getDate()

          if(true)
          {
            
            const IAQI_PM10 = calculateIAQI_PM10(parseInt(object2.pm1) / 1000);
            const IAQI_PM25 = calculateIAQI_PM25(parseInt(object2.pm25)  / 1000);

            IAQIschart.push(IAQI_PM10, IAQI_PM25);

            hummed += parseInt(object2.humidity);
            tempmed += parseInt(object2.temperature);
            h2med += parseInt(object2.mqvalue);

            pm10 += parseInt(object2.pm1);
            pm25 += parseInt(object2.pm25);
            coutnerchart++;
          }
        }
      });
      hummed /= coutnerchart;
      tempmed /= coutnerchart;
      h2med /= coutnerchart;
      pm10 /= coutnerchart;
      pm25 /= coutnerchart;

      const CAQIchart = calculateCAQI(IAQIschart);
      setDataSourceChart1(prevData => [...prevData, {value: CAQIchart, hours: i}]);
      setDataSourceChart2(prevData => [...prevData, {value: tempmed, hours: i}]);
      setDataSourceChart3(prevData => [...prevData, {value: hummed, hours: i}]);
      setDataSourceChart4(prevData => [...prevData, {value: h2med, hours: i}]);
      setDataSourceChart5(prevData => [...prevData, {value: pm10, hours: i}]);
      setDataSourceChart6(prevData => [...prevData, {value: pm25, hours: i}]);
    }

    hum /= counter;
    temp /= counter;
    h2 /= counter;

    setH2Front(parseFloat(h2));
    sethumFront(parseFloat(hum));
    settempFront(parseFloat(temp));
    
    const CAQI = calculateCAQI(IAQIs);

    setCAQIFront(CAQI);
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
                //date.getFullYear() === (new Date()).getFullYear() &&
                //date.getMonth() === (new Date()).getMonth() &&
                //date.getDate() === (new Date()).getDate()

                if(true)
                {
                  const IAQI_PM10 = calculateIAQI_PM10(parseInt(object2.pm1) / 1000);
                  const IAQI_PM25 = calculateIAQI_PM25(parseInt(object2.pm25)  / 1000);

                  IAQIs.push(IAQI_PM10, IAQI_PM25);
                }
              }
            });
            
            if(IAQIs.length != 0){

              const CAQI = calculateCAQI(IAQIs);
              
              if(CAQI > 0 || CAQI != null){
                return (
                  <Marker id = {object.uuid} key={key}  eventHandlers={{ click: (e) => { handlePopupOpen(object.uuid)}}} position={[object.lat, object.longi]} icon={CAQI <= 25 ? customIcon_green : CAQI <= 50 ? customIcon_yellow : CAQI <= 75 ? customIcon_orange: CAQI <= 100 ? customIcon_red : customIcon_purple}>
                  </Marker>
                );
              }
            }
            
          })
        }
      </MapContainer>
      
      {
        menuUUID !== 0 && isActiveMenu === true && (
          <div className={styles.menu}>
            <button onClick={handleCloseMenu} className={styles.menuClose}>X</button>

            {
              lastPM10 !== 0 && lastPM25 !== 0 && (
                <>
                  <div className={styles.top}>
                    <h1>{streetFront}</h1>
                    <p>Latitudine: {latFront} Longitudine: {longFront}</p>
                    <div className={styles.info}>
                      <h2>{Number(CAQIFront).toFixed(0)}</h2>
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
                        <p>{Number((lastPM10 / 50) * 100).toFixed(2)}% <span><h3> {Number(lastPM10).toFixed(2)}</h3>  <p>µg/m³</p></span></p>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <div className={styles.info}>
                        <p>PM25</p>
                        <p>{Number((lastPM25/ 50) * 100).toFixed(2)}% <span><h3> {Number(lastPM25).toFixed(2)}</h3>  <p>µg/m³</p></span></p>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <div className={styles.info}>
                        <p>H<sub>2</sub></p>
                        <p>{Number(h2Front).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className={styles.sectionSpecial}>
                      <div className={styles.info}>
                        <p>Umid</p>
                        <p>{Number(humFront).toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className={styles.sectionSpecial}>
                      <div className={styles.info}>
                        <p>Temp</p>
                        <p>{Number(tempFront).toFixed(2)}°C</p>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial2}>Grafic CAQI</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart1} >
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="CAQI"
                          type="bar"
                          color="#818FB4" />
                        <ArgumentAxis showLabels={true} tickInterval={1}/> 
                      </Chart>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial3}>Grafic temperatura</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart2}>
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="Temp"
                          type="bar"
                          color="#818FB4" />
                        <ArgumentAxis showLabels={true} tickInterval={1}/> 
                      </Chart>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial4}>Grafic umiditate</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart3}>
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="Umid"
                          type="bar"
                          color="#818FB4" />
                        <ArgumentAxis showLabels={true} tickInterval={1}/> 
                      </Chart>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial5}>Grafic H2</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart4}>
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="H2"
                          type="bar"
                          color="#818FB4" />
                        <ArgumentAxis showLabels={true} tickInterval={1}/> 
                      </Chart>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial6}>Grafic PM10</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart5}>
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="PM10"
                          type="bar"
                          color="#818FB4" />
                        <ArgumentAxis showLabels={true} tickInterval={1}/> 
                      </Chart>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.title + " " + styles.titleSpecial7}>Grafic PM25</h3>
                      <div className={styles.info}>
                      <Chart className={styles.chart} dataSource={dataSourceChart6}>
                        <Series
                          valueField="value"
                          argumentField="hours"
                          name="PM25"
                          type="bar"
                          color="#818FB4" />
                        <ArgumentAxis showLabels={true} tickInterval={1}/> 
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
