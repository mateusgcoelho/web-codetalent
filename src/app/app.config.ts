import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import player from 'lottie-web';
import {
  ArrowBigLeftDash,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  ImageUp,
  LucideAngularModule,
  PlusCircle,
  Save,
  Trash,
  TriangleAlert,
  X,
} from 'lucide-angular';
import { provideLottieOptions } from 'ngx-lottie';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { AxiosClientAdapter } from './infra/gateway/axios-client.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    importProvidersFrom(
      LucideAngularModule.pick({
        PlusCircle,
        Edit,
        Trash,
        Save,
        ArrowBigLeftDash,
        ImageUp,
        ChevronRight,
        ChevronLeft,
        X,
        ChevronDown,
        TriangleAlert,
      }),
    ),
    provideAnimations(),
    provideToastr(),
    {
      provide: 'HttpClient',
      useClass: AxiosClientAdapter,
    },
    provideAnimationsAsync(),
    provideLottieOptions({
      player: () => player,
    }),
  ],
};
