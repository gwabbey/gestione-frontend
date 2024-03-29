import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteConfirmationComponent} from "../delete-confirmation/delete-confirmation.component";
import {EditComponent} from "../edit/edit.component";
import {
  faArrowLeft,
  faCaretDown,
  faEnvelope,
  faExclamationCircle,
  faInfoCircle,
  faPrint,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import {SizeProp} from "@fortawesome/fontawesome-svg-core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../common.service";
import {TooltipPosition} from "@angular/material/tooltip";
import {animate, style, transition, trigger} from "@angular/animations";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-manage-work',
  templateUrl: './manage-work.component.html',
  styleUrls: ['./manage-work.component.css'],
  animations: [trigger('fade', [transition('void => *', [style({opacity: 0}), animate(100, style({opacity: 1}))])])]
})
export class ManageWorkComponent implements OnInit {
  displayed_columns: string[] = ['operator', 'date', 'client', 'plant', 'duration', 'intervention_type', 'machine', 'cost_center', 'commission', 'location', 'supervisor', 'description', 'actions'];
  user_columns: string[] = ['date', 'client', 'plant', 'duration', 'intervention_type', 'machine', 'commission', 'location', 'supervisor', 'actions'];
  operators = [];
  clients = [];
  plants = [];
  machines = [];
  commissions = [];
  reports = [];
  logged_role = localStorage.getItem('role');
  error = '';
  fa_mail = faEnvelope;
  fa_print = faPrint;
  fa_arrowLeft = faArrowLeft;
  fa_trash = faTrash;
  fa_info = faInfoCircle;
  fa_down = faCaretDown;
  fa_exclamation_circle = faExclamationCircle;
  fa_size: SizeProp = "xl";
  position: TooltipPosition = 'above';
  months = [];
  innerText = 'interventi';
  pdf_filename = '';
  reports_filename = '';
  adminForm = this.formBuilder.group({
    operator_id: ['0', Validators.required],
    client_id: ['0', Validators.required],
    plant_id: ['0', Validators.required],
    work_id: ['0', Validators.required]
  });
  monthFilterForm = this.formBuilder.group({
    month: ['0', Validators.required]
  });
  intervalFilterForm = this.formBuilder.group({
    start_date: [''], end_date: ['']
  });
  filter = 'month';
  email_date: string | null = null;
  loadingPdf = false;
  limit = 25;
  scrolling = true;
  total = 0;
  isMobile = false;
  searchForm = this.formBuilder.group({
    search: ['']
  });

  get isMachinesEmpty() {
    return this.machines.length === 0;
  }

  get isCommissionsEmpty() {
    return this.commissions.length === 0;
  }

  get isMachine() {
    return this.adminForm.value.plant_id !== 'c';
  }

