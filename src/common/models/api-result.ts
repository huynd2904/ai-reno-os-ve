export class ApiResult<T> {
  success: boolean;
  result?: T;
  errors: string[];

  constructor(success: boolean, result?: T, errors: string[] = []) {
    this.success = success;
    this.result = result;
    this.errors = errors;
  }

  static success<T>(result: T): ApiResult<T> {
    return new ApiResult<T>(true, result, []);
  }

  static failure<T>(errors: string[] | string): ApiResult<T> {
    const errArray = Array.isArray(errors) ? errors : [errors];
    return new ApiResult<T>(false, undefined, errArray);
  }
}
