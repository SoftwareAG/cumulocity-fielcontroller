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
import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AlertService,
  DropAreaComponent,
  ModalLabels,
} from "@c8y/ngx-components";
import { BehaviorSubject, Subject } from "rxjs";
import { ProfileService } from "../share/profile.service";
import { Profile, uuidCustom } from "../share/profile.model";

@Component({
  selector: "d11r-Profile-import-extension",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.style.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ImportProfilesComponent {
  @ViewChild(DropAreaComponent) dropAreaComponent;
  private importCanceled: boolean = false;
  progress$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  isLoading: boolean;
  isAppCreated: boolean;
  errorMessage: string;
  closeSubject: Subject<boolean> = new Subject();
  labels: ModalLabels = { cancel: "Cancel", ok: "Done" };

  constructor(
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  onFileDroppedEvent(event) {
    if (event && event.length > 0) {
      const file = event[0].file;
      this.onFile(file);
    }
  }

  async onFile(file: File) {
    this.isLoading = true;
    this.errorMessage = null;
    this.progress$.next(0);
    const ms = await file.text();
    const profiles: Profile[] = JSON.parse(ms);
    const countProfiles = profiles.length;
    let errors = [];
    profiles.forEach((p, i) => {
      try {
        p.ident = uuidCustom();
        p.lastUpdate = Date.now();
        this.profileService.createProfile(p);
        this.progress$.next((100 * i) / countProfiles);
      } catch (ex) {
        this.errorMessage = `Failed to import profiles: ${i}`;
        errors.push(this.errorMessage);
        this.alertService.warning(ex);
      }
    });
    this.isAppCreated = true;
    this.progress$.next(100);
    this.isLoading = false;
  }

  onDismiss(event) {
    this.cancelFileUpload();
    this.closeSubject.next(true);
    this.closeSubject.complete();
  }

  onDone(event) {
    this.closeSubject.next(true);
    this.closeSubject.complete();
  }

  private cancelFileUpload() {
    this.importCanceled = true;
  }
}
