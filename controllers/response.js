function createResponse(status, data, message, error) {
    return {
      status: status,
      data: data,
      message: message,
      error: error
    };
  }

  module.exports = createResponse;