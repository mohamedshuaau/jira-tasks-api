import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class LoginDto extends createZodDto(LoginSchema) {}
