import { api } from "../api/api";

const SOCIAL_URL = {
    GET_ACCOUNTS: `/social/accounts`,
    ADD_ACCOUNT: `/social/accounts`,
    REMOVE_ACCOUNT: `/social/accounts`,
    UPDATE_ACCOUNT: `/social/accounts`,
};

export const getSocialAccounts = async () => {
    try {
        const response = await api.get(SOCIAL_URL.GET_ACCOUNTS);
        return response.data;
    } catch (error) {
        console.error("Get social accounts error:", error);
        throw error;
    }
};

export const addSocialAccount = async (accountData) => {
    try {
        const response = await api.post(SOCIAL_URL.ADD_ACCOUNT, accountData);
        return response.data;
    } catch (error) {
        console.error("Add social account error:", error);
        throw error;
    }
};

export const removeSocialAccount = async (accountId) => {
    try {
        const response = await api.delete(`${SOCIAL_URL.REMOVE_ACCOUNT}/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Remove social account error:", error);
        throw error;
    }
};

export const updateSocialAccount = async (accountId, accountData) => {
    try {
        const response = await api.put(`${SOCIAL_URL.UPDATE_ACCOUNT}/${accountId}`, accountData);
        return response.data;
    } catch (error) {
        console.error("Update social account error:", error);
        throw error;
    }
};
