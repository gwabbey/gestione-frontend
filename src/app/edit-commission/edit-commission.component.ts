import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EditComponent} from "../edit/edit.component";
import {FormBuilder, Validators} from "@angular/forms";
import {DataService} from "../data.service";
import {CommonService} from "../common.service";
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

@Component({
  selector: 'app-edit-commission',
  templateUrl: './edit-commission.component.html',
  styleUrls: ['./edit-commission.component.css']
})
export class EditCommissionComponent {
  clients = [];
  editCommissionForm = this.formBuilder.group({
    client_id: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required]
  });
  error: any;
  submitted: boolean = false;

  constructor(private dialogRef: MatDialogRef<EditComponent>, private formBuilder: FormBuilder, private dataService: DataService, private common: CommonService, @Inject(MAT_DIALOG_DATA) public data: {
    title: string;
    message: any
  }) {
  }

  get form() {
    return this.editCommissionForm.controls;
  }

  select(event: Event, value: string) {
    this.editCommissionForm.patchValue({
      [value]: (event.target as HTMLInputElement).value
    });
  }

  onConfirm() {
    this.submitted = true;
    if (this.editCommissionForm.invalid) {
      return;
    }
    this.dataService.editCommission(this.editCommissionForm.value, this.data.message['Commission']['id']).subscribe({
      next: () => {
        this.common.openSnackBar('Commessa modificata con successo!');
      }, error: (error) => {
        this.common.openSnackBar(error.error.detail);
      }
    });
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.dataService.getClients().subscribe({
      next: (data: any) => {
        this.clients = data;
      }
    });
    this.editCommissionForm.patchValue({
      client_id: this.data.message['Commission']['client_id'],
      code: this.data.message['Commission']['code'],
      description: this.data.message['Commission']['description']
    });
  }

  protected readonly dateTimestampProvider = dateTimestampProvider;
}
