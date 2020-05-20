import { Context, ParameterizedContext } from "koa";
import { Middleware } from "@koa/router";

import querySql from "../../lib/db";
import sendEmail from "../../lib/email";
import { getHash, checkHash } from "../../lib/crypto";
import { generateToken, decodeToken, getAccessTokenCookie, setAccessTokenCookie } from '../../lib/token';

/* 이메일 중복 확인 */
export const checkEmail: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { email } = ctx.params;

  if (!email) {
    ctx.status = 400;

    return;
  }

  try {
    const rows: any = await querySql(
      `SELECT uid FROM user WHERE email='${email}'`
    );

    ctx.body = {
      isOk: rows.length <= 0
    };
    ctx.status = 200;
  } catch (e) {
    ctx.status = 500;
  }
};

/* 닉네임 중복 확인 */
export const checkUserName: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { userName } = ctx.params;

  if (!userName) {
    ctx.status = 400;

    return;
  }

  try {
    const rows: any = await querySql(
      `SELECT uid FROM user WHERE userName='${userName}'`
    );

    ctx.body = {
      isOk: rows.length <= 0
    };
    ctx.status = 200;
  } catch (e) {
    ctx.status = 500;
  }
};

/* 회원가입 */
export const join: Middleware = async (ctx: ParameterizedContext<any, any>) => {
  const { email, password, userName } = ctx.request.body;

  if (!email || !password || !userName) {
    ctx.status = 400;

    return;
  }

  try {
    const cryptoPassword = await getHash(password);
    const { hash, salt } = cryptoPassword;

    await querySql(
      `INSERT INTO user(email, userName, password, salt) VALUES('${email}', '${userName}', '${hash}', '${salt}')`
    );

    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
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

    return;
  }
  
  try {
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
                  href="http://localhost:3000/user/join/${email}/send-email/auth" 
                  target="_blank" 
                  style="display: block; width: 300px; height: 50px; margin: 0 auto; padding: 16px; border-radius: 5px; background-color: #3399ff; font-size: 17px; box-sizing: border-box; color: #FFFFFF; text-align: center; text-decoration: none;"
                >
                  가입 완료
                </a>
                <br/>
                <a href="http://localhost:3000/user/join/${email}/send-email/auth" target="_blank" style="color: #3399ff;">localhost:3000/join/${email}/complete</a>
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
  }
};

/* 이메일 인증 완료 */
export const updateUserEmailAuth: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  const { email } = ctx.request.body;

  if (!email) {
    ctx.status = 400;

    return;
  }
  
  try {
    const rows: any = await querySql(
      `SELECT emailAuth FROM user WHERE email='${email}'`
    );

    if (rows.length <= 0) {
      ctx.status = 400;
      ctx.body = {
        reason: '회원가입이 되지 않은 이메일 입니다.'
      }

      return;
    }

    if (rows[0].emailAuth === 'y') {
      ctx.status = 400;
      ctx.body = {
        reason: "이미 인증이 완료된 이메일 입니다."
      }

      return;
    }

    await querySql(`UPDATE user SET emailAuth = 'y' WHERE email = '${email}'`);

    ctx.status = 200;
  } catch (err) {
    ctx.throw(500, "이메일 인증을 실패하였습니다.");
  }
};

/* 로그인 */
export const login: Middleware = async (ctx: ParameterizedContext<any, any>) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = {
      reason: '필수값이 누락되었습니다.'
    };

    return;
  }

  try {
    const rows: any = await querySql(
      `SELECT * FROM user WHERE email='${email}'`
    );

    if (rows.length <= 0) {
      ctx.status = 401;
      ctx.body = {
        reason: '가입하지 않은 아이디이거나 잘못된 비밀번호입니다.'
      }

      return;
    }

    const { emailAuth, password: hash, salt, uid, userName } = rows[0];

    const isVerifyHash = await checkHash(password, salt, hash);

    if (!isVerifyHash) {
      ctx.status = 401;
      ctx.body = {
        reason: '가입하지 않은 아이디이거나 잘못된 비밀번호입니다.'
      }

      return;      
    }

    if (emailAuth === 'n') {
      ctx.status = 401;
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
    ctx.status = 500;
  }
}

/* 쿠키 체크 */
export const checkStatus: Middleware = async (ctx: ParameterizedContext<any, any>) => {
  const token = getAccessTokenCookie(ctx);

  // 토큰이 없으면 다음 작업을 진행한다.
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