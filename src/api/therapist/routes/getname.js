"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/getname/:email",
      handler: "getname.findName",
      config: {
        policies: [],
      },
    },
  ],
};
