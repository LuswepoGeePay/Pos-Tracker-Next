export const base_url = "http://localhost:8050/v1";
export const domain_name = "testhof.crabdance.com"
export const metaDataUrl ="https://testhof.crabdance.com";

export const api_endpoints = {
    //auth
    login: `${base_url}/login`,
    requestCode: `${base_url}/code/request`,
    verifyCode: `${base_url}/code/verify`,
    resetPassword: `${base_url}/password/reset`,


    //create
    createAppVersion: `${base_url}/app/version/register`,
    createPosDevice: `${base_url}/create-series`,
    createDepartment: `${base_url}/create-department`,
    createSermon: `${base_url}/create-sermon`,
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
    getLocations: `${base_url}/locations/get`,
    getPodcasts: `${base_url}/get-podcasts`,
    getPodcast: `${base_url}/get-podcast`,
    getSeries: `${base_url}/get-series`,
    getEvents: `${base_url}/get-events`,
    getDepartments: `${base_url}/get-departments`,
    getApps: `${base_url}/apps/get`,
    getZones: `${base_url}/get-zones`,
    getApp: `${base_url}/get-App`,
    getUsers: `${base_url}/get-users`,
    getDepartment: `${base_url}/get-department`,
    getEvent: `${base_url}/get-event`,
    getMessages: `${base_url}/get-messages`,
    getTestimonies: `${base_url}/get-testimonies`,
    getTestimoniesPortal: `${base_url}/get-testimonies-portal`,
    getStreams:`${base_url}/get-streams`,
    getDiaries:`${base_url}/get-diaries`,
    getDashboardCardInfo: `${base_url}/dashboard/info`,
    getDashboardActivity: `${base_url}/dashboard/activity`,
    getDashboardPodcasts: `${base_url}/dashboard/podcasts`,

    
    //Update
    editTeamMember: `${base_url}/edit-member`,
    editUser: `${base_url}/edit-user`,
    editSermon:   `${base_url}/edit-sermon`,
    editSeries: `${base_url}/edit-series`,
    editDepartment: `${base_url}/edit-department`,
    editEvent: `${base_url}/edit-event`,
    updateTestimony: `${base_url}/update-testimony`,
    editPodcast: `${base_url}/edit-podcast`,
    editApp: `${base_url}/edit-App`,
    editZone: `${base_url}/edit-zone`,
    editLive:`${base_url}/edit-stream`,
    editDiary:`${base_url}/edit-diary`,
    incrementPodcast: `${base_url}/podcast/increment`,

    //delete
    deleteTeamMember: `${base_url}/delete-member`,
    deleteUser: `${base_url}/delete-user`,
    deleteSermon: `${base_url}/delete-sermon`,
    deleteSeries: `${base_url}/delete-series`,
    deleteDepartment: `${base_url}/delete-department`,
    deleteEvent: `${base_url}/delete-event`,
    deleteMessage: `${base_url}/delete-message`,
    deleteTestimony: `${base_url}/delete-testimony`,
    deleteApp: `${base_url}/delete-App`,
    deleteZone: `${base_url}/delete-zone`,
    deleteLocation: `${base_url}/delete-podcast`,
    deleteAppVersion:`${base_url}/delete-stream`,
    deletePosDevice:`${base_url}/delete-diary`,
};
