import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Supabase client (service role key, safe in backend scripts)
const supabase = createClient(
  "https://rgyprufabmyurlbtzrbq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJneXBydWZhYm15dXJsYnR6cmJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxMTk0MywiZXhwIjoyMDcxNzg3OTQzfQ.pKoG__E_0YSgXyS8Saue8U_-S2pXOs-d3PVm1hRbfcI" // ⚠️ keep using service_role
);

// Local paths
const SONGS_FOLDER = "./bulk_upload/Songs/";
const IMAGES_FOLDER = "./bulk_upload/Images/";

// Your Supabase user_id (hardcode this once)
const USER_ID = "b400af3b-ac56-4450-aeeb-f256d9ceb08c";

// Upload file helper
async function uploadFile(bucket: string, localPath: string, fileName: string) {
  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️ File not found: ${localPath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".mp3": "audio/mpeg",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, { upsert: true, contentType });

  if (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }

  return data.path;
}

async function uploadAllSongs() {
  const songFiles = fs.readdirSync(SONGS_FOLDER).filter(f => f.endsWith(".mp3"));

  for (const songFile of songFiles) {
    const baseName = path.parse(songFile).name;
    const imageFile = baseName + ".jpg"; // 👈 must match exactly

    console.log(`🎵 Processing song: ${songFile} with cover: ${imageFile}`);

    const uploadedSong = await uploadFile("songs", path.join(SONGS_FOLDER, songFile), songFile);
    const uploadedImage = await uploadFile("images", path.join(IMAGES_FOLDER, imageFile), imageFile);

    if (!uploadedSong || !uploadedImage) {
      console.warn(`⚠️ Skipping ${songFile} due to upload failure.`);
      continue;
    }

    // Extract artist + title
    let author = "Unknown";
    let title = baseName;
    const splitIndex = baseName.indexOf(" - ");
    if (splitIndex !== -1) {
      author = baseName.slice(0, splitIndex).trim();
      title = baseName.slice(splitIndex + 3).trim();
    }

    // Insert into DB
    const { error } = await supabase.from("songs").insert({
      title,
      author,
      song_path: uploadedSong,
      image_path: uploadedImage,
      user_id: USER_ID, // ✅ hardcoded user_id
    });

    if (error) {
      console.error(`❌ Error inserting DB row for ${songFile}:`, error.message);
    } else {
      console.log(`✅ Successfully uploaded ${songFile} with author "${author}"`);
    }
  }

  console.log("🎉 All songs processed!");
}

uploadAllSongs();
