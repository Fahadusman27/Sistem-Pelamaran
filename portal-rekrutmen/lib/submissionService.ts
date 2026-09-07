import { supabase } from "./supabaseClient";

export interface SubmissionPayload {
  applicant_name: string;
  email: string;
  department: string;
  pdf_file_path?: string;
  pdf_url?: string;
}

export interface SubmissionResponse {
  success: boolean;
  status: "Terkirim" | "Gagal" | "Reject" | "Approve";
  message: string;
  data?: {
    id: string;
    applicant_name: string;
    email: string;
    department: string;
    status: string;
    pdf_url?: string;
    created_at: string;
  };
}

/**
 * Mengunggah Blob PDF lamaran langsung ke Supabase Storage (bucket: 'resumes').
 * Mengembalikan Public URL dari file yang diunggah.
 */
export async function uploadPdfToSupabase(
  pdfBlob: Blob,
  applicantName: string
): Promise<string> {
  const sanitizedName = applicantName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .slice(0, 30);
  const timestamp = Date.now();
  const fileName = `${sanitizedName || "pelamar"}_${timestamp}.pdf`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, pdfBlob, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase Storage Error:", uploadError);
    throw new Error(
      `Gagal mengunggah file PDF ke Supabase Storage: ${uploadError.message}`
    );
  }

  // Dapatkan Public URL
  const { data: publicUrlData } = supabase.storage
    .from("resumes")
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Gagal memperoleh Public URL dari Supabase Storage");
  }

  return publicUrlData.publicUrl;
}

/**
 * Mengirim data lamaran ke Golang Backend API (POST /api/applications).
 */
export async function submitApplicationToBackend(
  payload: SubmissionPayload
): Promise<SubmissionResponse> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Susun payload dengan key 'pdf_file_path' sesuai schema database MySQL
  const resolvedPdfPath = payload.pdf_file_path || payload.pdf_url || "";
  const requestBody = {
    applicant_name: payload.applicant_name,
    email: payload.email,
    department: payload.department,
    pdf_file_path: resolvedPdfPath,
    pdf_url: resolvedPdfPath,
  };

  const res = await fetch(`${backendUrl}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ Krusial: Mengirim HttpOnly Cookie (gk_session) untuk melewati Gatekeeper middleware
    body: JSON.stringify(requestBody),
  });

  // Jika respons dari Golang bernilai false / bukan 2xx
  if (!res.ok) {
    const errorDetails = await res.text();
    console.error("Backend Error Details:", errorDetails);

    let errorMsg = "Gagal menyimpan lamaran ke database server";
    try {
      const parsed = JSON.parse(errorDetails);
      if (res.status === 401 || parsed.code === "CAPTCHA_REQUIRED") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("gk_captcha_expired"));
        }
      }
      if (parsed.message) {
        errorMsg = parsed.message;
      } else if (parsed.error) {
        errorMsg = parsed.error;
      }
    } catch {
      if (res.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gk_captcha_expired"));
      }
      if (errorDetails) {
        errorMsg = `Server error (${res.status}): ${errorDetails}`;
      }
    }

    throw new Error(errorMsg);
  }

  const resJson: SubmissionResponse = await res.json();

  if (!resJson.success) {
    throw new Error(
      resJson.message || "Gagal menyimpan lamaran ke database server"
    );
  }

  return resJson;
}
