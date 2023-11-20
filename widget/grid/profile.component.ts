/*
 * Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @authors Christof Strack
 */
import {
  Component,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  ActionControl,
  AlertService,
  BuiltInActionType,
  BulkActionControl,
  Column,
  ColumnDataType,
  Pagination,
  Row,
  gettext,
} from "@c8y/ngx-components";
import { saveAs } from "file-saver";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { Profile, ProfileType, uuidCustom } from "../share/profile.model";
import { NameRendererComponent } from "../renderer/name.renderer.component";
import { ControllersRendererComponent } from "../renderer/controllers.renderer.component";
import { ProfileService } from "../share/profile.service";
import { ConfirmationModalComponent } from "../share/confirmation/confirmation-modal.component";
import { ImportProfilesComponent } from "../import-modal/import.component";


@Component({
  selector: "c8y-profile-profile-grid",
  templateUrl: "profile.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ProfileGridComponent implements OnInit {

  showConfigProfile: boolean = false;

  profiles: Profile[] = [];
  profileToUpdate: Profile;

  update: boolean = true;

  titleProfile: string;

  columnsProfiles: Column[] = [
    {
      name: "name",
      header: "Name",
      path: "name",
      filterable: false,
      dataType: ColumnDataType.TextShort,
      cellRendererComponent: NameRendererComponent,
      visible: true,
    },
    {
      header: "Profile Type",
      name: "type",
      path: "type",
      filterable: true,
    },
    {
      header: "# Controllers",
      name: "controllers",
      path: "controllers",
      filterable: true,
      sortable: false,
      cellRendererComponent: ControllersRendererComponent,
    },
  ];

  value: string;
  profileType: ProfileType;
  destroy$: Subject<boolean> = new Subject<boolean>();
  refresh: EventEmitter<any> = new EventEmitter();

  pagination: Pagination = {
    pageSize: 3,
    currentPage: 1,
  };
  actionControls: ActionControl[] = [];
  actionControlSubscription: ActionControl[] = [];
  bulkActionControls: BulkActionControl[] = [];

  constructor(
    public profileService: ProfileService,
    public alertService: AlertService,
    private bsModalService: BsModalService
  ) {}

  async ngOnInit() {
    this.loadProfiles();
    this.actionControls.push(
      {
        type: BuiltInActionType.Edit,
        callback: this.updateProfile.bind(this),
      },
      {
        text: "Copy",
        type: "COPY",
        icon: "copy",
        callback: this.copyProfile.bind(this),
      },
      {
        type: BuiltInActionType.Delete,
        callback: this.deleteProfileWithConfirmation.bind(this),
      },
      {
        type: "EXPORT",
        text: "Export Profile",
        icon: "export",
        callback: this.exportSingle.bind(this),
      }
    );

    this.bulkActionControls.push(
      {
        type: "EXPORT",
        text: "Export Mapping",
        icon: "export",
        callback: this.exportMappingBulk.bind(this),
      }
    );
    this.profileService.listToReload().subscribe(() => {
      this.loadProfiles();

    });
  }

  private exportMappingBulk(ids: string[]) {
    const mappings2Export = this.profiles.filter((m) => ids.includes(m.id));
    this.exportMappings(mappings2Export);
  }

  async onImport() {
    const initialState = {};
    const modalRef = this.bsModalService.show(ImportProfilesComponent, {
      initialState,
    });
    modalRef.content.closeSubject.subscribe(() => {
      this.loadProfiles();
      this.refresh.emit();
      modalRef.hide();
    });
  }
  

  private exportMappings(mappings2Export: Profile[]) {
    const json = JSON.stringify(mappings2Export, undefined, 2);
    const blob = new Blob([json]);
    saveAs(blob, `profiles.json`);
  }

  onRowClick(profile: Row) {
    console.log("Row :");
    this.updateProfile(profile as Profile);
  }

  onAddProfile() {
    this.addProfile();
  }

  async addProfile() {
    let ident = uuidCustom();
    let profile: Profile = {
      name: "Profile - " + ident.substring(0, 7),
      ident: ident,
      type: ProfileType.MODBUS,
      version: "1.0",
      controllers: [],
      lastUpdate: Date.now(),
    };
    this.profileToUpdate = profile;
    this.update = false;
    console.log("Add mappping to:", this.profiles);
    this.refresh.emit();
    this.showConfigProfile = true;
  }

  updateProfile(profile: Profile) {
   // create deep copy of existing profile, in case user cancels changes
   this.update = true;

    this.profileToUpdate = JSON.parse(JSON.stringify(profile));
    console.log("Editing profile", this.profileToUpdate);
    this.showConfigProfile = true;
  }

  copyProfile(profile: Profile) {
    // create deep copy of existing profile, in case user cancels changes
    this.profileToUpdate = JSON.parse(JSON.stringify(profile)) as Profile;
    this.profileToUpdate.name = this.profileToUpdate.name + " - Copy";
    this.profileToUpdate.ident = uuidCustom();
    this.profileToUpdate.id = this.profileToUpdate.ident;
    this.update = false;
    console.log("Copying profile", this.profileToUpdate);
    this.showConfigProfile = true;
  }

  async deleteProfileWithConfirmation(
    profile: Profile,
    confirmation: boolean = true,
    multiple: boolean = false
  ): Promise<boolean> {
    let result: boolean = false;
    console.log("Deleting profile before confirmation:", profile);
    if (confirmation) {
      const initialState = {
        title: multiple ? "Delete profiles" : "Delete profile",
        message: multiple
          ? "You are about to delete profiles. Do you want to proceed to delete ALL?"
          : "You are about to delete a profile. Do you want to proceed?",
        labels: {
          ok: "Delete",
          cancel: "Cancel",
        },
      };
      const confirmDeletionModalRef: BsModalRef = this.bsModalService.show(
        ConfirmationModalComponent,
        { initialState }
      );

      result = await confirmDeletionModalRef.content.closeSubject.toPromise();
      if (result) {
        console.log("DELETE profile:", profile, result);
        await this.deleteProfile(profile);
      } else {
        console.log("Canceled DELETE profile", profile, result);
      }
    } else {
      // await this.deleteProfile(profile);
    }
    return result;
  }

  async deleteProfile(profile: Profile) {
    try {
      await this.profileService.deleteProfile(profile.id);
      this.alertService.success(gettext("Profile deleted successfully"));
      this.loadProfiles();
      this.refresh.emit();
    } catch (error) {
      this.alertService.danger(gettext("Failed to delete profile:") + error);
    }
  }

  async loadProfiles(): Promise<void> {
    this.profiles = await this.profileService.loadProfiles();
  }

  async onCommitProfile(profile: Profile) {
    // test if new/updated profile was commited or if cancel
    profile.lastUpdate = Date.now();
    console.log("Update existing profile:", profile);
    try {
      if (this.update) {
        await this.profileService.updateProfile(profile);
        this.alertService.success(gettext("Profile updated successfully"));
      } else {
        await this.profileService.createProfile(profile);
        this.alertService.success(gettext("Profile created successfully"));
      }
      this.loadProfiles();
      this.refresh.emit();
    } catch (error) {
      this.alertService.danger(gettext("Failed to updated profile:") + error);
    }

    this.showConfigProfile = false;
  }

  private exportProfiles(profiles2Export: Profile[]) {
    const json = JSON.stringify(profiles2Export, undefined, 2);
    const blob = new Blob([json]);
    saveAs(blob, `profiles.json`);
  }

  async onExportAll() {
    this.exportProfiles(this.profiles);
  }

  async exportSingle(mappping: Profile) {
    const profiles2Export = [mappping];
    this.exportProfiles(profiles2Export);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
