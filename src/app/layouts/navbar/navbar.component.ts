import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslationService } from '../../core/services/translation/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input({required: true}) isLogin: boolean = true;
  readonly authService = inject(AuthService);
  readonly translationService = inject(TranslationService);
  changeLang(lang: string) {
    this.translationService.changeLang(lang);
  }
  selectOption(): boolean {
    const lang = localStorage.getItem('lang');
    return lang === 'en' ? true : false;
  }
}
