// app/core/app-config.service.ts

import { Injectable } from '@angular/core';
import { EnvironmentConfig } from './interfaces/environment.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: EnvironmentConfig = environment; // Domyślnie z environment.ts

  constructor() {}

  /**
   * Próbuje załadować konfigurację z pliku `config.json`.
   * Jeśli nie uda się pobrać, zostawia domyślną konfigurację z environment.ts.
   */
  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error('config.json not found');
      }
      const json = await response.json();
      this.config = json;
      console.info('✅ Konfiguracja załadowana z config.json');
    } catch (error) {
      console.warn('⚠️ config.json not found, używam environment.ts');
    }
  }

  /**
   * Getter dla wartości konfiguracyjnej po kluczu.
   * @param key Nazwa klucza z konfiguracji
   * @returns Wartość z config.json lub environment.ts
   */
  get<T extends keyof EnvironmentConfig>(key: T): EnvironmentConfig[T] {
    return this.config[key];
  }
}
