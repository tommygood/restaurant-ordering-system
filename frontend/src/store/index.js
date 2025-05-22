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
      await axios
        .get("https://mixed-restaurant.bogay.me/api/foods")
        .then(function (response) {
          context.commit("setFoodsData", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
});

export default store;
