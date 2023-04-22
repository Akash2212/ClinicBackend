module.exports = {
  async checkSlots(ctx) {
    const eventTsRes = await strapi.db.query("api::event.event").findMany({
      select: ["therapist", "timeslot"],
    });

    const therapistTsRes = await strapi.db
      .query("api::therapist.therapist")
      .findMany({
        select: ["name", "timeslot"],
      });

    var resultTs = [];
    for (let i = 0; i < eventTsRes.length; i++) {
      for (let k = 0; k < eventTsRes[i].timeslot.length; k++) {
        resultTs.push({
          name: eventTsRes[i].therapist,
          day: eventTsRes[i].timeslot[k].day,
          timeslot: eventTsRes[i].timeslot[k].ts,
        });
      }
    }

    for (let i = 0; i < therapistTsRes.length; i++) {
      for (let k = 0; k < therapistTsRes[i].timeslot.length; k++) {
        resultTs.push({
          name: therapistTsRes[i].name,
          day: therapistTsRes[i].timeslot[k].day,
          timeslot: therapistTsRes[i].timeslot[k].ts,
        });
      }
    }

    var fts = resultTs.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.timeslot).indexOf(obj.timeslot) == pos;
    });

    // var sendTs = [];

    // for (let i = 0; i < fts.length; i++) {
    //   var splitted = fts[i].timeslot.split("-");
    //   var start = splitted[0].trim();
    //   var end = splitted[1].trim();

    //   sendTs.push({ name: fts[i].name, start: start, end: end });
    // }

    ctx.send(fts);
  },
};
