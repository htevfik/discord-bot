import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { BrowserWindow as ElectronWindow } from 'electron';

const { app, BrowserWindow } = (<any>window)
  .require('electron')
  .remote.require('electron');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private window: ElectronWindow;
  private exitTimeout: number;

  constructor(translate: TranslateService, private snackBar: MatSnackBar) {
    translate.setDefaultLang('en');
    this.window = BrowserWindow.getAllWindows()[0];
  }

  devTools() {
    this.window.webContents.toggleDevTools();
  }

  minimize() {
    this.window.minimize();
  }

  maximize() {
    const { window } = this;

    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }

  exit() {
    this.snackBar
      .open('Uygulama birazdan kapatılacak...', 'İptal')
      .afterDismissed()
      .subscribe(console.log);

    this.exitTimeout = setTimeout(() => {
      app.exit();
    });
  }
}
