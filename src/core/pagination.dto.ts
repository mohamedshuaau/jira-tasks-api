import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const paginationSchema = z.object({
  meta: z.object({
    columns: z.object({}),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      size: z.number(),
      last_page: z.number(),
    }),
  }),
  data: z.object({}).array(),
  links: z.string().array(),
});

export class PaginationDto extends createZodDto(paginationSchema) {}
