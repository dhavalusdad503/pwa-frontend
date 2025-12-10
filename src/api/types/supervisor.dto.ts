export interface VisitCardResponse {
  id: string;
  patient: { id: string; name: string };
  caregiver: { id: string; firstName: string; lastName: string };
  serviceType: string;
  submittedAt: string;
  createdAt: string;
}
