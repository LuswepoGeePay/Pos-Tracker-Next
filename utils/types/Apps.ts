export type App = {
    name:string;
    description:string;
    id:string;
}


export type AppVersion = {
    app_id:string;
    version_number:string;
    build_number :string;
    release_notes:string;
    file_path:string;
    file_size_bytes:string;
    checksum:string;
    is_active:boolean;
    is_latest_stable:string;
    released_at: string;
    version_id :string;
    app_name: string;
}