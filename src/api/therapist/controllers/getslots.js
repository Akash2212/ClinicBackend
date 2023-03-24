module.exports = {
  async findSlots(ctx) {
    const eventTsRes = await strapi.db.query("api::event.event").findMany({
      select: ["therapist", "timeslot"],
    });

    const therapistTsRes = await strapi.db
      .query("api::therapist.therapist")
      .findMany({
        select: ["name", "timeslot"],
      });

    const bookingTsRes = await strapi.db
      .query("api::booking.booking")
      .findMany({
        select: ["therapist_name", "timeslot", "date"],
      });

    eventTs = [];
    therapistTs = [];
    resultTs = [];

    for (let i = 0; i < eventTsRes.length; i++) {
      for (let k = 0; k < eventTsRes[i].timeslot.length; k++) {
        if (eventTsRes[i].timeslot[k].day === ctx.params.day) {
          eventTs.push({
            name: eventTsRes[i].therapist,
            timeslot: eventTsRes[i].timeslot[k].ts,
          });
        }
      }
    }

    for (let i = 0; i < therapistTsRes.length; i++) {
      for (let k = 0; k < therapistTsRes[i].timeslot.length; k++) {
        if (therapistTsRes[i].timeslot[k].day === ctx.params.day) {
          therapistTs.push({
            name: therapistTsRes[i].name,
            timeslot: therapistTsRes[i].timeslot[k].ts,
          });
        }
      }
    }

    // console.log("Event", eventTs);
    // console.log("Therapist", therapistTs);

    for (var p = 0; p < eventTs.length; p++) {
      for (var q = 0; q < therapistTs.length; q++) {
        if (eventTs[p].name === therapistTs[q].name) {
          if (eventTs[p].timeslot === therapistTs[q].timeslot) {
            resultTs.push({
              name: eventTs[p].name,
              ts: eventTs[p].timeslot,
            });
          }
        }
      }
    }

    for (var x = 0; x < bookingTsRes.length; x++) {
      for (var y = 0; y < resultTs.length; y++) {
        console.log(
          new Date(bookingTsRes[x].date).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          ctx.params.day
        );
        if (
          new Date(bookingTsRes[x].date).toLocaleDateString("en-US", {
            weekday: "long",
          }) === ctx.params.day
        )
          if (bookingTsRes[x].therapist_name === resultTs[y].name) {
            console.log(bookingTsRes[x].timeslot, resultTs[y].ts);
            if (bookingTsRes[x].timeslot !== resultTs[y].ts) {
              console.log({
                name: resultTs[y].name,
                ts: resultTs[y].ts,
              });
            }
          }
      }
    }

    // console.log("Result", resultTs);
    ctx.send(resultTs);
  },
};
