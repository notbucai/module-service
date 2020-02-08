
class HTTPError {
  constructor(msg, code = 1000) {
    this.code = code;
    this.message = msg;
  }
}

exports.HTTPError = HTTPError;
