type Result<T> = SuccessResult<T> | FailureResult;

interface SuccessResult<T> {
  success: true;
  data: T;
}

interface FailureResult {
  success: false;
  message: string;
}
