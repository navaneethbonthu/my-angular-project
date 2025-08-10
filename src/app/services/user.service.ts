import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User[] = [
    new User(1, 'John Doe', 'js', '1234'),
    new User(2, 'Marry Jane', 'mj', '5678'),
    new User(3, 'Alice Smith', 'as', 'abcd'),
    new User(4, 'Bob Brown', 'bb', 'efgh'),
    new User(5, 'Charlie White', 'cw', 'ijkl'),
  ];

  constructor() {}
}
