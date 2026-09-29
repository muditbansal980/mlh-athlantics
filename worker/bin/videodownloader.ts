import fs from "fs";
import axios from "axios";
import path from "path";

export default async function downloadVideo(url: string): Promise<string> {
  const filePath = path.join("/tmp", `${Date.now()}.mp4`);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}