import React, { useState, useEffect } from "react";
import { FieldProps } from "formik";
import axios from "axios";
import { Modal } from "antd";
import { storage } from "services";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface FileData {
  url: string;
  id: string;
}

interface Props extends FieldProps {
  label?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // Maksimal file hajmi (MB)
  multiple?: boolean; // Ko'p fayllarni yuklash
  maxFiles?: number; // Maksimal fayllar soni
}

const FileUploader: React.FC<Props> = ({
  form: { setFieldValue },
  field: { name, value },
  className,
  label,
  accept = "image/*",
  maxSize = 2, // 2MB default
  multiple = false, // Default holatda bitta fayl
  maxFiles = 5, // Maksimal 5 ta fayl
}) => {
  // Bitta fayl uchun va ko'p fayllar uchun holatlarni boshqarish
  const [files, setFiles] = useState<FileData[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Eski va yangi formatlarni birlashtirish
  useEffect(() => {
    if (multiple) {
      // Ko'p fayllar rejimida
      if (Array.isArray(value)) {
        setFiles(value);
      } else if (value === null || value === undefined) {
        setFiles([]);
      }
    } else {
      // Yakka fayl rejimi (eski format)
      if (value?.url) {
        setPreviewUrl(value.url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [value, multiple]);

  const uploadFile = async (file: File): Promise<FileData | null> => {
    // File hajmini tekshirish
    if (file.size > maxSize * 1024 * 1024) {
      setErrorMessage(`Fayl ${maxSize} MB dan katta bo'lishi mumkin emas`);
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API_FILE_UPLOAD}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storage.get("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const fileData = response.data.data;
        return { url: fileData.url, id: fileData.name };
      }
    } catch (error) {
      console.error("Fayl yuklashda xatolik:", error);
    }

    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    setErrorMessage("");

    if (multiple) {
      // Ko'p fayllar rejimi
      const currentFilesCount = files.length;
      const newFilesToUpload = Array.from(selectedFiles).slice(
        0,
        maxFiles - currentFilesCount
      );

      if (currentFilesCount + selectedFiles.length > maxFiles) {
        setErrorMessage(`Maksimal ${maxFiles} ta fayl yuklash mumkin`);
      }

      const uploadPromises = newFilesToUpload.map((file) => uploadFile(file));
      const uploadedFiles = await Promise.all(uploadPromises);

      const validFiles = uploadedFiles.filter(
        (file) => file !== null
      ) as FileData[];
      const updatedFiles = [...files, ...validFiles];

      setFiles(updatedFiles);
      setFieldValue(name, updatedFiles);
    } else {
      // Yakka fayl rejimi (eski format)
      const file = selectedFiles[0];
      const uploadedFile = await uploadFile(file);

      if (uploadedFile) {
        setFieldValue(name, uploadedFile);
        setPreviewUrl(uploadedFile.url);
      }
    }

    setLoading(false);
    // Input qiymatini tozalash, keyingi yuklash uchun
    event.target.value = "";
  };

  const handleDelete = (e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    e.preventDefault();

    if (multiple && typeof index === "number") {
      // Ko'p fayllar rejimida
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      setFieldValue(name, updatedFiles.length > 0 ? updatedFiles : []);
    } else {
      // Yakka fayl rejimida
      setPreviewUrl(null);
      setFieldValue(name, null);
    }
  };

  const handlePreview = (e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    e.preventDefault();

    if (multiple && typeof index === "number") {
      setPreviewIndex(index);
    }

    setIsModalOpen(true);
  };

  // Yakka fayl rejimi uchun UI (eski format)
  const renderSingleFileUploader = () => (
    <label className="relative flex items-center justify-center w-40 h-40 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
      {previewUrl ? (
        <div className="relative group w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handlePreview}
              className="text-white p-2"
            >
              <EyeOutlined className="text-white text-xl cursor-pointer" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-white p-2"
            >
              <DeleteOutlined className="text-white text-xl cursor-pointer" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center text-gray-500">
          <span className="text-3xl">🖼️</span>
          <p className="text-sm font-medium mt-1">Rasm joylash</p>
          <p className="text-xs">
            Rasm {maxSize} MB dan katta bo'lmasligi kerak
          </p>
        </div>
      )}
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );

  // Ko'p fayllar rejimi uchun UI
  const renderMultipleFilesUploader = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {files.map((file, index) => (
        <div
          key={file.id}
          className="relative group w-40 h-40 border border-gray-300 rounded-lg overflow-hidden"
        >
          <img
            src={file.url}
            alt={`File ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => handlePreview(e, index)}
              className="text-white p-2"
            >
              <EyeOutlined className="text-white text-xl cursor-pointer" />
            </button>
            <button
              type="button"
              onClick={(e) => handleDelete(e, index)}
              className="text-white p-2"
            >
              <DeleteOutlined className="text-white text-xl cursor-pointer" />
            </button>
          </div>
        </div>
      ))}

      {/* Yangi fayl qo'shish tugmasi */}
      {files.length < maxFiles && (
        <label className="flex flex-col items-center justify-center w-40 h-40 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
          <div className="flex flex-col items-center text-center text-gray-500">
            <PlusOutlined className="text-2xl mb-2" />
            <p className="text-sm font-medium">Fayl qo'shish</p>
            <p className="text-xs">{maxFiles - files.length} ta fayl qoldi</p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            multiple={true}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className={className + " file-uploader"}>
      {label && <div className="mb-2">{label}</div>}

      {multiple ? renderMultipleFilesUploader() : renderSingleFileUploader()}

      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}

      {/* Modal - katta rasmni ko'rsatish */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        {multiple ? (
          previewIndex >= 0 && previewIndex < files.length ? (
            <img
              src={files[previewIndex].url}
              alt="Katta rasm"
              className="w-full h-auto"
            />
          ) : null
        ) : (
          <img
            src={previewUrl || ""}
            alt="Katta rasm"
            className="w-full h-auto"
          />
        )}
      </Modal>
    </div>
  );
};

export default FileUploader;
