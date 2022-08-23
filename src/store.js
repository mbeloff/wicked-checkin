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
        tag: "Discount Camper Rentals, UK",
        email: "online@wickedcampers.com",
        phone: "+612 4046 7811",
        website: "https://www.wickedcampers.co.uk",
        baseurl: "https://checkin.wickedcampers.co.uk",
        // abn: "ABN 35 640 465 643",
        gateway: "stripe",
        supplierid: 5
      },
    };
  },
});
