import { defineStore } from "pinia";
export const useLocalStorageStore = defineStore("useLocalStorageStore", () => {
     
    async function get(key : string) {
         localStorage.getItem(key)
    }
    async function set(key: string, value : string) {
        localStorage.setItem(key,value)
    }
 
    return { 
        get,
        set,
    };
});
