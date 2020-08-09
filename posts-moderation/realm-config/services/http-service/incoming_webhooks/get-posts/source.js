// This function is the webhook's request handler.
exports = function(payload, response) {
    const mongodb = context.services.get("mongodb-atlas");
    const posts = mongodb.db("fightpandemics").collection("posts");
    
    return posts.aggregate([
      // exclude sourced by fightpandemics
      { $match: { airtableId: { $exists: false } } },
      { $sort: { _id: -1 } },
      { $project: {
        _id: 0,
        link: { $concat: [ context.values.get("baseUrl"), "/post/", { $toString: "$_id" } ] },
        name: 1,
        title: 1,
        content: 1,
        createdAt: { $toString: "$createdAt" },
        updatedAt: { $toString: "$updatedAt" }
      } }
    ]).toArray();
};