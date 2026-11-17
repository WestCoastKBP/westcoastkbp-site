export const services = ['siding','windows','remodeling','ADU'] as const;
export type Lead = { name:string; phone:string; email:string; location:string; service:string; timing:string; message:string; source:Record<string,string>; area:string; createdAt:string; photos:string[] };
export function validate(data: FormData): string[] {
 const errors:string[]=[];
 for(const [key,max] of Object.entries({name:100,phone:30,email:254,location:100,service:30,timing:100,message:4000})) {
  const v=data.get(key); if(typeof v!=='string'||!v.trim()||v.length>max) errors.push(key);
 }
 const email=String(data.get('email')||''); if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
 const phone=String(data.get('phone')||''); if(phone && (!/^[+\d\s().-]+$/.test(phone)||phone.replace(/\D/g,'').length<10)) errors.push('phone');
 if(!services.includes(String(data.get('service')) as typeof services[number])) errors.push('service');
 return [...new Set(errors)];
}
export function captureSource(url:string, referrer:string):Record<string,string> {
 let u:URL; try {u=new URL(url); if(!['http:','https:'].includes(u.protocol)) return {};} catch{return {}};
 const out:Record<string,string>={landingPage:u.origin+u.pathname};
 for(const [k,v] of u.searchParams) if((k.startsWith('utm_') || k==='gclid'||k==='fbclid') && /^[a-z0-9_]{1,40}$/.test(k)) out[k]=v.slice(0,500);
 try {const ref=new URL(referrer); if(['http:','https:'].includes(ref.protocol)) out.referrer=ref.origin+ref.pathname;} catch {}
 return out;
}
// Conservative known localities; an unknown result is not a rejection or a distance claim.
export function serviceArea(input:string):'inside'|'unknown' {
 const value=input.trim().toLowerCase();
 return /^(roseville|sacramento|rocklin|lincoln|citrus heights|granite bay|folsom|orangevale|fair oaks|95661|95678|95677|95747|95765|95630|95610)$/.test(value)?'inside':'unknown';
}
