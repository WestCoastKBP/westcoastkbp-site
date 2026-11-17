import {readFile} from 'node:fs/promises';
import path from 'node:path';
const retired=new Set(['project-gallery','outdoor-solutions','bathroom-remodeling','indoor-renovation','models','compare','studio','service-areas']);
export async function GET(_request:Request,{params}:{params:Promise<{retired:string[]}>}){const {retired:parts}=await params;if(!retired.has(parts[0])) return new Response('Not found',{status:404});return new Response(await readFile(path.join(process.cwd(),'public','retired.html'),'utf8'),{status:410,headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, follow'}});}
