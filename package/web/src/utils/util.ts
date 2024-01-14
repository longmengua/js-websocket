import { useEffect, useMemo, useState } from "react";

// todo: extract to hook folder
const useSocket = (p : {
  url: string;
}): WebSocket | null => {
  const [state, setState] = useState<WebSocket | null>(null)
  const url = useMemo(() => p?.url, [p?.url])

  useEffect(() => {
    const socket = new WebSocket(p?.url)
    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setState(socket)

    // Clear the socket on component unmount
    return () => {
      socket.close();
    };
  }, [url]);

  return state
}

const setCookie = (name: string, value: string, days: number) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/;`;
  document.cookie = cookieString;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  
  return null;
}

const copyValueWithNewObject = <T extends Record<any, any>>(objectA: T, objectB: T): T => {
  for (const key in objectA) {
    if (objectA.hasOwnProperty(key)) {
      // Check if the key exists in B before copying
      if (key in objectB) {
        objectB[key] = objectA[key];
      }
    }
  }
  return objectB
}

const stringToHex = (str: string): string => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

const hexToString = (hex: string): string => {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(charCode);
  }
  return str;
}

export const Util = {
  useSocket,
  setCookie,
  getCookie,
  copyValueWithNewObject,
  stringToHex,
  hexToString,
}