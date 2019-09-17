import crypto from 'crypto';

function getHash(value:string): Promise<{key: string; salt: string;}> {
  const hashObj = {
    key: '',
    salt: ''
  }

  return new Promise((resolve, reject) => {
    if (!value) {
      reject();
    }

    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err);
      }

      const salt = buf.toString('base64');
      
      crypto.pbkdf2(value, salt, 100000, 64, 'sha512', async (err, key) => {
        if (err) {
          reject(err);
        }

        hashObj.salt = salt;
        hashObj.key = key.toString('base64');

        resolve(hashObj);
      });
    });
  });
};

export default getHash;
