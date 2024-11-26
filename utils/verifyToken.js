// const jwt=require("jsonwebtoken")

// module.exports = verifyToken = (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, process.env.JWT_KEY, (err, user) => {
//       if (err) {
//         return reject(err);
//       }

//       resolve(user);
//     });
//   });
// };


const jwt = require("jsonwebtoken");

module.exports = verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("No token provided"));
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });
};

