import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  AbstractControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Angular";
  bookFg: FormGroup;
  allBooks = [
    { id: 1, name: "book1", active: true },
    { id: 2, name: "book2", active: true },
    { id: 3, name: "book1", active: true }
  ];
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.bookFg = this.fb.group({
      arrayForm: this.fb.array(
        this.allBooks.map((book, i) =>
          this.fb.group({
            id: new FormControl(book.id),
            name: new FormControl(book.name, this.myCustomValidatorName(i)),
            active: new FormControl(book.active)
          })
        ),
        this.myCustomValidator()
      )
    });
  }
  checkArray(index) {
    (this.bookFg.get("arrayForm") as FormArray).controls.forEach((x, i) => {
      if (i != index) x.get("name").updateValueAndValidity();
    });
  }
  myCustomValidator() {
    return (formArray: FormArray) => {
      let valid: boolean = true;
      formArray.value.forEach((x, index) => {
        if (formArray.value.findIndex(y => y.name == x.name) != index)
          valid = false;
      });
      return valid ? null : { error: "Names must be inique" };
    };
  }
  myCustomValidatorName(index) {
    return (formControl: FormControl) => {
      let valid: boolean = true;
      if (index) {
        const formArray =
          formControl.parent && formControl.parent.parent
            ? (formControl.parent.parent as FormArray)
            : null;
        if (formArray) {
          console.log(formControl.value);
          formArray.value.forEach((x, i) => {
            if (x.name == formControl.value && index>i) valid = false;
          });
        }
      }
      return valid ? null : { error: "Names must be inique" };
    };
  }
}
