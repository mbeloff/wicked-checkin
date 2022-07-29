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
        tag: "Discount Camper Rentals, New Zealand",
        email: "online@wickedcampers.com",
        phone: "1800 24 68 69",
        website: "https://www.wickedcampers.co.nz",
        // abn: "ABN 35 640 465 643",
      },
    };
  },
});
