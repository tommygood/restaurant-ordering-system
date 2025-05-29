import { createStore } from "vuex";
import axios from "axios";
axios.defaults.baseURL = "/api";

const store = createStore({
  state() {
    return {
      allFoods: [],
      user: undefined,
      admin: undefined,
    };
  },
  mutations: {
    setFoodsData(state, payload) {
      state.allFoods = payload;
    },
    setUser(state, payload) {
      state.user = payload;
      localStorage.setItem("user", JSON.stringify(payload));
    },
    setAdmin(state, payload) {
      state.admin = payload;
    },
  },
  actions: {
    async getFoodsData(context) {
      try {
        const response = await axios.get("/foods");
        context.commit("setFoodsData", response.data);
      } catch (error) {
        console.error("Error loading foods:", error);
        context.commit("setFoodsData", []);
      }
    },
  },
});

export default store;
