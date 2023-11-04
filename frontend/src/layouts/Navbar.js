import React from 'react';

import styles from '../css/Navbar.module.css';

function Navbar() {
   return (
      <>
         <nav>
            <div className={styles.left}>
               <h2>AQIP</h2>
               <p>-Air Quality in Ploiesti-</p>
            </div>
            <div className={styles.right}>
               <a href='./'>
                  Home
               </a>
               <a href='#'>
                  Login
               </a>
            </div>
         </nav>
      </>
   );
}

export default Navbar;
