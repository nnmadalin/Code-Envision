import React, { useEffect, useState, useRef } from 'react';
import styles from '../css/Admin.module.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'leaflet/dist/leaflet.css';

function Admin() {

   const[isAuth, setIsAuth] = useState(false);

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
            credentials: 'include',
         });
         if (response.ok) {
            notify_success("Autentificat cu succes!");
            window.location.href = './dashboard';
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


   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };


   if(isAuth == false){
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
         </>
      );
   }
}

export default Admin;
