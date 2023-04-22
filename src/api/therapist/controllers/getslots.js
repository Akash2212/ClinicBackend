module.exports = {
  async findSlots(ctx) {
    const eventTsRes = await strapi.db.query("api::event.event").findMany({
      select: ["therapist", "timeslot", "mode"],
    });

    const therapistTsRes = await strapi.db
      .query("api::therapist.therapist")
      .findMany({
        select: ["name", "timeslot", "mode"],
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
        if (
          eventTsRes[i].timeslot[k].day ===
          new Date(ctx.params.date).toLocaleDateString("en-US", {
            weekday: "long",
          })
        ) {
          eventTs.push({
            name: eventTsRes[i].therapist,
            timeslot: eventTsRes[i].timeslot[k].ts,
            mode: eventTsRes[i].mode,
          });
        }
      }
    }

    for (let i = 0; i < therapistTsRes.length; i++) {
      for (let k = 0; k < therapistTsRes[i].timeslot.length; k++) {
        if (
          therapistTsRes[i].timeslot[k].day ===
          new Date(ctx.params.date).toLocaleDateString("en-US", {
            weekday: "long",
          })
        ) {
          therapistTs.push({
            name: therapistTsRes[i].name,
            timeslot: therapistTsRes[i].timeslot[k].ts,
            mode: eventTsRes[i].mode,
          });
        }
      }
    }

    // console.log("Event", eventTs);
    // console.log("Therapist", therapistTs);

    for (var p = 0; p < eventTs.length; p++) {
      for (var q = 0; q < therapistTs.length; q++) {
        if (eventTs[p].name === therapistTs[q].name) {
          if (eventTs[p].mode === "Offline") {
            if (eventTs[p].timeslot === therapistTs[q].timeslot) {
              resultTs.push({
                name: eventTs[p].name,
                ts: eventTs[p].timeslot,
              });
            }
          }
        }
      }
    }

    var finalTs = [];

    for (var y = 0; y < resultTs.length; y++) {
      let matchFound = false;
      for (var x = 0; x < bookingTsRes.length; x++) {
        // console.log(
        //   new Date(bookingTsRes[x].date).toLocaleDateString("en-US", {
        //     weekday: "long",
        //   }),
        //   ctx.params.day
        // );
        // console.log(new Date(bookingTsRes[x].date));
        // console.log(new Date(ctx.params.date));
        if (bookingTsRes[x].therapist_name === resultTs[y].name) {
          if (
            new Date(bookingTsRes[x].date).getDate() ===
            new Date(ctx.params.date).getDate()
          ) {
            // console.log(
            //   bookingTsRes[x].therapist_name,
            //   bookingTsRes[x].timeslot,
            //   resultTs[y].name,
            //   resultTs[y].ts
            // );

            if (bookingTsRes[x].timeslot === resultTs[y].ts) {
              matchFound = true;
              break;
            }
          }
          //else {
          //   console.log({ name: resultTs[y].name, ts: resultTs[y].ts });
          //   finalTs.push({ name: resultTs[y].name, ts: resultTs[y].ts });
          // }
        }
      }

      if (!matchFound) {
        finalTs.push({ name: resultTs[y].name, ts: resultTs[y].ts });
        console.log(resultTs[y].ts);
      }
    }

    var fts = finalTs.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.ts).indexOf(obj.ts) == pos;
    });

    ctx.send(fts);
  },
};

/*
// create a new Date object for the current time
var currentTime = new Date();

// set the start and end times of the time slot
var startTime = { hours: 9, minutes: 0 };  // 9:00 am
var endTime = { hours: 17, minutes: 0 };   // 5:00 pm

// extract the hour and minute values from the current time
var currentHours = currentTime.getHours();
var currentMinutes = currentTime.getMinutes();

// check if the current time is within the time slot
if ((currentHours > startTime.hours || (currentHours === startTime.hours && currentMinutes >= startTime.minutes))
  && (currentHours < endTime.hours || (currentHours === endTime.hours && currentMinutes <= endTime.minutes))) {
  console.log('The current time is within the time slot.');
} else {
  console.log('The current time is outside the time slot.');
}

*/
