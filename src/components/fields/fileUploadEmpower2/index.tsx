import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, UploadFile, UploadProps, message } from "antd";
import { FieldProps } from "formik";
import axios from "axios";
import { useHooks } from "hooks";
import { storage } from "services";

//@ts-ignore
type FileType = Parameters<UploadProps["beforeUpload"]>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface Props extends FieldProps<any, any> {
  label?: string;
  className?: string;
  errorMessage?: string | any;
  rootClassName?: string;
  limit: number;
  listType: any;
  onSuccess: () => void;
}

const ImageUpload: React.FC<Props> = ({
  form: { setFieldValue, values },
  field: { name },
  label,
  limit = 1,
  listType,
  onSuccess = () => {},
}) => {
  const { get } = useHooks();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>(
    get(values, name) || []
  );

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
    // setFileList(newFileList);
    setFieldValue(name, newFileList);
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    setFieldValue(name, newFileList);
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_FILE_UPLOAD}/tests/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storage.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const newFile: UploadFile = {
          uid: response.data.data.fileId,
          //@ts-ignore
          id: response.data.data.fileId,
          name: file.name,
          status: "done",
          url: response.data.data.fileUrl,
        };

        const newFileList = [...fileList, newFile];

        setFileList(newFileList);
        setFieldValue(name, newFileList);
        message.success("File uploaded successfully");
        onSuccess();
      } else {
        message.error("File upload failed");
        onError(response.statusText);
      }
    } catch (error) {
      console.error("File upload error:", error);
      message.error("File upload failed");
      onError(error || "File upload failed");
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType={listType}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        customRequest={customRequest}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;
