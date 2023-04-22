"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/getslots/:date/",
      handler: "getslots.findSlots",
      config: {
        policies: [],
      },
    },
  ],
};
