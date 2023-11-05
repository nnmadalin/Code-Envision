import React, { useEffect, useState, useRef } from 'react';
import styles from '../css/Admin.module.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'leaflet/dist/leaflet.css';

function Admin() {

   const[isAuth, setIsAuth] = useState(false);
   const [deviceLocation, setDeviceLocation] = useState({});
   const [deviceName, setDeviceName] = useState({});
   const [deviceLat, setDeviceLat] = useState({});
   const [deviceLong, setDeviceLong] = useState({});
   const [formData, setFormData] = useState({ username: '', password: '' });


   const notify_error = (customMessage) => {
      toast.error(customMessage, {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: false,
         draggable: true,
         progress: undefined,
         theme: "colored",
      });
   };
   const notify_warn = (customMessage) => {
      toast.warn(customMessage, {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: false,
         draggable: true,
         progress: undefined,
         theme: "colored",
      });
   };
   const notify_success = (customMessage) => {
      toast.success(customMessage, {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: false,
         draggable: true,
         progress: undefined,
         theme: "colored",
      });
   };
   const notify = (customMessage) => {
      toast.info(customMessage, {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: false,
         draggable: true,
         progress: undefined,
         theme: "colored",
      });
   };

   const navigate = useNavigate();


   const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.username.trim() === '' || formData.password.trim() === '') {
         notify_error("Toate casetele sunt obligatorii!");
         return;
      }
      try {
         const response = await fetch('http://172.20.10.4:3003/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username: formData.username,
               password: formData.password,
            }),
         });
         if (response.ok) {
            notify_success("Autentificat cu succes!");
            setIsAuth(true);
         }
         else {
            notify_error("Username si/sau parola gresita!");
            setFormData(prevState => ({
               ...prevState,
               password: ''
            }));
         }

      } catch (error) {
         console.error('Eroare:', error);
         setFormData(prevState => ({
            ...prevState,
            password: ''
         }));
      }
   };

   const [devices, setDevices] = useState(null);
      
   useEffect(() => {
      const getDevices = async () => {
         const response = await fetch('http://172.20.10.4:3003/devices', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         });
         if (response.ok) {
            const jsonData = await response.json();
            setDevices(jsonData);
         }
      };
      getDevices();
   }, []);


   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleChangeLocation = (e, uuid) => {
      const { value } = e.target;
      setDeviceLocation(prevValue => {
         const updatedValues = { ...prevValue, [uuid]: value };
         return updatedValues;
      });
      console.log(deviceLocation);
   };
   
   const handleChangeName = (e, uuid) => {
      const { value } = e.target;
      setDeviceName(prevValue => {
         const updatedValues = { ...prevValue, [uuid]: value };
         return updatedValues;
      });
   };

   const handleChangeLat = (e, uuid) => {
      const { value } = e.target;
      setDeviceLat(prevValue => {
         const updatedValues = { ...prevValue, [uuid]: value };
         return updatedValues;
      });
   };
   const handleChangeLong = (e, uuid) => {
      const { value } = e.target;
      setDeviceLong(prevValue => {
         const updatedValues = { ...prevValue, [uuid]: value };
         return updatedValues;
      });
   };

   const delete_device = async (e) => {
      var answer = window.confirm("Esti sigur ca vrei sa stergi dispozitivul?");
      if(answer){
         const response = await fetch('http://172.20.10.4:3003/devices?uuid=' + e.target.value, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username: formData.username,
               password: formData.password,
            }),
         });
         if (response.ok){
            notify_success("Sters!");
         }
         else{
            notify_error("Ceva nu a mers bine!");
         }
      }
   };

   const update_device = async (e) => {
      var answer = window.confirm("Esti sigur ca vrei sa modifici dispozitivul?");
      if(answer){
         const response = await fetch('http://172.20.10.4:3003/devices?uuid=' + e.target.value, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username: formData.username,
               password: formData.password,
               street:deviceLocation[e.target.value],
               long:deviceLong[e.target.value],
               lat:deviceLat[e.target.value],
               name:deviceName[e.target.value],
            }),
         });
         if (response.ok){
            notify_success("Modificat!");
         }
         else{
            notify_error("Ceva nu a mers bine!");
         }
      }
   };


   if(isAuth === false){
      return (
         <>
            <main className={styles.main}>
               <form className={styles.form} onSubmit={handleSubmit}>
                  <h1>Admin Panel</h1>

                  <br />

                  <div className={styles.row}>
                     <p>Username</p>
                     <input type="username" name="username" value={formData.username} onChange={handleChange} />
                  </div>

                  <div className={styles.row}>
                     <p>Password</p>
                     <input type="password" name="password" value={formData.password} onChange={handleChange} />
                  </div>

                  <div className={styles.row}>
                     <button type='submit'>Login</button>
                  </div>
               </form>
            </main>
            <ToastContainer
               position="top-right"
               autoClose={5000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss={false}
               draggable
               pauseOnHover={false}
               theme="light"
            />
         </>
      );
   }
   else{
      return (
         <>
            <main className={styles.mainPage}>
               <h1>Dispozitive</h1>
               <div className={styles.rowPage}>
                  <div className={styles.cards}>
                     {
                        devices && devices.map((object, key) => {
                           deviceLocation[object["uuid"]] = object["street"];
                           deviceName[object["uuid"]] = object["name"];
                           deviceLat[object["uuid"]] = object["lat"];
                           deviceLong[object["uuid"]] = object["longi"];
                           
                           return (
                              <div key={key} className={styles.card} >
                                 <div className={styles.row}>
                                    <p>UUID:</p>
                                    <input value={object["uuid"]} disabled/>
                                 </div>
                                 <div className={styles.row}>
                                    <p>Nume:</p>
                                    <input type="text" defaultValue={deviceName[object["uuid"]]} name="name" onChange={(e) => handleChangeName(e, object["uuid"])}/>
                                 </div>
                                 <div className={styles.row}>
                                    <p>Locatie:</p>
                                    <input type="text" defaultValue={deviceLocation[object["uuid"]]} name="location" onChange={(e) => handleChangeLocation(e, object["uuid"])}/>
                                 </div>
                                 <div className={styles.row}>
                                    <p>Lat:</p>
                                    <input type="text" defaultValue={deviceLat[object["uuid"]]} name="lat" onChange={(e) => handleChangeLat(e, object["uuid"])}/>
                                 </div>
                                 <div className={styles.row}>
                                    <p>Long:</p>
                                    <input type="text" defaultValue={deviceLong[object["uuid"]]} name="long" onChange={(e) => handleChangeLong(e, object["uuid"])}/>
                                 </div>

                                 <br />
                                 <div className={styles.row}>
                                    <button onClick={update_device} value={object["uuid"]}>Modifica dispozitiv</button>
                                    <button onClick={delete_device} value={object["uuid"]}>Sterge dispozitiv</button>
                                 </div>
                              </div>
                           );
                        })
                     }
                  </div>
               </div>
            </main>
            <ToastContainer
               position="top-right"
               autoClose={5000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss={false}
               draggable
               pauseOnHover={false}
               theme="light"
            />
         </>
      );
   }
}

export default Admin;
