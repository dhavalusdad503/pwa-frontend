import { IOrg } from "./org.dto";
import { IPatient } from "./patient.dto";
import { IUser } from "./user.dto";


export interface AllVisitsResponse {
  id: string;
  serviceType: string;
  startedAt: string;
  endedAt: string;
  submittedAt: string;
  notes: string;
  address: string;
  latitude: string;
  longitude: string;
  attestation: string;
  attestationName: string;
  clientPresent: string;
  followUp: string;
  medicationReviewed: string;
  safetyCheck: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  organization: IOrg;
  caregiver: IUser;
  patient: IPatient;
  supervisor?: IUser;
}