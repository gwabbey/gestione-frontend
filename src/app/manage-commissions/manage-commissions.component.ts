import {Component, OnInit} from '@angular/core';
import {faArrowLeft, faInfoCircle, faLock, faTrash} from "@fortawesome/free-solid-svg-icons";
import {SizeProp} from "@fortawesome/fontawesome-svg-core";
import {TooltipPosition} from "@angular/material/tooltip";
import {DataService} from "../data.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteConfirmationComponent} from "../delete-confirmation/delete-confirmation.component";
import {EditCommissionComponent} from "../edit-commission/edit-commission.component";
import {CommonService} from "../common.service";

@Component({
  selector: 'app-manage-commissions',
  templateUrl: './manage-commissions.component.html',
  styleUrls: ['./manage-commissions.component.css']
})
export class ManageCommissionsComponent implements OnInit {
  commissions = [];
  commission_columns: string[] = ['code', 'client_id', 'description', 'date_created', 'actions'];
  fa_arrowLeft = faArrowLeft;
  fa_trash = faTrash;
  fa_info = faInfoCircle;
  fa_lock = faLock;
  fa_size: SizeProp = "xl";
  position: TooltipPosition = 'above';
  isChecked = false;

  constructor(private dataService: DataService, private dialog: MatDialog, private common: CommonService) {
  }

  handleCheckboxChange(checked: boolean): void {
    if (checked) {
      this.commission_columns = ['code', 'client_id', 'description', 'date_created', 'date_closed', 'actions'];
      this.dataService.getCommissions().subscribe({
        next: (data: any) => {
          this.commissions = data;
        }
      });
    } else {
      this.commission_columns = ['code', 'client_id', 'description', 'date_created', 'actions'];
      this.dataService.getOpenCommissions().subscribe({
        next: (data: any) => {
          this.commissions = data;
        }
      });
    }
  }

  assignCommission(id: number) {
    const index = this.commissions.findIndex(commission => commission['Commission']['id'] === id);
    if (index !== -1) {
      this.dataService.getCommissionById(id).subscribe({
        next: (data: any) => {
          Object.assign(this.commissions[index], data);
          this.commissions = [...this.commissions];
        }
      });
    }
  }

  closeCommission(id: number) {
    let data = {
      data: {
        title: 'Conferma chiusura',
        message: 'Sei sicuro di voler chiudere questa commessa?'
      }
    }
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.closeCommission(id).subscribe({
          next: () => {
            this.common.openSnackBar('Commessa chiusa');
            const index = this.commissions.findIndex(commission => commission['Commission']['id'] === id);
            if (index !== -1) {
              if (this.isChecked) {
                this.assignCommission(id);
              } else {
                this.commissions.splice(index, 1);
                this.commissions = [...this.commissions];
              }
            }
          }, error: (error) => {
            this.common.openSnackBar(error.error.detail);
          }
        });
      }
    });
  }

  reopenCommission(id: number) {
    let data = {
      data: {
        title: 'Conferma riapertura',
        message: 'Sei sicuro di voler riaprire questa commessa?'
      }
    }
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.closeCommission(id).subscribe({
          next: () => {
            this.common.openSnackBar('Commessa riaperta');
            this.assignCommission(id);
          }, error: (error) => {
            this.common.openSnackBar(error.error.detail);
          }
        });
      }
    });
  }

  editCommission(id: number) {
    this.dataService.getCommissionById(id).subscribe({
      next: (data: any) => {
        const dialogRef = this.dialog.open(EditCommissionComponent, {
          data: {
            title: 'Modifica commessa', message: data
          }, width: '50em'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.assignCommission(id);
          }
        });
      }
    });
  }

  deleteCommission(id: number) {
    let data = {
      data: {
        title: 'Conferma eliminazione',
        message: 'Sei sicuro di voler eliminare questa commessa?'
      }
    }
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteCommission(id).subscribe({
          next: (data: any) => {
            this.common.openSnackBar(data.detail);
            const index = this.commissions.findIndex(commission => commission['Commission']['id'] === id);
            if (index !== -1) {
              this.commissions.splice(index, 1);
              this.commissions = [...this.commissions];
            }
          }, error: (error) => {
            this.common.openSnackBar(error.error.detail);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.dataService.getOpenCommissions().subscribe({
      next: (data: any) => {
        this.commissions = data;
      }
    });
  }

  protected readonly window = window;
}
