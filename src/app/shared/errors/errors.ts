import { ErrorAdapt } from './error-adapt';

export const errors: ErrorAdapt[] = [
  {
    code: 401,
    message: 'Unauthorized',
    messageView: 'Não autorizado ou experidado, efetue o login novamente.',
  },
  {
    code: 403,
    message: 'Forbidden',
    messageView: 'Permissão negada',
  },
  {
    code: 400,
    message: 'email or password invalid',
    messageView: 'E-mail ou senha inválidos',
  },
  {
    code: 500,
    message: 'Login ou senha inválido',
    messageView: 'Login ou senha inválido',
  },
  {
    code: 500,
    message: 'An unexpected error occurred please try later',
    messageView: 'Ocorreu um erro inesperado, por favor, tente mais tarde',
  },
];
