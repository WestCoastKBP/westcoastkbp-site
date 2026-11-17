import {notFound} from 'next/navigation';
const services = {siding:'Siding',windows:'Windows',remodeling:'Remodeling',adu:'ADU'};
export function generateStaticParams(){return Object.keys(services).map(service=>({service}))}
export const dynamicParams = false;
export default async function Service({params}){const {service}=await params;if(!services[service]) notFound();return <main><h1>{services[service]}</h1><p>Service details are not yet confirmed.</p><a href="/inquiry">Inquiry prototype</a></main>}
