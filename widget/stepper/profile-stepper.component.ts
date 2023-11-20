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
 * distributed under the License is distributed on an "AS IS" BASIS,
 * Unless required by applicable law or agreed to in writing, software
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @authors Christof Strack
 */
import { CdkStep } from "@angular/cdk/stepper";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import {  FormGroup } from "@angular/forms";
import { AlertService, C8yStepper, gettext } from "@c8y/ngx-components";
import * as _ from "lodash";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { BehaviorSubject, Subject } from "rxjs";
import { Profile, uuidCustom } from "../share/profile.model";
import { ProfileService } from "../share/profile.service";
import { ConfirmationModalComponent } from "../share/confirmation/confirmation-modal.component";
import { UpdateControllerComponent } from "./update-controller-modal.component";

@Component({
  selector: "c8y-profile-stepper",
  templateUrl: "profile-stepper.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ProfileStepperComponent implements OnInit {
  
  @Input() profile: Profile;
  @Input() profiles: Profile[];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onCommit = new EventEmitter<Profile>();

  selectedResult$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  propertyFormly: FormGroup = new FormGroup({});
  update: boolean;
  step: any;
  onDestroy$ = new Subject<void>();

  constructor(
    public bsModalService: BsModalService,
    public profileService: ProfileService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    console.log(
      "Profile to be updated:",
      this.profile
    );
  }

  async onCommitButton() {
    this.onCommit.emit(this.profile);
  }

  async onCancelButton() {
    this.onCancel.emit();
  }

  public async onStepChange(event): Promise<void> {
    console.log("OnStepChange", event);
  }

  public async onNextStep(event: {
    stepper: C8yStepper;
    step: CdkStep;
  }): Promise<void> {
    event.stepper.next();
  }

  public async onControllerDelete(index) {
    const initialState = {
      title: "Delete contoller",
      message: "You are about to delete a contoller. Do you want to proceed?",
      labels: {
        ok: "Delete",
        cancel: "Cancel",
      },
    };
    const confirmDeletionModalRef: BsModalRef = this.bsModalService.show(
      ConfirmationModalComponent,
      { initialState }
    );
    confirmDeletionModalRef.content.closeSubject.subscribe(
      async (result: boolean) => {
        console.log("Confirmation result:", result);
        if (!!result) {
          if (index < this.profile.controllers.length) {
            this.profile.controllers.splice(index, 1);
          }
          this.alertService.success(gettext("Deleted successful"));
        }
        confirmDeletionModalRef.hide();
      }
    );
  }

  public async onControllerSelect(index:number) {
    console.log("Selected controller:", this.profile.controllers[index]);
  }

  public onControllerUpdate(index: number) {
      console.log("Update selected controller", index);
      const initialState = {
        controller: _.clone(this.profile.controllers[index]),
        update: true
      };

      const modalRef = this.bsModalService.show(UpdateControllerComponent, {
        initialState,
      });
      modalRef.content.closeSubject.subscribe((updatedContoller) => {
        console.log("Controller after edit:", updatedContoller);
        if (updatedContoller) {
          this.profile.controllers[index] = updatedContoller;
        }
      });
      console.log("Edited controller", this.profile.controllers.length);
  }

  public onControllerAdd() {
    console.log("Add controller");
    const ident = uuidCustom();
    const initialState = {
      controller: {ident: ident, name: `Controller - ${ident}`, },
      update: true
    };

    const modalRef = this.bsModalService.show(UpdateControllerComponent, {
      initialState,
    });
    modalRef.content.closeSubject.subscribe((updatedContoller) => {
      console.log("Controller after edit:", updatedContoller);

      if (updatedContoller) {
        this.profile.controllers.push(updatedContoller);
      }
    });
    console.log("Edited controller", this.profile.controllers.length);
}

}