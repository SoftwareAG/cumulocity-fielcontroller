import { Component, Input, OnInit } from "@angular/core";
import { ModalLabels } from "@c8y/ngx-components";
import { Controller, DataType, RegisterType } from "../share/profile.model";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: "c8y-update-profile-modal",
  template: `<c8y-modal
    title="Edit properties of profile"
    (onClose)="onSave($event)"
    (onDismiss)="onDismiss($event)"
    [labels]="labels"
    [headerClasses]="'modal-header dialog-header'"
  >
    <div>
      <formly-form
        [form]="controllerFormly"
        [fields]="controllerFormlyFields"
        [model]="controller"
      ></formly-form>
    </div>
  </c8y-modal>`,
})
export class UpdateControllerComponent implements OnInit {
  closeSubject: Subject<Controller> = new Subject();
  labels: ModalLabels = { ok: "Save", cancel: "Dismiss" };
  @Input() controller: Partial<Controller>;
  @Input() update: boolean;
  controllerFormlyFields: FormlyFieldConfig[];
  controllerFormly: FormGroup = new FormGroup({});

  ngOnInit(): void {
    console.log("Existing controller:", this.controller);
    this.controllerFormlyFields = [
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-lg-6",
            key: "type",
            type: "select",
            wrappers: ["c8y-form-field"],
            templateOptions: {
              label: "Controller type",
              options: Object.keys(RegisterType).map((key) => {
                return { label: key, value: key };
              }),
              disabled: !this.update,
              required: true,
            },
          },
        ],
      },
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-lg-12",
            key: "name",
            type: "input",
            templateOptions: {
              label: "Name",
            },
          },
        ],
      },
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-lg-6",
            key: "start_address",
            type: "input",
            templateOptions: {
              label: "Start Address",
              type: "number",
            },
          },
          {
            className: "col-lg-6",
            key: "count",
            type: "input",
            templateOptions: {
              label: "Count",
              type: "number",
            },
          },
        ],
      },
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-lg-6",
            key: "unit",
            type: "input",
            templateOptions: {
              label: "Unit",
            },
          },
          {
            className: "col-lg-6",
            key: "dataType",
            type: "select",
            wrappers: ["c8y-form-field"],
            templateOptions: {
              label: "Data type",
              options: Object.keys(DataType).map((key) => {
                return { label: key, value: key };
              }),
              required: true,
            },
          },
        ],
      },
    ];
  }

  onDismiss(event) {
    console.log("Dismiss");
    this.closeSubject.next(undefined);
  }

  onSave(event) {
    console.log("Save");
    this.closeSubject.next(this.controller as Controller);
  }
}
