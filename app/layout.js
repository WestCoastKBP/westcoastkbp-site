import Source from './source';
export const metadata = {title:'West Coast KBP',robots:{index:false,follow:false}};
export default function Layout({children}) {return <html lang="en"><body><Source/>{children}</body></html>;}
