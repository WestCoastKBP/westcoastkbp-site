'use client';
import {useState} from 'react';
import Script from 'next/script';
export default function Inquiry(){
 const [status,setStatus]=useState(''); const [busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setStatus('');const form=e.currentTarget;const data=new FormData(form);data.set('landingPage',sessionStorage.getItem('leadLanding')||location.href);data.set('referrer',sessionStorage.getItem('leadReferrer')||'');try {const res=await fetch('/api/inquiry',{method:'POST',body:data});const body=await res.json();if(!res.ok) throw new Error(body.error);setStatus('Your request was received.');form.reset();}catch(e){setStatus(e.message||'Unable to submit. Please try again.');}finally{setBusy(false);}}
 return <main><h1>Inquiry</h1><form onSubmit={submit}>
 {[[ 'name','Name','text'],['phone','Phone','tel'],['email','Email','email'],['location','Town or ZIP','text']].map(([n,l,t])=><p key={n}><label>{l} <input name={n} type={t} required maxLength={n==='email'?254:100}/></label></p>)}
 <p><label>Service <select name="service" required defaultValue=""><option value="" disabled>Select</option>{['siding','windows','remodeling','ADU'].map(x=><option key={x} value={x}>{x}</option>)}</select></label></p>
 <p><label>Timing <input name="timing" required maxLength={100}/></label></p><p><label>Message <textarea name="message" required maxLength={4000}/></label></p><p><label>Photos (up to 3, 3.5 MB each, 4 MB total; JPEG, PNG or WebP) <input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple/></label></p>
 <div hidden><label>Website <input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer/><div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}/></>}
 <button disabled={busy}>{busy?'Submitting…':'Submit'}</button></form><p role="status" aria-live="polite">{status}</p></main>;
}
