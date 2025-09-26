import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'WtJ5S@example.com',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'bMq0U@example.com',
    }
  ];
  findAll() {
    return this.users;
  }
}
