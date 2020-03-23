import jwt from 'jsonwebtoken';

const getJWT = (uid: number, userName: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign({
      _id: uid,
      userName
    }, 'secret', {
      expiresIn: '7d',
      issuer: 'wolfonair-local',
      subject: 'user'
    }, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token);
    })
  });
}