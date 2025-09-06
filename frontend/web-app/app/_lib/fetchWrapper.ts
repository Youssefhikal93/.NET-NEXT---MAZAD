import { auth } from "@/auth";

const baseUrl = "http:localhost:6001/";


async function get(url:string) {
    const requestOptions = {
        method: "GET",
         headers:await getHeaders(),
    }

    const res = await fetch(baseUrl + url , requestOptions)
    return handelResponse(res)
}
async function put(url:string,body:unknown) {
    const requestOptions = {
        method: "PUT",
        headers:await getHeaders(),
        body: JSON.stringify(body)
    }

    const res = await fetch(baseUrl + url , requestOptions)
    return handelResponse(res)
}
async function post(url:string,body:unknown) {
    const requestOptions = {
        method: "POST",
        headers:await getHeaders(),
        body: JSON.stringify(body)
    }

    const res = await fetch(baseUrl + url , requestOptions)
    return handelResponse(res)
}
async function del(url:string) {
    const requestOptions = {
        method: "DELETE",
        headers:await getHeaders(),
        
    }

    const res = await fetch(baseUrl + url , requestOptions)
    return handelResponse(res)
}

async function handelResponse(res: Response) {
    const text = await res.text();
    let data;
    try{
     data = text ? JSON.parse(text) : null;

    }
    catch{
         data = text;
    }

    if(res.ok){
        return data || res.statusText
    }else {
        const error = {
            status: res.status,
            message:typeof data == 'string' ? data :  res.statusText
        }
        return {error};
    }
}

async function getHeaders(): Promise<Headers>{
    const session = await auth();
    const headers = new Headers();
    headers.set("Content-type","application/json")
    if(session){
        headers.set("Authorization","Bearer "+session.accessToken)
    }
    return headers
}

export const fetchWrapper = {get , post,put,del}