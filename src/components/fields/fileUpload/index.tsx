import React, { useState, useEffect } from "react";
import { Modal, Upload, message } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd";
import { FieldProps } from "formik";
import axios from "axios";
import { UploadImagePlus } from "assets/images/icons";
import { storage } from "services";

type FileType = File;

// Base64ga o'girish uchun utility function
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface Props extends FieldProps {
  label?: string;
  className?: string;
  errorMessage?: string;
  limit?: number;
  isVideo?: boolean;
  onSuccess?: () => void;
  accept?: string;
}

const FileUploader: React.FC<Props> = ({
  form: { setFieldValue },
  field: { name, value },
  className,
  label,
  limit = 1,
  isVideo = false,
  onSuccess = () => {},
  accept,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initial value bo'lsa uni fileList ga set qilish
  useEffect(() => {
    if (value?.url) {
      setFileList([
        {
          uid: value.name || "-1",
          name: value.name || "file",
          status: "done",
          url: value.url,
        },
      ]);
    }
  }, [value]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = async ({
    file,
    onSuccess: uploadSuccess,
    onError,
  }: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

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
        isVideo
          ? setFieldValue(name, fileData.url.toString())
          : setFieldValue(name, { url: fileData.url, id: fileData.name });
        message.success("File muvaffaqiyatli yuklandi");
        uploadSuccess();
        onSuccess();
      }
    } catch (error) {
      console.error("File yuklashda xatolik:", error);
      message.error("File yuklanmadi");
      onError(error);
    }
  };

  const uploadButton = (
    <div className={`upload-button ${isVideo ? "video-upload" : ""}`}>
      {isVideo ? (
        <div className="flex flex-col items-center justify-center cursor-pointer border border-[#d9d9d9] rounded-[8px] w-[102px] h-[102px]">
          <VideoCameraOutlined className="text-lg" />
          <span className="mt-1 text-xs">Video yuklash</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <UploadImagePlus />
          <div className="mt-2">Rasm qo'shish</div>
        </div>
      )}
    </div>
  );

  return (
    <div className={className + " default-file-upload"}>
      {label && <div className="mb-2">{label}</div>}
      <Upload
        listType={isVideo ? "text" : "picture-card"}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        accept={accept || (isVideo ? "video/*" : "image/*")}
        maxCount={limit}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        {isVideo ? (
          <video controls style={{ width: "100%" }} src={previewImage} />
        ) : (
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        )}
      </Modal>
    </div>
  );
};

export default FileUploader;
