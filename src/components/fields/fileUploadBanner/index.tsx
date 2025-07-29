import React, { useState, useEffect } from 'react';
import { UploadFile, UploadProps, Modal, Upload, message } from 'antd';
import { FieldProps } from 'formik';
import axios from 'axios';
import { storage } from "services";

import { UploadImage } from 'assets/images/icons';

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
  onSuccess?: () => void;
  accept?: string;
}

const FileUploader: React.FC<Props> = ({
  form: { setFieldValue },
  field: { name, value },
  className,
  label,
  limit = 1,
  onSuccess = () => { },
  accept,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initial value bo'lsa uni fileList ga set qilish
  useEffect(() => {
    if (value?.url) {
      setFileList([
        {
          uid: value.name || '-1',
          name: value.name || 'file',
          status: 'done',
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
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = async ({ file, onSuccess: uploadSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API_FILE_UPLOAD}/files/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${storage.get("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const fileData = response.data.data;
        setFieldValue(name, { url: fileData.url, id: fileData.name });
        message.success('File muvaffaqiyatli yuklandi');
        uploadSuccess();
        onSuccess();
      }
    } catch (error) {
      console.error('File yuklashda xatolik:', error);
      message.error('File yuklanmadi');
      onError(error);
    }
  };

  const uploadButton = (
    <div className="upload-button">
      {/* <div className="flex flex-col items-center"> */}
      <UploadImage />
      <p className="upload-button__title">Rasm joylash</p>
      <p className="upload-button__subtitle">Rasm 2 mb dan katta bo‘lmasligi kerak</p>
      {/* </div> */}
    </div>
  );

  return (
    <div className={className}>
      {label && <div className="mb-2">{label}</div>}
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        accept={accept || ('image/*')}
        maxCount={limit}
        className='upload-banner'
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="preview"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default FileUploader;