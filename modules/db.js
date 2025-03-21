import {del,get,keys,set,values} from './idb-src.min.js';


export const db = {
    
    readItem : function(key){
        return get(key);
    },
    readAll : function (){
        return values();
    },
    readKeys : function(){
        return keys();
    },
    writeItem : function(key,item){
        return set(key,item);
    },
    deleteItem : function(key){
        return del(key);
        
    },
    update: function (item) {
        const key = item.id;
        this.writeItem(key,item);
    }
}
