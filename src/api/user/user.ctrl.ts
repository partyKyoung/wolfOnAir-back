import { Context, ParameterizedContext } from "koa";
import { Middleware } from "@koa/router";

import querySql from "../../lib/db";
import sendEmail from "../../lib/email";
import { getHash, checkHash } from "../../lib/crypto";
import { generateToken, decodeToken, getAccessTokenCookie, setAccessTokenCookie } from '../../lib/token';

import { randomString } from '../../utils/commons';

/* 이메일 중복 확인 */
export const checkEmail: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { email } = ctx.params;

  if (!email) {
    ctx.status = 400;
    ctx.body = {
      reason: '이메일을 확인할 수 없습니다.'
    }

    return;
  }

  try {
    const rows: any = await querySql(`SELECT uid FROM user WHERE email= ?`, [email]);

    ctx.body = {
      isOk: rows.length <= 0
    };
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      reason: '오류가 발생하여 이메일 중복체크에 실패하였습니다.'
    };
  }
};

/* 닉네임 중복 확인 */
export const checkUserName: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { userName } = ctx.params;

  if (!userName) {
    ctx.status = 400;
    ctx.body = {
      reason: '닉네임을 확인할 수 없습니다.'
    }

    return;
  }

  try {
    const rows: any = await querySql('SELECT uid FROM user WHERE userName=?', [userName]);

    ctx.body = {
      isOk: rows.length <= 0
    };
    ctx.status = 200;
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      reason: '오류가 발생하여 닉네임 중복체크에 실패하였습니다.'
    };  }
};

/* 회원가입 */
export const join: Middleware = async (ctx: ParameterizedContext<any, any>) => {
  const { email, password, userName } = ctx.request.body;
  const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (!email || !password || !userName) {
    ctx.status = 400;
    ctx.body = {
      reason: '회원가입에 필요한 값들이 누락되어 회원가입을 할 수 없습니다.'
    };

    return;
  }

  try {
    const cryptoPassword = await getHash(password);
    const { hash, salt } = cryptoPassword;
    
    await querySql(`INSERT INTO user (email, password, salt, userName, createdDate) VALUES(?, ?, ? ,?, ?)`, [email, hash, salt, userName, createdDate]);
    
    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = {
      reason: '오류가 발생하여 회원가입에 실패하였습니다'
    };
  }
};

/**
 * 회원가입 인증 이메일 보내기
 * POST
 * @param ctx
 */
export const sendJoinEmail: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { email } = ctx.request.body;

  if (!email) {
    ctx.status = 400;
    ctx.body = {
      reason: '이메일을 확인할 수 없습니다.'
    }

    return;
  }
  
  try {
    const userRows = await querySql(`SELECT uid FROM user WHERE email= ?`, [email]);
  
    if (userRows.length <= 0) {
      ctx.status = 400;
      ctx.body = {
        reason: '회원가입이 되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.'
      }

      return;
    }

    const uid = userRows[0].uid;
    const userAuthRows = await querySql(`SELECT uid FROM userAuth WHERE uid= ?`, [uid]);
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const code = randomString(5);

    if (userAuthRows.length > 0) {
      await querySql(`UPDATE user SET code = ?, updatedDate = ? WHERE uid = ?`, [code, updatedDate, uid]);
    } else {
      await querySql(`INSERT INTO userAuth (uid, code, updatedDate) VALUES(?, ?, ?)`, [uid, code, updatedDate]);
    }

    const values = {
      body: `
        <table style="margin: 0 auto;">
          <tbody>
            <tr>
              <td>
                <h2 style="font-size: 24px; font-weight: 600; text-align: center;">
                  늑대온에어
                </h2>
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; text-align: center;">
                아래의 버튼 또는 링크를 클릭하면 이메일 인증이 완료됩니다.
                <br/>
                <br/>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <a 
                  href="${process.env.FRONT_URL}/user/join/${email}/send-email/auth?code=${code}" 
                  target="_blank" 
                  style="display: block; width: 300px; height: 50px; margin: 0 auto; padding: 16px; border-radius: 5px; background-color: #3399ff; font-size: 17px; box-sizing: border-box; color: #FFFFFF; text-align: center; text-decoration: none;"
                >
                  가입 완료
                </a>
                <br/>
                <a href="${process.env.FRONT_URL}/user/join/${email}/send-email/auth?code=${code}" target="_blank" style="color: #3399ff;">${process.env.FRONT_URL}/user/join/${email}/send-email/auth?code=${code}</a>
              </td>
            </tr>
          </tbody>
        </table>
      `,
      subject: "회원가입 인증 이메일",
      to: [email]
    };

    await sendEmail(values);

    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      reason: '회원가입 인증 이메일 발송에 실패하였습니다.'
    }
  }
};

