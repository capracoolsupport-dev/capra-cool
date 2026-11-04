// Vite development/preview only. Vercel serves the same handlers in production.
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
export function localStudioAPI(root){
  function attach(server){server.middlewares.use(async(req,res,next)=>{
    const url=new URL(req.url,'http://local');
    if(!['/api/designer','/api/orders'].includes(url.pathname))return next();
    try{
      res.status=code=>{res.statusCode=code;return res;};req.query=Object.fromEntries(url.searchParams);
      const {default:handler}=await import(pathToFileURL(resolve(root,`api/${url.pathname.split('/').pop()}.js`)).href);
      await handler(req,res);
    }catch(error){res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Local API request failed.'}));console.error(error.message);}
  });}
  return {name:'capra-local-studio-api',configureServer:attach,configurePreviewServer:attach};
}
