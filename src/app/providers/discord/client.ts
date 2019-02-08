import { Client as DiscordClient, ClientOptions, User } from 'discord.js';
import { Subject, Observable, fromEvent, merge } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { child } from './helpers';

const Configurations = [{
  cases: [
    'ready',
    'userChange',
    { event: 'disconnect', value: null }
  ],
  fieldPath: 'userChange',
  valueFieldPath: 'user',
}];

export class Client extends DiscordClient {
  public userChange: Observable<User>;
  private _events = new Map<string, Observable<any>>();

  constructor(private readonly _token: string, clientOptions: ClientOptions) {
    super(clientOptions);

    this.login();

    Configurations.map(({ cases, fieldPath, valueFieldPath }) => {
      const subject = new Subject();
      const observable = subject.pipe(shareReplay(1));

      this[fieldPath] = observable;

      cases.map(_case => {
        if ('object' === typeof _case) {
          const { event, value } = _case;
          this.fromEvent(event).subscribe(() => {
            subject.next(value);
          });
        } else {
          this.fromEvent(_case).subscribe(() => {
            subject.next(
              child(this, valueFieldPath)
            );
          });
        }
      });
    });
  }

  login() {
    return super.login(this._token);
  }

  fromEvent<T>(event: string): Observable<T> {
    if (this._events.has(event)) {
      return this._events.get(event);
    }

    this._events.set(
      event,
      fromEvent(this, event).pipe(
        shareReplay(1)
      )
    );

    return this.fromEvent(event);
  }
}
