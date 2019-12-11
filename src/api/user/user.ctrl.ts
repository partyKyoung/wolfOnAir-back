import Router from 'koa-router';
import crypto from 'crypto';

import querySql from '../../lib/db';
import getHash from '../../lib/crypto';
import sendEmail from '../../lib/email';

/* 이메일 중복 확인 */

export const checkEmail = () => {}

/* 닉네임 중복 확인 */
export const checkUserName = () => {}

/* 회원가입 */
export const join = () => {}

/* 회원가입 인증 이메일 보내기 */
export const sendJoinEmail = () => {}