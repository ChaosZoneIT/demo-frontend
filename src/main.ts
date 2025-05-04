import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { AppConfigService } from './app/core/app-config.service';
import { provideHttpClient } from '@angular/common/http';

// Rejestrujemy AppConfigService i ładujemy config zanim uruchomimy aplikację
async function main() {
  const appConfigService = new AppConfigService();
  await appConfigService.loadConfig();

  await bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...appConfig.providers ?? [],
      provideHttpClient(), // tylko jeśli nie masz go już w appConfig
      {
        provide: AppConfigService,
        useValue: appConfigService
      }
    ]
  });
}

main().catch(err => console.error(err));
