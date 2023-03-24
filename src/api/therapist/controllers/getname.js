module.exports = {
  async findName(ctx) {
    const result = await strapi.db.query("api::therapist.therapist").findMany({
      select: ["email", "name"],
    });

    for (var i = 0; i < result.length; i++) {
      if (result[i].email === ctx.params.email) {
        console.log(result[i].name);
        ctx.send(result[i].name);
      }
    }
  },
};
