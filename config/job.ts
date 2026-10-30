import { db } from "@/config/firebase";
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
export async function createJobRequest(
  jobData: Omit<JobRequest, "id" | "status" | "createdAt">
) {
  const docRef = await addDoc(collection(db, "jobRequests"), {
    ...jobData,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// 2. Get incoming job requests for a specific artisan
export async function getArtisanJobRequests(artisanId: string): Promise<JobRequest[]> {
  if (!artisanId) return [];

  const q = query(
    collection(db, "jobRequests"),
    where("artisanId", "==", artisanId)
  );
  
  const querySnapshot = await getDocs(q);
  const jobs = querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<JobRequest, "id">),
  }));

  // Sort by date in memory (newest first) to avoid missing index errors
  return jobs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });
}

// 3. Get active bookings for a specific client
export async function getClientBookings(clientId: string): Promise<JobRequest[]> {
  if (!clientId) return [];

  const q = query(
    collection(db, "jobRequests"),
    where("clientId", "==", clientId)
  );

  const querySnapshot = await getDocs(q);
  const bookings = querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<JobRequest, "id">),
  }));

  return bookings.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });
}

// 4. Update job request status
export async function updateJobStatus(
  jobId: string, 
  status: "accepted" | "declined" | "completed"
) {
  const jobRef = doc(db, "jobRequests", jobId);
  await updateDoc(jobRef, { status });
}

// --- ARTISAN PROFILE TYPES & HELPERS ---

export interface ArtisanProfile {
  uid: string;
  fullName?: string;
  name?: string;
  category?: string;
  trade?: string;
  hourlyRate?: string;
  rate?: string;
  location?: string;
  bio?: string;
  image?: string;
  verified?: boolean;
  completedJobs?: number;
  rating?: number;
  reviewsCount?: number;
}

// 5. Fetch Artisan Profile by ID
export async function getArtisanProfile(artisanId: string): Promise<ArtisanProfile | null> {
  if (!artisanId) return null;
  const docRef = doc(db, "artisans", artisanId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as ArtisanProfile;
  }
  return null;
}

// 6. Create or Update Artisan Profile
export async function updateArtisanProfile(
  artisanId: string, 
  profileData: Partial<ArtisanProfile>
) {
  if (!artisanId) return;
  const docRef = doc(db, "artisans", artisanId);
  await setDoc(docRef, profileData, { merge: true });
}