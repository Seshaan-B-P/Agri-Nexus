import { useRef } from "react";

function ImageUploader({ image, setImage, preview, setPreview }) {
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <label className="block text-lg font-semibold mb-4">
                Upload Crop Leaf Image
            </label>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

            <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg"
            >
                Choose Image
            </button>

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-5 rounded-lg h-72 w-full object-cover border"
                />
            )}
        </div>
    );
}

export default ImageUploader;