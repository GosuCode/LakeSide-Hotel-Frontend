import { Cloudinary } from "cloudinary";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  },
});

export default cloudinary;
