import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Aquí es donde activas el Hash para GitHub Pages
    provideRouter(routes, withHashLocation()),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideAnimations()
  ],
};
