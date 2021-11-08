exports.customError = (data) => {
  if (data.Response === "Error") return true;
  return false;
};
