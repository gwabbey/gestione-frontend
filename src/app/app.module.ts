import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DataComponent} from './data/data.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateWorkComponent} from './create-work/create-work.component';
import {AppRoutingModule} from './app-routing.module';
import {NotFoundComponent} from './not-found/not-found.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {CreateUserComponent} from './create-user/create-user.component';
import {ManageUsersComponent} from './manage-users/manage-users.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {HeaderComponent} from './header/header.component';
import {ProfileComponent} from './profile/profile.component';
import {ManageWorkComponent} from './manage-work/manage-work.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AdminManageWorkComponent} from './admin-manage-work/admin-manage-work.component';
import {FooterComponent} from './footer/footer.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DeleteConfirmationComponent} from './delete-confirmation/delete-confirmation.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {EditComponent} from './edit/edit.component';
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {CreateClientComponent} from './create-client/create-client.component';
import {CreateCommissionComponent} from './create-commission/create-commission.component';
import {ManagementComponent} from './management/management.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CreatePlantComponent} from './create-plant/create-plant.component';
import {CreateMachineComponent} from './create-machine/create-machine.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatTableExporterModule} from "mat-table-exporter";
import {DailyHoursComponent} from './daily-hours/daily-hours.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EditMachineComponent} from './edit-machine/edit-machine.component';
import {ManageMachinesComponent} from './manage-machines/manage-machines.component';
import {MatSortModule} from "@angular/material/sort";
import {EditClientComponent} from './edit-client/edit-client.component';
import {ManageClientsComponent} from './manage-clients/manage-clients.component';
import {ManagePlantsComponent} from './manage-plants/manage-plants.component';
import {ManageCommissionsComponent} from './manage-commissions/manage-commissions.component';
import {EditCommissionComponent} from './edit-commission/edit-commission.component';
import {EditPlantComponent} from './edit-plant/edit-plant.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ConvertXmlComponent} from './convert-xml/convert-xml.component';
import {DatePipe} from "@angular/common";
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { ManageTicketsComponent } from './manage-tickets/manage-tickets.component';
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [AppComponent, DataComponent, CreateWorkComponent, NotFoundComponent, DashboardComponent, LoginComponent, CreateUserComponent, ManageUsersComponent, ForbiddenComponent, HeaderComponent, ProfileComponent, ManageWorkComponent, AdminManageWorkComponent, FooterComponent, DeleteConfirmationComponent, EditComponent, CreateClientComponent, ManagementComponent, ChangePasswordComponent, CreatePlantComponent, CreateMachineComponent, CreateCommissionComponent, DailyHoursComponent, EditMachineComponent, ManageMachinesComponent, EditClientComponent, ManageClientsComponent, ManagePlantsComponent, ManageCommissionsComponent, EditCommissionComponent, EditPlantComponent, ConvertXmlComponent, CreateTicketComponent, ManageTicketsComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule, FontAwesomeModule, BrowserAnimationsModule, MatSlideToggleModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatInputModule, MatTableModule, MatSnackBarModule, MatTooltipModule, MatRadioModule, MatTableExporterModule, MatCheckboxModule, MatSortModule, MatDividerModule, MatAutocompleteModule, MatMenuModule],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
