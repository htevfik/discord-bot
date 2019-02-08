import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DiscordService } from '../providers/discord/discord.service';
import { map } from 'rxjs/operators';
import { child } from '../providers/discord/helpers';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private discord: DiscordService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (child(this, 'discord.client.user')) {
      return this.router.navigate(['']);
    } else {
      return true;
    }
  }
}
