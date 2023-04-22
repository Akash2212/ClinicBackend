"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/checkcrtslots",
      handler: "checkcrtslots.checkSlots",
      config: {
        policies: [],
      },
    },
  ],
};
