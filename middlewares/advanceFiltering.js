const advancedFiltering = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  // Loop over and remove field and delete them from reqQuery
  removeFields.forEach(field => {
    delete reqQuery[field];
  });

  // Create query String
  let queryStr = JSON.stringify(reqQuery);

  // Create operaters like (gt,gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding Resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const selectFields = req.query.select.split(",").join(" ");
    query = query.select(selectFields);
  }

  // Sort Fields
  if (req.query.sort) {
    const sortFields = req.query.sort.split(",").join(" ");
    query = query.sort(sortFields);
  } else {
    query = query.sort("-createdAt");
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //   Populating the model
  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedFiltering = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedFiltering;
