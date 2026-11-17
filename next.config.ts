import type {NextConfig} from 'next';
const nextConfig:NextConfig = {async rewrites(){return [{source:'/privacy',destination:'/privacy.html'},{source:'/about',destination:'/'},{source:'/status',destination:'/'}];}};
export default nextConfig;
