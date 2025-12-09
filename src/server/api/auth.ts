import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const loginServerFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    return {
      email: data.get('email')?.toString() || '',
      password: data.get('password')?.toString() || '',
    };
  })
  .handler(async ({ data }) => {
    console.log(data);
    return {
      success: true,
      user: {
        id: '223131',
        email: 'm.rehan.alam@gmail.com',
      },
    };
  });
