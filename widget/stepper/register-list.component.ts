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
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Controllers } from "../share/profile.model";

@Component({
  selector: "c8y-register-list",
  templateUrl: "register-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RegisterListComponent implements OnInit {
  @Input()
  controllers: Controllers;

  @Output() onSelect = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
    //console.log ("Managing controllers:", this.controllers);
  }

  onControllerSelect(index: number) {
    console.log("Selected controller:", index);
    this.onSelect.emit(index);
  }

  public onControllerDelete(index: number) {
    console.log("Delete controller:", index);
    this.onDelete.emit(index);
  }

  public onControllerUpdate(index: number) {
    console.log("Update controller:", index);
    this.onUpdate.emit(index);
  }
}
