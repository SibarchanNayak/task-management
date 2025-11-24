import Joi from "joi";
const { ValidationError } = Joi;


const errorHandler = (error, req, res, next) => {
  let status = 500;
  let data = {
    message: "Internal Server Error",
  };

  // Joi Validation Error
  if (error instanceof ValidationError) {
    status = 400;
    data.message = error.message;
    return res.status(status).json(data);
  }

  // Custom status code added on error object
  if (error.status) {
    status = error.status;
  }

  // Custom message
  if (error.message) {
    data.message = error.message;
  }

  return res.status(status).json(data);
};

export default errorHandler;
