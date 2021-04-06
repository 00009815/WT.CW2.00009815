function validator (data) {
      if (data.title.trim() === "" || data.description.trim() === "") {
        return true;
      } else {
        return false;
      }
    }

  
  module.exports = validator;