import { IOrg } from "./org.dto";


export interface IPatient {
  id: string;
  org_id: string;
  org: IOrg;
  name: string;
  primaryAddress: string;
  createdAt: string;
  updatedAt: string;
}