import { HttpStatus } from '@nestjs/common';

export const NOT_FOUND_ERROR = {
  status: HttpStatus.NOT_FOUND,
  message: 'No docs found!',
};
