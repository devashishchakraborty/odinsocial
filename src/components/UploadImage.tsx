import { useState, ChangeEvent, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CameraIcon } from "@heroicons/react/24/outline";
import defaultPicture from "../assets/defaultPicture.png";

const UploadImage = ({ url }: { url: string }) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState(url);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const { getAuthHeaders } = useContext(AuthContext);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setIsUploading(true);
    setError("");

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/image-upload`,
        {
          method: "POST",
          headers: { Authorization: headers.Authorization },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadUrl(data.url);
      setPreviewUrl("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-file"
        />
        <label
          htmlFor="image-file"
          className="absolute top-1/2 left-1/2 z-1 -translate-1/2 cursor-pointer rounded-full bg-gray-400/50 p-2 font-bold hover:bg-gray-400/75"
        >
          <CameraIcon className="h-8 w-8 text-white" />
        </label>
        <img
          src={uploadUrl || defaultPicture}
          alt="Upload"
          className="h-32 w-32 rounded-full border-2 border-gray-400 object-cover"
        />
      </div>
      {previewUrl.length > 0 && (
        <div className="absolute top-0 z-1 flex flex-col items-center gap-4 rounded-sm border-2 border-gray-400 bg-white p-4">
          <div className="text-xl font-bold text-sky-900">Image Preview</div>
          <img
            className="h-128 w-128 object-contain"
            src={previewUrl}
            alt="Preview"
          />
          <div className="flex gap-4">
            <button
              type="reset"
              className="flex cursor-pointer items-center gap-2 rounded-4xl bg-gray-600 px-3 py-1 font-bold text-white hover:bg-gray-700 disabled:cursor-default disabled:bg-gray-400"
              onClick={() => {
                setPreviewUrl("");
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="cursor-pointer gap-2 rounded-4xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700 disabled:cursor-default disabled:bg-sky-300"
              disabled={isUploading}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default UploadImage;
