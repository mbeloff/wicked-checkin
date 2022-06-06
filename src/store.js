import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      token: "",
      tokenexpires: "",
      resref: "",
      mode: undefined,
      status: "",
      allocated: false,
      bookinginfo: {},
      countries: [],
      missing: {
        customers: {},
        vault: false,
      },
      company: {
        name: 'Wicked Campers',
        email: 'online@wickedcampers.com',
        phone: '1800 24 68 69',
        website: 'https://www.wickedcampers.com.au',
        abn: 'ABN 35 640 465 643'
      }
    };
  },
});
