import jwt from 'jsonwebtoken';

export const generateToken = (uid: number, userName: string): Promise<string> => {
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

export const decodeToken = (token: string) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject();
    }
    
    jwt.verify(token, 'sceret', (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    })
  });
};