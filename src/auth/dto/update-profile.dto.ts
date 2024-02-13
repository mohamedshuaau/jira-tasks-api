import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateProfileSchema = z.object({
  jira_email: z.string(),
  jira_pat: z.string(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
