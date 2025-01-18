"use client"

import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import ImageKit from "imagekit";
import {
  IKImage,
  IKVideo,
  ImageKitProvider,
  IKUpload,
  ImageKitContext,
} from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";
import { FilePath } from "tailwindcss/types/config";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imageKit`)

    if(!response.ok){
      const errorText = await response.text()
      throw new Error(`request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const {signature, expire, token} = data

    return {token, expire, signature}
  } catch (error: any) {
    throw new Error(`authentication request failed: ${error.message}`)
  }
}

const ImageUpload = ({onFileChange}: {onFileChange: (filePath:string) => void}) => {

  const ikUploadref = useRef(null)
  const [file, setFile] = useState<{FilePath: string} | null>(null)

  const onError = (error:any) => {
    console.log(error);
    
    toast({
      title:"Image uploaded failed",
      description:'your image could not be uploaded',
      variant:'destructive'
    })
  }

  const onSuccess = (res:any) => {
    setFile(res)
    onFileChange(res.filePath)

    toast({
      title:"Image uploaded successfully",
      description:`${res.filePath} uploaded successfully`
    })
  }

  return <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
    <IKUpload
      className="hidden"
      ref={ikUploadref}
      onError={onError}
      onSuccess={onSuccess}
      fileName="test-upload.png"
    />

    <button className="upload-btn" onClick={(e) => {
      e.preventDefault();

      if(ikUploadref.current){
        //@ts-ignore
        ikUploadref.current?.click();
      }
    }}>
      <Image
        src="/icons/upload.svg"
        alt="upload-icon"
        width={20}
        height={20}
        className="object-contain"
      />

      <p className="text-base text-light-100">Upload a file</p>
      
      {file && <p className="upload-filename">{file.FilePath}</p>}
    </button>

    {file && (
      <IKImage
        alt={file.FilePath}
        path={file.FilePath}
        width={500}
        height={300}
      />
    )}
  </ImageKitProvider>;
};

export default ImageUpload;
