import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      token: "",
      tokenexpires: "",
      resref: "",
      mode: undefined,
      allocated: false,
      error: "",
      bookinginfo: {},
      countries: [],
      missing: {
        customers: {},
        vault: false,
      },
      company: {
        name: "Wicked Campers",
        tag: "Discount Camper Rentals, North America",
        email: "online@wickedcampers.com",
        phone: "+612 4046 7811",
        website: "https://www.wickedcampers.ca",
        // abn: "ABN 35 640 465 643",
      },
    };
  },
  getters: {
    defaultcountry(state) {
      return state.countries.find((el) => el.isdefault);
    },
  },
});
