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
        name: "Allridey Pty Ltd",
        email: "sales@allridey.com.au",
        // phone: '1800 24 68 69',
        website: "https://www.allridey.com.au",
        baseurl: "https://checkin.allridey.com.au",
        abn: "ACN: 652772980",
        gateway: "windcave",
        supplierid: 2
      },
    };
  },
});
