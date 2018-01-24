export default class MapListClass
{
    constructor()
    {
        this.maps=new Map();
        
        Object.seal(this);
    }
    
    
    loadProcessLoaded(req,mapList,index,callback)
    {
        let n,k,mapStr,lines,len,map;
        let name=mapList[index];
        
            // error
            
        if (req.status!==200) {
            console.log('Missing Map: '+name);        // this will abort the game loading process
            return;
        }
        
            // break up the lines
        
        mapStr=req.response.replace(/(\r\n)/g,'\n');
        lines=mapStr.split('\n');
        
            // find longest horizontal line
        
        len=0;
        
        for (n=0;n!=lines.length;n++) {
            if (lines[n].length>len) len=lines[n].length;
        }
        
        map=[];
        
        for (n=0;n!=lines.length;n++) {
            map[n]=lines[n].padEnd(len,' ');
        }
        
            // add array to map list
            
        this.maps.set(name,map);
                
            // next map
            
        index++;
        if (index>=mapList.length) {
            callback();
            return;
        }
            
        this.loadProcess(mapList,index,callback);
    }
    
    loadProcess(mapList,index,callback)
    {
        let req;
        let name=mapList[index];
        
        req=new XMLHttpRequest();
        req.open('GET',('maps/'+name+'.txt'),true);
        req.responseType='text';
        req.onload=this.loadProcessLoaded.bind(this,req,mapList,index,callback);
        req.send();
    }
    
    load(mapList,callback)
    {
        this.loadProcess(mapList,0,callback);
    }
    
    get(name)
    {
        return(this.maps.get(name));
    }
}

