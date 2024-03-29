import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {faArrowLeft, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {DataService} from "../data.service";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  fa_arrowLeft = faArrowLeft;
  fa_exclamationTriangle = faExclamationTriangle;
  message = '';
  error = '';
  submitted: boolean = false;
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  newPasswordForm = this.formBuilder.group({
    old_password: ['', Validators.required],
    new_password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
    confirm_password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
  });

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private authService: AuthService) {
  }

  get form() {
    return this.newPasswordForm.controls;
  }

  submitForm() {
    this.submitted = true;
    if (this.newPasswordForm.invalid) {
      if (this.newPasswordForm.controls.new_password.errors?.['pattern'] || this.newPasswordForm.controls.confirm_password.errors?.['pattern']) {
        this.error = 'La password deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale';
        return;
      }
      return;
    }
    if (this.newPasswordForm.value.new_password !== this.newPasswordForm.value.confirm_password) {
      this.error = 'Le password non coincidono';
      return;
    }
    this.dataService.changePassword(this.newPasswordForm.value.old_password!, this.newPasswordForm.value.confirm_password!).subscribe({
      next: () => {
        this.error = '';
        this.message = 'Password modificata con successo!';
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/']).then();
        }, 4000);
      }, error: (error) => {
        this.error = error.error.detail;
      }
    });
  }

  protected readonly window = window;
}
