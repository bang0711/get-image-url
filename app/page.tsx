"use client";
import React, { useState } from "react";
import { CldImage } from "next-cloudinary";
import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";

type Props = {};

function HomePage({}: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const [isCopiedArray, setIsCopiedArray] = useState<boolean[]>([]);
  const handleImageUpload = (result: CldUploadWidgetResults) => {
    const info = result.info as object;
    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      setUrls((prevUrls) => [...prevUrls, url]);
      setIsCopiedArray((prevArray) => [...prevArray, false]);
    }
  };
  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setIsCopiedArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = true; // Set copied state to true for the specific URL
      return newArray;
    });
    setTimeout(() => {
      setIsCopiedArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = false; // Reset copied state to false after 1 second
        return newArray;
      });
    }, 1000);
  };
  const deleteImage = (index: number) => {
    setUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1); // Remove the URL at the specified index
      return newUrls;
    });

    setIsCopiedArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1); // Remove the copied state at the specified index
      return newArray;
    });
  };
  return (
    <div className="flex items-center justify-center flex-col gap-3 p-4">
      <CldUploadButton
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        className={`h-10 w-20 text-white bg-black rounded-md mt-4`}
        onUpload={handleImageUpload}
      >
        Upload
      </CldUploadButton>
      {urls.length > 0 && (
        <div>
          {urls.map((url, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 items-center justify-center"
            >
              <Image src={url} width={200} height={175} alt={url} />
              <div className="flex gap-2 items-center ">
                <p>{url}</p>
                {isCopiedArray[index] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    onClick={() => copyToClipboard(url, index)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                )}
              </div>
              <button
                onClick={() => deleteImage(index)}
                className="rounded-md bg-red-600 hover:bg-red-500 transition-all duration-300 px-3 py-1 text-white"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