/* 이메일 인증 완료 */
export const updateUserEmailAuth: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { code, email } = ctx.request.body;

  if (!email) {
    ctx.status = 400;
    ctx.body = {
      reason: "이메일을 확인할 수 없습니다."
    }

    return;
  }
  
  try {
    const rows: any = await querySql(
      `SELECT uid, code, auth FROM userAuth WHERE uid = (SELECT uid from user WHERE email = ?)`, [email]
    );

    if (rows.length <= 0) {
      ctx.status = 400;
      ctx.body = {
        reason: '회원가입이 되지 않은 이메일 입니다.'
      }

      return;
    }

    if (rows[0].auth === 1) {
      ctx.status = 400;
      ctx.body = {
        reason: "이미 인증이 완료된 이메일 입니다."
      }

      return;
    }

    if (rows[0].code !== code) {
      ctx.status = 400;
      ctx.body = {
        reason: "인증코드가 올바르지 않아 이메일 인증에 실패하였습니다."
      }

      return;
    }

    await querySql('UPDATE userAuth SET auth = ? WHERE uid = ?', [true, rows[0].uid]);

    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = {
      reason: '이메일 인증에 실패하였습니다.'
    }
  }
};

/* 로그인 */
export const login: Middleware = async (ctx: ParameterizedContext<any, any>) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = {
      reason: '로그인에 필요한 필수 값들이 누락 되었습니다.'
    };

    return;
  }

  try {
    const userRows = await querySql(
      'SELECT uid, password, salt, userName FROM user WHERE email = ?', [email]
    );

    if (userRows.length <= 0) {
      ctx.status = 400;
      ctx.body = {
        reason: '가입하지 않은 아이디이거나 잘못된 비밀번호입니다.'
      }

      return;
    }

    const { password: hash, salt, uid, userName } = userRows[0];

    const isVerifyHash = await checkHash(password, salt, hash);

    if (!isVerifyHash) {
      ctx.status = 400;
      ctx.body = {
        reason: '가입하지 않은 아이디이거나 잘못된 비밀번호입니다.'
      }

      return;      
    }

    const userAuthRows = await querySql(
      'SELECT auth FROM userAuth WHERE uid = ?', [userRows[0].uid]
    );
    
    if (userAuthRows.length <= 0) {
      ctx.status = 400;
      ctx.body = {
        reason: '가입하지 않은 아이디이거나 잘못된 비밀번호입니다.'
      }

      return;         
    }

    if (userAuthRows[0].auth !== 1) {
      ctx.status = 400;
      ctx.body = {
        reason: '인증을 받지 않은 계정입니다. 이메일 인증을 먼저 완료해주세요.'
      }

      return;         
    }

    const token = await generateToken(uid, userName);

    setAccessTokenCookie(ctx, token);

    ctx.status = 200;
    ctx.body = {
      token,
      uid,
      userName
    };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = {
      reason: '로그인에 실패하였습니다.'
    }
  }
}

/* 로그아웃 */
export const logout: Middleware = (ctx: ParameterizedContext<any, any>) => {
  ctx.cookies.set('access_token', '');
  ctx.status = 204;
}

/* 쿠키 체크 */
export const checkStatus: Middleware = async (ctx: ParameterizedContext<any, any>) => {
  const token = getAccessTokenCookie(ctx);

  if (!token) {
    ctx.status = 401;
    
    return;         
  }

  try {
    const decoded: any = await decodeToken(token);

    ctx.status = 200;
    ctx.body = {
      uid: decoded.id,
      userName: decoded.userName
    }

   } catch (err) {
    ctx.status = 500;
  }
}