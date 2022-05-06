const Hospital = require("../models/Hospital");
const vacCenter = require("../models/VacCenter");

exports.getHospitals = async (req, res, next) => {
  let query;

  //copy req.query
  const reqQuery = { ...req.query };

  //fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  //create query string
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lt|in)\b/g, (match) => `$${match}`);
  query = Hospital.find(JSON.parse(queryStr)).populate("appointments");

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  try {
    const total = await Hospital.countDocuments();
    query = query.skip(startIndex).limit(limit);
    // Executeing query
    const hospitals = await query;
    //pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    console.log(req.query);
    res
      .status(200)
      .json({ sucess: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(400).json({ sucess: false });
    }
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.postHospital = async (req, res, next) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json({ sucess: true, data: hospital });
};

exports.putHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!hospital) {
      return res.status(400).json({ sucess: false });
    }
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(400).json({ sucess: false });
    }
    hospital.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//desc get vaccine centers
//route get /api/v1/hospitals/vacCenters/
//access public
exports.getVacCenters = (req, res, next) => {
  vacCenter.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some other occured while retrieving Vaccine Centers."
      });
    else res.send(data);
  });
};
