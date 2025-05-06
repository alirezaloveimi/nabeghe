type ToastOptions<T> = {
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

type StateAction = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export function toastCallback<T extends StateAction, S>(
  action: (prevState: S, formData: FormData) => Promise<T>,
  options?: ToastOptions<T>
): (prevState: S, formData: FormData) => Promise<T> {
  return async (prevState, formData) => {
    const result = await action(prevState, formData);
    if (result.success) {
      options?.onSuccess?.(result);
    } else if (!result.errors && result.message) {
      options?.onError?.(result);
    }

    return result;
  };
}
