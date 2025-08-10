export interface User {
  id: number;
  name: string;
  username: string;
  pssword: string;
}

export class User {
  constructor(id: number, name: string, username: string, pssword: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.pssword = pssword;
  }
  id: number;

  name: string;
  username: string;

  pssword: string;
}
