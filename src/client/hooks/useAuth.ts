import { useMutation } from '@tanstack/react-query';
import { loginServerFn } from '@/server/api/auth';

function toFormData(o: Record<string, string>) {
  const fd = new FormData();
  Object.entries(o).forEach(([k, v]) => fd.set(k, v));
  return fd;
}

export function useLogin() {
  return useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      loginServerFn({ data: toFormData(values) }),
  });
}
