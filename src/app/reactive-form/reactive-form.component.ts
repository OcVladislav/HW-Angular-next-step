import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

type UserType = {
  userName: { name: string; nameError: boolean | string | null };
  userAge: { age: string; ageError: boolean | string | null };
  userEmail: { email: string; emailError: boolean | string | null };
};

type UsersType = {
  userName: string;
  userAge: string;
  userEmail: string;
};

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent implements OnInit {
  user: UserType = {
    userName: {
      name: '',
      nameError: false,
    },
    userAge: {
      age: '',
      ageError: false,
    },
    userEmail: {
      email: '',
      emailError: false,
    },
  };
  users: UsersType[] = [];

  checkForm() {
    if (
      this.user.userName.nameError === null &&
      this.user.userAge.ageError === null &&
      this.user.userEmail.emailError === null
    ) {
      this.users.push({
        userName: this.user.userName.name,
        userAge: this.user.userAge.age,
        userEmail: this.user.userEmail.email,
      });
    }
  }

  nameControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-z]+$'),
  ]);
  ageControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]*$'),
  ]);
  emailControl = new FormControl('', [Validators.required, MyValidator]);

  ngOnInit(): void {
    this.nameControl.valueChanges.subscribe((value) => {
      this.user.userName.name = value;
    });
    this.nameControl.statusChanges.subscribe((value) => {
      if (value === 'INVALID' && this.user.userName.name) {
        this.user.userName.nameError = 'Only letters !';
      } else if (this.user.userName.name !== '') {
        this.user.userName.nameError = null;
      } else this.user.userName.nameError = false;
    });

    this.ageControl.valueChanges.subscribe((value) => {
      this.user.userAge.age = value;
      if (value === '') {
        this.user.userAge.ageError = false;
      }
    });
    this.ageControl.statusChanges.subscribe((value) => {
      if (value === 'INVALID' && this.user.userAge.age) {
        this.user.userAge.ageError = 'Only number !';
      } else if (this.user.userAge.age !== '') {
        this.user.userAge.ageError = null;
      } else this.user.userAge.ageError = false;
    });

    this.emailControl.valueChanges.subscribe((value) => {
      this.user.userEmail.email = value;
      if (value === '') {
        this.user.userEmail.emailError = false;
      }
    });
    this.emailControl.statusChanges.subscribe(() => {
      this.user.userEmail.emailError = this.emailControl.errors?.['message'];
    });
  }
}

function MyValidator(formControl: FormControl) {
  const regExp = '^\\w+([.-]?\\w+){2,64}@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$';
  const checkConsistency = new RegExp(regExp);
  if (!checkConsistency.test(formControl.value) && formControl.value) {
    return { message: 'Invalid email format' };
  }
  return formControl.value === '' ? { message: false } : { message: null };
}
