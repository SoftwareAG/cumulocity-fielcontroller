import { Component, Input, OnInit } from '@angular/core';
import { DataType, Profile, ProfileType } from '../share/profile.model';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: 'c8y-profile-properties',
  templateUrl: './profile-properties.component.html',
})
export class ProfilePropertiesComponent implements OnInit {
  @Input() profile: Profile;
  @Input() update: boolean;
  @Input() propertyFormly: FormGroup = new FormGroup({});
  propertyFormlyFields: FormlyFieldConfig[];
  constructor() { }

  ngOnInit() {
    this.propertyFormlyFields = [
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-lg-12",
            key: "type",
            type: "select",
            wrappers: ["c8y-form-field"],
            templateOptions: {
              label: "Controller type",
              options: Object.keys(ProfileType).map((key) => {
                return { label: key, value: key };
              }),
              disabled: this.update,
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
            className: "col-lg-12",
            key: "version",
            type: "input",
            templateOptions: {
              label: "Version",
            },
          },

        ],
      },
    ];
  }

}
