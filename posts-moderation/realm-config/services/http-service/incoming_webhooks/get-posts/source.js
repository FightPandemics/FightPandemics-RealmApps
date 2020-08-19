// This function is the webhook's request handler.
exports = function(payload, response) {
  let {skip, limit} = payload.query;
  skip = parseInt(skip, 10);
  limit = parseInt(limit, 10);

  if (isNaN(skip)) skip = 0;
  if (isNaN(limit)) limit = 100;

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
    } },
    { $skip: skip },
    { $limit: limit }
  ]).toArray();
};