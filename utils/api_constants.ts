//local

// export const base_url = "http://localhost:8050/v1";
// export const login_url = "http://localhost:8050/v1";

//production

export const base_url = "https://api.postracker.mygeepay.com/v1";
export const login_url = "https://api.postracker.mygeepay.com/v1";
export const domain_name = "pos-tracker.geepay.tech"
export const metaDataUrl = "https://pos-tracker.geepay.tech";

export const api_endpoints = {
    //auth
    login: `${login_url}/login`,
    requestCode: `${base_url}/code/request`,
    verifyCode: `${base_url}/code/verify`,
    resetPassword: `${base_url}/password/reset`,



    //create
    createAppVersion: `${base_url}/app/version/register`,
    createUser: `${login_url}/create-user`,
    createPosDevice: `${base_url}/create-department`,
    createBusiness: `${base_url}/business/create`,
    createEvent: `${base_url}/create-event`,
    createTestimony: `${base_url}/create-testimony`,
    createMessage: `${base_url}/create-message`,
    createPodcast: `${base_url}/create-podcast`,
    createApp: `${base_url}/app/register`,
    createZone: `${base_url}/create-zone`,
    createLive: `${base_url}/create-stream`,

    //Get
    getAppVersions: `${base_url}/app/versions/get`,
    getPosDevices: `${base_url}/pos/devices/get`,
    getBusinesses: `${base_url}/businesses/get`,
    getBusinessById: `${base_url}/business/get`,
    getApps: `${base_url}/apps/get`,
    getApp: `${base_url}/get-App`,
    getDashboardTileInfo: `${base_url}/dashboard/tiles/get`,
    getEvents: `${base_url}/dashboard/events/get`,
    getLocations: `${base_url}/locations/get`,
    getUserInfo: `${base_url}/user/get/`,
    getUsers: `${base_url}/users/get`,
    getDashboardCardInfo: `${base_url}/dashboard/info`,
    getDashboardActivity: `${base_url}/dashboard/activity`,
    getTerminalTypes: `${base_url}/terminal-types/get`,


    //Update
    editPosDevice: `${base_url}/pos/device/update`,

    editAppVersion: `${base_url}/app/version/update`,
    editUser: `${base_url}/user/update`,
    editBusiness: `${base_url}/business/update`,
    editEvent: `${base_url}/edit-event`,
    updateTestimony: `${base_url}/update-testimony`,
    editPodcast: `${base_url}/edit-podcast`,
    editApp: `${base_url}/app/info/update`,
    editZone: `${base_url}/edit-zone`,
    editLive: `${base_url}/edit-stream`,
    editDiary: `${base_url}/edit-diary`,
    incrementPodcast: `${base_url}/podcast/increment`,

    //delete
    deleteUser: `${base_url}/delete-user`,
    deleteApp: `${base_url}/app`,
    deleteAppVersion: `${base_url}/app/version`,
    deletePosDevice: `${base_url}/pos/device`,
};
