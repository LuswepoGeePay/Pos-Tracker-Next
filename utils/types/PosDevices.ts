
export type PosDevice = {
    app_id:string;
    serial_number:string;
    name :string;
    current_app_version:string;
    last_known_latitude:string;
    last_known_longitude:string;
    status:string;
    device_model:string;
    operating_system:string;
    id: string;
    location_last_updated:string;
    description:string;
    business_name:string;
}


export type LHistory = {
    posdevice_id:string;
    longitude:string;
    latitude :string;
    accuracy:string;
    timestamp:string;
    id:string;
    device_name:string;
    region:string;
}