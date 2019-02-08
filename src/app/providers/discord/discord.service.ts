import { Injectable } from '@angular/core';
import { Client } from './client';
import { fromEvent, Subject, merge } from 'rxjs';
import { User } from 'discord.js';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {
  public user = new Subject<User>();
  public client: Client;

  constructor() { }

  login(token: string) {
    const client = new Client(token, {});
    return client.login().then(() => {
      this.client = client;
      return client.user;
    });
  }

  logout() {
    return this.client.destroy().then(() => {
      this.user.next(null);
    });
  }
}
