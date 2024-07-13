import { InfraError } from '../../core/infra/errors/infra.error';

export default class NetworkError extends InfraError {
  override message: string = 'Não foi possível conectar com o servidor.';
}
