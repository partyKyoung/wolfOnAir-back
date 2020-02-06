import { ParameterizedContext } from "koa";
import { Middleware } from "@koa/router";

import sendEmail from "../../lib/email";

/**
 * 회원가입 인증 실패 했을 때 전송하는 이메일
 * POST
 * @param ctx
 */
export const sendJoinAuthHelpEmail: Middleware = async (
  ctx: ParameterizedContext<any, any>
) => {
  try {
    const { email } = ctx.request.body;

    const values = {
      body: `
        <table
          style="margin: 0 auto; border: 1px solid #000000; border-collapse: collapse;"
        >
          <tbody>
            <tr>
              <th
                style="border: 1px solid #000000; text-align: center; font-weight: bold"
              >
                이메일
              </th>
              <th
                style="border: 1px solid #000000; text-align: center; font-weight: bold"
              >
                사유
              </th>
            </tr>
            <tr>
              <td
                style="padding: 16px; border: 1px solid #000000; text-align: center;"
              >
                ${email}
              </td>
              <td
                style="padding: 16px; border: 1px solid #000000; text-align: center;"
              >
                회원가입은 완료 됐으나 이메일 인증 메일이 제대로 날라오지 않음.
              </td>
            </tr>
          </tbody>
        </table>
      `,
      subject: `${email} - 회원가입 인증 메일 전송 실패`,
      to: [email]
    };

    await sendEmail(values);
  } catch (e) {
    ctx.throw(500, e);
  }
};
