import Vue from "vue";
import Vuex from "vuex";
import { getAdminInfo } from "@/api/getData";

Vue.use(Vuex);

const state = {
    adminInfo: {
        avatar: "default.jpg",
        access_token: "",
        user_name: "",
    },
};

const mutations = {
    saveAdminInfo(state, adminInfo) {
        //state.adminInfo.access_token = adminInfo.access_token;
    },
};

const actions = {
    async getAdminData({ commit }) {
        try {
            const res = await getAdminInfo();
            if (res.expire_in != 0) {
                commit("saveAdminInfo", res);
            } else {
                throw new Error(res.type);
            }
        } catch (err) {
            // console.log(err.message)
        }
    },
};

export default new Vuex.Store({
    state,
    actions,
    mutations,
});