  constructor(private dataService: DataService, private dialog: MatDialog, private formBuilder: FormBuilder, public common: CommonService, private datePipe: DatePipe, private cdr: ChangeDetectorRef) {
    this.isMobile = window.matchMedia('(max-width: 991px)').matches;
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll() {
    if (this.adminForm.value.client_id === '0' && this.adminForm.value.operator_id === '0' && this.adminForm.value.plant_id === '0' && this.adminForm.value.work_id === '0') {
      if (window.innerHeight + window.scrollY === document.body.scrollHeight) {
        this.loadMore();
      }
    }
  }

  loadMore() {
    if (this.scrolling) {
      this.limit += 25;
      if (this.logged_role === 'admin') {
        this.dataService.getReports(this.limit).subscribe({
          next: (data: any) => {
            this.reports = data;
            this.cdr.detectChanges();
            this.total = data.length;
          }
        });
      } else {
        this.dataService.getMyReports(this.limit).subscribe({
          next: (data: any) => {
            this.reports = data;
          }
        });
      }
    }
  }

  select(event: Event, value: string, form: FormGroup) {
    this.scrolling = false;
    const selectedValue = (event.target as HTMLInputElement).value;
    form.patchValue({
      [value]: selectedValue
    });
    if (this.logged_role === 'admin') {
      if (value === 'operator_id') {
        this.innerText = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).options.selectedIndex].innerText.toLowerCase().trim();
      }
      if (this.adminForm.value.plant_id !== 'c') {
        if (value === 'client_id' || this.adminForm.value.plant_id === '0') {
          this.dataService.getPlantsByClient(+this.adminForm.value.client_id!).subscribe({
            next: (data: any) => {
              this.plants = data;
            }
          });
          this.machines = [];
          this.commissions = [];
          this.adminForm.patchValue({
            plant_id: '0', work_id: '0'
          });
        }
      } else if (this.adminForm.value.plant_id === 'c') {
        if (value === 'client_id') {
          this.dataService.getOpenCommissionsByClient(+this.adminForm.value.client_id!).subscribe({
            next: (data: any) => {
              this.commissions = data;
            }
          });
          this.adminForm.patchValue({
            work_id: '0'
          });
        }
      }
      if (this.adminForm.value.plant_id !== 'c') {
        if (value === 'plant_id') {
          this.dataService.getMachineByPlant(+this.adminForm.value.plant_id!).subscribe({
            next: (data: any) => {
              this.machines = data;
            }
          });
          this.adminForm.patchValue({
            work_id: '0'
          });
        }
        if (this.filter === 'month') {
          this.dataService.getMonthlyReports(this.adminForm.value.client_id!, this.monthFilterForm.value.month!, this.adminForm.value.operator_id!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe({
            next: (data: any) => {
              this.reports = data;
              this.checkReports(data);
              this.total = data.length;
            }
          });
        } else if (this.filter === 'interval') {
          this.dataService.getIntervalReports(this.adminForm.value.client_id!, this.adminForm.value.operator_id!, this.intervalFilterForm.value.start_date!, this.intervalFilterForm.value.end_date!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe({
            next: (data: any) => {
              this.reports = data;
              this.checkReports(data);
              this.total = data.length;
            }
          });
        }
      }
      if (this.adminForm.value.plant_id === 'c') {
        if (value !== 'work_id') {
          this.dataService.getOpenCommissionsByClient(+this.adminForm.value.client_id!).subscribe({
            next: (data: any) => {
              this.commissions = data;
            }
          });
        }
        if (this.filter === 'month') {
          this.dataService.getMonthlyCommissionReports(this.adminForm.value.client_id!, this.monthFilterForm.value.month!, this.adminForm.value.operator_id!, this.adminForm.value.work_id!).subscribe({
            next: (data: any) => {
              this.reports = data;
              this.checkReports(data);
              this.total = data.length;
            }
          });
        } else if (this.filter === 'interval') {
          this.dataService.getIntervalCommissionReports(this.adminForm.value.client_id!, this.adminForm.value.operator_id!, this.intervalFilterForm.value.start_date!, this.intervalFilterForm.value.end_date!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe({
            next: (data: any) => {
              this.reports = data;
              this.checkReports(data);
              this.total = data.length;
            }
          });
        }
      }
    }
    if (this.filter === 'month') {
      this.dataService.getMonths(this.adminForm.value.operator_id!).subscribe({
        next: (data: any) => {
          this.months = data;
        }
      });
      this.reports_filename = this.monthFilterForm.value.month?.replace('/', '-') + '_' + this.innerText.trim().replace(' ', '-').toUpperCase();
    } else if (this.filter === 'interval') {
      this.reports_filename = this.intervalFilterForm.value.start_date! + '_' + this.intervalFilterForm.value.end_date! + '_' + this.innerText.trim().replace(' ', '-').toUpperCase();
    }
  }

  checkReports(data: any) {
    data.length === 0 ? this.error = 'Non ci sono interventi da visualizzare' : this.error = '';
  }

  saveReports(response: Blob, filename: string) {
    this.loadingPdf = false;
    const file = new Blob([response], {type: 'application/pdf'});
    const url = window.URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = url;
    anchor.click();
  }

  printMonthlyReports() {
    this.loadingPdf = true;
    if (this.adminForm.value.plant_id === 'c') {
      this.dataService.printMonthlyCommissionReports(this.adminForm.value.client_id!, this.monthFilterForm.value.month!, this.adminForm.value.operator_id!, this.adminForm.value.work_id!).subscribe((response) => {
        this.loadingPdf = true;
        this.saveReports(response, this.reports_filename)
      });
    } else {
      this.dataService.printMonthlyReports(this.adminForm.value.client_id!, this.monthFilterForm.value.month!, this.adminForm.value.operator_id!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe((response) => {
        this.loadingPdf = true;
        this.saveReports(response, this.reports_filename)
      });
    }
  }

  printIntervalReports() {
    this.loadingPdf = true;
    if (this.adminForm.value.plant_id === 'c') {
      this.dataService.printIntervalCommissionReports(this.adminForm.value.client_id!, this.intervalFilterForm.value.start_date!, this.intervalFilterForm.value.end_date!, this.adminForm.value.operator_id!, this.adminForm.value.work_id!).subscribe((response) => {
        this.loadingPdf = false;
        this.saveReports(response, this.reports_filename)
      });
    } else {
      this.dataService.printIntervalReports(this.adminForm.value.client_id!, this.intervalFilterForm.value.start_date!, this.intervalFilterForm.value.end_date!, this.adminForm.value.operator_id!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe((response) => {
        this.loadingPdf = false;
        this.saveReports(response, this.reports_filename)
      });
    }
  }

  printCsvMonthlyReports() {
    if (this.adminForm.value.plant_id === 'c') {
      this.dataService.printCsvMonthlyCommissionReports(this.adminForm.value.client_id!, this.monthFilterForm.value.month!, this.adminForm.value.operator_id!, this.adminForm.value.work_id!).subscribe((response) => {
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', this.reports_filename + '.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
    } else {
      this.dataService.printCsvMonthlyReports(this.adminForm.value.client_id!, this.monthFilterForm.value.month!, this.adminForm.value.operator_id!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe((response) => {
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', this.reports_filename + '.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
    }
  }

  printCsvIntervalReports() {
    if (this.adminForm.value.plant_id === 'c') {
      this.dataService.printCsvIntervalCommissionReports(this.adminForm.value.client_id!, this.intervalFilterForm.value.start_date!, this.intervalFilterForm.value.end_date!, this.adminForm.value.operator_id!, this.adminForm.value.work_id!).subscribe((response) => {
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', this.reports_filename + '.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
    } else {
      this.dataService.printCsvIntervalReports(this.adminForm.value.client_id!, this.intervalFilterForm.value.start_date!, this.intervalFilterForm.value.end_date!, this.adminForm.value.operator_id!, this.adminForm.value.plant_id!, this.adminForm.value.work_id!).subscribe((response) => {
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', this.reports_filename + '.csv');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
    }
  }

  printPdf() {
    if (this.filter === 'month' && this.monthFilterForm.value.month === '0') {
      this.common.openSnackBar('Seleziona un mese valido');
      return;
    }
    if (this.filter === 'interval' && (this.intervalFilterForm.value.start_date === '' || this.intervalFilterForm.value.end_date === '')) {
      this.common.openSnackBar('Seleziona un intervallo di tempo valido');
      return;
    }
    const isPrintingAllowed = this.total <= 25;
    if (!isPrintingAllowed) {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        data: {
          title: 'Attenzione',
          message: 'Stai per stampare più di 25 interventi e ciò potrebbe richiedere molto tempo.\nVuoi continuare?',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.printReports();
        }
      });
    } else {
      this.printReports();
    }
  }

  printReports() {
    if (this.filter === 'month') {
      this.printMonthlyReports();
    } else {
      this.printIntervalReports();
    }
  }

  printCsv() {
    if (this.filter === 'month') {
      this.printCsvMonthlyReports();
    } else {
      this.printCsvIntervalReports();
    }
  }


  sendEmail(report_id: number, supervisor_id: number) {
    this.dataService.getReportById(report_id).subscribe({
      next: (data: any) => {
        this.email_date = data.Report.email_date;
        this.pdf_filename = data.Report.date.replaceAll('-', '') + '_' + data.last_name.toUpperCase() + '_' + data.first_name.toUpperCase() + '.pdf';
        this.dataService.getUserById(supervisor_id).subscribe({
          next: (data: any) => {
            let supervisor_email = data.User.email;
            let title = 'Conferma invio email';
            let message = 'Vuoi inviare questo intervento a ' + data.User.last_name + ' ' + data.User.first_name + '?';
            if (this.email_date !== null) {
              title = 'Conferma reinvio email';
              message = 'Vuoi re-inviare questo intervento a ' + data.User.last_name + ' ' + data.User.first_name + '?\n' + 'Hai già inviato questo intervento il ' + this.datePipe.transform(this.email_date, 'dd/MM/yyyy') + ' alle ' + this.datePipe.transform(this.email_date, 'HH:mm', 'Europe/Rome');
            }
            const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
              data: {
                title: title, message: message,
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.common.openSnackBar('Invio email in corso...')
                this.dataService.printReport(report_id).subscribe((response) => {
                  let pdf = new File([response], this.pdf_filename, {type: 'application/pdf'});
                  this.dataService.sendEmail(report_id, pdf, supervisor_email).subscribe({
                    next: () => {
                      this.common.openSnackBar('Email inviata con successo!');
                      const index = this.reports.findIndex(report => report['Report']['id'] === report_id);
                      if (index !== -1) {
                        this.dataService.getReportById(report_id).subscribe({
                          next: (data: any) => {
                            Object.assign(this.reports[index], data);
                            this.reports = [...this.reports];
                            this.cdr.detectChanges();
                          }
                        });
                      }
                    }, error: () => {
                      this.common.openSnackBar('Errore nell\'invio dell\'email, riprovare più tardi');
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  }

  searchReports() {
    this.scrolling = this.searchForm.value.search?.trim().length === 0;
    let searchValue = this.searchForm.value.search?.trim().replace(this.common.exp, ' ');
    this.dataService.searchReports(searchValue!).subscribe({
      next: (data: any) => {
        this.reports = data;
        this.total = data.length;
        this.error = this.reports.length == 0 ? 'Nessun risultato trovato' : '';
      }
    });
  }

  editReport(id: number) {
    this.dataService.getReportById(id).subscribe({
      next: (data: any) => {
        const dialogRef = this.dialog.open(EditComponent, {
          data: {
            title: 'Modifica intervento', message: data
          }, width: '50em'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const index = this.reports.findIndex(report => report['Report']['id'] === id);
            if (index !== -1) {
              this.dataService.getReportById(id).subscribe({
                next: (data: any) => {
                  Object.assign(this.reports[index], data);
                  this.reports = [...this.reports];
                  this.cdr.detectChanges();
                }
              });
            }
          }
        });
      }
    });
  }

  deleteReport(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: {
        title: 'Conferma eliminazione', message: 'Sei sicuro di voler eliminare questo intervento?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteReport(id).subscribe({
          next: (data: any) => {
            this.common.openSnackBar(data.detail);
            const index = this.reports.findIndex(report => report['Report']['id'] === id);
            if (index !== -1) {
              this.reports.splice(index, 1);
              this.reports = [...this.reports];
              this.total--;
              this.cdr.detectChanges();
            }
          }
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.logged_role === 'admin') {
      this.dataService.getReports(this.limit).subscribe({
        next: (data: any) => {
          this.reports = data;
          this.checkReports(data);
          this.total = data.length;
          this.dataService.getMonths('0').subscribe({
            next: (data: any) => {
              this.months = data;
              this.dataService.getOperators().subscribe({
                next: (data: any) => {
                  this.operators = data;
                  this.dataService.getClients().subscribe({
                    next: (data: any) => {
                      this.clients = data;
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      this.dataService.getMyReports(this.limit).subscribe({
        next: (data: any) => {
          this.reports = data;
          this.checkReports(data);
          this.dataService.getMyMonths('0').subscribe({
            next: (data: any) => {
              this.months = data;
            }
          });
        }
      });
    }
    window.onresize = () => this.isMobile = window.innerWidth <= 991;
  }

  protected readonly window = window;
}
