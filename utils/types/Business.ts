import { PosDevice } from "./PosDevices";

export type Business ={
    name:string;
    email:string;
    address:string;
    id:string;
    status:boolean;
    business_logo:string;
    phone:string;
    device:PosDevice;
    
}