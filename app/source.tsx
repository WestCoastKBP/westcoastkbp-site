'use client';
import {useEffect} from 'react';
export default function Source(){useEffect(()=>{if(!sessionStorage.getItem('leadLanding')) {sessionStorage.setItem('leadLanding',location.href);sessionStorage.setItem('leadReferrer',document.referrer);}},[]);return null;}
