import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {faArrowLeft, faInfoCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {SizeProp} from "@fortawesome/fontawesome-svg-core";
import {DeleteConfirmationComponent} from "../delete-confirmation/delete-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {EditPlantComponent} from "../edit-plant/edit-plant.component";
import {TooltipPosition} from "@angular/material/tooltip";
import {CommonService} from "../common.service";

@Component({
  selector: 'app-manage-plants',
  templateUrl: './manage-plants.component.html',
  styleUrls: ['./manage-plants.component.css']
})
export class ManagePlantsComponent implements OnInit {
  plants = [];
  plant_columns: string[] = ['client', 'city', 'address', 'email', 'contact', 'phone_number', 'actions'];
  fa_arrowLeft = faArrowLeft;
  fa_trash = faTrash;
  fa_info = faInfoCircle;
  fa_size: SizeProp = "xl";
  position: TooltipPosition = 'above';

  constructor(private dataService: DataService, private dialog: MatDialog, private common: CommonService) {
  }

  editPlant(id: number) {
    this.dataService.getPlantById(id).subscribe({
      next: (data: any) => {
        const dialogRef = this.dialog.open(EditPlantComponent, {
          data: {
            title: 'Modifica stabilimento', message: data
          }, width: '50em'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const index = this.plants.findIndex(plant => plant['Plant']['id'] === id);
            if (index !== -1) {
              this.dataService.getPlantById(id).subscribe({
                next: (data: any) => {
                  Object.assign(this.plants[index], data);
                  this.plants = [...this.plants];
                }
              });
            }
          }
        });
      }
    });
  }

  deletePlant(id: number) {
    let data = {
      data: {
        title: 'Conferma eliminazione',
        message: 'Sei sicuro di voler eliminare questo stabilimento?'
      }
    }
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deletePlant(id).subscribe({
          next: (data: any) => {
            this.common.openSnackBar(data.detail);
            const index = this.plants.findIndex(plant => plant['Plant']['id'] === id);
            if (index !== -1) {
              this.plants.splice(index, 1);
              this.plants = [...this.plants];
            }
          }, error: (error) => {
            this.common.openSnackBar(error.error.detail);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.dataService.getPlants().subscribe({
      next: (data: any) => {
        this.plants = data;
      }
    });
  }

  protected readonly window = window;
}
