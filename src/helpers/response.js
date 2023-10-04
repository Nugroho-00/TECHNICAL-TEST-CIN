const responseStandard = (
    response,
    message,
    aditionalData = {},
    status = 200,
    success = true
  ) => {
    response.status(status).json({
      success,
      message: message || "Success",
      ...aditionalData,
    });
  };
  
  module.exports = { responseStandard };