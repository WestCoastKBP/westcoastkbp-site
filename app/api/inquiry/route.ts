import {captureSource,serviceArea,validate,type Lead} from '../../../lib/lead';
import {stores} from '../../../lib/storage';
import {NextRequest,NextResponse} from 'next/server';
export const runtime='nodejs';
const hits=new Map<string,number[]>();
export async function POST(req:NextRequest){
 const length=Number(req.headers.get('content-length')); if(!length||length>4_000_000) return NextResponse.json({error:'Request too large.'},{status:413});
 const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0] || 'local'; const now=Date.now(); const recent=(hits.get(ip)||[]).filter(t=>now-t<600_000); if(recent.length>=5) return NextResponse.json({error:'Please try again later.'},{status:429}); recent.push(now);hits.set(ip,recent); if(hits.size>10000) hits.clear();
 try {
 const data=await req.formData(); if(data.get('website')) return NextResponse.json({ok:true});
 const errors=validate(data); if(errors.length) return NextResponse.json({error:'Please check the form.',fields:errors},{status:400});
 if(process.env.TURNSTILE_ENABLED==='true') {const secret=process.env.TURNSTILE_SECRET_KEY;const token=data.get('cf-turnstile-response');if(!secret||typeof token!=='string') return NextResponse.json({error:'Verification unavailable.'},{status:503}); const body=new URLSearchParams({secret,response:token});const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body});if(!result.ok||!(await result.json()).success) return NextResponse.json({error:'Verification failed.'},{status:400});}
 const files=data.getAll('photos').filter((f):f is File=>f instanceof File && f.size>0); if(files.length>3) return NextResponse.json({error:'Maximum 3 photos.'},{status:400});
 const checked:{bytes:Buffer;type:string}[]=[]; for(const file of files){if(file.size>3_500_000) return NextResponse.json({error:'Each photo must be under 3.5 MB.'},{status:400});const bytes=Buffer.from(await file.arrayBuffer());const type=bytes.subarray(0,3).equals(Buffer.from([255,216,255]))?'image/jpeg':bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?'image/webp':'';if(!type||type!==file.type) return NextResponse.json({error:'Use JPEG, PNG or WebP photos.'},{status:400});checked.push({bytes,type});}
 const store=stores();const photos:string[]=[];for(const f of checked) photos.push(await store.photo.save(f.bytes,f.type));
 const get=(k:string)=>String(data.get(k)||'').trim(); const lead:Lead={name:get('name'),phone:get('phone'),email:get('email'),location:get('location'),service:get('service'),timing:get('timing'),message:get('message'),source:captureSource(get('landingPage'),get('referrer')),area:serviceArea(get('location')),createdAt:new Date().toISOString(),photos};
 await store.lead.save(lead);await store.notifier.send(lead);return NextResponse.json({ok:true});
 }catch {return NextResponse.json({error:'Unable to submit. Please try again.'},{status:503});}
}
