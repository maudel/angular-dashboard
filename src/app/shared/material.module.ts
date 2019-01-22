import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatToolbarModule,
  MatCardModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }
