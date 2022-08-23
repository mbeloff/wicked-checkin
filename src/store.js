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
        phone: "+612 4046 7811",
        website: "https://www.wickedcampers.co.nz",
        baseurl: "https://checkin.wickedcampers.co.nz",
        // abn: "ABN 35 640 465 643",
        gateway: "windcave",
        supplierid: 2
      },
    };
  },
});
