"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/getslots/:day",
      handler: "getslots.findSlots",
      config: {
        policies: [],
      },
    },
  ],
};
