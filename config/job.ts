import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

// --- JOB REQUEST TYPES & HELPERS ---

export interface JobRequest {
  id?: string;
  clientId: string;
  clientName: string;
  artisanId: string;
  artisanName: string;
  service: string;
  location: string;
  date: string;
  proposedBudget: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt?: any;
}

// 1. Create a new job request
export async function createJobRequest(jobData: Omit<JobRequest, "id" | "status" | "createdAt">) {
  const docRef = await addDoc(collection(db, "jobRequests"), {
    ...jobData,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// 2. Get incoming job requests for a specific artisan
export async function getArtisanJobRequests(artisanId: string): Promise<JobRequest[]> {
  const q = query(
    collection(db, "jobRequests"),
    where("artisanId", "==", artisanId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JobRequest[];
}

// 3. Get active bookings for a specific client
export async function getClientBookings(clientId: string): Promise<JobRequest[]> {
  const q = query(
    collection(db, "jobRequests"),
    where("clientId", "==", clientId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JobRequest[];
}

// 4. Update job request status
export async function updateJobStatus(jobId: string, status: "accepted" | "declined" | "completed") {
  const jobRef = doc(db, "jobRequests", jobId);
  await updateDoc(jobRef, { status });
}

// --- ARTISAN PROFILE TYPES & HELPERS ---

export interface ArtisanProfile {
  uid: string;
  fullName: string;
  category: string;
  hourlyRate: string;
}

// 5. Fetch Artisan Profile by ID
export async function getArtisanProfile(artisanId: string): Promise<ArtisanProfile | null> {
  const docRef = doc(db, "artisans", artisanId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as ArtisanProfile;
  }
  return null;
}

// 6. Create or Update Artisan Profile
export async function updateArtisanProfile(artisanId: string, profileData: Partial<ArtisanProfile>) {
  const docRef = doc(db, "artisans", artisanId);
  await setDoc(docRef, profileData, { merge: true });
}