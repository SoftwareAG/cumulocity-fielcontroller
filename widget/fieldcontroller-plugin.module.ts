// Assets need to be imported into the module, or they are not available
import { NgModule } from "@angular/core";
import { CommonModule, CoreModule, FormsModule, hookNavigator, hookRoute } from "@c8y/ngx-components";
import { ConfirmationModalComponent } from "./share/confirmation/confirmation-modal.component";
import { ProfileGridComponent } from "./grid/profile.component";
import { ProfileStepperComponent } from "./stepper/profile-stepper.component";
import { ProfilePropertiesComponent } from "./stepper/profile-properties.component";
import { RegisterListComponent } from "./stepper/register-list.component";
import { FieldcontrollerNavigationFactory } from "./fieldcontroller-navigation.factory";
import { UpdateControllerComponent } from "./stepper/update-controller-modal.component";
import { ImportProfilesComponent } from "./import-modal/import.component";

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    ProfileGridComponent,
    ProfileStepperComponent,
    ProfilePropertiesComponent,
    RegisterListComponent,
    UpdateControllerComponent,
    ImportProfilesComponent
  ],
  entryComponents: [ ConfirmationModalComponent, ProfilePropertiesComponent, RegisterListComponent, UpdateControllerComponent],
  imports: [CoreModule, CommonModule, FormsModule],
  exports: [],
  providers: [hookNavigator(FieldcontrollerNavigationFactory),
    hookRoute({
      path: "sag-ps-pkg-modbus-profile/fieldController/profile",
      component: ProfileGridComponent,
    }),],
})
export class FieldcontrollerPluginModule {}
