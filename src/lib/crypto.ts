import crypto from 'crypto';

function cryptSalt(value: string, salt: string): Promise<{hash: string; salt: string}> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(value, salt, 1000, 64, 'sha512', (err: Error | null, key: Buffer) => {
      if (err) {
        reject(err);
        
        return;
      }

      resolve({
        salt,
        hash: key.toString('base64')
      });
    });
  });
}

export async function getHash(value:string): Promise<{hash: string; salt: string;}> {
  const salt = crypto.randomBytes(64).toString();

  try {
    const hashObj = await cryptSalt(value, salt);

    return hashObj;
  } catch (err) {
    throw new Error(err);
  }  
};

export async function checkHash(value: string, salt: string, verifyHash: string): Promise<boolean> {
  try {
    const hashObj = await cryptSalt(value, salt);

    return hashObj.hash === verifyHash;
  } catch (err) {
    throw new Error(err);
  }  
}
