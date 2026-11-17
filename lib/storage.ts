import {mkdir,writeFile,appendFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import type {Lead} from './lead';
export interface LeadStore { save(lead:Lead):Promise<void> }
export interface PhotoStore { save(bytes:Buffer, type:string):Promise<string> }
export interface Notifier { send(lead:Lead):Promise<void> }
const root=process.env.LOCAL_DATA_DIR || path.join(process.cwd(),'.local-data');
export class LocalPhotoStore implements PhotoStore { async save(bytes:Buffer,type:string) {await mkdir(root,{recursive:true,mode:0o700});const name=randomUUID()+({ 'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp' }[type]||'');await writeFile(path.join(root,name),bytes,{mode:0o600});return name;} }
export class LocalLeadStore implements LeadStore {async save(lead:Lead){await mkdir(root,{recursive:true,mode:0o700});await appendFile(path.join(root,'leads.jsonl'),JSON.stringify(lead)+'\n',{mode:0o600});}}
export class LocalNotifier implements Notifier {async send(){ /* local submissions are inspected in the local store */ }}
// These adapters need explicitly provisioned services and credentials; never silently fall back.
export class PostgresLeadStore implements LeadStore {async save(lead:Lead){const {Pool}=await import('pg'); const pool=new Pool({connectionString:process.env.DATABASE_URL});try {await pool.query('INSERT INTO leads (payload) VALUES ($1)',[JSON.stringify(lead)]);}finally{await pool.end();}}}
export class BlobPhotoStore implements PhotoStore {async save(bytes:Buffer,type:string){const {put}=await import('@vercel/blob'); const blob=await put(`leads/${randomUUID()}`,bytes,{access:'private',contentType:type,token:process.env.BLOB_READ_WRITE_TOKEN});return blob.url;}}
export class EmailNotifier implements Notifier {async send(lead:Lead){const {Resend}=await import('resend');const result=await new Resend(process.env.RESEND_API_KEY).emails.send({from:process.env.LEAD_EMAIL_FROM!,to:process.env.LEAD_EMAIL_TO!,subject:'New website inquiry',text:JSON.stringify(lead,null,2)});if(result.error) throw new Error('Email delivery failed');}}
export function stores():{lead:LeadStore;photo:PhotoStore;notifier:Notifier} {
 const mode=process.env.LEAD_STORAGE || 'local';
 if(mode==='local') {if(process.env.VERCEL) throw new Error('Local storage is unavailable on Vercel');return {lead:new LocalLeadStore(),photo:new LocalPhotoStore(),notifier:new LocalNotifier()};}
 if(mode==='postgres' && process.env.DATABASE_URL && process.env.BLOB_READ_WRITE_TOKEN && process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && process.env.LEAD_EMAIL_TO) return {lead:new PostgresLeadStore(),photo:new BlobPhotoStore(),notifier:new EmailNotifier()};
 throw new Error('Storage is not configured');
}
