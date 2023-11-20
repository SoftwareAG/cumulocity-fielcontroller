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
import { Injectable } from "@angular/core";
import {
  FetchClient,
  InventoryService,
  QueriesUtil,
} from "@c8y/client";
import * as _ from "lodash";
import { BehaviorSubject } from "rxjs";
import { ProfileType, PROFILE_FRAGMENT, PROFILE_TYPE, Profile } from "./profile.model";

@Injectable({ providedIn: "root" })
export class ProfileService {
  constructor(
    private inventory: InventoryService, 
    private client: FetchClient
  ) {
    this.queriesUtil = new QueriesUtil();
  }

  queriesUtil: QueriesUtil;
  private reload$: BehaviorSubject<void> = new BehaviorSubject(null);
  public async loadProfiles(): Promise<Profile[]> {
    let result: Profile[] = [];

    const filter: object = {
      pageSize: 100,
      withTotalPages: true,
    };

   let  query : any = { type: PROFILE_TYPE};

    let data = (await this.inventory.listQuery(query, filter)).data;

    data.forEach((p) =>
      result.push({
        ...p[PROFILE_FRAGMENT],
        id: p.id,
      })
    );
    return result;
  }

  reloadProfiles() {
    this.reload$.next();
  }

  listToReload(): BehaviorSubject<void> {
    return this.reload$;
  }

  async saveProfiles(profiles: Profile[]): Promise<void> {
    profiles.forEach((p) => {
      this.inventory.update({
        c8y_custom_fieldbusProfile: p,
        id: p.id,
      });
    });
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    const {res, data} = await this.inventory.update({
      c8y_custom_fieldbusProfile: profile,
      name: profile.name,
      id: profile.id,
    });
    let result : Profile = data[PROFILE_FRAGMENT];
    return result;
  }

  async deleteProfile(id: string): Promise<string> {
    const {res, data} = await this.inventory.delete(id)
    return id;
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const {res, data} = await this.inventory.create({
      c8y_custom_fieldbusProfile: profile,
      name: profile.name,
      type: PROFILE_TYPE,
    });
    let result : Profile = data[PROFILE_FRAGMENT];
    result.id = data.id;
    await this.inventory.update({
      c8y_custom_fieldbusProfile: result,
      id: result.id,
    });
    return result;
  }

}
