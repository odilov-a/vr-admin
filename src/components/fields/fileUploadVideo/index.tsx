import React, { useState, useEffect } from "react";
import { FieldProps } from "formik";
import axios from "axios";
import { Modal, Spin } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { UploadImagePlus, UploadVideo } from "assets/images/icons";
import { useHooks } from "hooks";
import { storage } from "services";

interface FileData {
  url: string;
  id: string;
}

interface Props extends FieldProps {
  label?: string;
  className?: string;
  rootClassName?: string;
  accept?: string;
  placeholder?: string;
  subPlaceholder?: string;
  maxSize?: number;
  multiple?: boolean;
  isVideo?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  onChange?: (files: FileData[]) => void;
}

const FileUploader: React.FC<Props> = ({
  form: { setFieldValue },
  field: { name, value },
  className = "",
  rootClassName = "",
  label,
  accept,
  maxSize = 2,
  multiple = false,
  maxFiles = 5,
  placeholder = "Rasm/video qo'shish",
  subPlaceholder = "",
  isVideo = false,
  disabled = false,
  onChange,
}) => {
  const { t } = useHooks();
  const [files, setFiles] = useState<any>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileAccept = accept || (isVideo ? "video/*" : "image/*");

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setFiles(value);
      } else if (value.url && value.id) {
        setFiles([{ url: value.url, id: value.id }]);
      } else {
        setFiles([]);
      }
    } else {
      setFiles([]);
    }

    if (!multiple && value?.url) {
      setPreviewUrl(value.url);
    }
  }, [value, multiple]);

  const uploadFile = async (file: File): Promise<FileData | null> => {
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
        return { url: fileData.fileUrl, id: fileData.fileName };
      } else {
        setErrorMessage("Fayl yuklashda xatolik yuz berdi");
      }
    } catch (error) {
      setErrorMessage(
        "Fayl yuklashda server bilan bog'lanishda xatolik yuz berdi"
      );
    }
    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    event.stopPropagation();
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    setErrorMessage("");

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

    const updatedFiles = multiple
      ? [...files, ...validFiles]
      : validFiles[0]
      ? validFiles[0]
      : [];
    setFiles(updatedFiles);
    setFieldValue(name, updatedFiles);

    if (!multiple) {
      //@ts-ignore
      setPreviewUrl(updatedFiles.url);
    }

    if (onChange) {
      //@ts-ignore
      onChange(updatedFiles);
    }

    setLoading(false);
    event.target.value = "";
  };

  const handleDelete = (e: React.MouseEvent, index?: number) => {
    if (disabled) return;

    e.stopPropagation();
    e.preventDefault();

    const updatedFiles = [...files];
    if (multiple && typeof index === "number") {
      updatedFiles.splice(index, 1);
    } else {
      updatedFiles.length = 0;
    }

    setFiles(updatedFiles);
    setFieldValue(name, updatedFiles);
    if (!multiple) {
      setPreviewUrl(null);
    }

    if (onChange) {
      onChange(updatedFiles);
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

  const renderFilePreview = (file: FileData) => {
    if (isVideo) {
      return (
        <video
          src={file.url}
          controls
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }
    return (
      <img
        src={file.url}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  const renderSingleFileUploader = () => (
    <label
      className={`relative flex items-center justify-center w-40 h-40 border ${
        errorMessage ? "border-red-500" : "border-dashed border-gray-300"
      } rounded-lg cursor-pointer bg-gray-100 ${
        disabled ? "opacity-50 !cursor-not-allowed" : "hover:bg-gray-200"
      }`}
    >
      {loading ? (
        <Spin size="large" />
      ) : files.length > 0 ? (
        <div className="relative group w-full h-full">
          {renderFilePreview(files[0])}
          {!disabled && (
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
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center text-gray-500">
          {isVideo ? <UploadVideo /> : <UploadImagePlus />}
          <p className="text-sm font-medium mt-1">{t(placeholder)}</p>
          <p className="text-xs">{t(subPlaceholder)}</p>
        </div>
      )}
      <input
        type="file"
        accept={fileAccept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </label>
  );

  const renderMultipleFilesUploader = () => (
    <div className="flex flex-wrap">
      {/* @ts-ignore */}
      {files.map((file, index) => (
        <div
          key={file.id}
          className={`${className} relative group w-40 h-40 border ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } rounded-lg overflow-hidden mr-[15px]`}
        >
          {renderFilePreview(file)}
          {!disabled && (
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
          )}
        </div>
      ))}
      {files.length < maxFiles && (
        <label
          className={`flex flex-col items-center justify-center w-40 h-40 border ${
            errorMessage ? "border-red-500" : "border-dashed border-gray-300"
          } rounded-lg cursor-pointer bg-gray-100 ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
        >
          {loading ? (
            <Spin size="large" />
          ) : (
            <div className="flex flex-col items-center text-center text-gray-500">
              {isVideo ? <UploadVideo /> : <UploadImagePlus />}
              <p className="text-sm font-medium mt-[10px]">{t(placeholder)}</p>
            </div>
          )}
          <input
            type="file"
            accept={fileAccept}
            onChange={handleFileChange}
            className="hidden"
            multiple={true}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className={rootClassName + " file-uploader"}>
      {label && <div className="mb-2">{label}</div>}
      {multiple ? renderMultipleFilesUploader() : renderSingleFileUploader()}
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1 max-w-[160px]">
          {errorMessage}
        </p>
      )}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        width={720}
      >
        {multiple ? (
          previewIndex >= 0 && previewIndex < files.length ? (
            isVideo ? (
              <video
                src={files[previewIndex].url}
                controls
                autoPlay
                muted
                playsInline
                className="w-full h-auto rounded-md"
              />
            ) : (
              <img
                src={files[previewIndex].url}
                alt="Katta video"
                className="w-full h-auto rounded-md"
              />
            )
          ) : null
        ) : files[0] ? (
          isVideo ? (
            <video
              src={files[0].url}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-auto rounded-md"
            />
          ) : (
            <img
              src={files[0].url}
              alt="Katta video"
              className="w-full h-auto rounded-md"
            />
          )
        ) : null}
      </Modal>
    </div>
  );
};

export default FileUploader;
